(function () {
  if (Injector.isMainFrame()) {
    return;
  }
  var _0x562721 = "http://localhost:5483";
  var _0x45157a =
    '<svg width="12" height="12" viewBox="0 0 22 22" fill="none"><path d="M20.4 11c0-1.2-.7-2.3-1.8-2.9.4-1.2.2-2.5-.7-3.4-.9-.9-2.2-1.1-3.4-.7C14 2.9 12.9 2.2 11.7 2.2c-1.2 0-2.3.7-2.9 1.8-1.2-.4-2.5-.2-3.4.7-.9.9-1.1 2.2-.7 3.4C3.6 8.7 2.9 9.8 2.9 11c0 1.2.7 2.3 1.8 2.9-.4 1.2-.2 2.5.7 3.4.9.9 2.2 1.1 3.4.7.6 1.1 1.7 1.8 2.9 1.8 1.2 0 2.3-.7 2.9-1.8 1.2.4 2.5.2 3.4-.7.9-.9 1.1-2.2.7-3.4 1.1-.6 1.7-1.7 1.7-2.9z" fill="#249EF0"/><path d="M15 9l-4.5 4.5L8 11" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var _0x226cef = {};
  window.__verifiedCache = _0x226cef;
  var _0x5c514a = false;
  var _0x4f7b06 = null;
  var _0x29c955 = false;
  var _0x1e7c49 = [];
  var _0x4f54cd = false;
  var _0x5ddd24 = null;
  var _0x1c1fa2 = false;
  function _0x5beaa6(_0x2601ee) {
    if (_0x2601ee) {
      return _0x2601ee.replace(/\u200B/g, "");
    } else {
      return _0x2601ee;
    }
  }
  function _0x511512() {
    return localStorage.getItem("ghost_mode") === "true";
  }
  function _0x512c12() {
    return window.__myLocalPlayerId;
  }
  function _0x2608ba() {
    var _0x22ad21 = document.getElementById("__hax_player_id_result");
    if (!_0x22ad21) {
      _0x22ad21 = document.createElement("div");
      _0x22ad21.id = "__hax_player_id_result";
      _0x22ad21.style.display = "none";
      document.body.appendChild(_0x22ad21);
    }
    _0x22ad21.removeAttribute("data-player-id");
    var _0x4aa8d0 = document.createElement("script");
    _0x4aa8d0.textContent =
      '(function() { var el = document.getElementById("__hax_player_id_result"); if (el) { var id = window.__haxLocalPlayerId; el.setAttribute("data-player-id", id != null ? id : "null"); } })();';
    document.body.appendChild(_0x4aa8d0);
    _0x4aa8d0.remove();
    var _0x2a1027 = _0x22ad21.getAttribute("data-player-id");
    if (_0x2a1027 != null && _0x2a1027 !== "null") {
      return parseInt(_0x2a1027, 10);
    }
    return null;
  }
  function _0x7c598(_0x11b366, _0x574753) {
    _0x574753 = _0x574753 || 50;
    var _0x573610 = 0;
    function _0x4fb42c() {
      var _0x1a69e2 = _0x2608ba();
      if (_0x1a69e2 != null) {
        _0x11b366(_0x1a69e2);
      } else if (_0x573610 < _0x574753) {
        _0x573610++;
        setTimeout(_0x4fb42c, 200);
      }
    }
    _0x4fb42c();
  }
  function _0x3fd772() {
    try {
      var _0x2a0313 = window.top.location.href;
      var _0x98ef6b = _0x2a0313.match(/[?&]c=([^&]+)/);
      if (_0x98ef6b) {
        return _0x98ef6b[1];
      }
    } catch (_0x581650) {}
    return null;
  }
  function _0x5cd926(_0x233f23) {
    if (_0x29c955) {
      if (_0x233f23) {
        _0x233f23();
      }
      return;
    }
    var _0x36c7bb = new XMLHttpRequest();
    _0x36c7bb.open("GET", _0x562721 + "/user", true);
    _0x36c7bb.onreadystatechange = function () {
      if (_0x36c7bb.readyState === 4) {
        try {
          var _0x6b357e = JSON.parse(_0x36c7bb.responseText);
          if (_0x6b357e.logged_in) {
            _0x5c514a = _0x6b357e.is_verified;
            _0x4f7b06 = _0x6b357e.discord_id;
            if (_0x4f7b06) {
              var _0x396ffc = document.createElement("script");
              _0x396ffc.textContent =
                'window.__haxDiscordId = "' + _0x4f7b06 + '";';
              document.body.appendChild(_0x396ffc);
              _0x396ffc.remove();
            }
          }
          _0x29c955 = true;
        } catch (_0x4fc7c1) {}
        if (_0x233f23) {
          _0x233f23();
        }
      }
    };
    _0x36c7bb.onerror = function () {
      if (_0x233f23) {
        _0x233f23();
      }
    };
    _0x36c7bb.send();
  }
  function _0x455395(_0x5407c2, _0x317c08) {
    if (_0x5407c2 === _0x5ddd24) {
      return;
    }
    _0x5ddd24 = _0x5407c2;
    var _0x313411 = new XMLHttpRequest();
    _0x313411.open("POST", _0x562721 + "/session/player-id", true);
    _0x313411.setRequestHeader("Content-Type", "application/json");
    _0x313411.send(
      JSON.stringify({
        player_id: _0x5407c2,
        room_id: _0x317c08,
      }),
    );
  }
  function _0x2e01c3() {
    var _0x4a0663 = _0x512c12();
    if (_0x4a0663 == null) {
      return null;
    }
    var _0x519801 = document.querySelectorAll('[class^="player-list-item"]');
    for (var _0x29b1f0 = 0; _0x29b1f0 < _0x519801.length; _0x29b1f0++) {
      var _0x37a8e7 = parseInt(_0x519801[_0x29b1f0].dataset.playerId, 10);
      if (_0x37a8e7 === _0x4a0663) {
        var _0x49caf0 =
          _0x519801[_0x29b1f0].querySelector('[data-hook="name"]');
        if (_0x49caf0) {
          return _0x5beaa6((_0x49caf0.textContent || "").trim());
        }
      }
    }
    return null;
  }
  function _0x377b56(_0x10252e, _0x328823) {
    if (!_0x10252e) {
      return;
    }
    var _0x320289 = new XMLHttpRequest();
    _0x320289.open("POST", _0x562721 + "/session/game-nick", true);
    _0x320289.setRequestHeader("Content-Type", "application/json");
    _0x320289.send(
      JSON.stringify({
        game_nick: _0x10252e,
        room_id: _0x328823,
      }),
    );
  }
  function _0x479f1e() {
    _0x5ddd24 = null;
    var _0x4fdd07 = new XMLHttpRequest();
    _0x4fdd07.open("POST", _0x562721 + "/session/leave-room", true);
    _0x4fdd07.setRequestHeader("Content-Type", "application/json");
    _0x4fdd07.send("{}");
  }
  function _0xd8a27e(_0x2095ba, _0x112167, _0x26f01f) {
    if (!_0x2095ba.length) {
      _0x26f01f({});
      return;
    }
    var _0x31c320 = new XMLHttpRequest();
    _0x31c320.open("POST", _0x562721 + "/verified-v2", true);
    _0x31c320.setRequestHeader("Content-Type", "application/json");
    _0x31c320.onreadystatechange = function () {
      if (_0x31c320.readyState === 4) {
        try {
          var _0x2fd242 = JSON.parse(_0x31c320.responseText);
          _0x26f01f(_0x2fd242 || {});
        } catch (_0x3c10b2) {
          _0x26f01f({});
        }
      }
    };
    _0x31c320.onerror = function () {
      _0x26f01f({});
    };
    _0x31c320.send(
      JSON.stringify({
        nicks: _0x2095ba,
        room_id: _0x112167,
      }),
    );
  }
  function _0x19dc20(_0x50aed7) {
    if (_0x511512()) {
      return;
    }
    var _0x63cbe4 = _0x50aed7.querySelector('[data-hook="name"]');
    if (!_0x63cbe4) {
      return;
    }
    var _0xa10d08 = (_0x63cbe4.textContent || "").trim();
    var _0x192894 = _0x5beaa6(_0xa10d08);
    var _0x5f4721 = parseInt(_0x50aed7.dataset.playerId, 10);
    var _0x4a5094 = _0x512c12();
    var _0x2957e6 = false;
    var _0x17a0f9 = "#249EF0";
    var _0x17073e = "";
    var _0x22a506 = null;
    var _0xbccaab = "";
    var _0xa4c6a5 = null;
    var _0x6accab = null;
    var _0x4c26a4 = null;
    var _0x12fef2 = null;
    if (_0x5f4721 === _0x4a5094) {
      if (_0x5c514a || window.__proSettings) {
        _0x2957e6 = true;
      }
      if (window.__proSettings) {
        if (window.__proSettings.verified_color) {
          _0x17a0f9 = window.__proSettings.verified_color;
        }
        if (window.__proSettings.verified_gradient) {
          _0x17073e = window.__proSettings.verified_gradient;
        }
        if (window.__proSettings.nick_color) {
          _0x22a506 = window.__proSettings.nick_color;
        }
        if (window.__proSettings.nick_gradient) {
          _0xbccaab = window.__proSettings.nick_gradient;
        }
        if (window.__proSettings.banner) {
          _0xa4c6a5 = window.__proSettings.banner;
        }
        if (window.__proSettings.font) {
          _0x6accab = window.__proSettings.font;
        }
        if (window.__proSettings.custom_banner_color1) {
          _0x4c26a4 = window.__proSettings.custom_banner_color1;
        }
        if (window.__proSettings.custom_banner_color2) {
          _0x12fef2 = window.__proSettings.custom_banner_color2;
        }
      }
    } else {
      var _0x56f71b = _0x226cef[_0x192894];
      if (_0x56f71b) {
        var _0x5ac6bf = true;
        if (_0x5ac6bf) {
          if (_0x56f71b.verified || _0x56f71b.isPro) {
            _0x2957e6 = true;
          }
          if (_0x56f71b.isPro || _0x56f71b.verified) {
            if (_0x56f71b.verified_color) {
              _0x17a0f9 = _0x56f71b.verified_color;
            }
            if (_0x56f71b.verified_gradient) {
              _0x17073e = _0x56f71b.verified_gradient;
            }
            if (_0x56f71b.nick_color) {
              _0x22a506 = _0x56f71b.nick_color;
            }
            if (_0x56f71b.nick_gradient) {
              _0xbccaab = _0x56f71b.nick_gradient;
            }
            if (_0x56f71b.banner) {
              _0xa4c6a5 = _0x56f71b.banner;
            }
            if (_0x56f71b.font) {
              _0x6accab = _0x56f71b.font;
            }
            if (_0x56f71b.custom_banner_color1) {
              _0x4c26a4 = _0x56f71b.custom_banner_color1;
            }
            if (_0x56f71b.custom_banner_color2) {
              _0x12fef2 = _0x56f71b.custom_banner_color2;
            }
          }
        }
      }
    }
    _0x1fb025(
      _0x50aed7,
      _0xa4c6a5,
      _0x5f4721,
      _0x4a5094,
      _0x192894,
      _0x4c26a4,
      _0x12fef2,
    );
    _0x4040af(_0x63cbe4, _0x6accab, _0x5f4721, _0x4a5094, _0x192894);
    if (!_0x50aed7.classList.contains("admin")) {
      if (_0xbccaab) {
        var _0x116b25 = _0xbccaab.split(",");
        var _0x54e754 =
          "linear-gradient(90deg, " +
          _0x116b25[0].trim() +
          ", " +
          _0x116b25[1].trim() +
          ")";
        var _0x545c2e = _0x63cbe4.childNodes[0];
        if (_0x545c2e && _0x545c2e.nodeType === 3) {
          var _0x4ad7a2 = document.createElement("span");
          _0x4ad7a2.className = "nick-gradient";
          _0x4ad7a2.textContent = _0x545c2e.textContent;
          _0x63cbe4.replaceChild(_0x4ad7a2, _0x545c2e);
          _0x545c2e = _0x4ad7a2;
        } else if (
          !_0x545c2e ||
          !_0x545c2e.classList ||
          !_0x545c2e.classList.contains("nick-gradient")
        ) {
          var _0x52ed8f = _0x63cbe4.querySelector(".nick-gradient");
          if (_0x52ed8f) {
            _0x545c2e = _0x52ed8f;
          } else {
            var _0x204fc3 = "";
            for (
              var _0x44194c = 0;
              _0x44194c < _0x63cbe4.childNodes.length;
              _0x44194c++
            ) {
              if (_0x63cbe4.childNodes[_0x44194c].nodeType === 3) {
                _0x204fc3 += _0x63cbe4.childNodes[_0x44194c].textContent;
              }
            }
            if (_0x204fc3.trim()) {
              var _0x4ad7a2 = document.createElement("span");
              _0x4ad7a2.className = "nick-gradient";
              _0x4ad7a2.textContent = _0x204fc3.trim();
              for (
                var _0x44194c = _0x63cbe4.childNodes.length - 1;
                _0x44194c >= 0;
                _0x44194c--
              ) {
                if (_0x63cbe4.childNodes[_0x44194c].nodeType === 3) {
                  _0x63cbe4.removeChild(_0x63cbe4.childNodes[_0x44194c]);
                }
              }
              _0x63cbe4.insertBefore(_0x4ad7a2, _0x63cbe4.firstChild);
              _0x545c2e = _0x4ad7a2;
            }
          }
        }
        if (_0x545c2e && _0x545c2e.style) {
          _0x545c2e.style.setProperty("background", _0x54e754, "important");
          _0x545c2e.style.setProperty(
            "-webkit-background-clip",
            "text",
            "important",
          );
          _0x545c2e.style.setProperty(
            "-webkit-text-fill-color",
            "transparent",
            "important",
          );
          _0x545c2e.style.setProperty("background-clip", "text", "important");
          _0x545c2e.style.setProperty("display", "inline-block", "important");
          _0x545c2e.style.setProperty("color", "transparent", "important");
        }
        _0x63cbe4.style.color = "";
      } else if (_0x22a506) {
        var _0x2b8ffa = _0x63cbe4.querySelector(".nick-gradient");
        if (_0x2b8ffa) {
          var _0x4b7ba3 = _0x2b8ffa.textContent;
          _0x2b8ffa.replaceWith(document.createTextNode(_0x4b7ba3));
        }
        _0x63cbe4.style.background = "";
        _0x63cbe4.style.webkitBackgroundClip = "";
        _0x63cbe4.style.webkitTextFillColor = "";
        _0x63cbe4.style.backgroundClip = "";
        _0x63cbe4.style.display = "";
        _0x63cbe4.style.color = _0x22a506;
      } else {
        var _0x2b8ffa = _0x63cbe4.querySelector(".nick-gradient");
        if (_0x2b8ffa) {
          var _0x4b7ba3 = _0x2b8ffa.textContent;
          _0x2b8ffa.replaceWith(document.createTextNode(_0x4b7ba3));
        }
        _0x63cbe4.style.background = "";
        _0x63cbe4.style.webkitBackgroundClip = "";
        _0x63cbe4.style.webkitTextFillColor = "";
        _0x63cbe4.style.backgroundClip = "";
        _0x63cbe4.style.display = "";
        _0x63cbe4.style.color = "";
      }
    }
    if (!_0x2957e6) {
      return;
    }
    var _0xb487df = _0x50aed7.querySelector(".verified-badge");
    if (_0xb487df) {
      _0xb487df.remove();
    }
    var _0x3e21ef = document.createElement("span");
    _0x3e21ef.className = "verified-badge";
    if (_0x17073e) {
      var _0x116b25 = _0x17073e.split(",");
      _0x3e21ef.innerHTML =
        '<svg width="12" height="12" viewBox="0 0 22 22"><defs><linearGradient id="vg-' +
        _0x5f4721 +
        '" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="' +
        _0x116b25[0] +
        '"/><stop offset="100%" stop-color="' +
        _0x116b25[1] +
        '"/></linearGradient></defs><path d="M20.4 11c0-1.2-.7-2.3-1.8-2.9.4-1.2.2-2.5-.7-3.4-.9-.9-2.2-1.1-3.4-.7C14 2.9 12.9 2.2 11.7 2.2c-1.2 0-2.3.7-2.9 1.8-1.2-.4-2.5-.2-3.4.7-.9.9-1.1 2.2-.7 3.4C3.6 8.7 2.9 9.8 2.9 11c0 1.2.7 2.3 1.8 2.9-.4 1.2-.2 2.5.7 3.4.9.9 2.2 1.1 3.4.7.6 1.1 1.7 1.8 2.9 1.8 1.2 0 2.3-.7 2.9-1.8 1.2.4 2.5.2 3.4-.7.9-.9 1.1-2.2.7-3.4 1.1-.6 1.7-1.7 1.7-2.9z" fill="url(#vg-' +
        _0x5f4721 +
        ')"/><path d="M15 9l-4.5 4.5L8 11" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else {
      _0x3e21ef.innerHTML =
        '<svg width="12" height="12" viewBox="0 0 22 22" fill="none"><path d="M20.4 11c0-1.2-.7-2.3-1.8-2.9.4-1.2.2-2.5-.7-3.4-.9-.9-2.2-1.1-3.4-.7C14 2.9 12.9 2.2 11.7 2.2c-1.2 0-2.3.7-2.9 1.8-1.2-.4-2.5-.2-3.4.7-.9.9-1.1 2.2-.7 3.4C3.6 8.7 2.9 9.8 2.9 11c0 1.2.7 2.3 1.8 2.9-.4 1.2-.2 2.5.7 3.4.9.9 2.2 1.1 3.4.7.6 1.1 1.7 1.8 2.9 1.8 1.2 0 2.3-.7 2.9-1.8 1.2.4 2.5.2 3.4-.7.9-.9 1.1-2.2.7-3.4 1.1-.6 1.7-1.7 1.7-2.9z" fill="' +
        _0x17a0f9 +
        '"/><path d="M15 9l-4.5 4.5L8 11" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    _0x3e21ef.style.cssText =
      "display:inline-flex;align-items:center;margin-left:3px;vertical-align:middle;";
    var _0x3ddc06 = _0x63cbe4.querySelector(".team-badge");
    if (_0x3ddc06) {
      _0x63cbe4.insertBefore(_0x3e21ef, _0x3ddc06);
    } else {
      _0x63cbe4.appendChild(_0x3e21ef);
    }
  }
  function _0x4040af(_0x3c4c63, _0x6c0c40, _0x52d6ac, _0x46d50c, _0x48f395) {
    var _0x33e4ab = window.__proFonts || {
      default: {
        family: "Space Grotesk",
      },
      roboto: {
        family: "Roboto",
      },
      poppins: {
        family: "Poppins",
      },
      montserrat: {
        family: "Montserrat",
      },
      oswald: {
        family: "Oswald",
      },
      raleway: {
        family: "Raleway",
      },
      ubuntu: {
        family: "Ubuntu",
      },
      quicksand: {
        family: "Quicksand",
      },
      comfortaa: {
        family: "Comfortaa",
      },
      righteous: {
        family: "Righteous",
      },
      orbitron: {
        family: "Orbitron",
      },
      pressstart: {
        family: "Press Start 2P",
      },
    };
    if (!_0x6c0c40 || _0x6c0c40 === "default" || !_0x33e4ab[_0x6c0c40]) {
      _0x3c4c63.style.removeProperty("font-family");
      return;
    }
    var _0x43ce4d = _0x33e4ab[_0x6c0c40].family;
    _0x3c4c63.style.setProperty(
      "font-family",
      "'" + _0x43ce4d + "', sans-serif",
      "important",
    );
  }
  function _0x1fb025(
    _0x3338af,
    _0x305949,
    _0x48f644,
    _0x42f3a9,
    _0x1e2fe0,
    _0x347793,
    _0x21e20a,
  ) {
    var _0x447d01 = window.__proBanners || {
      none: {
        gradient: "none",
      },
      gold: {
        gradient:
          "linear-gradient(90deg, rgba(255,215,0,0.15) 0%, rgba(255,193,7,0.25) 50%, rgba(255,215,0,0.15) 100%)",
      },
      diamond: {
        gradient:
          "linear-gradient(90deg, rgba(185,242,255,0.15) 0%, rgba(0,191,255,0.25) 50%, rgba(185,242,255,0.15) 100%)",
      },
      fire: {
        gradient:
          "linear-gradient(90deg, rgba(255,69,0,0.15) 0%, rgba(255,140,0,0.25) 50%, rgba(255,69,0,0.15) 100%)",
      },
      emerald: {
        gradient:
          "linear-gradient(90deg, rgba(0,201,87,0.15) 0%, rgba(80,200,120,0.25) 50%, rgba(0,201,87,0.15) 100%)",
      },
      purple: {
        gradient:
          "linear-gradient(90deg, rgba(138,43,226,0.15) 0%, rgba(186,85,211,0.25) 50%, rgba(138,43,226,0.15) 100%)",
      },
      rainbow: {
        gradient:
          "linear-gradient(90deg, rgba(255,0,0,0.2) 0%, rgba(255,127,0,0.2) 17%, rgba(255,255,0,0.2) 33%, rgba(0,255,0,0.2) 50%, rgba(0,127,255,0.2) 67%, rgba(139,0,255,0.2) 83%, rgba(255,0,0,0.2) 100%)",
      },
      neon: {
        gradient:
          "linear-gradient(90deg, rgba(57,255,20,0.15) 0%, rgba(0,255,255,0.25) 50%, rgba(57,255,20,0.15) 100%)",
      },
      sunset: {
        gradient:
          "linear-gradient(90deg, rgba(255,94,77,0.15) 0%, rgba(255,154,0,0.25) 50%, rgba(255,94,77,0.15) 100%)",
      },
      ocean: {
        gradient:
          "linear-gradient(90deg, rgba(0,105,148,0.15) 0%, rgba(0,168,232,0.25) 50%, rgba(0,105,148,0.15) 100%)",
      },
      midnight: {
        gradient:
          "linear-gradient(90deg, rgba(25,25,112,0.2) 0%, rgba(72,61,139,0.3) 50%, rgba(25,25,112,0.2) 100%)",
      },
      cherry: {
        gradient:
          "linear-gradient(90deg, rgba(222,49,99,0.15) 0%, rgba(255,105,180,0.25) 50%, rgba(222,49,99,0.15) 100%)",
      },
      custom: {
        gradient: "none",
      },
    };
    _0x3338af.classList.remove("pro-banner");
    _0x3338af.style.removeProperty("--pro-banner-gradient");
    if (!_0x305949 || _0x305949 === "none") {
      return;
    }
    var _0xe289f4;
    if (_0x305949 === "custom" && _0x347793 && _0x21e20a) {
      _0xe289f4 =
        "linear-gradient(90deg, " +
        _0x347793 +
        "33 0%, " +
        _0x21e20a +
        "44 50%, " +
        _0x347793 +
        "33 100%)";
    } else if (
      _0x447d01[_0x305949] &&
      _0x447d01[_0x305949].gradient !== "none"
    ) {
      _0xe289f4 = _0x447d01[_0x305949].gradient;
    }
    if (_0xe289f4) {
      _0x3338af.classList.add("pro-banner");
      _0x3338af.style.setProperty("--pro-banner-gradient", _0xe289f4);
    }
  }
  function _0x22f02d() {
    if (!_0x4f54cd) {
      return;
    }
    var _0x55224c = document.querySelectorAll('[class^="player-list-item"]');
    var _0x5d9922 = _0x512c12();
    for (var _0x2c416 = 0; _0x2c416 < _0x55224c.length; _0x2c416++) {
      var _0xfe9ff7 = _0x55224c[_0x2c416];
      var _0x5c3750 = _0xfe9ff7.querySelector('[data-hook="name"]');
      if (!_0x5c3750) {
        continue;
      }
      var _0x25570f = (_0x5c3750.textContent || "").trim();
      var _0x3b4c58 = parseInt(_0xfe9ff7.dataset.playerId, 10);
      var _0x2717fb = null;
      if (_0x3b4c58 === _0x5d9922 && window.__proSettings) {
        _0x2717fb = window.__proSettings.banner;
      } else {
        var _0x4aa000 = _0x226cef[_0x25570f];
        if (_0x4aa000 && _0x4aa000.banner) {
          _0x2717fb = _0x4aa000.banner;
        }
      }
      _0x1fb025(_0xfe9ff7, _0x2717fb, _0x3b4c58, _0x5d9922, _0x25570f);
    }
  }
  function _0x522924() {
    if (!_0x4f54cd) {
      return;
    }
    var _0x3ed0b2 = document.querySelectorAll('[class^="player-list-item"]');
    var _0x61c29 = _0x512c12();
    for (var _0x563257 = 0; _0x563257 < _0x3ed0b2.length; _0x563257++) {
      var _0x5f1fd2 = _0x3ed0b2[_0x563257];
      var _0x33b470 = _0x5f1fd2.querySelector('[data-hook="name"]');
      if (!_0x33b470) {
        continue;
      }
      var _0x3820b8 = (_0x33b470.textContent || "").trim();
      var _0x3efa91 = parseInt(_0x5f1fd2.dataset.playerId, 10);
      var _0x11f155 = null;
      if (_0x3efa91 === _0x61c29 && window.__proSettings) {
        _0x11f155 = window.__proSettings.font;
      } else {
        var _0x2ad78d = _0x226cef[_0x3820b8];
        if (_0x2ad78d && _0x2ad78d.font) {
          _0x11f155 = _0x2ad78d.font;
        }
      }
      _0x4040af(_0x33b470, _0x11f155, _0x3efa91, _0x61c29, _0x3820b8);
    }
  }
  function _0x271770() {
    if (!_0x4f54cd) {
      return;
    }
    var _0x3f10f0 = _0x512c12();
    var _0x3707cb = _0x3fd772();
    if (_0x3f10f0 != null && _0x3f10f0 !== _0x5ddd24) {
      _0x455395(_0x3f10f0, _0x3707cb);
    }
    var _0x419e23 = document.querySelectorAll('[class^="player-list-item"]');
    if (!_0x419e23.length) {
      return;
    }
    var _0x406a09 = [];
    var _0x59c5a3 = false;
    for (var _0xbdce2a = 0; _0xbdce2a < _0x419e23.length; _0xbdce2a++) {
      var _0x26933b = parseInt(_0x419e23[_0xbdce2a].dataset.playerId, 10);
      if (_0x26933b === _0x3f10f0) {
        var _0x5f2f2a =
          _0x419e23[_0xbdce2a].querySelector('[data-hook="name"]');
        if (_0x5f2f2a) {
          var _0x66b508 = (_0x5f2f2a.textContent || "").trim();
          var _0x31f70e = _0x5beaa6(_0x66b508);
          if (!_0x59c5a3) {
            _0x377b56(_0x31f70e, _0x3707cb);
            _0x59c5a3 = true;
          }
          _0x19dc20(_0x419e23[_0xbdce2a]);
        }
        break;
      }
    }
    for (var _0xbdce2a = 0; _0xbdce2a < _0x419e23.length; _0xbdce2a++) {
      var _0x5f2f2a = _0x419e23[_0xbdce2a].querySelector('[data-hook="name"]');
      var _0x26933b = parseInt(_0x419e23[_0xbdce2a].dataset.playerId, 10);
      if (_0x26933b === _0x3f10f0) {
        continue;
      }
      if (_0x5f2f2a) {
        var _0x66b508 = (_0x5f2f2a.textContent || "").trim();
        var _0x31f70e = _0x5beaa6(_0x66b508);
        _0x19dc20(_0x419e23[_0xbdce2a]);
        if (_0x31f70e && !_0x226cef.hasOwnProperty(_0x31f70e)) {
          _0x406a09.push(_0x31f70e);
        }
      }
    }
    if (_0x406a09.length === 0) {
      return;
    }
    _0xd8a27e(_0x406a09, _0x3707cb, function (_0x116c8d) {
      for (var _0x53d92f in _0x116c8d) {
        _0x226cef[_0x53d92f] = _0x116c8d[_0x53d92f];
      }
      for (var _0x568cfe = 0; _0x568cfe < _0x406a09.length; _0x568cfe++) {
        if (!_0x226cef[_0x406a09[_0x568cfe]]) {
          _0x226cef[_0x406a09[_0x568cfe]] = {
            verified: false,
            playerId: null,
            discordId: null,
            isPro: false,
          };
        }
      }
      window.__verifiedCache = _0x226cef;
      try {
        localStorage.setItem(
          "haxclient_verified_cache",
          JSON.stringify(_0x226cef),
        );
      } catch (_0x4ca42f) {}
      var _0xeb13db = document.querySelectorAll('[class^="player-list-item"]');
      for (var _0x5dadaa = 0; _0x5dadaa < _0xeb13db.length; _0x5dadaa++) {
        var _0x45bdbe =
          _0xeb13db[_0x5dadaa].querySelector('[data-hook="name"]');
        if (_0x45bdbe) {
          var _0x534f7f = (_0x45bdbe.textContent || "").trim();
          var _0x53d92f = _0x5beaa6(_0x534f7f);
          if (_0x406a09.indexOf(_0x53d92f) !== -1) {
            _0x19dc20(_0xeb13db[_0x5dadaa]);
          }
        }
      }
    });
  }
  function _0x4ade9f(_0x3e32ad) {
    if (!_0x4f54cd) {
      return;
    }
    var _0x23be15 = _0x512c12();
    var _0x1188ff = _0x3fd772();
    var _0x58fbf8 = [];
    for (var _0x371393 = 0; _0x371393 < _0x3e32ad.length; _0x371393++) {
      var _0x469c4a = _0x3e32ad[_0x371393];
      var _0x5c58bb = _0x469c4a.querySelector('[data-hook="name"]');
      var _0x1b82a5 = parseInt(_0x469c4a.dataset.playerId, 10);
      if (_0x5c58bb) {
        var _0x1027f1 = (_0x5c58bb.textContent || "").trim();
        var _0x5ad701 = _0x5beaa6(_0x1027f1);
        _0x19dc20(_0x469c4a);
        if (
          _0x5ad701 &&
          !_0x226cef.hasOwnProperty(_0x5ad701) &&
          _0x1b82a5 !== _0x23be15
        ) {
          _0x58fbf8.push(_0x5ad701);
        }
      }
    }
    if (_0x58fbf8.length === 0) {
      return;
    }
    _0xd8a27e(_0x58fbf8, _0x1188ff, function (_0x5e28f1) {
      for (var _0x436c3f in _0x5e28f1) {
        _0x226cef[_0x436c3f] = _0x5e28f1[_0x436c3f];
      }
      for (var _0x8d841b = 0; _0x8d841b < _0x58fbf8.length; _0x8d841b++) {
        if (!_0x226cef[_0x58fbf8[_0x8d841b]]) {
          _0x226cef[_0x58fbf8[_0x8d841b]] = {
            verified: false,
            playerId: null,
            discordId: null,
            isPro: false,
          };
        }
      }
      window.__verifiedCache = _0x226cef;
      try {
        localStorage.setItem(
          "haxclient_verified_cache",
          JSON.stringify(_0x226cef),
        );
      } catch (_0x438f1b) {}
      for (var _0x272d62 = 0; _0x272d62 < _0x3e32ad.length; _0x272d62++) {
        var _0x53a684 =
          _0x3e32ad[_0x272d62].querySelector('[data-hook="name"]');
        if (_0x53a684) {
          var _0x138d0b = (_0x53a684.textContent || "").trim();
          var _0x436c3f = _0x5beaa6(_0x138d0b);
          if (_0x58fbf8.indexOf(_0x436c3f) !== -1) {
            _0x19dc20(_0x3e32ad[_0x272d62]);
          }
        }
      }
    });
  }
  function _0x55c474() {
    var _0x52f720 = document.querySelectorAll(
      '.player-list-view .list[data-hook="list"]',
    );
    if (!_0x52f720.length) {
      setTimeout(_0x55c474, 200);
      return;
    }
    if (window.__myLocalPlayerId != null && _0x1c1fa2) {
      _0x4f54cd = true;
      if (_0x1e7c49.length === 0) {
        for (var _0x16e0ae = 0; _0x16e0ae < _0x52f720.length; _0x16e0ae++) {
          var _0x588ae6 = new MutationObserver(function (_0x97c5e5) {
            var _0x419801 = [];
            for (var _0x18c181 = 0; _0x18c181 < _0x97c5e5.length; _0x18c181++) {
              var _0x29ae9a = _0x97c5e5[_0x18c181].addedNodes;
              for (
                var _0x443153 = 0;
                _0x443153 < _0x29ae9a.length;
                _0x443153++
              ) {
                if (
                  _0x29ae9a[_0x443153].nodeType === 1 &&
                  _0x29ae9a[_0x443153].className &&
                  _0x29ae9a[_0x443153].className.indexOf("player-list-item") !==
                    -1
                ) {
                  _0x419801.push(_0x29ae9a[_0x443153]);
                }
              }
            }
            if (_0x419801.length > 0) {
              _0x4ade9f(_0x419801);
            }
          });
          _0x588ae6.observe(_0x52f720[_0x16e0ae], {
            childList: true,
          });
          _0x1e7c49.push(_0x588ae6);
        }
      }
      _0x271770();
      return;
    }
    if (_0x1c1fa2) {
      return;
    }
    _0x7c598(function (_0x2b38e1) {
      if (_0x1c1fa2) {
        return;
      }
      _0x1c1fa2 = true;
      window.__myLocalPlayerId = _0x2b38e1;
      _0x4f54cd = true;
      _0x226cef = {};
      processedPlayers = {};
      for (var _0x8cfd9 = 0; _0x8cfd9 < _0x52f720.length; _0x8cfd9++) {
        var _0x501f13 = new MutationObserver(function (_0x51d774) {
          var _0x5de108 = [];
          for (var _0x31d66b = 0; _0x31d66b < _0x51d774.length; _0x31d66b++) {
            var _0x4b7ac5 = _0x51d774[_0x31d66b].addedNodes;
            for (var _0x20240f = 0; _0x20240f < _0x4b7ac5.length; _0x20240f++) {
              if (
                _0x4b7ac5[_0x20240f].nodeType === 1 &&
                _0x4b7ac5[_0x20240f].className &&
                _0x4b7ac5[_0x20240f].className.indexOf("player-list-item") !==
                  -1
              ) {
                _0x5de108.push(_0x4b7ac5[_0x20240f]);
              }
            }
          }
          if (_0x5de108.length > 0) {
            _0x4ade9f(_0x5de108);
          }
        });
        _0x501f13.observe(_0x52f720[_0x8cfd9], {
          childList: true,
        });
        _0x1e7c49.push(_0x501f13);
      }
      _0x271770();
    });
  }
  function _0x50f91a() {
    _0x4f54cd = false;
    _0x1c1fa2 = false;
    window.__myLocalPlayerId = null;
    _0x5ddd24 = null;
    _0x226cef = {};
    processedPlayers = {};
    for (var _0x1e24c1 = 0; _0x1e24c1 < _0x1e7c49.length; _0x1e24c1++) {
      _0x1e7c49[_0x1e24c1].disconnect();
    }
    _0x1e7c49 = [];
  }
  function _0x159724() {
    if (!_0x4f54cd) {
      return;
    }
    var _0x4baa53 = document.querySelectorAll('[class^="player-list-item"]');
    for (var _0x3d19f4 = 0; _0x3d19f4 < _0x4baa53.length; _0x3d19f4++) {
      _0x19dc20(_0x4baa53[_0x3d19f4]);
    }
  }
  function _0x2ca628() {
    if (!Injector.isGameFrame()) {
      return;
    }
    window.__refreshVerifiedBadges = _0x159724;
    window.__refreshProBanners = _0x22f02d;
    window.__refreshProFonts = _0x522924;
    _0x5cd926(function () {
      Injector.onView("room-view", function () {
        setTimeout(_0x55c474, 100);
      });
      Injector.onViewLeave("room-view", function () {
        _0x50f91a();
        _0x479f1e();
      });
      if (document.querySelector(".room-view")) {
        setTimeout(_0x55c474, 100);
      }
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _0x2ca628);
  } else {
    _0x2ca628();
  }
})();
