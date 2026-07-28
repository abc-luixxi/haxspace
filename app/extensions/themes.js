(function () {
  if (Injector.isMainFrame()) {
    return;
  }

  function translate(text) {
    return window.__t ? window.__t(text) : text;
  }

  var themes = {
    default: { nameKey: "PadrÃ£o", colors: {} },
    dark: {
      nameKey: "Escuro",
      colors: {
        "--theme-bg-primary": "#141414",
        "--theme-bg-secondary": "#1a1a1a",
        "--theme-bg-tertiary": "#272727",
        "--theme-bg-hover": "#333",
        "--theme-bg-selected": "#222",
        "--theme-border": "#232323",
        "--theme-border-light": "#333",
        "--theme-text-primary": "#fff",
        "--theme-text-secondary": "#888",
        "--theme-text-muted": "#666",
        "--theme-scrollbar-track": "#1a1a1a",
        "--theme-scrollbar-thumb": "#555",
        "--theme-scrollbar-thumb-hover": "#666",
        "--theme-tooltip-bg": "#222",
        "--theme-tooltip-border": "#333",
      },
    },
    light: {
      nameKey: "Claro",
      colors: {
        "--theme-bg-primary": "#f5f5f5",
        "--theme-bg-secondary": "#ffffff",
        "--theme-bg-tertiary": "#e8e8e8",
        "--theme-bg-hover": "#ddd",
        "--theme-bg-selected": "#d0d0d0",
        "--theme-border": "#ccc",
        "--theme-border-light": "#ddd",
        "--theme-text-primary": "#1a1a1a",
        "--theme-text-secondary": "#666",
        "--theme-text-muted": "#999",
        "--theme-scrollbar-track": "#f0f0f0",
        "--theme-scrollbar-thumb": "#bbb",
        "--theme-scrollbar-thumb-hover": "#999",
        "--theme-tooltip-bg": "#fff",
        "--theme-tooltip-border": "#ddd",
      },
    },
    onix: {
      nameKey: "Onix",
      colors: {
        "--theme-bg-primary": "#000000",
        "--theme-bg-secondary": "#000000",
        "--theme-bg-tertiary": "#0a0a0a",
        "--theme-bg-hover": "#111111",
        "--theme-bg-selected": "#0d0d0d",
        "--theme-border": "#1a1a1a",
        "--theme-border-light": "#222222",
        "--theme-text-primary": "#ffffff",
        "--theme-text-secondary": "#888888",
        "--theme-text-muted": "#555555",
        "--theme-scrollbar-track": "#000000",
        "--theme-scrollbar-thumb": "#333333",
        "--theme-scrollbar-thumb-hover": "#444444",
        "--theme-tooltip-bg": "#0a0a0a",
        "--theme-tooltip-border": "#1a1a1a",
      },
    },
  };
  var storageKey = "haxball-theme";
  var currentTheme = "dark";
  var themeCssVariables = [
    "--theme-bg-primary",
    "--theme-bg-secondary",
    "--theme-bg-tertiary",
    "--theme-bg-hover",
    "--theme-bg-selected",
    "--theme-border",
    "--theme-border-light",
    "--theme-text-primary",
    "--theme-text-secondary",
    "--theme-text-muted",
    "--theme-scrollbar-track",
    "--theme-scrollbar-thumb",
    "--theme-scrollbar-thumb-hover",
    "--theme-tooltip-bg",
    "--theme-tooltip-border",
  ];

  function loadTheme() {
    try {
      var savedTheme = localStorage.getItem(storageKey);
      if (savedTheme && themes[savedTheme]) {
        currentTheme = savedTheme;
      }
    } catch (error) {}
    return currentTheme;
  }

  function saveTheme(themeId) {
    try {
      localStorage.setItem(storageKey, themeId);
    } catch (error) {}
  }

  function applyTheme(themeId) {
    if (!themes[themeId]) {
      return;
    }

    currentTheme = themeId;
    saveTheme(themeId);

    var root = document.documentElement;
    if (themeId === "default") {
      for (var index = 0; index < themeCssVariables.length; index++) {
        root.style.removeProperty(themeCssVariables[index]);
      }
    } else {
      var colors = themes[themeId].colors;
      for (var property in colors) {
        root.style.setProperty(property, colors[property]);
      }
    }

    root.setAttribute("data-theme", themeId);
    document.body.setAttribute("data-theme", themeId);
    window.dispatchEvent(
      new CustomEvent("themeChanged", { detail: { theme: themeId } }),
    );

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "themeChanged", theme: themeId }, "*");
    }
    Injector.log("Theme applied: " + themeId);
  }

  function getCurrentTheme() {
    return currentTheme;
  }

  function getThemes() {
    var translatedThemes = {};
    for (var themeId in themes) {
      translatedThemes[themeId] = {
        name: translate(themes[themeId].nameKey),
        colors: themes[themeId].colors,
      };
    }
    return translatedThemes;
  }

  function toggleTheme() {
    var themeIds = Object.keys(themes);
    var currentIndex = themeIds.indexOf(currentTheme);
    var nextTheme = themeIds[(currentIndex + 1) % themeIds.length];
    applyTheme(nextTheme);
    return nextTheme;
  }

  function initializeThemes() {
    loadTheme();
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (document.body) {
      applyTheme(currentTheme);
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        applyTheme(currentTheme);
      });
    }
    Injector.log("Themes module loaded");
  }

  window.HaxThemes = {
    apply: applyTheme,
    toggle: toggleTheme,
    getCurrent: getCurrentTheme,
    getThemes: getThemes,
    THEMES: themes,
  };
  initializeThemes();
})();
