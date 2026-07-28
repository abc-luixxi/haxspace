const {
  app,
  BrowserWindow,
  session,
  shell,
  ipcMain,
  protocol,
  globalShortcut,
  powerSaveBlocker,
} = require("electron");
const path = require("path");
const http = require("http");
const fs = require("fs");
const crypto = require("crypto");
var webFrameMain = null;
try {
  webFrameMain = require("electron").webFrameMain;
} catch (eWfm) {}
const STAR_VALIDATE_CREATE = process.env.STAR_VALIDATE_CREATE === "1";
const STAR_VALIDATE_OUT =
  process.env.STAR_VALIDATE_OUT ||
  path.join(require("os").tmpdir(), "star-validate-create.json");
function writeValidateResult(result) {
  try {
    fs.writeFileSync(
      STAR_VALIDATE_OUT,
      JSON.stringify(result, null, 2),
      "utf8",
    );
  } catch (e) {}
}

// Electron 25+: custom schemes must be privileged before app ready
try {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: "hxd",
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        bypassCSP: true,
        corsEnabled: true,
        stream: true,
      },
    },
  ]);
} catch (eScheme) {}
const __hxdNoop = () => {};
console.log = __hxdNoop;
console.warn = __hxdNoop;
console.error = __hxdNoop;
console.info = __hxdNoop;

// Versión del client = package.json (no Electron chrome version).
var APP_VERSION = "1.0.0";
var APP_CLIENT_BUILD = 1;
try {
  var _pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf8"),
  );
  if (_pkg && _pkg.version) {
    APP_VERSION = String(_pkg.version);
  }
  if (_pkg && _pkg.client_build != null) {
    APP_CLIENT_BUILD = Number(_pkg.client_build) || 1;
  }
} catch (ePkg) {
  try {
    APP_VERSION = app.getVersion() || APP_VERSION;
  } catch (eVer) {}
}

// Stable userData across versions so updates keep session / settings.
const userDataPath = path.join(app.getPath("appData"), "HaxBall Space");
app.setPath("userData", userDataPath);
function migrateLegacyVersionedProfileIfNeeded() {
  try {
    var legacy = path.join(
      app.getPath("appData"),
      "HaxBall Space",
      APP_VERSION,
    );
    if (legacy === userDataPath) {
      return;
    }
    if (!fs.existsSync(legacy)) {
      return;
    }
    var marker = path.join(userDataPath, ".space-profile-migrated");
    if (fs.existsSync(marker)) {
      return;
    }
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, {
        recursive: true,
      });
    }
    var names = fs.readdirSync(legacy);
    for (var i = 0; i < names.length; i++) {
      var src = path.join(legacy, names[i]);
      var dst = path.join(userDataPath, names[i]);
      if (!fs.existsSync(dst)) {
        try {
          fs.renameSync(src, dst);
        } catch (eMv) {
          try {
            fs.copyFileSync(src, dst);
          } catch (eCp) {}
        }
      }
    }
    fs.writeFileSync(marker, String(Date.now()), "utf8");
  } catch (eMig) {}
}
migrateLegacyVersionedProfileIfNeeded();
function logCrash(msg) {
  try {
    fs.appendFileSync(
      path.join(userDataPath, "crash.log"),
      new Date().toISOString() + " " + String(msg) + "\n",
      "utf8",
    );
  } catch (eLog) {}
}
function repairGpuCache() {
  var gpuCache = path.join(userDataPath, "GPUCache");
  try {
    if (fs.existsSync(gpuCache)) {
      var testFile = path.join(gpuCache, ".space-cache-test");
      fs.writeFileSync(testFile, "ok");
      fs.unlinkSync(testFile);
    }
  } catch (eGpu) {
    try {
      fs.rmSync(gpuCache, {
        recursive: true,
        force: true,
      });
    } catch (eRm) {}
  }
  try {
    var entries = fs.readdirSync(userDataPath);
    for (var ci = 0; ci < entries.length; ci++) {
      if (entries[ci].indexOf("old_GPUCache_") === 0) {
        try {
          fs.rmSync(path.join(userDataPath, entries[ci]), {
            recursive: true,
            force: true,
          });
        } catch (eOld) {}
      }
    }
  } catch (eList) {}
}
console.log("[APP] Versão:", APP_VERSION);
console.log("[APP] UserData Path:", userDataPath);

// ============================================
// PROTEÇÃO ANTI-TAMPERING (desativada para app extraído)
// ============================================
(function () {
  // Detecta se está rodando em ambiente de debug/análise
  function _0x1() {
    return false;
  } // Verifica integridade do processo
  function _0x2() {
    var suspicious = ["fiddler", "wireshark", "charles", "mitmproxy", "burp"];
    var title = (process.title || "").toLowerCase();
    for (var i = 0; i < suspicious.length; i++) {
      if (title.indexOf(suspicious[i]) !== -1) {
        return true;
      }
    }
    return false;
  } // Verifica se ASAR foi extraído — desativado: este build usa resources/app
  function _0x3() {
    return false;
  }
  setInterval(function () {
    if (_0x1() || _0x2() || _0x3()) {
      app.quit();
      process.exit(1);
    }
  }, 3000);
  if (_0x2() || _0x3()) {
    app.quit();
    process.exit(1);
  }
})();

const DISCORD_CLIENT_ID = "1528951523134931035";
const DISCORD_REDIRECT_URI = "http://localhost:5483/callback";
const DISCORD_SCOPES = "identify";
const LOCAL_DEV_MODE = true;
const DEV_GUEST_NICK = "Local Player";
const DEV_GUEST_PLUS = false;

function createLocalDevUser() {
  return {
    logged_in: true,
    discord_id: "local-user",
    nick: DEV_GUEST_NICK,
    username: DEV_GUEST_NICK,
    avatar: null,
    api_token: "local-session",
    access_token: null,
    is_plus: DEV_GUEST_PLUS,
  };
}
function ensureLocalDevUser() {
  if (LOCAL_DEV_MODE) {
    currentUser = createLocalDevUser();
  }
  return currentUser;
}
function logoutCurrentUser() {
  if (LOCAL_DEV_MODE) {
    return ensureLocalDevUser();
  }
  if (currentUser && currentUser.discord_id) {
    return removeAccount(currentUser.discord_id);
  }
  clearUserSession();
  return null;
}

var spaceUpdater = null;
function scheduleAutoUpdates() {
  if (!spaceUpdater) {
    return;
  }
  function runSilent() {
    try {
      spaceUpdater
        .autoCheckAndDownload()
        .then(function (st) {
          if (!st) {
            return;
          }
          // Mandatory updates apply as soon as download is ready.
          if (st.status === "ready" && st.remote && st.remote.mandatory) {
            try {
              spaceUpdater.applyAndRestart();
            } catch (eApply) {}
          }
        })
        .catch(function () {});
    } catch (eRun) {}
  }
  // First check almost immediately so the banner shows fast.
  setTimeout(runSilent, 1500);
  // Recheck every 45 minutes.
  setInterval(runSilent, 2700000);
}
let authWindow = null;
let currentUser = LOCAL_DEV_MODE ? createLocalDevUser() : null;
var discordPresence = null;
try {
  discordPresence = require("./discord-presence").createDiscordPresence({
    clientId: "1531429205697499349",
    largeImageKey: "logogrande",
    smallImageKey: "logochico",
    largeImageText: "discord.gg/spacehax",
    buttonLabel: "Discord",
    buttonUrl: "https://discord.gg/spacehax",
  });
} catch (eRpcInit) {
  discordPresence = null;
}
function setRpcActivity(data) {
  if (!discordPresence) {
    return;
  }
  try {
    var nick = currentUser && (currentUser.nick || currentUser.username);
    if (nick && data && !data.smallText) {
      data.smallText = nick;
    }
    discordPresence.setActivity(data);
  } catch (eSet) {}
}
function setRpcFromPresence(payload) {
  if (!discordPresence) {
    return;
  }
  try {
    payload = payload || {};
    if (!payload.small_text && currentUser) {
      payload.small_text = currentUser.nick || currentUser.username || "";
    }
    discordPresence.setFromPresencePayload(payload);
  } catch (eP) {}
}
function loadRpcConfigFromBackend() {
  return backendRequest("GET", "/rpc/config")
    .then(function (result) {
      if (!result || !result.json || !result.json.client_id) {
        return null;
      }
      if (discordPresence && discordPresence.applyConfig) {
        discordPresence.applyConfig(result.json);
      }
      return result.json;
    })
    .catch(function () {
      return null;
    });
}
function forwardPresenceToBackend(payload) {
  if (!currentUser || !currentUser.logged_in || !currentUser.api_token) {
    return;
  }
  payload = payload || {};
  backendRequest("POST", "/presence", {
    body: payload,
    headers: {
      Authorization: "Bearer " + currentUser.api_token,
    },
  })
    .then(function (result) {
      if (
        result &&
        result.json &&
        result.json.rpc &&
        discordPresence &&
        discordPresence.applyConfig
      ) {
        discordPresence.applyConfig(result.json.rpc);
      }
      if (result && result.json && result.json.presence) {
        setRpcFromPresence(result.json.presence);
      }
    })
    .catch(function () {});
}

// ============================================
// PERSISTÊNCIA DO LOGIN (multi-account)
// ============================================
function getUserDataPath() {
  return path.join(app.getPath("userData"), "user.dat");
}
function encryptJson(value) {
  var data = JSON.stringify(value);
  var key = crypto.createHash("sha256").update("hxd-session-key").digest();
  var iv = crypto.randomBytes(16);
  var cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  var encrypted = Buffer.concat([cipher.update(data, "utf8"), cipher.final()]);
  return Buffer.concat([iv, encrypted]).toString("base64");
}
function decryptJson(raw) {
  var buffer = Buffer.from(String(raw || ""), "base64");
  var iv = buffer.slice(0, 16);
  var encrypted = buffer.slice(16);
  var key = crypto.createHash("sha256").update("hxd-session-key").digest();
  var decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  var decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return JSON.parse(decrypted.toString("utf8"));
}
function emptyAccountsStore() {
  return {
    version: 2,
    active_discord_id: null,
    accounts: [],
  };
}
function normalizeAccount(user) {
  if (!user || !user.discord_id) {
    return null;
  }
  return {
    logged_in: true,
    discord_id: String(user.discord_id),
    nick: user.nick || user.username || "Player",
    username: user.username || user.nick || "player",
    avatar: user.avatar || null,
    access_token: user.access_token || null,
    api_token: user.api_token || null,
    is_plus: !!user.is_plus || !!user.isPlus,
  };
}
function publicAccount(user) {
  if (!user) {
    return null;
  }
  return {
    discord_id: String(user.discord_id),
    nick: user.nick,
    username: user.username,
    avatar: user.avatar || null,
    is_plus: !!user.is_plus,
  };
}
function loadAccountsStore() {
  try {
    var filePath = getUserDataPath();
    if (!fs.existsSync(filePath)) {
      return emptyAccountsStore();
    }
    var parsed = decryptJson(fs.readFileSync(filePath, "utf8"));
    if (parsed && Array.isArray(parsed.accounts)) {
      var store = {
        version: 2,
        active_discord_id: parsed.active_discord_id
          ? String(parsed.active_discord_id)
          : null,
        accounts: parsed.accounts.map(normalizeAccount).filter(Boolean),
      };
      if (!store.active_discord_id && store.accounts[0]) {
        store.active_discord_id = store.accounts[0].discord_id;
      }
      return store;
    }
    // Legacy single-session format
    var legacy = normalizeAccount(parsed);
    if (!legacy) {
      return emptyAccountsStore();
    }
    return {
      version: 2,
      active_discord_id: legacy.discord_id,
      accounts: [legacy],
    };
  } catch (e) {
    return emptyAccountsStore();
  }
}
function saveAccountsStore(store) {
  try {
    var next = store || emptyAccountsStore();
    next.version = 2;
    next.accounts = (next.accounts || []).map(normalizeAccount).filter(Boolean);
    if (next.active_discord_id) {
      var exists = next.accounts.some(function (acc) {
        return String(acc.discord_id) === String(next.active_discord_id);
      });
      if (!exists) {
        next.active_discord_id = next.accounts[0]
          ? next.accounts[0].discord_id
          : null;
      }
    } else if (next.accounts[0]) {
      next.active_discord_id = next.accounts[0].discord_id;
    }
    fs.writeFileSync(getUserDataPath(), encryptJson(next));
  } catch (e) {}
}
function getActiveAccount(store) {
  store = store || loadAccountsStore();
  if (!store.active_discord_id) {
    return null;
  }
  for (var i = 0; i < store.accounts.length; i++) {
    if (
      String(store.accounts[i].discord_id) === String(store.active_discord_id)
    ) {
      return store.accounts[i];
    }
  }
  return store.accounts[0] || null;
}
function upsertAccount(user) {
  var account = normalizeAccount(user);
  if (!account) {
    return null;
  }
  var store = loadAccountsStore();
  var found = false;
  for (var i = 0; i < store.accounts.length; i++) {
    if (String(store.accounts[i].discord_id) === account.discord_id) {
      store.accounts[i] = account;
      found = true;
      break;
    }
  }
  if (!found) {
    store.accounts.push(account);
  }
  store.active_discord_id = account.discord_id;
  saveAccountsStore(store);
  return account;
}
function switchActiveAccount(discordId) {
  var store = loadAccountsStore();
  var id = String(discordId || "");
  var match = null;
  for (var i = 0; i < store.accounts.length; i++) {
    if (String(store.accounts[i].discord_id) === id) {
      match = store.accounts[i];
      break;
    }
  }
  if (!match) {
    return null;
  }
  store.active_discord_id = id;
  saveAccountsStore(store);
  return match;
}
function removeAccount(discordId) {
  var store = loadAccountsStore();
  var id = String(discordId || "");
  store.accounts = store.accounts.filter(function (acc) {
    return String(acc.discord_id) !== id;
  });
  if (String(store.active_discord_id) === id) {
    store.active_discord_id = store.accounts[0]
      ? store.accounts[0].discord_id
      : null;
  }
  saveAccountsStore(store);
  return getActiveAccount(store);
}
function saveUserSession(user) {
  upsertAccount(user);
}
function loadUserSession() {
  return getActiveAccount(loadAccountsStore());
}
function clearUserSession() {
  try {
    var filePath = getUserDataPath();
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (e) {}
}
function listPublicAccounts() {
  if (LOCAL_DEV_MODE) {
    var localUser = createLocalDevUser();
    return {
      ok: true,
      active_discord_id: localUser.discord_id,
      accounts: [getPublicUserPayload(localUser)],
    };
  }
  var store = loadAccountsStore();
  return {
    ok: true,
    active_discord_id: store.active_discord_id,
    accounts: store.accounts.map(publicAccount),
  };
}

// ============================================
// PROTEÇÃO: Bloqueia flags de debug
// ============================================
const blockedArgs = [
  "--inspect",
  "--inspect-brk",
  "--remote-debugging-port",
  "--remote-debugging-address",
];
for (var i = 0; i < process.argv.length; i++) {
  for (var j = 0; j < blockedArgs.length; j++) {
    if (process.argv[i].indexOf(blockedArgs[j]) !== -1) {
      app.quit();
      process.exit(1);
    }
  }
}

// ============================================
// USER-AGENT LIMPIO (Cloudflare Turnstile)
// ============================================
// Electron mete "Electron/x" en el UA; Cloudflare lo marca como bot y el
// widget queda en caja gris sin poder verificar. Debe setearse antes de
// crear cualquier webContents.
(function () {
  var chromeVersion =
    (process.versions && process.versions.chrome) || "120.0.0.0";
  var cleanUA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/" +
    chromeVersion +
    " Safari/537.36";
  try {
    app.userAgentFallback = cleanUA;
  } catch (e) {}
  app.__hxdCleanUA = cleanUA;
})();

// ============================================
// FLAGS DE PERFORMANCE
// - Sin disable-gpu-vsync: era la causa principal de crash en Alt+Tab / diálogos.
// - Sin anti-backgrounding: al perder foco Chromium puede bajar el paint.
// - disable-frame-rate-limit se mantiene para no atar FPS al soft-cap de Chromium.
// ============================================
app.commandLine.appendSwitch("no-sandbox");
app.commandLine.appendSwitch("no-zygote");
app.commandLine.appendSwitch("disable-frame-rate-limit");
app.commandLine.appendSwitch("disable-gpu-process-crash-limit");
const SAFE_GRAPHICS =
  process.env.SPACE_DISABLE_GPU === "1" ||
  process.env.SPACE_SAFE_GFX === "1" ||
  LOCAL_DEV_MODE;
if (SAFE_GRAPHICS) {
  app.commandLine.appendSwitch("disable-gpu");
} else {
  try {
    app.commandLine.appendSwitch("use-angle", "d3d11");
    app.commandLine.appendSwitch("enable-gpu-rasterization");
    app.commandLine.appendSwitch("num-raster-threads", "4");
  } catch (eAngle) {}
}
app.commandLine.appendSwitch("disable-background-networking");
app.commandLine.appendSwitch("disable-component-update");
app.commandLine.appendSwitch("disable-domain-reliability");

// ============================================
// FIX CORS - Private Network Access + 3P cookies (Turnstile iframe)
// ============================================
app.commandLine.appendSwitch(
  "disable-features",
  "PrivateNetworkAccessSendPreflights,PrivateNetworkAccessRespectPreflightResults,BlockInsecurePrivateNetworkRequests,ThirdPartyStoragePartitioning",
);
let mainWindow = null;
let isLaunchingGame = false;
let launcherPhaseComplete = false;
let launcherNavToken = 0;
let rendererRecoverAttempts = 0;
const MAX_RENDERER_RECOVER = 3;
let server = null;
let tempExtPath = null;
let tempExtIsTemporary = false;
let gameplayPowerSaveId = null;
let decryptedGameCode = null; // Cache do código descriptografado
let currentZoomPercent = 100; // Controle manual do zoom em porcentagem
const PORT = 5483;
const SPOTIFY_REDIRECT_URI =
  "http://127.0.0.1:" + String(PORT) + "/spotify-callback";
const SPOTIFY_SCOPES =
  "user-read-currently-playing user-read-playback-state user-modify-playback-state";
var pendingSpotifyAuth = null;
var spotifyTokensCache = null;
function getSpotifyTokensPath() {
  return path.join(app.getPath("userData"), "spotify-tokens.json");
}
function loadSpotifyTokens() {
  if (spotifyTokensCache) {
    return spotifyTokensCache;
  }
  try {
    var raw = fs.readFileSync(getSpotifyTokensPath(), "utf8");
    var parsed = JSON.parse(raw);
    if (parsed && parsed.access_token) {
      spotifyTokensCache = parsed;
      return spotifyTokensCache;
    }
  } catch (e) {}
  spotifyTokensCache = null;
  return null;
}
function saveSpotifyTokens(tokens) {
  spotifyTokensCache = tokens || null;
  try {
    if (!tokens) {
      fs.unlinkSync(getSpotifyTokensPath());
      return;
    }
    fs.writeFileSync(getSpotifyTokensPath(), JSON.stringify(tokens), "utf8");
  } catch (e) {}
}
function spotifyBase64Url(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}
function spotifyFormRequest(urlStr, formBody) {
  return new Promise(function (resolve, reject) {
    var u = new URL(urlStr);
    var payload = formBody;
    var req = require("https").request(
      {
        hostname: u.hostname,
        port: 443,
        path: u.pathname + u.search,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(payload),
          Accept: "application/json",
        },
      },
      function (res) {
        var body = "";
        res.on("data", function (c) {
          body += c;
        });
        res.on("end", function () {
          var json = null;
          try {
            json = body ? JSON.parse(body) : {};
          } catch (e) {
            json = {
              error: "bad_json",
              raw: body,
            };
          }
          resolve({
            statusCode: res.statusCode || 500,
            json: json,
          });
        });
      },
    );
    req.on("error", reject);
    req.setTimeout(15000, function () {
      req.destroy();
      reject(new Error("spotify timeout"));
    });
    req.write(payload);
    req.end();
  });
}
function spotifyApiGet(apiPath, accessToken) {
  return spotifyApiRequest("GET", apiPath, accessToken);
}
function spotifyApiRequest(method, apiPath, accessToken, jsonBody) {
  return new Promise(function (resolve, reject) {
    var methodUpper = String(method || "GET").toUpperCase();
    var payload = undefined;
    // Explicit 4th arg: null => empty body (needed for Spotify play/pause PUT).
    if (arguments.length >= 4) {
      payload = jsonBody == null ? "" : JSON.stringify(jsonBody);
    }
    var headers = {
      Authorization: "Bearer " + accessToken,
      Accept: "application/json",
    };
    if (payload !== undefined) {
      if (payload !== "") {
        headers["Content-Type"] = "application/json";
      }
      headers["Content-Length"] = Buffer.byteLength(payload);
    }
    var req = require("https").request(
      {
        hostname: "api.spotify.com",
        port: 443,
        path: apiPath,
        method: methodUpper,
        headers: headers,
      },
      function (res) {
        var body = "";
        res.on("data", function (c) {
          body += c;
        });
        res.on("end", function () {
          var json = null;
          if (body) {
            try {
              json = JSON.parse(body);
            } catch (e) {
              json = null;
            }
          }
          resolve({
            statusCode: res.statusCode || 500,
            json: json,
            empty: !body,
          });
        });
      },
    );
    req.on("error", reject);
    req.setTimeout(12000, function () {
      req.destroy();
      reject(new Error("spotify api timeout"));
    });
    if (payload !== undefined) {
      req.write(payload);
    }
    req.end();
  });
}
function spotifyErrorInfo(result) {
  var reason = "";
  var message = "";
  try {
    if (result && result.json && result.json.error) {
      reason = String(result.json.error.reason || "");
      message = String(result.json.error.message || "");
    }
  } catch (e) {}
  return {
    status: result && result.statusCode ? result.statusCode : 0,
    reason: reason,
    message: message,
    error: reason || message || "failed",
  };
}

