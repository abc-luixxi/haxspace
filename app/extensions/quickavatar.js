(function () {
  if (Injector.isMainFrame()) {
    return;
  }
  var _0x263899 = "quick_avatars";
  var _0x2dc270 = [];
  var _0x38c00c = false;
  var _0x177ace = null;
  function _0x14208e(_0x5aed56) {
    if (window.__t) {
      return window.__t(_0x5aed56);
    } else {
      return _0x5aed56;
    }
  }
  function _0x567a38() {
    try {
      _0x2dc270 = JSON.parse(localStorage.getItem(_0x263899) || "[]");
    } catch (_0x648a21) {
      _0x2dc270 = [];
    }
    return _0x2dc270;
  }
  function _0x40e296() {
    localStorage.setItem(_0x263899, JSON.stringify(_0x2dc270));
  }
  function _0x5426e5(_0x4b8744) {
    if (!_0x4b8744) {
      return;
    }
    var _0x3cb2c2 = document.querySelector('input[data-hook="input"]');
    if (_0x3cb2c2) {
      var _0x5e7a01 = _0x3cb2c2.value;
      _0x3cb2c2.value = "/avatar " + _0x4b8744;
      _0x3cb2c2.dispatchEvent(
        new Event("input", {
          bubbles: true,
        }),
      );
      var _0x260a8d = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true,
      });
      _0x3cb2c2.dispatchEvent(_0x260a8d);
      setTimeout(function () {
        _0x3cb2c2.value = _0x5e7a01;
      }, 50);
    }
  }
  function _0x1c0fdd() {
    document.addEventListener("keydown", function (_0x2303cc) {
      if (
        _0x2303cc.target.tagName === "INPUT" ||
        _0x2303cc.target.tagName === "TEXTAREA"
      ) {
        return;
      }
      var _0x5a02c9 = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Space",
        "Enter",
        "Escape",
      ];
      if (_0x5a02c9.indexOf(_0x2303cc.code) !== -1) {
        return;
      }
      for (var _0x14fedc = 0; _0x14fedc < _0x2dc270.length; _0x14fedc++) {
        if (_0x2dc270[_0x14fedc].key === _0x2303cc.code) {
          _0x2303cc.preventDefault();
          _0x5426e5(_0x2dc270[_0x14fedc].avatar);
          break;
        }
      }
    });
  }
  function _0x3258f0(_0x188a3e) {
    var _0x1b6f70 = _0x188a3e.querySelector(".settings-view");
    if (!_0x1b6f70) {
      return;
    }
    if (_0x1b6f70.dataset.quickAvatarSetup) {
      return;
    }
    _0x1b6f70.dataset.quickAvatarSetup = "true";
    var _0x1345f7 = _0x1b6f70.querySelector(".tabs");
    var _0x1bfef8 = _0x1b6f70.querySelector(".tabcontents");
    if (!_0x1345f7 || !_0x1bfef8) {
      return;
    }
    var _0x3fccb0 = _0x188a3e.createElement("button");
    _0x3fccb0.setAttribute("data-hook", "avatarbtn");
    _0x3fccb0.textContent = "Avatars";
    _0x1345f7.appendChild(_0x3fccb0);
    var _0x146873 = _0x188a3e.createElement("div");
    _0x146873.className = "section";
    _0x146873.setAttribute("data-hook", "avatarsec");
    _0x1bfef8.appendChild(_0x146873);
    function _0x2090e2() {
      _0x567a38();
      var _0x2cf958 =
        '<div style="padding:16px 20px;"><div style="margin-bottom:20px;color:var(--theme-text-secondary, #888);font-size:13px;line-height:1.5;">' +
        _0x14208e(
          "Defina teclas de atalho para trocar de avatar rapidamente durante o jogo.",
        ) +
        "";
      if (_0x2dc270.length > 0) {
        _0x2cf958 += "";
        for (var _0x5f6140 = 0; _0x5f6140 < _0x2dc270.length; _0x5f6140++) {
          var _0x16f27b = _0x2dc270[_0x5f6140];
          var _0x15bf13 = _0x16f27b.key
            .replace("Key", "")
            .replace("Digit", "")
            .replace("Numpad", "Num");
          _0x2cf958 +=
            '<div class="inputrow quick-avatar-row" data-index="' +
            _0x5f6140 +
            '" style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--theme-bg-secondary, #1a1a1a);border:1px solid var(--theme-border, #232323);border-radius:6px;margin-bottom:8px;"><div style="min-width:50px;padding:6px 12px;background:var(--theme-bg-tertiary, #272727);border-radius:4px;text-align:center;color:var(--theme-text-primary, #fff);font-weight:600;font-size:13px;">' +
            _0x15bf13 +
            "" +
            (_0x16f27b.avatar ||
              '<span style="color:var(--theme-text-muted, #666);">(' +
                _0x14208e("vazio") +
                ")</span>") +
            '</div><button class="edit-avatar-btn" data-index="' +
            _0x5f6140 +
            '" style="padding:6px 12px;background:var(--theme-bg-tertiary, #272727);border:none;border-radius:4px;color:var(--theme-text-primary, #fff);cursor:pointer;font-size:12px;transition:background 0.15s;">' +
            _0x14208e("Editar") +
            '</button><button class="remove-avatar-btn" data-index="</div><div style="margin-bottom:20px;"><label style="display:block;color:var(--theme-text-secondary, #888);font-size:12px;margin-bottom:6px;font-weight:500;">' +
            _0x5f6140 +
            '" style="padding:6px 10px;background:var(--theme-bg-tertiary, #272727);border:none;border-radius:4px;color:#ff4444;cursor:pointer;transition:background 0.15s;"><i class="icon-cancel"></i></button></div><div style="flex:1;color:var(--theme-text-primary, #fff);font-size:14px;">';
        }
        _0x2cf958 += "";
      }
      _0x2cf958 +=
        '<button id="add-avatar-binding" style="padding:10px 16px;background:var(--theme-bg-tertiary, #272727);border:none;border-radius:6px;color:var(--theme-text-primary, #fff);cursor:pointer;display:flex;align-items:center;gap:8px;font-size:13px;transition:background 0.15s;width:100%;"><i class="icon-plus"></i> ' +
        _0x14208e("Adicionar atalho") +
        "</button></div>";
      _0x146873.innerHTML = _0x2cf958;
      _0x146873
        .querySelectorAll(".remove-avatar-btn")
        .forEach(function (_0x56c89c) {
          _0x56c89c.onmouseenter = function () {
            _0x56c89c.style.background = "var(--theme-bg-hover, #333)";
          };
          _0x56c89c.onmouseleave = function () {
            _0x56c89c.style.background = "var(--theme-bg-tertiary, #272727)";
          };
          _0x56c89c.onclick = function () {
            var _0x22d30a = parseInt(_0x56c89c.dataset.index);
            _0x2dc270.splice(_0x22d30a, 1);
            _0x40e296();
            _0x2090e2();
          };
        });
      _0x146873
        .querySelectorAll(".edit-avatar-btn")
        .forEach(function (_0x371a59) {
          _0x371a59.onmouseenter = function () {
            _0x371a59.style.background = "var(--theme-bg-hover, #333)";
          };
          _0x371a59.onmouseleave = function () {
            _0x371a59.style.background = "var(--theme-bg-tertiary, #272727)";
          };
          _0x371a59.onclick = function () {
            var _0x45c2fb = parseInt(_0x371a59.dataset.index);
            _0x165649(_0x188a3e, _0x45c2fb);
          };
        });
      var _0x149046 = _0x146873.querySelector("#add-avatar-binding");
      if (_0x149046) {
        _0x149046.onmouseenter = function () {
          _0x149046.style.background = "var(--theme-bg-hover, #333)";
        };
        _0x149046.onmouseleave = function () {
          _0x149046.style.background = "var(--theme-bg-tertiary, #272727)";
        };
        _0x149046.onclick = function () {
          _0x165649(_0x188a3e, -1);
        };
      }
    }
    function _0x165649(_0x2ed543, _0x4234fd) {
      var _0x4fa511 = _0x4234fd === -1;
      var _0x4da549 = _0x4fa511
        ? {
            key: "",
            avatar: "",
          }
        : _0x2dc270[_0x4234fd];
      var _0x37db55 = _0x2ed543.getElementById("avatar-edit-dialog");
      if (_0x37db55) {
        _0x37db55.remove();
      }
      var _0x5c7e16 = _0x2ed543.createElement("div");
      _0x5c7e16.id = "avatar-edit-dialog";
      _0x5c7e16.style.cssText =
        "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.75);z-index:10001;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(2px);";
      var _0xa7c2cb = _0x2ed543.createElement("div");
      _0xa7c2cb.style.cssText =
        "background:var(--theme-bg-primary, #141414);border:1px solid var(--theme-border, #232323);border-radius:8px;padding:24px;min-width:340px;box-shadow:0 8px 32px rgba(0,0,0,0.5);";
      _0xa7c2cb.innerHTML =
        '<h2 style="color:var(--theme-text-primary, #fff);font-size:18px;font-weight:600;margin:0 0 20px 0;text-align:center;">' +
        (_0x4fa511 ? _0x14208e("Novo Atalho") : _0x14208e("Editar Atalho")) +
        '</h2><div style="margin-bottom:16px;"><label style="display:block;color:var(--theme-text-secondary, #888);font-size:12px;margin-bottom:6px;font-weight:500;">' +
        _0x14208e("Tecla de Atalho") +
        '</label><button id="key-capture-btn" style="width:100%;padding:12px;background:var(--theme-bg-secondary, #1a1a1a);border:1px solid var(--theme-border-light, #333);border-radius:6px;color:var(--theme-text-primary, #fff);cursor:pointer;text-align:center;font-size:14px;transition:all 0.15s;"><input id="avatar-input" type="text" value="' +
        (_0x4da549.key
          ? _0x4da549.key
              .replace("Key", "")
              .replace("Digit", "")
              .replace("Numpad", "Num")
          : _0x14208e("Clique para definir tecla")) +
        '</button><button class="remove-avatar-btn" data-index="</div><div style="margin-bottom:20px;"><label style="display:block;color:var(--theme-text-secondary, #888);font-size:12px;margin-bottom:6px;font-weight:500;">' +
        _0x14208e("Avatar (emoji ou texto)") +
        '</label><button id="key-capture-btn" style="width:100%;padding:12px;background:var(--theme-bg-secondary, #1a1a1a);border:1px solid var(--theme-border-light, #333);border-radius:6px;color:var(--theme-text-primary, #fff);cursor:pointer;text-align:center;font-size:14px;transition:all 0.15s;"><input id="avatar-input" type="text" value="' +
        (_0x4da549.avatar || "") +
        '" maxlength="2" style="width:100%;padding:12px;background:var(--theme-bg-secondary, #1a1a1a);border:1px solid var(--theme-border-light, #333);border-radius:6px;color:var(--theme-text-primary, #fff);font-size:18px;text-align:center;box-sizing:border-box;outline:none;transition:border-color 0.15s;" placeholder="🎮"><div style="display:flex;gap:10px;"><button id="cancel-avatar-btn" style="flex:1;padding:12px;background:var(--theme-bg-tertiary, #272727);border:none;border-radius:6px;color:var(--theme-text-primary, #fff);cursor:pointer;font-size:14px;transition:background 0.15s;">' +
        _0x14208e("Cancelar") +
        '</button><button id="save-avatar-btn" style="flex:1;padding:12px;background:var(--theme-bg-tertiary, #272727);border:none;border-radius:6px;color:var(--theme-text-primary, #fff);cursor:pointer;font-size:14px;font-weight:600;transition:background 0.15s;">' +
        _0x14208e("Salvar") +
        '</button><button class="remove-avatar-btn" data-index="</div><div style="margin-bottom:20px;"><label style="display:block;color:var(--theme-text-secondary, #888);font-size:12px;margin-bottom:6px;font-weight:500;">';
      _0x5c7e16.appendChild(_0xa7c2cb);
      _0x2ed543.body.appendChild(_0x5c7e16);
      var _0x19546c = _0x4da549.key;
      var _0x2715c9 = _0xa7c2cb.querySelector("#key-capture-btn");
      var _0x4b1006 = _0xa7c2cb.querySelector("#avatar-input");
      var _0x1cecd9 = _0xa7c2cb.querySelector("#cancel-avatar-btn");
      var _0x3f635d = _0xa7c2cb.querySelector("#save-avatar-btn");
      _0x2715c9.onmouseenter = function () {
        if (_0x2715c9.style.borderColor !== "rgb(245, 158, 11)") {
          _0x2715c9.style.background = "var(--theme-bg-hover, #222)";
        }
      };
      _0x2715c9.onmouseleave = function () {
        if (_0x2715c9.style.borderColor !== "rgb(245, 158, 11)") {
          _0x2715c9.style.background = "var(--theme-bg-secondary, #1a1a1a)";
        }
      };
      _0x4b1006.onfocus = function () {
        _0x4b1006.style.borderColor = "var(--theme-border-light, #444)";
      };
      _0x4b1006.onblur = function () {
        _0x4b1006.style.borderColor = "var(--theme-border-light, #333)";
      };
      _0x1cecd9.onmouseenter = function () {
        _0x1cecd9.style.background = "var(--theme-bg-hover, #333)";
      };
      _0x1cecd9.onmouseleave = function () {
        _0x1cecd9.style.background = "var(--theme-bg-tertiary, #272727)";
      };
      _0x3f635d.onmouseenter = function () {
        _0x3f635d.style.background = "var(--theme-bg-hover, #333)";
      };
      _0x3f635d.onmouseleave = function () {
        _0x3f635d.style.background = "var(--theme-bg-tertiary, #272727)";
      };
      _0x2715c9.onclick = function () {
        _0x2715c9.textContent = _0x14208e("Pressione uma tecla...");
        _0x2715c9.style.borderColor = "#f59e0b";
        _0x2715c9.style.background = "#1a1a1a";
        function _0x3897de(_0x1cd333) {
          _0x1cd333.preventDefault();
          _0x1cd333.stopPropagation();
          var _0x4a8e19 = [
            "Escape",
            "Enter",
            "Tab",
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "Space",
          ];
          if (_0x4a8e19.indexOf(_0x1cd333.code) !== -1) {
            _0x2715c9.textContent = _0x14208e("Tecla inválida, tente outra");
            _0x2715c9.style.borderColor = "#ff4444";
            setTimeout(function () {
              _0x2715c9.textContent = _0x4da549.key
                ? _0x4da549.key
                    .replace("Key", "")
                    .replace("Digit", "")
                    .replace("Numpad", "Num")
                : _0x14208e("Clique para definir tecla");
              _0x2715c9.style.borderColor = "#333";
            }, 1500);
            return;
          }
          _0x19546c = _0x1cd333.code;
          _0x2715c9.textContent = _0x1cd333.code
            .replace("Key", "")
            .replace("Digit", "")
            .replace("Numpad", "Num");
          _0x2715c9.style.borderColor = "#333";
          _0x2ed543.removeEventListener("keydown", _0x3897de, true);
        }
        _0x2ed543.addEventListener("keydown", _0x3897de, true);
      };
      _0x1cecd9.onclick = function () {
        _0x5c7e16.remove();
      };
      _0x3f635d.onclick = function () {
        var _0x44b75c = _0x4b1006.value.trim();
        if (!_0x19546c) {
          _0x2715c9.style.borderColor = "#ff4444";
          _0x2715c9.style.background = "#1a1a1a";
          setTimeout(function () {
            _0x2715c9.style.borderColor = "#333";
          }, 1500);
          return;
        }
        if (_0x4fa511) {
          _0x2dc270.push({
            key: _0x19546c,
            avatar: _0x44b75c,
          });
        } else {
          _0x2dc270[_0x4234fd] = {
            key: _0x19546c,
            avatar: _0x44b75c,
          };
        }
        _0x40e296();
        _0x5c7e16.remove();
        _0x2090e2();
      };
      _0x5c7e16.onclick = function (_0x2b30a5) {
        if (_0x2b30a5.target === _0x5c7e16) {
          _0x5c7e16.remove();
        }
      };
    }
    _0x3fccb0.onclick = function () {
      _0x1345f7.querySelectorAll("button").forEach(function (_0x5a5b00) {
        _0x5a5b00.classList.remove("selected");
      });
      _0x3fccb0.classList.add("selected");
      _0x1bfef8.querySelectorAll(".section").forEach(function (_0x27cd9c) {
        _0x27cd9c.classList.remove("selected");
      });
      _0x146873.classList.add("selected");
      _0x2090e2();
    };
    var _0x2019ec = _0x1345f7.querySelectorAll(
      'button:not([data-hook="avatarbtn"])',
    );
    _0x2019ec.forEach(function (_0x2a8d26) {
      (function (_0x4891eb) {
        _0x4891eb.addEventListener(
          "click",
          function () {
            _0x3fccb0.classList.remove("selected");
            _0x146873.classList.remove("selected");
            var _0x70b047 = _0x4891eb.getAttribute("data-hook");
            if (_0x70b047) {
              var _0x2f3217 = _0x1bfef8.querySelector(
                '.section[data-hook="' + _0x70b047.replace("btn", "sec") + '"]',
              );
              if (_0x2f3217) {
                _0x1bfef8
                  .querySelectorAll(
                    '.section[data-hook="tokensec"], .section[data-hook="avatarsec"]',
                  )
                  .forEach(function (_0x2bd60c) {
                    _0x2bd60c.classList.remove("selected");
                  });
                setTimeout(function () {
                  if (!_0x2f3217.classList.contains("selected")) {
                    _0x1bfef8
                      .querySelectorAll(".section")
                      .forEach(function (_0x5a2d8b) {
                        _0x5a2d8b.classList.remove("selected");
                      });
                    _0x2f3217.classList.add("selected");
                  }
                }, 50);
              }
            }
          },
          true,
        );
      })(_0x2a8d26);
    });
    if (_0x3fccb0.classList.contains("selected")) {
      _0x2090e2();
    }
  }
  function _0x19089a() {
    _0x567a38();
    _0x1c0fdd();
    setInterval(function () {
      var _0x14a63c = document.querySelector(".settings-view");
      if (_0x14a63c && !_0x14a63c.dataset.quickAvatarSetup) {
        _0x3258f0(document);
      }
    }, 500);
    var _0x582411 = document.querySelector(".settings-view");
    if (_0x582411) {
      _0x3258f0(document);
    }
    Injector.log("Quick Avatar module loaded");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _0x19089a);
  } else {
    _0x19089a();
  }
})();
