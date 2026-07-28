(function () {
  Injector.waitForElement(".rightbar")
    .then(function () {
      var rightBar = document.querySelector(".rightbar");
      if (rightBar) {
        rightBar.innerHTML = "";
        rightBar.style.display = "none";
      }

      Injector.injectCSS(
        "rightbar-hide",
        ".rightbar { display: none !important; width: 0 !important; }",
      );
      Injector.log("Ads removed");
    })
    .catch(function () {});
})();
