(function () {
  if (Injector.isMainFrame()) {
    return;
  }
  var _0x346d07 = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+\.[^\s<>"']+)/g;
  var _0x33307d =
    /^https?:\/\/(?:www\.)?haxball\.com\/play\?c=([a-zA-Z0-9_-]{8,15})$/;
  var _0xffc0dd = new WeakSet();
  function _0x12bc8f(_0x2a7db1) {
    if (_0xffc0dd.has(_0x2a7db1)) {
      return;
    }
    _0xffc0dd.add(_0x2a7db1);
    var _0x5b4109 = _0x2a7db1.textContent;
    if (
      !_0x5b4109 ||
      (_0x5b4109.indexOf("http") === -1 && _0x5b4109.indexOf("www.") === -1)
    ) {
      return;
    }
    var _0x672b0a = [];
    var _0x19a911 = 0;
    var _0x58eae3;
    _0x346d07.lastIndex = 0;
    while ((_0x58eae3 = _0x346d07.exec(_0x5b4109)) !== null) {
      if (_0x58eae3.index > _0x19a911) {
        _0x672b0a.push({
          t: _0x5b4109.slice(_0x19a911, _0x58eae3.index),
        });
      }
      var _0x420d60 = _0x58eae3[0];
      var _0x31403c =
        _0x420d60.indexOf("http") === 0 ? _0x420d60 : "https://" + _0x420d60;
      var _0x26eab2 = _0x33307d.test(_0x31403c);
      _0x672b0a.push({
        t: _0x420d60,
        link: true,
        room: _0x26eab2,
        href: _0x31403c,
      });
      _0x19a911 = _0x58eae3.index + _0x420d60.length;
    }
    if (_0x672b0a.length === 0) {
      return;
    }
    if (_0x19a911 < _0x5b4109.length) {
      _0x672b0a.push({
        t: _0x5b4109.slice(_0x19a911),
      });
    }
    var _0x1f1743 = document.createDocumentFragment();
    for (var _0x541aa4 = 0; _0x541aa4 < _0x672b0a.length; _0x541aa4++) {
      var _0x1df807 = _0x672b0a[_0x541aa4];
      if (_0x1df807.link) {
        var _0x598bdd = document.createElement("span");
        _0x598bdd.textContent = _0x1df807.t;
        _0x598bdd.className = _0x1df807.room
          ? "chat-link chat-link-room"
          : "chat-link";
        _0x598bdd.dataset.href = _0x1df807.href;
        _0x598bdd.dataset.room = _0x1df807.room ? "1" : "0";
        _0x1f1743.appendChild(_0x598bdd);
      } else {
        _0x1f1743.appendChild(document.createTextNode(_0x1df807.t));
      }
    }
    _0x2a7db1.textContent = "";
    _0x2a7db1.appendChild(_0x1f1743);
  }
  function _0x4f070a() {
    var _0xb7cdc3 = document.querySelector(".log-contents");
    if (!_0xb7cdc3) {
      setTimeout(_0x4f070a, 300);
      return;
    }
    var _0x23f4ac = _0xb7cdc3.getElementsByTagName("p");
    for (var _0x26acd7 = 0; _0x26acd7 < _0x23f4ac.length; _0x26acd7++) {
      _0x12bc8f(_0x23f4ac[_0x26acd7]);
    }
    new MutationObserver(function (_0x57c055) {
      for (var _0x2f5008 = 0; _0x2f5008 < _0x57c055.length; _0x2f5008++) {
        var _0x36074e = _0x57c055[_0x2f5008].addedNodes;
        for (var _0x50275f = 0; _0x50275f < _0x36074e.length; _0x50275f++) {
          if (_0x36074e[_0x50275f].tagName === "P") {
            _0x12bc8f(_0x36074e[_0x50275f]);
          }
        }
      }
    }).observe(_0xb7cdc3, {
      childList: true,
    });
    _0xb7cdc3.addEventListener(
      "click",
      function (_0x24e970) {
        var _0x456bce = _0x24e970.target;
        if (_0x456bce.classList && _0x456bce.classList.contains("chat-link")) {
          _0x24e970.preventDefault();
          _0x24e970.stopPropagation();
          _0x24e970.stopImmediatePropagation();
          var _0x397cf3 = _0x456bce.dataset.href;
          var _0xa8dc57 = _0x456bce.dataset.room === "1";
          if (_0xa8dc57) {
            window.top.location.href = _0x397cf3;
          } else {
            navigator.clipboard.writeText(_0x397cf3).catch(function () {});
            _0x456bce.style.opacity = "0.5";
            setTimeout(function () {
              _0x456bce.style.opacity = "";
            }, 300);
          }
          return false;
        }
      },
      true,
    );
  }
  document.addEventListener(
    "click",
    function (_0x2a223f) {
      var _0x41efa0 = _0x2a223f.target;
      if (_0x41efa0.tagName === "A") {
        var _0x24ad55 =
          _0x41efa0.closest(".log-contents") ||
          _0x41efa0.closest(".chatbox-view");
        if (_0x24ad55) {
          _0x2a223f.preventDefault();
          _0x2a223f.stopPropagation();
          _0x2a223f.stopImmediatePropagation();
          return false;
        }
      }
    },
    true,
  );
  Injector.injectCSS(
    "chat-links-css",
    '        .chat-link{color:#60a5fa!important;cursor:pointer!important}        .chat-link:hover{text-decoration:underline!important}        .chat-link-room{color:#4ade80!important}        body[data-theme="light"] .chat-link{color:#2563eb!important}        body[data-theme="light"] .chat-link-room{color:#16a34a!important}        .log-contents a,.chatbox-view a{pointer-events:none!important;color:inherit!important;text-decoration:none!important}    ',
  );
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _0x4f070a);
  } else {
    _0x4f070a();
  }
})();