/** Pick an active Spotify device, or the first available one. */
function resolveSpotifyDeviceId(accessToken) {
  return spotifyApiGet("/v1/me/player/devices", accessToken)
    .then(function (result) {
      if (result.statusCode < 200 || result.statusCode >= 300 || !result.json) {
        return {
          deviceId: "",
          devices: [],
          error: spotifyErrorInfo(result),
        };
      }
      var devices = Array.isArray(result.json.devices)
        ? result.json.devices
        : [];
      var active = null;
      var first = null;
      for (var i = 0; i < devices.length; i++) {
        var d = devices[i];
        if (!d || !d.id) {
          continue;
        }
        if (!first) {
          first = d;
        }
        if (d.is_active) {
          active = d;
          break;
        }
      }
      var pick = active || first;
      return {
        deviceId: pick && pick.id ? String(pick.id) : "",
        devices: devices,
        error: null,
      };
    })
    .catch(function () {
      return {
        deviceId: "",
        devices: [],
        error: {
          error: "network",
        },
      };
    });
}
function withSpotifyDeviceQuery(apiPath, deviceId) {
  if (!deviceId) {
    return apiPath;
  }
  return (
    apiPath +
    (apiPath.indexOf("?") >= 0 ? "&" : "?") +
    "device_id=" +
    encodeURIComponent(deviceId)
  );
}
function spotifyHasControlScope(tokens) {
  var scope = String((tokens && tokens.scope) || "");
  return scope.indexOf("user-modify-playback-state") !== -1;
}
function ensureSpotifyAccessToken() {
  var tokens = loadSpotifyTokens();
  if (!tokens || !tokens.access_token) {
    return Promise.resolve(null);
  }
  var expiresAt = Number(tokens.expires_at || 0);
  if (expiresAt > Date.now() + 30000) {
    return Promise.resolve(tokens);
  }
  if (!tokens.refresh_token || !tokens.client_id) {
    return Promise.resolve(tokens);
  }
  var body =
    "grant_type=refresh_token&refresh_token=" +
    encodeURIComponent(tokens.refresh_token) +
    "&client_id=" +
    encodeURIComponent(tokens.client_id);
  return spotifyFormRequest("https://accounts.spotify.com/api/token", body)
    .then(function (result) {
      if (
        result.statusCode < 200 ||
        result.statusCode >= 300 ||
        !result.json ||
        !result.json.access_token
      ) {
        return tokens;
      }
      var next = {
        client_id: tokens.client_id,
        access_token: result.json.access_token,
        refresh_token: result.json.refresh_token || tokens.refresh_token,
        expires_at: Date.now() + Number(result.json.expires_in || 3600) * 1000,
        scope: result.json.scope || tokens.scope || "",
      };
      saveSpotifyTokens(next);
      return next;
    })
    .catch(function () {
      return tokens;
    });
}
function getLauncherPageUrl() {
  return "http://127.0.0.1:" + String(PORT) + "/launcher";
}
function getMediaDir() {
  return path.join(app.getPath("userData"), "media");
}
function saveLocalMedia(kind, dataUrl) {
  var key = kind === "ball" ? "ball" : "avatar";
  var dir = getMediaDir();
  var binPath = path.join(dir, key + ".bin");
  var metaPath = path.join(dir, key + ".meta.json");
  try {
    if (!dataUrl) {
      try {
        fs.unlinkSync(binPath);
      } catch (e1) {}
      try {
        fs.unlinkSync(metaPath);
      } catch (e2) {}
      return {
        ok: true,
        cleared: true,
      };
    }
    var raw = String(dataUrl);
    var m = raw.match(/^data:([^;]+);base64,(.+)$/i);
    if (!m) {
      return {
        ok: false,
        error: "bad_data",
      };
    }
    var mime = String(m[1] || "application/octet-stream");
    var buf = Buffer.from(m[2], "base64");
    if (!buf.length) {
      return {
        ok: false,
        error: "empty",
      };
    }
    // Soft cap ~2.5MB decoded to avoid filling disk / freezing UI.
    if (buf.length > 2500000) {
      return {
        ok: false,
        error: "too_large",
      };
    }
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    fs.writeFileSync(binPath, buf);
    fs.writeFileSync(
      metaPath,
      JSON.stringify({
        mime: mime,
        updatedAt: Date.now(),
        bytes: buf.length,
      }),
      "utf8",
    );
    return {
      ok: true,
      bytes: buf.length,
      mime: mime,
    };
  } catch (eSave) {
    return {
      ok: false,
      error: String((eSave && eSave.message) || eSave),
    };
  }
}
function loadLocalMedia(kind) {
  var key = kind === "ball" ? "ball" : "avatar";
  var binPath = path.join(getMediaDir(), key + ".bin");
  var metaPath = path.join(getMediaDir(), key + ".meta.json");
  try {
    if (!fs.existsSync(binPath)) {
      return {
        ok: true,
        dataUrl: "",
      };
    }
    var buf = fs.readFileSync(binPath);
    var mime = "application/octet-stream";
    try {
      if (fs.existsSync(metaPath)) {
        var meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
        if (meta && meta.mime) {
          mime = String(meta.mime);
        }
      }
    } catch (eMeta) {}
    return {
      ok: true,
      dataUrl: "data:" + mime + ";base64," + buf.toString("base64"),
      mime: mime,
      bytes: buf.length,
    };
  } catch (eLoad) {
    return {
      ok: false,
      dataUrl: "",
      error: String((eLoad && eLoad.message) || eLoad),
    };
  }
}
function getRenderLauncherPage() {
  try {
    var modPath = require.resolve("./launcher-page.js");
    delete require.cache[modPath];
  } catch (eCache) {}
  return require("./launcher-page").renderLauncherPage;
}
function buildLauncherHtml() {
  return getRenderLauncherPage()({
    version: APP_VERSION,
    port: PORT,
    brand: "Space",
    user: currentUser && currentUser.logged_in ? currentUser : null,
  });
}
function setLauncherWindowConstraints(launcherMode) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  try {
    mainWindow.setMaximizable(!launcherMode);
    if (launcherMode && mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    }
    if (launcherMode) {
      try {
        if (mainWindow.isFullScreen()) {
          mainWindow.setFullScreen(false);
        }
      } catch (eFsOff) {}
      mainWindow.setMinimumSize(1200, 700);
      mainWindow.setSize(1440, 860);
      mainWindow.center();
    } else {
      mainWindow.setMinimumSize(800, 500);
    }
  } catch (eWin) {}
}
function enterGameWindowMode() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  try {
    mainWindow.setMaximizable(true);
    mainWindow.setMinimumSize(800, 500);
    if (!mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(true);
    }
  } catch (eGame) {}
}
function showLauncherInMainWindow(forceReload) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return Promise.resolve();
  }
  if (launcherPhaseComplete) {
    return Promise.resolve();
  }
  setLauncherWindowConstraints(true);
  setRpcActivity({
    details:
      (discordPresence &&
        discordPresence.detailsLauncher &&
        discordPresence.detailsLauncher()) ||
      "En el launcher",
    state: "discord.gg/spacehax",
    smallText:
      (currentUser && (currentUser.nick || currentUser.username)) || "",
    resetTimer: true,
  });
  var token = ++launcherNavToken;
  var target = getLauncherPageUrl();
  if (forceReload) {
    target += "?_=" + String(Date.now());
  }
  // Preferir HTTP para poder recargar tras Discord OAuth (/launcher).
  return mainWindow.loadURL(target).catch(function () {
    if (token !== launcherNavToken || !mainWindow || mainWindow.isDestroyed()) {
      return;
    }
    return mainWindow
      .loadURL(
        "data:text/html;charset=utf-8," +
          encodeURIComponent(buildLauncherHtml()),
      )
      .catch(function () {});
  });
}
function startDevHotReload() {
  /* Disabled: soft-reload on file save was disruptive while editing. */
  return;
}
function loadMainPlayPage() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  try {
    if (
      gameplayPowerSaveId == null ||
      !powerSaveBlocker.isStarted(gameplayPowerSaveId)
    ) {
      gameplayPowerSaveId = powerSaveBlocker.start("prevent-app-suspension");
    }
    // Prefer focused = no throttle; blur handler will re-enable throttling.
    if (mainWindow.webContents.setBackgroundThrottling) {
      mainWindow.webContents.setBackgroundThrottling(!mainWindow.isFocused());
    }
  } catch (ePower) {}
  mainWindow.loadURL(
    "https://www.haxball.com/play",
    app.__hxdCleanUA
      ? {
          userAgent: app.__hxdCleanUA,
        }
      : undefined,
  );
}
function recoverFromRendererCrash(reason, where) {
  logCrash((where || "renderer") + ": " + reason);
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  if (rendererRecoverAttempts >= MAX_RENDERER_RECOVER) {
    launcherPhaseComplete = false;
    isLaunchingGame = false;
    setLauncherWindowConstraints(true);
    showLauncherInMainWindow(true).catch(function () {});
    return;
  }
  rendererRecoverAttempts++;
  setTimeout(function () {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return;
    }
    try {
      if (launcherPhaseComplete) {
        loadMainPlayPage();
      } else {
        showLauncherInMainWindow(true);
      }
    } catch (eRec) {
      logCrash("recover_failed: " + String((eRec && eRec.message) || eRec));
    }
  }, 800);
}
function beginAfterLauncher() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return {
      ok: false,
    };
  }
  ensureLocalDevUser();
  if (!currentUser || !currentUser.logged_in) {
    return {
      ok: false,
      need_auth: true,
    };
  }
  if (launcherPhaseComplete) {
    enterGameWindowMode();
    return {
      ok: true,
    };
  }
  launcherPhaseComplete = true;
  setLauncherWindowConstraints(false);
  isLaunchingGame = true;
  enterGameWindowMode();
  setRpcActivity({
    details:
      (discordPresence &&
        discordPresence.detailsMenu &&
        discordPresence.detailsMenu()) ||
      "En el menú",
    state: "discord.gg/spacehax",
    smallText:
      (currentUser && (currentUser.nick || currentUser.username)) || "",
    resetTimer: true,
  });
  loadMainPlayPage();
  return {
    ok: true,
  };
}
async function clearLauncherCache() {
  try {
    await session.defaultSession.clearCache();
    var stor = [
      "cookies",
      "localstorage",
      "indexeddb",
      "cachestorage",
      "serviceworkers",
    ];
    var origins = [
      "https://www.haxball.com",
      "https://haxball.com",
      "https://html5.haxball.com",
    ];
    for (var i = 0; i < origins.length; i++) {
      try {
        await session.defaultSession.clearStorageData({
          origin: origins[i],
          storages: stor,
        });
      } catch (e) {}
    }
    var cacheDirs = ["Cache", "Code Cache", "GPUCache", "Service Worker"];
    for (var j = 0; j < cacheDirs.length; j++) {
      var p = path.join(app.getPath("userData"), cacheDirs[j]);
      try {
        fs.rmSync(p, {
          recursive: true,
          force: true,
        });
      } catch (e) {}
    }
    return {
      ok: true,
    };
  } catch (e) {
    return {
      ok: false,
      error: String((e && e.message) || e),
    };
  }
}

// Função para mostrar indicador de zoom
function showZoomIndicator(zoomPercent) {
  if (!mainWindow || !mainWindow.webContents) {
    return;
  }
  var code = `
        (function() {
            // Remove indicador anterior se existir
            var old = document.getElementById('hxd-zoom-indicator');
            if (old) old.remove();
            
            // Cria novo indicador
            var div = document.createElement('div');
            div.id = 'hxd-zoom-indicator';
            div.textContent = 'Zoom: ${zoomPercent}%';
            div.style.cssText = 'position:fixed;top:20px;right:20px;color:#fff;padding:8px 16px;z-index:999999;font-family:"Space Grotesk",system-ui,sans-serif;font-size:14px;font-weight:400;pointer-events:none;text-shadow:0 2px 4px rgba(0,0,0,0.5);';
            document.body.appendChild(div);
            
            // Remove após 2 segundos com fade
            setTimeout(function() {
                div.style.opacity = '0';
                div.style.transition = 'opacity 0.3s ease';
                setTimeout(function() { div.remove(); }, 300);
            }, 2000);
        })();
    `;
  mainWindow.webContents.executeJavaScript(code).catch(function () {});
}

// ============================================
// CRIPTOGRAFIA - Deriva chave do sistema
// ============================================
function deriveKey() {
  // Chave fixa baseada em constantes do app (não depende de path)
  const parts = [
    "HXD",
    "haxball-desktop-v1",
    Buffer.from("aGF4YmFsbC1kZXNrdG9w").toString(),
    "electron-protected",
    "2024",
  ];
  return crypto.createHash("sha256").update(parts.join("|")).digest();
}
function deriveIV(filename) {
  return crypto
    .createHash("md5")
    .update("iv_" + filename + "_hxd")
    .digest();
}

