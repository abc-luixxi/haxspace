(function () {
  if (Injector.isMainFrame()) {
    return;
  }

  function translate(text) {
    return window.__t ? window.__t(text) : text;
  }

  var visibilitySettings = {
    hideChat: false,
    hideScoreboard: false,
    hidePingFps: false,
  };
  var applyInterval = null;

  function hasHiddenElements() {
    return (
      visibilitySettings.hideChat ||
      visibilitySettings.hideScoreboard ||
      visibilitySettings.hidePingFps
    );
  }

  function startApplyInterval() {
    if (applyInterval || !hasHiddenElements()) {
      return;
    }
    applyInterval = setInterval(applyVisibilitySettings, 1000);
  }

  function stopApplyInterval() {
    if (applyInterval) {
      clearInterval(applyInterval);
      applyInterval = null;
    }
  }

  function syncApplyInterval() {
    if (hasHiddenElements()) {
      startApplyInterval();
    } else {
      stopApplyInterval();
    }
  }

  function loadVisibilitySettings() {
    try {
      var savedSettings = localStorage.getItem("hideui_settings");
      if (savedSettings) {
        var parsedSettings = JSON.parse(savedSettings);
        visibilitySettings.hideChat = parsedSettings.hideChat || false;
        visibilitySettings.hideScoreboard = parsedSettings.hideScoreboard || false;
        visibilitySettings.hidePingFps = parsedSettings.hidePingFps || false;
      }
    } catch (error) {}
  }

  function saveVisibilitySettings() {
    try {
      localStorage.setItem("hideui_settings", JSON.stringify(visibilitySettings));
    } catch (error) {}
  }

  function applyVisibilitySettings() {
    var chatBox = document.querySelector(".chatbox-view");
    if (chatBox) {
      chatBox.style.visibility = visibilitySettings.hideChat ? "hidden" : "";
      chatBox.style.pointerEvents = visibilitySettings.hideChat ? "none" : "";
    }

    var scoreboard = document.querySelector(".bar-container");
    if (scoreboard) {
      scoreboard.style.visibility = visibilitySettings.hideScoreboard
        ? "hidden"
        : "";
      scoreboard.style.pointerEvents = visibilitySettings.hideScoreboard
        ? "none"
        : "";
    }

    var gameTimer = document.querySelector(".game-timer-view");
    if (gameTimer) {
      gameTimer.style.display = visibilitySettings.hideScoreboard ? "none" : "";
    }

    var pingAndFps = document.querySelector(".stats-view");
    if (pingAndFps) {
      pingAndFps.style.visibility = visibilitySettings.hidePingFps
        ? "hidden"
        : "";
      pingAndFps.style.pointerEvents = visibilitySettings.hidePingFps
        ? "none"
        : "";
    }
  }

  function createToggle(id, label, enabled, onChange) {
    var toggle = document.createElement("div");
    toggle.setAttribute("data-hook", id);
    toggle.id = id;
    toggle.classList.add("toggle");
    toggle.style.cssText = "cursor: pointer;";

    var icon = document.createElement("i");
    icon.classList.add(enabled ? "icon-ok" : "icon-cancel");

    var text = document.createElement("span");
    text.textContent = label;

    toggle.appendChild(icon);
    toggle.appendChild(text);
    toggle.onclick = function () {
      enabled = !enabled;
      icon.classList.toggle("icon-ok", enabled);
      icon.classList.toggle("icon-cancel", !enabled);
      onChange(enabled);
    };
    return toggle;
  }

  function addVisibilityToggles() {
    var miscSection = document.querySelector('[data-hook="miscsec"]');
    if (!miscSection || miscSection.querySelector("#hideui-chat")) {
      return;
    }

    var showChatToggle = miscSection.querySelector('[data-hook="tmisc-showchat"]');
    if (!showChatToggle) {
      return;
    }

    var hideChatToggle = createToggle(
      "hideui-chat",
      translate("Ocultar Chat"),
      visibilitySettings.hideChat,
      function (isHidden) {
        visibilitySettings.hideChat = isHidden;
        saveVisibilitySettings();
        applyVisibilitySettings();
        syncApplyInterval();
      },
    );
    showChatToggle.parentNode.insertBefore(hideChatToggle, showChatToggle.nextSibling);

    var hideScoreboardToggle = createToggle(
      "hideui-scoreboard",
      translate("Ocultar Placar/Timer"),
      visibilitySettings.hideScoreboard,
      function (isHidden) {
        visibilitySettings.hideScoreboard = isHidden;
        saveVisibilitySettings();
        applyVisibilitySettings();
        syncApplyInterval();
      },
    );
    hideChatToggle.parentNode.insertBefore(
      hideScoreboardToggle,
      hideChatToggle.nextSibling,
    );

    var hidePingFpsToggle = createToggle(
      "hideui-pingfps",
      translate("Ocultar Ping/FPS"),
      visibilitySettings.hidePingFps,
      function (isHidden) {
        visibilitySettings.hidePingFps = isHidden;
        saveVisibilitySettings();
        applyVisibilitySettings();
        syncApplyInterval();
      },
    );
    hideScoreboardToggle.parentNode.insertBefore(
      hidePingFpsToggle,
      hideScoreboardToggle.nextSibling,
    );
  }

  function observeSettingsDialog() {
    var dialogObserver = new MutationObserver(function () {
      if (document.querySelector(".dialog.settings-view")) {
        addVisibilityToggles();
      }
    });
    dialogObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    var miscSectionObserver = new MutationObserver(function () {
      var miscSection = document.querySelector('[data-hook="miscsec"]');
      if (miscSection && miscSection.classList.contains("selected")) {
        setTimeout(addVisibilityToggles, 100);
      }
    });

    var waitForSettings = setInterval(function () {
      var miscSection = document.querySelector('[data-hook="miscsec"]');
      var tabContents = document.querySelector(".tabcontents");
      if (!miscSection || !tabContents) {
        return;
      }

      clearInterval(waitForSettings);
      miscSectionObserver.observe(miscSection, {
        attributes: true,
        attributeFilter: ["class"],
      });
      miscSectionObserver.observe(tabContents, {
        childList: true,
        subtree: true,
      });

      var tabs = document.querySelector(".tabs");
      if (tabs) {
        var miscButton = tabs.querySelector('[data-hook="miscbtn"]');
        if (miscButton) {
          var replacementButton = miscButton.cloneNode(true);
          miscButton.parentNode.replaceChild(replacementButton, miscButton);
          replacementButton.addEventListener("click", function () {
            setTimeout(addVisibilityToggles, 150);
          });
        }

        var sidebar = document.getElementById("settings-sidebar-panel");
        if (sidebar) {
          var sidebarMiscButton = sidebar.querySelector('[data-hook-ref="miscbtn"]');
          if (sidebarMiscButton) {
            sidebarMiscButton.addEventListener("click", function () {
              setTimeout(addVisibilityToggles, 200);
            });
          }
        }
      }
    }, 500);
  }

  function startSettingsFallback() {
    setInterval(function () {
      var settingsDialog = document.querySelector(".dialog.settings-view");
      if (!settingsDialog) {
        return;
      }

      addVisibilityToggles();
      var sidebar = document.getElementById("settings-sidebar-panel");
      if (!sidebar) {
        return;
      }

      var sidebarMiscButton = sidebar.querySelector('[data-hook-ref="miscbtn"]');
      if (sidebarMiscButton && !sidebarMiscButton.dataset.hideuiListener) {
        sidebarMiscButton.dataset.hideuiListener = "true";
        sidebarMiscButton.addEventListener("click", function () {
          setTimeout(addVisibilityToggles, 200);
        });
      }
    }, 1000);
  }

  function initializeHideUi() {
    if (!Injector.isGameFrame()) {
      return;
    }

    loadVisibilitySettings();
    setTimeout(function () {
      applyVisibilitySettings();
      observeSettingsDialog();
      startSettingsFallback();
      syncApplyInterval();
    }, 2000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeHideUi);
  } else {
    initializeHideUi();
  }
})();
