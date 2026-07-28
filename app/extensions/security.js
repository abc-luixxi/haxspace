(function () {
  "use strict";

  document.addEventListener(
    "keydown",
    function (event) {
      if (event.ctrlKey && event.key.toUpperCase() === "C") {
        var selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
          return;
        }
      }

      if (event.ctrlKey && event.key.toUpperCase() === "V") {
        var targetTagName = event.target.tagName;
        if (targetTagName === "INPUT" || targetTagName === "TEXTAREA") {
          return;
        }
      }

      var blocksDeveloperTools = event.key === "F12" || event.keyCode === 123;
      var blocksDeveloperShortcuts =
        event.ctrlKey &&
        event.shiftKey &&
        ["I", "J", "C"].includes(event.key.toUpperCase());
      var blocksViewSource = event.ctrlKey && event.key.toUpperCase() === "U";

      if (blocksDeveloperTools || blocksDeveloperShortcuts || blocksViewSource) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
      }

      if (event.ctrlKey && event.key.toUpperCase() === "S") {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }

      if (
        event.ctrlKey &&
        !event.shiftKey &&
        ["T", "N"].includes(event.key.toUpperCase())
      ) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }

      if (event.ctrlKey && ["0", "+", "=", "-", "_"].includes(event.key)) {
        return;
      }
    },
    true,
  );

  document.addEventListener(
    "contextmenu",
    function (event) {
      var element = event.target;
      while (element && element !== document.body) {
        if (element.dataset && element.dataset.hook === "listscroll") {
          return;
        }

        if (element.classList) {
          var className = element.className;
          var isPlayerListItem =
            typeof className === "string" &&
            className.indexOf("player-list-item") !== -1 &&
            element.dataset &&
            element.dataset.playerId;
          if (isPlayerListItem) {
            return;
          }
        }
        element = element.parentElement;
      }

      event.preventDefault();
      event.stopPropagation();
      return false;
    },
    true,
  );

  window.addEventListener("beforeunload", function (event) {
    if (window.location.href.indexOf("blob:") === 0) {
      event.preventDefault();
      return false;
    }
  });

  document.addEventListener(
    "click",
    function (event) {
      var link = event.target;
      while (link && link.tagName !== "A") {
        link = link.parentElement;
      }
      if (!link || !link.href) {
        return;
      }

      var url = link.href;
      var isChatLink =
        link.closest(".log-contents") ||
        link.closest(".chatbox-view") ||
        link.closest(".log");
      if (isChatLink) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
      }

      if (url.startsWith("javascript:") || url.startsWith("#") || url === "") {
        return;
      }
      if (url.indexOf("haxball.com/play") !== -1 && url.indexOf("?c=") !== -1) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ action: "openExternalLink", url: url });
      }
      return false;
    },
    true,
  );

  if (!Injector.isMainFrame()) {
    Injector.injectCSS(
      "security-css",
      "html, body { overflow: hidden !important; } ::-webkit-scrollbar { display: none !important; } body, div:not(.chatbox-view):not(.log):not(.log-contents), span, button, label, h1, h2, h3, table, tr, td, th, canvas, svg, img { user-select: none !important; -webkit-user-select: none !important; } .chatbox-view, .chatbox-view-contents, .log, .log-contents, .log-contents p, .chatbox-view p { user-select: text !important; -webkit-user-select: text !important; } input, textarea { user-select: text !important; -webkit-user-select: text !important; }",
    );
  }

  if (Injector.isMainFrame()) {
    try {
      var pageTitle = (document.title || "").toLowerCase();
      var isChallengePage =
        pageTitle.indexOf("just a moment") !== -1 ||
        pageTitle.indexOf("un momento") !== -1;
      if (!isChallengePage) {
        var left = screen.availLeft || 0;
        var top = screen.availTop || 0;
        var centeredLeft = left + Math.round((screen.availWidth - window.outerWidth) / 2);
        var centeredTop = top + Math.round((screen.availHeight - window.outerHeight) / 2);
        window.moveTo(centeredLeft, centeredTop);
      }
    } catch (error) {}
  }

  Injector.log("Security loaded");
})();
