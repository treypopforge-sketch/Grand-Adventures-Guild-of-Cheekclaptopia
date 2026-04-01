document.addEventListener("DOMContentLoaded", function () {
  window.GameState.subscribe(window.GameUI.render);
  window.GameState.initialize();

  document.addEventListener("click", function (event) {
    var actionElement = event.target.closest("[data-action]");
    if (!actionElement) {
      return;
    }

    var stopClick = event.target.closest("[data-stop-click]");
    if (
      stopClick &&
      actionElement === stopClick.parentElement &&
      actionElement.getAttribute("data-action") === "close-panel"
    ) {
      return;
    }

    var action = actionElement.getAttribute("data-action");

    if (action === "new-game") {
      window.GameState.startNewGame();
    } else if (action === "continue-game") {
      if (actionElement.hasAttribute("disabled")) {
        return;
      }
      window.GameState.continueGame();
    } else if (action === "start-new-run") {
      window.GameState.startNewRun();
    } else if (action === "open-settings") {
      window.GameState.openSettings();
    } else if (action === "back-from-settings") {
      window.GameState.closeSettings();
    } else if (action === "go-hub") {
      window.GameState.changeScreen("hub");
    } else if (action === "go-map") {
      window.GameState.changeScreen("map");
    } else if (action === "go-guildhall") {
      window.GameState.changeScreen("guildHall");
    } else if (action === "open-panel") {
      window.GameState.openHubPanel(actionElement.getAttribute("data-panel"));
    } else if (action === "close-panel") {
      window.GameState.closeHubPanel();
    } else if (action === "select-location") {
      window.GameState.selectMapLocation(actionElement.getAttribute("data-location-id"));
    } else if (action === "enter-guildhall") {
      window.GameState.enterGuildHall();
    } else if (action === "choose-mission") {
      window.GameState.chooseMission(actionElement.getAttribute("data-mission-id"));
    } else if (action === "toggle-party") {
      window.GameState.togglePartyMember(actionElement.getAttribute("data-adventurer-id"));
    } else if (action === "select-party") {
      window.GameState.selectParty(actionElement.getAttribute("data-party-id"));
    } else if (action === "start-mission") {
      window.GameState.startMission(actionElement.getAttribute("data-party-id"));
    } else if (action === "continue-loop") {
      window.GameState.returnToHub();
    } else if (action === "recruit") {
      window.GameState.recruitFromOffer(actionElement.getAttribute("data-offer-id"));
    } else if (action === "end-day") {
      window.GameState.endDay();
    } else if (action === "reset-progress") {
      window.GameState.resetProgress();
    }
  });

  document.addEventListener("change", function (event) {
    var settingName = event.target.getAttribute("data-setting");
    if (!settingName) {
      return;
    }

    window.GameState.updateSetting(settingName, !!event.target.checked);
  });

  document.addEventListener("keydown", function (event) {
    var state = window.GameState.getState();
    if (state.currentScreen !== "start" || event.key !== "Enter") {
      return;
    }

    if (state.hasSave) {
      window.GameState.continueGame();
    } else {
      window.GameState.startNewGame();
    }
  });
});
