(function () {
  if (!Injector.isGameFrame()) {
    return;
  }

  function observeLeaveRoomDialog() {
    if (!document.body) {
      setTimeout(observeLeaveRoomDialog, 100);
      return;
    }

    var dialogObserver = new MutationObserver(function (mutations) {
      for (var mutationIndex = 0; mutationIndex < mutations.length; mutationIndex++) {
        var addedNodes = mutations[mutationIndex].addedNodes;
        for (var nodeIndex = 0; nodeIndex < addedNodes.length; nodeIndex++) {
          var addedNode = addedNodes[nodeIndex];
          var isLeaveRoomDialog =
            addedNode.nodeType === 1 &&
            addedNode.classList &&
            addedNode.classList.contains("leave-room-view");

          if (!isLeaveRoomDialog) {
            continue;
          }

          var leaveButton = addedNode.querySelector('[data-hook="leave"]');
          if (leaveButton) {
            Injector.log("Auto-clicking leave button");
            leaveButton.click();
          }
        }
      }
    });

    dialogObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
    Injector.log("Leave room observer setup");
  }

  observeLeaveRoomDialog();
  Injector.log("Leave room (no confirmation) loaded");
})();
