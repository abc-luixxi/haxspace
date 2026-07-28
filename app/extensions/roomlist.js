(function () {
  if (Injector.isMainFrame()) {
    return;
  }
  var _0x301f1c = null;
  var _0x1f876d = null;
  var _0x1cab10 = "all";
  var _0x1b5c7f = null;
  var _0x492459 = false;
  var _0x5e4e15 = "fav_rooms";
  function _0x32597a() {
    try {
      return JSON.parse(localStorage.getItem(_0x5e4e15) || "[]");
    } catch (_0xcb3a51) {
      return [];
    }
  }
  function _0xe06e18(_0x2ccb79) {
    localStorage.setItem(_0x5e4e15, JSON.stringify(_0x2ccb79));
  }
  function _0x1fc6aa(_0x3dee59) {
    var _0x181908 = _0x3dee59.trim();
    var _0x406675 = _0x32597a();
    var _0x2e183a = _0x406675.indexOf(_0x181908);
    if (_0x2e183a === -1) {
      _0x406675.push(_0x181908);
      _0xe06e18(_0x406675);
      return true;
    } else {
      _0x406675.splice(_0x2e183a, 1);
      _0xe06e18(_0x406675);
      return false;
    }
  }
  function _0x3057f6(_0x49f9f3) {
    return _0x32597a().indexOf(_0x49f9f3) !== -1;
  }
  var _0x29550b = "pinned_rooms";
  function _0x46f56b() {
    try {
      return JSON.parse(sessionStorage.getItem(_0x29550b) || "[]");
    } catch (_0xaaba17) {
      return [];
    }
  }
  function _0x46096b(_0x100a82) {
    sessionStorage.setItem(_0x29550b, JSON.stringify(_0x100a82));
  }
  function _0x539c45(_0x2cf809) {
    var _0x565cd7 = _0x2cf809.trim();
    var _0x4480fd = _0x46f56b();
    var _0x1f86da = _0x4480fd.indexOf(_0x565cd7);
    if (_0x1f86da === -1) {
      _0x4480fd.push(_0x565cd7);
      _0x46096b(_0x4480fd);
      return true;
    } else {
      _0x4480fd.splice(_0x1f86da, 1);
      _0x46096b(_0x4480fd);
      return false;
    }
  }
  function _0x3a13d6(_0x306efa) {
    return _0x46f56b().indexOf(_0x306efa.trim()) !== -1;
  }
  function _0x1b8dc2() {
    sessionStorage.removeItem(_0x29550b);
  }
  function _0xea094f(_0x3c83ec) {
    if (!_0x3c83ec) {
      return;
    }
    var _0x13dc5c = _0x46f56b();
    if (_0x13dc5c.length === 0) {
      return;
    }
    var _0x27581e = Array.prototype.slice.call(
      _0x3c83ec.querySelectorAll("tr"),
    );
    var _0x47ae0c = [];
    var _0x2165a9 = [];
    for (var _0x47f0a4 = 0; _0x47f0a4 < _0x27581e.length; _0x47f0a4++) {
      var _0x4934c2 = _0x27581e[_0x47f0a4].querySelector('[data-hook="name"]');
      if (_0x4934c2) {
        var _0x463165 = (_0x4934c2.textContent || "").trim();
        if (_0x13dc5c.indexOf(_0x463165) !== -1) {
          _0x47ae0c.push(_0x27581e[_0x47f0a4]);
        } else {
          _0x2165a9.push(_0x27581e[_0x47f0a4]);
        }
      } else {
        _0x2165a9.push(_0x27581e[_0x47f0a4]);
      }
    }
    var _0x138da0 = false;
    for (var _0x19ce30 = 0; _0x19ce30 < _0x47ae0c.length; _0x19ce30++) {
      if (_0x27581e[_0x19ce30] !== _0x47ae0c[_0x19ce30]) {
        _0x138da0 = true;
        break;
      }
    }
    if (!_0x138da0) {
      return;
    }
    for (var _0x3e8e82 = 0; _0x3e8e82 < _0x27581e.length; _0x3e8e82++) {
      _0x27581e[_0x3e8e82].remove();
    }
    for (var _0x38e55d = 0; _0x38e55d < _0x47ae0c.length; _0x38e55d++) {
      _0x3c83ec.appendChild(_0x47ae0c[_0x38e55d]);
    }
    for (var _0x2871ea = 0; _0x2871ea < _0x2165a9.length; _0x2871ea++) {
      _0x3c83ec.appendChild(_0x2165a9[_0x2871ea]);
    }
  }
  function _0x57cac1(_0x5982fa) {
    var _0x1fae83 = _0x5982fa.querySelectorAll("tr");
    var _0x462deb = _0x46f56b();
    for (var _0x13ff46 = 0; _0x13ff46 < _0x1fae83.length; _0x13ff46++) {
      var _0x1c4b53 = _0x1fae83[_0x13ff46].querySelector('[data-hook="name"]');
      if (!_0x1c4b53) {
        continue;
      }
      var _0x54efc5 = (_0x1c4b53.textContent || "").trim();
      if (_0x462deb.indexOf(_0x54efc5) !== -1) {
        _0x1fae83[_0x13ff46].classList.add("pinned-room");
      } else {
        _0x1fae83[_0x13ff46].classList.remove("pinned-room");
      }
    }
  }
  function _0x153fe9() {
    if (_0x301f1c) {
      _0x301f1c.disconnect();
      _0x301f1c = null;
    }
    _0x1f876d = null;
  }
  function _0x412bde(_0xbd38) {
    var _0x556e09 = _0xbd38.querySelector("[data-hook='list']");
    if (!_0x556e09) {
      return [];
    }
    _0x1f876d = [];
    var _0x1fafb1 = _0x556e09.querySelectorAll("tr");
    for (var _0x5980c5 = 0; _0x5980c5 < _0x1fafb1.length; _0x5980c5++) {
      var _0x19346e = _0x1fafb1[_0x5980c5];
      var _0x2b0fef = _0x19346e.querySelector("[data-hook='name']");
      var _0x49f3a8 = _0x19346e.querySelector("[data-hook='flag']");
      _0x1f876d.push({
        row: _0x19346e,
        name: _0x2b0fef ? (_0x2b0fef.textContent || "").toLowerCase() : "",
        country: _0x49f3a8
          ? _0x49f3a8.className.replace("flagico f-", "").trim()
          : "",
      });
    }
    return _0x1f876d;
  }
  function _0x157001(_0x46a73c, _0x1d11a1) {
    var _0x1244b8 = _0x1f876d || _0x412bde(_0x46a73c);
    if (!_0x1244b8.length) {
      return;
    }
    for (var _0xd76e07 = 0; _0xd76e07 < _0x1244b8.length; _0xd76e07++) {
      var _0x31b5a5 = _0x1244b8[_0xd76e07];
      var _0x3b75c1 =
        _0x1d11a1 === "" || _0x31b5a5.name.indexOf(_0x1d11a1) !== -1;
      var _0x848fd8 = _0x1cab10 === "all" || _0x31b5a5.country === _0x1cab10;
      if (_0x3b75c1 && _0x848fd8) {
        _0x31b5a5.row.classList.remove("search-hidden");
      } else {
        _0x31b5a5.row.classList.add("search-hidden");
      }
    }
  }
  function _0x4460da(_0x42ed58) {
    return;
    var _0x5df090 = _0x42ed58.querySelector(
      '.roomlist-view tbody[data-hook="list"]',
    );
    var _0x49cdd5 = _0x42ed58.querySelector(".roomlist-view");
    if (!_0x5df090 || !_0x49cdd5) {
      _0x153fe9();
      return;
    }
    var _0x545d0f = _0x49cdd5.querySelector(".dialog");
    if (!_0x545d0f) {
      return;
    }
    if (!_0x42ed58.getElementById("sidebar-panel")) {
      var _0x13337d = _0x42ed58.createElement("div");
      _0x13337d.id = "sidebar-tooltip";
      _0x13337d.style.cssText =
        "position:fixed;background:var(--theme-tooltip-bg, #222);color:var(--theme-text-primary, #fff);padding:6px 10px;border-radius:6px;font-size:12px;pointer-events:none;opacity:0;transition:opacity 0.15s;z-index:10000;white-space:nowrap;border:1px solid var(--theme-tooltip-border, #333);box-shadow:0 4px 16px rgba(0,0,0,0.3);";
      _0x42ed58.body.appendChild(_0x13337d);
      function _0x457ff2(_0x451ecb, _0x8a3429) {
        var _0x1f4221 = _0x451ecb.getBoundingClientRect();
        _0x13337d.textContent = _0x8a3429;
        _0x13337d.style.left = _0x1f4221.right + 8 + "px";
        _0x13337d.style.top = _0x1f4221.top + _0x1f4221.height / 2 - 12 + "px";
        _0x13337d.style.opacity = "1";
      }
      function _0x3a474d() {
        _0x13337d.style.opacity = "0";
      }
      function _0x46a11c(_0x98dc5d, _0x36402f) {
        if (!_0x98dc5d) {
          return;
        }
        _0x98dc5d.addEventListener("mouseenter", function () {
          _0x457ff2(_0x98dc5d, _0x36402f);
        });
        _0x98dc5d.addEventListener("mouseleave", _0x3a474d);
        _0x98dc5d.addEventListener("click", _0x3a474d);
      }
      var _0x221f99 = _0x42ed58.createElement("div");
      _0x221f99.id = "sidebar-panel";
      _0x221f99.style.cssText =
        "position:absolute;right:-50px;top:5px;bottom:5px;width:50px;background:var(--theme-bg-primary, #141414);border:1px solid var(--theme-border, #232323);border-radius:0 8px 8px 0;display:flex;flex-direction:column;gap:8px;padding:10px 6px;box-sizing:border-box;z-index:-1;";
      _0x221f99.addEventListener("mouseleave", _0x3a474d);
      var _0x163364 = _0x42ed58.querySelector(
        '.roomlist-view button[data-hook="refresh"]',
      );
      var _0x292246 = _0x42ed58.querySelector(
        '.roomlist-view button[data-hook="join"]',
      );
      var _0x3cc773 = _0x42ed58.querySelector(
        '.roomlist-view button[data-hook="create"]',
      );
      var _0x11d190 = _0x42ed58.querySelector(
        '.roomlist-view label[for="replayfile"]',
      );
      var _0x8c3f5a = _0x42ed58.querySelector(
        '.roomlist-view button[data-hook="settings"]',
      );
      if (_0x163364) {
        _0x163364.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>';
        var _0x520420 =
          window.__t ||
          function (_0xcd9da1) {
            return _0xcd9da1;
          };
        _0x46a11c(_0x163364, _0x520420("Atualizar"));
        _0x221f99.appendChild(_0x163364);
      }
      if (_0x292246) {
        var _0x33918d = _0x42ed58.createElement("div");
        _0x33918d.style.cssText = "display:flex;justify-content:center;";
        _0x292246.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></svg>';
        _0x46a11c(_0x33918d, _0x520420("Entrar"));
        _0x33918d.appendChild(_0x292246);
        _0x221f99.appendChild(_0x33918d);
      }
      if (_0x3cc773) {
        _0x3cc773.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>';
        _0x46a11c(_0x3cc773, _0x520420("Criar Sala"));
        _0x221f99.appendChild(_0x3cc773);
      }
      var _0x2b0589 = _0x42ed58.createElement("button");
      _0x2b0589.id = "fav-filter-btn";
      _0x46a11c(_0x2b0589, _0x520420("Favoritos"));
      _0x2b0589.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
      _0x2b0589.onclick = function () {
        var _0x5f398d = _0x5df090.querySelectorAll("tr");
        var _0x3db475 = _0x32597a();
        if (!_0x492459) {
          if (_0x3db475.length === 0) {
            return;
          }
          for (var _0xc53c89 = 0; _0xc53c89 < _0x5f398d.length; _0xc53c89++) {
            var _0x5b85df =
              _0x5f398d[_0xc53c89].querySelector('[data-hook="name"]');
            if (!_0x5b85df) {
              continue;
            }
            var _0x17921b = (_0x5b85df.textContent || "").trim();
            if (_0x3db475.indexOf(_0x17921b) !== -1) {
              _0x5f398d[_0xc53c89].classList.remove("fav-hidden");
            } else {
              _0x5f398d[_0xc53c89].classList.add("fav-hidden");
            }
          }
          _0x492459 = true;
          var _0xbf0fd8 = _0x2b0589.querySelector("svg");
          _0xbf0fd8.setAttribute("fill", "#f59e0b");
          _0xbf0fd8.setAttribute("stroke", "#f59e0b");
        } else {
          for (var _0xd8ae7f = 0; _0xd8ae7f < _0x5f398d.length; _0xd8ae7f++) {
            _0x5f398d[_0xd8ae7f].classList.remove("fav-hidden");
          }
          _0x492459 = false;
          var _0xbf0fd8 = _0x2b0589.querySelector("svg");
          _0xbf0fd8.setAttribute("fill", "none");
          _0xbf0fd8.setAttribute("stroke", "currentColor");
        }
      };
      _0x221f99.appendChild(_0x2b0589);
      var _0x4fd24f = _0x42ed58.createElement("div");
      _0x4fd24f.style.cssText = "flex:1;";
      _0x221f99.appendChild(_0x4fd24f);
      if (_0x11d190) {
        _0x11d190.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
        _0x46a11c(_0x11d190, _0x520420("Replays"));
        _0x221f99.appendChild(_0x11d190);
      }
      if (_0x8c3f5a) {
        try {
          _0x8c3f5a.style.display = "none";
        } catch (_0x575ce4) {}
      }
      var _0x5b0ca2 = _0x42ed58.querySelector(".roomlist-view .buttons");
      if (_0x5b0ca2) {
        _0x5b0ca2.style.display = "none";
      }
      var _0x16aeb0 = _0x42ed58.createElement("button");
      _0x16aeb0.id = "back-btn";
      _0x46a11c(_0x16aeb0, _0x520420("Voltar"));
      _0x16aeb0.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>';
      _0x16aeb0.onclick = function () {
        window.top.location.reload();
      };
      _0x221f99.insertBefore(_0x16aeb0, _0x221f99.firstChild);
      _0x545d0f.style.position = "relative";
      _0x545d0f.appendChild(_0x221f99);
      if (_0x163364) {
        _0x163364.addEventListener("click", function () {
          _0x1f876d = null;
          _0x492459 = false;
          var _0x52e682 = _0x42ed58.getElementById("fav-filter-btn");
          if (_0x52e682) {
            var _0x432216 = _0x52e682.querySelector("svg");
            if (_0x432216) {
              _0x432216.setAttribute("fill", "none");
              _0x432216.setAttribute("stroke", "currentColor");
            }
          }
        });
      }
      var _0x2b6a94 = null;
      function _0x3c8f20() {
        var _0x23bb63 = _0x42ed58.createElement("div");
        _0x23bb63.id = "room-context-menu";
        _0x23bb63.style.cssText =
          "position:fixed;background:var(--theme-bg-secondary, #1a1a1a);border:1px solid var(--theme-border-light, #333);border-radius:8px;padding:6px;min-width:180px;z-index:10000;box-shadow:0 8px 32px rgba(0,0,0,0.5);display:none;";
        _0x42ed58.body.appendChild(_0x23bb63);
        return _0x23bb63;
      }
      function _0x2b35ce(_0x13d149, _0x257af3) {
        _0x13d149.preventDefault();
        if (!_0x2b6a94) {
          _0x2b6a94 = _0x3c8f20();
        }
        var _0x10f579 = _0x3057f6(_0x257af3);
        var _0x3447a2 = _0x3a13d6(_0x257af3);
        var _0x53ee96 =
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="' +
          (_0x10f579 ? "#f59e0b" : "none") +
          '" stroke="' +
          (_0x10f579 ? "#f59e0b" : "var(--theme-text-secondary, #888)") +
          '" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
        var _0x259dfd =
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="' +
          (_0x3447a2 ? "#3b82f6" : "none") +
          '" stroke="' +
          (_0x3447a2 ? "#3b82f6" : "var(--theme-text-secondary, #888)") +
          '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>';
        var _0x161731 =
          window.__t ||
          function (_0x57c3ae) {
            return _0x57c3ae;
          };
        _0x2b6a94.innerHTML =
          '<div class="ctx-item ctx-pin" style="padding:10px 14px;cursor:pointer;color:var(--theme-text-primary, #fff);font-size:13px;display:flex;align-items:center;gap:10px;border-radius:6px;transition:background 0.1s;">' +
          _0x259dfd +
          "<span>" +
          (_0x3447a2
            ? _0x161731("Desafixar Sala")
            : _0x161731("Fixar no Topo")) +
          '</span></div><div class="ctx-item ctx-fav" style="padding:10px 14px;cursor:pointer;color:var(--theme-text-primary, #fff);font-size:13px;display:flex;align-items:center;gap:10px;border-radius:6px;transition:background 0.1s;">' +
          _0x53ee96 +
          "<span>" +
          (_0x10f579
            ? _0x161731("Remover dos Favoritos")
            : _0x161731("Adicionar aos Favoritos")) +
          "</span></div>";
        var _0x4c4817 = _0x2b6a94.querySelectorAll(".ctx-item");
        for (var _0x40c2c6 = 0; _0x40c2c6 < _0x4c4817.length; _0x40c2c6++) {
          (function (_0x387ee0) {
            _0x387ee0.onmouseenter = function () {
              _0x387ee0.style.background = "var(--theme-bg-tertiary, #272727)";
            };
            _0x387ee0.onmouseleave = function () {
              _0x387ee0.style.background = "";
            };
          })(_0x4c4817[_0x40c2c6]);
        }
        var _0x2abea9 = _0x2b6a94.querySelector(".ctx-pin");
        _0x2abea9.onclick = function () {
          _0x539c45(_0x257af3);
          _0x2b6a94.style.display = "none";
          _0x57cac1(_0x5df090);
          _0xea094f(_0x5df090);
        };
        var _0x3de34a = _0x2b6a94.querySelector(".ctx-fav");
        _0x3de34a.onclick = function () {
          _0x1fc6aa(_0x257af3);
          _0x2b6a94.style.display = "none";
          _0x145226(_0x5df090);
          if (_0x492459 && !_0x3057f6(_0x257af3)) {
            var _0x50ba54 = _0x5df090.querySelectorAll("tr");
            for (var _0x4835c9 = 0; _0x4835c9 < _0x50ba54.length; _0x4835c9++) {
              var _0x5570d3 =
                _0x50ba54[_0x4835c9].querySelector('[data-hook="name"]');
              if (
                _0x5570d3 &&
                (_0x5570d3.textContent || "").trim() === _0x257af3
              ) {
                _0x50ba54[_0x4835c9].classList.add("fav-hidden");
              }
            }
          }
        };
        _0x2b6a94.style.left = _0x13d149.clientX + "px";
        _0x2b6a94.style.top = _0x13d149.clientY + "px";
        _0x2b6a94.style.display = "block";
      }
      _0x42ed58.addEventListener("click", function () {
        if (_0x2b6a94) {
          _0x2b6a94.style.display = "none";
        }
      });
      _0x42ed58.addEventListener("contextmenu", function (_0x218d34) {
        var _0x5c0c87 = _0x218d34.target;
        var _0x367648 = _0x5c0c87.closest ? _0x5c0c87.closest("tr") : null;
        if (!_0x367648) {
          var _0x3e3000 = _0x5c0c87;
          while (_0x3e3000 && _0x3e3000.tagName !== "TR") {
            _0x3e3000 = _0x3e3000.parentElement;
          }
          _0x367648 = _0x3e3000;
        }
        if (_0x367648 && _0x5df090.contains(_0x367648)) {
          var _0x20fa21 = _0x367648.querySelector('[data-hook="name"]');
          if (_0x20fa21) {
            var _0x4881ee = (_0x20fa21.textContent || "").trim();
            if (_0x4881ee) {
              _0x2b35ce(_0x218d34, _0x4881ee);
            }
          }
        }
      });
      function _0x145226(_0x54d008) {
        var _0x8c8b9f = _0x54d008.querySelectorAll("tr");
        var _0x3be4ad = _0x32597a();
        for (var _0x403b04 = 0; _0x403b04 < _0x8c8b9f.length; _0x403b04++) {
          var _0x1483a0 =
            _0x8c8b9f[_0x403b04].querySelector('[data-hook="name"]');
          if (!_0x1483a0) {
            continue;
          }
          var _0x1c4fd7 = (_0x1483a0.textContent || "").trim();
          if (_0x3be4ad.indexOf(_0x1c4fd7) !== -1) {
            _0x1483a0.classList.add("fav-room");
          } else {
            _0x1483a0.classList.remove("fav-room");
          }
        }
      }
      var _0x50ea4a = null;
      var _0x3d1984 = false;
      var _0x2fc118 = new MutationObserver(function (_0x535ee0) {
        if (_0x3d1984) {
          return;
        }
        if (_0x50ea4a) {
          clearTimeout(_0x50ea4a);
        }
        _0x50ea4a = setTimeout(function () {
          _0x145226(_0x5df090);
          _0x57cac1(_0x5df090);
          _0x3d1984 = true;
          _0xea094f(_0x5df090);
          _0x3d1984 = false;
        }, 100);
      });
      _0x2fc118.observe(_0x5df090, {
        childList: true,
      });
      _0x145226(_0x5df090);
      _0x57cac1(_0x5df090);
      _0xea094f(_0x5df090);
    }
    if (!_0x42ed58.getElementById("room-search-input")) {
      var _0x566f81 = _0x42ed58.createElement("div");
      _0x566f81.id = "room-search";
      _0x566f81.style.cssText =
        "padding:0px 16px 8px 16px;display:flex;gap:10px;align-items:center;";
      var _0x36d652 = "http://www.w3.org/2000/svg";
      var _0x30277d = _0x42ed58.createElementNS(_0x36d652, "svg");
      _0x30277d.setAttribute("width", "16");
      _0x30277d.setAttribute("height", "16");
      _0x30277d.setAttribute("viewBox", "0 0 24 24");
      _0x30277d.setAttribute("fill", "none");
      _0x30277d.setAttribute("stroke", "#666");
      _0x30277d.setAttribute("stroke-width", "2");
      var _0x134d9f = _0x42ed58.createElementNS(_0x36d652, "circle");
      _0x134d9f.setAttribute("cx", "11");
      _0x134d9f.setAttribute("cy", "11");
      _0x134d9f.setAttribute("r", "8");
      var _0x28dc7b = _0x42ed58.createElementNS(_0x36d652, "path");
      _0x28dc7b.setAttribute("d", "m21 21-4.35-4.35");
      _0x30277d.appendChild(_0x134d9f);
      _0x30277d.appendChild(_0x28dc7b);
      var _0x3e438f = _0x42ed58.createElement("input");
      _0x3e438f.type = "text";
      _0x3e438f.id = "room-search-input";
      var _0x520420 =
        window.__t ||
        function (_0x2f676a) {
          return _0x2f676a;
        };
      _0x3e438f.placeholder = _0x520420("Pesquisar salas...");
      _0x3e438f.autocomplete = "off";
      _0x3e438f.style.cssText =
        "flex:1;background:var(--theme-bg-secondary, #1a1a1a);border:1px solid var(--theme-border-light, #333);border-radius:4px;padding:8px 12px;color:var(--theme-text-primary, #fff);font-size:13px;outline:none;";
      _0x3e438f.oninput = function () {
        if (_0x1b5c7f) {
          clearTimeout(_0x1b5c7f);
        }
        _0x1b5c7f = setTimeout(function () {
          var _0x3eccde = _0x3e438f.value.toLowerCase();
          _0x157001(_0x42ed58, _0x3eccde);
          sessionStorage.setItem("roomlist_search_term", _0x3e438f.value);
        }, 50);
      };
      _0x3e438f.onfocus = function () {
        _0x3e438f.style.borderColor = "var(--theme-border-light, #444)";
      };
      _0x3e438f.onblur = function () {
        _0x3e438f.style.borderColor = "var(--theme-border-light, #333)";
      };
      var _0x2335c3 = sessionStorage.getItem("roomlist_search_term");
      if (_0x2335c3) {
        _0x3e438f.value = _0x2335c3;
        setTimeout(function () {
          _0x157001(_0x42ed58, _0x2335c3.toLowerCase());
        }, 100);
      }
      var _0x163364 = _0x42ed58.querySelector('[data-hook="refresh"]');
      if (_0x163364) {
        _0x163364.addEventListener("click", function () {
          _0x1f876d = null;
          setTimeout(function () {
            var _0x569ca3 = _0x3e438f.value.toLowerCase();
            if (_0x569ca3) {
              _0x157001(_0x42ed58, _0x569ca3);
            }
          }, 200);
        });
      }
      var _0x8b2130 = _0x42ed58.createElement("button");
      _0x8b2130.id = "country-filter-btn";
      _0x8b2130.style.cssText =
        "background:var(--theme-bg-secondary, #1a1a1a);border:1px solid var(--theme-border-light, #333);padding:0 10px;color:var(--theme-text-muted, #666);cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:4px;font-size:12px;font-weight:600;height:34px;";
      _0x8b2130.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
      _0x8b2130.onmouseenter = function () {
        _0x8b2130.style.background = "var(--theme-bg-hover, #333)";
        _0x8b2130.style.color = "var(--theme-text-primary, #fff)";
      };
      _0x8b2130.onmouseleave = function () {
        if (_0x1cab10 === "all") {
          _0x8b2130.style.background = "var(--theme-bg-secondary, #1a1a1a)";
          _0x8b2130.style.color = "var(--theme-text-muted, #666)";
        }
      };
      var _0x13b056 = _0x42ed58.createElement("div");
      _0x13b056.id = "country-dropdown";
      _0x13b056.style.cssText =
        "display:none;position:absolute;top:100%;right:0;background:var(--theme-bg-secondary, #1a1a1a);border:1px solid var(--theme-border-light, #333);border-radius:8px;max-height:240px;overflow-y:auto;z-index:1000;min-width:160px;margin-top:4px;box-shadow:0 8px 32px rgba(0,0,0,0.4);padding:4px 0;";
      var _0x385e70 = _0x42ed58.createElement("div");
      _0x385e70.style.cssText = "position:relative;";
      _0x385e70.appendChild(_0x8b2130);
      _0x385e70.appendChild(_0x13b056);
      function _0xa12766() {
        var _0x10832c = _0x42ed58.querySelector("[data-hook='list']");
        if (!_0x10832c) {
          return;
        }
        var _0x183350 = {};
        var _0x480f2e = _0x10832c.querySelectorAll("tr");
        for (var _0x4e5ad5 = 0; _0x4e5ad5 < _0x480f2e.length; _0x4e5ad5++) {
          var _0x4e48e7 =
            _0x480f2e[_0x4e5ad5].querySelector("[data-hook='flag']");
          if (_0x4e48e7) {
            var _0x5ee15c = _0x4e48e7.className
              .replace("flagico f-", "")
              .trim();
            if (_0x5ee15c) {
              _0x183350[_0x5ee15c] = true;
            }
          }
        }
        _0x13b056.innerHTML = "";
        var _0x5cafda = [];
        for (var _0x25d017 in _0x183350) {
          _0x5cafda.push(_0x25d017);
        }
        _0x5cafda.sort();
        var _0x45c1ef =
          window.__t ||
          function (_0x5a3c10) {
            return _0x5a3c10;
          };
        var _0xd56f75 = _0x42ed58.createElement("div");
        _0xd56f75.style.cssText =
          "padding:10px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;border-radius:4px;margin:0 4px;";
        _0xd56f75.onmouseenter = function () {
          _0xd56f75.style.background = "var(--theme-bg-hover, #333)";
        };
        _0xd56f75.onmouseleave = function () {
          _0xd56f75.style.background = "";
        };
        _0xd56f75.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--theme-text-muted, #666)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg><span style="color:var(--theme-text-primary, #fff);font-size:13px;">' +
          _0x45c1ef("Todos os países") +
          "</span>";
        _0xd56f75.onclick = function () {
          _0x1cab10 = "all";
          _0x13b056.style.display = "none";
          _0x8b2130.style.background = "var(--theme-bg-secondary, #1a1a1a)";
          _0x8b2130.style.color = "var(--theme-text-muted, #666)";
          _0x8b2130.innerHTML =
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
          _0x1b8dc2();
          _0x57cac1(_0x5df090);
          _0x157001(_0x42ed58, _0x3e438f.value.toLowerCase());
        };
        _0x13b056.appendChild(_0xd56f75);
        for (var _0x13e80c = 0; _0x13e80c < _0x5cafda.length; _0x13e80c++) {
          (function (_0x1e3eee) {
            var _0x70b144 = _0x42ed58.createElement("div");
            _0x70b144.style.cssText =
              "padding:10px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;border-radius:4px;margin:0 4px;";
            _0x70b144.onmouseenter = function () {
              _0x70b144.style.background = "var(--theme-bg-hover, #333)";
            };
            _0x70b144.onmouseleave = function () {
              _0x70b144.style.background = "";
            };
            _0x70b144.innerHTML =
              '<span class="flagico f-' +
              _0x1e3eee +
              '" style="width:20px;height:15px;display:inline-block;"></span><span style="color:var(--theme-text-primary, #fff);font-size:13px;">' +
              _0x1e3eee.toUpperCase() +
              "</span>";
            _0x70b144.onclick = function () {
              var _0x42cd25 = "3|0|4|7|6|5|1|2".split("|");
              var _0x4b29b7 = 0;
              while (true) {
                switch (_0x42cd25[_0x4b29b7++]) {
                  case "0":
                    _0x13b056.style.display = "none";
                    continue;
                  case "1":
                    _0x57cac1(_0x5df090);
                    continue;
                  case "2":
                    _0x157001(_0x42ed58, _0x3e438f.value.toLowerCase());
                    continue;
                  case "3":
                    _0x1cab10 = _0x1e3eee;
                    continue;
                  case "4":
                    _0x8b2130.style.background = "var(--theme-bg-hover, #333)";
                    continue;
                  case "5":
                    _0x1b8dc2();
                    continue;
                  case "6":
                    _0x8b2130.innerHTML =
                      '<span style="font-size:12px;font-weight:600;">' +
                      _0x1e3eee.toUpperCase() +
                      "</span>";
                    continue;
                  case "7":
                    _0x8b2130.style.color = "var(--theme-text-primary, #fff)";
                    continue;
                }
                break;
              }
            };
            _0x13b056.appendChild(_0x70b144);
          })(_0x5cafda[_0x13e80c]);
        }
      }
      _0x8b2130.onclick = function (_0x58315b) {
        _0x58315b.stopPropagation();
        _0xa12766();
        _0x13b056.style.display =
          _0x13b056.style.display === "none" ? "block" : "none";
      };
      _0x42ed58.addEventListener("click", function () {
        _0x13b056.style.display = "none";
      });
      _0x566f81.appendChild(_0x30277d);
      _0x566f81.appendChild(_0x3e438f);
      _0x566f81.appendChild(_0x385e70);
      var _0x545d0f = _0x49cdd5.querySelector(".dialog");
      if (_0x545d0f) {
        var _0x1d05e5 = _0x545d0f.querySelector("table.header");
        if (_0x1d05e5 && _0x1d05e5.parentNode) {
          _0x1d05e5.parentNode.insertBefore(_0x566f81, _0x1d05e5);
        } else {
          var _0x567aff = _0x545d0f.querySelector(".content");
          if (_0x567aff && _0x567aff.parentNode) {
            _0x567aff.parentNode.insertBefore(_0x566f81, _0x567aff);
          }
        }
      }
    }
    if (_0x301f1c && _0x5df090.dataset.observing) {
      return;
    }
    _0x5df090.dataset.observing = "true";
    function _0x3bdb73() {
      try {
        var _0x30b491 = _0x5df090.querySelectorAll("tr");
        for (var _0x30a992 = 0; _0x30a992 < _0x30b491.length; _0x30a992++) {
          var _0x386587 = _0x30b491[_0x30a992];
          var _0x26dd37 = _0x386587.querySelector('[data-hook="pass"]');
          if (_0x26dd37) {
            _0x386587.style.opacity =
              (_0x26dd37.textContent || "").indexOf("Yes") !== -1 ? "0.5" : "1";
          }
        }
      } catch (_0x46401c) {}
    }
    _0x153fe9();
    _0x301f1c = new MutationObserver(_0x3bdb73);
    _0x301f1c.observe(_0x5df090, {
      childList: true,
    });
    _0x3bdb73();
  }
  function _0x1b3b9d() {
    if (!Injector.isGameFrame()) {
      return;
    }
    var _0x55cdc8 = null;
    function _0x55b22d() {
      var _0x536dd9 = document.getElementById("sidebar-tooltip");
      if (_0x536dd9) {
        _0x536dd9.style.opacity = "0";
      }
      var _0x31c3a5 = document.getElementById("room-context-menu");
      if (_0x31c3a5) {
        _0x31c3a5.remove();
      }
    }
    function _0x398ed2() {
      var _0xd33320 = document.querySelector(".roomlist-view");
      var _0x14cc31 = document.getElementById("sidebar-panel");
      if (_0xd33320 && !_0x14cc31) {
        _0x4460da(document);
      } else if (!_0xd33320) {
        _0x55b22d();
      }
    }
    function _0x59a34c() {
      if (_0x55cdc8) {
        return;
      }
      Injector.log("Roomlist: startChecking");
      _0x55cdc8 = setInterval(_0x398ed2, 300);
      _0x398ed2();
    }
    function _0x35fbc0() {
      if (_0x55cdc8) {
        Injector.log("Roomlist: stopChecking");
        clearInterval(_0x55cdc8);
        _0x55cdc8 = null;
      }
      _0x55b22d();
    }
    Injector.onView("roomlist-view", function () {
      Injector.log("Roomlist: onView roomlist-view");
      _0x59a34c();
    });
    Injector.onView("room-view", function () {
      Injector.log("Roomlist: onView room-view");
      _0x59a34c();
    });
    Injector.onView("game-view", function () {
      Injector.log("Roomlist: onView game-view");
      _0x35fbc0();
    });
    if (!document.querySelector(".game-view")) {
      _0x59a34c();
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _0x1b3b9d);
  } else {
    _0x1b3b9d();
  }
  Injector.log("Roomlist module loaded");
})();