// ============================================
// LIVE SETTINGS SYNC - injetado no código do game em runtime
// ============================================
// Estas funções nunca são chamadas aqui no processo main — apenas convertidas
// para string (via .toString()) e injetadas como texto no código do game, que
// roda no contexto da página (onde window/m/Aa existem). Ver ensureLiveSyncApi.
function __hxdSyncAllSettingsFromStorageImpl() {
  try {
    var ls = window.localStorage;
    function b(key, def) {
      try {
        var v = ls.getItem(key);
        if (v == null) {
          return def;
        }
        return v !== "0" && v !== "false";
      } catch (e) {
        return def;
      }
    }
    function cint(key, def) {
      try {
        var v = ls.getItem(key);
        if (v == null) {
          return def;
        }
        var n = parseInt(v, 10);
        if (isNaN(n)) {
          return def;
        } else {
          return n;
        }
      } catch (e) {
        return def;
      }
    }
    function cfloat(key, def) {
      try {
        var v = ls.getItem(key);
        if (v == null) {
          return def;
        }
        var n = parseFloat(v);
        if (isNaN(n)) {
          return def;
        } else {
          return n;
        }
      } catch (e) {
        return def;
      }
    }
    function setB(obj, val) {
      try {
        if (obj.v() !== !!val) {
          obj.ha(!!val);
        }
      } catch (e) {
        try {
          obj.ha(!!val);
        } catch (e2) {}
      }
    }
    function setN(obj, val) {
      try {
        if (obj.v() !== val) {
          obj.ha(val);
        }
      } catch (e) {
        try {
          obj.ha(val);
        } catch (e2) {}
      }
    }
    function setF(obj, val) {
      try {
        var cur = obj.v();
        if (typeof cur === "number" && Math.abs(cur - val) < 0.000001) {
          return;
        }
        obj.ha(val);
      } catch (e) {
        try {
          obj.ha(val);
        } catch (e2) {}
      }
    }
    if (typeof m === "undefined" || !m || !m.j) {
      return false;
    }
    var j = m.j;
    var needResize = false;
    setB(j.xe, b("sound_main", true));
    setB(j.Xi, b("sound_chat", true));
    setB(j.Nm, b("sound_highlight", true));
    setB(j.Mm, b("sound_crowd", true));
    setF(j.Yi, cfloat("sound_volume", 1));
    setB(j.Vm, b("team_colors", true));
    setB(j.Km, b("show_avatars", true));
    setB(j.Lm, b("show_names", true));
    setB(j.Rm, b("show_player_indicator", true) || b("show_indicator", true));
    setB(j.Sm, b("simple_lines", false));
    setB(j.Xm, b("ultra_simple_lines", false));
    setB(j.Tm, b("simple_field", false));
    setB(j.Um, b("show_animations", true));
    setB(j.Wm, b("viewport_culling", false) || b("culling_enabled", false));
    setB(j.Ym, b("low_quality_circles", true));
    setB(j.Uk, b("show_indicators", true) || b("show_chat_indicator", true));
    setB(j.li, b("low_latency_canvas", false));
    setB(j.Qm, b("image_smoothing", true));
    // FPS: native Rc() indexes fpsIntervals[Rh.v()] directly (0..5 = None/30/60/75/144/240),
    // so Rh must stay an INDEX — normalize both real-fps values and legacy index values.
    (function () {
      var raw = ls.getItem("fps_limit");
      var n = raw == null ? 0 : parseInt(raw, 10);
      if (isNaN(n)) {
        n = 0;
      }
      var idx;
      if (n === 0) {
        idx = 0;
      } else if (n === 30) {
        idx = 1;
      } else if (n === 60) {
        idx = 2;
      } else if (n === 75) {
        idx = 3;
      } else if (n === 144) {
        idx = 4;
      } else if (n === 240) {
        idx = 5;
      } else if (n >= 1 && n <= 5) {
        idx = n; // already an index
      } else {
        idx = 0;
      }
      setN(j.Rh, idx);
    })();
    // Resolution scale (Mi) always — not camera mode.
    var resScale = Math.max(0.1, Math.min(1, cfloat("resolution_scale", 1)));
    try {
      if (Math.abs(j.Mi.v() - resScale) >= 0.000001) {
        j.Mi.ha(resScale);
        needResize = true;
      }
    } catch (eMi) {
      try {
        j.Mi.ha(resScale);
        needResize = true;
      } catch (eMi2) {}
    }
    var viewMode =
      ls.getItem("view_mode") != null
        ? cint("view_mode", 1)
        : cint("viewmode", 1);
    try {
      if (j.Rd.v() !== viewMode) {
        j.Rd.ha(viewMode);
        needResize = true;
      }
    } catch (eRd) {
      try {
        j.Rd.ha(viewMode);
        needResize = true;
      } catch (eRd2) {}
    }
    setN(j.kk, cint("chat_height", 160));
    setN(j.Hh, cint("chat_focus_height", 140));
    setF(j.Ih, cfloat("chat_opacity", 0.8));
    setN(j.Ad, cint("extrapolation", 0));
    try {
      var bg = ls.getItem("chat_bg_mode");
      if (bg != null) {
        setN(j.jk, bg === "full" ? "full" : "compact");
      }
    } catch (eBg) {}
    try {
      var qm = ls.getItem("quality_mode");
      window._hxdQualityMultiplier = qm === "1" ? 1 : 0.9;
    } catch (eQ) {}
    try {
      var pk = ls.getItem("player_keys");
      if (pk != null) {
        j.Jd.ha(Aa.Th(pk));
        window.__hxdLastPk = pk;
      }
    } catch (ePk) {}
    if (needResize) {
      try {
        window.dispatchEvent(new Event("resize"));
      } catch (eR) {}
    }
    return true;
  } catch (e) {
    return false;
  }
}
function __haxAddPlayerKeyImpl(a, b) {
  try {
    var c = m.j.Jd.v();
    c.Pa(a, b);
    m.j.Jd.ha(c);
    return true;
  } catch (d) {
    return false;
  }
}
function __haxRemovePlayerKeyImpl(a) {
  try {
    var b = m.j.Jd.v();
    b.sr(a);
    m.j.Jd.ha(b);
    return true;
  } catch (c) {
    return false;
  }
}

// Patch OLD camera math in decrypted game.enc to zEro64's zero-zoom semantics.
function ensureCameraDefaultsFix(code) {
  if (
    !code ||
    code.indexOf('localStorage.getItem("hax_zero_zoom") !== "0"') !== -1
  ) {
    return code;
  }
  var oldJm = [
    "Jm() {\r\n",
    "            let a = m.j.Rd.v()\r\n",
    "              , b = this.l.ib.gb;\r\n",
    "            b.te = m.j.Mi.v();\r\n",
    "            b.Wg = 35;\r\n",
    "            1 == a ? b.Ld = 610 : (b.Ld = 0,\r\n",
    "            b.Ig = 1 + .25 * (a - 2))\r\n",
    "        }",
  ].join("");
  var newJm = [
    "Jm() {\r\n",
    "            let a = m.j.Rd.v()\r\n",
    "              , b = this.l.ib.gb;\r\n",
    "            b.te = m.j.Mi.v();\r\n",
    "            b.Wg = 35;\r\n",
    "            var hz = !1;\r\n",
    "            try {\r\n",
    '                hz = localStorage.getItem("hax_zero_zoom") !== "0"\r\n',
    "            } catch (f) {}\r\n",
    "            hz ? (1 == a ? b.Ld = 610 : (b.Ld = 0,\r\n",
    "            b.Ig = 1 + .25 * (a - 2))) : (0 >= a ? b.Ld = 610 : (b.Ld = 0,\r\n",
    "            b.Ig = 1 + .25 * (a - 1)))\r\n",
    "        }",
  ].join("");
  var oldA = [
    "let d = this.Ka.f.getBoundingClientRect().height;\r\n",
    "            0 == b ? (c.Ig = 1,\r\n",
    "            c.Ld = 0,\r\n",
    "            c.Wg = 0,\r\n",
    "            this.ib.gb.Dh = 0,\r\n",
    '            this.ib.f.style.paddingBottom = d + "px") : (c.Wg = 35,\r\n',
    "            1 == b ? c.Ld = 610 : (c.Ld = 0,\r\n",
    "            c.Ig = 1 + .25 * (b - 2)),\r\n",
    "            this.ib.gb.Dh = d * window.devicePixelRatio,\r\n",
    '            this.ib.f.style.paddingBottom = "0");',
  ].join("");
  var newA = [
    "let d = this.Ka.pk();\r\n",
    "            var hz = !1;\r\n",
    "            try {\r\n",
    '                hz = localStorage.getItem("hax_zero_zoom") !== "0"\r\n',
    "            } catch (fz) {}\r\n",
    "            0 == b ? (c.Ig = 1,\r\n",
    "            c.Ld = 0,\r\n",
    "            c.Wg = 0,\r\n",
    "            this.ib.gb.Dh = 0,\r\n",
    '            this.ib.f.style.paddingBottom = d + "px") : (c.Wg = 35,\r\n',
    "            hz ? (1 == b ? c.Ld = 610 : (c.Ld = 0,\r\n",
    "            c.Ig = 1 + .25 * (b - 2))) : (0 >= b ? c.Ld = 610 : (c.Ld = 0,\r\n",
    "            c.Ig = 1 + .25 * (b - 1))),\r\n",
    "            this.ib.gb.Dh = d * window.devicePixelRatio,\r\n",
    '            this.ib.f.style.paddingBottom = "0");',
  ].join("");

  // Also handle LF-only variants from plain/dev sources
  function bothEol(s) {
    return [s, s.replace(/\r\n/g, "\n")];
  }
  bothEol(oldJm).forEach(function (old, i) {
    var neu = bothEol(newJm)[i];
    if (code.indexOf(old) !== -1) {
      code = code.split(old).join(neu);
    }
  });
  bothEol(oldA).forEach(function (old, i) {
    var neu = bothEol(newA)[i];
    if (code.indexOf(old) !== -1) {
      code = code.split(old).join(neu);
    }
  });

  // Honor low_latency_canvas (ctor arg a) — old enc hardcoded desynchronized: !1
  if (
    code.indexOf("desynchronized: !!a") === -1 &&
    code.indexOf("desynchronized:!!a") === -1
  ) {
    var oldDesync = [
      "// Electron: desynchronized 2D canvases often paint solid black (pitch invisible,\r\n",
      "            // HUD/chat still work). Always keep synchronized compositing here.\r\n",
      '            this.c = this.na.getContext("2d", {\r\n',
      "                alpha: !1,\r\n",
      "                desynchronized: !1\r\n",
      "            });",
    ].join("");
    var newDesync = [
      "// Electron: desynchronized 2D canvases often paint solid black (pitch invisible,\r\n",
      "            // HUD/chat still work). Honor low_latency_canvas (constructor arg a) when enabled.\r\n",
      '            this.c = this.na.getContext("2d", {\r\n',
      "                alpha: !1,\r\n",
      "                desynchronized: !!a\r\n",
      "            });",
    ].join("");
    bothEol(oldDesync).forEach(function (old, i) {
      var neu = bothEol(newDesync)[i];
      if (code.indexOf(old) !== -1) {
        code = code.split(old).join(neu);
      }
    });
    // Fallback: unique getContext block with hardcoded desync false
    if (
      code.indexOf("desynchronized: !!a") === -1 &&
      code.indexOf("desynchronized:!!a") === -1
    ) {
      code = code.replace(
        /this\.c = this\.na\.getContext\("2d", \{\s*alpha: !1,\s*desynchronized: !1\s*\}\);/,
        'this.c = this.na.getContext("2d", {\n                alpha: !1,\n                desynchronized: !!a\n            });',
      );
    }
  }
  return code;
}

// Patch stub W.xl (ToggleChat-only) → full StartMatch/EndMatch/etc handler
function ensureXlActionsFix(code) {
  if (
    !code ||
    code.indexOf('"StartMatch" == d') !== -1 ||
    code.indexOf('"StartMatch"==d') !== -1
  ) {
    return code;
  }
  var liveStub =
    'this.W.xl = function(d) {\n                "ToggleChat" == d && b.l.Ka.$m()\n            }';
  var liveFull = [
    "this.W.xl = function(d) {",
    '                if ("ToggleChat" == d)',
    "                    b.l.Ka.$m();",
    '                else if ("FocusChat" == d)',
    "                    b.l.Ka.$a.focus({",
    "                        preventScroll: !0",
    "                    });",
    '                else if ("ViewModeNext" == d) {',
    "                    let v = m.j.Rd.v()",
    "                      , idx = v + 1;",
    "                    idx = (idx + 1) % 9;",
    "                    m.j.Rd.ha(idx - 1)",
    '                } else if ("ViewModePrev" == d) {',
    "                    let v = m.j.Rd.v()",
    "                      , idx = v + 1;",
    "                    idx = (idx + 8) % 9;",
    "                    m.j.Rd.ha(idx - 1)",
    '                } else if ("ToggleMenu" == d)',
    "                    b.l.Zk() ? b.l.ab(null) : b.l.we(!b.l.od);",
    '                else if ("StartMatch" == d)',
    "                    a.ta(new Wa);",
    '                else if ("EndMatch" == d)',
    "                    a.ta(new Xa);",
    '                else if ("RestartMatch" == d) {',
    "                    a.ta(new Xa);",
    "                    a.ta(new Wa)",
    "                } else",
    '                    "ToggleStadium120" == d && b.an()',
    "            }",
  ].join("\n");
  var replayStub =
    'this.W.xl = function(d) {\n                "ToggleChat" == d && c.l.Ka.$m()\n            }';
  var replayFull = [
    "this.W.xl = function(d) {",
    '                if ("ToggleChat" == d)',
    "                    c.l.Ka.$m();",
    '                else if ("FocusChat" == d)',
    "                    c.l.Ka.$a.focus({",
    "                        preventScroll: !0",
    "                    });",
    '                else if ("ViewModeNext" == d) {',
    "                    let v = m.j.Rd.v()",
    "                      , idx = v + 1;",
    "                    idx = (idx + 1) % 9;",
    "                    m.j.Rd.ha(idx - 1)",
    '                } else if ("ViewModePrev" == d) {',
    "                    let v = m.j.Rd.v()",
    "                      , idx = v + 1;",
    "                    idx = (idx + 8) % 9;",
    "                    m.j.Rd.ha(idx - 1)",
    '                } else if ("ToggleMenu" == d)',
    "                    c.l.Zk() ? c.l.ab(null) : c.l.we(!c.l.od);",
    '                else if ("ToggleStadium120" == d && null != c.za.U.M) {',
    "                    let a = new Ya;",
    "                    a.Pf = 120 != c.za.U.M.Ta;",
    "                    c.za.ta(a)",
    '                } else if ("StartMatch" == d || "EndMatch" == d || "RestartMatch" == d)',
    "                    void 0",
    "            }",
  ].join("\n");
  function bothEol(s) {
    return [s, s.replace(/\n/g, "\r\n")];
  }
  bothEol(liveStub).forEach(function (old, i) {
    var neu = bothEol(liveFull)[i];
    if (code.indexOf(old) !== -1) {
      code = code.split(old).join(neu);
    }
  });
  bothEol(replayStub).forEach(function (old, i) {
    var neu = bothEol(replayFull)[i];
    if (code.indexOf(old) !== -1) {
      code = code.split(old).join(neu);
    }
  });

  // Compact one-line stubs
  if (
    code.indexOf('"StartMatch" == d') === -1 &&
    code.indexOf('"StartMatch"==d') === -1
  ) {
    code = code.replace(
      /this\.W\.xl\s*=\s*function\s*\(d\)\s*\{\s*"ToggleChat"\s*==\s*d\s*&&\s*b\.l\.Ka\.\$m\(\)\s*\}/,
      liveFull,
    );
    code = code.replace(
      /this\.W\.xl\s*=\s*function\s*\(d\)\s*\{\s*"ToggleChat"\s*==\s*d\s*&&\s*c\.l\.Ka\.\$m\(\)\s*\}/,
      replayFull,
    );
  }

  // Native settings input rows — append missing actions after ToggleChat
  if (
    code.indexOf('bb.appendChild(b("StartMatch"))') === -1 &&
    code.indexOf("bb.appendChild(b('StartMatch'))") === -1
  ) {
    var oldRows = 'bb.appendChild(b("ToggleChat"))';
    var newRows = [
      'bb.appendChild(b("ToggleChat"));',
      '                bb.appendChild(b("FocusChat"));',
      '                bb.appendChild(b("ViewModeNext"));',
      '                bb.appendChild(b("ViewModePrev"));',
      '                bb.appendChild(b("ToggleMenu"));',
      '                bb.appendChild(b("ToggleStadium120"));',
      '                bb.appendChild(b("StartMatch"));',
      '                bb.appendChild(b("EndMatch"));',
      '                bb.appendChild(b("RestartMatch"))',
    ].join("\n");
    bothEol(oldRows).forEach(function (old, i) {
      var neu = bothEol(newRows)[i];
      if (code.indexOf(old) !== -1) {
        code = code.split(old).join(neu);
      }
    });
  }
  return code;
}

