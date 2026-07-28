(function () {
  if (Injector.isMainFrame()) {
    return;
  }
  var _0x4f163d = "haxball_host_token";
  function _0x67baf0(_0xf87c75) {
    if (window.__t) {
      return window.__t(_0xf87c75);
    } else {
      return _0xf87c75;
    }
  }
  function _0x4878de(_0x1b1e31) {
    var _0x3736f2 = _0x1b1e31.querySelector(".settings-view");
    if (!_0x3736f2) {
      return;
    }
    if (_0x3736f2.dataset.hostTokenSetup) {
      return;
    }
    _0x3736f2.dataset.hostTokenSetup = "true";
    var _0x52aa0a = _0x3736f2.querySelector(".tabs");
    var _0x3e474c = _0x3736f2.querySelector(".tabcontents");
    if (!_0x52aa0a || !_0x3e474c) {
      return;
    }
    var _0x439eee = _0x1b1e31.createElement("button");
    _0x439eee.setAttribute("data-hook", "tokenbtn");
    _0x439eee.textContent = "Host Token";
    _0x52aa0a.appendChild(_0x439eee);
    var _0x2d2a3b = _0x1b1e31.createElement("div");
    _0x2d2a3b.className = "section";
    _0x2d2a3b.setAttribute("data-hook", "tokensec");
    _0x3e474c.appendChild(_0x2d2a3b);
    function _0x37d50f() {
      var _0x335bc5 = "";
      try {
        _0x335bc5 = localStorage.getItem(_0x4f163d) || "";
      } catch (_0x3d8017) {
        _0x335bc5 = "";
      }
      var _0x215019 =
        '<div style="padding:16px 20px;"><div style="margin-bottom:20px;color:var(--theme-text-secondary, #888);font-size:13px;line-height:1.5;">' +
        _0x67baf0("Configure seu host token para criar salas sem captcha.") +
        '</div><div style="margin-bottom:16px;"><label style="display:block;color:var(--theme-text-secondary, #888);font-size:12px;margin-bottom:6px;font-weight:500;">Host Token</label><input id="host-token-input" type="text" value="' +
        (_0x335bc5 || "") +
        '" placeholder="' +
        _0x67baf0("Cole seu host token aqui") +
        '" style="width:100%;padding:8px 10px;background:var(--theme-bg-secondary, #1a1a1a);border:1px solid var(--theme-border-light, #333);border-radius:4px;color:var(--theme-text-primary, #fff);font-size:13px;box-sizing:border-box;outline:none;transition:border-color 0.15s;font-family:monospace;" /></div><div style="display:flex;gap:10px;"><button id="clear-token-btn" style="flex:1;padding:10px 16px;background:var(--theme-bg-tertiary, #272727);border:none;border-radius:6px;color:var(--theme-text-primary, #fff);cursor:pointer;font-size:13px;transition:background 0.15s;">' +
        _0x67baf0("Limpar") +
        '</button><button id="save-token-btn" style="flex:1;padding:10px 16px;background:var(--theme-bg-tertiary, #272727);border:none;border-radius:6px;color:var(--theme-text-primary, #fff);cursor:pointer;font-size:13px;font-weight:600;transition:background 0.15s;">' +
        _0x67baf0("Salvar") +
        "</button></div></div>";
      _0x2d2a3b.innerHTML = _0x215019;
      var _0x6cb0bf = _0x2d2a3b.querySelector("#host-token-input");
      var _0x654402 = _0x2d2a3b.querySelector("#clear-token-btn");
      var _0x3e1c1f = _0x2d2a3b.querySelector("#save-token-btn");
      _0x6cb0bf.onfocus = function () {
        _0x6cb0bf.style.borderColor = "var(--theme-border-light, #444)";
      };
      _0x6cb0bf.onblur = function () {
        _0x6cb0bf.style.borderColor = "var(--theme-border-light, #333)";
      };
      _0x654402.onmouseenter = function () {
        _0x654402.style.background = "var(--theme-bg-hover, #333)";
      };
      _0x654402.onmouseleave = function () {
        _0x654402.style.background = "var(--theme-bg-tertiary, #272727)";
      };
      _0x3e1c1f.onmouseenter = function () {
        _0x3e1c1f.style.background = "var(--theme-bg-hover, #333)";
      };
      _0x3e1c1f.onmouseleave = function () {
        _0x3e1c1f.style.background = "var(--theme-bg-tertiary, #272727)";
      };
      _0x654402.onclick = function () {
        _0x6cb0bf.value = "";
        try {
          localStorage.removeItem(_0x4f163d);
        } catch (_0x47b643) {}
        _0x6cb0bf.style.borderColor = "#333";
      };
      _0x3e1c1f.onclick = function () {
        var _0x44f38b = _0x6cb0bf.value.trim();
        try {
          if (_0x44f38b) {
            localStorage.setItem(_0x4f163d, _0x44f38b);
          } else {
            localStorage.removeItem(_0x4f163d);
          }
          _0x6cb0bf.style.borderColor = "#4ade80";
          setTimeout(function () {
            _0x6cb0bf.style.borderColor = "#333";
          }, 1000);
        } catch (_0x3cd3c6) {
          _0x6cb0bf.style.borderColor = "#ff4444";
          setTimeout(function () {
            _0x6cb0bf.style.borderColor = "#333";
          }, 1000);
        }
      };
      _0x6cb0bf.onkeydown = function (_0x12a1c6) {
        if (_0x12a1c6.key === "Enter") {
          _0x3e1c1f.click();
        }
      };
    }
    _0x439eee.onclick = function () {
      _0x52aa0a.querySelectorAll("button").forEach(function (_0x3873fb) {
        _0x3873fb.classList.remove("selected");
      });
      _0x439eee.classList.add("selected");
      _0x3e474c.querySelectorAll(".section").forEach(function (_0x234e91) {
        _0x234e91.classList.remove("selected");
      });
      _0x2d2a3b.classList.add("selected");
      _0x37d50f();
    };
    var _0x447ed7 = _0x52aa0a.querySelectorAll(
      'button:not([data-hook="tokenbtn"])',
    );
    _0x447ed7.forEach(function (_0xdbf657) {
      (function (_0x11751c) {
        _0x11751c.addEventListener(
          "click",
          function () {
            _0x439eee.classList.remove("selected");
            _0x2d2a3b.classList.remove("selected");
            var _0x6ba1e2 = _0x11751c.getAttribute("data-hook");
            if (_0x6ba1e2) {
              var _0x1acfe0 = _0x3e474c.querySelector(
                '.section[data-hook="' + _0x6ba1e2.replace("btn", "sec") + '"]',
              );
              if (_0x1acfe0) {
                _0x3e474c
                  .querySelectorAll(
                    '.section[data-hook="tokensec"], .section[data-hook="avatarsec"]',
                  )
                  .forEach(function (_0x5a702e) {
                    _0x5a702e.classList.remove("selected");
                  });
                setTimeout(function () {
                  if (!_0x1acfe0.classList.contains("selected")) {
                    _0x3e474c
                      .querySelectorAll(".section")
                      .forEach(function (_0x48f0c6) {
                        _0x48f0c6.classList.remove("selected");
                      });
                    _0x1acfe0.classList.add("selected");
                  }
                }, 50);
              }
            }
          },
          true,
        );
      })(_0xdbf657);
    });
    if (_0x439eee.classList.contains("selected")) {
      _0x37d50f();
    }
  }
  function _0x5e26be() {
    setInterval(function () {
      var _0x461f4a = document.querySelector(".settings-view");
      if (_0x461f4a && !_0x461f4a.dataset.hostTokenSetup) {
        _0x4878de(document);
      }
    }, 500);
    var _0xf84ea9 = document.querySelector(".settings-view");
    if (_0xf84ea9) {
      _0x4878de(document);
    }
    Injector.log("Host Token module loaded");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _0x5e26be);
  } else {
    _0x5e26be();
  }
})();
