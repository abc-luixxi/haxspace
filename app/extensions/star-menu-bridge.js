// ============================================
// STAR MENU BRIDGE - Overlay Star + HaxBall DOM
// ============================================
(function () {
  if (typeof Injector === "undefined") return;
  if (Injector.isMainFrame()) return;
  if (window.__starMenuBridge) return;
  window.__starMenuBridge = true;

  // Boot defaults — only when user has no Space Config yet
  try {
    var _hasStarCfg = !!localStorage.getItem("starClientConfig");
    if (!_hasStarCfg) {
      localStorage.setItem("quality_mode", "1");
      window._hxdQualityMultiplier = 1.0;
      var _rs = localStorage.getItem("resolution_scale");
      var _rsn = _rs != null && _rs !== "" ? parseFloat(_rs) : 1;
      if (isNaN(_rsn) || _rsn <= 0) _rsn = 1;
      if (_rsn > 1) _rsn = Math.max(0.1, Math.min(1, _rsn / 100));
      if (_rsn < 0.85) _rsn = 1;
      localStorage.setItem("resolution_scale", String(_rsn));
      localStorage.setItem("low_quality_circles", "0");
      localStorage.setItem("low_latency_canvas", "0");
      localStorage.setItem("image_smoothing", "1");
      localStorage.setItem("simple_lines", "0");
      localStorage.setItem("ultra_simple_lines", "0");
      localStorage.setItem("simple_field", "0");
    }
  } catch (_eHdBoot) {}

  // Critical: never leave Kick-only player_keys (fresh profile / rebrand) or WASD dies
  try {
    var _pkRaw = localStorage.getItem("player_keys");
    var _pk = _pkRaw ? JSON.parse(_pkRaw) : null;
    var _hasMoveAction = function (map, action) {
      if (!map || typeof map !== "object") return false;
      return Object.keys(map).some(function (code) {
        return map[code] === action;
      });
    };
    var _needsMove =
      !_hasMoveAction(_pk, "Up") ||
      !_hasMoveAction(_pk, "Down") ||
      !_hasMoveAction(_pk, "Left") ||
      !_hasMoveAction(_pk, "Right");
    if (_needsMove) {
      if (!_pk || typeof _pk !== "object") _pk = {};
      if (!_hasMoveAction(_pk, "Up")) {
        _pk.ArrowUp = "Up";
        _pk.KeyW = "Up";
      }
      if (!_hasMoveAction(_pk, "Down")) {
        _pk.ArrowDown = "Down";
        _pk.KeyS = "Down";
      }
      if (!_hasMoveAction(_pk, "Left")) {
        _pk.ArrowLeft = "Left";
        _pk.KeyA = "Left";
      }
      if (!_hasMoveAction(_pk, "Right")) {
        _pk.ArrowRight = "Right";
        _pk.KeyD = "Right";
      }
      if (
        !Object.keys(_pk).some(function (code) {
          return _pk[code] === "Kick";
        })
      ) {
        _pk.KeyX = "Kick";
        _pk.Space = "Kick";
      }
      localStorage.setItem("player_keys", JSON.stringify(_pk));
    }
  } catch (_ePkBoot) {}

  // One-time camera repair: Full 1× + zEro64 zero-zoom semantics.
  // Dynamic (-1) combined with zero zoom produces Ig=.25 ("zoom Cancún").
  try {
    if (!localStorage.getItem("star_camera_zfix_v3")) {
      localStorage.setItem("star_camera_zfix_v3", "1");
      localStorage.setItem("view_mode", "1");
      localStorage.removeItem("hax_zero_zoom");
      localStorage.removeItem("star_zero_zoom");
    }
  } catch (_eCamBoot) {}

  try {
    var _avBoot = localStorage.getItem("star_avatar_image");
    if (_avBoot) window.__starAvatarImage = _avBoot;
  } catch (_eAvBoot) {}

  try {
    var _ballBoot = localStorage.getItem("star_custom_ball");
    if (_ballBoot) window.__starCustomBall = JSON.parse(_ballBoot);
    var _ballImg = localStorage.getItem("star_custom_ball_image");
    if (
      _ballImg &&
      window.__starCustomBall &&
      typeof window.__starCustomBall === "object"
    ) {
      window.__starCustomBall.image = _ballImg;
    }
  } catch (_eBallBoot) {}

  var STAR_UI_URL = "http://127.0.0.1:5483/ui/star-menu.html";
  var IFRAME_ID = "star-menu-frame";
  var pendingNick = null;
  var nickSubmitted = false;
  var menuVisible = true;
  var lastRoomsSig = "";
  var roomsPollTimer = null;
  var pendingPassword = null;
  var pendingJoinName = null;
  var modsOverlayOpen = false;
  var modsEscBusy = false;
  var escLockUntil = 0;
  var modsCloseTimer = 0;
  var inGameSession = false;
  var menuReturnTimer = 0;
  var motionBlurEnabled = false;
  var motionBlurIntensity = 0.22;
  var motionBlurFrameRate = 24;
  var motionBlurTimer = 0;
  var motionBlurCanvas = null;
  var motionBlurCtx = null;
  var motionBlurPrev = null;
  var motionBlurPrevCtx = null;
  var motionBlurSource = null;
  var motionBlurSourceUntil = 0;
  var motionBlurRect = null;
  var motionBlurRectUntil = 0;
  var roomStateFeedTimer = 0;
  var suppressRoomPanelUntil = 0;
  var awaitingNativeDialog = false;
  /** Suppress snap-back to Star menu while create/join/captcha settles. */
  var roomTransitionUntil = 0;

  function beginRoomTransition(ms) {
    roomTransitionUntil = Date.now() + (ms || 15000);
  }

  function inRoomTransition() {
    return Date.now() < roomTransitionUntil;
  }

  function endRoomTransition() {
    roomTransitionUntil = 0;
  }

  function postToMenu(payload) {
    var frame = document.getElementById(IFRAME_ID);
    if (!frame || !frame.contentWindow) return;
    try {
      frame.contentWindow.postMessage(payload, "*");
    } catch (e) {}
  }

  function setNativeHidden(hidden) {
    try {
      document.documentElement.classList.toggle("star-ui-active", !!hidden);
    } catch (e) {}
  }

  function isValidateMode() {
    try {
      if (document.documentElement.getAttribute("data-star-validate") === "1")
        return true;
    } catch (eAttr) {}
    try {
      if (window.__STAR_VALIDATE_CREATE) return true;
    } catch (eWin) {}
    try {
      var x = new XMLHttpRequest();
      x.open("GET", "http://127.0.0.1:5483/star-validate", false);
      x.send(null);
      if (x.status === 200 && String(x.responseText || "").trim() === "1")
        return true;
    } catch (eXhr) {}
    return false;
  }

  function ensureOverlay() {
    // Validation mode must keep native HaxBall visible/interactive.
    if (isValidateMode()) return;
    if (document.getElementById(IFRAME_ID)) return;
    var frame = document.createElement("iframe");
    frame.id = IFRAME_ID;
    frame.src = STAR_UI_URL;
    frame.setAttribute("allowtransparency", "true");
    frame.style.cssText =
      "position:fixed;inset:0;width:100%;height:100%;border:0;z-index:2147483000;" +
      "background:transparent;pointer-events:auto;";
    (document.body || document.documentElement).appendChild(frame);
    setNativeHidden(true);
  }

  function showMenu(show) {
    // Never put the Space skybox / hub chrome over a live room or match.
    if (isInRoom()) {
      enterInGameUi();
      return;
    }
    // Match just ended — wait for onMenu debounce before restoring launcher.
    if (show && inGameSession) {
      return;
    }
    // Entering a room/game: hide Space UI so native pitch shows (like HaxBall Space D)
    if (!show) {
      // Still not in room DOM yet — keep launcher until room mounts
      clearNativeHostUi();
    }
    // Don't tear down captcha verify while a native dialog is open
    if (
      document.documentElement.classList.contains("star-verify-mode") &&
      document.querySelector(".simple-dialog-view")
    ) {
      return;
    }
    restoreStarOverNative();
    endRoomTransition();
    try {
      document.documentElement.classList.remove("star-ingame-hud");
    } catch (eHud) {}
    menuVisible = !!show;
    modsOverlayOpen = false;
    document.documentElement.classList.remove("star-mods-overlay");
    document.documentElement.classList.remove("star-room-ui");
    var frame = document.getElementById(IFRAME_ID);
    document.documentElement.classList.remove("star-verify-mode");
    if (frame) {
      frame.style.display = show ? "block" : "none";
      frame.style.pointerEvents = show ? "auto" : "none";
      frame.style.zIndex = "2147483000";
      frame.style.visibility = "";
      frame.style.opacity = "";
      frame.style.background = "";
      frame.style.backgroundColor = "";
      frame.classList.remove("star-under-native");
      try {
        frame.removeAttribute("inert");
      } catch (eInert) {}
    }
    setNativeHidden(show);
    postToMenu({ type: "star:verify", active: false });
    postToMenu({ type: "star:close-mods" });
    // Only clear in-game skybox hide when actually showing the launcher
    postToMenu({ type: "star:ingame", active: !show });
  }

  function isInRoom() {
    return !!(
      document.querySelector(".room-view") ||
      document.querySelector(".game-view")
    );
  }

  function isTypingTarget(el) {
    if (!el) return false;
    var tag = (el.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    try {
      if (el.isContentEditable) return true;
    } catch (e) {}
    return false;
  }

  function focusGame() {
    try {
      var frame = document.getElementById(IFRAME_ID);
      if (frame) {
        try {
          frame.blur();
        } catch (e1) {}
        try {
          if (frame.contentWindow) {
            try {
              frame.contentWindow.blur();
            } catch (eW) {}
          }
        } catch (e2) {}
      }
      var ae = document.activeElement;
      // Don't blur body/game-view — that fires focusout and wipes WASD via Tb.zl().
      if (ae && ae !== document.body && ae !== document.documentElement) {
        var tag = (ae.tagName || "").toLowerCase();
        var inGameSurface = !!(
          ae.closest &&
          (ae.closest(".game-view") || ae.closest(".room-view canvas"))
        );
        if (
          !inGameSurface &&
          (tag === "input" ||
            tag === "textarea" ||
            tag === "iframe" ||
            ae === frame ||
            tag === "button")
        ) {
          try {
            ae.blur();
          } catch (e3) {}
        }
      }
      var view =
        document.querySelector(".game-view") ||
        document.querySelector(".room-view");
      if (view) {
        try {
          view.tabIndex = -1;
        } catch (e4) {}
        try {
          view.focus({ preventScroll: true });
        } catch (e5) {
          try {
            view.focus();
          } catch (e6) {}
        }
      } else {
        try {
          window.focus();
        } catch (e7) {}
      }
    } catch (e) {}
  }

  var spotifyHitbox = { enabled: false, x: 0, y: 0, w: 0, h: 0 };
  var spotifyButtons = [];
  var spotifyPointerOn = false;
  var spotifyHitListen = false;
  var spotifyLastActionAt = 0;

  function iframeOffset() {
    var frame = document.getElementById(IFRAME_ID);
    if (!frame) return { left: 0, top: 0 };
    try {
      var fr = frame.getBoundingClientRect();
      return { left: fr.left || 0, top: fr.top || 0 };
    } catch (e) {
      return { left: 0, top: 0 };
    }
  }

  function pointInSpotifyHitbox(clientX, clientY) {
    if (!spotifyHitbox.enabled) return false;
    var pad = 8;
    return (
      clientX >= spotifyHitbox.x - pad &&
      clientX <= spotifyHitbox.x + spotifyHitbox.w + pad &&
      clientY >= spotifyHitbox.y - pad &&
      clientY <= spotifyHitbox.y + spotifyHitbox.h + pad
    );
  }

  function spotifyActionAt(clientX, clientY) {
    var pad = 8;
    for (var i = 0; i < spotifyButtons.length; i++) {
      var b = spotifyButtons[i];
      if (!b || !b.action) continue;
      if (
        clientX >= b.x - pad &&
        clientX <= b.x + b.w + pad &&
        clientY >= b.y - pad &&
        clientY <= b.y + b.h + pad
      ) {
        return b.action;
      }
    }
    return "";
  }

  function canUseSpotifyHitProxy() {
    if (!inGameSession || modsOverlayOpen) return false;
    if (document.documentElement.classList.contains("star-verify-mode"))
      return false;
    if (document.documentElement.classList.contains("star-native-dialog"))
      return false;
    if (document.documentElement.classList.contains("star-room-ui"))
      return false;
    return !!spotifyHitbox.enabled;
  }

  function syncSpotifyPointerFromEvent(e) {
    if (!canUseSpotifyHitProxy()) {
      if (spotifyPointerOn) spotifyPointerOn = false;
      return;
    }
    var over = !!(e && pointInSpotifyHitbox(e.clientX, e.clientY));
    if (over === spotifyPointerOn) return;
    spotifyPointerOn = over;
  }

  function forwardSpotifyPointer(kind, e) {
    if (!canUseSpotifyHitProxy()) return false;
    if (!e || !pointInSpotifyHitbox(e.clientX, e.clientY)) return false;
    try {
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function")
        e.stopImmediatePropagation();
    } catch (eStop) {}

    // preventDefault(mousedown) can suppress click — fire action on mousedown.
    if (kind === "mousedown") {
      if (e.button != null && e.button !== 0) return true;
      var now = Date.now();
      if (now - spotifyLastActionAt < 180) return true;
      var action = spotifyActionAt(e.clientX, e.clientY);
      if (action) {
        spotifyLastActionAt = now;
        postToMenu({ type: "star:spotify-action", action: action });
      } else {
        // Still forward coords as fallback (menu maps to nearest button).
        postToMenu({
          type: "star:spotify-pointer",
          kind: "mousedown",
          x: e.clientX - iframeOffset().left,
          y: e.clientY - iframeOffset().top,
          button: 0,
        });
      }
    }
    return true;
  }

  function ensureSpotifyHitListener() {
    if (spotifyHitListen) return;
    spotifyHitListen = true;
    document.addEventListener("mousemove", syncSpotifyPointerFromEvent, true);
    document.addEventListener("pointermove", syncSpotifyPointerFromEvent, true);
    document.addEventListener(
      "mousedown",
      function (e) {
        forwardSpotifyPointer("mousedown", e);
      },
      true,
    );
    document.addEventListener(
      "mouseup",
      function (e) {
        forwardSpotifyPointer("mouseup", e);
      },
      true,
    );
    document.addEventListener(
      "click",
      function (e) {
        forwardSpotifyPointer("click", e);
      },
      true,
    );
    document.addEventListener(
      "contextmenu",
      function (e) {
        if (
          canUseSpotifyHitProxy() &&
          pointInSpotifyHitbox(e.clientX, e.clientY)
        ) {
          try {
            e.preventDefault();
            e.stopPropagation();
          } catch (eCtx) {}
        }
      },
      true,
    );
  }

  function setSpotifyHitbox(data) {
    var enabled = !!(data && data.enabled && data.rect);
    if (!enabled) {
      spotifyHitbox.enabled = false;
      spotifyButtons = [];
      spotifyPointerOn = false;
      return;
    }
    ensureSpotifyHitListener();
    var off = iframeOffset();
    var r = data.rect || {};
    spotifyHitbox.enabled = true;
    spotifyHitbox.x = off.left + (Number(r.x) || 0);
    spotifyHitbox.y = off.top + (Number(r.y) || 0);
    spotifyHitbox.w = Number(r.w) || 0;
    spotifyHitbox.h = Number(r.h) || 0;
    var rawBtns = Array.isArray(data.buttons) ? data.buttons : [];
    spotifyButtons = rawBtns
      .map(function (btn) {
        return {
          action: String((btn && btn.action) || ""),
          x: off.left + (Number(btn && btn.x) || 0),
          y: off.top + (Number(btn && btn.y) || 0),
          w: Number(btn && btn.w) || 0,
          h: Number(btn && btn.h) || 0,
        };
      })
      .filter(function (btn) {
        return !!btn.action && btn.w > 0 && btn.h > 0;
      });
  }

  function setStarFrameInteractive(on) {
    var frame = document.getElementById(IFRAME_ID);
    if (!frame) return;
    try {
      var want = !!on;
      var isOn = !frame.hasAttribute("inert");
      if (want === isOn) {
        // Still enforce pointer-events in case CSS drifted
        frame.style.setProperty(
          "pointer-events",
          want ? "auto" : "none",
          "important",
        );
        return;
      }
      if (want) {
        frame.removeAttribute("inert");
        frame.style.setProperty("pointer-events", "auto", "important");
      } else {
        frame.setAttribute("inert", "");
        try {
          frame.tabIndex = -1;
        } catch (eTab) {}
        frame.style.setProperty("pointer-events", "none", "important");
        try {
          frame.blur();
        } catch (eBlur) {}
      }
    } catch (e) {}
  }

  /** Reclaim WASD when focus is stuck in the Star iframe / room chrome. */
  function reclaimGameFocusIfNeeded(e) {
    if (!isInRoom()) return;
    if (modsOverlayOpen) return; // hub open — let iframe keep focus
    if (document.documentElement.classList.contains("star-verify-mode")) return;
    if (isTypingTarget(e && e.target)) return;
    if (isTypingTarget(document.activeElement)) return;
    if (e && e.target && e.target.closest && e.target.closest(".chatbox-view"))
      return;
    var frame = document.getElementById(IFRAME_ID);
    var ae = document.activeElement;
    var stuck = false;
    if (frame && ae === frame) stuck = true;
    try {
      if (
        frame &&
        frame.contentDocument &&
        frame.contentDocument.hasFocus &&
        frame.contentDocument.hasFocus()
      ) {
        stuck = true;
      }
    } catch (eF) {}
    // Only reclaim from room chrome controls — never from game-view itself.
    if (
      ae &&
      ae.closest &&
      ae.closest(".room-view") &&
      !ae.closest(".game-view") &&
      !isTypingTarget(ae)
    ) {
      var tag = (ae.tagName || "").toLowerCase();
      if (
        tag === "button" ||
        tag === "a" ||
        ae.getAttribute("role") === "button"
      )
        stuck = true;
    }
    if (stuck && !spotifyPointerOn) {
      setStarFrameInteractive(false);
      focusGame();
    }
  }

  function restoreGameFocusAfterOverlayClose() {
    try {
      var s = document.createElement("script");
      s.textContent =
        "try{window.__hxdRestoreGameFocusAfterSettingsClose&&" +
        "window.__hxdRestoreGameFocusAfterSettingsClose()}catch(e){}";
      (document.documentElement || document.head || document.body).appendChild(
        s,
      );
      try {
        s.remove();
      } catch (eRemove) {}
    } catch (eInject) {}
    setStarFrameInteractive(false);
    focusGame();
    setTimeout(focusGame, 30);
    setTimeout(focusGame, 120);
  }

  /** Keep room menu buttons from stealing keyboard focus (WASD still works). */
  function installRoomMenuFocusGuard() {
    document.addEventListener(
      "mousedown",
      function (e) {
        if (!e || !e.target || !e.target.closest) return;
        var btn = e.target.closest(".room-view button");
        if (!btn) return;
        // Selects/inputs still need focus; buttons do not
        try {
          e.preventDefault();
        } catch (err) {}
        setTimeout(focusGame, 0);
      },
      true,
    );
  }

  /**
   * In-match: keep Star iframe transparent for HUD mods; clicks pass through.
   * ESC opens the mods hub on top without tearing the iframe down.
   */
  function enterInGameUi() {
    inGameSession = true;
    if (menuReturnTimer) {
      clearTimeout(menuReturnTimer);
      menuReturnTimer = 0;
    }
    clearNativeHostUi();
    restoreStarOverNative();
    endRoomTransition();
    if (modsCloseTimer) {
      clearTimeout(modsCloseTimer);
      modsCloseTimer = 0;
    }
    // A stale room/config overlay must never survive a room/game mount:
    // its full-screen iframe owns keyboard focus and kills movement.
    var keepRoom = false;
    modsEscBusy = false;
    menuVisible = false;
    document.documentElement.classList.remove("star-verify-mode");
    document.documentElement.classList.remove("star-native-dialog");
    modsOverlayOpen = false;
    document.documentElement.classList.remove("star-mods-overlay");
    document.documentElement.classList.remove("star-room-ui");
    stopRoomStateFeed();
    try {
      document.documentElement.classList.add("star-ingame-hud");
    } catch (eHud) {}
    ensureOverlay();
    var frame = document.getElementById(IFRAME_ID);
    if (frame) {
      frame.style.display = "block";
      frame.style.visibility = "visible";
      frame.style.opacity = "1";
      frame.style.zIndex = "2147483000";
      frame.style.background = "transparent";
      frame.style.backgroundColor = "transparent";
      frame.setAttribute("allowtransparency", "true");
      frame.classList.remove("star-under-native");
      setStarFrameInteractive(false);
    }
    setNativeHidden(false);
    postToMenu({ type: "star:verify", active: false });
    postToMenu({ type: "star:close-mods" });
    postToMenu({ type: "star:close-room-panel" });
    postToMenu({ type: "star:ingame", active: true });
    syncNativeScoreboardVisibility();
    pushHudStats(true);
    applyKickKeyBind(getKickKeyCode());
    try {
      ensurePlayerKeysMap(getKickKeyCode());
    } catch (ePk) {}
    focusGame();
    setTimeout(focusGame, 30);
    setTimeout(focusGame, 120);
    setTimeout(focusGame, 300);
    startInGameFocusWatch();
  }

  /** While HUD-only, never leave keyboard focus trapped in the Star iframe. */
  function startInGameFocusWatch() {
    if (window.__starInGameFocusWatch) return;
    window.__starInGameFocusWatch = setInterval(function () {
      if (!isInRoom() || modsOverlayOpen) return;
      if (document.documentElement.classList.contains("star-verify-mode"))
        return;
      if (document.documentElement.classList.contains("star-native-dialog"))
        return;
      if (isTypingTarget(document.activeElement)) return;
      var frame = document.getElementById(IFRAME_ID);
      if (!frame) return;
      var stuck = document.activeElement === frame;
      try {
        if (
          frame.contentDocument &&
          frame.contentDocument.hasFocus &&
          frame.contentDocument.hasFocus()
        ) {
          stuck = true;
        }
      } catch (eF) {}
      if (stuck && !spotifyPointerOn) {
        setStarFrameInteractive(false);
        focusGame();
      }
    }, 400);
  }

  /** ESC in-room: same Star mods hub as the menu Mods button */
  function showModsOverlay(on) {
    ensureOverlay();
    var frame = document.getElementById(IFRAME_ID);
    if (modsCloseTimer) {
      clearTimeout(modsCloseTimer);
      modsCloseTimer = 0;
    }
    if (on) {
      modsOverlayOpen = true;
      modsEscBusy = false;
      menuVisible = false;
      document.documentElement.classList.remove("star-verify-mode");
      document.documentElement.classList.add("star-mods-overlay");
      try {
        document.documentElement.classList.add("star-ingame-hud");
      } catch (eHud2) {}
      if (frame) {
        frame.style.display = "block";
        frame.style.visibility = "visible";
        frame.style.opacity = "1";
        frame.style.zIndex = "2147483000";
        frame.style.background = "transparent";
        setStarFrameInteractive(true);
      }
      // Don't hide native pitch — only the hub overlays it
      setNativeHidden(false);
      postToMenu({ type: "star:verify", active: false });
      postToMenu({ type: "star:open-mods" });
      // Keep focus on game host so ESC always hits this listener
      focusGame();
    } else {
      modsOverlayOpen = false;
      document.documentElement.classList.remove("star-mods-overlay");
      document.documentElement.classList.remove("star-room-ui");
      stopRoomStateFeed();
      postToMenu({ type: "star:close-mods" });
      if (frame) {
        setStarFrameInteractive(false);
      }
      // Restore movement immediately — don't wait for exit anim
      restoreGameFocusAfterOverlayClose();
      if (isInRoom() || inGameSession) {
        // Stay in HUD mode; do not tear down iframe / return to launcher
        try {
          document.documentElement.classList.add("star-ingame-hud");
        } catch (eHud3) {}
        setNativeHidden(false);
        postToMenu({ type: "star:ingame", active: true });
      } else {
        showMenu(true);
      }
    }
  }

  function isNativeRoomMenuOpen() {
    try {
      return !!(
        document.querySelector(".game-view.showing-room-view") ||
        document.querySelector(".game-view.showing-room-view .room-view") ||
        document.querySelector(
          '.game-view [data-hook="top-section"] .room-view',
        )
      );
    } catch (e) {
      return false;
    }
  }

  function collectRoomState() {
    var name = "";
    try {
      var nameEl = document.querySelector('h1[data-hook="room-name"]');
      name = nameEl ? (nameEl.textContent || "").trim() : "";
    } catch (eN) {}

    // Placeholders data-hook=*-list are replaceWith()'d by .player-list-view (order: red, spec, blue)
    function teamRoots() {
      var roots = { red: null, spec: null, blue: null };
      try {
        var views = document.querySelectorAll(
          ".room-view .teams .player-list-view",
        );
        if (views && views.length) {
          roots.red = views[0] || null;
          roots.spec = views[1] || null;
          roots.blue = views[2] || null;
        }
      } catch (eR) {}
      return roots;
    }

    function listFromRoot(root) {
      var players = [];
      if (!root) return players;
      try {
        var rows = root.querySelectorAll(".player-list-item");
        var i;
        for (i = 0; i < rows.length; i++) {
          var row = rows[i];
          var n =
            row.querySelector('[data-hook="name"]') ||
            row.querySelector(".name");
          var pname = n ? (n.textContent || "").trim() : "";
          if (!pname) continue;
          var flag = "";
          var fl =
            row.querySelector(".flagico") ||
            row.querySelector('[data-hook="flag"]');
          if (fl) {
            flag =
              (fl.getAttribute && fl.getAttribute("class")) ||
              fl.className ||
              "";
            if (flag && typeof flag === "object")
              flag = String(flag.baseVal || flag);
          }
          var ping = "";
          var p = row.querySelector('[data-hook="ping"]');
          if (p) ping = (p.textContent || "").trim();
          var pid =
            row.getAttribute("data-player-id") ||
            row.getAttribute("data-player") ||
            (row.dataset && (row.dataset.playerId || row.dataset.player)) ||
            "";
          players.push({
            name: pname,
            flag: String(flag || ""),
            ping: ping,
            id: String(pid || ""),
          });
        }
      } catch (eL) {}
      return players;
    }

    function selOptions(hook) {
      try {
        var sel = document.querySelector('[data-hook="' + hook + '"]');
        if (!sel) return { value: "", options: [] };
        var options = [];
        var opts = sel.options || [];
        var j;
        for (j = 0; j < opts.length; j++) {
          options.push({ value: opts[j].value, label: opts[j].textContent });
        }
        return { value: sel.value, options: options };
      } catch (eS) {
        return { value: "", options: [] };
      }
    }

    var startStop = "start";
    try {
      var stopBtn = document.querySelector('[data-hook="stop-btn"]');
      var startBtn = document.querySelector('[data-hook="start-btn"]');
      // Parent is opacity-hidden; only trust the button's own display toggle
      if (stopBtn) {
        var st = window.getComputedStyle(stopBtn);
        if (st && st.display !== "none") startStop = "stop";
      } else if (startBtn) {
        var st2 = window.getComputedStyle(startBtn);
        if (st2 && st2.display === "none") startStop = "stop";
      }
    } catch (eSS) {}

    var stadium = "";
    try {
      var stadEl = document.querySelector('[data-hook="stadium-name"]');
      stadium = stadEl ? (stadEl.textContent || "").trim() : "";
    } catch (eSt) {}

    var admin = false;
    try {
      if (document.querySelector(".room-view.admin")) {
        admin = true;
      } else {
        var tools = document.querySelector(".room-view .tools.admin-only");
        if (tools) {
          var ts = window.getComputedStyle(tools);
          // display:none when not admin; ignore inherited visibility from our hide CSS
          admin = !!(ts && ts.display !== "none");
        }
      }
    } catch (eA) {}

    var roots = teamRoots();
    return {
      type: "star:room-state",
      name: name,
      red: listFromRoot(roots.red),
      blue: listFromRoot(roots.blue),
      spec: listFromRoot(roots.spec),
      time: selOptions("time-limit-sel"),
      score: selOptions("score-limit-sel"),
      stadium: stadium,
      startStop: startStop,
      admin: admin,
    };
  }

  function pushRoomState() {
    try {
      injectPageWorldRoomBridge();
    } catch (eBr) {}
    try {
      postToMenu(collectRoomState());
    } catch (eP) {}
  }

  function startRoomStateFeed() {
    stopRoomStateFeed();
    roomStateFeedTimer = setInterval(function () {
      if (!document.documentElement.classList.contains("star-room-ui")) {
        stopRoomStateFeed();
        return;
      }
      pushRoomState();
    }, 300);
  }

  function stopRoomStateFeed() {
    if (roomStateFeedTimer) {
      clearInterval(roomStateFeedTimer);
      roomStateFeedTimer = 0;
    }
  }

  function ensureRoomHideCss() {
    // Custom Space room panel retired — never hide native .room-view
    var el = document.getElementById("star-room-hide-css");
    if (el) {
      try {
        el.textContent = "";
      } catch (e) {}
    }
  }

  function forceHideNativeRoom() {
    clearForceHideNativeRoom();
  }

  function clearForceHideNativeRoom() {
    try {
      var nodes = document.querySelectorAll("[data-star-room-hidden]");
      var i;
      for (i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.removeAttribute("data-star-room-hidden");
        n.style.removeProperty("opacity");
        n.style.removeProperty("visibility");
        n.style.removeProperty("pointer-events");
        n.style.removeProperty("position");
        n.style.removeProperty("left");
        n.style.removeProperty("top");
        n.style.removeProperty("width");
        n.style.removeProperty("height");
      }
    } catch (eC) {}
  }

  var roomUiClosing = false;
  var openingNativeMenuUntil = 0;

  function closeNativeRoomMenu() {
    if (!isNativeRoomMenuOpen()) return true;
    try {
      var btn =
        document.querySelector('.game-view button[data-hook="menu"]') ||
        document.querySelector('button[data-hook="menu"]');
      if (btn) {
        try {
          btn.disabled = false;
          btn.removeAttribute("disabled");
        } catch (e0) {}
        try {
          clickEl(btn);
        } catch (e1) {}
      }
    } catch (e2) {}
    try {
      pageWorldRoomClick("menu");
    } catch (e3) {}
    return !isNativeRoomMenuOpen();
  }

  function clickNativeGameMenu() {
    injectPageWorldRoomBridge();
    var clicked = false;
    try {
      var btn =
        document.querySelector('.game-view button[data-hook="menu"]') ||
        document.querySelector('button[data-hook="menu"]');
      if (btn) {
        try {
          btn.disabled = false;
          btn.removeAttribute("disabled");
        } catch (e0) {}
        try {
          clickEl(btn);
          clicked = true;
        } catch (e1) {}
      }
    } catch (e2) {}
    try {
      pageWorldRoomClick("menu");
      clicked = true;
    } catch (e3) {}
    return clicked;
  }

  /** Open native HaxBall room menu (custom Space roomPanel retired). */
  function openStarRoomUi() {
    if (roomUiClosing) return;
    openingNativeMenuUntil = Date.now() + 2000;
    clearForceHideNativeRoom();
    ensureRoomHideCss();
    try {
      document.documentElement.classList.remove("star-room-ui");
    } catch (e0) {}
    try {
      document.documentElement.classList.remove("star-mods-overlay");
    } catch (e1) {}
    try {
      document.documentElement.classList.remove("star-native-dialog");
    } catch (e2) {}
    modsOverlayOpen = false;
    stopRoomStateFeed();
    postToMenu({ type: "star:close-room-panel" });
    postToMenu({ type: "star:close-mods" });
    ensureOverlay();
    var frame = document.getElementById(IFRAME_ID);
    if (frame) {
      try {
        frame.classList.remove("star-under-native");
      } catch (eU) {}
      frame.style.display = "block";
      frame.style.pointerEvents = "none";
      frame.style.visibility = "visible";
      frame.style.opacity = "1";
      frame.style.zIndex = "2147483000";
      frame.style.background = "transparent";
    }
    try {
      document.documentElement.classList.add("star-ingame-hud");
    } catch (eHud) {}
    setNativeHidden(false);
    function tryOpen(attempt) {
      if (isNativeRoomMenuOpen()) {
        focusGame();
        return;
      }
      clickNativeGameMenu();
      if (attempt < 8) {
        setTimeout(
          function () {
            tryOpen(attempt + 1);
          },
          60 + attempt * 40,
        );
      } else {
        focusGame();
      }
    }
    tryOpen(0);
    focusGame();
    setTimeout(focusGame, 40);
  }

  function closeStarRoomUi(opts) {
    opts = opts || {};
    var wantCloseNative = opts.closeNative !== false;
    suppressRoomPanelUntil = Date.now() + (wantCloseNative ? 900 : 350);
    stopRoomStateFeed();
    clearForceHideNativeRoom();
    try {
      document.documentElement.classList.remove("star-room-ui");
    } catch (e0) {}
    try {
      document.documentElement.classList.remove("star-mods-overlay");
    } catch (e1) {}
    modsOverlayOpen = false;
    postToMenu({ type: "star:close-room-panel" });

    function finish() {
      roomUiClosing = false;
      try {
        var frame = document.getElementById(IFRAME_ID);
        if (frame && isInRoom()) frame.style.pointerEvents = "none";
      } catch (eF) {}
      if (opts.focus) {
        focusGame();
        setTimeout(focusGame, 30);
        setTimeout(focusGame, 120);
      }
      try {
        if (typeof opts.onDone === "function") opts.onDone();
      } catch (eD) {}
    }

    if (!wantCloseNative) {
      finish();
      return;
    }

    roomUiClosing = true;
    var attempts = 0;
    function tick() {
      attempts++;
      if (!isNativeRoomMenuOpen()) {
        finish();
        return;
      }
      closeNativeRoomMenu();
      if (attempts < 12) {
        setTimeout(tick, 40);
        return;
      }
      roomUiClosing = false;
      finish();
    }
    tick();
  }

  function handleRoomAction(data) {
    var act = data && data.act;
    if (!act) return;
    function refreshSoon() {
      setTimeout(pushRoomState, 40);
      setTimeout(pushRoomState, 160);
      setTimeout(pushRoomState, 400);
    }
    if (act === "start-stop") {
      var state = collectRoomState();
      pageWorldRoomClick(state.startStop === "stop" ? "stop-btn" : "start-btn");
      refreshSoon();
      return;
    }
    if (act === "time" || act === "score") {
      pageWorldRoomSelect(
        act === "time" ? "time-limit-sel" : "score-limit-sel",
        data.value,
      );
      refreshSoon();
      return;
    }
    if (act === "to-red" || act === "to-spec" || act === "to-blue") {
      pageWorldJoinTeam(act === "to-red" ? 0 : act === "to-spec" ? 1 : 2);
      refreshSoon();
      return;
    }
    if (act === "move-player") {
      pageWorldMovePlayer(data.playerId || data.id, data.team);
      refreshSoon();
      return;
    }
    if (act === "pick") {
      allowNativeDialogAccess(20000);
      function tryPick() {
        if (document.querySelector(".pick-stadium-view")) return;
        pageWorldRoomClick("stadium-pick");
      }
      setTimeout(tryPick, 30);
      setTimeout(tryPick, 140);
      refreshSoon();
      return;
    }
    if (act === "link") {
      allowNativeDialogAccess(20000);
      setTimeout(function () {
        if (!document.querySelector(".room-link-view"))
          pageWorldRoomClick("link-btn");
      }, 30);
      refreshSoon();
      return;
    }
    if (act === "leave") {
      allowNativeDialogAccess(20000);
      setTimeout(function () {
        if (!document.querySelector(".leave-room-view"))
          pageWorldRoomClick("leave-btn");
      }, 30);
      return;
    }
    var map = {
      rec: "rec-btn",
      auto: "auto-btn",
      rand: "rand-btn",
      lock: "lock-btn",
      reset: "reset-all-btn",
      pause: "pause-btn",
      start: "start-btn",
      stop: "stop-btn",
    };
    if (map[act]) {
      pageWorldRoomClick(map[act]);
      refreshSoon();
    }
  }

  function installRoomMenuInterceptor() {
    // Custom room panel retired: do not hijack native Menu into Space UI
    clearForceHideNativeRoom();
    ensureRoomHideCss();
    try {
      document.documentElement.classList.remove("star-room-ui");
    } catch (e0) {}
    try {
      postToMenu({ type: "star:close-room-panel" });
    } catch (e1) {}
    if (window.__starRoomMenuPoll) {
      try {
        clearInterval(window.__starRoomMenuPoll);
      } catch (e2) {}
      window.__starRoomMenuPoll = null;
    }
  }

  function ensureNativeDialogCss() {
    var css =
      "html.star-native-dialog #star-menu-frame," +
      "html.star-room-ui.star-native-dialog #star-menu-frame," +
      "html.star-ingame-hud.star-native-dialog #star-menu-frame," +
      "html.star-ingame-hud.star-mods-overlay.star-native-dialog #star-menu-frame," +
      "html.star-ingame-hud.star-room-ui.star-native-dialog #star-menu-frame," +
      "html.star-ingame-hud.star-mods-overlay.star-room-ui.star-native-dialog #star-menu-frame{" +
      "pointer-events:none!important;opacity:0!important;visibility:hidden!important;" +
      "display:none!important;z-index:0!important;" +
      "}" +
      /* Only lift the native popup layer — never restyle .pick-stadium-view itself */
      'html.star-native-dialog [data-hook="popups"]{' +
      "z-index:2147483646!important;pointer-events:auto!important;" +
      "}" +
      "html.star-native-dialog .pick-stadium-view," +
      "html.star-native-dialog .leave-room-view," +
      "html.star-native-dialog .room-link-view," +
      "html.star-native-dialog .kick-player-view{" +
      "z-index:2147483646!important;" +
      "opacity:1!important;visibility:visible!important;pointer-events:auto!important;" +
      "}";
    var el = document.getElementById("star-native-dialog-css");
    if (!el) {
      el = document.createElement("style");
      el.id = "star-native-dialog-css";
      try {
        (document.head || document.documentElement).appendChild(el);
      } catch (eApp) {}
    }
    if (el) el.textContent = css;
  }

  var nativeDialogTimer = 0;

  function allowNativeDialogAccess(ms) {
    ensureNativeDialogCss();
    ensureRoomHideCss();
    var frame = document.getElementById(IFRAME_ID);
    try {
      document.documentElement.classList.add("star-native-dialog");
    } catch (e0) {}
    try {
      document.documentElement.classList.remove("star-mods-overlay");
    } catch (e1) {}
    // Soft-hide Space panel; reveal native room under Pick (avoid black void)
    try {
      postToMenu({ type: "star:close-room-panel" });
    } catch (eP) {}
    clearForceHideNativeRoom();
    if (frame) {
      try {
        frame.classList.add("star-under-native");
      } catch (eU) {}
      frame.style.setProperty("pointer-events", "none", "important");
      frame.style.setProperty("opacity", "0", "important");
      frame.style.setProperty("visibility", "hidden", "important");
      frame.style.setProperty("display", "none", "important");
      frame.style.setProperty("z-index", "0", "important");
    }
    if (nativeDialogTimer) {
      try {
        clearInterval(nativeDialogTimer);
      } catch (eClear) {}
      nativeDialogTimer = 0;
    }
    var seen = false;
    var n = 0;
    var max = Math.ceil((ms || 20000) / 100);
    nativeDialogTimer = setInterval(function () {
      n++;
      var dlg =
        document.querySelector(".pick-stadium-view") ||
        document.querySelector(".leave-room-view") ||
        document.querySelector(".room-link-view") ||
        document.querySelector(".kick-player-view") ||
        document.querySelector(".simple-dialog-view");
      if (dlg) {
        seen = true;
        clearForceHideNativeRoom();
        if (frame) {
          try {
            frame.classList.add("star-under-native");
          } catch (eU3) {}
          frame.style.setProperty("pointer-events", "none", "important");
          frame.style.setProperty("opacity", "0", "important");
          frame.style.setProperty("visibility", "hidden", "important");
          frame.style.setProperty("display", "none", "important");
          frame.style.setProperty("z-index", "0", "important");
        }
        try {
          document.documentElement.classList.add("star-native-dialog");
        } catch (eNd2) {}
      }
      if ((seen && !dlg) || n >= max) {
        clearInterval(nativeDialogTimer);
        nativeDialogTimer = 0;
        try {
          document.documentElement.classList.remove("star-native-dialog");
        } catch (e2) {}
        if (frame) {
          try {
            frame.classList.remove("star-under-native");
          } catch (eU2) {}
          frame.style.setProperty("display", "block", "important");
          frame.style.setProperty("pointer-events", "none", "important");
          frame.style.setProperty("opacity", "1", "important");
          frame.style.setProperty("visibility", "visible", "important");
          frame.style.setProperty("z-index", "2147483000", "important");
        }
        clearForceHideNativeRoom();
        try {
          document.documentElement.classList.remove("star-room-ui");
        } catch (eR) {}
        focusGame();
      }
    }, 100);
  }

  function onEscapeInRoom(e) {
    if (!isInRoom()) return;
    if (document.documentElement.classList.contains("star-verify-mode")) return;
    if (isTypingTarget(document.activeElement)) return;
    if (
      document.querySelector(".room-password-view") ||
      document.querySelector(".simple-dialog-view") ||
      document.querySelector(".pick-stadium-view") ||
      document.querySelector(".leave-room-view") ||
      document.querySelector(".room-link-view") ||
      document.querySelector(".kick-player-view") ||
      document.documentElement.classList.contains("star-native-dialog")
    )
      return;

    var now = Date.now();
    if (now < escLockUntil || modsEscBusy) {
      e.preventDefault();
      e.stopPropagation();
      try {
        e.stopImmediatePropagation();
      } catch (err0) {}
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    try {
      e.stopImmediatePropagation();
    } catch (err) {}
    escLockUntil = now + 180;
    modsEscBusy = true;
    try {
      if (document.documentElement.classList.contains("star-room-ui")) {
        closeStarRoomUi({ closeNative: true, focus: true });
      } else if (modsOverlayOpen) {
        postToMenu({ type: "star:escape" });
      } else if (isNativeRoomMenuOpen()) {
        closeNativeRoomMenu();
        focusGame();
        setTimeout(focusGame, 40);
      } else {
        showModsOverlay(true);
      }
    } finally {
      setTimeout(function () {
        modsEscBusy = false;
      }, 120);
    }
  }

  /** Captcha/dialog: keep Star cinematic behind a styled verify card. */
  function showVerifyMode(on) {
    if (on) {
      beginRoomTransition(20000);
      awaitingNativeDialog = true;
      try {
        document.documentElement.classList.add("star-verify-mode");
        document.documentElement.classList.add("star-ui-active");
        document.documentElement.classList.remove("star-native-dialog");
      } catch (e0) {}
      ensureOverlay();
      var frame = document.getElementById(IFRAME_ID);
      if (frame) {
        frame.classList.remove("star-under-native");
        frame.style.display = "block";
        frame.style.opacity = "1";
        frame.style.visibility = "visible";
        // Behind native captcha dialog — never cover it
        frame.style.pointerEvents = "none";
        frame.style.zIndex = "2147482000";
      }
      postToMenu({ type: "star:verify", active: true });
      return;
    }
    try {
      document.documentElement.classList.remove("star-verify-mode");
      document.documentElement.classList.remove("star-captcha-challenge");
    } catch (e0) {}
    postToMenu({ type: "star:verify", active: false });
    restoreStarOverNative();
    var frameOff = document.getElementById(IFRAME_ID);
    if (frameOff) {
      frameOff.style.zIndex = "2147483000";
      frameOff.style.pointerEvents = "auto";
    }
    if (isInRoom()) {
      enterInGameUi();
      return;
    }
    if (inRoomTransition()) {
      var tries = 0;
      (function waitRoomAfterVerify() {
        tries += 1;
        if (isInRoom()) {
          enterInGameUi();
          return;
        }
        if (
          document.querySelector(".simple-dialog-view") ||
          document.querySelector('iframe[src*="recaptcha"]')
        ) {
          showVerifyMode(true);
          setTimeout(waitRoomAfterVerify, 200);
          return;
        }
        if (tries < 40 && inRoomTransition()) {
          setTimeout(waitRoomAfterVerify, 150);
          return;
        }
        endRoomTransition();
        showMenu(true);
      })();
      return;
    }
    showMenu(true);
  }

  function fillInput(el, value) {
    if (!el) return;
    var next = value == null ? "" : String(value);
    try {
      el.focus();
    } catch (e) {}
    try {
      var proto =
        el.tagName === "TEXTAREA"
          ? window.HTMLTextAreaElement && window.HTMLTextAreaElement.prototype
          : window.HTMLInputElement && window.HTMLInputElement.prototype;
      var desc = proto && Object.getOwnPropertyDescriptor(proto, "value");
      if (desc && desc.set) desc.set.call(el, next);
      else el.value = next;
    } catch (e2) {
      el.value = next;
    }
    try {
      el.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          cancelable: true,
          data: next,
          inputType: "insertText",
        }),
      );
    } catch (e3) {
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, key: "a" }));
    if (typeof el.oninput === "function") {
      try {
        el.oninput();
      } catch (e4) {}
    }
    if (typeof el.onchange === "function") {
      try {
        el.onchange();
      } catch (e5) {}
    }
  }

  /** Hide Star iframe so native captcha/dialog is clickable — never restart Star / no verify blur. */
  function hideStarUnderNative() {
    awaitingNativeDialog = true;
    try {
      document.documentElement.classList.remove("star-verify-mode");
    } catch (e) {}
    var frame = document.getElementById(IFRAME_ID);
    if (frame) {
      frame.classList.add("star-under-native");
      frame.style.pointerEvents = "none";
      frame.style.zIndex = "0";
      frame.style.opacity = "0";
      frame.style.visibility = "hidden";
      // Keep display:block so the iframe is NOT recreated / rebooted later
      frame.style.display = "block";
    }
    // Keep star-ui-active (hides roomlist). simple-dialog stays visible via CSS.
    setNativeHidden(true);
    postToMenu({ type: "star:verify", active: false });
  }

  function restoreStarOverNative() {
    awaitingNativeDialog = false;
    var frame = document.getElementById(IFRAME_ID);
    if (frame) {
      frame.classList.remove("star-under-native");
      frame.style.opacity = "";
      frame.style.visibility = "";
    }
  }

  /** @deprecated — do not use; left as no-op alias */
  function showNativeHostUi() {
    hideStarUnderNative();
  }

  function clearNativeHostUi() {
    awaitingNativeDialog = false;
    try {
      document.documentElement.classList.remove("star-native-host");
    } catch (e) {}
  }

  function clickEl(el) {
    if (!el) return;
    try {
      el.disabled = false;
      el.removeAttribute("disabled");
      el.style.display = "";
      el.style.pointerEvents = "auto";
      // Use the DOM click path. Calling `onclick()` directly bypasses the
      // element's normal activation behavior and HaxBall never receives
      // Create Room correctly on this Chromium version.
      el.click();
    } catch (e) {
      try {
        el.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          }),
        );
      } catch (e2) {}
    }
  }

  function submitNickname(nick) {
    var name = String(nick || "")
      .trim()
      .slice(0, 25);
    if (!name) return false;
    pendingNick = name;
    try {
      localStorage.setItem("haxball_nick", name);
      localStorage.setItem("starNickname", name);
    } catch (e) {}

    var view = document.querySelector(".choose-nickname-view");
    var input =
      document.querySelector(
        '.choose-nickname-view input[data-hook="input"]',
      ) || document.querySelector('input[data-hook="input"]');
    var ok =
      document.querySelector('.choose-nickname-view button[data-hook="ok"]') ||
      document.querySelector('button[data-hook="ok"]');
    if (!input || !ok) return false;

    // Mark so old discord UI stays out of the way
    var dialog =
      document.querySelector(".choose-nickname-view .dialog") ||
      document.querySelector(".dialog");
    if (dialog) dialog.dataset.discordSetup = "done";

    fillInput(input, name);
    clickEl(ok);
    nickSubmitted = true;
    return true;
  }

  function tryAutoNick() {
    if (nickSubmitted) return;
    var nick = pendingNick;
    if (!nick) {
      try {
        if (localStorage.getItem("ghost_mode") === "true") {
          nick =
            localStorage.getItem("ghost_nick") ||
            localStorage.getItem("starNickname");
        } else {
          nick =
            localStorage.getItem("starNickname") ||
            localStorage.getItem("haxball_nick");
        }
      } catch (e) {}
    }
    if (!nick) return;
    if (
      document.querySelector(".choose-nickname-view") ||
      document.querySelector('input[data-hook="input"]')
    ) {
      submitNickname(nick);
    }
  }

  // Country centroids (approx) — used when native distance is missing
  var FLAG_COORDS = {
    ar: [-34.5, -58.4],
    uy: [-34.9, -56.2],
    br: [-14.2, -51.9],
    cl: [-35.7, -71.5],
    py: [-23.4, -58.4],
    bo: [-16.3, -63.6],
    pe: [-9.2, -75.0],
    co: [4.6, -74.1],
    ve: [6.4, -66.6],
    ec: [-1.8, -78.2],
    mx: [23.6, -102.6],
    us: [37.1, -95.7],
    ca: [56.1, -106.3],
    es: [40.5, -3.7],
    pt: [39.4, -8.2],
    fr: [46.2, 2.2],
    it: [41.9, 12.6],
    de: [51.2, 10.4],
    gb: [55.4, -3.4],
    nl: [52.1, 5.3],
    be: [50.5, 4.5],
    pl: [51.9, 19.1],
    tr: [38.9, 35.2],
    ru: [61.5, 105.3],
    ua: [48.4, 31.2],
    ro: [45.9, 24.9],
    se: [60.1, 18.6],
    no: [60.5, 8.5],
    fi: [61.9, 25.7],
    dk: [56.3, 9.5],
    ch: [46.8, 8.2],
    at: [47.5, 14.6],
    cz: [49.8, 15.5],
    hu: [47.2, 19.5],
    gr: [39.1, 21.8],
    jp: [36.2, 138.3],
    kr: [35.9, 127.8],
    cn: [35.9, 104.2],
    au: [-25.3, 133.8],
    nz: [-40.9, 174.9],
    za: [-30.6, 22.9],
    eg: [26.8, 30.8],
    in: [20.6, 78.9],
    id: [-0.8, 113.9],
    th: [15.9, 100.9],
    ph: [12.9, 121.8],
    sg: [1.4, 103.8],
    ae: [23.4, 53.8],
    sa: [23.9, 45.1],
    il: [31.0, 34.9],
    cr: [9.7, -83.8],
    pa: [8.5, -80.1],
    do: [18.7, -70.2],
    cu: [21.5, -77.8],
    un: [0, 0],
  };

  function parseNativeDistanceKm(text) {
    var t = String(text || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");
    if (!t) return NaN;
    if (t.indexOf("<1") === 0) return 0.5;
    // HaxBall native: "123km" / "0km"
    var m = t.match(/^([\d.]+)k?km$/i) || t.match(/([\d.]+)\s*km/i);
    if (m) return parseFloat(m[1]);
    var n = parseFloat(t.replace(",", "."));
    return isNaN(n) ? NaN : n;
  }

  function scrapeRooms() {
    var list = document.querySelector('.roomlist-view tbody[data-hook="list"]');
    if (!list) return null;
    var rows = list.querySelectorAll("tr");
    var rooms = [];
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      // Include search/fav-hidden — Star UI has its own filters
      var nameEl = row.querySelector('[data-hook="name"]');
      var playersEl = row.querySelector('[data-hook="players"]');
      var passEl = row.querySelector('[data-hook="pass"]');
      var flagEl = row.querySelector('[data-hook="flag"]');
      var distEl = row.querySelector('[data-hook="distance"]');
      var name = nameEl ? (nameEl.textContent || "").trim() : "";
      if (!name) continue;
      var playersText = playersEl
        ? (playersEl.textContent || "").trim()
        : "0/0";
      var parts = playersText.split("/");
      var players = parseInt(parts[0], 10) || 0;
      var max = parseInt(parts[1], 10) || 0;
      var flag = "";
      if (flagEl && flagEl.className) {
        var m = String(flagEl.className).match(/f-([a-z]{2})/i);
        if (m) flag = m[1].toLowerCase();
      }
      var locked = false;
      if (passEl) {
        var pt = (passEl.textContent || "").trim().toLowerCase();
        locked =
          pt === "yes" ||
          pt === "sí" ||
          pt === "si" ||
          pt.indexOf("yes") !== -1 ||
          !!(
            passEl.querySelector &&
            passEl.querySelector("i.icon-lock, .icon-lock")
          );
      }
      var distText = distEl ? String(distEl.textContent || "").trim() : "";
      var distanceKm = parseNativeDistanceKm(distText);
      var coords = FLAG_COORDS[flag] || FLAG_COORDS.un;
      rooms.push({
        id:
          "dom-" +
          i +
          "-" +
          name.toLowerCase().replace(/\s+/g, "_").slice(0, 40),
        name: name,
        flag: flag || "un",
        players: players,
        max: max || Math.max(players, 2),
        locked: locked,
        lat: coords[0],
        lng: coords[1],
        distanceKm: isNaN(distanceKm) ? null : distanceKm,
        distanceLabel: distText || null,
        _rowIndex: i,
      });
      row.dataset.starRoomId = rooms[rooms.length - 1].id;
    }
    return rooms;
  }

  function ensureNativeRoomFiltersOn() {
    try {
      var hooks = ["fil-pass", "fil-full", "fil-empty"];
      for (var i = 0; i < hooks.length; i++) {
        var el = document.querySelector(
          '.roomlist-view [data-hook="' + hooks[i] + '"]',
        );
        if (!el) continue;
        // HaxBall bool: icon-ok = show those rooms, icon-cancel = hide
        var icon = el.querySelector("i");
        if (icon && icon.classList.contains("icon-cancel")) {
          try {
            clickEl(el);
          } catch (eClick) {}
        }
      }
    } catch (e) {}
    try {
      var rows = document.querySelectorAll(
        '.roomlist-view tbody[data-hook="list"] tr.search-hidden, .roomlist-view tbody[data-hook="list"] tr.fav-hidden',
      );
      for (var r = 0; r < rows.length; r++) {
        rows[r].classList.remove("search-hidden");
        rows[r].classList.remove("fav-hidden");
      }
    } catch (e2) {}
  }

  var roomsRefreshTimer = 0;
  var roomsRefreshAttempts = 0;

  function pushRooms(force) {
    var rooms = scrapeRooms();
    if (rooms === null) {
      // Roomlist DOM not ready — never wipe Star UI; keep retrying
      if (force) {
        postToMenu({
          type: "star:rooms",
          rooms: null,
          ok: true,
          loading: true,
        });
        scheduleRoomsRetry();
      }
      return;
    }
    if (!rooms.length) {
      // Transient empty while HaxBall refreshes — don't clear a good list
      if (force) {
        postToMenu({
          type: "star:rooms",
          rooms: null,
          ok: true,
          loading: true,
        });
        scheduleRoomsRetry();
      }
      return;
    }
    var sig =
      rooms.length +
      ":" +
      rooms
        .map(function (r) {
          return (
            r.id + "/" + r.players + "/" + r.max + "/" + (r.locked ? 1 : 0)
          );
        })
        .join("|");
    if (!force && sig === lastRoomsSig) return;
    lastRoomsSig = sig;
    roomsRefreshAttempts = 0;
    if (roomsRefreshTimer) {
      clearTimeout(roomsRefreshTimer);
      roomsRefreshTimer = 0;
    }
    postToMenu({ type: "star:rooms", rooms: rooms, ok: true, loading: false });
  }

  function scheduleRoomsRetry() {
    if (roomsRefreshTimer) return;
    if (roomsRefreshAttempts >= 12) {
      roomsRefreshAttempts = 0;
      postToMenu({
        type: "star:rooms",
        rooms: null,
        ok: true,
        loading: false,
        stalled: true,
      });
      return;
    }
    roomsRefreshAttempts++;
    roomsRefreshTimer = setTimeout(
      function () {
        roomsRefreshTimer = 0;
        ensureNativeRoomFiltersOn();
        var rooms = scrapeRooms();
        if (rooms && rooms.length) {
          pushRooms(true);
          return;
        }
        if (roomsRefreshAttempts === 3 || roomsRefreshAttempts === 7) {
          var btn = document.querySelector(
            '.roomlist-view button[data-hook="refresh"]',
          );
          if (btn) clickEl(btn);
        }
        scheduleRoomsRetry();
      },
      350 + roomsRefreshAttempts * 120,
    );
  }

  function refreshNativeRooms() {
    ensureNativeRoomFiltersOn();
    roomsRefreshAttempts = 0;
    if (roomsRefreshTimer) {
      clearTimeout(roomsRefreshTimer);
      roomsRefreshTimer = 0;
    }
    var btn = document.querySelector(
      '.roomlist-view button[data-hook="refresh"]',
    );
    if (btn) clickEl(btn);
    // Immediate scrape in case list already has rows
    setTimeout(function () {
      pushRooms(true);
    }, 200);
    setTimeout(function () {
      pushRooms(true);
    }, 700);
    setTimeout(function () {
      pushRooms(true);
    }, 1400);
    setTimeout(function () {
      pushRooms(true);
    }, 2400);
    setTimeout(function () {
      pushRooms(true);
    }, 4000);
  }

  function findRowByJoin(data) {
    var list = document.querySelector('.roomlist-view tbody[data-hook="list"]');
    if (!list) return null;
    var id = data && (data.id || data.code);
    if (id) {
      var rowsByData = list.querySelectorAll("tr[data-star-room-id]");
      for (var d = 0; d < rowsByData.length; d++) {
        if (rowsByData[d].getAttribute("data-star-room-id") === String(id))
          return rowsByData[d];
      }
    }
    var name = data && data.name ? String(data.name).trim().toLowerCase() : "";
    if (!name) return null;
    var rows = list.querySelectorAll("tr");
    for (var i = 0; i < rows.length; i++) {
      var nameEl = rows[i].querySelector('[data-hook="name"]');
      var n = nameEl ? (nameEl.textContent || "").trim().toLowerCase() : "";
      if (n === name) return rows[i];
    }
    return null;
  }

  function joinRoom(data) {
    beginRoomTransition(15000);
    pendingPassword = data && data.password ? String(data.password) : "";
    pendingJoinName = data && data.name ? String(data.name) : null;
    var row = findRowByJoin(data);
    if (!row) {
      // Refresh once then retry
      refreshNativeRooms();
      setTimeout(function () {
        row = findRowByJoin(data);
        if (!row) return;
        clickEl(row);
        setTimeout(function () {
          var joinBtn = document.querySelector(
            '.roomlist-view button[data-hook="join"]',
          );
          clickEl(joinBtn || row);
          tryResolvePassword();
        }, 80);
      }, 900);
      return;
    }
    clickEl(row);
    setTimeout(function () {
      var joinBtn = document.querySelector(
        '.roomlist-view button[data-hook="join"]',
      );
      if (joinBtn) clickEl(joinBtn);
      else {
        try {
          row.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
        } catch (e) {
          clickEl(row);
        }
      }
      tryResolvePassword();
    }, 60);
  }

  function tryResolvePassword() {
    if (!pendingPassword && pendingPassword !== "") return;
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      var view = document.querySelector(".room-password-view");
      if (view) {
        clearInterval(timer);
        var input = view.querySelector('input[data-hook="input"]');
        var ok = view.querySelector('button[data-hook="ok"]');
        fillInput(input, pendingPassword || "");
        clickEl(ok);
        pendingPassword = null;
        return;
      }
      if (
        document.querySelector(".room-view") ||
        document.querySelector(".game-view")
      ) {
        clearInterval(timer);
        pendingPassword = null;
        return;
      }
      if (tries > 40) {
        clearInterval(timer);
        pendingPassword = null;
      }
    }, 100);
  }

  function setToggleButton(btn, wantListed) {
    if (!btn) return;
    // Native label: "Show in room list: Yes|No" (en=true => unlisted => No)
    var text = (btn.textContent || "").toLowerCase();
    var currentlyListed =
      /:\s*yes\b/.test(text) || /:\s*sí\b/.test(text) || /:\s*si\b/.test(text);
    var currentlyUnlisted = /:\s*no\b/.test(text);
    if (!currentlyListed && !currentlyUnlisted) {
      currentlyListed = text.indexOf("yes") !== -1;
    }
    if (wantListed !== currentlyListed) clickEl(btn);
  }

  /** Inject a page-world listener (content scripts cannot call HaxBall closures). */
  // Page-world live apply — shared by bridge install + re-inject for old sessions
  var STAR_APPLY_LIVE_SRC = [
    "window.__starApplyLive=function(p){",
    '  if(!p||typeof p!=="object")return false;',
    '  if(typeof m==="undefined"||!m||!m.j)return false;',
    "  var j=m.j;",
    "  function setB(prop,key,val){",
    '    if(typeof val!=="boolean")return;',
    "    try{j[prop].ha(!!val);}catch(e){}",
    '    try{localStorage.setItem(key,val?"1":"0");}catch(e2){}',
    "  }",
    "  function setN(prop,key,val){",
    "    if(val==null||isNaN(Number(val)))return;",
    "    var n=Number(val);",
    "    try{j[prop].ha(n);}catch(e){}",
    "    try{localStorage.setItem(key,String(n));}catch(e2){}",
    "  }",
    "  function setS(prop,key,val){",
    "    if(val==null)return;",
    "    try{j[prop].ha(val);}catch(e){}",
    "    try{localStorage.setItem(key,String(val));}catch(e2){}",
    "  }",
    "  try{",
    '    if(p.viewMode!=null){try{j.Rd.ha(p.viewMode|0);}catch(e){} try{localStorage.setItem("view_mode",String(p.viewMode|0));}catch(e2){}}',
    '    if(p.fpsIndex!=null)setN("Rh","fps_limit",p.fpsIndex);',
    '    if(p.resolutionScale!=null)setN("Mi","resolution_scale",p.resolutionScale);',
    '    if(p.soundVolume!=null)setN("Yi","sound_volume",p.soundVolume);',
    '    if(typeof p.soundMain==="boolean")setB("xe","sound_main",p.soundMain);',
    '    if(typeof p.soundChat==="boolean")setB("Xi","sound_chat",p.soundChat);',
    '    if(typeof p.soundHighlight==="boolean")setB("Nm","sound_highlight",p.soundHighlight);',
    '    if(typeof p.soundCrowd==="boolean")setB("Mm","sound_crowd",p.soundCrowd);',
    '    if(typeof p.teamColors==="boolean")setB("Vm","team_colors",p.teamColors);',
    '    if(typeof p.showAvatars==="boolean")setB("Km","show_avatars",p.showAvatars);',
    '    if(typeof p.showNames==="boolean")setB("Lm","show_names",p.showNames);',
    '    if(typeof p.imageSmoothing==="boolean")setB("Qm","image_smoothing",p.imageSmoothing);',
    '    if(typeof p.showPlayerIndicator==="boolean")setB("Rm","show_player_indicator",p.showPlayerIndicator);',
    '    if(typeof p.simpleLines==="boolean")setB("Sm","simple_lines",p.simpleLines);',
    '    if(typeof p.ultraSimpleLines==="boolean")setB("Xm","ultra_simple_lines",p.ultraSimpleLines);',
    '    if(typeof p.simpleField==="boolean")setB("Tm","simple_field",p.simpleField);',
    '    if(typeof p.showAnimations==="boolean")setB("Um","show_animations",p.showAnimations);',
    '    if(typeof p.viewportCulling==="boolean")setB("Wm","viewport_culling",p.viewportCulling);',
    '    if(typeof p.lowQualityCircles==="boolean")setB("Ym","low_quality_circles",p.lowQualityCircles);',
    '    if(typeof p.lowLatencyCanvas==="boolean")setB("li","low_latency_canvas",p.lowLatencyCanvas);',
    '    if(typeof p.showIndicators==="boolean")setB("Uk","show_indicators",p.showIndicators);',
    '    if(p.chatOpacity!=null)setN("Ih","chat_opacity",p.chatOpacity);',
    '    if(p.chatFocusHeight!=null)setN("Hh","chat_focus_height",p.chatFocusHeight);',
    '    if(p.chatBgMode!=null)setS("jk","chat_bg_mode",p.chatBgMode);',
    "    if(p.qualityMode!=null){",
    '      try{localStorage.setItem("quality_mode",String(p.qualityMode));}catch(e){}',
    "      try{window._hxdQualityMultiplier=Number(p.qualityMode)===1?1.0:0.9;}catch(e2){}",
    "    }",
    '    try{window.dispatchEvent(new Event("resize"));}catch(eR){}',
    "    return true;",
    "  }catch(eAll){return false;}",
    "};",
  ].join("");

  function injectPageWorldCreateBridge() {
    if (document.documentElement.getAttribute("data-star-page-bridge") === "1")
      return;
    document.documentElement.setAttribute("data-star-page-bridge", "1");
    var s = document.createElement("script");
    s.id = "star-page-create-bridge";
    // Page-world bridge. Content scripts cannot fire page listeners via
    // dispatchEvent, so we also poll data-status=pending on the shared node.
    s.textContent = [
      "(function(){",
      "if(window.__starPageCreateBridge)return;",
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
      '    setErr(el,"bad_request");',
      "    return null;",
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
      "    if(pass){",
      '      pass.value=data&&data.password?String(data.password).substring(0,30):"";',
      '      pass.dispatchEvent(new Event("input",{bubbles:true}));',
      "    }",
      "    if(max){",
      "      var mp=Math.max(2,Math.min(20,(data&&data.maxPlayers)|0||12));",
      "      max.selectedIndex=mp-2;",
      '      max.dispatchEvent(new Event("change",{bubbles:true}));',
      "    }",
      "    if(unlisted){",
      '      var text=(unlisted.textContent||"").toLowerCase();',
      '      var listed=/:\\s*yes\\b/.test(text)||text.indexOf("yes")!==-1;',
      "      var want=!(data&&data.showInRoomList===false);",
      "      if(want!==listed)unlisted.click();",
      "    }",
      "    create.disabled=false;",
      '    create.removeAttribute("disabled");',
      "    create.click();",
      "    return true;",
      "  }catch(e){return false;}",
      "}",
      "function tryCreate(){",
      "  var req=readRequest();",
      "  if(!req)return true;",
      '  if(typeof window.__starCreateNativeRoom==="function"){',
      "    try{",
      "      window.__starCreateNativeRoom(req.data);",
      '      req.el.setAttribute("data-status","accepted");',
      '      try{req.el.removeAttribute("data-error");}catch(e){}',
      "      return true;",
      "    }catch(e){",
      '      setErr(req.el,"creator_threw");',
      "      return true;",
      "    }",
      "  }",
      "  if(fillNativeForm(req.data)){",
      '    req.el.setAttribute("data-status","accepted");',
      '    try{req.el.removeAttribute("data-error");}catch(e2){}',
      "    return true;",
      "  }",
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
      "      clearInterval(t);",
      "      busy=false;",
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
      "window.__starSetViewMode=function(v){",
      '  try{if(typeof m!=="undefined"&&m.j&&m.j.Rd){m.j.Rd.ha(v|0);return true;}}catch(e){}',
      '  try{localStorage.setItem("view_mode",String(v|0));}catch(e2){}',
      "  return false;",
      "};",
      STAR_APPLY_LIVE_SRC,
      "})();",
    ].join("");
    (document.documentElement || document.head || document.body).appendChild(s);
    try {
      s.remove();
    } catch (eRem) {}
  }

  function injectLiveApplyBridge() {
    injectPageWorldCreateBridge();
    // Always re-inject __starApplyLive so old sessions (bridge without it) get it
    try {
      var s = document.createElement("script");
      s.textContent = "(function(){" + STAR_APPLY_LIVE_SRC + "})();";
      (document.documentElement || document.head || document.body).appendChild(
        s,
      );
      try {
        s.remove();
      } catch (eRem) {}
    } catch (eInj) {}
  }

  function fpsLimitToIndex(v) {
    var s = String(v == null ? "" : v)
      .toLowerCase()
      .trim();
    if (s === "unlimited" || s === "0" || s === "") return 0;
    var n = parseInt(s, 10);
    if (n === 30) return 1;
    if (n === 60) return 2;
    if (n === 75) return 3;
    if (n === 144) return 4;
    if (n === 240) return 5;
    // Already an index 0–5
    if (n >= 0 && n <= 5 && String(n) === s) return n;
    return 0;
  }

  function applyLiveGameSettings(patch) {
    if (!patch || typeof patch !== "object") return;
    injectLiveApplyBridge();
    try {
      var s = document.createElement("script");
      s.textContent =
        "try{window.__starApplyLive&&window.__starApplyLive(" +
        JSON.stringify(patch) +
        ")}catch(e){}";
      (document.documentElement || document.head || document.body).appendChild(
        s,
      );
      try {
        s.remove();
      } catch (eRm) {}
    } catch (eInj) {}
  }

  /**
   * Re-applies ALL settings currently in localStorage to the live game state.
   * Unlike __starApplyLive (page-world script, can't see the IIFE-scoped `m`),
   * this calls window.__hxdSyncAllSettingsFromStorage — defined FROM INSIDE
   * game-min-original.js's IIFE — which can reach m.j.*.ha() directly.
   * This is the authoritative live-apply path; call after applyConfig writes LS.
   * Debounced (~120ms) so slider drags don't spam sync/resize; skips when
   * starClientConfig signature is unchanged unless force=true.
   */
  var _syncTimer = 0;
  var _lastSyncSig = "";
  function syncGameSettingsFromStorage(force) {
    clearTimeout(_syncTimer);
    _syncTimer = setTimeout(function () {
      try {
        var sig = localStorage.getItem("starClientConfig") || "";
        try {
          sig += "|" + (localStorage.getItem("view_mode") || "");
          sig += "|" + (localStorage.getItem("resolution_scale") || "");
          sig += "|" + (localStorage.getItem("sound_volume") || "");
          sig += "|" + (localStorage.getItem("fps_limit") || "");
          sig += "|" + (localStorage.getItem("player_keys") || "");
        } catch (eKeys) {}
        if (!force && sig === _lastSyncSig) return;
        _lastSyncSig = sig;
      } catch (e) {}
      try {
        var s = document.createElement("script");
        s.textContent =
          "try{window.__hxdSyncAllSettingsFromStorage&&window.__hxdSyncAllSettingsFromStorage()}catch(e){}";
        (
          document.documentElement ||
          document.head ||
          document.body
        ).appendChild(s);
        try {
          s.remove();
        } catch (eRem) {}
      } catch (eInj) {}
    }, 120);
  }

  function ensureNativeRoomRequestNode() {
    var request = document.getElementById("star-native-room-request");
    if (!request) {
      request = document.createElement("div");
      request.id = "star-native-room-request";
      request.style.display = "none";
      (document.body || document.documentElement).appendChild(request);
    }
    return request;
  }

  function failCreateRoom(request, reason) {
    restoreStarOverNative();
    endRoomTransition();
    postToMenu({
      type: "star:create-room-failed",
      reason:
        reason || (request && request.getAttribute("data-error")) || "unknown",
    });
    showMenu(true);
  }

  function createRoom(data) {
    // Single path: page-world HaxBall creator via shared DOM event.
    // Prefer window.__starCreateNativeRoom (installed at game boot).
    // Fallback: open native create form, fill fields, click Create.
    beginRoomTransition(120000);
    // Keep host token if present — do not force captcha by clearing it.
    ensureOverlay();
    setNativeHidden(true);
    injectPageWorldCreateBridge();

    var roomName = ((data && data.name) || "").trim() || "Star Room";
    if (roomName.length > 40) roomName = roomName.slice(0, 40);
    var maxPlayers = parseInt(data && data.maxPlayers, 10) || 12;
    if (maxPlayers < 2) maxPlayers = 2;
    if (maxPlayers > 20) maxPlayers = 20;
    var showInList = !(data && data.showInRoomList === false);
    var password = data && data.password ? String(data.password) : "";

    // Optional host token from Star UI import / explicit field
    if (data && data.hostCode) {
      try {
        localStorage.setItem("haxball_host_token", String(data.hostCode));
      } catch (eHost) {}
    }

    var request = ensureNativeRoomRequestNode();
    try {
      request.removeAttribute("data-error");
    } catch (eClr) {}
    request.textContent = JSON.stringify({
      name: roomName,
      password: password,
      maxPlayers: maxPlayers,
      showInRoomList: showInList,
    });
    request.setAttribute("data-status", "pending");
    document.dispatchEvent(new Event("star-native-room-create"));

    var poll = 0;
    var sawAccepted = false;
    var outcome = setInterval(function () {
      poll += 1;
      var status = "";
      var errReason = "";
      try {
        status = request.getAttribute("data-status") || "";
      } catch (eSt) {}
      try {
        errReason = request.getAttribute("data-error") || "";
      } catch (eEr) {}

      if (status === "error") {
        clearInterval(outcome);
        failCreateRoom(request, errReason || "native_error");
        return;
      }
      if (status === "accepted") sawAccepted = true;

      if (
        document.querySelector(".room-view") ||
        document.querySelector(".game-view")
      ) {
        clearInterval(outcome);
        try {
          request.setAttribute("data-status", "room");
        } catch (eR) {}
        postToMenu({ type: "star:create-room-done" });
        enterInGameUi();
        return;
      }

      var dialog = document.querySelector(".simple-dialog-view");
      var captcha = document.querySelector(
        'iframe[src*="recaptcha"], .g-recaptcha, iframe[src*="anchor"]',
      );
      if (dialog || captcha) {
        try {
          request.setAttribute("data-status", "captcha");
        } catch (eC) {}
        showVerifyMode(true);
        if (dialog) styleStarDialog(dialog);
        return;
      }

      // Only fail after a long wait with no acceptance and no dialog.
      if (poll >= 200 && !sawAccepted && status === "pending") {
        clearInterval(outcome);
        failCreateRoom(request, "timeout_pending");
        return;
      }
      // Accepted but stuck forever without captcha/room — fail late.
      if (poll >= 900 && sawAccepted) {
        clearInterval(outcome);
        failCreateRoom(request, "timeout_accepted");
      }
    }, 100);
  }

  function openStarConfig(section) {
    ensureOverlay();
    if (isInRoom()) {
      showModsOverlay(true);
    } else {
      showMenu(true);
    }
    postToMenu({ type: "star:open-config", section: section || null });
  }

  /** Native HaxBall settings are disabled — Space Config is the only settings UI. */
  function openNativeSettings() {
    openStarConfig("media");
  }

  function killNativeSettings() {
    try {
      var views = document.querySelectorAll(
        ".settings-view, .dialog.settings-view",
      );
      for (var i = 0; i < views.length; i++) {
        var closeBtn = views[i].querySelector('button[data-hook="close"]');
        if (closeBtn) clickEl(closeBtn);
        try {
          views[i].remove();
        } catch (eRm) {
          try {
            views[i].style.display = "none";
          } catch (eHide) {}
        }
      }
    } catch (e) {}
  }

  function blockNativeSettingsClicks() {
    document.addEventListener(
      "click",
      function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var btn = t.closest('button[data-hook="settings"]');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        try {
          e.stopImmediatePropagation();
        } catch (err) {}
        openStarConfig();
      },
      true,
    );
  }

  var _lastAppliedConfig = "";
  var _lastAppliedInputConfig = "";
  function applyConfig(config) {
    if (!config || typeof config !== "object") return;
    try {
      var cfgSig = "";
      try {
        cfgSig = JSON.stringify(config);
      } catch (eSig) {}
      if (cfgSig && cfgSig === _lastAppliedConfig) return;
      _lastAppliedConfig = cfgSig;
      try {
        localStorage.setItem(
          "starClientConfig",
          cfgSig || JSON.stringify(config),
        );
      } catch (eMirror) {}
      if (config.perf) {
        var map = {
          simplifiedLines: "simple_lines",
          curvesToLines: "ultra_simple_lines",
          viewportCulling: "viewport_culling",
          simplifiedField: "simple_field",
          lowQualityCircles: "low_quality_circles",
          hideAvatarsColors: "show_avatars",
          hideNames: "show_names",
          hideGoalAnims: "show_animations",
          hidePlayerIndicator: "show_player_indicator",
          hideChatIndicator: "show_indicators",
          inputBoost: "input_boost_enabled",
          highPriority: "high_priority",
          minInputDelay: "min_input_delay",
        };
        Object.keys(map).forEach(function (k) {
          if (typeof config.perf[k] === "boolean") {
            var lsKey = map[k];
            var val = config.perf[k];
            if (lsKey.indexOf("show_") === 0) val = !val;
            localStorage.setItem(lsKey, val ? "1" : "0");
          }
        });
        if (typeof config.perf.noImageSmoothing === "boolean") {
          localStorage.setItem(
            "image_smoothing",
            config.perf.noImageSmoothing ? "0" : "1",
          );
        }
      }
      if (config.media) {
        var m = config.media;
        // --- Sounds (HaxBall native keys) ---
        if (m.soundMaster != null) {
          var vol = Math.max(0, Math.min(100, Number(m.soundMaster))) / 100;
          localStorage.setItem("sound_volume", String(vol));
          localStorage.setItem("sound_main", vol > 0 ? "1" : "0");
        }
        if (m.soundChat != null) {
          var chatOn = Number(m.soundChat) > 0;
          localStorage.setItem("sound_chat", chatOn ? "1" : "0");
        }
        if (m.soundMention != null) {
          var mentOn = Number(m.soundMention) > 0;
          localStorage.setItem("sound_highlight", mentOn ? "1" : "0");
        }
        if (m.soundCrowd != null) {
          var crowdOn = Number(m.soundCrowd) > 0;
          localStorage.setItem("sound_crowd", crowdOn ? "1" : "0");
        }
        // Extra sliders stored for Space UI (no separate native channels)
        try {
          localStorage.setItem(
            "star_sound_kick",
            String(m.soundKickBall != null ? m.soundKickBall : 85),
          );
          localStorage.setItem(
            "star_sound_goal",
            String(m.soundGoal != null ? m.soundGoal : 100),
          );
          localStorage.setItem(
            "star_sound_join",
            String(m.soundJoin != null ? m.soundJoin : 60),
          );
          localStorage.setItem(
            "star_sound_leave",
            String(m.soundLeave != null ? m.soundLeave : 60),
          );
        } catch (eSnd) {}

        if (m.fpsLimit != null) {
          var fpsIdx = fpsLimitToIndex(m.fpsLimit);
          localStorage.setItem("fps_limit", String(fpsIdx));
        }
        if (m.resolutionScale != null) {
          var scalePct = Number(m.resolutionScale);
          if (!isNaN(scalePct)) {
            var scale = scalePct > 1 ? scalePct / 100 : scalePct;
            scale = Math.max(0.1, Math.min(1, scale));
            localStorage.setItem("resolution_scale", String(scale));
          }
        }
        if (m.quality != null) {
          var isHd = String(m.quality).toLowerCase() !== "performance";
          localStorage.setItem("quality_mode", isHd ? "1" : "0");
          window._hxdQualityMultiplier = isHd ? 1.0 : 0.9;
        }
        if (typeof m.canvasLowLatency === "boolean") {
          // Prefer user choice; Electron often paints black with low-latency
          localStorage.setItem(
            "low_latency_canvas",
            m.canvasLowLatency ? "1" : "0",
          );
        }
        if (typeof m.customTeamColors === "boolean") {
          localStorage.setItem("team_colors", m.customTeamColors ? "1" : "0");
        }
        if (m.viewportMode != null) {
          var VIEW_MAP = {
            dynamic: -1,
            restricted: 0,
            full1: 1,
            full125: 2,
            full15: 3,
            full175: 4,
            full2: 5,
            full225: 6,
            full25: 7,
          };
          var vmKey = String(m.viewportMode);
          var vm = VIEW_MAP[vmKey];
          if (vm == null) vm = -1;
          // Only sync camera when the *config* viewport actually changed.
          // Do not compare against live view_mode (digit keys / in-game zoom),
          // or volume/settings saves stomp the camera back to Full 1×.
          try {
            if (window.__hxdLastViewportMode !== vmKey) {
              window.__hxdLastViewportMode = vmKey;
              localStorage.setItem("view_mode", String(vm | 0));
              window.__hxdSyncCamera = true;
            }
          } catch (eVm) {}
        }
        if (m.chatOpacity != null) {
          var op = Math.max(0, Math.min(100, Number(m.chatOpacity))) / 100;
          // game uses 0–1; also honor transparency inverse if set
          if (m.chatTransparency != null) {
            op = Math.max(0, Math.min(1, 1 - Number(m.chatTransparency) / 100));
          }
          localStorage.setItem("chat_opacity", String(op));
        } else if (m.chatTransparency != null) {
          var opT = Math.max(
            0,
            Math.min(1, 1 - Number(m.chatTransparency) / 100),
          );
          localStorage.setItem("chat_opacity", String(opT));
        }
        if (m.chatFocusHeight != null) {
          // UI 20–80 → px roughly 80–280
          var fh = Math.round(40 + (Number(m.chatFocusHeight) / 100) * 200);
          localStorage.setItem("chat_focus_height", String(fh));
        }
        if (m.chatBgWidth != null) {
          var bgMode = String(m.chatBgWidth) === "compact" ? "compact" : "full";
          localStorage.setItem("chat_bg_mode", bgMode);
        }
        if (m.scoreboardTransparency != null) {
          applyScoreboardTransparency(m.scoreboardTransparency);
        }
      }
      if (config.multi && config.multi.hostToken != null) {
        localStorage.setItem(
          "haxball_host_token",
          String(config.multi.hostToken || ""),
        );
      }
      if (config.input) {
        var inputSig = "";
        try {
          inputSig = JSON.stringify(config.input);
        } catch (eInputSig) {}
        if (!inputSig || inputSig !== _lastAppliedInputConfig) {
          _lastAppliedInputConfig = inputSig;
          applyInputBinds(config.input);
        }
      }
      if (config.chat && Array.isArray(config.chat.shortcuts)) {
        try {
          localStorage.setItem(
            "star_chat_shortcuts",
            JSON.stringify(config.chat.shortcuts),
          );
        } catch (eChat) {}
      }
      if (config.misc) {
        if (config.misc.language) {
          localStorage.setItem(
            "haxball_language",
            String(config.misc.language),
          );
          try {
            if (window.__tSetLang)
              window.__tSetLang(String(config.misc.language));
            else if (window.HaxTranslate && window.HaxTranslate.setLang) {
              window.HaxTranslate.setLang(String(config.misc.language));
            }
          } catch (eLang) {}
        }
        if (typeof config.misc.classicScoreboard === "boolean") {
          localStorage.setItem(
            "star_classic_scoreboard",
            config.misc.classicScoreboard ? "1" : "0",
          );
        }
        if (typeof config.misc.zeroZoom === "boolean") {
          localStorage.removeItem("star_zero_zoom");
          if (config.misc.zeroZoom) localStorage.removeItem("hax_zero_zoom");
          else localStorage.setItem("hax_zero_zoom", "0");
        }
        if (typeof config.misc.noText === "boolean") {
          localStorage.setItem("star_no_text", config.misc.noText ? "1" : "0");
          document.documentElement.classList.toggle(
            "star-no-text",
            !!config.misc.noText,
          );
        }
        if (typeof config.misc.showVerifiedBadge === "boolean") {
          localStorage.setItem(
            "star_show_verified",
            config.misc.showVerifiedBadge ? "1" : "0",
          );
          document.documentElement.classList.toggle(
            "star-hide-verified",
            !config.misc.showVerifiedBadge,
          );
        }
        if (config.misc.avatarImage) {
          applyAvatar(config.misc.avatarImage);
        } else if (
          config.misc &&
          Object.prototype.hasOwnProperty.call(config.misc, "avatarImage")
        ) {
          applyAvatar("");
        }
        if (typeof config.misc.avatarDisabled === "boolean") {
          localStorage.setItem(
            "star_avatar_disabled",
            config.misc.avatarDisabled ? "1" : "0",
          );
          localStorage.setItem(
            "hxd_avatar_disabled",
            config.misc.avatarDisabled ? "1" : "0",
          );
          document.documentElement.classList.toggle(
            "star-avatar-disabled",
            !!config.misc.avatarDisabled,
          );
        }
        applyAvatarBorderCss(config.misc);
      }
      if (config.look) {
        applyLookTheme(config.look);
      }
      window.dispatchEvent(
        new CustomEvent("star-config-applied", { detail: config }),
      );
      syncNativeScoreboardVisibility();
      // Authoritative live re-sync: re-reads everything we just wrote to
      // localStorage and pushes it into the running game's m.j.* state.
      // (No applyLiveGameSettings / no unconditional resize — sync handles both.)
      syncGameSettingsFromStorage();
    } catch (e) {}
  }

  function setViewModeLive(mode) {
    var v = mode | 0;
    try {
      localStorage.setItem("view_mode", String(v));
    } catch (eLs) {}
    window.__hxdSyncCamera = true;
    syncGameSettingsFromStorage(true);
  }

  function applyScoreboardTransparency(pct) {
    var n = Math.max(0, Math.min(100, Number(pct) || 0));
    try {
      localStorage.setItem("star_scoreboard_transparency", String(n));
    } catch (e) {}
    var opacity = Math.max(0.15, 1 - n / 100);
    ensureStarLookStyle();
    var el = document.getElementById("star-look-theme");
    if (!el) return;
    var css = el.textContent || "";
    css = css.replace(/\/\*scoreboard\*\/[\s\S]*?\/\*\/scoreboard\*\//g, "");
    css +=
      "/*scoreboard*/html:not(.star-hide-native-score) .bar-container .bar," +
      "html:not(.star-hide-native-score) .bar-container .scoreboard{opacity:" +
      opacity +
      "!important;}/*/scoreboard*/";
    el.textContent = css;
  }

  function ensureStarLookStyle() {
    var el = document.getElementById("star-look-theme");
    if (el) return el;
    el = document.createElement("style");
    el.id = "star-look-theme";
    (document.head || document.documentElement).appendChild(el);
    return el;
  }

  function applyLookTheme(look) {
    if (!look || typeof look !== "object") return;
    var presets = {
      star: {
        bg: "#0b0c10",
        panel: "#14161d",
        surface: "#1b1e28",
        border: "#2a2e3a",
        text: "#ffffff",
        text2: "#9aa0b0",
      },
      midnight: {
        bg: "#07090f",
        panel: "#101522",
        surface: "#171d2c",
        border: "#273147",
        text: "#eef2ff",
        text2: "#8b95ad",
      },
      forest: {
        bg: "#08110c",
        panel: "#101a14",
        surface: "#17241c",
        border: "#274033",
        text: "#ecfff4",
        text2: "#8fb39a",
      },
    };
    var themeId = String(look.themeId || "star");
    var colors = null;
    if (themeId === "custom" && look.customTheme) {
      colors = look.customTheme;
    } else if (presets[themeId]) {
      colors = presets[themeId];
    } else if (look.customTheme && themeId === look.customTheme.name) {
      colors = look.customTheme;
    } else {
      colors = presets.star;
    }
    try {
      localStorage.setItem("haxball-theme", "dark");
      document.documentElement.setAttribute("data-theme", "dark");
      if (window.HaxThemes && typeof window.HaxThemes.apply === "function") {
        window.HaxThemes.apply("dark");
      }
    } catch (eTh) {}
    if (look.customTheme) {
      try {
        localStorage.setItem(
          "star_custom_theme",
          JSON.stringify(look.customTheme),
        );
      } catch (eCt) {}
    }
    try {
      localStorage.setItem("star_look_theme_id", themeId);
    } catch (eId) {}

    var c = colors || presets.star;
    var el = ensureStarLookStyle();
    var base =
      ":root{" +
      "--theme-bg-primary:" +
      (c.bg || "#0b0c10") +
      ";" +
      "--theme-bg-secondary:" +
      (c.panel || "#14161d") +
      ";" +
      "--theme-bg-tertiary:" +
      (c.surface || "#1b1e28") +
      ";" +
      "--theme-bg-hover:" +
      (c.surface || "#1b1e28") +
      ";" +
      "--theme-bg-selected:" +
      (c.panel || "#14161d") +
      ";" +
      "--theme-border:" +
      (c.border || "#2a2e3a") +
      ";" +
      "--theme-border-light:" +
      (c.border || "#2a2e3a") +
      ";" +
      "--theme-text-primary:" +
      (c.text || "#fff") +
      ";" +
      "--theme-text-secondary:" +
      (c.text2 || "#9aa0b0") +
      ";" +
      "--theme-text-muted:" +
      (c.text2 || "#9aa0b0") +
      ";" +
      "}";
    var wall = look.wallpaper != null ? String(look.wallpaper || "") : "";
    try {
      localStorage.setItem("star_wallpaper", wall);
    } catch (eWp) {}
    var wallCss = "";
    if (wall) {
      var safe = wall
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "");
      wallCss =
        "html,body,.roomlist-view,.game-view,.room-view{" +
        'background-image:url("' +
        safe +
        '")!important;' +
        "background-size:cover!important;background-position:center!important;" +
        "background-repeat:no-repeat!important;background-attachment:fixed!important;" +
        "}";
    }
    if (look.customBall && typeof look.customBall === "object") {
      setCustomBall(look.customBall);
    }
    var prevScore = "";
    var prev = el.textContent || "";
    var sm = prev.match(/\/\*scoreboard\*\/[\s\S]*?\/\*\/scoreboard\*\//);
    if (sm) prevScore = sm[0];
    var prevAv = "";
    var am = prev.match(/\/\*avatar\*\/[\s\S]*?\/\*\/avatar\*\//);
    if (am) prevAv = am[0];
    el.textContent = base + wallCss + prevScore + prevAv;
  }

  function applyAvatarBorderCss(misc) {
    if (!misc) return;
    var el = ensureStarLookStyle();
    var css = el.textContent || "";
    css = css.replace(/\/\*avatar\*\/[\s\S]*?\/\*\/avatar\*\//g, "");
    var w = Math.max(0, Math.min(8, Number(misc.avatarBorderWidth)));
    if (!w && misc.avatarBorderWidth !== 0) w = 3;
    var REDS = ["#e56f57", "#cf3c47", "#ff0000"];
    var BLUES = ["#4099ff", "#0076ff", "#0026ff"];
    function shadeOf(raw, fallback) {
      var n = parseInt(raw, 10);
      if (!isNaN(n) && n >= 0 && n <= 2) return n;
      return fallback;
    }
    var redShade = shadeOf(misc.avatarBorderRed, 1);
    var blueShade = shadeOf(misc.avatarBorderBlue, 1);
    var red = REDS[redShade] || REDS[1];
    var blue = BLUES[blueShade] || BLUES[1];
    var inset = misc.avatarBorderInward ? "inset " : "";
    var team = misc.avatarTeamDiff !== false;
    // Mirror zEro64's runtime keys so canvas rendering and UI use one source of truth.
    try {
      localStorage.setItem("hxd_avatar_team_border", team && w > 0 ? "1" : "0");
      localStorage.setItem(
        "hxd_avatar_team_border_width",
        String(Math.max(1, w || 1)),
      );
      localStorage.setItem(
        "hxd_avatar_team_border_inset",
        misc.avatarBorderInward ? "1" : "0",
      );
      localStorage.setItem("hxd_avatar_team_border_red", String(redShade));
      localStorage.setItem("hxd_avatar_team_border_blue", String(blueShade));
      localStorage.setItem("star_avatar_border_red", red);
      localStorage.setItem("star_avatar_border_blue", blue);
      window.__hxdAvatarTeamBorder = team && w > 0;
      window.__hxdAvatarTeamBorderWidth = Math.max(1, w || 1);
      window.__hxdAvatarTeamBorderInset = !!misc.avatarBorderInward;
      window.__hxdAvatarTeamBorderRed = redShade;
      window.__hxdAvatarTeamBorderBlue = blueShade;
      if (typeof window.__hxdInvalidateAvatarBorder === "function") {
        window.__hxdInvalidateAvatarBorder();
      }
    } catch (eStoreBorder) {}
    var part =
      "/*avatar*/" +
      "html.star-avatar-disabled .star-player-avatar," +
      "html.star-avatar-disabled img[data-star-avatar]{display:none!important;}" +
      (w > 0 && team
        ? '.player-list-item[data-team="1"] .star-player-avatar,' +
          ".player-list-item.red .star-player-avatar{box-shadow:" +
          inset +
          "0 0 0 " +
          w +
          "px " +
          red +
          "!important;}" +
          '.player-list-item[data-team="2"] .star-player-avatar,' +
          ".player-list-item.blue .star-player-avatar{box-shadow:" +
          inset +
          "0 0 0 " +
          w +
          "px " +
          blue +
          "!important;}"
        : "") +
      "html.star-hide-verified .star-verified-badge{display:none!important;}" +
      "/*/avatar*/";
    el.textContent = css + part;
  }

  function normalizeKeyCode(code) {
    if (code == null || code === "") return "";
    var c = String(code).trim();
    if (!c) return "";
    // Invalid defaults used KeyF1 — real KeyboardEvent.code is F1
    var keyF = /^Key(F\d{1,2})$/i.exec(c);
    if (keyF) {
      var fpart = keyF[1];
      return "F" + String(fpart).replace(/^F/i, "");
    }
    if (c.length === 1) {
      var ch = c.toUpperCase();
      if (/[A-Z]/.test(ch)) return "Key" + ch;
      if (/[0-9]/.test(ch)) return "Digit" + ch;
    }
    if (c === " " || c === "Spacebar") return "Space";
    if (c === "Esc") return "Escape";
    if (c === "Up") return "ArrowUp";
    if (c === "Down") return "ArrowDown";
    if (c === "Left") return "ArrowLeft";
    if (c === "Right") return "ArrowRight";
    return c;
  }

  function toCodes(v) {
    if (Array.isArray(v)) {
      var seen = {};
      var out = [];
      for (var i = 0; i < v.length; i++) {
        var s = normalizeKeyCode(v[i] != null ? String(v[i]) : "");
        if (s && !seen[s]) {
          seen[s] = 1;
          out.push(s);
        }
      }
      return out;
    }
    if (typeof v === "string" && v) {
      var one = normalizeKeyCode(v);
      return one ? [one] : [];
    }
    return [];
  }

  function applyInputBinds(input) {
    if (!input || typeof input !== "object") return;
    var normalized = {};
    var fields = [
      "camDynamic",
      "camRestricted",
      "camFull1",
      "camFull125",
      "camFull15",
      "camFull175",
      "camFull2",
      "camFull225",
      "camFull25",
      "up",
      "down",
      "left",
      "right",
      "kick",
      "toggleChat",
      "focusChat",
      "viewModeNext",
      "viewModePrev",
      "toggleMenu",
      "toggleStadium120",
      "startMatch",
      "endMatch",
      "restartMatch",
    ];
    var fi;
    for (fi = 0; fi < fields.length; fi++) {
      normalized[fields[fi]] = toCodes(input[fields[fi]]);
    }
    // Sanitize binds that break chat / ESC
    normalized.focusChat = normalized.focusChat.filter(function (c) {
      return c !== "Enter";
    });
    normalized.toggleMenu = normalized.toggleMenu.filter(function (c) {
      return c !== "Escape";
    });
    normalized.toggleChat = normalized.toggleChat
      .map(function (c) {
        return c === "Tab" ? "KeyT" : c;
      })
      .filter(function (c, i, a) {
        return c && a.indexOf(c) === i;
      });

    var ACTION_MAP = {
      up: "Up",
      down: "Down",
      left: "Left",
      right: "Right",
      kick: "Kick",
      toggleChat: "ToggleChat",
      focusChat: "FocusChat",
      viewModeNext: "ViewModeNext",
      viewModePrev: "ViewModePrev",
      toggleStadium120: "ToggleStadium120",
      startMatch: "StartMatch",
      endMatch: "EndMatch",
      restartMatch: "RestartMatch",
      // ToggleMenu stays out of player_keys — Star overlay owns it via bridge
    };
    var map = {};
    var field, codes, ci, code, action;
    for (field in ACTION_MAP) {
      if (!Object.prototype.hasOwnProperty.call(ACTION_MAP, field)) continue;
      action = ACTION_MAP[field];
      codes = normalized[field] || [];
      for (ci = 0; ci < codes.length; ci++) {
        code = codes[ci];
        if (!code) continue;
        if (/^Mouse\d+$/i.test(code)) continue; // camera-only / not vanilla player_keys
        if (action === "FocusChat" && code === "Enter") continue;
        map[code] = action;
      }
    }
    // Movement has priority over camera/chat/menu conflicts. A secondary
    // action bound to W/A/S/D must never make the player immobile.
    var MOVE_ACTIONS = { up: "Up", down: "Down", left: "Left", right: "Right" };
    for (field in MOVE_ACTIONS) {
      if (!Object.prototype.hasOwnProperty.call(MOVE_ACTIONS, field)) continue;
      codes = normalized[field] || [];
      for (ci = 0; ci < codes.length; ci++) {
        if (codes[ci]) map[codes[ci]] = MOVE_ACTIONS[field];
      }
    }
    // Guarantee movement / kick defaults so WASD never gets wiped
    if (
      !Object.keys(map).some(function (c) {
        return map[c] === "Up";
      })
    ) {
      map.ArrowUp = "Up";
      map.KeyW = "Up";
    }
    if (
      !Object.keys(map).some(function (c) {
        return map[c] === "Down";
      })
    ) {
      map.ArrowDown = "Down";
      map.KeyS = "Down";
    }
    if (
      !Object.keys(map).some(function (c) {
        return map[c] === "Left";
      })
    ) {
      map.ArrowLeft = "Left";
      map.KeyA = "Left";
    }
    if (
      !Object.keys(map).some(function (c) {
        return map[c] === "Right";
      })
    ) {
      map.ArrowRight = "Right";
      map.KeyD = "Right";
    }
    if (
      !Object.keys(map).some(function (c) {
        return map[c] === "Kick";
      })
    ) {
      map.KeyX = "Kick";
      map.Space = "Kick";
      map.ControlLeft = "Kick";
      map.ControlRight = "Kick";
      map.ShiftLeft = "Kick";
      map.ShiftRight = "Kick";
      map.Numpad0 = "Kick";
    }
    try {
      localStorage.setItem("player_keys", JSON.stringify(map));
    } catch (ePk) {}
    try {
      localStorage.setItem("star_input_binds", JSON.stringify(normalized));
    } catch (eIn) {}
    // Soft-update kick for HUD without wiping multi-key Kick codes
    if (
      normalized.kick &&
      normalized.kick.length &&
      typeof applyKickKeyBind === "function"
    ) {
      try {
        applyKickKeyBind(normalized.kick[0], true);
      } catch (eKick) {}
    }
    // Force live reload via page-world sync inject (not content-script __haxAddPlayerKey)
    try {
      window.__hxdLastPk = "";
    } catch (ePkClr) {}
    try {
      var sPk = document.createElement("script");
      sPk.textContent = 'try{window.__hxdLastPk="";}catch(e){}';
      (document.documentElement || document.head || document.body).appendChild(
        sPk,
      );
      try {
        sPk.remove();
      } catch (eRemPk) {}
    } catch (eInjPk) {}
    syncGameSettingsFromStorage(true);
  }

  function readInputBinds() {
    try {
      var raw = localStorage.getItem("star_input_binds");
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          var out = {};
          var k;
          for (k in parsed) {
            if (Object.prototype.hasOwnProperty.call(parsed, k)) {
              out[k] = toCodes(parsed[k]);
            }
          }
          return out;
        }
      }
    } catch (e) {}
    try {
      var cfg = JSON.parse(localStorage.getItem("starClientConfig") || "{}");
      if (cfg && cfg.input) {
        var out2 = {};
        var k2;
        for (k2 in cfg.input) {
          if (Object.prototype.hasOwnProperty.call(cfg.input, k2)) {
            out2[k2] = toCodes(cfg.input[k2]);
          }
        }
        return out2;
      }
    } catch (e2) {}
    return null;
  }

  function codesInclude(codes, code) {
    return Array.isArray(codes) && codes.indexOf(code) !== -1;
  }

  function clickNativeHook(hook) {
    return pageWorldRoomClick(hook);
  }

  /** Page-world room actions — content-script clicks never reach HaxBall onclick. */
  function injectPageWorldRoomBridge() {
    if (document.documentElement.getAttribute("data-star-room-bridge") === "1")
      return;
    document.documentElement.setAttribute("data-star-room-bridge", "1");
    var s = document.createElement("script");
    s.id = "star-page-room-bridge";
    s.textContent = [
      "(function(){",
      "if(window.__starRoomBridge)return;",
      "window.__starRoomBridge=true;",
      "function qHook(hook){",
      '  return document.querySelector(".room-view button[data-hook=\\""+hook+"\\"]")||',
      '         document.querySelector("button[data-hook=\\""+hook+"\\"]");',
      "}",
      "function clickHook(hook){",
      "  var btn=qHook(hook);",
      "  if(!btn)return false;",
      '  try{btn.disabled=false;btn.removeAttribute("disabled");}catch(e){}',
      "  try{btn.click();return true;}catch(e2){return false;}",
      "}",
      "function setSelect(hook,value,index){",
      '  var sel=document.querySelector(".room-view [data-hook=\\""+hook+"\\"]")||',
      '          document.querySelector("[data-hook=\\""+hook+"\\"]");',
      "  if(!sel)return false;",
      "  try{",
      '    if(index!=null&&index!==""&&!isNaN(Number(index)))sel.selectedIndex=Number(index)|0;',
      "    else if(value!=null)sel.value=String(value);",
      '    sel.dispatchEvent(new Event("change",{bubbles:true}));',
      "    return true;",
      "  }catch(e){return false;}",
      "}",
      "function joinTeam(idx){",
      '  var views=document.querySelectorAll(".room-view .teams .player-list-view");',
      "  var view=views&&views[idx|0];",
      "  if(!view)return false;",
      '  var join=view.querySelector("[data-hook=\\"join-btn\\"]");',
      "  if(!join)return false;",
      "  try{join.click();return true;}catch(e){return false;}",
      "}",
      "function stampPlayerIds(){",
      '  var items=document.querySelectorAll(".room-view .player-list-item");',
      "  var i;",
      "  for(i=0;i<items.length;i++){",
      "    var item=items[i];",
      '    if(item.getAttribute("data-player-id"))continue;',
      "    var fn=item.ondragstart;",
      '    if(typeof fn!=="function")continue;',
      "    var captured=null;",
      "    try{",
      "      fn.call(item,{",
      '        dataTransfer:{setData:function(k,v){if(k==="player")captured=v;},effectAllowed:"all"},',
      "        preventDefault:function(){}",
      "      });",
      "    }catch(eS){}",
      '    if(captured!=null&&captured!=="")item.setAttribute("data-player-id",String(captured));',
      "  }",
      "}",
      "function movePlayer(pid,idx){",
      "  stampPlayerIds();",
      '  pid=String(pid||"");',
      "  if(!pid)return false;",
      '  var views=document.querySelectorAll(".room-view .teams .player-list-view");',
      "  var view=views&&views[idx|0];",
      "  if(!view)return false;",
      "  try{",
      '    var dt={getData:function(t){return t==="player"?pid:"";},types:["player"],setData:function(){},effectAllowed:"move",dropEffect:"move"};',
      "    var ev={preventDefault:function(){},stopPropagation:function(){},dataTransfer:dt};",
      '    if(typeof view.ondragover==="function")try{view.ondragover(ev);}catch(eO){}',
      '    if(typeof view.ondrop==="function"){view.ondrop(ev);return true;}',
      "    return false;",
      "  }catch(eM){return false;}",
      "}",
      "function drain(){",
      "  stampPlayerIds();",
      '  var el=document.getElementById("star-room-action");',
      '  if(!el||el.getAttribute("data-status")!=="pending")return;',
      '  var kind=el.getAttribute("data-kind")||"click";',
      '  var hook=el.getAttribute("data-hook")||"";',
      '  var value=el.getAttribute("data-value");',
      '  var index=el.getAttribute("data-index");',
      '  var pid=el.getAttribute("data-player")||"";',
      "  var ok=false;",
      "  try{",
      '    if(kind==="select")ok=setSelect(hook,value,index);',
      '    else if(kind==="join-team")ok=joinTeam(index);',
      '    else if(kind==="move-player")ok=movePlayer(pid,index);',
      "    else ok=clickHook(hook);",
      "  }catch(eAll){ok=false;}",
      '  el.setAttribute("data-status",ok?"done":"error");',
      "}",
      "setInterval(drain,250);",
      "setInterval(stampPlayerIds,1000);",
      "try{",
      "  var mo=new MutationObserver(drain);",
      '  mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:["data-status","data-kind","data-hook","data-player","data-index","data-value"]});',
      "}catch(eMo){}",
      "})();",
    ].join("");
    try {
      (document.documentElement || document.head || document.body).appendChild(
        s,
      );
    } catch (eApp) {}
    try {
      s.remove();
    } catch (eRm) {}
  }

  function ensureRoomActionNode() {
    var el = document.getElementById("star-room-action");
    if (el) return el;
    el = document.createElement("div");
    el.id = "star-room-action";
    el.setAttribute("hidden", "true");
    el.style.cssText =
      "display:none!important;position:absolute;left:-99999px;width:1px;height:1px;";
    try {
      (document.documentElement || document.body).appendChild(el);
    } catch (e) {}
    return el;
  }

  function pageWorldRoomClick(hook) {
    injectPageWorldRoomBridge();
    var el = ensureRoomActionNode();
    if (!el || !hook) return false;
    el.setAttribute("data-kind", "click");
    el.setAttribute("data-hook", String(hook));
    el.removeAttribute("data-value");
    el.removeAttribute("data-index");
    el.setAttribute("data-status", "pending");
    // Fallback: also try content-script click (works on some Chromium builds)
    try {
      var btn =
        document.querySelector('.room-view button[data-hook="' + hook + '"]') ||
        document.querySelector('button[data-hook="' + hook + '"]');
      if (btn) clickEl(btn);
    } catch (e) {}
    return true;
  }

  function pageWorldRoomSelect(hook, value) {
    injectPageWorldRoomBridge();
    var el = ensureRoomActionNode();
    if (!el || !hook) return false;
    el.setAttribute("data-kind", "select");
    el.setAttribute("data-hook", String(hook));
    el.setAttribute("data-value", value != null ? String(value) : "");
    // Prefer selectedIndex when value is numeric option text
    var idx = "";
    try {
      var sel = document.querySelector('.room-view [data-hook="' + hook + '"]');
      if (sel && sel.options) {
        var i;
        for (i = 0; i < sel.options.length; i++) {
          if (
            String(sel.options[i].value) === String(value) ||
            String(sel.options[i].textContent) === String(value)
          ) {
            idx = String(i);
            break;
          }
        }
      }
    } catch (eIdx) {}
    if (idx !== "") el.setAttribute("data-index", idx);
    else el.removeAttribute("data-index");
    el.setAttribute("data-status", "pending");
    return true;
  }

  function pageWorldJoinTeam(index) {
    injectPageWorldRoomBridge();
    var el = ensureRoomActionNode();
    if (!el) return false;
    el.setAttribute("data-kind", "join-team");
    el.removeAttribute("data-hook");
    el.removeAttribute("data-value");
    el.removeAttribute("data-player");
    el.setAttribute("data-index", String(index | 0));
    el.setAttribute("data-status", "pending");
    return true;
  }

  function pageWorldMovePlayer(playerId, teamIndex) {
    injectPageWorldRoomBridge();
    var el = ensureRoomActionNode();
    if (!el) return false;
    el.setAttribute("data-kind", "move-player");
    el.removeAttribute("data-hook");
    el.removeAttribute("data-value");
    el.setAttribute("data-player", String(playerId || ""));
    el.setAttribute("data-index", String(teamIndex | 0));
    el.setAttribute("data-status", "pending");
    return true;
  }

  function focusChatInput(toggle) {
    try {
      var input = document.querySelector(
        '.chatbox-view input[data-hook="input"]',
      );
      if (!input) return;
      if (toggle) {
        if (document.activeElement === input) {
          input.blur();
          var gv = document.querySelector(".game-view");
          if (gv) gv.focus();
        } else {
          input.focus();
        }
      } else {
        input.focus();
      }
    } catch (e) {}
  }

  function cycleViewMode(dir) {
    var order = [-1, 0, 1, 2, 3, 4, 5, 6, 7];
    var cur = -1;
    try {
      cur = parseInt(localStorage.getItem("view_mode"), 10);
      if (isNaN(cur)) cur = -1;
    } catch (e) {}
    var idx = order.indexOf(cur);
    if (idx < 0) idx = 0;
    idx = (idx + (dir < 0 ? -1 : 1) + order.length) % order.length;
    setViewModeLive(order[idx]);
  }

  function installInputBindsHandler() {
    if (window.__starInputBindsInstalled) return;
    window.__starInputBindsInstalled = true;
    var CAM_MAP = {
      camDynamic: -1,
      camRestricted: 0,
      camFull1: 1,
      camFull125: 2,
      camFull15: 3,
      camFull175: 4,
      camFull2: 5,
      camFull225: 6,
      camFull25: 7,
    };
    document.addEventListener(
      "keydown",
      function (e) {
        if (!e || !e.code) return;
        // Never steal Escape — room ESC / menu owns it
        if (e.code === "Escape" || e.key === "Escape") return;
        // Never steal Enter/Tab inside chat or any text field (breaks sending messages)
        var tag = (e.target && e.target.tagName) || "";
        var inField =
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          (e.target && e.target.isContentEditable);
        if (inField) return;
        if (e.target && e.target.closest && e.target.closest(".chatbox-view"))
          return;

        var binds = readInputBinds();
        if (!binds || typeof binds !== "object") return;
        var code = e.code;
        var k;
        var isMovementCode =
          codesInclude(binds.up, code) ||
          codesInclude(binds.down, code) ||
          codesInclude(binds.left, code) ||
          codesInclude(binds.right, code);
        // Star-only camera presets (not in vanilla player_keys)
        for (k in CAM_MAP) {
          if (
            !isMovementCode &&
            Object.prototype.hasOwnProperty.call(CAM_MAP, k) &&
            codesInclude(binds[k], code)
          ) {
            e.preventDefault();
            e.stopPropagation();
            setViewModeLive(CAM_MAP[k]);
            return;
          }
        }
        // ToggleMenu: Star mods overlay (keep out of player_keys)
        if (!isMovementCode && codesInclude(binds.toggleMenu, code)) {
          e.preventDefault();
          e.stopPropagation();
          if (isInRoom()) {
            if (modsOverlayOpen) postToMenu({ type: "star:escape" });
            else showModsOverlay(true);
          } else {
            clickNativeHook("menu");
          }
          return;
        }
        // All other actions (StartMatch, ViewMode*, ToggleChat, etc.) go via player_keys → W.xl
      },
      true,
    );
  }

  function openExternalUrl(url) {
    if (!url) return;
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://127.0.0.1:5483/open-external", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({ url: String(url) }));
      return;
    } catch (e) {}
    try {
      window.open(String(url), "_blank");
    } catch (e2) {}
  }

  function rehydrateStarConfigFromLs() {
    try {
      var raw = localStorage.getItem("starClientConfig");
      if (!raw) return;
      var cfg = JSON.parse(raw);
      if (cfg && typeof cfg === "object") {
        if (cfg.input && typeof cfg.input === "object") {
          if (cfg.input.focusChat === "Enter") cfg.input.focusChat = "";
          if (cfg.input.toggleMenu === "Escape") cfg.input.toggleMenu = "";
          if (cfg.input.toggleChat === "Tab") cfg.input.toggleChat = "KeyT";
          var ik;
          for (ik in cfg.input) {
            if (!Object.prototype.hasOwnProperty.call(cfg.input, ik)) continue;
            cfg.input[ik] = toCodes(cfg.input[ik]);
          }
        }
        applyConfig(cfg);
      }
    } catch (e) {}
  }

  function applyHostToken(token) {
    try {
      localStorage.setItem("haxball_host_token", String(token || ""));
    } catch (e) {}
  }

  function applyMultiAuth(payload) {
    try {
      var auth = null;
      if (payload && typeof payload === "object") {
        auth = payload.auth || payload.key || null;
      } else if (payload) {
        // Legacy: id only — resolve from starClientConfig
        try {
          var cfg = JSON.parse(
            localStorage.getItem("starClientConfig") || "{}",
          );
          var accs = (cfg.multi && cfg.multi.accounts) || [];
          for (var i = 0; i < accs.length; i++) {
            if (accs[i] && accs[i].id === payload) {
              auth = accs[i].auth;
              break;
            }
          }
        } catch (eRes) {}
        if (!auth) auth = payload;
      }
      if (auth) localStorage.setItem("player_auth_key", String(auth));
    } catch (e) {}
  }

  function applyAvatar(image) {
    try {
      if (image) {
        var src = String(image);
        var isGif =
          src.indexOf("data:image/gif") === 0 || /\.gif(\?|$)/i.test(src);
        if (isGif && !window.__starIsPlus) {
          return;
        }
        localStorage.setItem("star_avatar_image", src);
        window.__starAvatarImage = src;
        if (typeof window.__starInvalidateAvatarCache === "function") {
          window.__starInvalidateAvatarCache();
        }
      } else {
        localStorage.removeItem("star_avatar_image");
        window.__starAvatarImage = "";
        if (typeof window.__starInvalidateAvatarCache === "function") {
          window.__starInvalidateAvatarCache();
        }
      }
    } catch (e) {}
  }

  function injectPageWorldPlus(isPlus) {
    var on = !!isPlus;
    try {
      var s = document.createElement("script");
      s.textContent =
        "try{window.__starIsPlus=" +
        (on ? "true" : "false") +
        ";" +
        'try{localStorage.setItem("star_is_plus",' +
        (on ? '"1"' : '"0"') +
        ");}catch(e){}}catch(e){}";
      (document.documentElement || document.head || document.body).appendChild(
        s,
      );
      try {
        s.remove();
      } catch (eRm) {}
    } catch (eInj) {}
  }

  function applyPlusStatus(isPlus) {
    var on = !!isPlus;
    window.__starIsPlus = on;
    try {
      localStorage.setItem("star_is_plus", on ? "1" : "0");
    } catch (e) {}
    injectPageWorldPlus(on);
    if (!on) {
      window.__starAvatarHat = "none";
      window.__starAvatarAccessory = "none";
      window.__starAvatarPet = "none";
      window.__starAvatarFrame = "none";
      // Force runtime off (keep prefEnabled for when Plus returns).
      try {
        var soft = null;
        try {
          soft = window.__starCustomBall;
        } catch (eSoft) {
          soft = null;
        }
        if (!soft) {
          try {
            var rawSoft = localStorage.getItem("star_custom_ball");
            if (rawSoft) soft = JSON.parse(rawSoft);
          } catch (eParseSoft) {}
        }
        if (soft && typeof soft === "object") {
          setCustomBall(
            Object.assign({}, soft, {
              enabled: false,
              prefEnabled:
                soft.prefEnabled != null ? !!soft.prefEnabled : !!soft.enabled,
            }),
          );
        } else {
          setCustomBall({ enabled: false, prefEnabled: false });
        }
      } catch (eBallSoft) {}
    } else {
      try {
        var h = localStorage.getItem("starAvatarHat");
        var a = localStorage.getItem("starAvatarAccessory");
        var p = localStorage.getItem("starAvatarPet");
        var f = localStorage.getItem("starAvatarFrame");
        if (h) window.__starAvatarHat = h;
        if (a) window.__starAvatarAccessory = a;
        if (p) window.__starAvatarPet = p;
        if (f) window.__starAvatarFrame = f;
      } catch (eRest) {}
      try {
        var rawBall = localStorage.getItem("star_custom_ball");
        var ballPref = rawBall ? JSON.parse(rawBall) : null;
        var ballImg = localStorage.getItem("star_custom_ball_image");
        if (ballPref && typeof ballPref === "object") {
          if (ballImg && !ballPref.image) ballPref.image = ballImg;
          if (ballPref.prefEnabled != null)
            ballPref.enabled = !!ballPref.prefEnabled;
          setCustomBall(ballPref);
        }
      } catch (eBallRest) {}
    }
  }

  function applyAvatarHat(hatId) {
    var id = String(hatId || "none");
    if (id === "beanie") id = "straw";
    if (id !== "none" && !window.__starIsPlus) {
      id = "none";
    }
    window.__starAvatarHat = id;
    try {
      localStorage.setItem("starAvatarHat", id);
    } catch (e) {}
  }

  function applyAvatarAccessory(accId) {
    var id = String(accId || "none");
    if (id !== "none" && !window.__starIsPlus) {
      id = "none";
    }
    window.__starAvatarAccessory = id;
    try {
      localStorage.setItem("starAvatarAccessory", id);
    } catch (e) {}
  }

  function applyAvatarPet(petId) {
    var id = String(petId || "none");
    if (id !== "none" && !window.__starIsPlus) {
      id = "none";
    }
    window.__starAvatarPet = id;
    try {
      localStorage.setItem("starAvatarPet", id);
    } catch (e) {}
  }

  function applyAvatarFrame(frameId) {
    var id = String(frameId || "none");
    if (id !== "none" && !window.__starIsPlus) {
      id = "none";
    }
    window.__starAvatarFrame = id;
    try {
      localStorage.setItem("starAvatarFrame", id);
    } catch (e) {}
  }

  function installChatShortcutExpander() {
    if (window.__starChatExpandInstalled) return;
    window.__starChatExpandInstalled = true;
    document.addEventListener(
      "keydown",
      function (e) {
        if (e.key !== "Enter") return;
        var el = e.target;
        if (!el || el.getAttribute("data-hook") !== "input") return;
        if (!el.closest || !el.closest(".chatbox-view")) return;
        var val = String(el.value || "");
        if (!val) return;
        var list = [];
        try {
          list = JSON.parse(
            localStorage.getItem("star_chat_shortcuts") || "[]",
          );
        } catch (eLs) {
          try {
            var cfg = JSON.parse(
              localStorage.getItem("starClientConfig") || "{}",
            );
            list = (cfg.chat && cfg.chat.shortcuts) || [];
          } catch (e2) {}
        }
        if (!list || !list.length) return;
        var trimmed = val.trim();
        for (var i = 0; i < list.length; i++) {
          var sc = list[i];
          if (!sc || !sc.trigger) continue;
          if (
            trimmed === sc.trigger ||
            trimmed.indexOf(sc.trigger + " ") === 0
          ) {
            var rest = trimmed.slice(sc.trigger.length);
            el.value = String(sc.expand || "") + rest;
            try {
              el.dispatchEvent(new Event("input", { bubbles: true }));
            } catch (eEv) {}
            break;
          }
        }
      },
      true,
    );
  }

  function findGameCanvas() {
    var now = Date.now();
    if (
      motionBlurSource &&
      motionBlurSource.isConnected &&
      now < motionBlurSourceUntil
    ) {
      return motionBlurSource;
    }
    var best = null;
    var bestArea = 0;
    try {
      var list = document.querySelectorAll(
        ".game-view canvas, .room-view canvas",
      );
      if (!list.length) list = document.querySelectorAll("canvas");
      for (var i = 0; i < list.length; i++) {
        var canvas = list[i];
        if (canvas === motionBlurCanvas || canvas === motionBlurPrev) continue;
        if (!(canvas.width > 100) || !(canvas.height > 100)) continue;
        var rect = canvas.getBoundingClientRect();
        var area = rect.width * rect.height;
        if (area > bestArea && rect.width > 100 && rect.height > 100) {
          best = canvas;
          bestArea = area;
          motionBlurRect = rect;
          motionBlurRectUntil = now + 250;
        }
      }
    } catch (e) {}
    motionBlurSource = best;
    motionBlurSourceUntil = now + 1000;
    return best;
  }

  function removeMotionBlurCanvas() {
    if (motionBlurTimer) {
      clearTimeout(motionBlurTimer);
      motionBlurTimer = 0;
    }
    if (motionBlurCanvas && motionBlurCanvas.parentNode) {
      motionBlurCanvas.parentNode.removeChild(motionBlurCanvas);
    }
    motionBlurCanvas = null;
    motionBlurCtx = null;
    motionBlurPrev = null;
    motionBlurPrevCtx = null;
    motionBlurSource = null;
    motionBlurSourceUntil = 0;
    motionBlurRect = null;
    motionBlurRectUntil = 0;
  }

  function ensureMotionBlurCanvas() {
    if (motionBlurCanvas && motionBlurCanvas.isConnected && motionBlurCtx)
      return true;
    try {
      motionBlurCanvas = document.createElement("canvas");
      motionBlurCanvas.id = "star-motion-blur-canvas";
      motionBlurCanvas.setAttribute("aria-hidden", "true");
      motionBlurCanvas.style.cssText =
        "position:fixed;pointer-events:none;z-index:2147480000;" +
        "display:none;transform:translateZ(0);will-change:opacity;";
      motionBlurCtx = motionBlurCanvas.getContext("2d", {
        alpha: true,
        desynchronized: true,
      });
      motionBlurPrev = document.createElement("canvas");
      motionBlurPrevCtx = motionBlurPrev.getContext("2d", {
        alpha: true,
        desynchronized: true,
      });
      document.body.appendChild(motionBlurCanvas);
      return !!(motionBlurCtx && motionBlurPrevCtx);
    } catch (e) {
      removeMotionBlurCanvas();
      return false;
    }
  }

  function drawMotionBlurFrame() {
    motionBlurTimer = 0;
    if (!motionBlurEnabled) {
      removeMotionBlurCanvas();
      return;
    }
    try {
      if (
        document.hidden ||
        document.visibilityState === "hidden" ||
        document.documentElement.classList.contains("star-native-dialog")
      ) {
        if (motionBlurCanvas) motionBlurCanvas.style.display = "none";
        return;
      }
      var source = isInRoom() ? findGameCanvas() : null;
      if (!source || !ensureMotionBlurCanvas()) {
        if (motionBlurCanvas) motionBlurCanvas.style.display = "none";
      } else {
        var now = Date.now();
        var rect =
          motionBlurRect && now < motionBlurRectUntil
            ? motionBlurRect
            : source.getBoundingClientRect();
        motionBlurRect = rect;
        motionBlurRectUntil = now + 250;

        // Keep capture cheap: half-res-ish, hard cap 960 on the long side.
        var maxSide = Math.max(source.width, source.height);
        var captureScale = maxSide > 960 ? 960 / maxSide : 0.55;
        if (captureScale > 0.55) captureScale = 0.55;
        var width = Math.max(1, Math.round(source.width * captureScale));
        var height = Math.max(1, Math.round(source.height * captureScale));

        if (
          motionBlurCanvas.width !== width ||
          motionBlurCanvas.height !== height
        ) {
          motionBlurCanvas.width = width;
          motionBlurCanvas.height = height;
          motionBlurPrev.width = width;
          motionBlurPrev.height = height;
        }

        motionBlurCanvas.style.left = rect.left + "px";
        motionBlurCanvas.style.top = rect.top + "px";
        motionBlurCanvas.style.width = rect.width + "px";
        motionBlurCanvas.style.height = rect.height + "px";
        motionBlurCanvas.style.display = "block";
        motionBlurCanvas.style.opacity = String(
          Math.max(0.12, Math.min(0.45, motionBlurIntensity)),
        );

        // One previous frame only — no multi-ghost trail, much cheaper.
        motionBlurCtx.clearRect(0, 0, width, height);
        motionBlurCtx.globalAlpha = 1;
        motionBlurCtx.drawImage(motionBlurPrev, 0, 0);

        motionBlurPrevCtx.globalCompositeOperation = "copy";
        motionBlurPrevCtx.drawImage(source, 0, 0, width, height);
      }
    } catch (eDraw) {
      if (motionBlurCanvas) motionBlurCanvas.style.display = "none";
    }
    motionBlurTimer = setTimeout(
      drawMotionBlurFrame,
      Math.max(40, Math.round(1000 / motionBlurFrameRate)),
    );
  }

  function setMotionBlur(config) {
    config = config || {};
    motionBlurEnabled = !!config.enabled;
    var intensity = Number(config.intensity);
    if (isFinite(intensity))
      motionBlurIntensity = Math.max(0.1, Math.min(0.7, intensity / 100));
    var fps = Number(config.frameRate);
    // Cap hard — higher rates stall the game canvas copy.
    if (isFinite(fps)) motionBlurFrameRate = Math.max(12, Math.min(30, fps));
    if (!motionBlurEnabled) {
      removeMotionBlurCanvas();
    } else if (!motionBlurTimer) {
      drawMotionBlurFrame();
    }
  }

  function injectPageWorldCustomBall(payload, invalidate) {
    try {
      var el = document.getElementById("star-custom-ball-state");
      if (!el) {
        el = document.createElement("div");
        el.id = "star-custom-ball-state";
        el.style.cssText =
          "display:none!important;position:absolute;left:-9999px;width:0;height:0;overflow:hidden;";
        (document.documentElement || document.body).appendChild(el);
      }
      el.textContent = JSON.stringify(payload || {});
      el.setAttribute("data-rev", String(Date.now()));
    } catch (eDom) {}
    try {
      var s = document.createElement("script");
      s.textContent =
        "(function(){try{" +
        'var el=document.getElementById("star-custom-ball-state");' +
        "if(!el)return;" +
        'var p=JSON.parse(el.textContent||"{}");' +
        "window.__starCustomBall=p;" +
        (invalidate
          ? 'if(typeof window.__starInvalidateBallCache==="function")window.__starInvalidateBallCache();'
          : "") +
        "}catch(e){}})();";
      (document.documentElement || document.head || document.body).appendChild(
        s,
      );
      try {
        s.remove();
      } catch (eRm) {}
    } catch (eInj) {}
  }

  function setCustomBall(config) {
    config = config || {};
    var prev = null;
    try {
      prev = window.__starCustomBall;
    } catch (ePrev) {
      prev = null;
    }
    if (
      (!config.image || !String(config.image)) &&
      prev &&
      prev.image &&
      (config.enabled === undefined || Object.keys(config).length <= 2)
    ) {
      // Preserve image when toggle-only updates wipe the payload.
      if (config.image == null) config = Object.assign({}, prev, config);
    }
    var plusOn = !!window.__starIsPlus;
    var prefEnabled;
    if (config.prefEnabled != null) prefEnabled = !!config.prefEnabled;
    else if (Object.prototype.hasOwnProperty.call(config, "enabled"))
      prefEnabled = !!config.enabled;
    else if (prev && prev.prefEnabled != null) prefEnabled = !!prev.prefEnabled;
    else prefEnabled = !!(prev && prev.enabled);
    // Runtime needs Plus from live API flag only (never stale localStorage).
    var enabled = prefEnabled && plusOn;
    var style = String(config.style || (prev && prev.style) || "soccer");
    var mode = String(config.mode || (prev && prev.mode) || "style");
    if (style === "image") mode = "image";
    else if (
      style === "default" &&
      mode !== "color" &&
      mode !== "image" &&
      mode !== "avatar"
    )
      mode = "color";
    else if (
      style &&
      style !== "default" &&
      mode !== "color" &&
      mode !== "image" &&
      mode !== "avatar"
    ) {
      mode = "style";
    }
    var image =
      config.image != null
        ? String(config.image || "")
        : String((prev && prev.image) || "");
    var payload = {
      enabled: enabled,
      prefEnabled: prefEnabled,
      style: style,
      mode: mode,
      color: String(config.color || (prev && prev.color) || "#60a5fa"),
      color2: String(config.color2 || (prev && prev.color2) || "#7c3aed"),
      image: image,
    };
    var meta = {
      enabled: payload.enabled,
      prefEnabled: payload.prefEnabled,
      style: payload.style,
      mode: payload.mode,
      color: payload.color,
      color2: payload.color2,
    };
    var imageChanged =
      !prev ||
      String(prev.image || "") !== payload.image ||
      String(prev.mode || "") !== payload.mode ||
      String(prev.style || "") !== payload.style;
    try {
      window.__starCustomBall = payload;
      try {
        localStorage.setItem("star_custom_ball", JSON.stringify(payload));
      } catch (eFull) {
        try {
          localStorage.setItem("star_custom_ball", JSON.stringify(meta));
        } catch (eMeta) {}
      }
      try {
        if (payload.image)
          localStorage.setItem("star_custom_ball_image", payload.image);
        else localStorage.removeItem("star_custom_ball_image");
      } catch (eImg) {}
      injectPageWorldCustomBall(payload, imageChanged);
      if (
        imageChanged &&
        typeof window.__starInvalidateBallCache === "function"
      ) {
        window.__starInvalidateBallCache();
      }
    } catch (e) {
      window.__starCustomBall = payload;
      try {
        injectPageWorldCustomBall(payload, true);
      } catch (e2) {}
    }
  }

  function applyModToggle(id, enabled) {
    // HUD mods live inside star-menu itself; map a few to existing client flags
    try {
      var raw = localStorage.getItem("starModsEnabled");
      var state = raw ? JSON.parse(raw) : {};
      if (!state || typeof state !== "object") state = {};
      state[id] = !!enabled;
      localStorage.setItem("starModsEnabled", JSON.stringify(state));
      if (id === "input-boost" || id === "inputBoost") {
        localStorage.setItem("input_boost_enabled", enabled ? "true" : "false");
      }
    } catch (e) {}
    if (id === "motion-blur") {
      setMotionBlur({ enabled: enabled });
    }
    if (id === "custom-ball") {
      var keep = null;
      try {
        keep = window.__starCustomBall;
      } catch (eKeep) {
        keep = null;
      }
      setCustomBall(
        Object.assign({}, keep || {}, {
          enabled: !!enabled,
          prefEnabled: !!enabled,
        }),
      );
    }
    if (id === "scoreboard") {
      syncNativeScoreboardVisibility();
    }
  }

  function isStarModEnabled(id) {
    try {
      var raw = localStorage.getItem("starModsEnabled");
      if (!raw) {
        // Defaults in star-menu: scoreboard + keystrokes on
        return (
          id === "scoreboard" ||
          id === "keystrokes" ||
          id === "fps" ||
          id === "ping" ||
          id === "clock" ||
          id === "spectators"
        );
      }
      var map = JSON.parse(raw);
      if (
        map &&
        typeof map === "object" &&
        Object.prototype.hasOwnProperty.call(map, id)
      ) {
        return !!map[id];
      }
    } catch (e) {}
    return id === "scoreboard" || id === "keystrokes";
  }

  function setNativeScoreboardHidden(hidden) {
    try {
      document.documentElement.classList.toggle(
        "star-hide-native-score",
        !!hidden,
      );
    } catch (e) {}
    try {
      var bar = document.querySelector(".bar-container");
      if (bar) {
        bar.style.visibility = hidden ? "hidden" : "";
        bar.style.opacity = hidden ? "0" : "";
        bar.style.pointerEvents = hidden ? "none" : "";
      }
      var timer = document.querySelector('[data-hook="timer"]');
      if (timer && timer.closest && timer.closest(".bar-container")) {
        /* visibility handled via bar-container */
      }
    } catch (e2) {}
  }

  /** Hide native bar when Star scoreboard mod is on (unless user wants classic). */
  function syncNativeScoreboardVisibility() {
    var wantClassic = false;
    try {
      wantClassic = localStorage.getItem("star_classic_scoreboard") === "1";
    } catch (e) {}
    if (wantClassic) {
      setNativeScoreboardHidden(false);
      return;
    }
    setNativeScoreboardHidden(isStarModEnabled("scoreboard"));
  }

  var hudKeysState = {
    up: false,
    left: false,
    down: false,
    right: false,
    kick: false,
  };
  var hudKeysDirty = false;
  var lastHudStatsSig = "";
  var kickKeyBoundLive = false;
  var starSynthKick = false;
  var starHostFps = 0;
  var starHostFpsFrames = 0;
  var starHostFpsLast = 0;
  var starHostFpsRaf = 0;

  function tickHostFps(ts) {
    starHostFpsRaf = window.requestAnimationFrame(tickHostFps);
    if (!starHostFpsLast) starHostFpsLast = ts;
    starHostFpsFrames += 1;
    if (ts - starHostFpsLast >= 500) {
      starHostFps = Math.round(
        (starHostFpsFrames * 1000) / (ts - starHostFpsLast),
      );
      starHostFpsFrames = 0;
      starHostFpsLast = ts;
    }
  }

  function startHostFpsMeter() {
    if (starHostFpsRaf) return;
    starHostFpsRaf = window.requestAnimationFrame(tickHostFps);
  }
  function stopHostFpsMeter() {
    if (!starHostFpsRaf) return;
    try {
      window.cancelAnimationFrame(starHostFpsRaf);
    } catch (e) {}
    starHostFpsRaf = 0;
    starHostFpsFrames = 0;
    starHostFpsLast = 0;
  }
  var DEFAULT_KICK_CODES = {
    Space: 1,
    KeyX: 1,
    ControlLeft: 1,
    ControlRight: 1,
    ShiftLeft: 1,
    ShiftRight: 1,
    Numpad0: 1,
  };

  /** Full HaxBall defaults — never persist Kick-only maps (breaks WASD). */
  var DEFAULT_PLAYER_KEYS = {
    ArrowUp: "Up",
    KeyW: "Up",
    ArrowDown: "Down",
    KeyS: "Down",
    ArrowLeft: "Left",
    KeyA: "Left",
    ArrowRight: "Right",
    KeyD: "Right",
    KeyX: "Kick",
    Space: "Kick",
    ControlLeft: "Kick",
    ControlRight: "Kick",
    ShiftLeft: "Kick",
    ShiftRight: "Kick",
    Numpad0: "Kick",
  };

  function ensurePlayerKeysMap(extraKick, softOnly) {
    var map = {};
    var k;
    if (!softOnly) {
      for (k in DEFAULT_PLAYER_KEYS) {
        if (Object.prototype.hasOwnProperty.call(DEFAULT_PLAYER_KEYS, k)) {
          map[k] = DEFAULT_PLAYER_KEYS[k];
        }
      }
    }
    try {
      var raw = localStorage.getItem("player_keys");
      var existing = raw ? JSON.parse(raw) : null;
      if (existing && typeof existing === "object") {
        for (k in existing) {
          if (
            Object.prototype.hasOwnProperty.call(existing, k) &&
            existing[k]
          ) {
            map[k] = existing[k];
          }
        }
      }
    } catch (eRead) {}
    if (!softOnly) {
      // Repair profiles that only saved Kick after a fresh install / rebrand
      var moveKeys = [
        "ArrowUp",
        "KeyW",
        "ArrowDown",
        "KeyS",
        "ArrowLeft",
        "KeyA",
        "ArrowRight",
        "KeyD",
      ];
      for (var i = 0; i < moveKeys.length; i++) {
        if (!map[moveKeys[i]])
          map[moveKeys[i]] = DEFAULT_PLAYER_KEYS[moveKeys[i]];
      }
      for (k in DEFAULT_KICK_CODES) {
        if (
          Object.prototype.hasOwnProperty.call(DEFAULT_KICK_CODES, k) &&
          !map[k]
        ) {
          map[k] = "Kick";
        }
      }
    }
    // Soft-update: add extra kick without deleting other Kick codes / other actions
    if (extraKick) map[String(extraKick)] = "Kick";
    try {
      localStorage.setItem("player_keys", JSON.stringify(map));
      if (extraKick)
        localStorage.setItem("star_extra_kick_key", String(extraKick));
    } catch (eWrite) {}
    return map;
  }

  function readStoredKickKey() {
    try {
      var layout = JSON.parse(localStorage.getItem("starModsLayout") || "{}");
      var k = layout && layout.keystrokes && layout.keystrokes.kickKey;
      if (k) return String(k);
    } catch (e) {}
    try {
      var cfg = JSON.parse(localStorage.getItem("starClientConfig") || "{}");
      if (cfg && cfg.input && cfg.input.kick) {
        var kick = cfg.input.kick;
        if (Array.isArray(kick) && kick.length) return String(kick[0]);
        if (typeof kick === "string" && kick) return kick;
      }
    } catch (e2) {}
    return "Space";
  }

  /** Live kick bind from menu — host localStorage often lags behind the iframe */
  var activeKickKey = readStoredKickKey();

  // Repair ASAP at document_start — before HaxBall reads player_keys
  try {
    ensurePlayerKeysMap(activeKickKey);
  } catch (eBootKeys) {}

  function getKickKeyCode() {
    return String(activeKickKey || readStoredKickKey() || "Space");
  }

  function syncHostKickLayout(code) {
    code = String(code || "Space");
    activeKickKey = code;
    try {
      var layout = JSON.parse(localStorage.getItem("starModsLayout") || "{}");
      if (!layout || typeof layout !== "object") layout = {};
      if (!layout.keystrokes || typeof layout.keystrokes !== "object")
        layout.keystrokes = {};
      layout.keystrokes.kickKey = code;
      localStorage.setItem("starModsLayout", JSON.stringify(layout));
    } catch (eLay) {}
    try {
      var cfg = JSON.parse(localStorage.getItem("starClientConfig") || "{}");
      if (!cfg || typeof cfg !== "object") cfg = {};
      if (!cfg.input || typeof cfg.input !== "object") cfg.input = {};
      // Soft-update: keep array kick binds; set primary as first element
      var existing = cfg.input.kick;
      if (Array.isArray(existing)) {
        if (existing.indexOf(code) === -1) existing = [code].concat(existing);
        else {
          existing = existing.slice();
          existing.splice(existing.indexOf(code), 1);
          existing.unshift(code);
        }
        cfg.input.kick = existing;
      } else {
        cfg.input.kick = [code];
      }
      localStorage.setItem("starClientConfig", JSON.stringify(cfg));
    } catch (eCfg) {}
  }

  function applyKickKeyBind(code, softOnly) {
    code = String(code || "Space");
    syncHostKickLayout(code);
    // Soft-update when coming from multi-key applyInputBinds — don't wipe map
    ensurePlayerKeysMap(code, !!softOnly);
    kickKeyBoundLive = false;
    var tries = 0;
    function attempt() {
      tries += 1;
      try {
        if (typeof window.__starSetKickKey === "function") {
          kickKeyBoundLive = !!window.__starSetKickKey(code);
          if (kickKeyBoundLive) return;
        }
      } catch (eBind) {}
      ensurePlayerKeysMap(code, !!softOnly);
      if (tries < 40) setTimeout(attempt, 250);
    }
    attempt();
  }

  function isKickKeyEvent(e) {
    var bound = getKickKeyCode();
    var code = e.code || "";
    var key = e.key || "";
    if (code && code === bound) return true;
    if (bound.length === 1 && key === bound) return true;
    if (bound === "ShiftLeft" || bound === "ShiftRight") {
      return code === "ShiftLeft" || code === "ShiftRight" || key === "Shift";
    }
    if (bound === "ControlLeft" || bound === "ControlRight") {
      return (
        code === "ControlLeft" || code === "ControlRight" || key === "Control"
      );
    }
    if (bound === "AltLeft" || bound === "AltRight") {
      return code === "AltLeft" || code === "AltRight" || key === "Alt";
    }
    if (bound === "Space")
      return key === " " || key === "Spacebar" || code === "Space";
    // `{` / `[` often live on Quote or BracketLeft (ES/LATAM layouts)
    if (
      bound === "Quote" ||
      bound === "BracketLeft" ||
      bound === "BracketRight" ||
      bound === "{" ||
      bound === "["
    ) {
      if (
        key === "{" ||
        key === "}" ||
        key === "[" ||
        key === "]" ||
        key === "'" ||
        key === '"'
      )
        return true;
      if (code === "Quote" || code === "BracketLeft" || code === "BracketRight")
        return true;
    }
    // Still light HUD / accept defaults while a custom bind is active
    if (DEFAULT_KICK_CODES[code]) return true;
    return false;
  }

  /**
   * Content scripts cannot call page-world window.__starInjectAction.
   * Push movement through an inline script into the real HaxBall Tb.
   */
  function pageWorldInjectAction(action, down) {
    if (!action) return false;
    try {
      var s = document.createElement("script");
      s.textContent =
        "(function(){try{" +
        "var a=" +
        JSON.stringify(String(action)) +
        ";" +
        "var d=" +
        (down ? "true" : "false") +
        ";" +
        'if(typeof window.__starInjectAction==="function"){' +
        "window.__starInjectAction(a,d);return;" +
        "}" +
        'if(a==="Kick"&&typeof window.__starInjectKick==="function"){' +
        "window.__starInjectKick(d);" +
        "}" +
        "}catch(e){}})();";
      (document.documentElement || document.head || document.body).appendChild(
        s,
      );
      try {
        s.remove();
      } catch (eRm) {}
      return true;
    } catch (e) {
      return false;
    }
  }

  function injectKick(down) {
    if (pageWorldInjectAction("Kick", !!down)) return true;
    // Fallback: synth Space without focusing (focus clears Tb.Qc)
    if (starSynthKick) return false;
    starSynthKick = true;
    try {
      var ev = new KeyboardEvent(down ? "keydown" : "keyup", {
        key: " ",
        code: "Space",
        keyCode: 32,
        which: 32,
        bubbles: true,
        cancelable: true,
        view: window,
      });
      try {
        Object.defineProperty(ev, "keyCode", {
          get: function () {
            return 32;
          },
        });
        Object.defineProperty(ev, "which", {
          get: function () {
            return 32;
          },
        });
      } catch (eDef) {}
      document.dispatchEvent(ev);
    } catch (eSyn) {}
    setTimeout(function () {
      starSynthKick = false;
    }, 0);
    return false;
  }

  function shouldInjectCustomKick(e) {
    var bound = getKickKeyCode();
    if (!bound || DEFAULT_KICK_CODES[bound]) return false;
    var code = e.code || "";
    if (code && code === bound) return true;
    if (bound.length === 1 && (e.key || "") === bound) return true;
    if (
      bound === "Quote" ||
      bound === "BracketLeft" ||
      bound === "BracketRight"
    ) {
      return (
        code === bound ||
        code === "Quote" ||
        code === "BracketLeft" ||
        code === "BracketRight"
      );
    }
    return false;
  }

  function mapMovementKey(e) {
    var key = e.key;
    var code = e.code || "";
    if (
      key === "ArrowUp" ||
      key === "w" ||
      key === "W" ||
      code === "KeyW" ||
      code === "ArrowUp"
    )
      return "up";
    if (
      key === "ArrowLeft" ||
      key === "a" ||
      key === "A" ||
      code === "KeyA" ||
      code === "ArrowLeft"
    )
      return "left";
    if (
      key === "ArrowDown" ||
      key === "s" ||
      key === "S" ||
      code === "KeyS" ||
      code === "ArrowDown"
    )
      return "down";
    if (
      key === "ArrowRight" ||
      key === "d" ||
      key === "D" ||
      code === "KeyD" ||
      code === "ArrowRight"
    )
      return "right";
    if (isKickKeyEvent(e)) return "kick";
    return null;
  }

  function movementActionFromMapped(mapped) {
    if (mapped === "up") return "Up";
    if (mapped === "down") return "Down";
    if (mapped === "left") return "Left";
    if (mapped === "right") return "Right";
    if (mapped === "kick") return "Kick";
    return null;
  }

  function injectMovementAction(mapped, down) {
    var action = movementActionFromMapped(mapped);
    if (!action) return false;
    return pageWorldInjectAction(action, !!down);
  }

  function publishHudKeys() {
    postToMenu({
      type: "star:hud-keys",
      keys: {
        up: !!hudKeysState.up,
        left: !!hudKeysState.left,
        down: !!hudKeysState.down,
        right: !!hudKeysState.right,
        kick: !!hudKeysState.kick,
      },
    });
    hudKeysDirty = false;
  }

  function onHudKeyDown(e) {
    if (!isInRoom()) return;
    if (modsOverlayOpen) return;
    if (isTypingTarget(e.target)) return;
    if (starSynthKick) return;
    var mapped = mapMovementKey(e);
    if (!mapped) return;
    // Bypass focus issues: push movement straight into the live Tb input.
    injectMovementAction(mapped, true);
    if (!hudKeysState[mapped]) {
      hudKeysState[mapped] = true;
      hudKeysDirty = true;
      publishHudKeys();
    }
    // Custom kick: inject into live room input (don't rely on host localStorage)
    if (shouldInjectCustomKick(e)) {
      injectKick(true);
    }
  }

  function onHudKeyUp(e) {
    if (!isInRoom()) return;
    if (starSynthKick) return;
    var mapped = mapMovementKey(e);
    if (!mapped) return;
    injectMovementAction(mapped, false);
    if (hudKeysState[mapped]) {
      hudKeysState[mapped] = false;
      hudKeysDirty = true;
      publishHudKeys();
    }
    if (shouldInjectCustomKick(e)) {
      injectKick(false);
    }
  }

  function readPlayerList(hook) {
    var out = [];
    var root = null;
    // HaxBall replaceWith()'s data-hook=*-list placeholders with .player-list-view
    // (order: red, spec, blue). Prefer live views, then legacy hooks.
    try {
      var views = document.querySelectorAll(
        ".room-view .teams .player-list-view",
      );
      if (!views || !views.length) {
        views = document.querySelectorAll(".teams .player-list-view");
      }
      if (views && views.length) {
        if (hook === "red-list") root = views[0] || null;
        else if (hook === "spec-list") root = views[1] || null;
        else if (hook === "blue-list") root = views[2] || null;
      }
    } catch (eViews) {}
    if (!root) {
      try {
        root = document.querySelector('[data-hook="' + hook + '"]');
      } catch (eHook) {
        root = null;
      }
    }
    if (!root) return out;
    var myNick = "";
    try {
      myNick =
        localStorage.getItem("starNickname") ||
        localStorage.getItem("haxball_nick") ||
        "";
      if (localStorage.getItem("ghost_mode") === "true") {
        myNick = localStorage.getItem("ghost_nick") || myNick;
      }
    } catch (eNick) {}
    var items = root.querySelectorAll(".player-list-item");
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var nameEl =
        item.querySelector('[data-hook="name"]') || item.querySelector(".name");
      var name = nameEl ? String(nameEl.textContent || "").trim() : "";
      if (!name) continue;
      var flag = "";
      var flagEl = item.querySelector('[data-hook="flag"], .flagico');
      if (flagEl && flagEl.className) {
        var fm = String(flagEl.className).match(/\bf-([a-z]{2})\b/i);
        if (fm) flag = fm[1].toLowerCase();
      }
      var avatar = "";
      var avatarUrl = "";
      var img = item.querySelector("img[src]");
      if (img && img.src) avatarUrl = String(img.src);
      if (item.dataset) {
        if (item.dataset.avatar) avatar = String(item.dataset.avatar);
        if (item.dataset.avatarUrl) avatarUrl = String(item.dataset.avatarUrl);
      }
      // HaxBall circle avatar (1–2 chars) preferred for Match Block faces
      if (!avatar && item.getAttribute) {
        var attrAv = item.getAttribute("data-avatar");
        if (attrAv) avatar = String(attrAv);
      }
      out.push({
        id: (item.dataset && item.dataset.playerId) || hook + "-" + i,
        name: name,
        flag: flag,
        avatar: avatar,
        avatarUrl: avatarUrl,
        you: !!(myNick && name.toLowerCase() === String(myNick).toLowerCase()),
      });
    }
    return out;
  }

  function readRoomMetaForHud() {
    var name = "";
    var map = "";
    try {
      var nameEl =
        document.querySelector('h1[data-hook="room-name"]') ||
        document.querySelector('[data-hook="room-name"]');
      name = nameEl ? String(nameEl.textContent || "").trim() : "";
    } catch (eN) {}
    try {
      var stadEl = document.querySelector('[data-hook="stadium-name"]');
      map = stadEl ? String(stadEl.textContent || "").trim() : "";
    } catch (eM) {}
    return { name: name, map: map };
  }

  function readNativeTimer() {
    var view = document.querySelector(".game-timer-view");
    var overtime = false;
    var elapsedSec = 0;
    var limitSec = 0;
    var text = "";

    // Room time limit (minutes index → seconds). Index 0 = unlimited.
    try {
      var sel = document.querySelector('[data-hook="time-limit-sel"]');
      if (
        sel &&
        typeof sel.selectedIndex === "number" &&
        sel.selectedIndex > 0
      ) {
        limitSec = sel.selectedIndex * 60;
      }
    } catch (eSel) {}

    if (view) {
      overtime = !!view.querySelector(".overtime.on");
      var digitEls = view.querySelectorAll(".digit");
      if (digitEls.length >= 4) {
        var mins = parseInt(
          String(digitEls[0].textContent || "0") +
            String(digitEls[1].textContent || "0"),
          10,
        );
        var secs = parseInt(
          String(digitEls[2].textContent || "0") +
            String(digitEls[3].textContent || "0"),
          10,
        );
        if (isNaN(mins)) mins = 0;
        if (isNaN(secs)) secs = 0;
        elapsedSec = mins * 60 + secs;
        text = mins + ":" + String(secs).padStart(2, "0");
      }
      // Prefer live limit from timer view if known via CSS/class path — keep select fallback
    } else {
      var fallback =
        document.querySelector('.game-state-view [data-hook="timer"]') ||
        document.querySelector('[data-hook="timer"]');
      if (fallback) {
        var raw = String(fallback.textContent || "")
          .replace(/\s+/g, " ")
          .trim();
        overtime = /overtime/i.test(raw) && /on|!/i.test(raw);
        var m = raw.match(/(\d{1,2}):(\d{2})/);
        if (m) {
          elapsedSec = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
          text = parseInt(m[1], 10) + ":" + m[2];
        } else {
          var digits = raw.replace(/[^0-9]/g, "");
          if (digits.length >= 4) {
            var mm = parseInt(digits.slice(0, 2), 10);
            var ss = parseInt(digits.slice(2, 4), 10);
            elapsedSec = mm * 60 + ss;
            text = mm + ":" + String(ss).padStart(2, "0");
          }
        }
      }
    }

    return {
      text: text,
      overtime: overtime,
      elapsedSec: elapsedSec,
      limitSec: limitSec,
    };
  }

  function collectHudStats() {
    var payload = { type: "star:hud-stats" };
    var snap = null;
    try {
      snap = window.__starHudSnapshot || null;
    } catch (eSnap) {
      snap = null;
    }

    // Prefer live game-state snapshot (players + real time limit) when present
    if (snap && typeof snap === "object") {
      if (typeof snap.scoreRed === "number") payload.scoreRed = snap.scoreRed;
      if (typeof snap.scoreBlue === "number")
        payload.scoreBlue = snap.scoreBlue;
      if (typeof snap.elapsedSec === "number")
        payload.elapsedSec = snap.elapsedSec;
      if (typeof snap.limitSec === "number") payload.limitSec = snap.limitSec;
      if (typeof snap.overtime === "boolean") payload.overtime = snap.overtime;
      if (snap.players && (snap.players.red || snap.players.blue)) {
        var snapRed = Array.isArray(snap.players.red) ? snap.players.red : [];
        var snapBlue = Array.isArray(snap.players.blue)
          ? snap.players.blue
          : [];
        if (snapRed.length + snapBlue.length > 0) {
          payload.players = { red: snapRed, blue: snapBlue };
        }
      }
      if (typeof snap.spectators === "number")
        payload.spectators = snap.spectators;
      if (typeof snap.elapsedSec === "number") {
        var em = Math.floor(snap.elapsedSec / 60);
        var es = snap.elapsedSec % 60;
        payload.timerText = em + ":" + String(es).padStart(2, "0");
      }
    }

    var redEl = document.querySelector('[data-hook="red-score"]');
    var blueEl = document.querySelector('[data-hook="blue-score"]');
    if (typeof payload.scoreRed !== "number" && redEl) {
      var rs = parseInt(String(redEl.textContent || "").trim(), 10);
      if (!isNaN(rs)) payload.scoreRed = rs;
    }
    if (typeof payload.scoreBlue !== "number" && blueEl) {
      var bs = parseInt(String(blueEl.textContent || "").trim(), 10);
      if (!isNaN(bs)) payload.scoreBlue = bs;
    }
    var timer = readNativeTimer();
    if (!payload.timerText && timer.text) payload.timerText = timer.text;
    if (typeof payload.overtime !== "boolean")
      payload.overtime = !!timer.overtime;
    else if (timer.overtime) payload.overtime = true;
    if (typeof payload.elapsedSec !== "number")
      payload.elapsedSec = timer.elapsedSec || 0;
    if (typeof payload.limitSec !== "number" || !payload.limitSec) {
      payload.limitSec = timer.limitSec || payload.limitSec || 0;
    }
    // Native texts are "Ping: 45 - 80" and "Fps: 144" (not "... ms" / "... fps")
    try {
      var pingEl = document.querySelector('.stats-view [data-hook="ping"]');
      var fpsEl = document.querySelector('.stats-view [data-hook="fps"]');
      if (pingEl) {
        var pingMatch = String(pingEl.textContent || "").match(/(\d+)/);
        if (pingMatch) payload.ping = parseInt(pingMatch[1], 10);
      }
      if (fpsEl) {
        var fpsMatch = String(fpsEl.textContent || "").match(/(\d+)/);
        if (fpsMatch) payload.fps = parseInt(fpsMatch[1], 10);
      }
      // Native FPS available — stop auxiliary host rAF meter.
      if (typeof payload.fps === "number") stopHostFpsMeter();
      if (typeof payload.ping !== "number" || typeof payload.fps !== "number") {
        var statsText =
          (document.querySelector(".stats-view") || {}).textContent || "";
        if (typeof payload.ping !== "number") {
          var pm2 = statsText.match(/Ping:\s*(\d+)/i);
          if (pm2) payload.ping = parseInt(pm2[1], 10);
        }
        if (typeof payload.fps !== "number") {
          var fm2 = statsText.match(/Fps:\s*(\d+)/i);
          if (fm2) payload.fps = parseInt(fm2[1], 10);
        }
      }
    } catch (eStats) {}
    try {
      var net = window.__starNetStats;
      if (net && typeof net === "object") {
        if (typeof payload.ping !== "number" && typeof net.ping === "number")
          payload.ping = net.ping;
        if (typeof payload.fps !== "number" && typeof net.fps === "number")
          payload.fps = net.fps;
      }
    } catch (eNet) {}
    if (typeof payload.fps !== "number") {
      startHostFpsMeter();
      if (typeof starHostFps === "number" && starHostFps > 0)
        payload.fps = starHostFps;
    }
    if (!payload.players) {
      var redPlayers = readPlayerList("red-list");
      var bluePlayers = readPlayerList("blue-list");
      payload.players = { red: redPlayers, blue: bluePlayers };
    }
    // Always prefer live team lists for spectator count (data-hook placeholders are replaced).
    try {
      payload.spectators = readPlayerList("spec-list").length;
    } catch (eSpec) {
      if (typeof payload.spectators !== "number") payload.spectators = 0;
    }
    // Always refresh room meta for Room Info HUD (name + map + counts).
    try {
      var meta = readRoomMetaForHud();
      var redN =
        (payload.players &&
          payload.players.red &&
          payload.players.red.length) ||
        0;
      var blueN =
        (payload.players &&
          payload.players.blue &&
          payload.players.blue.length) ||
        0;
      var specN =
        typeof payload.spectators === "number"
          ? payload.spectators
          : readPlayerList("spec-list").length;
      var playingN = redN + blueN;
      var totalN = playingN + specN;
      payload.room = {
        name: meta.name || "",
        map: meta.map || "",
        players: totalN > 0 ? String(playingN) + "/" + String(totalN) : "",
        playersPlaying: playingN,
        playersTotal: totalN,
        spectators: specN,
      };
      if (!meta.name && !meta.map && totalN <= 0) {
        // keep previous menu-side cache when DOM is empty this tick
        delete payload.room;
      }
    } catch (eRoomHud) {}
    payload.keys = {
      up: !!hudKeysState.up,
      left: !!hudKeysState.left,
      down: !!hudKeysState.down,
      right: !!hudKeysState.right,
      kick: !!hudKeysState.kick,
    };
    return payload;
  }

  function pushHudStats(force) {
    if (!isInRoom()) return;
    var payload = collectHudStats();
    var sig = JSON.stringify(payload);
    if (!force && sig === lastHudStatsSig) return;
    lastHudStatsSig = sig;
    postToMenu(payload);
  }

  function startHudFeed() {
    document.addEventListener("keydown", onHudKeyDown, true);
    document.addEventListener("keyup", onHudKeyUp, true);
    applyKickKeyBind(getKickKeyCode());
    // Host FPS meter starts lazily only if native stats are missing.
    window.addEventListener("blur", function () {
      var k;
      for (k in hudKeysState) {
        if (hudKeysState[k]) injectMovementAction(k, false);
      }
      hudKeysState = {
        up: false,
        left: false,
        down: false,
        right: false,
        kick: false,
      };
      publishHudKeys();
    });
    setInterval(function () {
      if (!isInRoom()) return;
      syncNativeScoreboardVisibility();
      pushHudStats(false);
      if (hudKeysDirty) publishHudKeys();
    }, 1000);
  }

  function sendInit() {
    var user = { displayName: "", username: "", avatarUrl: "" };
    try {
      user.displayName =
        localStorage.getItem("starNickname") ||
        localStorage.getItem("haxball_nick") ||
        "";
      if (localStorage.getItem("ghost_mode") === "true") {
        user.displayName =
          localStorage.getItem("ghost_nick") || user.displayName;
      }
    } catch (e) {}
    if (window.HaxDiscord) {
      try {
        user.username =
          window.HaxDiscord.getNick && window.HaxDiscord.getNick();
        user.displayName = user.displayName || user.username || "";
      } catch (e) {}
    }
    postToMenu({ type: "star:init", user: user });
    pushRooms(true);
  }

  function onMessage(ev) {
    var data = ev && ev.data;
    if (!data || typeof data !== "object" || typeof data.type !== "string")
      return;
    if (data.type.indexOf("star:") !== 0) return;

    switch (data.type) {
      case "star:menu-ready":
        ensureOverlay();
        sendInit();
        break;
      case "star:auth-ready":
      case "star:nickname":
        pendingNick =
          (data.user && (data.user.nick || data.user.username)) ||
          data.nickname ||
          pendingNick;
        nickSubmitted = false;
        submitNickname(pendingNick);
        if (data.user && typeof data.user.is_plus === "boolean") {
          applyPlusStatus(data.user.is_plus);
        }
        break;
      case "star:plus":
        applyPlusStatus(!!data.is_plus);
        break;
      case "star:avatar-hat":
        applyAvatarHat(data.hat);
        break;
      case "star:avatar-accessory":
        applyAvatarAccessory(data.accessory);
        break;
      case "star:avatar-pet":
        applyAvatarPet(data.pet);
        break;
      case "star:avatar-frame":
        applyAvatarFrame(data.frame);
        break;
      case "star:hat-assets":
        try {
          window.__starHatAssets =
            data.assets && typeof data.assets === "object" ? data.assets : {};
          if (typeof window.__starInvalidateHatCache === "function") {
            window.__starInvalidateHatCache();
          }
        } catch (eHatA) {}
        break;
      case "star:dev-hot-reload":
        try {
          var frameReload = document.getElementById(IFRAME_ID);
          if (frameReload) {
            var base = STAR_UI_URL.split("?")[0];
            frameReload.src = base + "?t=" + Date.now();
          }
        } catch (eHot) {}
        break;
      case "star:logout":
        nickSubmitted = false;
        pendingNick = null;
        showMenu(true);
        break;
      case "star:rooms-refresh":
        refreshNativeRooms();
        break;
      case "star:join-room":
        joinRoom(data);
        break;
      case "star:create-room":
        createRoom(data);
        break;
      case "star:close":
        try {
          var xhr = new XMLHttpRequest();
          xhr.open("POST", "http://127.0.0.1:5483/close", true);
          xhr.send();
        } catch (e) {}
        break;
      case "star:open-settings":
        openStarConfig();
        break;
      case "star:room-menu":
        // Hub Menu → native HaxBall room menu
        openingNativeMenuUntil = Date.now() + 2000;
        modsOverlayOpen = false;
        try {
          document.documentElement.classList.remove("star-mods-overlay");
        } catch (eM) {}
        try {
          document.documentElement.classList.remove("star-room-ui");
        } catch (eR) {}
        clearForceHideNativeRoom();
        postToMenu({ type: "star:close-mods" });
        postToMenu({ type: "star:close-room-panel" });
        setTimeout(function () {
          openStarRoomUi();
        }, 30);
        break;
      case "star:room-panel-open":
        postToMenu({ type: "star:close-room-panel" });
        break;
      case "star:room-panel-closed":
        clearForceHideNativeRoom();
        try {
          document.documentElement.classList.remove("star-room-ui");
        } catch (e) {}
        break;
      case "star:room-to-hub":
        clearForceHideNativeRoom();
        try {
          document.documentElement.classList.remove("star-room-ui");
        } catch (e) {}
        if (isNativeRoomMenuOpen()) closeNativeRoomMenu();
        showModsOverlay(true);
        break;
      case "star:room-action":
        handleRoomAction(data);
        break;
      case "star:config":
        applyConfig(data.config);
        break;
      case "star:config-apply-resolution":
        try {
          // Prefer WxH when present for non-native presets even if useNative is stale-true.
          var preset = data.preset != null ? String(data.preset) : "";
          var wantStretched =
            !!(data.width && data.height) &&
            (data.useNative === false || (preset && preset !== "native"));
          if (wantStretched) {
            localStorage.setItem(
              "stretched_resolution",
              JSON.stringify({
                width: data.width,
                height: data.height,
              }),
            );
          } else if (data.useNative) {
            localStorage.removeItem("stretched_resolution");
          }
          try {
            window.dispatchEvent(new Event("resize"));
          } catch (eR) {}
        } catch (e) {}
        break;
      case "star:host-token":
        applyHostToken(data.token);
        break;
      case "star:host-token-generate":
        openExternalUrl("https://www.haxball.com/headlesstoken");
        openStarConfig("multi");
        break;
      case "star:open-external":
        openExternalUrl(data.url || data.href || "https://discord.gg/spacehax");
        break;
      case "star:multi-use":
        applyMultiAuth(data.auth ? data : data.id || data);
        break;
      case "star:avatar":
        applyAvatar(data.image);
        break;
      case "star:theme":
        applyConfig({ look: { customTheme: data.theme, themeId: "custom" } });
        break;
      case "star:kick-key":
        applyKickKeyBind(data.code || getKickKeyCode());
        break;
      case "star:mod-toggle":
        applyModToggle(data.id, !!data.enabled);
        break;
      case "star:spotify-hitbox":
        setSpotifyHitbox(data);
        break;
      case "star:motion-blur":
        setMotionBlur(data);
        break;
      case "star:custom-ball":
        setCustomBall(data);
        break;
      case "star:force-input":
        (function () {
          if (!isInRoom() || modsOverlayOpen) return;
          var mapped = String(data.action || "");
          var down = !!data.down;
          if (mapped === "kick") {
            injectKick(down);
            return;
          }
          injectMovementAction(mapped, down);
          if (hudKeysState[mapped] !== down) {
            hudKeysState[mapped] = down;
            hudKeysDirty = true;
            publishHudKeys();
          }
          // Don't thrash iframe inert/focus here — that flashes the menu skybox.
        })();
        break;
      case "star:mods":
      case "star:emotes":
      case "star:mod-options":
      case "star:mods-profile":
      case "star:mods-save-profile":
      case "star:mods-delete-profile":
      case "star:hud-edit":
      case "star:import-host":
      case "star:subscribe":
        // Handled visually inside star-menu / no-op on host
        break;
      case "star:mods-closed":
        // Hub closed from UI — restore click-through HUD + game focus
        // Skip full teardown while Menu button is opening native room menu
        if (Date.now() < openingNativeMenuUntil) {
          modsOverlayOpen = false;
          try {
            document.documentElement.classList.remove("star-mods-overlay");
          } catch (eSkip) {}
          var frameSkip = document.getElementById(IFRAME_ID);
          if (frameSkip)
            frameSkip.style.setProperty("pointer-events", "none", "important");
          break;
        }
        if (modsOverlayOpen) {
          showModsOverlay(false);
        } else if (isInRoom()) {
          var frame = document.getElementById(IFRAME_ID);
          if (frame)
            frame.style.setProperty("pointer-events", "none", "important");
          document.documentElement.classList.remove("star-mods-overlay");
          restoreGameFocusAfterOverlayClose();
        }
        break;
      default:
        break;
    }
  }

  function onInGame() {
    clearNativeHostUi();
    endRoomTransition();
    enterInGameUi();
    // One-time camera migration only — do not force setViewModeLive on every
    // join/create (that resets zoom after the player already adjusted it).
    try {
      if (!localStorage.getItem("star_cam_migrated_v1")) {
        localStorage.setItem("star_cam_migrated_v1", "1");
        var curVm = parseInt(localStorage.getItem("view_mode"), 10);
        if (isNaN(curVm) || curVm < 0) {
          localStorage.setItem("view_mode", "1"); // Full 1×
          try {
            var cfg = JSON.parse(
              localStorage.getItem("starClientConfig") || "{}",
            );
            if (cfg && typeof cfg === "object") {
              if (!cfg.media) cfg.media = {};
              if (
                !cfg.media.viewportMode ||
                cfg.media.viewportMode === "dynamic"
              ) {
                cfg.media.viewportMode = "full1";
                localStorage.setItem("starClientConfig", JSON.stringify(cfg));
              }
            }
          } catch (eCfg) {}
          setViewModeLive(1);
        }
      }
    } catch (eCam) {}
    try {
      if (
        window.HaxDiscord &&
        typeof window.HaxDiscord.syncRoomPresence === "function"
      ) {
        window.HaxDiscord.syncRoomPresence();
      }
    } catch (eRpcIn) {}
  }

  function onMenu() {
    if (inRoomTransition() && !isInRoom()) {
      // Creating/joining: roomlist may flash before room-view — don't yank UI yet
      return;
    }
    if (inGameSession) {
      // A match can briefly unmount .game-view while idle/dialog/alt-tab.
      // Only return to the launcher when we are clearly out of room for longer.
      if (menuReturnTimer) clearTimeout(menuReturnTimer);
      menuReturnTimer = setTimeout(function () {
        menuReturnTimer = 0;
        if (isInRoom()) {
          enterInGameUi();
          return;
        }
        // Still in a live room session if roomlist is only buried under our iframe.
        var rl = document.querySelector(".roomlist-view");
        if (!rl) return;
        var rlVisible = false;
        try {
          var st = window.getComputedStyle(rl);
          rlVisible =
            st &&
            st.display !== "none" &&
            st.visibility !== "hidden" &&
            Number(st.opacity) > 0.05;
        } catch (eVis) {
          rlVisible = true;
        }
        if (!rlVisible) {
          // Roomlist exists but is hidden — treat as still in-session.
          return;
        }
        inGameSession = false;
        onMenu();
      }, 4000);
      return;
    }
    endRoomTransition();
    showMenu(true);
    ensureOverlay();
    setTimeout(function () {
      pushRooms(true);
    }, 300);
    try {
      if (
        window.HaxDiscord &&
        typeof window.HaxDiscord.updatePresence === "function"
      ) {
        window.HaxDiscord.updatePresence(null, null, true);
      }
    } catch (eRpcMenu) {}
  }

  function styleStarDialog(view) {
    if (!view) return;
    showVerifyMode(true);

    var dialog =
      view.querySelector(".dialog") ||
      view.querySelector(".basic-dialog") ||
      view;
    try {
      dialog.classList.add("star-verify-card");
    } catch (eCard) {}

    // Logo (same asset / stack as Discord–anonymous login)
    var logo = dialog.querySelector(".star-verify__logo");
    if (!logo) {
      logo = document.createElement("img");
      logo.className = "star-verify__logo";
      logo.src = "http://127.0.0.1:5483/ui/logos/starpng.png";
      logo.alt = "Star";
      try {
        dialog.insertBefore(logo, dialog.firstChild);
      } catch (eLogo) {}
    }

    // Title — same weight as nick label
    var title =
      dialog.querySelector('[data-hook="title"]') || dialog.querySelector("h1");
    if (title) {
      title.classList.add("star-verify__label");
      title.textContent = "Verificación";
    }

    var hint = dialog.querySelector(".star-verify__hint");
    if (!hint) {
      hint = document.createElement("p");
      hint.className = "star-verify__hint";
      hint.textContent = "Confirmá que sos humano para crear la sala";
      try {
        if (title && title.parentNode === dialog)
          dialog.insertBefore(hint, title.nextSibling);
        else dialog.appendChild(hint);
      } catch (eHint) {}
    }

    try {
      if (logo && logo.parentNode === dialog)
        dialog.insertBefore(logo, dialog.firstChild);
      if (title && title.parentNode === dialog) {
        dialog.insertBefore(title, logo ? logo.nextSibling : dialog.firstChild);
      }
      if (hint && hint.parentNode === dialog && title) {
        dialog.insertBefore(hint, title.nextSibling);
      }
    } catch (eOrd) {}

    var buttons = dialog.querySelector('[data-hook="buttons"]');
    if (buttons) {
      buttons.classList.add("star-verify__actions");
      try {
        var btns = buttons.querySelectorAll("button");
        for (var bi = 0; bi < btns.length; bi++) {
          var lab = String(btns[bi].textContent || "")
            .trim()
            .toLowerCase();
          if (
            lab === "ok" ||
            lab === "okay" ||
            lab === "continuar" ||
            lab === "continue"
          ) {
            btns[bi].textContent = "Continuar";
          }
        }
      } catch (eBtn) {}
    }

    var content = dialog.querySelector('[data-hook="content"]');
    if (content) tightenCaptchaShell(content);
    else tightenCaptchaShell(dialog);

    // Host-token tip (Google quota errors live inside a cross-origin iframe)
    try {
      var tip = dialog.querySelector(".star-verify__tip");
      if (!tip) {
        tip = document.createElement("p");
        tip.className = "star-verify__tip";
        tip.innerHTML =
          "Si el captcha falla (cuota de Google), poné un <strong>host token</strong> en Config → Multi y creá la sala sin verificación.";
        var insertAfter =
          dialog.querySelector(".star-verify__captcha") || hint || title;
        if (insertAfter && insertAfter.parentNode === dialog) {
          dialog.insertBefore(tip, insertAfter.nextSibling);
        } else {
          dialog.appendChild(tip);
        }
      }
    } catch (eTip) {}

    view.dataset.starStyled = "1";
  }

  function tightenCaptchaShell(content) {
    if (!content) return;
    var dialog = null;
    try {
      dialog = content.closest ? content.closest(".dialog") : null;
      if (!dialog) dialog = content.parentElement;
      content.classList.add("star-verify__panel", "star-verify__panel--bare");
      content.style.setProperty("min-height", "0", "important");
      content.style.setProperty("height", "auto", "important");
      content.style.setProperty("padding", "0", "important");
      content.style.setProperty("background", "transparent", "important");
      content.style.setProperty("border", "none", "important");
      content.style.setProperty("box-shadow", "none", "important");
    } catch (e) {}
    if (!dialog) return;

    // Search whole dialog: <p data-hook=content> cannot host a <div>, so captcha
    // often lives (or gets hoisted) as a sibling of the paragraph.
    var scope = dialog;
    var iframe =
      scope.querySelector('iframe[src*="recaptcha"]') ||
      scope.querySelector('iframe[src*="anchor"]') ||
      content.querySelector("iframe") ||
      scope.querySelector(".simple-dialog-view iframe, .dialog iframe");
    var grec = scope.querySelector(".g-recaptcha");
    if (!iframe && !grec) {
      var orphans = scope.querySelectorAll(".star-verify__captcha");
      for (var o = 0; o < orphans.length; o++) {
        if (!orphans[o].querySelector("iframe, .g-recaptcha")) {
          try {
            orphans[o].remove();
          } catch (e2) {}
        }
      }
      return;
    }

    // Prefer google widget root; never wrap the whole dialog
    var root = grec || iframe;
    if (grec && iframe && grec.contains(iframe)) root = grec;
    else if (
      iframe &&
      iframe.parentElement &&
      iframe.parentElement !== dialog &&
      iframe.parentElement !== content &&
      !(
        iframe.parentElement.classList &&
        iframe.parentElement.classList.contains("star-verify__captcha")
      )
    ) {
      var parent = iframe.parentElement;
      if (
        parent.offsetWidth >= 150 &&
        parent.offsetHeight > 0 &&
        parent.offsetHeight <= 220
      ) {
        root = parent;
      }
    }
    // If still nested under <p>, lift the innermost captcha node out
    if (root && content.contains(root)) {
      // keep root as grec/iframe — we'll move it into shell under .dialog
    }

    var buttons = dialog.querySelector('[data-hook="buttons"]');
    var shell = null;
    for (var ci = 0; ci < dialog.children.length; ci++) {
      if (
        dialog.children[ci].classList &&
        dialog.children[ci].classList.contains("star-verify__captcha")
      ) {
        shell = dialog.children[ci];
        break;
      }
    }
    if (!shell) shell = dialog.querySelector(".star-verify__captcha");
    if (!shell) {
      shell = document.createElement("div");
      shell.className = "star-verify__captcha";
    }
    // ALWAYS place shell as direct child of .dialog (valid host for <div>)
    if (shell.parentNode !== dialog) {
      if (buttons && buttons.parentNode === dialog)
        dialog.insertBefore(shell, buttons);
      else if (content.parentNode === dialog)
        dialog.insertBefore(shell, content.nextSibling);
      else dialog.appendChild(shell);
    }

    try {
      if (root && root.parentNode !== shell) {
        // Don't swallow title/buttons/logo
        if (
          root === dialog ||
          (root.classList &&
            (root.classList.contains("dialog") ||
              root.classList.contains("buttons") ||
              root.classList.contains("star-verify__logo") ||
              root.classList.contains("star-verify__hint")))
        ) {
          root = grec || iframe;
        }
        shell.appendChild(root);
      }
    } catch (e3) {}

    // Hide empty <p> once captcha moved out (avoids tall transparent gap)
    try {
      if (
        !content.querySelector("iframe, .g-recaptcha") &&
        !(content.textContent || "").trim()
      ) {
        content.style.setProperty("display", "none", "important");
      }
    } catch (e4) {}

    // Kill duplicate empty shells
    var allShells = dialog.querySelectorAll(".star-verify__captcha");
    for (var s = 0; s < allShells.length; s++) {
      if (
        allShells[s] !== shell &&
        !allShells[s].querySelector("iframe, .g-recaptcha")
      ) {
        try {
          allShells[s].remove();
        } catch (e5) {}
      }
    }

    function paintShell() {
      if (!shell || !shell.isConnected) return;
      var frames = shell.querySelectorAll("iframe");
      var h = 78;
      var w = 304;
      var bestH = 0;
      var bestW = 0;
      for (var f = 0; f < frames.length; f++) {
        var fh =
          frames[f].offsetHeight ||
          parseInt(frames[f].getAttribute("height"), 10) ||
          0;
        var fw =
          frames[f].offsetWidth ||
          parseInt(frames[f].getAttribute("width"), 10) ||
          0;
        if (fh > bestH && fh < 220) {
          bestH = fh;
          bestW = fw;
        }
      }
      var grecBox = shell.querySelector(".g-recaptcha");
      if (grecBox) {
        var gh = grecBox.offsetHeight || 0;
        var gw = grecBox.offsetWidth || 0;
        if (gh > bestH && gh < 220) bestH = gh;
        if (gw > bestW) bestW = gw;
      }
      if (bestH > 0) h = bestH;
      if (bestW > 0) w = bestW;

      var pad = 0;
      shell.style.setProperty("display", "flex", "important");
      shell.style.setProperty("align-items", "center", "important");
      shell.style.setProperty("justify-content", "center", "important");
      shell.style.setProperty("box-sizing", "border-box", "important");
      shell.style.setProperty("width", "100%", "important");
      shell.style.setProperty("height", "auto", "important");
      shell.style.setProperty(
        "min-height",
        Math.max(78, h) + "px",
        "important",
      );
      shell.style.setProperty("max-width", "100%", "important");
      shell.style.setProperty("padding", pad + "px", "important");
      shell.style.setProperty("margin", "0", "important");
      shell.style.setProperty("overflow", "visible", "important");
      shell.style.setProperty("line-height", "normal", "important");
      shell.style.setProperty("background", "transparent", "important");
      shell.style.setProperty("border", "none", "important");
      shell.style.setProperty("border-radius", "0", "important");
      shell.style.setProperty("backdrop-filter", "none", "important");
      shell.style.setProperty("-webkit-backdrop-filter", "none", "important");
      shell.style.setProperty("box-shadow", "none", "important");
      shell.style.setProperty("flex", "0 0 auto", "important");
      shell.style.setProperty("align-self", "center", "important");
      shell.style.setProperty("position", "relative", "important");
      shell.style.setProperty("z-index", "2", "important");
    }
    paintShell();
    setTimeout(paintShell, 50);
    setTimeout(paintShell, 250);
    setTimeout(paintShell, 800);
  }

  function hasRecaptchaChallenge() {
    try {
      // Only the Google challenge popup (bframe) — never the checkbox anchor
      return !!document.querySelector('iframe[src*="bframe"]');
    } catch (e) {
      return false;
    }
  }

  function watchNativeDialogs() {
    var applyTimer = null;
    var apply = function () {
      var challengeOpen = hasRecaptchaChallenge();
      var views = document.querySelectorAll(".simple-dialog-view");
      for (var i = 0; i < views.length; i++) {
        if (views[i].dataset.starStyled !== "1") styleStarDialog(views[i]);
        else if (
          !document.documentElement.classList.contains("star-verify-mode")
        ) {
          // Already styled — never re-wrap captcha (breaks Google widget)
          showVerifyMode(true);
        }
        if (challengeOpen) {
          try {
            document.documentElement.classList.add("star-captcha-challenge");
          } catch (eCh) {}
        } else {
          try {
            document.documentElement.classList.remove("star-captcha-challenge");
          } catch (eCh2) {}
        }
      }
      if (!views.length) {
        // Never clear star-native-dialog while Pick/Leave/Link/Kick is open
        // (those are NOT .simple-dialog-view — clearing here re-showed the iframe on top)
        var roomDlg =
          document.querySelector(".pick-stadium-view") ||
          document.querySelector(".leave-room-view") ||
          document.querySelector(".room-link-view") ||
          document.querySelector(".kick-player-view");
        if (!roomDlg) {
          try {
            document.documentElement.classList.remove("star-native-dialog");
          } catch (e) {}
        }
        try {
          document.documentElement.classList.remove("star-captcha-challenge");
        } catch (e2) {}
        // Native host create/join owns the UI — don't force Star verify off/on
        if (awaitingNativeDialog || inRoomTransition()) return;
        if (document.documentElement.classList.contains("star-verify-mode")) {
          showVerifyMode(false);
        }
      }
    };
    var schedule = function () {
      if (applyTimer) return;
      applyTimer = setTimeout(function () {
        applyTimer = null;
        apply();
      }, 60);
    };
    apply();
    try {
      var obs = new MutationObserver(schedule);
      obs.observe(document.documentElement, { childList: true, subtree: true });
    } catch (e) {
      setInterval(apply, 500);
    }
  }

  Injector.injectCSS(
    "star-menu-bridge-css",
    "html.star-ui-active .roomlist-view," +
      "html.star-ui-active .choose-nickname-view," +
      "html.star-ui-active .create-room-view," +
      "html.star-ui-active .room-password-view {" +
      "opacity:0!important;pointer-events:none!important;" +
      "}" +
      "#star-menu-frame{" +
      "background:transparent!important;background-color:transparent!important;" +
      "color-scheme:normal!important;border:0!important;" +
      "}" +
      /* In-match: never let the Star iframe paint an opaque backdrop over the pitch */
      "html.star-ingame-hud #star-menu-frame{" +
      "background:transparent!important;background-color:rgba(0,0,0,0)!important;" +
      "opacity:1!important;visibility:visible!important;" +
      "pointer-events:none!important;" +
      "}" +
      "html.star-ingame-hud.star-mods-overlay:not(.star-native-dialog) #star-menu-frame," +
      "html.star-ingame-hud.star-room-ui:not(.star-native-dialog) #star-menu-frame," +
      "html.star-room-ui:not(.star-native-dialog) #star-menu-frame{" +
      "pointer-events:auto!important;" +
      "opacity:1!important;" +
      "visibility:visible!important;" +
      "}" +
      "html.star-ui-active body{overflow:hidden!important;}" +
      "html.star-ingame-hud," +
      "html.star-ingame-hud body{" +
      "background:transparent!important;" +
      "}" +
      /* Captcha / native dialogs always on top of Star while creating */
      "html.star-ui-active .simple-dialog-view{" +
      "opacity:1!important;visibility:visible!important;pointer-events:auto!important;" +
      "position:fixed!important;inset:0!important;z-index:2147483646!important;" +
      "display:flex!important;align-items:center!important;justify-content:center!important;" +
      "}" +
      "#star-menu-frame.star-under-native{" +
      "opacity:0!important;visibility:hidden!important;pointer-events:none!important;z-index:0!important;" +
      "}" +
      /* Hide native top scoreboard when Star Match Block is on */
      "html.star-hide-native-score .bar-container," +
      "html.star-hide-native-score .bar-container .bar," +
      "html.star-hide-native-score .bar-container .scoreboard," +
      'html.star-hide-native-score .bar-container [data-hook="timer"]{' +
      "visibility:hidden!important;opacity:0!important;pointer-events:none!important;" +
      "height:0!important;overflow:hidden!important;" +
      "}" +
      "html.star-mods-overlay::before{" +
      'content:\"\";position:fixed;inset:0;z-index:2147482999;pointer-events:none;' +
      "background:rgba(0,0,0,0.22);" +
      "}" +
      /* Custom Space roomPanel retired — native .room-view stays visible */
      "html.star-room-ui #star-menu-frame{" +
      "pointer-events:none!important;" +
      "}" +
      /* Verify mode: Star backdrop under captcha — dialog MUST stay on top */
      "html.star-verify-mode #star-menu-frame{" +
      "display:block!important;opacity:1!important;visibility:visible!important;" +
      "pointer-events:none!important;z-index:2147482000!important;" +
      "}" +
      "html.star-verify-mode .simple-dialog-view," +
      "html.star-ui-active .simple-dialog-view{" +
      "position:fixed!important;inset:0!important;z-index:2147483646!important;" +
      "display:flex!important;align-items:center!important;justify-content:center!important;" +
      "margin:0!important;padding:24px!important;box-sizing:border-box!important;" +
      "opacity:1!important;visibility:visible!important;pointer-events:auto!important;" +
      "background:transparent!important;" +
      "}" +
      "html.star-verify-mode .simple-dialog-view .dialog," +
      "html.star-verify-mode .simple-dialog-view .dialog.star-verify-card{" +
      "opacity:1!important;visibility:visible!important;pointer-events:auto!important;" +
      "}" +
      "html.star-verify-mode," +
      "html.star-verify-mode body{background:transparent!important;}" +
      /* Google challenge portal must beat our dialog (2147483646) */
      "html.star-captcha-challenge .simple-dialog-view," +
      "html.star-verify-mode.star-captcha-challenge .simple-dialog-view{" +
      "pointer-events:none!important;" +
      "}" +
      "html.star-captcha-challenge .simple-dialog-view .dialog{" +
      "pointer-events:none!important;" +
      "}" +
      'body > div[style*="z-index: 2000000000"],' +
      'body > div[style*="z-index:2000000000"],' +
      'iframe[src*="bframe"]{' +
      "z-index:2147483647!important;" +
      "}" +
      /* Keep pitch sharp / full-bleed in Electron */
      "html.star-ingame-hud .game-state-view," +
      "html.star-ingame-hud .game-state-view .canvas," +
      "html.star-ingame-hud .game-state-view canvas{" +
      "width:100%!important;height:100%!important;" +
      "image-rendering:auto!important;" +
      "}" +
      "html.star-ingame-hud .gameplay-section{" +
      "background:transparent!important;" +
      "}" +
      /* Card = same stack as Discord/anonymous login (no heavy modal) */
      ".simple-dialog-view .dialog.star-verify-card," +
      ".simple-dialog-view .dialog.basic-dialog.star-verify-card{" +
      "width:min(360px,92vw)!important;margin:0!important;padding:0!important;" +
      "background:transparent!important;border:none!important;border-radius:0!important;" +
      "box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;" +
      "display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:12px!important;" +
      "color:#fff!important;box-sizing:border-box!important;" +
      "}" +
      ".star-verify__logo{" +
      "width:88px!important;height:auto!important;display:block!important;" +
      "filter:drop-shadow(0 10px 28px rgba(0,0,0,0.4))!important;" +
      "pointer-events:none!important;margin:0 auto 8px!important;" +
      "}" +
      ".star-verify__label," +
      ".simple-dialog-view h1.star-verify__label," +
      '.simple-dialog-view h1[data-hook="title"]{' +
      "margin:0!important;padding:0!important;border:none!important;" +
      "font-size:13px!important;font-weight:400!important;letter-spacing:0.14em!important;" +
      "text-transform:uppercase!important;text-align:center!important;" +
      "color:rgba(255,255,255,0.55)!important;" +
      "text-shadow:0 1px 8px rgba(0,0,0,0.35)!important;" +
      "}" +
      ".star-verify__hint{" +
      "margin:0!important;max-width:300px!important;align-self:center!important;" +
      "font-size:13px!important;line-height:1.4!important;text-align:center!important;" +
      "color:rgba(255,255,255,0.62)!important;" +
      "}" +
      ".star-verify__tip{" +
      "margin:0!important;padding:0!important;max-width:300px!important;align-self:center!important;" +
      "background:transparent!important;border:none!important;" +
      "font-size:11px!important;line-height:1.45!important;text-align:center!important;" +
      "color:rgba(255,255,255,0.42)!important;" +
      "}" +
      ".star-verify__tip strong{color:rgba(255,255,255,0.7)!important;font-weight:600!important;}" +
      ".star-verify__panel," +
      '.simple-dialog-view [data-hook="content"].star-verify__panel{' +
      "width:100%!important;max-width:100%!important;margin:0!important;padding:0!important;" +
      "min-height:0!important;height:auto!important;align-self:stretch!important;" +
      "display:flex!important;flex-direction:column!important;align-items:center!important;" +
      "justify-content:flex-start!important;gap:8px!important;" +
      "background:transparent!important;border:none!important;border-radius:0!important;" +
      "box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;" +
      "color:rgba(255,255,255,0.7)!important;font-size:14px!important;text-align:center!important;" +
      "}" +
      ".star-verify__panel--bare{background:transparent!important;border:none!important;padding:0!important;min-height:0!important;}" +
      /* Captcha alone — no nested dark frame (lets Google widget breathe) */
      ".star-verify__captcha{" +
      "display:flex!important;align-items:center!important;justify-content:center!important;" +
      "box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:78px!important;" +
      "margin:0!important;padding:0!important;line-height:normal!important;" +
      "background:transparent!important;border:none!important;border-radius:0!important;" +
      "backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:none!important;" +
      "overflow:visible!important;flex:0 0 auto!important;align-self:center!important;" +
      "position:relative!important;z-index:2!important;" +
      "}" +
      ".star-verify__captcha > *{" +
      "margin:0 auto!important;" +
      "}" +
      ".star-verify__captcha iframe," +
      ".star-verify__captcha .g-recaptcha{" +
      "display:block!important;margin:0 auto!important;max-width:100%!important;" +
      "vertical-align:top!important;border-radius:4px!important;" +
      "}" +
      /* kill HaxBall default tall content box */
      '.simple-dialog-view p[data-hook="content"],' +
      '.simple-dialog-view [data-hook="content"]{' +
      "min-height:0!important;height:auto!important;overflow:visible!important;" +
      "}" +
      ".star-verify__actions," +
      ".simple-dialog-view .buttons.star-verify__actions{" +
      "width:min(300px,100%)!important;align-self:center!important;" +
      "display:flex!important;flex-direction:column!important;gap:10px!important;margin:4px 0 0!important;" +
      "}" +
      ".star-verify__actions button," +
      ".simple-dialog-view .buttons.star-verify__actions button{" +
      "width:100%!important;height:44px!important;min-width:0!important;padding:0 18px!important;" +
      "border:none!important;border-radius:10px!important;" +
      "background:#07f361!important;color:#04140a!important;" +
      "font-size:15px!important;font-weight:400!important;letter-spacing:0.04em!important;" +
      "cursor:pointer!important;box-shadow:0 8px 22px rgba(7,243,97,0.22)!important;" +
      "}" +
      ".star-verify__actions button:hover{filter:brightness(1.05);}" +
      ".simple-dialog-view iframe,.simple-dialog-view .g-recaptcha{" +
      "margin:0 auto!important;display:block!important;" +
      "}" +
      'html.star-verify-mode .version,html.star-verify-mode [class*="version"]{opacity:0!important;}' +
      /* Kill native HaxBall settings — Space Config replaces it */
      ".settings-view,.dialog.settings-view,#settings-sidebar-panel{" +
      "display:none!important;visibility:hidden!important;pointer-events:none!important;" +
      "opacity:0!important;height:0!important;width:0!important;overflow:hidden!important;" +
      "}" +
      'button[data-hook="settings"]{display:none!important;}' +
      "html.star-no-text .chatbox-view .log," +
      "html.star-no-text .player-list-item .name{" +
      "font-size:0!important;color:transparent!important;" +
      "}",
  );

  window.addEventListener("message", onMessage);

  Injector.onView("roomlist-view", function () {
    onMenu();
    tryAutoNick();
    ensureNativeRoomFiltersOn();
    setTimeout(function () {
      pushRooms(true);
    }, 150);
    setTimeout(function () {
      pushRooms(true);
    }, 600);
    setTimeout(function () {
      pushRooms(true);
    }, 1500);
  });
  Injector.onView("choose-nickname-view", function () {
    if (inGameSession || isInRoom()) return;
    showMenu(true);
    ensureOverlay();
    setTimeout(tryAutoNick, 50);
    setTimeout(tryAutoNick, 400);
  });
  Injector.onView("simple-dialog-view", function (el) {
    styleStarDialog(el || document.querySelector(".simple-dialog-view"));
  });
  Injector.onViewLeave("simple-dialog-view", function () {
    try {
      document.documentElement.classList.remove("star-native-dialog");
    } catch (e) {}
    showVerifyMode(false);
    // showVerifyMode(false) already waits for room during create/join —
    // do not force onMenu() in the same tick (race before room-view mounts).
  });
  Injector.onView("room-view", onInGame);
  Injector.onView("game-view", onInGame);
  Injector.onViewLeave("room-view", function () {
    if (document.querySelector(".create-room-view")) return;
    if (document.querySelector(".simple-dialog-view")) return;
    if (inRoomTransition()) return;
    if (inGameSession) {
      // Defer to onMenu debounce — don't snap to launcher on brief unmount.
      onMenu();
      return;
    }
    if (
      !document.querySelector(".game-view") &&
      !document.querySelector(".room-view")
    )
      onMenu();
  });
  Injector.onViewLeave("game-view", function () {
    if (document.querySelector(".create-room-view")) return;
    if (document.querySelector(".simple-dialog-view")) return;
    if (inRoomTransition()) return;
    if (inGameSession) {
      onMenu();
      return;
    }
    if (
      !document.querySelector(".game-view") &&
      !document.querySelector(".room-view")
    )
      onMenu();
  });

  Injector.onView("settings-view", function () {
    killNativeSettings();
    openStarConfig();
  });

  Injector.waitForElement("body").then(function () {
    injectPageWorldCreateBridge();
    injectPageWorldRoomBridge();
    ensureOverlay();
    tryAutoNick();
    watchNativeDialogs();
    startHudFeed();
    blockNativeSettingsClicks();
    installChatShortcutExpander();
    installInputBindsHandler();
    document.addEventListener("keydown", reclaimGameFocusIfNeeded, true);
    installRoomMenuFocusGuard();
    installRoomMenuInterceptor();
    rehydrateStarConfigFromLs();
    killNativeSettings();
    try {
      var obsSettings = new MutationObserver(function () {
        if (document.querySelector(".settings-view")) killNativeSettings();
      });
      obsSettings.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    } catch (eObs) {
      setInterval(function () {
        if (document.querySelector(".settings-view")) killNativeSettings();
      }, 400);
    }
    document.addEventListener(
      "keydown",
      function (e) {
        if (e.key !== "Escape" && e.code !== "Escape" && e.keyCode !== 27)
          return;
        onEscapeInRoom(e);
      },
      true,
    );
    roomsPollTimer = setInterval(function () {
      // Keep scraping whenever native roomlist exists (even if Star menu is idle)
      if (document.querySelector(".roomlist-view")) pushRooms(false);
      if (menuVisible) tryAutoNick();
    }, 1500);
  });

  // (HUD score/keys/ping feed lives in startHudFeed)
})();