// Garante que o código do game (mesmo vindo de game.enc já compilado) tenha a
// API de live-sync. Se já contém a função (build nova), não faz nada.
function ensureLiveSyncApi(code) {
  code = ensureCameraDefaultsFix(code);
  code = ensureXlActionsFix(code);
  if (!code || code.indexOf("__hxdSyncAllSettingsFromStorage") !== -1) {
    return code;
  }
  var inject =
    "window.__hxdSyncAllSettingsFromStorage = " +
    __hxdSyncAllSettingsFromStorageImpl.toString() +
    ";\nwindow.__haxAddPlayerKey = " +
    __haxAddPlayerKeyImpl.toString() +
    ";\nwindow.__haxRemovePlayerKey = " +
    __haxRemovePlayerKeyImpl.toString() +
    ";\n";
  if (code.indexOf("window.__starCreateNativeRoom") !== -1) {
    return code.replace(
      "window.__starCreateNativeRoom",
      inject + "window.__starCreateNativeRoom",
    );
  }
  if (code.indexOf("B.Yp()") !== -1) {
    return code.replace("B.Yp()", inject + "B.Yp()");
  }
  return code + "\n" + inject;
}

// Carga el código del juego: prioriza game-min-original.js si existe.
function decryptGameCode(extPath) {
  var encPath = path.join(extPath, "game.enc");
  var plainPath = path.join(extPath, "game-min-original.js");
  if (fs.existsSync(plainPath)) {
    try {
      var plain = fs.readFileSync(plainPath, "utf8");
      if (plain && plain.length > 1000) {
        return ensureLiveSyncApi(plain);
      }
    } catch (ePlain) {}
  }
  if (fs.existsSync(encPath)) {
    try {
      var encData = fs.readFileSync(encPath, "utf8");
      var encrypted = Buffer.from(encData, "base64");
      var key = deriveKey();
      var iv = deriveIV("game-min-original.js");
      var decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
      var decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);
      return ensureLiveSyncApi(decrypted.toString("utf8"));
    } catch (e) {}
  }
  return null;
}

// ============================================
// PROTEÇÃO HARDCORE - Múltiplas camadas
// ============================================
function generateProtectedLoader(code) {
  // Gera nomes de variáveis aleatórios
  var chars = "abcdefghijklmnopqrstuvwxyz";
  function rv() {
    var r = "_";
    for (var j = 0; j < 6; j++) {
      r += chars[Math.floor(Math.random() * 26)];
    }
    return r;
  }

  // Gera chave XOR aleatória (muda a cada request!)
  var xorKey = Math.floor(Math.random() * 200) + 50;

  // 1. Aplica XOR em cada byte e converte pra string em chunks
  var xoredStr = "";
  for (var i = 0; i < code.length; i++) {
    xoredStr += String.fromCharCode(code.charCodeAt(i) ^ xorKey);
  }

  // 2. Converte pra base64
  var b64 = Buffer.from(xoredStr, "binary").toString("base64");

  // 3. Divide em chunks pequenos e embaralha a ordem
  var chunkSize = 3000;
  var chunks = [];
  for (var i = 0; i < b64.length; i += chunkSize) {
    chunks.push({
      idx: chunks.length,
      data: b64.slice(i, i + chunkSize),
    });
  }

  // Embaralha os chunks
  var shuffled = chunks.slice();
  for (var i = shuffled.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }

  // Gera variáveis
  var vData = rv();
  var vKey = rv();
  var vResult = rv();
  var vI = rv();
  var vB64 = rv();
  var vXored = rv();
  var vCode = rv();
  var vEl = rv();
  var vOrder = rv();
  var vChunks = rv(); // Monta o array de chunks embaralhados com índices
  var chunksCode = shuffled
    .map(function (c) {
      return "[" + c.idx + ',"' + c.data + '"]';
    })
    .join(",");

  // Gera números ofuscados
  function obfNum(n) {
    var a = Math.floor(Math.random() * 1000);
    return "(" + (n + a) + "-" + a + ")";
  }

  // Gera variáveis para o loader
  var vTime1 = rv();
  var vTime2 = rv(); // Loader com múltiplas camadas de proteção
  var loader =
    "(function(){var " +
    vChunks +
    "=[" +
    chunksCode +
    "];var " +
    vOrder +
    "=new Array(" +
    vChunks +
    ".length);for(var " +
    vI +
    "=0;" +
    vI +
    "<" +
    vChunks +
    ".length;" +
    vI +
    "++){" +
    vOrder +
    "[" +
    vChunks +
    "[" +
    vI +
    "][0]]=" +
    vChunks +
    "[" +
    vI +
    "][1];}var " +
    vB64 +
    "=" +
    vOrder +
    '["join"]("");var ' +
    vXored +
    "=atob(" +
    vB64 +
    ");var " +
    vKey +
    "=" +
    obfNum(xorKey) +
    ";var " +
    vResult +
    '="";for(var ' +
    vI +
    "=0;" +
    vI +
    "<" +
    vXored +
    ".length;" +
    vI +
    "++){" +
    vResult +
    '+=String["fromCharCode"](' +
    vXored +
    ".charCodeAt(" +
    vI +
    ")^" +
    vKey +
    ");}var " +
    vEl +
    '=document["createElement"]("script");' +
    vEl +
    '["textContent"]=' +
    vResult +
    ';document["head"]["appendChild"](' +
    vEl +
    ");" +
    vEl +
    '["remove"]();})();';
  return loader;
}

// Extensiones: carpeta suelta = usar directo; solo ASAR extrae a temp.
function extractExtensions() {
  var srcPath = path.join(__dirname, "extensions");
  var insideAsar = String(__dirname).indexOf("app.asar") !== -1;
  if (!app.isPackaged || !insideAsar) {
    console.log("[EXT] Usando path directo:", srcPath);
    tempExtIsTemporary = false;
    return srcPath;
  }

  // Em prod: tenta múltiplos locais
  var possiblePaths = [
    path.join(app.getPath("temp"), "hxd_ext"),
    path.join(app.getPath("userData"), "extensions"),
    path.join(app.getPath("home"), ".hxd", "extensions"),
  ];
  for (var i = 0; i < possiblePaths.length; i++) {
    var tempPath = possiblePaths[i];
    try {
      console.log("[EXT] Tentando extrair para:", tempPath);

      // Remove pasta antiga se existir
      if (fs.existsSync(tempPath)) {
        try {
          fs.rmSync(tempPath, {
            recursive: true,
            force: true,
          });
        } catch (e) {
          console.log(
            "[EXT] Aviso: não foi possível remover pasta antiga:",
            e.message,
          );
        }
      }

      // Cria diretório
      fs.mkdirSync(tempPath, {
        recursive: true,
      });

      // Testa se consegue escrever
      var testFile = path.join(tempPath, ".test");
      fs.writeFileSync(testFile, "test");
      fs.unlinkSync(testFile);

      // Copia todos os arquivos
      var files = fs.readdirSync(srcPath);
      var copiedCount = 0;
      for (var j = 0; j < files.length; j++) {
        var file = files[j];
        var src = path.join(srcPath, file);
        var dst = path.join(tempPath, file);
        var stat = fs.statSync(src);
        if (stat.isFile()) {
          // copyFileSync often fails from inside app.asar — read+write works
          try {
            fs.copyFileSync(src, dst);
          } catch (eCopy) {
            fs.writeFileSync(dst, fs.readFileSync(src));
          }
          copiedCount++;
        }
      }
      console.log(
        "[EXT] Sucesso! Copiados",
        copiedCount,
        "arquivos para:",
        tempPath,
      );

      // Verifica se manifest.json existe
      if (fs.existsSync(path.join(tempPath, "manifest.json"))) {
        tempExtIsTemporary = true;
        return tempPath;
      } else {
        console.log("[EXT] Erro: manifest.json não encontrado após cópia");
      }
    } catch (e) {
      console.log("[EXT] Falha ao extrair para", tempPath, ":", e.message);
      continue;
    }
  }

  // Último fallback: tenta usar direto do asar (pode não funcionar)
  console.log("[EXT] AVISO: Usando fallback - path do asar:", srcPath);
  tempExtIsTemporary = false;
  return srcPath;
}

function localBackendResponse(method, endpointPath, options) {
  var endpoint = String(endpointPath || "").split("?")[0];
  var body = (options && options.body) || {};
  var user = createLocalDevUser();

  if (endpoint === "/auth/discord/token") {
    return { statusCode: 200, json: user };
  }
  if (endpoint === "/auth/me") {
    return { statusCode: 200, json: { user: getPublicUserPayload(user) } };
  }
  if (endpoint === "/rpc/config") {
    return { statusCode: 200, json: {} };
  }
  if (endpoint === "/presence") {
    return { statusCode: 200, json: { ok: true, presence: body } };
  }
  if (endpoint === "/groups") {
    return {
      statusCode: 200,
      json: method === "GET" ? { groups: [] } : { ok: true, group: null },
    };
  }
  if (/^\/groups\/\d+\/messages$/.test(endpoint)) {
    return {
      statusCode: 200,
      json:
        method === "GET" ? { messages: [] } : { ok: true, message: null },
    };
  }
  if (/^\/groups\/\d+$/.test(endpoint)) {
    return {
      statusCode: 404,
      json: { error: "group not found" },
    };
  }
  if (endpoint === "/friends") {
    return { statusCode: 200, json: { friends: [] } };
  }
  if (endpoint === "/friends/requests") {
    return {
      statusCode: 200,
      json:
        method === "GET"
          ? { requests: [], incoming: [], outgoing: [] }
          : { ok: true },
    };
  }
  if (/^\/friends\/[^/]+\/messages$/.test(endpoint)) {
    return {
      statusCode: 200,
      json:
        method === "GET" ? { messages: [] } : { ok: true, message: null },
    };
  }
  if (endpoint === "/users/search") {
    return { statusCode: 200, json: { users: [] } };
  }
  return { statusCode: 200, json: { ok: true } };
}
function backendRequest(method, endpointPath, options) {
  return Promise.resolve(localBackendResponse(method, endpointPath, options));
}
function exchangeCodeWithBackend(code) {
  return backendRequest("POST", "/auth/discord/token", {
    body: {
      code: code,
      redirect_uri: DISCORD_REDIRECT_URI,
    },
  }).then(function (result) {
    if (
      result.statusCode >= 200 &&
      result.statusCode < 300 &&
      result.json &&
      result.json.discord_id
    ) {
      return result.json;
    }
    throw new Error(
      (result.json && result.json.error) ||
        "Backend error " + result.statusCode,
    );
  });
}
function getPublicUserPayload(user) {
  if (!user || !user.logged_in) {
    return {
      logged_in: false,
    };
  }
  return {
    logged_in: true,
    discord_id: user.discord_id,
    nick: user.nick,
    username: user.username,
    avatar: user.avatar || null,
    is_plus: !!user.is_plus,
  };
}
function readRequestBody(req) {
  return new Promise(function (resolve) {
    var body = "";
    req.on("data", function (c) {
      body += c;
    });
    req.on("end", function () {
      if (!body) {
        return resolve({});
      }
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
  });
}
function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload == null ? {} : payload));
}
function proxyAuthenticatedBackend(req, res, method, endpointPath, body) {
  if (!currentUser || !currentUser.logged_in) {
    sendJson(res, 401, {
      error: "not logged in",
      reauth_required: true,
    });
    return Promise.resolve();
  }
  if (!currentUser.api_token) {
    sendJson(res, 401, {
      error: "session outdated",
      reauth_required: true,
    });
    return Promise.resolve();
  }
  return backendRequest(method, endpointPath, {
    body: body,
    headers: {
      Authorization: "Bearer " + currentUser.api_token,
    },
  })
    .then(function (result) {
      if (result.statusCode === 401) {
        sendJson(res, 401, {
          error: (result.json && result.json.error) || "unauthorized",
          reauth_required: true,
        });
        return;
      }
      sendJson(res, result.statusCode, result.json || {});
    })
    .catch(function (err) {
      var raw = err && err.message ? String(err.message) : "";
      var soft = /timeout|unavailable|ECONN|ENOTFOUND|ETIMEDOUT/i.test(raw);
      sendJson(res, soft ? 503 : 502, {
        error: soft ? "unavailable" : raw || "backend unavailable",
      });
    });
}

