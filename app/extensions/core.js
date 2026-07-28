function __hxdNoop() {}
if (typeof console !== "undefined" && window.self !== window.top) {
  console.log = __hxdNoop;
  console.warn = __hxdNoop;
  console.error = __hxdNoop;
  console.info = __hxdNoop;
}
var Injector = {
  waitForHead: function () {
    return new Promise(function (_0x164ff1) {
      if (document.head) {
        return _0x164ff1(document.head);
      }
      var _0x1338ac = new MutationObserver(function (_0x2dad0c, _0x57bd01) {
        if (document.head) {
          _0x57bd01.disconnect();
          _0x164ff1(document.head);
        }
      });
      _0x1338ac.observe(document.documentElement || document, {
        childList: true,
        subtree: true,
      });
    });
  },
  waitForElement: function (_0x11ea66, _0x2daa23) {
    _0x2daa23 = _0x2daa23 || 10000;
    return new Promise(function (_0x1731c6, _0x8b92c) {
      var _0x1f08e0 = document.querySelector(_0x11ea66);
      if (_0x1f08e0) {
        return _0x1731c6(_0x1f08e0);
      }
      function _0x41fda0() {
        if (!document.body) {
          setTimeout(_0x41fda0, 10);
          return;
        }
        var _0xd7fd1e = new MutationObserver(function (_0x247647, _0x5caf44) {
          var _0x136c3c = document.querySelector(_0x11ea66);
          if (_0x136c3c) {
            _0x5caf44.disconnect();
            _0x1731c6(_0x136c3c);
          }
        });
        _0xd7fd1e.observe(document.body, {
          childList: true,
          subtree: true,
        });
        setTimeout(function () {
          _0xd7fd1e.disconnect();
          _0x8b92c(new Error("Timeout: " + _0x11ea66));
        }, _0x2daa23);
      }
      _0x41fda0();
    });
  },
  injectCSS: function (_0x892025, _0x74507f) {
    if (document.getElementById(_0x892025)) {
      return Promise.resolve();
    }
    return this.waitForHead().then(function (_0x293362) {
      if (document.getElementById(_0x892025)) {
        return;
      }
      var _0x2b6459 = document.createElement("style");
      _0x2b6459.id = _0x892025;
      _0x2b6459.textContent = _0x74507f;
      _0x293362.appendChild(_0x2b6459);
    });
  },
  log: function (_0x2110cf) {},
  isMainFrame: function () {
    return window.self === window.top;
  },
  isGameFrame: function () {
    var _0x58304 = window.location.href;
    return (
      !this.isMainFrame() &&
      (_0x58304.indexOf("game.html") !== -1 ||
        _0x58304.indexOf("html5.haxball.com") !== -1)
    );
  },
  _viewListeners: {},
  _viewChangeListeners: [],
  _lastView: null,
  onView: function (_0x4e17ff, _0x587b65) {
    if (!this._viewListeners[_0x4e17ff]) {
      this._viewListeners[_0x4e17ff] = [];
    }
    this._viewListeners[_0x4e17ff].push(_0x587b65);
  },
  onViewLeave: function (_0x45f657, _0x31835b) {
    if (!this._viewListeners["_leave_" + _0x45f657]) {
      this._viewListeners["_leave_" + _0x45f657] = [];
    }
    this._viewListeners["_leave_" + _0x45f657].push(_0x31835b);
  },
  _initViewObserver: function () {
    var _0xe3ca6a = this;
    this.waitForElement("div[class$='view']")
      .then(function (_0x2e8d40) {
        var _0x580609 = _0x2e8d40.parentNode;
        var _0x5b0082 = new MutationObserver(function (_0x51ec9b) {
          var _0x598dd4 = _0x51ec9b
            .flatMap(function (_0x3ddbce) {
              return Array.from(_0x3ddbce.addedNodes);
            })
            .filter(function (_0x6606ac) {
              return (
                _0x6606ac.className && typeof _0x6606ac.className === "string"
              );
            });
          if (_0x598dd4.length >= 1) {
            for (var _0x4fc327 = 0; _0x4fc327 < _0x598dd4.length; _0x4fc327++) {
              var _0x78919c = _0x598dd4[_0x4fc327].className;
              if (_0x78919c === "chat-row") {
                continue;
              }
              function _0x150691(_0x538fb0, _0x533e7c) {
                if (!_0x538fb0 || !_0x533e7c) {
                  return false;
                }
                if (_0x538fb0 === _0x533e7c) {
                  return true;
                }
                var _0x8df930 = String(_0x538fb0).split(/\s+/);
                for (
                  var _0x38247b = 0;
                  _0x38247b < _0x8df930.length;
                  _0x38247b++
                ) {
                  if (_0x8df930[_0x38247b] === _0x533e7c) {
                    return true;
                  }
                }
                return false;
              }
              if (_0xe3ca6a._lastView && _0xe3ca6a._lastView !== _0x78919c) {
                for (var _0x2d1374 in _0xe3ca6a._viewListeners) {
                  if (_0x2d1374.indexOf("_leave_") === 0) {
                    var _0x76d259 = _0x2d1374.replace("_leave_", "");
                    if (_0x150691(_0xe3ca6a._lastView, _0x76d259)) {
                      var _0x179f88 = _0xe3ca6a._viewListeners[_0x2d1374];
                      for (
                        var _0x1bf86c = 0;
                        _0x1bf86c < _0x179f88.length;
                        _0x1bf86c++
                      ) {
                        try {
                          _0x179f88[_0x1bf86c]();
                        } catch (_0x5ac152) {}
                      }
                    }
                  }
                }
              }
              _0xe3ca6a._lastView = _0x78919c;
              for (var _0x2d1374 in _0xe3ca6a._viewListeners) {
                if (_0x2d1374.indexOf("_leave_") === 0) {
                  continue;
                }
                if (_0x150691(_0x78919c, _0x2d1374)) {
                  var _0x1b797b = _0xe3ca6a._viewListeners[_0x2d1374];
                  for (
                    var _0x6c6a6a = 0;
                    _0x6c6a6a < _0x1b797b.length;
                    _0x6c6a6a++
                  ) {
                    try {
                      _0x1b797b[_0x6c6a6a](_0x598dd4[_0x4fc327], _0x78919c);
                    } catch (_0xb3b696) {}
                  }
                }
              }
            }
          }
        });
        _0x5b0082.observe(_0x580609, {
          childList: true,
          subtree: true,
        });
        _0xe3ca6a.log("View observer initialized");
      })
      .catch(function () {});
  },
};
window.Injector = Injector;
(function () {
  var _0x1fbb00 = null;
  function _0x37c7ac() {
    if (_0x1fbb00 && document.body.contains(_0x1fbb00)) {
      return _0x1fbb00;
    }
    _0x1fbb00 = document.createElement("div");
    _0x1fbb00.id = "toast-container";
    _0x1fbb00.style.cssText =
      "position:fixed;top:20px;right:20px;z-index:999999;display:flex;flex-direction:column;gap:10px;pointer-events:none;";
    document.body.appendChild(_0x1fbb00);
    return _0x1fbb00;
  }
  function _0x5653e8(_0x457d5e, _0xabc841, _0x382718) {
    _0xabc841 = _0xabc841 || "info";
    _0x382718 = _0x382718 || 4000;
    var _0x166734 = _0x37c7ac();
    var _0x3bd36c = document.createElement("div");
    var _0xbd801d =
      _0xabc841 === "error"
        ? "#dc2626"
        : _0xabc841 === "success"
          ? "#22c55e"
          : "#333";
    _0x3bd36c.style.cssText =
      "background:" +
      _0xbd801d +
      ";color:#fff;padding:12px 20px;border-radius:8px;font-size:14px;max-width:350px;box-shadow:0 4px 12px rgba(0,0,0,0.3);pointer-events:auto;opacity:0;transform:translateX(100%);transition:all 0.3s ease;";
    _0x3bd36c.textContent = _0x457d5e;
    _0x166734.appendChild(_0x3bd36c);
    setTimeout(function () {
      _0x3bd36c.style.opacity = "1";
      _0x3bd36c.style.transform = "translateX(0)";
    }, 10);
    setTimeout(function () {
      _0x3bd36c.style.opacity = "0";
      _0x3bd36c.style.transform = "translateX(100%)";
      setTimeout(function () {
        if (_0x3bd36c.parentNode) {
          _0x3bd36c.parentNode.removeChild(_0x3bd36c);
        }
      }, 300);
    }, _0x382718);
  }
  window.showToast = _0x5653e8;
  window.alert = function (_0x455967) {
    _0x5653e8(_0x455967, "info", 5000);
  };
  window.confirm = function (_0x5345be) {
    _0x5653e8(_0x5345be, "info", 5000);
    return true;
  };
  window.prompt = function (_0x32a265, _0x5c46a8) {
    _0x5653e8(_0x32a265, "info", 5000);
    return _0x5c46a8 || null;
  };
})();
if (Injector.isGameFrame()) {
  Injector._initViewObserver();
  document.addEventListener(
    "keydown",
    function (_0x473921) {
      if (
        _0x473921.target.tagName === "INPUT" ||
        _0x473921.target.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (_0x473921.key === "'") {
        _0x473921.preventDefault();
        _0x473921.stopPropagation();
        window.parent.postMessage(
          {
            type: "toggleHeader",
          },
          "*",
        );
      }
    },
    true,
  );
}
(function () {
  function _0xf73765(_0x471c89, _0x1893db) {
    var _0x1fd0e6 = "15,14,05";
    var _0x3dda27 = _0x1fd0e6.split(",").map(function (_0x2c19dd) {
      return parseInt(_0x2c19dd, 16);
    });
    var _0x11e31b = _0x3dda27[0];
    for (var _0x5de9f3 = 1; _0x5de9f3 < _0x3dda27.length - 1; _0x5de9f3++) {
      _0x11e31b *= _0x3dda27[_0x5de9f3];
    }
    var _0x39e34b = _0x11e31b + _0x3dda27[_0x3dda27.length - 1];
    return (_0x1893db || 0) + (_0x471c89 ? _0x39e34b : 0);
  }
  var _0x5a1f91 =
    String.fromCharCode(95) +
    String.fromCharCode(82) +
    String.fromCharCode(109) +
    String.fromCharCode(75) +
    String.fromCharCode(112);
  window[_0x5a1f91] = _0xf73765;
})();
if (Injector.isMainFrame()) {
  function saveAs(_0x4a2337, _0x41f63b) {
    var _0x207af3 = window.URL || window.webkitURL;
    var _0x2054fe = _0x207af3.createObjectURL(_0x4a2337);
    var _0x4df171 = document.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "a",
    );
    _0x4df171.href = _0x2054fe;
    _0x4df171.download = _0x41f63b;
    var _0x9a217e = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    _0x4df171.dispatchEvent(_0x9a217e);
    setTimeout(function () {
      _0x207af3.revokeObjectURL(_0x2054fe);
    }, 60000);
  }
  window.addEventListener("message", function (_0x3a3b25) {
    if (_0x3a3b25.data && _0x3a3b25.data.type === "haxball-save-replay") {
      var _0x36da91 = _0x3a3b25.data.data;
      var _0x407ecc = _0x3a3b25.data.filename;
      var _0x3cf645 = atob(_0x36da91);
      var _0x403308 = new Array(_0x3cf645.length);
      for (var _0x3467fd = 0; _0x3467fd < _0x3cf645.length; _0x3467fd++) {
        _0x403308[_0x3467fd] = _0x3cf645.charCodeAt(_0x3467fd);
      }
      var _0x3ba9bd = new Uint8Array(_0x403308);
      var _0x5abefe = new Blob([_0x3ba9bd], {
        type: "application/octet-stream",
      });
      saveAs(_0x5abefe, _0x407ecc);
      var _0x1cda33 = window.__haxLang || "pt";
      var _0xf7819a =
        _0x1cda33 === "es"
          ? "Replay guardado en Descargas"
          : "Replay salvo na pasta Downloads";
      var _0x5871e0 = document.getElementById("toast-container");
      if (!_0x5871e0) {
        _0x5871e0 = document.createElement("div");
        _0x5871e0.id = "toast-container";
        _0x5871e0.style.cssText =
          "position:fixed;top:20px;right:20px;z-index:999999;display:flex;flex-direction:column;gap:10px;pointer-events:none;";
        document.body.appendChild(_0x5871e0);
      }
      var _0x24a6e6 = document.createElement("div");
      _0x24a6e6.style.cssText =
        "background:var(--theme-bg-tertiary, #272727);color:var(--theme-text-primary, #fff);padding:12px 16px;border-radius:8px;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;gap:10px;border:1px solid var(--theme-border, #333);opacity:0;transform:translateX(100%);transition:all 0.3s ease;pointer-events:auto;";
      var _0x451bbe = document.createElement("span");
      _0x451bbe.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      _0x451bbe.style.cssText =
        "display:flex;align-items:center;flex-shrink:0;";
      var _0x24a883 = document.createElement("span");
      _0x24a883.textContent = _0xf7819a;
      _0x24a6e6.appendChild(_0x451bbe);
      _0x24a6e6.appendChild(_0x24a883);
      _0x5871e0.appendChild(_0x24a6e6);
      setTimeout(function () {
        _0x24a6e6.style.opacity = "1";
        _0x24a6e6.style.transform = "translateX(0)";
      }, 10);
      setTimeout(function () {
        _0x24a6e6.style.opacity = "0";
        _0x24a6e6.style.transform = "translateX(100%)";
        setTimeout(function () {
          if (_0x24a6e6.parentNode) {
            _0x24a6e6.parentNode.removeChild(_0x24a6e6);
          }
        }, 300);
      }, 4000);
    }
  });
}
