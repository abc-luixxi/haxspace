(function () {
  if (!Injector.isMainFrame()) {
    return;
  }
  if (window.__headerInjected) {
    return;
  }
  window.__headerInjected = true;
  window.__headerDisabledForStar = true;
  var _0x151169 = "star-hax-down";
  var _0xae61ea = "star-hax-down-css";
  var _0x4f1c76 = null;
  function _0x158f58() {
    try {
      var _0x9905a7 = (document.title || "").toLowerCase();
      if (
        _0x9905a7.indexOf("just a moment") !== -1 ||
        _0x9905a7.indexOf("un momento") !== -1 ||
        _0x9905a7.indexOf("einen moment") !== -1 ||
        _0x9905a7.indexOf("un instant") !== -1 ||
        _0x9905a7.indexOf("verificaci") !== -1 ||
        _0x9905a7.indexOf("security check") !== -1 ||
        _0x9905a7.indexOf("attention required") !== -1 ||
        _0x9905a7.indexOf("cloudflare") !== -1
      ) {
        return true;
      }
      if (window._cf_chl_opt || window._cf_chl_enter) {
        return true;
      }
      if (
        document.querySelector(
          '#challenge-form, .cf-browser-verification, #cf-challenge-running, #cf-wrapper, .cf-error-details, .cf-turnstile, iframe[src*="challenges.cloudflare"], iframe[src*="turnstile"]',
        )
      ) {
        return true;
      }
      var _0x347039 = (
        (document.body && document.body.innerText) ||
        ""
      ).toLowerCase();
      if (
        _0x347039.indexOf("verificaci") !== -1 &&
        (_0x347039.indexOf("cloudflare") !== -1 ||
          _0x347039.indexOf("no eres un bot") !== -1 ||
          _0x347039.indexOf("not a bot") !== -1)
      ) {
        return true;
      }
      if (_0x347039.indexOf("checking your browser") !== -1) {
        return true;
      }
      if (
        _0x347039.indexOf("ray id") !== -1 &&
        _0x347039.indexOf("cloudflare") !== -1
      ) {
        return true;
      }
    } catch (_0x3088cb) {}
    return false;
  }
  function _0x1e5ac7() {
    try {
      if (
        document.querySelector(
          'iframe[src*="game.html"], iframe[src*="html5.haxball"]',
        )
      ) {
        return true;
      }
      if (document.querySelector(".gameframe, #gameframe")) {
        return true;
      }
    } catch (_0x101859) {}
    return false;
  }
  function _0x12704a() {
    if (document.getElementById(_0xae61ea)) {
      return;
    }
    var _0x301849 = document.createElement("style");
    _0x301849.id = _0xae61ea;
    _0x301849.textContent =
      "html.star-hax-down, html.star-hax-down body{margin:0!important;padding:0!important;width:100%!important;height:100%!important;overflow:hidden!important;background:#000!important;}html.star-hax-down body > *:not(#" +
      _0x151169 +
      "){visibility:hidden!important;pointer-events:none!important;opacity:0!important;}#" +
      _0x151169 +
      '{position:fixed!important;inset:0!important;z-index:2147483646!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:28px!important;box-sizing:border-box!important;font-family:"Segoe UI",system-ui,-apple-system,sans-serif!important;color:#fff!important;user-select:none!important;-webkit-font-smoothing:antialiased!important;background:radial-gradient(120% 80% at 50% 0%, rgba(28,30,40,0.95) 0%, rgba(0,0,0,0.92) 55%, #000 100%),linear-gradient(180deg,#0a0b10 0%,#000 100%)!important;}#' +
      _0x151169 +
      " .star-hax-down__card{width:min(420px,100%);text-align:center;animation:starHaxDownIn .55s ease both;}#" +
      _0x151169 +
      " .star-hax-down__brand{margin:0 0 22px;font-size:13px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.45);}#" +
      _0x151169 +
      " .star-hax-down__title{margin:0 0 10px;font-size:28px;font-weight:600;letter-spacing:0.02em;line-height:1.15;color:#fff;}#" +
      _0x151169 +
      " .star-hax-down__copy{margin:0 auto 28px;max-width:34ch;font-size:15px;line-height:1.45;color:rgba(210,205,200,0.62);font-weight:400;}#" +
      _0x151169 +
      " .star-hax-down__btn{appearance:none;border:1px solid #104b1e;background:#111c12;color:#07f361;min-width:180px;height:44px;padding:0 22px;border-radius:10px;font-size:15px;font-weight:600;letter-spacing:0.02em;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.35);transition:filter .15s ease, background .15s ease;}#" +
      _0x151169 +
      " .star-hax-down__btn:hover{filter:brightness(1.08);background:#183520;}@keyframes starHaxDownIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}";
    (document.head || document.documentElement).appendChild(_0x301849);
  }
  function _0x37f925() {
    _0x12704a();
    try {
      document.documentElement.classList.add("star-hax-down");
    } catch (_0x5b3264) {}
    if (document.getElementById(_0x151169)) {
      return;
    }
    var _0x48b31e = document.createElement("div");
    _0x48b31e.id = _0x151169;
    _0x48b31e.setAttribute("role", "alertdialog");
    _0x48b31e.setAttribute("aria-live", "polite");
    _0x48b31e.innerHTML =
      '<div class="star-hax-down__card"><div class="star-hax-down__brand">Space</div><h1 class="star-hax-down__title">HaxBall está caído</h1><p class="star-hax-down__copy">No pudimos conectar con los servidores. Probá de nuevo en unos minutos.</p><button type="button" class="star-hax-down__btn" data-star-hax-retry>Reintentar</button></div>';
    var _0xdcc99f = document.body || document.documentElement;
    _0xdcc99f.appendChild(_0x48b31e);
    var _0x5c5cd2 = _0x48b31e.querySelector("[data-star-hax-retry]");
    if (_0x5c5cd2) {
      _0x5c5cd2.addEventListener("click", function () {
        try {
          location.reload();
        } catch (_0xd79716) {
          try {
            location.href = location.href;
          } catch (_0x548135) {}
        }
      });
    }
  }
  function _0xbaaabe() {
    try {
      document.documentElement.classList.remove("star-hax-down");
    } catch (_0x2df218) {}
    var _0x26387d = document.getElementById(_0x151169);
    if (_0x26387d && _0x26387d.parentNode) {
      _0x26387d.parentNode.removeChild(_0x26387d);
    }
    var _0x4189d2 = document.getElementById(_0xae61ea);
    if (_0x4189d2 && _0x4189d2.parentNode) {
      _0x4189d2.parentNode.removeChild(_0x4189d2);
    }
  }
  function _0x560581() {
    if (_0x158f58() && !_0x1e5ac7()) {
      _0x37f925();
      return true;
    }
    if (document.documentElement.classList.contains("star-hax-down")) {
      _0xbaaabe();
    }
    return false;
  }
  function _0x4f2394() {
    if (_0x158f58()) {
      _0x37f925();
      setTimeout(_0x4f2394, 600);
      return;
    }
    _0xbaaabe();
    Injector.injectCSS(
      "star-header-hide",
      '.header { display: none !important; }html, body { margin: 0 !important; padding: 0 !important; height: 100% !important; overflow: hidden !important; }iframe[src*="game.html"], iframe[src*="html5.haxball"] {position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;width: 100% !important; height: 100vh !important; border: none !important;}',
    );
  }
  function _0x3624c8() {
    if (_0x4f1c76) {
      return;
    }
    _0x4f1c76 = setInterval(function () {
      try {
        if (_0x560581()) {
          return;
        }
        if (_0x1e5ac7()) {
          clearInterval(_0x4f1c76);
          _0x4f1c76 = null;
        }
      } catch (_0x270450) {}
    }, 700);
  }
  Injector.waitForElement("body")
    .then(function () {
      _0x560581();
      _0x4f2394();
      _0x3624c8();
    })
    .catch(function () {
      _0x560581();
      _0x4f2394();
      _0x3624c8();
    });
  try {
    document.addEventListener("DOMContentLoaded", function () {
      _0x560581();
    });
  } catch (_0x2cf81b) {}
})();