// ============================================
// IPC HANDLERS
// ============================================
ipcMain.handle("auth:start", async () => {
  if (LOCAL_DEV_MODE) {
    ensureLocalDevUser();
    return {
      success: true,
      user: getPublicUserPayload(currentUser),
    };
  }
  // Abre o navegador com a URL do Discord OAuth
  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(DISCORD_SCOPES)}`;
  shell.openExternal(authUrl);
  return {
    success: true,
  };
});
ipcMain.handle("auth:getUser", async () => {
  return currentUser;
});
ipcMain.handle("auth:logout", async () => {
  currentUser = logoutCurrentUser();
  return {
    success: true,
    logged_in: !!currentUser && !!currentUser.logged_in,
  };
});
ipcMain.handle("open-external", async (event, url) => {
  if (url && typeof url === "string") {
    shell.openExternal(url);
  }
  return {
    success: true,
  };
});
ipcMain.handle("close-app", async () => {
  app.quit();
});
ipcMain.handle("get-version", async () => {
  return APP_VERSION;
});
ipcMain.handle("get-extension-status", async () => {
  try {
    var extensions = session.defaultSession.getAllExtensions();
    var status = {
      loaded: false,
      extensions: [],
    };
    for (var id in extensions) {
      var ext = extensions[id];
      status.extensions.push({
        id: id,
        name: ext.name,
        version: ext.version,
      });
      if (ext.name === "HaxBall Space") {
        status.loaded = true;
      }
    }
    return status;
  } catch (e) {
    return {
      loaded: false,
      error: e.message,
    };
  }
});
ipcMain.handle("api:get", async (event, endpoint) => {
  return null;
});
ipcMain.handle("api:post", async (event, endpoint, data) => {
  return null;
});
app.on("child-process-gone", function (event, details) {
  if (details && (details.type === "GPU" || details.type === "Utility")) {
    logCrash(
      "child-process-gone " + details.type + ": " + (details.reason || ""),
    );
  }
});
app.on("ready", function () {
  repairGpuCache();
  scheduleAutoUpdates();

  // UA limpio a nivel session (XHR/fetch/workers de Turnstile)
  try {
    if (app.__hxdCleanUA) {
      session.defaultSession.setUserAgent(app.__hxdCleanUA);
    }
  } catch (eUa) {}
  function bootClient() {
    if (bootClient._started) {
      return;
    }
    bootClient._started = true;

    // Carrega sessão salva (se existir)
    currentUser = LOCAL_DEV_MODE ? createLocalDevUser() : loadUserSession();
    var extPath = extractExtensions();
    tempExtPath = extPath;

    // Descriptografa código do game em memória (uma vez só)
    decryptedGameCode = decryptGameCode(extPath);
    if (!decryptedGameCode) {
      app.quit();
      return;
    }
    function notifyDevHotReload(kind) {
      if (!mainWindow || mainWindow.isDestroyed()) {
        return;
      }
      var k = JSON.stringify(kind || "ui");
      mainWindow.webContents
        .executeJavaScript(
          "(function(){var k=" +
            k +
            ';function go(w){try{w.postMessage({type:"star:dev-hot-reload",kind:k},"*");}catch(e){}try{var fs=w.document&&w.document.querySelectorAll("iframe");if(!fs)return;for(var i=0;i<fs.length;i++){try{go(fs[i].contentWindow);}catch(e2){}}}catch(e3){}}go(window);})();',
        )
        .catch(function () {});
    }
    function setupDevHotReload() {
      // Opt-in only. File watchers were reloading the Star iframe mid-match
      // (boot/loading flash) even without intentional updates.
      if (process.env.SPACE_HOT_RELOAD !== "1") {
        return;
      }
      try {
        if (app && typeof app.isPackaged === "boolean" && app.isPackaged) {
          return;
        }
      } catch (ePkg) {}
      var timers = {};
      function bump(kind) {
        clearTimeout(timers[kind]);
        timers[kind] = setTimeout(function () {
          try {
            if (kind === "game" || kind === "all") {
              // Prefer live source under resources/app/extensions
              var srcExt = path.join(__dirname, "extensions");
              var fresh = decryptGameCode(srcExt);
              if (fresh) {
                decryptedGameCode = fresh;
              } else {
                decryptedGameCode = decryptGameCode(extPath);
              }
            }
          } catch (eDec) {}
          notifyDevHotReload(kind);
        }, 350);
      }
      var watchPairs = [
        [path.join(__dirname, "ui", "star-menu.html"), "ui"],
        [path.join(__dirname, "extensions", "game-min-original.js"), "game"],
        [path.join(__dirname, "extensions", "star-menu-bridge.js"), "bridge"],
        [path.join(__dirname, "extensions", "header.js"), "bridge"],
      ];
      for (var wi = 0; wi < watchPairs.length; wi++) {
        (function (filePath, kind) {
          try {
            if (!fs.existsSync(filePath)) {
              return;
            }
            fs.watch(
              filePath,
              {
                persistent: false,
              },
              function () {
                bump(kind);
              },
            );
          } catch (eWatch) {}
        })(watchPairs[wi][0], watchPairs[wi][1]);
      }
    }
    setupDevHotReload();

    // Servidor HTTP
    server = http.createServer(function (req, res) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS",
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
      );
      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }
      var urlParts = req.url.split("?");
      var url = urlParts[0];
      var queryString = urlParts[1] || "";

      // Prelauncher (estilo zEro) en la ventana principal
      if ((url === "/" || url === "/launcher/") && req.method === "GET") {
        res.writeHead(302, {
          Location: "/launcher",
        });
        res.end();
        return;
      }
      if (url === "/launcher" && req.method === "GET") {
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        });
        res.end(buildLauncherHtml());
        return;
      }
      if (url === "/launcher-hero.png" && req.method === "GET") {
        var heroPath = path.join(__dirname, "launcher-hero.png");
        if (fs.existsSync(heroPath)) {
          res.writeHead(200, {
            "Content-Type": "image/png",
            "Cache-Control": "no-store",
          });
          res.end(fs.readFileSync(heroPath));
        } else {
          res.writeHead(404);
          res.end("Not found");
        }
        return;
      }
      if (url === "/launcher-bg.png" && req.method === "GET") {
        var bgPath = path.join(__dirname, "launcher-bg.png");
        if (fs.existsSync(bgPath)) {
          res.writeHead(200, {
            "Content-Type": "image/png",
            "Cache-Control": "no-store",
          });
          res.end(fs.readFileSync(bgPath));
        } else {
          res.writeHead(404);
          res.end("Not found");
        }
        return;
      }
      if (url === "/login-art.png" && req.method === "GET") {
        var loginArtPath = path.join(__dirname, "login-art.png");
        if (fs.existsSync(loginArtPath)) {
          res.writeHead(200, {
            "Content-Type": "image/png",
            "Cache-Control": "no-store",
          });
          res.end(fs.readFileSync(loginArtPath));
        } else {
          res.writeHead(404);
          res.end("Not found");
        }
        return;
      }
      if (url === "/launcher/play" && req.method === "POST") {
        var playResult = beginAfterLauncher();
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify(
            playResult || {
              ok: false,
            },
          ),
        );
        return;
      }
      if (url === "/launcher/clear-cache" && req.method === "POST") {
        clearLauncherCache().then(function (result) {
          res.writeHead(200, {
            "Content-Type": "application/json",
          });
          res.end(JSON.stringify(result));
        });
        return;
      }
      if (url === "/launcher/open-folder" && req.method === "POST") {
        try {
          shell.openPath(app.getPath("userData"));
        } catch (eFolder) {}
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({
            ok: true,
          }),
        );
        return;
      }

      // ---- Local media (avatar / ball images on disk) ----
      if (
        (url === "/local/media/avatar" || url === "/local/media/ball") &&
        (req.method === "GET" || req.method === "POST")
      ) {
        var mediaKind = url.indexOf("/ball") >= 0 ? "ball" : "avatar";
        if (req.method === "GET") {
          var loaded = loadLocalMedia(mediaKind);
          res.writeHead(200, {
            "Content-Type": "application/json",
          });
          res.end(JSON.stringify(loaded));
          return;
        }
        var mediaBody = "";
        req.on("data", function (c) {
          mediaBody += c;
        });
        req.on("end", function () {
          var dataUrl = "";
          try {
            var parsedMedia = JSON.parse(mediaBody || "{}");
            dataUrl = parsedMedia.dataUrl || parsedMedia.image || "";
            if (parsedMedia.clear) {
              dataUrl = "";
            }
          } catch (eMedia) {}
          var saved = saveLocalMedia(mediaKind, dataUrl);
          res.writeHead(200, {
            "Content-Type": "application/json",
          });
          res.end(JSON.stringify(saved));
        });
        return;
      }

      // ---- Updater (GET/POST) ----
      function endUpdateJson(obj) {
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify(obj));
      }
      if (
        (url === "/self-update-progress" || url === "/update/status") &&
        (req.method === "GET" || req.method === "POST")
      ) {
        endUpdateJson(
          spaceUpdater
            ? spaceUpdater.getState()
            : {
                status: "disabled",
              },
        );
        return;
      }
      if (
        url === "/update/check" &&
        (req.method === "GET" || req.method === "POST")
      ) {
        if (!spaceUpdater) {
          endUpdateJson({
            status: "disabled",
          });
          return;
        }
        spaceUpdater
          .checkForUpdate()
          .then(endUpdateJson)
          .catch(function (e) {
            endUpdateJson({
              status: "error",
              error: String((e && e.message) || e),
            });
          });
        return;
      }
      if (
        (url === "/self-update" || url === "/update/download") &&
        (req.method === "GET" || req.method === "POST")
      ) {
        if (!spaceUpdater) {
          endUpdateJson({
            status: "disabled",
          });
          return;
        }
        endUpdateJson({
          ok: true,
          started: true,
          state: spaceUpdater.getState(),
        });
        spaceUpdater.autoCheckAndDownload().catch(function () {});
        return;
      }
      if (
        url === "/update/apply" &&
        (req.method === "GET" || req.method === "POST")
      ) {
        if (!spaceUpdater) {
          endUpdateJson({
            status: "disabled",
          });
          return;
        }
        try {
          endUpdateJson(spaceUpdater.applyAndRestart());
        } catch (eApply) {
          endUpdateJson({
            status: "error",
            error: String((eApply && eApply.message) || eApply),
          });
        }
        return;
      }
      if (
        (url === "/self-update-cancel" || url === "/update/cancel") &&
        (req.method === "GET" || req.method === "POST")
      ) {
        if (spaceUpdater) {
          spaceUpdater.cancel();
        }
        endUpdateJson(
          spaceUpdater
            ? spaceUpdater.getState()
            : {
                status: "disabled",
              },
        );
        return;
      }
      if (url === "/quit-app" && req.method === "POST") {
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({
            ok: true,
          }),
        );
        setTimeout(function () {
          try {
            app.quit();
          } catch (eQ) {}
        }, 50);
        return;
      }
      if (url === "/logout" && req.method === "POST") {
        currentUser = logoutCurrentUser();
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        });
        res.end(
          JSON.stringify({
            ok: true,
            logged_in: !!currentUser && !!currentUser.logged_in,
          }),
        );
        if (!launcherPhaseComplete && mainWindow && !mainWindow.isDestroyed()) {
          setImmediate(function () {
            showLauncherInMainWindow(true).catch(function () {});
          });
        }
        return;
      }
      if (url === "/window/minimize" && req.method === "POST") {
        try {
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.minimize();
          }
        } catch (eMin) {}
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({
            ok: true,
          }),
        );
        return;
      }
      if (url === "/window/maximize" && req.method === "POST") {
        var maximized = false;
        try {
          if (mainWindow && !mainWindow.isDestroyed()) {
            if (mainWindow.isMaximized()) {
              mainWindow.unmaximize();
            } else {
              mainWindow.maximize();
            }
            maximized = mainWindow.isMaximized();
          }
        } catch (eMax) {}
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({
            ok: true,
            maximized: maximized,
          }),
        );
        return;
      }

      // ---- Spotify (user Client ID + PKCE) ----
      if (url === "/spotify/auth-start" && req.method === "POST") {
        var spotifyAuthBody = "";
        req.on("data", function (c) {
          spotifyAuthBody += c;
        });
        req.on("end", function () {
          try {
            var d = JSON.parse(spotifyAuthBody || "{}");
            var clientId = String(d.clientId || d.client_id || "").trim();
            if (!clientId || clientId.length < 8) {
              res.writeHead(400, {
                "Content-Type": "application/json",
              });
              res.end(
                JSON.stringify({
                  ok: false,
                  error: "client_id_required",
                }),
              );
              return;
            }
            var verifier = spotifyBase64Url(crypto.randomBytes(32));
            var challenge = spotifyBase64Url(
              crypto.createHash("sha256").update(verifier).digest(),
            );
            var state = spotifyBase64Url(crypto.randomBytes(16));
            pendingSpotifyAuth = {
              clientId: clientId,
              codeVerifier: verifier,
              state: state,
              createdAt: Date.now(),
            };
            var authUrl =
              "https://accounts.spotify.com/authorize?client_id=" +
              encodeURIComponent(clientId) +
              "&response_type=code&redirect_uri=" +
              encodeURIComponent(SPOTIFY_REDIRECT_URI) +
              "&scope=" +
              encodeURIComponent(SPOTIFY_SCOPES) +
              "&code_challenge_method=S256&code_challenge=" +
              encodeURIComponent(challenge) +
              "&state=" +
              encodeURIComponent(state) +
              // Force consent so upgraded scopes (playback control) are actually granted.
              "&show_dialog=true";
            res.writeHead(200, {
              "Content-Type": "application/json",
            });
            res.end(
              JSON.stringify({
                ok: true,
                authUrl: authUrl,
                redirectUri: SPOTIFY_REDIRECT_URI,
                scopes: SPOTIFY_SCOPES,
              }),
            );
          } catch (eAuth) {
            res.writeHead(500, {
              "Content-Type": "application/json",
            });
            res.end(
              JSON.stringify({
                ok: false,
                error: "bad_request",
              }),
            );
          }
        });
        return;
      }
      if (url === "/spotify-callback") {
        var spParams = new URLSearchParams(queryString);
        var spCode = spParams.get("code");
        var spError = spParams.get("error");
        var spState = spParams.get("state");
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
        });
        function spotifyCallbackHtml(ok, title, msg) {
          return (
            '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Spotify · Space</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0b0b0c;color:#fff;font-family:system-ui,sans-serif}.box{max-width:420px;padding:28px 24px;border-radius:16px;background:#161618;border:1px solid rgba(255,255,255,.08);text-align:center}h1{font-size:18px;margin:0 0 8px}p{margin:0;color:#9a9a9e;font-size:14px;line-height:1.45}.ok{color:#1db954}</style></head><body><div class="box"><h1 class="' +
            (ok ? "ok" : "") +
            '">' +
            title +
            "</h1><p>" +
            msg +
            "</p></div></body></html>"
          );
        }
        if (spError || !spCode) {
          pendingSpotifyAuth = null;
          res.end(
            spotifyCallbackHtml(
              false,
              "Conexión cancelada",
              "Podés cerrar esta pestaña y volver a Space.",
            ),
          );
          return;
        }
        if (
          !pendingSpotifyAuth ||
          String(pendingSpotifyAuth.state) !== String(spState || "")
        ) {
          res.end(
            spotifyCallbackHtml(
              false,
              "Sesión inválida",
              "Volvé a Space y tocá Conectar Spotify de nuevo.",
            ),
          );
          return;
        }
        var pending = pendingSpotifyAuth;
        pendingSpotifyAuth = null;
        var tokenBody =
          "grant_type=authorization_code&code=" +
          encodeURIComponent(spCode) +
          "&redirect_uri=" +
          encodeURIComponent(SPOTIFY_REDIRECT_URI) +
          "&client_id=" +
          encodeURIComponent(pending.clientId) +
          "&code_verifier=" +
          encodeURIComponent(pending.codeVerifier);
        spotifyFormRequest("https://accounts.spotify.com/api/token", tokenBody)
          .then(function (result) {
            if (
              result.statusCode < 200 ||
              result.statusCode >= 300 ||
              !result.json ||
              !result.json.access_token
            ) {
              res.end(
                spotifyCallbackHtml(
                  false,
                  "Error al conectar",
                  "Revisá el Client ID y el Redirect URI en el Dashboard de Spotify.",
                ),
              );
              return;
            }
            saveSpotifyTokens({
              client_id: pending.clientId,
              access_token: result.json.access_token,
              refresh_token: result.json.refresh_token || "",
              expires_at:
                Date.now() + Number(result.json.expires_in || 3600) * 1000,
              scope: String(result.json.scope || ""),
              connected_at: Date.now(),
            });
            if (
              !spotifyHasControlScope({
                scope: result.json.scope || "",
              })
            ) {
              res.end(
                spotifyCallbackHtml(
                  false,
                  "Falta permiso de control",
                  "Cerrá esta pestaña, en Space tocá Reconectar y aceptá TODOS los permisos (incluído controlar reproducción).",
                ),
              );
              return;
            }
            res.end(
              spotifyCallbackHtml(
                true,
                "Spotify conectado",
                "Ya podés cerrar esta pestaña y volver a Space.",
              ),
            );
          })
          .catch(function () {
            res.end(
              spotifyCallbackHtml(
                false,
                "Error de red",
                "No se pudo hablar con Spotify. Probá de nuevo.",
              ),
            );
          });
        return;
      }
      if (url === "/spotify/status" && req.method === "GET") {
        var st = loadSpotifyTokens();
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({
            ok: true,
            connected: !!st && !!st.access_token,
            canControl: spotifyHasControlScope(st),
            clientId: st && st.client_id ? String(st.client_id) : "",
            redirectUri: SPOTIFY_REDIRECT_URI,
            scope: st && st.scope ? String(st.scope) : "",
          }),
        );
        return;
      }
      if (url === "/spotify/disconnect" && req.method === "POST") {
        saveSpotifyTokens(null);
        pendingSpotifyAuth = null;
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({
            ok: true,
            connected: false,
          }),
        );
        return;
      }
      if (url === "/spotify/now-playing" && req.method === "GET") {
        ensureSpotifyAccessToken()
          .then(function (tokens) {
            if (!tokens || !tokens.access_token) {
              res.writeHead(200, {
                "Content-Type": "application/json",
              });
              res.end(
                JSON.stringify({
                  ok: true,
                  connected: false,
                  canControl: false,
                  playing: false,
                }),
              );
              return;
            }
            var canControl = spotifyHasControlScope(tokens);
            return spotifyApiGet(
              "/v1/me/player/currently-playing",
              tokens.access_token,
            ).then(function (result) {
              if (result.statusCode === 204 || result.empty) {
                res.writeHead(200, {
                  "Content-Type": "application/json",
                });
                res.end(
                  JSON.stringify({
                    ok: true,
                    connected: true,
                    canControl: canControl,
                    playing: false,
                    scope: tokens.scope || "",
                  }),
                );
                return;
              }
              if (result.statusCode === 401) {
                saveSpotifyTokens(null);
                res.writeHead(200, {
                  "Content-Type": "application/json",
                });
                res.end(
                  JSON.stringify({
                    ok: true,
                    connected: false,
                    canControl: false,
                    playing: false,
                    error: "reauth",
                  }),
                );
                return;
              }
              if (
                result.statusCode < 200 ||
                result.statusCode >= 300 ||
                !result.json
              ) {
                res.writeHead(200, {
                  "Content-Type": "application/json",
                });
                res.end(
                  JSON.stringify({
                    ok: false,
                    connected: true,
                    canControl: canControl,
                    playing: false,
                    error: "api",
                    scope: tokens.scope || "",
                  }),
                );
                return;
              }
              var item = result.json.item || null;
              var artists = [];
              if (item && Array.isArray(item.artists)) {
                artists = item.artists
                  .map(function (a) {
                    if (a && a.name) {
                      return String(a.name);
                    } else {
                      return "";
                    }
                  })
                  .filter(Boolean);
              }
              var art = "";
              try {
                var images = item && item.album && item.album.images;
                if (images && images.length) {
                  // Prefer medium (~300) then largest
                  var mid = images.length > 1 ? images[1] : images[0];
                  art = String((mid && mid.url) || images[0].url || "");
                }
              } catch (eArt) {}
              res.writeHead(200, {
                "Content-Type": "application/json",
              });
              res.end(
                JSON.stringify({
                  ok: true,
                  connected: true,
                  canControl: canControl,
                  playing: !!result.json.is_playing,
                  progressMs: Number(result.json.progress_ms || 0),
                  durationMs:
                    item && item.duration_ms != null
                      ? Number(item.duration_ms)
                      : 0,
                  title: item && item.name ? String(item.name) : "",
                  artists: artists,
                  artist: artists.join(", "),
                  album:
                    item && item.album && item.album.name
                      ? String(item.album.name)
                      : "",
                  art: art,
                  uri: item && item.uri ? String(item.uri) : "",
                  scope: tokens.scope || "",
                  needsReconnect: !canControl,
                }),
              );
            });
          })
          .catch(function () {
            res.writeHead(200, {
              "Content-Type": "application/json",
            });
            res.end(
              JSON.stringify({
                ok: false,
                connected: false,
                canControl: false,
                playing: false,
                error: "network",
              }),
            );
          });
        return;
      }
      if (url === "/spotify/control" && req.method === "POST") {
        var ctrlBody = "";
        req.on("data", function (c) {
          ctrlBody += c;
        });
        req.on("end", function () {
          var action = "";
          var replied = false;
          function reply(ok, extra) {
            if (replied || res.writableEnded) {
              return;
            }
            replied = true;
            try {
              res.writeHead(200, {
                "Content-Type": "application/json",
              });
              res.end(
                JSON.stringify(
                  Object.assign(
                    {
                      ok: !!ok,
                    },
                    extra || {},
                  ),
                ),
              );
            } catch (eReply) {}
          }
          try {
            var d = JSON.parse(ctrlBody || "{}");
            action = String(d.action || "").toLowerCase();
          } catch (eCtrl) {}
          if (action === "prev") {
            action = "previous";
          }
          ensureSpotifyAccessToken()
            .then(function (tokens) {
              if (!tokens || !tokens.access_token) {
                reply(false, {
                  error: "not_connected",
                });
                return;
              }
              var scope = String(tokens.scope || "");
              if (!spotifyHasControlScope(tokens)) {
                reply(false, {
                  error: "missing_scope",
                  needsReconnect: true,
                  scope: scope,
                  hint: "Tu login es viejo: falta permiso de control. Tocá Reconectar en Options de Spotify y aceptá TODOS los permisos.",
                });
                return;
              }
              function runPlayer(method, apiPath, deviceId, retried) {
                var pathWithDevice = withSpotifyDeviceQuery(apiPath, deviceId);
                // Empty body + Content-Length: 0 required for play/pause PUT.
                return spotifyApiRequest(
                  method,
                  pathWithDevice,
                  tokens.access_token,
                  null,
                ).then(function (result) {
                  var ok =
                    result.statusCode === 204 ||
                    (result.statusCode >= 200 && result.statusCode < 300);
                  if (ok) {
                    reply(true, {
                      status: result.statusCode,
                      action: action,
                      deviceId: deviceId || null,
                    });
                    return;
                  }
                  var info = spotifyErrorInfo(result);
                  var needTransfer =
                    !retried &&
                    deviceId &&
                    (result.statusCode === 404 ||
                      info.reason === "NO_ACTIVE_DEVICE" ||
                      info.error === "NO_ACTIVE_DEVICE");
                  if (needTransfer) {
                    return spotifyApiRequest(
                      "PUT",
                      "/v1/me/player",
                      tokens.access_token,
                      {
                        device_ids: [deviceId],
                        play: action === "play" || methodUpperIsPlay(apiPath),
                      },
                    ).then(function () {
                      return runPlayer(method, apiPath, deviceId, true);
                    });
                  }
                  reply(false, {
                    status: info.status,
                    error: info.error,
                    reason: info.reason,
                    message: info.message,
                    deviceId: deviceId || null,
                  });
                });
              }
              function methodUpperIsPlay(apiPath) {
                return String(apiPath || "").indexOf("/play") !== -1;
              }
              function resolveActionThenRun(deviceId) {
                var map = {
                  next: {
                    method: "POST",
                    path: "/v1/me/player/next",
                  },
                  previous: {
                    method: "POST",
                    path: "/v1/me/player/previous",
                  },
                  play: {
                    method: "PUT",
                    path: "/v1/me/player/play",
                  },
                  pause: {
                    method: "PUT",
                    path: "/v1/me/player/pause",
                  },
                };
                if (action === "toggle") {
                  // /me/player is more reliable for is_playing than currently-playing.
                  return spotifyApiGet(
                    "/v1/me/player",
                    tokens.access_token,
                  ).then(function (cur) {
                    var playing = !!cur.json && !!cur.json.is_playing;
                    // If no player payload, assume we should pause when user hits toggle while "playing" UI,
                    // otherwise try play.
                    if (cur.statusCode === 204 || cur.empty || !cur.json) {
                      playing = false;
                    }
                    action = playing ? "pause" : "play";
                    return runPlayer(
                      "PUT",
                      playing ? "/v1/me/player/pause" : "/v1/me/player/play",
                      deviceId,
                    );
                  });
                }
                var spec = map[action];
                if (!spec) {
                  reply(false, {
                    error: "bad_action",
                  });
                  return null;
                }
                return runPlayer(spec.method, spec.path, deviceId);
              }
              return resolveSpotifyDeviceId(tokens.access_token).then(
                function (dev) {
                  if (dev.deviceId) {
                    return resolveActionThenRun(dev.deviceId);
                  }
                  // Fallback: active player device when /devices is empty.
                  return spotifyApiGet(
                    "/v1/me/player",
                    tokens.access_token,
                  ).then(function (cur) {
                    var fallbackId =
                      cur && cur.json && cur.json.device && cur.json.device.id
                        ? String(cur.json.device.id)
                        : "";
                    if (!fallbackId) {
                      reply(false, {
                        error: "no_device",
                        hint: "Abrí Spotify en la PC/celular y dale play una vez, después usá los controles de Space.",
                      });
                      return;
                    }
                    return resolveActionThenRun(fallbackId);
                  });
                },
              );
            })
            .catch(function () {
              reply(false, {
                error: "network",
              });
            });
        });
        return;
      }

      // Handler do callback do Discord OAuth
      if (url === "/callback") {
        var params = new URLSearchParams(queryString);
        var code = params.get("code");
        var error = params.get("error");
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
        });
        if (error) {
          res.end(`
                    <html><head><meta charset="utf-8"><title>HaxBall Space</title>
                    <style>body{background:#1a1a2e;color:#fff;font-family:system-ui;display:flex;justify-content:center;align-items:center;height:100vh;margin:0}
                    .container{text-align:center;padding:40px;background:#16213e;border-radius:12px;border:1px solid #ff4444}
                    h2{color:#ff4444;margin:0 0 10px 0}p{color:#888;margin:0}</style></head>
                    <body><div class="container"><h2>Login cancelado</h2><p>Você pode fechar esta janela</p></div></body></html>
                `);
          return;
        }
        if (code) {
          exchangeCodeWithBackend(code)
            .then(function (data) {
              currentUser = upsertAccount({
                logged_in: true,
                discord_id: data.discord_id,
                nick: data.nick,
                username: data.username,
                avatar: data.avatar || null,
                access_token: data.access_token || null,
                api_token: data.api_token || null,
                is_plus: !!data.is_plus || (!!data.user && !!data.user.is_plus),
              });
              try {
                if (
                  !launcherPhaseComplete &&
                  mainWindow &&
                  !mainWindow.isDestroyed()
                ) {
                  showLauncherInMainWindow();
                }
              } catch (eRel) {}
              var safeNick = String(data.nick || data.username || "")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
              res.end(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Space Client</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{
    display:flex;align-items:center;justify-content:center;background:#000;color:#f2f3f5;
    font-family:"gg sans","Whitney","Helvetica Neue",Helvetica,Arial,sans-serif;
    -webkit-font-smoothing:antialiased;overflow:hidden;
  }
  .bg{
    position:fixed;inset:-40px;z-index:0;
    background:#000 url("http://127.0.0.1:5483/ui/assets/themes/japan.png") center/cover no-repeat;
    filter:blur(18px) brightness(0.55) contrast(1.05) saturate(0.9);
    transform:scale(1.08);
  }
  .veil{
    position:fixed;inset:0;z-index:1;pointer-events:none;
    background:linear-gradient(180deg,rgba(0,0,0,.45) 0%,rgba(0,0,0,.28) 45%,rgba(0,0,0,.55) 100%);
  }
  .verifyConnectedAccount{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;padding:24px;max-width:560px}
  .logos{display:flex;align-items:center;justify-content:center;gap:24px;margin-bottom:24px}
  .logo{width:84px;height:84px;background-repeat:no-repeat;background-position:center;background-size:contain}
  .logoDiscord{width:68px;height:68px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 127.14 96.36'%3E%3Cpath fill='%23fff' d='M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0 105.89 105.89 0 0 0 19.39 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.87-72.15ZM42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.45-12.74S54 46 53.89 53s-5.04 12.69-11.44 12.69Zm42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53s-5.08 12.69-11.43 12.69Z'/%3E%3C/svg%3E")}
  .logoSpace{width:96px;height:96px;background-image:url("http://127.0.0.1:5483/ui/logos/starpng.png");filter:brightness(0) invert(1)}
  .logosDivider{width:24px;height:24px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' fill-opacity='0.55' d='M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:center;background-size:22px 22px}
  .message{color:#fff;font-size:20px;font-weight:400;line-height:1.3;margin:0 0 8px;text-shadow:0 1px 12px rgba(0,0,0,.35)}
  .message strong{font-weight:700}
  .message.details{color:rgba(255,255,255,.55);font-size:14px;font-weight:400;line-height:1.4;margin:0;text-shadow:none}
</style>
</head>
<body>
  <div class="bg" aria-hidden="true"></div>
  <div class="veil" aria-hidden="true"></div>
  <div class="verifyConnectedAccount">
    <div>
      <div class="logos">
        <div class="logo logoSpace" aria-label="Space"></div>
        <div class="logosDivider" aria-hidden="true"></div>
        <div class="logo logoDiscord" aria-label="Discord"></div>
      </div>
      <div class="message">Se ha conectado tu cuenta de <strong>Space</strong> a <strong>Discord</strong></div>
      <div class="message details">Puedes cerrar esta ventana y volver a Space.</div>
    </div>
  </div>
</body>
</html>`);
            })
            .catch(function (err) {
              var raw = err && err.message ? String(err.message) : "";
              var msg =
                /timeout|unavailable|ECONN|ENOTFOUND|ETIMEDOUT|Backend/i.test(
                  raw,
                )
                  ? "No se pudo conectar con el servidor. Probá de nuevo en un momento."
                  : raw.replace(/</g, "&lt;") || "Error desconocido";
              res.end(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Space Client</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#000;font-family:"gg sans","Segoe UI",system-ui,sans-serif;color:#f2f3f5;overflow:hidden}
  .bg{position:fixed;inset:-40px;z-index:0;background:#000 url("http://127.0.0.1:5483/ui/assets/themes/japan.png") center/cover no-repeat;filter:blur(18px) brightness(0.45);transform:scale(1.08)}
  .veil{position:fixed;inset:0;z-index:1;background:rgba(0,0,0,.45);pointer-events:none}
  .wrap{position:relative;z-index:2;text-align:center;padding:32px 24px;max-width:480px}
  h1{font-size:20px;font-weight:600;margin:0 0 10px;color:#f23f43}
  p{font-size:14px;line-height:1.45;color:rgba(255,255,255,.55);margin:0}
</style>
</head>
<body>
  <div class="bg" aria-hidden="true"></div>
  <div class="veil" aria-hidden="true"></div>
  <div class="wrap">
    <h1>No se pudo conectar</h1>
    <p>${msg}</p>
    <p style="margin-top:12px">Puedes cerrar esta ventana e intentarlo de nuevo.</p>
  </div>
</body>
</html>`);
            });
          return;
        }
        res.end(
          "<html><body><h2>Erro: Código não encontrado</h2></body></html>",
        );
        return;
      }

      // Serve o game-min.js com proteção HARDCORE
      if (url === "/game-min.js") {
        if (!decryptedGameCode) {
          res.writeHead(500);
          res.end("Error");
          return;
        }

        // Validate mode: default to the same XOR loader used in production.
        // Set STAR_VALIDATE_PLAIN=1 only when debugging without the protected loader.
        var payload =
          STAR_VALIDATE_CREATE && process.env.STAR_VALIDATE_PLAIN === "1"
            ? decryptedGameCode
            : generateProtectedLoader(decryptedGameCode);
        res.writeHead(200, {
          "Content-Type": "application/javascript",
          "Cache-Control": "no-store",
        });
        res.end(payload);
        return;
      }

      // Serve Star UI local (menu overlay)
      if (url === "/ui/star-menu.html" || url.indexOf("/ui/") === 0) {
        var rel = url.replace(/^\/ui\//, "").replace(/\.\./g, "");
        if (!rel || rel.indexOf("..") !== -1) {
          res.writeHead(400);
          res.end("Bad path");
          return;
        }
        var uiPath = path.join(__dirname, "ui", rel);
        if (!fs.existsSync(uiPath) || !fs.statSync(uiPath).isFile()) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        var ext = path.extname(uiPath).toLowerCase();
        var mime = "application/octet-stream";
        if (ext === ".html") {
          mime = "text/html; charset=utf-8";
        } else if (ext === ".js") {
          mime = "application/javascript; charset=utf-8";
        } else if (ext === ".css") {
          mime = "text/css; charset=utf-8";
        } else if (ext === ".png") {
          mime = "image/png";
        } else if (ext === ".jpg" || ext === ".jpeg") {
          mime = "image/jpeg";
        } else if (ext === ".webp") {
          mime = "image/webp";
        } else if (ext === ".svg") {
          mime = "image/svg+xml";
        } else if (ext === ".woff2") {
          mime = "font/woff2";
        } else if (ext === ".ttf") {
          mime = "font/ttf";
        } else if (ext === ".mp3") {
          mime = "audio/mpeg";
        }
        res.writeHead(200, {
          "Content-Type": mime,
          "Cache-Control": "no-store",
        });
        res.end(fs.readFileSync(uiPath));
        return;
      }

      // Bundle extension scripts for runtime.js (optional path)
      if (url === "/secure/extensions") {
        var scripts = {};
        var extDir = path.join(__dirname, "extensions");
        try {
          var files = fs.readdirSync(extDir);
          for (var fi = 0; fi < files.length; fi++) {
            var fname = files[fi];
            if (!/\.js$/i.test(fname)) {
              continue;
            }
            var key = fname.replace(/\.js$/i, "");
            try {
              scripts[key] = fs.readFileSync(path.join(extDir, fname), "utf8");
            } catch (e) {}
          }
        } catch (e) {}
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        });
        res.end(
          JSON.stringify({
            scripts: scripts,
          }),
        );
        return;
      }
      if (url === "/user") {
        sendJson(res, 200, getPublicUserPayload(currentUser));
        return;
      }
      if (url === "/accounts" && req.method === "GET") {
        sendJson(res, 200, listPublicAccounts());
        return;
      }
      if (url === "/accounts/switch" && req.method === "POST") {
        readRequestBody(req).then(function (body) {
          var switched = switchActiveAccount(body && body.discord_id);
          if (!switched) {
            sendJson(res, 404, {
              error: "account not found",
            });
            return;
          }
          currentUser = switched;
          sendJson(res, 200, {
            ok: true,
            user: getPublicUserPayload(currentUser),
            accounts: listPublicAccounts(),
          });
        });
        return;
      }
      if (url === "/accounts/remove" && req.method === "POST") {
        readRequestBody(req).then(function (body) {
          var removeId = String((body && body.discord_id) || "").trim();
          if (!removeId) {
            sendJson(res, 400, {
              error: "discord_id required",
            });
            return;
          }
          var nextActive = removeAccount(removeId);
          currentUser = nextActive;
          sendJson(res, 200, {
            ok: true,
            logged_in: !!currentUser && !!currentUser.logged_in,
            user: getPublicUserPayload(currentUser),
            accounts: listPublicAccounts(),
          });
        });
        return;
      }
      if (url === "/accounts/add" && req.method === "POST") {
        if (LOCAL_DEV_MODE) {
          ensureLocalDevUser();
          sendJson(res, 200, {
            ok: true,
            user: getPublicUserPayload(currentUser),
          });
          return;
        }
        var addAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(DISCORD_SCOPES)}&prompt=consent`;
        shell.openExternal(addAuthUrl);
        sendJson(res, 200, {
          ok: true,
        });
        return;
      }
      if (url === "/auth/me" && req.method === "GET") {
        if (!currentUser || !currentUser.logged_in || !currentUser.api_token) {
          sendJson(res, 401, {
            error: "not logged in",
            reauth_required: true,
          });
          return;
        }
        backendRequest("GET", "/auth/me", {
          headers: {
            Authorization: "Bearer " + currentUser.api_token,
          },
        })
          .then(function (result) {
            if (result.statusCode === 401) {
              sendJson(res, 401, {
                error: (result.json && result.json.error) || "unauthorized",
                reauth_required: true,
              });
              return;
            }
            if (
              result.statusCode >= 200 &&
              result.statusCode < 300 &&
              result.json &&
              result.json.user &&
              currentUser
            ) {
              currentUser = upsertAccount(
                Object.assign({}, currentUser, {
                  is_plus: !!result.json.user.is_plus,
                }),
              );
            }
            sendJson(res, result.statusCode, result.json || {});
          })
          .catch(function (err) {
            sendJson(res, 502, {
              error: err && err.message ? err.message : "backend unavailable",
            });
          });
        return;
      }
      if (url === "/groups" && req.method === "GET") {
        proxyAuthenticatedBackend(req, res, "GET", "/groups");
        return;
      }
      if (url === "/groups" && req.method === "POST") {
        readRequestBody(req).then(function (body) {
          return proxyAuthenticatedBackend(req, res, "POST", "/groups", body);
        });
        return;
      }
      var groupDetailMatch = url.match(/^\/groups\/(\d+)$/);
      if (groupDetailMatch && req.method === "GET") {
        proxyAuthenticatedBackend(
          req,
          res,
          "GET",
          "/groups/" + groupDetailMatch[1],
        );
        return;
      }
      var groupMembersMatch = url.match(/^\/groups\/(\d+)\/members$/);
      if (groupMembersMatch && req.method === "POST") {
        readRequestBody(req).then(function (body) {
          return proxyAuthenticatedBackend(
            req,
            res,
            "POST",
            "/groups/" + groupMembersMatch[1] + "/members",
            body,
          );
        });
        return;
      }
      var groupMemberDelMatch = url.match(
        /^\/groups\/(\d+)\/members\/([^/]+)$/,
      );
      if (groupMemberDelMatch && req.method === "DELETE") {
        proxyAuthenticatedBackend(
          req,
          res,
          "DELETE",
          "/groups/" +
            groupMemberDelMatch[1] +
            "/members/" +
            encodeURIComponent(decodeURIComponent(groupMemberDelMatch[2])),
        );
        return;
      }
      var groupMessagesMatch = url.match(/^\/groups\/(\d+)\/messages$/);
      if (groupMessagesMatch && req.method === "GET") {
        var groupMsgId = groupMessagesMatch[1];
        var groupAfterParam = "";
        try {
          var gMsgSearch = new URLSearchParams(queryString);
          var gAfterVal = String(gMsgSearch.get("after") || "").trim();
          var gMarkReadVal = String(gMsgSearch.get("mark_read") || "").trim();
          var gQs = [];
          if (gAfterVal) {
            gQs.push("after=" + encodeURIComponent(gAfterVal));
          }
          if (gMarkReadVal) {
            gQs.push("mark_read=" + encodeURIComponent(gMarkReadVal));
          }
          if (gQs.length) {
            groupAfterParam = "?" + gQs.join("&");
          }
        } catch (eGAfter) {}
        proxyAuthenticatedBackend(
          req,
          res,
          "GET",
          "/groups/" + groupMsgId + "/messages" + groupAfterParam,
        );
        return;
      }
      if (groupMessagesMatch && req.method === "POST") {
        readRequestBody(req).then(function (body) {
          return proxyAuthenticatedBackend(
            req,
            res,
            "POST",
            "/groups/" + groupMessagesMatch[1] + "/messages",
            body,
          );
        });
        return;
      }
      var groupMsgDelMatch = url.match(/^\/groups\/(\d+)\/messages\/(\d+)$/);
      if (groupMsgDelMatch && req.method === "DELETE") {
        proxyAuthenticatedBackend(
          req,
          res,
          "DELETE",
          "/groups/" + groupMsgDelMatch[1] + "/messages/" + groupMsgDelMatch[2],
        );
        return;
      }
      if (url === "/friends" && req.method === "GET") {
        proxyAuthenticatedBackend(req, res, "GET", "/friends");
        return;
      }
      if (url === "/friends/requests" && req.method === "GET") {
        proxyAuthenticatedBackend(req, res, "GET", "/friends/requests");
        return;
      }
      if (url === "/friends/requests" && req.method === "POST") {
        readRequestBody(req).then(function (body) {
          return proxyAuthenticatedBackend(
            req,
            res,
            "POST",
            "/friends/requests",
            body,
          );
        });
        return;
      }
      if (url.indexOf("/friends/requests/") === 0 && req.method === "POST") {
        var acceptMatchEarly = url.match(
          /^\/friends\/requests\/(\d+)\/accept$/,
        );
        var declineMatchEarly = url.match(
          /^\/friends\/requests\/(\d+)\/decline$/,
        );
        if (acceptMatchEarly) {
          proxyAuthenticatedBackend(
            req,
            res,
            "POST",
            "/friends/requests/" + acceptMatchEarly[1] + "/accept",
            {},
          );
          return;
        }
        if (declineMatchEarly) {
          proxyAuthenticatedBackend(
            req,
            res,
            "POST",
            "/friends/requests/" + declineMatchEarly[1] + "/decline",
            {},
          );
          return;
        }
      }
      var messagesMatch = url.match(/^\/friends\/([^/]+)\/messages$/);
      if (messagesMatch && req.method === "GET") {
        var friendMsgId = decodeURIComponent(messagesMatch[1] || "").trim();
        var afterParam = "";
        try {
          var msgSearch = new URLSearchParams(queryString);
          var afterVal = String(msgSearch.get("after") || "").trim();
          var markReadVal = String(msgSearch.get("mark_read") || "").trim();
          var qs = [];
          if (afterVal) {
            qs.push("after=" + encodeURIComponent(afterVal));
          }
          if (markReadVal) {
            qs.push("mark_read=" + encodeURIComponent(markReadVal));
          }
          if (qs.length) {
            afterParam = "?" + qs.join("&");
          }
        } catch (eAfter) {}
        proxyAuthenticatedBackend(
          req,
          res,
          "GET",
          "/friends/" +
            encodeURIComponent(friendMsgId) +
            "/messages" +
            afterParam,
        );
        return;
      }
      if (messagesMatch && req.method === "POST") {
        var friendMsgPostId = decodeURIComponent(messagesMatch[1] || "").trim();
        readRequestBody(req).then(function (body) {
          return proxyAuthenticatedBackend(
            req,
            res,
            "POST",
            "/friends/" + encodeURIComponent(friendMsgPostId) + "/messages",
            body,
          );
        });
        return;
      }
      var readMatch = url.match(/^\/friends\/([^/]+)\/read$/);
      if (readMatch && req.method === "POST") {
        var friendReadId = decodeURIComponent(readMatch[1] || "").trim();
        readRequestBody(req).then(function (body) {
          return proxyAuthenticatedBackend(
            req,
            res,
            "POST",
            "/friends/" + encodeURIComponent(friendReadId) + "/read",
            body,
          );
        });
        return;
      }
      var messageDeleteMatch = url.match(
        /^\/friends\/([^/]+)\/messages\/(\d+)$/,
      );
      if (messageDeleteMatch && req.method === "DELETE") {
        var friendMsgDelId = decodeURIComponent(
          messageDeleteMatch[1] || "",
        ).trim();
        var msgDelId = String(messageDeleteMatch[2] || "").trim();
        if (!friendMsgDelId || !msgDelId) {
          sendJson(res, 400, {
            error: "message_id required",
          });
          return;
        }
        proxyAuthenticatedBackend(
          req,
          res,
          "DELETE",
          "/friends/" +
            encodeURIComponent(friendMsgDelId) +
            "/messages/" +
            encodeURIComponent(msgDelId),
        );
        return;
      }
      if (url.indexOf("/friends/") === 0 && req.method === "DELETE") {
        var friendIdEarly = decodeURIComponent(
          url.slice("/friends/".length).split("?")[0] || "",
        ).trim();
        if (!friendIdEarly || friendIdEarly.indexOf("/") !== -1) {
          sendJson(res, 400, {
            error: "discord_id required",
          });
          return;
        }
        proxyAuthenticatedBackend(
          req,
          res,
          "DELETE",
          "/friends/" + encodeURIComponent(friendIdEarly),
        );
        return;
      }
      if (url.startsWith("/users/search") && req.method === "GET") {
        var searchParamsEarly = new URLSearchParams(queryString);
        var qEarly = String(searchParamsEarly.get("q") || "").trim();
        proxyAuthenticatedBackend(
          req,
          res,
          "GET",
          "/users/search?q=" + encodeURIComponent(qEarly),
        );
        return;
      }
      res.writeHead(200, {
        "Content-Type": "application/json",
      });

      // Endpoint /auth - abre o navegador com a URL do Discord OAuth
      if (url === "/auth") {
        if (LOCAL_DEV_MODE) {
          ensureLocalDevUser();
          res.end(
            JSON.stringify({
              ok: true,
              user: getPublicUserPayload(currentUser),
            }),
          );
          return;
        }
        var authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(DISCORD_SCOPES)}&prompt=consent`;
        shell.openExternal(authUrl);
        res.end('{"ok":true}');
        return;
      }
      if (url === "/version") {
        res.end(
          JSON.stringify({
            version: APP_VERSION,
            build: APP_CLIENT_BUILD,
            update: spaceUpdater ? spaceUpdater.getState() : null,
          }),
        );
        return;
      } else if (url === "/star-validate") {
        res.end(STAR_VALIDATE_CREATE ? "1" : "0");
      } else if (url === "/star-diag") {
        res.end(
          JSON.stringify({
            ok: true,
            hasGame: !!decryptedGameCode,
            gameBytes: decryptedGameCode ? decryptedGameCode.length : 0,
            hasHook:
              !!decryptedGameCode &&
              decryptedGameCode.indexOf("__starCreateNativeRoom") !== -1,
            hasRq:
              !!decryptedGameCode &&
              decryptedGameCode.indexOf("static Rq(") !== -1,
            port: PORT,
            validate: STAR_VALIDATE_CREATE,
          }),
        );
        return;
      } else if (url === "/status") {
        res.end('{"ok":true}');
      } else if (url === "/verified-v2") {
        // Stub: verified UI kept, backend API removed
        let body = "";
        req.on("data", function (c) {
          body += c;
        });
        req.on("end", function () {
          res.end("{}");
        });
        return;
      } else if (url.startsWith("/user/by-nick")) {
        res.end("null");
        return;
      } else if (
        url === "/session/player-id" ||
        url === "/session/game-nick" ||
        url === "/session/leave-room"
      ) {
        // No-op stubs for leftover client calls
        if (req.method === "POST") {
          let body = "";
          req.on("data", function (c) {
            body += c;
          });
          req.on("end", function () {
            if (url === "/session/leave-room") {
              setRpcActivity({
                details:
                  (discordPresence &&
                    discordPresence.detailsMenu &&
                    discordPresence.detailsMenu()) ||
                  "En el menú",
                state: "discord.gg/spacehax",
                smallText:
                  (currentUser && (currentUser.nick || currentUser.username)) ||
                  "",
              });
              forwardPresenceToBackend({
                room_name: null,
                room_link: null,
                is_online: true,
              });
            }
            res.end('{"ok":true,"success":true}');
          });
          return;
        }
        res.end('{"ok":true,"success":true}');
        return;
      } else if (url === "/presence") {
        if (req.method === "POST") {
          var presenceBody = "";
          req.on("data", function (c) {
            presenceBody += c;
          });
          req.on("end", function () {
            var payload = {};
            try {
              payload = presenceBody ? JSON.parse(presenceBody) : {};
            } catch (ePres) {
              payload = {};
            }
            if (currentUser && (currentUser.nick || currentUser.username)) {
              payload.small_text = currentUser.nick || currentUser.username;
            }
            setRpcFromPresence(payload);
            forwardPresenceToBackend(payload);
            res.end('{"ok":true,"success":true}');
          });
          return;
        }
        res.end('{"ok":true,"success":true}');
        return;
      } else if (url === "/open-external") {
        var body = "";
        req.on("data", function (c) {
          body += c;
        });
        req.on("end", function () {
          try {
            var d = JSON.parse(body);
            if (d.url) {
              shell.openExternal(d.url);
            }
          } catch (e) {}
          res.end('{"ok":true}');
        });
        return;
      } else if (url === "/logout") {
        if (req.method === "POST") {
          var logoutBody = "";
          req.on("data", function (c) {
            logoutBody += c;
          });
          req.on("end", function () {
            currentUser = logoutCurrentUser();
            res.end(
              JSON.stringify({
                ok: true,
                logged_in: !!currentUser && !!currentUser.logged_in,
              }),
            );
          });
          return;
        }
        currentUser = logoutCurrentUser();
        res.end(
          JSON.stringify({
            ok: true,
            logged_in: !!currentUser && !!currentUser.logged_in,
          }),
        );
        return;
      } else if (url === "/close") {
        res.end('{"ok":true}');
        setTimeout(function () {
          try {
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.close();
            }
          } catch (e) {}
          app.quit();
        }, 50);
        return;
      } else {
        res.end('{"ok":true}');
      }
    });
    server.listen(PORT, "127.0.0.1", function () {
      // Server listo en 5483 (solo mientras Space está abierto).
    });

    // Fallback protocol (legacy). Prefer HTTP below — with privileges.standard=true,
    // Electron rewrites hxd://game-min.js to hxd://game-min.js/ and exact-match fails,
    // which leaves the game iframe blank: no roomlist, no create, Star UI looks "disconnected".
    protocol.registerBufferProtocol("hxd", function (request, callback) {
      var u = String(request.url || "");
      if (u.indexOf("game-min") !== -1) {
        if (!decryptedGameCode) {
          callback({
            error: -2,
          });
          return;
        }
        var loader = generateProtectedLoader(decryptedGameCode);
        callback({
          mimeType: "application/javascript",
          data: Buffer.from(loader, "utf8"),
        });
      } else {
        callback({
          error: -2,
        });
      }
    });

    // Always serve patched game-min.js over local HTTP (same path validate uses — reliable).
    session.defaultSession.webRequest.onBeforeRequest(
      function (details, callback) {
        if (
          details.url.indexOf("127.0.0.1") !== -1 ||
          details.url.indexOf("localhost") !== -1
        ) {
          callback({});
          return;
        }
        if (details.url.indexOf("game-min.js") !== -1) {
          callback({
            redirectURL: "http://127.0.0.1:5483/game-min.js",
          });
        } else {
          callback({});
        }
      },
    );

    // Carrega extensão com retry e validação
    function loadExtensionWithRetry(extPath, retries = 3) {
      console.log("[EXT] Tentando carregar extensão de:", extPath);

      // Valida que o path existe e tem manifest.json
      if (!fs.existsSync(extPath)) {
        console.log("[EXT] ERRO: Path não existe:", extPath);
        if (retries > 0) {
          console.log("[EXT] Tentando reextrair...");
          extPath = extractExtensions();
          return loadExtensionWithRetry(extPath, retries - 1);
        }
        return;
      }
      var manifestPath = path.join(extPath, "manifest.json");
      if (!fs.existsSync(manifestPath)) {
        console.log("[EXT] ERRO: manifest.json não encontrado em:", extPath);
        if (retries > 0) {
          console.log("[EXT] Tentando reextrair...");
          extPath = extractExtensions();
          return loadExtensionWithRetry(extPath, retries - 1);
        }
        return;
      }

      // Tenta carregar
      session.defaultSession
        .loadExtension(extPath, {
          allowFileAccess: true,
        })
        .then(function (ext) {
          console.log("[EXT] Extensão carregada com sucesso:", ext.name);
        })
        .catch(function (err) {
          console.log("[EXT] ERRO ao carregar extensão:", err.message);

          // Se falhou e ainda tem retries, tenta novamente
          if (retries > 0) {
            console.log(
              "[EXT] Tentando novamente... (tentativas restantes:",
              retries,
              ")",
            );
            setTimeout(function () {
              extPath = extractExtensions();
              loadExtensionWithRetry(extPath, retries - 1);
            }, 1000);
          } else {
            console.log(
              "[EXT] FALHA CRÍTICA: Não foi possível carregar extensão após todas as tentativas",
            );
          }
        });
    }
    loadExtensionWithRetry(extPath);

    // Cria janela (sin barra nativa de Windows — chrome custom en el launcher)
    mainWindow = new BrowserWindow({
      width: 1440,
      height: 860,
      title: "HaxBall Space",
      icon: path.join(__dirname, "icon.ico"),
      show: false,
      frame: false,
      titleBarStyle: "hidden",
      backgroundColor: "#050505",
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        webSecurity: false,
        allowRunningInsecureContent: true,
        // Throttle when occluded / Alt+Tab — uncapped paint in background kills the GPU process.
        backgroundThrottling: true,
        devTools: STAR_VALIDATE_CREATE ? true : false,
        preload: path.join(__dirname, "preload.js"),
      },
    });
    function syncBackgroundThrottling() {
      if (!mainWindow || mainWindow.isDestroyed()) {
        return;
      }
      try {
        var focused = false;
        try {
          focused = !!mainWindow.isFocused();
        } catch (eF) {
          focused = true;
        }
        if (mainWindow.webContents.setBackgroundThrottling) {
          // Focused play: no throttle. Blur / Alt+Tab / file dialog: throttle hard.
          mainWindow.webContents.setBackgroundThrottling(!focused);
        }
      } catch (eBt) {}
    }
    try {
      mainWindow.on("focus", syncBackgroundThrottling);
      mainWindow.on("blur", syncBackgroundThrottling);
      mainWindow.on("show", syncBackgroundThrottling);
      mainWindow.on("hide", syncBackgroundThrottling);
    } catch (eFocusHooks) {}
    syncBackgroundThrottling();

    // Validate mode: show off-screen so Chromium still paints/runs the game,
    // without flashing a normal window to the user.
    if (STAR_VALIDATE_CREATE) {
      try {
        mainWindow.setPosition(-20000, -20000);
        mainWindow.showInactive();
      } catch (eOff) {
        try {
          mainWindow.show();
        } catch (eShow) {}
      }
      try {
        if (mainWindow.webContents.setBackgroundThrottling) {
          mainWindow.webContents.setBackgroundThrottling(false);
        }
      } catch (eBt) {}
    }
    try {
      if (app.__hxdCleanUA) {
        mainWindow.webContents.setUserAgent(app.__hxdCleanUA);
      }
    } catch (eSetUa) {}
    mainWindow.setMenu(null);
    setLauncherWindowConstraints(true);
    mainWindow.on("maximize", function () {
      if (!launcherPhaseComplete && mainWindow && !mainWindow.isDestroyed()) {
        try {
          mainWindow.unmaximize();
        } catch (eUnmax) {}
      }
    });
    globalShortcut.register("CommandOrControl+E", function () {
      if (mainWindow) {
        mainWindow.webContents.openDevTools();
      }
    });
    globalShortcut.register("CommandOrControl+H", function () {
      if (mainWindow) {
        mainWindow.webContents.executeJavaScript(`
                try {
                    var frame = document.getElementById('star-menu-frame');
                    if (frame && frame.contentWindow) {
                        frame.contentWindow.postMessage({ type: 'star:open-config' }, '*');
                    }
                    window.postMessage({ type: 'star:open-settings' }, '*');
                } catch (e) {}
            `);
      }
    });

    // Proteção: fecha DevTools se abrir (redundante mas seguro)
    mainWindow.webContents.on("devtools-opened", function () {
      if (STAR_VALIDATE_CREATE) {
        return;
      }
      mainWindow.webContents.closeDevTools();
    });
    mainWindow.webContents.on("render-process-gone", function (event, details) {
      if (!details || details.reason === "clean-exit") {
        return;
      }
      recoverFromRendererCrash(
        details.reason || "unknown",
        "render-process-gone",
      );
    });
    mainWindow.webContents.on("unresponsive", function () {
      logCrash("webContents unresponsive");
    });
    mainWindow.webContents.on("responsive", function () {
      rendererRecoverAttempts = 0;
    });
    mainWindow.webContents.on("did-finish-load", function () {
      rendererRecoverAttempts = 0;
    });

    // Click direito é controlado pela extensão security.js
    // Permite em: lista de salas, jogadores individuais
    // Bloqueia no resto

    // CDP validate must attach BEFORE navigation so we catch main-world contexts.
    var validateDbg = null;
    var validateFrameContexts = {}; // frameId -> { defaultId, anyId }
    if (STAR_VALIDATE_CREATE) {
      try {
        validateDbg = mainWindow.webContents.debugger;
        if (!validateDbg.isAttached()) {
          validateDbg.attach("1.3");
        }
        validateDbg.on("message", function (event, method, params) {
          if (
            method === "Runtime.executionContextCreated" &&
            params &&
            params.context
          ) {
            var ctx = params.context;
            var aux = ctx.auxData || {};
            var frameId = aux.frameId;
            if (!frameId) {
              return;
            }
            if (!validateFrameContexts[frameId]) {
              validateFrameContexts[frameId] = {
                defaultId: null,
                anyId: null,
              };
            }
            validateFrameContexts[frameId].anyId = ctx.id;
            if (aux.isDefault) {
              validateFrameContexts[frameId].defaultId = ctx.id;
            }
          }
        });
        validateDbg.sendCommand("Page.enable", {}).catch(function () {});
        validateDbg.sendCommand("Runtime.enable", {}).catch(function () {});
        validateDbg.sendCommand("Log.enable", {}).catch(function () {});
        // Mark validate mode before any frame JS runs (skip Star overlay).
        validateDbg
          .sendCommand("Page.addScriptToEvaluateOnNewDocument", {
            source:
              'window.__STAR_VALIDATE_CREATE=true;try{document.documentElement.setAttribute("data-star-validate","1");}catch(e){}',
          })
          .catch(function () {});
      } catch (eValAttach) {
        writeValidateResult({
          ok: false,
          info: {
            error: "debugger_attach_failed",
            message: String((eValAttach && eValAttach.message) || eValAttach),
          },
          at: new Date().toISOString(),
        });
        setTimeout(function () {
          try {
            app.quit();
          } catch (e) {}
        }, 200);
      }
    }
    mainWindow.once("ready-to-show", function () {
      isLaunchingGame = false;
      if (STAR_VALIDATE_CREATE) {
        runCreateRoomValidation();
        return;
      }
      mainWindow.show();

      // Verifica se extensões foram carregadas após 3 segundos
      setTimeout(function () {
        var extensions = session.defaultSession.getAllExtensions();
        var loaded = false;
        for (var id in extensions) {
          if (extensions[id].name === "HaxBall Space") {
            loaded = true;
            console.log("[EXT] Verificação: Extensão está carregada");
            break;
          }
        }
        if (!loaded) {
          console.log(
            "[EXT] AVISO: Extensão não foi carregada! O jogo pode não funcionar corretamente.",
          );
        }
      }, 3000);
    });
    function runCreateRoomValidation() {
      // Electron 13: CDP into game iframe main world (isDefault), not extension isolates.
      var started = Date.now();
      var submitted = false;
      var done = false;
      var gameContextId = null;
      var lastSnap = null;
      var lastFrames = [];
      var dbg = validateDbg || mainWindow.webContents.debugger;
      function finish(ok, info) {
        if (done) {
          return;
        }
        done = true;
        try {
          if (dbg && dbg.isAttached()) {
            dbg.detach();
          }
        } catch (eDetach) {}
        writeValidateResult({
          ok: !!ok,
          info: Object.assign(
            {
              lastSnap: lastSnap,
              frames: lastFrames,
            },
            info || {},
          ),
          ms: Date.now() - started,
          at: new Date().toISOString(),
        });
        setTimeout(function () {
          try {
            app.quit();
          } catch (e) {}
        }, 200);
      }
      if (!dbg) {
        finish(false, {
          error: "debugger_missing",
        });
        return;
      }
      function pickContext(frameId) {
        var entry = validateFrameContexts[frameId];
        if (!entry) {
          return null;
        }
        return entry.defaultId || entry.anyId || null;
      }
      function listFrames() {
        return dbg
          .sendCommand("Page.getFrameTree", {})
          .then(function (res) {
            var out = [];
            function walk(node, depth) {
              if (!node || !node.frame) {
                return;
              }
              out.push({
                depth: depth || 0,
                id: node.frame.id,
                url: node.frame.url || "",
                name: node.frame.name || "",
                ctx: pickContext(node.frame.id),
              });
              var kids = node.childFrames || [];
              for (var i = 0; i < kids.length; i++) {
                walk(kids[i], (depth || 0) + 1);
              }
            }
            walk(res && res.frameTree, 0);
            return out;
          })
          .catch(function () {
            return [];
          });
      }
      function findGameContext() {
        return listFrames().then(function (frames) {
          lastFrames = frames;
          var hit = null;
          for (var i = 0; i < frames.length; i++) {
            var u = frames[i].url || "";
            if (
              u.indexOf("html5.haxball.com") !== -1 ||
              u.indexOf("game.html") !== -1 ||
              u.indexOf("/html5/") !== -1
            ) {
              hit = frames[i];
              break;
            }
          }
          if (!hit) {
            return null;
          }
          gameContextId = hit.ctx;
          return gameContextId;
        });
      }
      function evalInGame(expression) {
        return findGameContext().then(function (ctxId) {
          if (!ctxId) {
            return Promise.reject(new Error("no_game_context"));
          }
          return dbg
            .sendCommand("Runtime.evaluate", {
              expression: expression,
              returnByValue: true,
              awaitPromise: false,
              contextId: ctxId,
            })
            .then(function (out) {
              if (out && out.exceptionDetails) {
                throw new Error("eval_exception");
              }
              if (out && out.result) {
                return out.result.value;
              } else {
                return null;
              }
            });
        });
      }
      var PAGE_BRIDGE_INJECT = [
        "(function(){",
        'if(window.__starPageCreateBridge)return "ready";',
        "window.__starPageCreateBridge=true;",
        "var busy=false;",
        "function setErr(el,reason){",
        "  if(!el)return;",
        '  try{el.setAttribute("data-error",reason||"unknown");}catch(e){}',
        '  el.setAttribute("data-status","error");',
        "}",
        "function readRequest(){",
        '  var el=document.getElementById("star-native-room-request");',
        "  if(!el)return null;",
        '  try{return {el:el,data:JSON.parse(el.textContent||"{}")};}catch(e){',
        '    setErr(el,"bad_request");return null;',
        "  }",
        "}",
        "function fillNativeForm(data){",
        '  var view=document.querySelector(".create-room-view");',
        "  if(!view)return false;",
        '  var name=view.querySelector("input[data-hook=\\"name\\"]");',
        '  var pass=view.querySelector("input[data-hook=\\"pass\\"]");',
        '  var max=view.querySelector("select[data-hook=\\"max-pl\\"]");',
        '  var unlisted=view.querySelector("button[data-hook=\\"unlisted\\"]");',
        '  var create=view.querySelector("button[data-hook=\\"create\\"]");',
        "  if(!name||!create)return false;",
        "  try{",
        '    name.value=String((data&&data.name)||"Star Room").substring(0,40);',
        '    name.dispatchEvent(new Event("input",{bubbles:true}));',
        '    if(pass){pass.value=data&&data.password?String(data.password).substring(0,30):"";pass.dispatchEvent(new Event("input",{bubbles:true}));}',
        '    if(max){var mp=Math.max(2,Math.min(20,(data&&data.maxPlayers)|0||12));max.selectedIndex=mp-2;max.dispatchEvent(new Event("change",{bubbles:true}));}',
        '    if(unlisted){var text=(unlisted.textContent||"").toLowerCase();var listed=/:\\s*yes\\b/.test(text)||text.indexOf("yes")!==-1;var want=!(data&&data.showInRoomList===false);if(want!==listed)unlisted.click();}',
        '    create.disabled=false;create.removeAttribute("disabled");create.click();return true;',
        "  }catch(e){return false;}",
        "}",
        "function tryCreate(){",
        "  var req=readRequest();",
        "  if(!req)return true;",
        '  if(typeof window.__starCreateNativeRoom==="function"){',
        '    try{window.__starCreateNativeRoom(req.data);req.el.setAttribute("data-status","accepted");try{req.el.removeAttribute("data-error");}catch(e){}return true;}',
        '    catch(e){setErr(req.el,"creator_threw");return true;}',
        "  }",
        '  if(fillNativeForm(req.data)){req.el.setAttribute("data-status","accepted");try{req.el.removeAttribute("data-error");}catch(e2){}return true;}',
        "  return false;",
        "}",
        "function handleCreate(){",
        "  if(busy)return;",
        '  var el=document.getElementById("star-native-room-request");',
        '  if(!el||el.getAttribute("data-status")!=="pending")return;',
        "  busy=true;",
        "  if(tryCreate()){busy=false;return;}",
        '  var btn=document.querySelector(".roomlist-view button[data-hook=\\"create\\"]");',
        "  if(btn){try{btn.click();}catch(e){}}",
        "  var n=0;",
        "  var t=setInterval(function(){",
        "    n++;",
        "    if(tryCreate()||n>120){",
        "      clearInterval(t);busy=false;",
        '      var req=document.getElementById("star-native-room-request");',
        '      if(req&&req.getAttribute("data-status")==="pending"){',
        '        var hasList=!!document.querySelector(".roomlist-view");',
        '        setErr(req,hasList?"creator_missing":"no_roomlist");',
        "      }",
        "    }",
        "  },50);",
        "}",
        'document.addEventListener("star-native-room-create",handleCreate);',
        "setInterval(handleCreate,100);",
        'return "injected";',
        "})()",
      ].join("");
      var probe = setInterval(function () {
        if (done) {
          clearInterval(probe);
          return;
        }
        if (Date.now() - started > 90000) {
          clearInterval(probe);
          finish(false, {
            error: "timeout_before_captcha",
            submitted: submitted,
            gameContextId: gameContextId,
            contexts: validateFrameContexts,
          });
          return;
        }
        evalInGame(PAGE_BRIDGE_INJECT)
          .then(function () {
            return evalInGame(
              "(function(){var el=document.getElementById('star-native-room-request');var st=el&&el.getAttribute? (el.getAttribute('data-status')||'') : '';var dialog=!!document.querySelector('.simple-dialog-view');var captcha=!!document.querySelector('iframe[src*=\"recaptcha\"],.g-recaptcha,iframe[src*=\"anchor\"]');var title='';try{var h=document.querySelector('.simple-dialog-view h1,[data-hook=\"title\"]');title=h?(h.textContent||'').trim():'';}catch(e){}var room=!!document.querySelector('.room-view,.game-view');var roomlist=!!document.querySelector('.roomlist-view');var createForm=!!document.querySelector('.dialog input[data-hook=\"name\"],.dialog [data-hook=\"create\"]');var creator=typeof window.__starCreateNativeRoom==='function';var bridge=!!window.__starPageCreateBridge;var bodyText=(document.body&&document.body.innerText||'').slice(0,180);var href=String(location.href||'');var vis=String(document.visibilityState||'');var nick=!!document.querySelector('.choose-nickname-view');var star=!!document.getElementById('star-menu-frame');var views=[];try{var vs=document.querySelectorAll('[class*=\"-view\"]');for(var i=0;i<Math.min(vs.length,12);i++)views.push(vs[i].className);}catch(e){}var canvas=!!document.querySelector('canvas');var validateFlag=!!window.__STAR_VALIDATE_CREATE;return {st:st,dialog:dialog,captcha:captcha,title:title,room:room,roomlist:roomlist,createForm:createForm,creator:creator,bridge:bridge,bodyText:bodyText,href:href,vis:vis,nick:nick,star:star,views:views,canvas:canvas,validateFlag:validateFlag};})()",
            );
          })
          .then(function (snap) {
            if (done || !snap) {
              return;
            }
            lastSnap = snap;
            var titleLc = String(snap.title || "").toLowerCase();
            var isCaptcha =
              snap.captcha || titleLc.indexOf("only humans") !== -1;
            if (isCaptcha) {
              clearInterval(probe);
              finish(true, {
                stage: "captcha",
                snap: snap,
              });
              return;
            }
            if (snap.room) {
              clearInterval(probe);
              finish(true, {
                stage: "room_without_captcha",
                snap: snap,
              });
              return;
            }

            // Ensure nickname screen is cleared (Star overlay is disabled in validate).
            if (snap.nick) {
              return evalInGame(
                "(function(){var input=document.querySelector('.choose-nickname-view input[data-hook=\"input\"]');var ok=document.querySelector('.choose-nickname-view button[data-hook=\"ok\"]');if(!input||!ok)return 'no-nick-ui';input.value='StarValidate';input.dispatchEvent(new Event('input',{bubbles:true}));ok.click();return 'nick-submitted';})()",
              ).then(function () {});
            }

            // Do not spam create until the native room list exists.
            if (!snap.roomlist) {
              return;
            }
            return evalInGame(
              "(function(){var request=document.getElementById('star-native-room-request');if(!request){request=document.createElement('div');request.id='star-native-room-request';request.style.display='none';(document.body||document.documentElement).appendChild(request);}var st=request.getAttribute('data-status')||'';if(st==='accepted'||st==='captcha'||st==='room'){return st;}request.textContent=JSON.stringify({name:'Star Validate Room',password:'',maxPlayers:8,showInRoomList:false});request.setAttribute('data-status','pending');document.dispatchEvent(new Event('star-native-room-create'));return request.getAttribute('data-status')||'pending';})()",
            ).then(function (st) {
              if (st === "accepted" || st === "pending" || st === "captcha") {
                submitted = true;
              }
            });
          })
          .catch(function () {});
      }, 700);
    }

    // F11 = Fullscreen (F12 bloqueado)
    mainWindow.webContents.on("before-input-event", function (e, input) {
      // Só processa eventos de teclado
      if (input.type !== "keyDown") {
        return;
      }
      if (input.key === "F11") {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
      }

      // Zoom In: Ctrl + = ou Ctrl + +
      if (input.control && (input.key === "=" || input.key === "+")) {
        e.preventDefault();
        currentZoomPercent += 10;
        var zoomFactor = currentZoomPercent / 100;
        mainWindow.webContents.setZoomFactor(zoomFactor);
        showZoomIndicator(currentZoomPercent);
      }

      // Zoom Out: Ctrl + -
      if (input.control && input.key === "-") {
        e.preventDefault();
        currentZoomPercent -= 10;
        var zoomFactor = currentZoomPercent / 100;
        mainWindow.webContents.setZoomFactor(zoomFactor);
        showZoomIndicator(currentZoomPercent);
      }

      // Reset Zoom: Ctrl + 0
      if (input.control && input.key === "0") {
        e.preventDefault();
        currentZoomPercent = 100;
        mainWindow.webContents.setZoomFactor(1);
        showZoomIndicator(currentZoomPercent);
      }

      // Bloqueia F12 e Ctrl+Shift+I
      if (
        input.key === "F12" ||
        (input.control && input.shift && input.key.toLowerCase() === "i")
      ) {
        e.preventDefault();
      }
    });
    if (STAR_VALIDATE_CREATE) {
      launcherPhaseComplete = true;
      loadMainPlayPage();
    } else {
      showLauncherInMainWindow();
    }
    startDevHotReload();
    if (discordPresence) {
      loadRpcConfigFromBackend().finally(function () {
        try {
          discordPresence.start();
        } catch (eRpcStart) {}
        var nick = currentUser && (currentUser.nick || currentUser.username);
        if (nick) {
          discordPresence.setSmallText(nick);
        }
        setRpcActivity({
          details:
            (discordPresence.detailsLauncher &&
              discordPresence.detailsLauncher()) ||
            "En el launcher",
          state: "discord.gg/spacehax",
          smallText: nick || "",
          resetTimer: true,
        });
      });
    }
  } // end bootClient

  bootClient();
});
app.on("window-all-closed", function () {
  if (discordPresence) {
    try {
      discordPresence.stop();
    } catch (eRpcStop) {}
  }
  app.quit();
});
app.on("will-quit", function () {
  globalShortcut.unregisterAll();
  if (server) {
    server.close();
  }
  if (gameplayPowerSaveId != null) {
    try {
      if (powerSaveBlocker.isStarted(gameplayPowerSaveId)) {
        powerSaveBlocker.stop(gameplayPowerSaveId);
      }
    } catch (ePowerStop) {}
    gameplayPowerSaveId = null;
  }
  // Limpa pasta temp
  if (tempExtPath && tempExtIsTemporary) {
    try {
      fs.rmSync(tempExtPath, {
        recursive: true,
        force: true,
      });
    } catch (e) {}
  }
});

// Single instance
var lock = app.requestSingleInstanceLock();
if (!lock) {
  app.quit();
} else {
  app.on("second-instance", function () {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });
}
