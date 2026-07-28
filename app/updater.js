"use strict";

/**
 * Full-app updater for HaxBall Space.
 * Flow: GET /updates/manifest → verify Ed25519 → download ZIP → SHA-256 →
 * extract → spawn apply-update.ps1 → quit.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const crypto = require("crypto");
const { spawn } = require("child_process");

function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (!value || typeof value !== "object") return value;
  var out = {};
  Object.keys(value)
    .sort()
    .forEach(function (k) {
      out[k] = sortKeysDeep(value[k]);
    });
  return out;
}

function canonicalJson(obj) {
  return JSON.stringify(sortKeysDeep(obj));
}

function compareSemver(a, b) {
  function parts(v) {
    return String(v || "0.0.0")
      .split(/[.-]/)
      .map(function (x) {
        var n = parseInt(x, 10);
        return isNaN(n) ? 0 : n;
      });
  }
  var aa = parts(a);
  var bb = parts(b);
  var len = Math.max(aa.length, bb.length);
  for (var i = 0; i < len; i++) {
    var x = aa[i] || 0;
    var y = bb[i] || 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}

function createUpdater(options) {
  options = options || {};
  var app = options.app;
  if (!app) throw new Error("updater requires options.app");
  var apiBase = String(options.apiBase || "").replace(/\/+$/, "");
  if (!apiBase) throw new Error("updater requires apiBase");
  var appVersion = String(options.appVersion || "0.0.0");
  var appBuild = Number(options.appBuild || 0) || 0;
  var channel = String(options.channel || "stable");
  var platform = String(options.platform || "win32-x64");
  var publicKeyPem = options.publicKeyPem || "";

  var state = {
    status: "idle", // idle|checking|available|downloading|ready|applying|error|uptodate
    error: null,
    remote: null,
    progress: { received: 0, total: 0, percent: 0 },
    downloadPath: null,
    extractDir: null,
    cancelRequested: false,
  };
  var activeReq = null;

  function getInstallRoot() {
    try {
      if (app.isPackaged) return path.dirname(process.execPath);
    } catch (e) {}
    return path.join(__dirname, "..", "..");
  }

  function loadPublicKey() {
    if (publicKeyPem && publicKeyPem.indexOf("BEGIN") !== -1) {
      return crypto.createPublicKey(publicKeyPem);
    }
    var p = path.join(__dirname, "update-public.pem");
    if (fs.existsSync(p))
      return crypto.createPublicKey(fs.readFileSync(p, "utf8"));
    return null;
  }

  function verifyManifest(manifest) {
    var key = loadPublicKey();
    if (!key) return { ok: false, error: "missing public key" };
    if (!manifest || !manifest.signature)
      return { ok: false, error: "unsigned manifest" };
    var copy = Object.assign({}, manifest);
    var sig = copy.signature;
    delete copy.signature;
    try {
      var ok = crypto.verify(
        null,
        Buffer.from(canonicalJson(copy), "utf8"),
        key,
        Buffer.from(sig, "base64"),
      );
      return ok ? { ok: true } : { ok: false, error: "bad signature" };
    } catch (e) {
      return { ok: false, error: "verify failed" };
    }
  }

  function httpJson(urlPath) {
    return new Promise(function (resolve, reject) {
      var u = new URL(apiBase + urlPath);
      var lib = u.protocol === "https:" ? https : http;
      var req = lib.request(
        {
          protocol: u.protocol,
          hostname: u.hostname,
          port: u.port || (u.protocol === "https:" ? 443 : 80),
          path: u.pathname + u.search,
          method: "GET",
          headers: { Accept: "application/json" },
          timeout: 15000,
        },
        function (res) {
          var chunks = [];
          res.on("data", function (c) {
            chunks.push(c);
          });
          res.on("end", function () {
            var text = Buffer.concat(chunks).toString("utf8");
            if (res.statusCode < 200 || res.statusCode >= 300) {
              reject(
                new Error("HTTP " + res.statusCode + " " + text.slice(0, 200)),
              );
              return;
            }
            try {
              resolve(JSON.parse(text));
            } catch (e) {
              reject(new Error("invalid json"));
            }
          });
        },
      );
      activeReq = req;
      req.on("error", reject);
      req.on("timeout", function () {
        req.destroy(new Error("timeout"));
      });
      req.end();
    });
  }

  function downloadFile(urlPathOrAbs, destPath, expectedSize) {
    return new Promise(function (resolve, reject) {
      var abs = /^https?:\/\//i.test(urlPathOrAbs)
        ? urlPathOrAbs
        : apiBase + urlPathOrAbs;
      var u = new URL(abs);
      var lib = u.protocol === "https:" ? https : http;
      state.progress = { received: 0, total: expectedSize || 0, percent: 0 };
      var file = fs.createWriteStream(destPath);
      var req = lib.get(
        {
          protocol: u.protocol,
          hostname: u.hostname,
          port: u.port || (u.protocol === "https:" ? 443 : 80),
          path: u.pathname + u.search,
          timeout: 120000,
        },
        function (res) {
          if (
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            file.close();
            try {
              fs.unlinkSync(destPath);
            } catch (e) {}
            downloadFile(res.headers.location, destPath, expectedSize).then(
              resolve,
              reject,
            );
            return;
          }
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error("download HTTP " + res.statusCode));
            return;
          }
          var total =
            Number(res.headers["content-length"] || expectedSize || 0) || 0;
          state.progress.total = total;
          res.on("data", function (chunk) {
            if (state.cancelRequested) {
              req.destroy();
              return;
            }
            state.progress.received += chunk.length;
            state.progress.percent = total
              ? Math.min(
                  99,
                  Math.round((state.progress.received / total) * 100),
                )
              : 0;
          });
          res.pipe(file);
          file.on("finish", function () {
            file.close(function () {
              resolve(destPath);
            });
          });
        },
      );
      activeReq = req;
      req.on("error", function (e) {
        try {
          file.close();
        } catch (e2) {}
        reject(e);
      });
      req.on("timeout", function () {
        req.destroy(new Error("timeout"));
      });
    });
  }

  function sha256File(filePath) {
    return new Promise(function (resolve, reject) {
      var h = crypto.createHash("sha256");
      var s = fs.createReadStream(filePath);
      s.on("data", function (c) {
        h.update(c);
      });
      s.on("error", reject);
      s.on("end", function () {
        resolve(h.digest("hex"));
      });
    });
  }

  function extractZip(zipPath, destDir) {
    return new Promise(function (resolve, reject) {
      if (fs.existsSync(destDir))
        fs.rmSync(destDir, { recursive: true, force: true });
      fs.mkdirSync(destDir, { recursive: true });
      var ps = spawn(
        "powershell.exe",
        [
          "-NoProfile",
          "-ExecutionPolicy",
          "Bypass",
          "-Command",
          "Expand-Archive -LiteralPath '" +
            zipPath.replace(/'/g, "''") +
            "' -DestinationPath '" +
            destDir.replace(/'/g, "''") +
            "' -Force",
        ],
        { windowsHide: true },
      );
      var err = "";
      ps.stderr.on("data", function (d) {
        err += String(d);
      });
      ps.on("close", function (code) {
        if (code === 0) resolve(destDir);
        else reject(new Error(err || "extract exit " + code));
      });
    });
  }

  async function checkForUpdate() {
    state.status = "checking";
    state.error = null;
    state.cancelRequested = false;
    try {
      var q =
        "/updates/manifest?platform=" +
        encodeURIComponent(platform) +
        "&channel=" +
        encodeURIComponent(channel);
      var manifest = await httpJson(q);
      var v = verifyManifest(manifest);
      if (!v.ok) throw new Error(v.error || "signature");
      var remoteVer = String(manifest.version || "");
      var remoteBuild = Number(manifest.build || 0) || 0;
      var newer =
        compareSemver(remoteVer, appVersion) > 0 ||
        (compareSemver(remoteVer, appVersion) === 0 && remoteBuild > appBuild);
      if (!newer) {
        state.status = "uptodate";
        state.remote = manifest;
        return getState();
      }
      if (compareSemver(remoteVer, appVersion) < 0) {
        throw new Error("refusing downgrade");
      }
      state.remote = manifest;
      state.status = "available";
      return getState();
    } catch (e) {
      state.status = "error";
      state.error = String(e && e.message ? e.message : e);
      return getState();
    }
  }

  async function downloadUpdate() {
    if (
      !state.remote ||
      !state.remote.artifacts ||
      !state.remote.artifacts[0]
    ) {
      throw new Error("no artifact");
    }
    var art = state.remote.artifacts[0];
    state.status = "downloading";
    state.error = null;
    state.cancelRequested = false;
    var tmpRoot = path.join(app.getPath("temp"), "space-update-" + Date.now());
    fs.mkdirSync(tmpRoot, { recursive: true });
    var zipPath = path.join(tmpRoot, art.name || "update.zip");
    var urlPath =
      "/updates/artifacts/" +
      platform +
      "/" +
      encodeURIComponent(state.remote.version) +
      "/" +
      encodeURIComponent(art.name);
    try {
      await downloadFile(urlPath, zipPath, art.size || 0);
      if (state.cancelRequested) throw new Error("cancelled");
      var hash = await sha256File(zipPath);
      if (
        String(hash).toLowerCase() !== String(art.sha256 || "").toLowerCase()
      ) {
        throw new Error("sha256 mismatch");
      }
      if (art.size && fs.statSync(zipPath).size !== Number(art.size)) {
        throw new Error("size mismatch");
      }
      var extractDir = path.join(tmpRoot, "extracted");
      await extractZip(zipPath, extractDir);
      state.downloadPath = zipPath;
      state.extractDir = extractDir;
      state.progress.percent = 100;
      state.status = "ready";
      return getState();
    } catch (e) {
      state.status = "error";
      state.error = String(e && e.message ? e.message : e);
      try {
        fs.rmSync(tmpRoot, { recursive: true, force: true });
      } catch (e2) {}
      throw e;
    }
  }

  function applyAndRestart() {
    if (state.status !== "ready" || !state.extractDir) {
      throw new Error("update not ready");
    }
    state.status = "applying";
    var installRoot = getInstallRoot();
    var exeName = path.basename(process.execPath);
    var scriptSrc = path.join(
      __dirname,
      "..",
      "..",
      "scripts",
      "apply-update.ps1",
    );
    // Packaged: script is copied next to updater resources.
    var candidates = [
      scriptSrc,
      path.join(__dirname, "apply-update.ps1"),
      path.join(installRoot, "scripts", "apply-update.ps1"),
      path.join(installRoot, "resources", "app", "apply-update.ps1"),
    ];
    var script = candidates.find(function (p) {
      return fs.existsSync(p);
    });
    if (!script) {
      // Write embedded fallback script into temp.
      script = path.join(app.getPath("temp"), "space-apply-update.ps1");
      fs.writeFileSync(
        script,
        fs.readFileSync(path.join(__dirname, "apply-update.ps1"), "utf8"),
      );
    }
    // Ensure apply script exists beside app for packaged builds.
    try {
      var bundled = path.join(__dirname, "apply-update.ps1");
      if (
        !fs.existsSync(bundled) &&
        fs.existsSync(
          path.join(__dirname, "..", "..", "scripts", "apply-update.ps1"),
        )
      ) {
        fs.copyFileSync(
          path.join(__dirname, "..", "..", "scripts", "apply-update.ps1"),
          bundled,
        );
        script = bundled;
      }
    } catch (eCopy) {}

    var backupDir = path.join(
      app.getPath("temp"),
      "space-update-backup-" + Date.now(),
    );
    var args = [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      script,
      "-SourceDir",
      state.extractDir,
      "-TargetDir",
      installRoot,
      "-ExeName",
      exeName,
      "-WaitPid",
      String(process.pid),
      "-BackupDir",
      backupDir,
    ];
    spawn("powershell.exe", args, {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    }).unref();
    setTimeout(function () {
      try {
        app.quit();
      } catch (e) {
        process.exit(0);
      }
    }, 400);
    return getState();
  }

  function cancel() {
    state.cancelRequested = true;
    try {
      if (activeReq) activeReq.destroy();
    } catch (e) {}
    if (state.status === "downloading") {
      state.status = "available";
      state.error = "cancelled";
    }
    return getState();
  }

  function getState() {
    return {
      status: state.status,
      error: state.error,
      progress: state.progress,
      local: { version: appVersion, build: appBuild },
      remote: state.remote
        ? {
            version: state.remote.version,
            build: state.remote.build,
            notes: state.remote.notes,
            mandatory: !!state.remote.mandatory,
          }
        : null,
    };
  }

  async function autoCheckAndDownload() {
    var st = await checkForUpdate();
    if (st.status === "available") {
      try {
        await downloadUpdate();
      } catch (e) {}
    }
    return getState();
  }

  return {
    checkForUpdate: checkForUpdate,
    downloadUpdate: downloadUpdate,
    applyAndRestart: applyAndRestart,
    cancel: cancel,
    getState: getState,
    autoCheckAndDownload: autoCheckAndDownload,
    getInstallRoot: getInstallRoot,
  };
}

module.exports = { createUpdater: createUpdater, compareSemver: compareSemver };
