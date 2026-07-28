(function () {
  if (!Injector.isMainFrame()) {
    return;
  }
  var _0x167a57 = "http://localhost:5483";
  var _0x1fdc23 = null;
  var _0x1a2d2a = null;
  var _0x5c63d4 = null;
  var _0x39be58 = false;
  var _0x4acd14 = false;
  var _0x3f67b7 = localStorage.getItem("ghost_mode") === "true";
  var _0x35e455 =
    '<svg width="24" height="24" viewBox="0 0 71 55" fill="#5865F2"><path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.8 40.8 0 00-1.8 3.7 54 54 0 00-16.2 0A37.4 37.4 0 0025.4.3a.2.2 0 00-.2-.1 58.4 58.4 0 00-14.7 4.6.2.2 0 00-.1.1C1.5 18.7-.9 32 .3 45.2v.1a58.7 58.7 0 0017.9 9.1.2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.7 38.7 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 41.9 41.9 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.3 36.3 0 01-5.5 2.6.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1 58.5 58.5 0 0018-9.1v-.1c1.4-15-2.3-28-9.8-39.6a.2.2 0 00-.1-.1zM23.7 37.1c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7zm23 0c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7z"/></svg>';
  function _0x4ccf98() {
    return new Promise(function (_0x23cf64) {
      var _0x97fa45 = new XMLHttpRequest();
      _0x97fa45.open("GET", _0x167a57 + "/user", true);
      _0x97fa45.onreadystatechange = function () {
        if (_0x97fa45.readyState === 4) {
          try {
            var _0x451527 = JSON.parse(_0x97fa45.responseText);
            if (_0x451527.logged_in) {
              _0x1fdc23 = _0x451527.nick;
              _0x1a2d2a = _0x451527.username;
              _0x5c63d4 = _0x451527.discord_id;
              _0x39be58 = _0x451527.is_verified;
            }
            _0x23cf64(_0x451527);
          } catch (_0xd43341) {
            _0x23cf64({
              logged_in: false,
            });
          }
        }
      };
      _0x97fa45.onerror = function () {
        _0x23cf64({
          logged_in: false,
        });
      };
      _0x97fa45.send();
    });
  }
  function _0x50882c() {
    var _0x53e792 = new XMLHttpRequest();
    _0x53e792.open("GET", _0x167a57 + "/auth", true);
    _0x53e792.send();
  }
  var _0x28e392 = {
    roomName: null,
    roomLink: null,
    isOnline: null,
  };
  function _0x43f046(_0xcf975d, _0x1497a8, _0xbf6ab5) {
    if (!_0x5c63d4 || _0x3f67b7) {
      return;
    }
    if (
      _0x28e392.roomName === _0xcf975d &&
      _0x28e392.roomLink === _0x1497a8 &&
      _0x28e392.isOnline === _0xbf6ab5
    ) {
      return;
    }
    _0x28e392 = {
      roomName: _0xcf975d,
      roomLink: _0x1497a8,
      isOnline: _0xbf6ab5,
    };
    var _0x3bc943 = new XMLHttpRequest();
    _0x3bc943.open("POST", _0x167a57 + "/presence", true);
    _0x3bc943.setRequestHeader("Content-Type", "application/json");
    _0x3bc943.send(
      JSON.stringify({
        room_name: _0xcf975d || null,
        room_link: _0x1497a8 || null,
        is_online: _0xbf6ab5 !== false,
      }),
    );
  }
  function _0x2e54ce(_0x272df5) {
    return;
    var _0x353366 = _0x272df5.querySelector(".dialog");
    if (!_0x353366) {
      return;
    }
    var _0x3025be = _0x353366.querySelector('input[data-hook="input"]');
    var _0x3e4440 = _0x353366.querySelector('button[data-hook="ok"]');
    if (!_0x3025be || !_0x3e4440) {
      return;
    }
    var _0x352a6a = _0x353366.querySelector("h1");
    var _0x1d9d74 = _0x353366.querySelector(".label-input");
    var _0x4a4c48 = _0x1d9d74 ? _0x1d9d74.querySelector("label") : null;
    var _0x5cc2ee = (_0x4a4c48 ? _0x4a4c48.textContent : "").toLowerCase();
    var _0x468915 = (_0x352a6a ? _0x352a6a.textContent : "").toLowerCase();
    var _0x25cd00 =
      _0x5cc2ee.indexOf("nick") !== -1 ||
      _0x468915.indexOf("nick") !== -1 ||
      _0x468915.indexOf("nickname") !== -1 ||
      _0x468915.indexOf("choose") !== -1;
    if (!_0x25cd00) {
      return;
    }
    if (_0x353366.dataset.discordSetup === "done") {
      return;
    }
    _0x353366.dataset.discordSetup = "done";
    if (_0x352a6a) {
      _0x352a6a.style.display = "none";
    }
    if (_0x1d9d74) {
      _0x1d9d74.style.display = "none";
    }
    _0x3e4440.style.display = "none";
    if (_0x3f67b7) {
      var _0x195656 = _0x272df5.createElement("div");
      _0x195656.id = "ghost-mode-container";
      _0x195656.style.cssText = "padding:20px;";
      var _0x25fe9a = _0x272df5.createElement("div");
      _0x25fe9a.style.cssText = "text-align:left;margin-bottom:16px;";
      var _0x3cd623 = _0x272df5.createElement("label");
      _0x3cd623.textContent = "Nick";
      _0x3cd623.style.cssText =
        "display:block;color:#888;font-size:13px;margin-bottom:6px;";
      _0x25fe9a.appendChild(_0x3cd623);
      var _0x31eb1c = _0x272df5.createElement("div");
      _0x31eb1c.style.cssText =
        "position:relative;display:flex;align-items:center;";
      var _0x11fb50 = localStorage.getItem("ghost_nick") || _0x1fdc23 || "";
      var _0x29067b = _0x272df5.createElement("input");
      _0x29067b.type = "text";
      _0x29067b.value = _0x11fb50;
      _0x29067b.maxLength = 50;
      _0x29067b.placeholder = "Digite seu nick...";
      _0x29067b.style.cssText =
        "width:100%;padding:10px 40px 10px 12px;background:var(--theme-bg-secondary, #1a1a1a);border:1px solid var(--theme-border-light, #333);border-radius:4px;color:var(--theme-text-primary, #fff);font-size:15px;outline:none;box-sizing:border-box;";
      _0x29067b.onfocus = function () {
        _0x29067b.style.borderColor = "var(--theme-border-light, #444)";
      };
      _0x29067b.onblur = function () {
        _0x29067b.style.borderColor = "var(--theme-border-light, #333)";
      };
      _0x31eb1c.appendChild(_0x29067b);
      var _0x16987a = _0x272df5.createElement("div");
      _0x16987a.style.cssText =
        "position:absolute;right:10px;cursor:pointer;display:flex;align-items:center;";
      _0x16987a.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>';
      var _0x19e69c = _0x272df5.createElement("div");
      _0x19e69c.style.cssText =
        "position:absolute;bottom:calc(100% + 8px);right:0;background:var(--theme-bg-secondary, #1a1a1a);border:1px solid var(--theme-border-light, #333);border-radius:4px;padding:8px 12px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity 0.15s;z-index:100;";
      _0x19e69c.innerHTML =
        '<div style="color:#8b5cf6 !important;font-size:13px;font-weight:600;">Anônimo</div>';
      _0x16987a.appendChild(_0x19e69c);
      _0x16987a.onmouseenter = function () {
        _0x19e69c.style.opacity = "1";
      };
      _0x16987a.onmouseleave = function () {
        _0x19e69c.style.opacity = "0";
      };
      _0x31eb1c.appendChild(_0x16987a);
      _0x25fe9a.appendChild(_0x31eb1c);
      _0x195656.appendChild(_0x25fe9a);
      var _0x2d89ab = _0x272df5.createElement("button");
      _0x2d89ab.style.cssText =
        "width:100%;padding:10px;background:#272727;border:none;border-radius:4px;color:#fff;font-size:14px;cursor:pointer;transition:background 0.15s;";
      _0x2d89ab.textContent = "Ok";
      _0x2d89ab.onmouseenter = function () {
        _0x2d89ab.style.background = "#333";
      };
      _0x2d89ab.onmouseleave = function () {
        _0x2d89ab.style.background = "#272727";
      };
      _0x2d89ab.onclick = function () {
        var _0x5aa8cb = _0x29067b.value.trim();
        if (!_0x5aa8cb) {
          return;
        }
        _0x2e103b = _0x5aa8cb;
        localStorage.setItem("ghost_nick", _0x5aa8cb);
        _0x3025be.value = _0x5aa8cb;
        _0x3025be.dispatchEvent(
          new Event("input", {
            bubbles: true,
          }),
        );
        _0x3e4440.style.display = "";
        _0x3e4440.disabled = false;
        _0x3e4440.click();
      };
      _0x195656.appendChild(_0x2d89ab);
      _0x353366.appendChild(_0x195656);
      return;
    }
    if (_0x1fdc23) {
      var _0x195656 = _0x272df5.createElement("div");
      _0x195656.id = "discord-logged";
      _0x195656.style.cssText = "padding:20px;";
      var _0x25fe9a = _0x272df5.createElement("div");
      _0x25fe9a.style.cssText = "text-align:left;margin-bottom:16px;";
      var _0x3cd623 = _0x272df5.createElement("label");
      _0x3cd623.textContent = "Nick";
      _0x3cd623.style.cssText =
        "display:block;color:#888;font-size:13px;margin-bottom:6px;";
      _0x25fe9a.appendChild(_0x3cd623);
      var _0x31eb1c = _0x272df5.createElement("div");
      _0x31eb1c.style.cssText =
        "position:relative;display:flex;align-items:center;";
      var _0x29067b = _0x272df5.createElement("input");
      _0x29067b.type = "text";
      var _0x2f49bf = localStorage.getItem("haxball_nick") || "";
      _0x29067b.value = _0x2f49bf;
      _0x29067b.placeholder = _0x1fdc23;
      _0x29067b.maxLength = 50;
      _0x29067b.style.cssText =
        "width:100%;padding:10px 40px 10px 12px;background:var(--theme-bg-secondary, #1a1a1a);border:1px solid var(--theme-border-light, #333);border-radius:4px;color:var(--theme-text-primary, #fff);font-size:15px;outline:none;box-sizing:border-box;";
      _0x29067b.onfocus = function () {
        _0x29067b.style.borderColor = "var(--theme-border-light, #444)";
      };
      _0x29067b.onblur = function () {
        _0x29067b.style.borderColor = "var(--theme-border-light, #333)";
      };
      _0x31eb1c.appendChild(_0x29067b);
      var _0xd34bc3 = _0x272df5.createElement("div");
      _0xd34bc3.style.cssText =
        "position:absolute;right:10px;cursor:pointer;display:flex;align-items:center;";
      _0xd34bc3.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 71 55" fill="#5865F2"><path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.8 40.8 0 00-1.8 3.7 54 54 0 00-16.2 0A37.4 37.4 0 0025.4.3a.2.2 0 00-.2-.1 58.4 58.4 0 00-14.7 4.6.2.2 0 00-.1.1C1.5 18.7-.9 32 .3 45.2v.1a58.7 58.7 0 0017.9 9.1.2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.7 38.7 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 41.9 41.9 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.3 36.3 0 01-5.5 2.6.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1 58.5 58.5 0 0018-9.1v-.1c1.4-15-2.3-28-9.8-39.6a.2.2 0 00-.1-.1zM23.7 37.1c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7zm23 0c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7z"/></svg>';
      var _0x19e69c = _0x272df5.createElement("div");
      _0x19e69c.style.cssText =
        "position:absolute;bottom:calc(100% + 8px);right:0;background:var(--theme-bg-secondary, #1a1a1a);border:1px solid var(--theme-border-light, #333);border-radius:4px;padding:8px 12px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity 0.15s;z-index:100;";
      _0x19e69c.innerHTML =
        '<div style="color:#5865F2 !important;font-size:11px;margin-bottom:2px;">Discord</div><div style="color:var(--theme-text-primary, #fff);font-size:13px;">' +
        (_0x1a2d2a || _0x1fdc23) +
        "</div>";
      _0xd34bc3.appendChild(_0x19e69c);
      _0xd34bc3.onmouseenter = function () {
        _0x19e69c.style.opacity = "1";
      };
      _0xd34bc3.onmouseleave = function () {
        _0x19e69c.style.opacity = "0";
      };
      _0x31eb1c.appendChild(_0xd34bc3);
      _0x25fe9a.appendChild(_0x31eb1c);
      _0x195656.appendChild(_0x25fe9a);
      var _0x3e521b = _0x272df5.createElement("div");
      _0x3e521b.style.cssText = "display:flex;gap:8px;width:100%;";
      var _0x2d89ab = _0x272df5.createElement("button");
      _0x2d89ab.style.cssText =
        "flex:1;padding:10px;background:#272727;border:none;border-radius:4px;color:#fff;font-size:14px;cursor:pointer;transition:background 0.15s;";
      _0x2d89ab.textContent = "Ok";
      _0x2d89ab.onmouseenter = function () {
        _0x2d89ab.style.background = "#333";
      };
      _0x2d89ab.onmouseleave = function () {
        _0x2d89ab.style.background = "#272727";
      };
      _0x2d89ab.onclick = function () {
        var _0x32a4e5 = _0x29067b.value.trim() || _0x1fdc23;
        _0x2e103b = _0x32a4e5;
        if (_0x32a4e5) {
          localStorage.setItem("haxball_nick", _0x32a4e5);
        }
        _0x3025be.value = _0x32a4e5;
        _0x3025be.dispatchEvent(
          new Event("input", {
            bubbles: true,
          }),
        );
        _0x3e4440.style.display = "";
        _0x3e4440.disabled = false;
        _0x3e4440.click();
      };
      _0x3e521b.appendChild(_0x2d89ab);
      var _0x5d663e = _0x272df5.createElement("button");
      _0x5d663e.style.cssText =
        "width:42px;padding:10px;background:#272727;border:none;border-radius:4px;cursor:pointer;transition:background 0.15s;display:flex;align-items:center;justify-content:center;";
      _0x5d663e.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';
      _0x5d663e.onmouseenter = function () {
        _0x5d663e.style.background = "#333";
        _0x5d663e.querySelector("svg").style.stroke = "#fff";
      };
      _0x5d663e.onmouseleave = function () {
        _0x5d663e.style.background = "#272727";
        _0x5d663e.querySelector("svg").style.stroke = "#888";
      };
      _0x5d663e.onclick = function () {
        var _0x55be3c = new XMLHttpRequest();
        _0x55be3c.open("POST", _0x167a57 + "/logout", true);
        _0x55be3c.onreadystatechange = function () {
          if (_0x55be3c.readyState === 4) {
            _0x1fdc23 = null;
            _0x1a2d2a = null;
            _0x5c63d4 = null;
            _0x39be58 = false;
            localStorage.removeItem("haxball_nick");
            window.location.reload();
          }
        };
        _0x55be3c.send();
      };
      _0x3e521b.appendChild(_0x5d663e);
      _0x195656.appendChild(_0x3e521b);
      _0x353366.appendChild(_0x195656);
    } else {
      var _0x5e9816 = _0x272df5.createElement("button");
      _0x5e9816.id = "discord-login-btn";
      _0x5e9816.style.cssText =
        "display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:12px 20px;background:#5865F2;border:none;border-radius:6px;color:#fff;font-size:15px;font-weight:600;cursor:pointer;margin-bottom:8px;";
      _0x5e9816.innerHTML =
        '                <svg width="24" height="24" viewBox="0 0 71 55" fill="#fff"><path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.8 40.8 0 00-1.8 3.7 54 54 0 00-16.2 0A37.4 37.4 0 0025.4.3a.2.2 0 00-.2-.1 58.4 58.4 0 00-14.7 4.6.2.2 0 00-.1.1C1.5 18.7-.9 32 .3 45.2v.1a58.7 58.7 0 0017.9 9.1.2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.7 38.7 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 41.9 41.9 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.3 36.3 0 01-5.5 2.6.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1 58.5 58.5 0 0018-9.1v-.1c1.4-15-2.3-28-9.8-39.6a.2.2 0 00-.1-.1zM23.7 37.1c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7zm23 0c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7z"/></svg>                Entrar com Discord            ';
      _0x5e9816.onmouseenter = function () {
        _0x5e9816.style.background = "#4752C4";
      };
      _0x5e9816.onmouseleave = function () {
        _0x5e9816.style.background = "#5865F2";
      };
      _0x5e9816.onclick = function () {
        _0x5e9816.disabled = true;
        _0x5e9816.innerHTML = "<span>Aguardando...</span>";
        _0x50882c();
        var _0x5a16a5 = setInterval(function () {
          _0x4ccf98().then(function (_0x31678f) {
            if (_0x31678f.logged_in) {
              clearInterval(_0x5a16a5);
              _0x1fdc23 = _0x31678f.nick;
              _0x1a2d2a = _0x31678f.username;
              _0x5c63d4 = _0x31678f.discord_id;
              _0x39be58 = _0x31678f.is_verified;
              window.location.reload();
            }
          });
        }, 1500);
        setTimeout(function () {
          clearInterval(_0x5a16a5);
          _0x5e9816.disabled = false;
          _0x5e9816.innerHTML =
            '                        <svg width="24" height="24" viewBox="0 0 71 55" fill="#fff"><path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.8 40.8 0 00-1.8 3.7 54 54 0 00-16.2 0A37.4 37.4 0 0025.4.3a.2.2 0 00-.2-.1 58.4 58.4 0 00-14.7 4.6.2.2 0 00-.1.1C1.5 18.7-.9 32 .3 45.2v.1a58.7 58.7 0 0017.9 9.1.2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.7 38.7 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 41.9 41.9 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.3 36.3 0 01-5.5 2.6.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1 58.5 58.5 0 0018-9.1v-.1c1.4-15-2.3-28-9.8-39.6a.2.2 0 00-.1-.1zM23.7 37.1c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7zm23 0c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7z"/></svg>                        Entrar com Discord                    ';
        }, 120000);
      };
      _0x353366.appendChild(_0x5e9816);
      var _0x26301e = _0x272df5.createElement("button");
      _0x26301e.id = "ghost-mode-login-btn";
      _0x26301e.style.cssText =
        "display:flex !important;align-items:center !important;justify-content:center !important;gap:10px !important;width:100% !important;padding:12px 20px !important;background:#8b5cf6 !important;border:none !important;border-radius:6px !important;color:#fff !important;font-size:15px !important;font-weight:600 !important;cursor:pointer !important;outline:none !important;box-shadow:none !important;";
      _0x26301e.innerHTML =
        '                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>                Jogar Anônimo            ';
      _0x26301e.onmouseenter = function () {
        _0x26301e.style.setProperty("background", "#7c3aed", "important");
      };
      _0x26301e.onmouseleave = function () {
        _0x26301e.style.setProperty("background", "#8b5cf6", "important");
      };
      _0x26301e.onclick = function () {
        localStorage.setItem("ghost_mode", "true");
        window.location.reload();
      };
      _0x353366.appendChild(_0x26301e);
    }
  }
  function _0x57663d(_0x1cc48b) {
    var _0x5dc640 = _0x1cc48b.querySelector("#discord-login-btn");
    if (_0x5dc640) {
      _0x5dc640.style.cssText =
        "display:flex !important;align-items:center !important;justify-content:center !important;gap:8px !important;width:100% !important;padding:12px 20px !important;background:#2a1a1a !important;border:1px solid #ff4444 !important;border-radius:6px !important;color:#ff4444 !important;font-size:14px !important;cursor:not-allowed !important;margin:16px 0 !important;";
      _0x5dc640.innerHTML =
        '                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff4444" stroke-width="2">                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>                    <line x1="12" y1="9" x2="12" y2="13"/>                    <line x1="12" y1="17" x2="12.01" y2="17"/>                </svg>                <span style="color:#ff4444 !important;">Acesso Negado</span>            ';
      _0x5dc640.disabled = true;
    }
  }
  function _0x530690() {
    var _0x1c12ca = null;
    var _0x7c3c55 = null;
    var _0x1da228 = false;
    function _0x1a73e7() {
      var _0x5334e7 = document.querySelector('iframe[src*="game.html"]');
      if (!_0x5334e7) {
        return;
      }
      try {
        var _0x40a94e =
          _0x5334e7.contentDocument ||
          (_0x5334e7.contentWindow && _0x5334e7.contentWindow.document);
        if (!_0x40a94e || !_0x40a94e.body) {
          return;
        }
        if (!_0x1da228) {
          _0x1da228 = true;
          _0x1a6bad(_0x40a94e);
        }
        if (!_0x7c3c55) {
          _0x7c3c55 = new MutationObserver(function () {
            var _0x317481 = _0x40a94e.querySelector(".dialog");
            if (_0x317481 && !_0x317481.dataset.discordSetup) {
              _0x2e54ce(_0x40a94e);
            }
          });
          _0x7c3c55.observe(_0x40a94e.body, {
            childList: true,
            subtree: false,
          });
        }
        function _0x12865a() {
          var _0x382a95 = _0x40a94e.querySelector(".teams");
          if (_0x382a95 && !_0x1c12ca && _0x1fdc23) {
            _0x1c12ca = new MutationObserver(function () {
              _0x16d55d(_0x40a94e);
            });
            _0x1c12ca.observe(_0x382a95, {
              childList: true,
              subtree: true,
            });
            _0x16d55d(_0x40a94e);
          }
        }
        _0x12865a();
        if (!_0x1c12ca) {
          var _0x43ca3b = new MutationObserver(function () {
            _0x12865a();
            if (_0x1c12ca) {
              _0x43ca3b.disconnect();
            }
          });
          _0x43ca3b.observe(_0x40a94e.body, {
            childList: true,
            subtree: true,
          });
        }
        var _0x865d08 = _0x40a94e.querySelector(".dialog");
        if (_0x865d08) {
          _0x2e54ce(_0x40a94e);
        }
      } catch (_0x377052) {}
    }
    var _0x4f129f = new MutationObserver(_0x1a73e7);
    _0x4f129f.observe(document.body, {
      childList: true,
      subtree: true,
    });
    _0x1a73e7();
  }
  var _0x2e103b = null;
  var _0x1c5b38 = {};
  function _0x24957a(_0x3dcac9, _0x163c16) {
    if (_0x1c5b38.hasOwnProperty(_0x3dcac9)) {
      _0x163c16(_0x1c5b38[_0x3dcac9]);
      return;
    }
    var _0x250302 = new XMLHttpRequest();
    _0x250302.open(
      "GET",
      _0x167a57 + "/user/by-nick?nick=" + encodeURIComponent(_0x3dcac9),
      true,
    );
    _0x250302.onreadystatechange = function () {
      if (_0x250302.readyState === 4) {
        try {
          var _0x45c672 = JSON.parse(_0x250302.responseText);
          _0x1c5b38[_0x3dcac9] = _0x45c672;
          _0x163c16(_0x45c672);
        } catch (_0x57e30d) {
          _0x1c5b38[_0x3dcac9] = null;
          _0x163c16(null);
        }
      }
    };
    _0x250302.onerror = function () {
      _0x1c5b38[_0x3dcac9] = null;
      _0x163c16(null);
    };
    _0x250302.send();
  }
  var _0xf4f786 = null;
  var _0x5acc17 = null;
  function _0x4a5f3d(_0x140869) {
    if (_0x5acc17) {
      clearTimeout(_0x5acc17);
      _0x5acc17 = null;
    }
    _0x140869.style.opacity = "0";
    _0x140869.style.visibility = "hidden";
    _0xf4f786 = null;
  }
  function _0x16d55d(_0x1dd1f1) {
    return;
    var _0x514e09 = _0x1dd1f1.getElementById("discord-player-tooltip");
    if (!_0x514e09) {
      _0x514e09 = _0x1dd1f1.createElement("div");
      _0x514e09.id = "discord-player-tooltip";
      _0x514e09.style.cssText =
        "position:fixed;background:var(--theme-tooltip-bg, #1a1a1a);border:1px solid var(--theme-tooltip-border, #333);border-radius:6px;padding:8px 12px;z-index:10000;pointer-events:none;opacity:0;visibility:hidden;transition:opacity 0.1s;box-shadow:0 4px 12px rgba(0,0,0,0.3);";
      _0x1dd1f1.body.appendChild(_0x514e09);
      _0x1dd1f1.addEventListener("mouseleave", function () {
        _0x4a5f3d(_0x514e09);
      });
      _0x1dd1f1.addEventListener(
        "scroll",
        function () {
          _0x4a5f3d(_0x514e09);
        },
        true,
      );
      _0x1dd1f1.addEventListener("mousemove", function (_0x5ec48a) {
        if (_0x514e09.style.opacity !== "1") {
          return;
        }
        var _0x4fa99a = _0x5ec48a.target;
        var _0x15cc45 = false;
        while (_0x4fa99a && _0x4fa99a !== _0x1dd1f1.body) {
          if (
            _0x4fa99a.classList &&
            _0x4fa99a.classList.contains("player-list-item")
          ) {
            _0x15cc45 = true;
            break;
          }
          _0x4fa99a = _0x4fa99a.parentElement;
        }
        if (!_0x15cc45) {
          _0x4a5f3d(_0x514e09);
        }
      });
      _0x1dd1f1.addEventListener("mousedown", function () {
        _0x4a5f3d(_0x514e09);
      });
    }
    var _0x27b895 = _0x1dd1f1.querySelectorAll(".player-list-item");
    for (var _0x3db567 = 0; _0x3db567 < _0x27b895.length; _0x3db567++) {
      var _0x5a2cbf = _0x27b895[_0x3db567];
      var _0x11a0c0 = _0x5a2cbf.querySelector('[data-hook="name"]');
      if (!_0x11a0c0) {
        continue;
      }
      if (_0x11a0c0.dataset.discordTooltip === "done") {
        continue;
      }
      _0x11a0c0.dataset.discordTooltip = "done";
      var _0x2f081a = _0x11a0c0.textContent;
      if (_0x1a2d2a && (_0x2f081a === _0x2e103b || _0x2f081a === _0x1fdc23)) {
        (function (_0x4e7c0d, _0x37ad7c) {
          _0x4e7c0d.addEventListener("mouseenter", function (_0x55f8df) {
            if (_0x5acc17) {
              clearTimeout(_0x5acc17);
              _0x5acc17 = null;
            }
            _0xf4f786 = _0x4e7c0d;
            _0x514e09.innerHTML =
              '<div style="display:flex;align-items:center;gap:8px;"><svg width="14" height="14" viewBox="0 0 71 55" fill="#5865F2"><path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.8 40.8 0 00-1.8 3.7 54 54 0 00-16.2 0A37.4 37.4 0 0025.4.3a.2.2 0 00-.2-.1 58.4 58.4 0 00-14.7 4.6.2.2 0 00-.1.1C1.5 18.7-.9 32 .3 45.2v.1a58.7 58.7 0 0017.9 9.1.2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.7 38.7 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 41.9 41.9 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.3 36.3 0 01-5.5 2.6.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1 58.5 58.5 0 0018-9.1v-.1c1.4-15-2.3-28-9.8-39.6a.2.2 0 00-.1-.1zM23.7 37.1c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7zm23 0c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7z"/></svg><span style="color:var(--theme-text-primary, #fff);font-size:12px;">@' +
              _0x37ad7c +
              "</span></div>";
            var _0x584c38 = _0x4e7c0d.getBoundingClientRect();
            _0x514e09.style.left = _0x584c38.right + 8 + "px";
            _0x514e09.style.top =
              _0x584c38.top + _0x584c38.height / 2 - 16 + "px";
            _0x514e09.style.visibility = "visible";
            _0x514e09.style.opacity = "1";
          });
          _0x4e7c0d.addEventListener("mouseleave", function () {
            _0x4a5f3d(_0x514e09);
          });
          _0x4e7c0d
            .closest(".player-list-item")
            .addEventListener("mouseleave", function () {
              if (_0xf4f786 === _0x4e7c0d) {
                _0x4a5f3d(_0x514e09);
              }
            });
        })(_0x5a2cbf, _0x1a2d2a);
      } else {
        (function (_0x221712, _0x55fde5) {
          _0x221712.addEventListener("mouseenter", function (_0x29548d) {
            if (_0x5acc17) {
              clearTimeout(_0x5acc17);
              _0x5acc17 = null;
            }
            _0xf4f786 = _0x221712;
            _0x24957a(_0x55fde5, function (_0x125a28) {
              if (_0xf4f786 !== _0x221712) {
                return;
              }
              if (_0x125a28 && _0x125a28.username) {
                _0x514e09.innerHTML =
                  '<div style="display:flex;align-items:center;gap:8px;"><svg width="14" height="14" viewBox="0 0 71 55" fill="#5865F2"><path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.8 40.8 0 00-1.8 3.7 54 54 0 00-16.2 0A37.4 37.4 0 0025.4.3a.2.2 0 00-.2-.1 58.4 58.4 0 00-14.7 4.6.2.2 0 00-.1.1C1.5 18.7-.9 32 .3 45.2v.1a58.7 58.7 0 0017.9 9.1.2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.7 38.7 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 41.9 41.9 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.3 36.3 0 01-5.5 2.6.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1 58.5 58.5 0 0018-9.1v-.1c1.4-15-2.3-28-9.8-39.6a.2.2 0 00-.1-.1zM23.7 37.1c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7zm23 0c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7z"/></svg><span style="color:var(--theme-text-primary, #fff);font-size:12px;">@' +
                  _0x125a28.username +
                  "</span></div>";
                var _0x11b5eb = _0x221712.getBoundingClientRect();
                _0x514e09.style.left = _0x11b5eb.right + 8 + "px";
                _0x514e09.style.top =
                  _0x11b5eb.top + _0x11b5eb.height / 2 - 16 + "px";
                _0x514e09.style.visibility = "visible";
                _0x514e09.style.opacity = "1";
              }
            });
          });
          _0x221712.addEventListener("mouseleave", function () {
            _0x4a5f3d(_0x514e09);
          });
          _0x221712
            .closest(".player-list-item")
            .addEventListener("mouseleave", function () {
              if (_0xf4f786 === _0x221712) {
                _0x4a5f3d(_0x514e09);
              }
            });
        })(_0x5a2cbf, _0x2f081a);
      }
    }
  }
  function _0x5d8547() {
    if (_0x4acd14) {
      return;
    }
    _0x4acd14 = true;
    _0x4ccf98().then(function () {
      Injector.log(
        "Discord: " + (_0x1fdc23 ? "Logado como " + _0x1fdc23 : "Não logado"),
      );
      if (_0x5c63d4) {
        _0x43f046(null, null, true);
      }
      if (document.body) {
        _0x530690();
      } else {
        document.addEventListener("DOMContentLoaded", _0x530690);
      }
    });
    window.addEventListener("beforeunload", function () {
      if (_0x5c63d4 && !_0x3f67b7) {
        navigator.sendBeacon(
          _0x167a57 + "/presence",
          JSON.stringify({
            room_name: null,
            room_link: null,
            is_online: false,
          }),
        );
      }
    });
  }
  function _0x46dd1e() {
    try {
      var _0x2e834b = document.querySelector('h1[data-hook="room-name"]');
      var _0x25dabc =
        _0x2e834b && _0x2e834b.textContent
          ? String(_0x2e834b.textContent).trim()
          : "";
      return _0x25dabc || null;
    } catch (_0x4cb2a6) {
      return null;
    }
  }
  function _0xf959a1() {
    if (!_0x5c63d4 || _0x3f67b7) {
      return;
    }
    var _0x12740f =
      !!document.querySelector(".room-view") ||
      !!document.querySelector(".game-view.showing-room-view");
    if (_0x12740f) {
      _0x43f046(_0x46dd1e() || "En sala", null, true);
    } else {
      _0x43f046(null, null, true);
    }
  }
  function _0x1a6bad(_0x40b84d) {
    _0xf959a1();
  }
  window.HaxDiscord = {
    getNick: function () {
      return _0x1fdc23;
    },
    getId: function () {
      if (_0x3f67b7) {
        return null;
      } else {
        return _0x5c63d4;
      }
    },
    isVerified: function () {
      if (_0x3f67b7) {
        return false;
      } else {
        return _0x39be58;
      }
    },
    isGhostMode: function () {
      return _0x3f67b7;
    },
    updatePresence: _0x43f046,
    syncRoomPresence: _0xf959a1,
    refresh: _0x4ccf98,
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _0x5d8547);
  } else {
    _0x5d8547();
  }
  setInterval(function () {
    if (!_0x4acd14 || !_0x5c63d4 || _0x3f67b7) {
      return;
    }
    _0xf959a1();
  }, 4000);
  Injector.log("Discord module loaded");
})();
