(function () {
  var storageKey = "stretched_resolution";

  function translate(text) {
    return window.__t ? window.__t(text) : text;
  }

  var resolutionOptions = [
    { label: "Nativo", width: 0, height: 0 },
    { label: "800x600 (4:3)", width: 800, height: 600 },
    { label: "1024x768 (4:3)", width: 1024, height: 768 },
    { label: "1280x960 (4:3)", width: 1280, height: 960 },
    { label: "1280x1024 (5:4)", width: 1280, height: 1024 },
    { label: "1440x1080 (4:3)", width: 1440, height: 1080 },
  ];

  function loadResolution() {
    try {
      var savedResolution = localStorage.getItem(storageKey);
      if (savedResolution) {
        return JSON.parse(savedResolution);
      }
    } catch (error) {}

    return { width: 0, height: 0 };
  }

  function saveResolution(width, height) {
    localStorage.setItem(storageKey, JSON.stringify({ width: width, height: height }));
  }

  function addResolutionSelector() {
    var videoSection = document.querySelector('[data-hook="videosec"]');
    if (!videoSection) {
      return false;
    }
    if (document.getElementById("stretched-res-row")) {
      return true;
    }

    var resolutionRow = document.createElement("div");
    resolutionRow.id = "stretched-res-row";
    resolutionRow.innerHTML =
      translate("Esticar") +
      ':<select id="stretched-res-select" style="margin-left:8px;"></select>';

    var resolutionSelect = resolutionRow.querySelector("select");
    var selectedResolution = loadResolution();
    resolutionOptions.forEach(function (resolution) {
      var option = document.createElement("option");
      option.value = resolution.width + "x" + resolution.height;
      option.textContent =
        resolution.label === "Nativo"
          ? translate("Nativo")
          : resolution.label;
      if (
        resolution.width === selectedResolution.width &&
        resolution.height === selectedResolution.height
      ) {
        option.selected = true;
      }
      resolutionSelect.appendChild(option);
    });

    resolutionSelect.onchange = function () {
      var dimensions = resolutionSelect.value.split("x");
      saveResolution(parseInt(dimensions[0]) || 0, parseInt(dimensions[1]) || 0);
      window.dispatchEvent(new Event("resize"));
    };

    videoSection.appendChild(resolutionRow);
    return true;
  }

  setInterval(function () {
    if (document.querySelector(".dialog.settings-view")) {
      addResolutionSelector();
    }
  }, 500);
})();
