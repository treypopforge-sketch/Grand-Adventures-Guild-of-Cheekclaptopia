document.addEventListener("DOMContentLoaded", function () {
  var audioContext = null;

  function renderState(state) {
    window.GameUI.render(state);
    window.GameUI.afterRender(state);
  }

  function canPlaySound() {
    var state = window.GameState.getState();
    return !!(state && state.settings && state.settings.sound);
  }

  function getAudioContext() {
    var AudioContextCtor = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextCtor) {
      return null;
    }

    if (!audioContext) {
      audioContext = new AudioContextCtor();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    return audioContext;
  }

  function scheduleTone(context, frequency, offset, duration, volume, waveType) {
    var oscillator = context.createOscillator();
    var gain = context.createGain();
    var startAt = context.currentTime + offset;

    oscillator.type = waveType || "sine";
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.02);
  }

  function playSound(type) {
    var context;

    if (!canPlaySound()) {
      return;
    }

    context = getAudioContext();
    if (!context) {
      return;
    }

    if (type === "click") {
      scheduleTone(context, 620, 0, 0.06, 0.04, "triangle");
    } else if (type === "roll") {
      scheduleTone(context, 280, 0, 0.08, 0.05, "triangle");
      scheduleTone(context, 410, 0.08, 0.08, 0.05, "triangle");
      scheduleTone(context, 520, 0.16, 0.1, 0.05, "triangle");
    } else if (type === "success") {
      scheduleTone(context, 520, 0, 0.09, 0.05, "triangle");
      scheduleTone(context, 660, 0.1, 0.1, 0.06, "triangle");
      scheduleTone(context, 880, 0.22, 0.14, 0.07, "triangle");
    } else if (type === "failure") {
      scheduleTone(context, 240, 0, 0.1, 0.06, "sawtooth");
      scheduleTone(context, 180, 0.12, 0.16, 0.05, "sawtooth");
    }
  }

  function syncTutorial(action, stateBefore, stateAfter) {
    var tutorialChanged = window.GameUI.syncTutorialAfterAction(action, stateBefore, stateAfter);

    if (tutorialChanged || action === "tutorial-next" || action === "tutorial-skip") {
      window.GameUI.rerenderCurrentState(stateAfter && stateAfter.currentScreen === "result");
    }
  }

  function handleAction(action, actionElement, stateBefore) {
    if (action === "new-game") {
      window.GameState.startNewGame();
    } else if (action === "continue-game") {
      if (actionElement.hasAttribute("disabled")) {
        return false;
      }
      window.GameState.continueGame();
    } else if (action === "start-new-run") {
      window.GameState.startNewRun();
    } else if (action === "tutorial-next" || action === "tutorial-skip") {
      return true;
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
      playSound("roll");
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

    return false;
  }

  window.GameState.subscribe(renderState);
  window.GameState.initialize();

  document.addEventListener("click", function (event) {
    var actionElement = event.target.closest("[data-action]");
    var stopClick;
    var action;
    var stateBefore;
    var stateAfter;
    var outcome;

    if (!actionElement) {
      return;
    }

    stopClick = event.target.closest("[data-stop-click]");
    if (
      stopClick &&
      actionElement === stopClick.parentElement &&
      actionElement.getAttribute("data-action") === "close-panel"
    ) {
      return;
    }

    if (actionElement.hasAttribute("disabled")) {
      return;
    }

    action = actionElement.getAttribute("data-action");
    stateBefore = window.GameState.getState();

    if (action !== "start-mission") {
      playSound("click");
    }

    handleAction(action, actionElement, stateBefore);
    stateAfter = window.GameState.getState();

    if (action === "start-mission" && stateAfter.currentScreen === "result" && stateAfter.lastResult) {
      outcome = stateAfter.lastResult.outcome;
      window.setTimeout(function () {
        if (["criticalSuccess", "perfectSuccess", "success", "partialSuccess"].indexOf(outcome) !== -1) {
          playSound("success");
        } else {
          playSound("failure");
        }
      }, 160);
    }

    syncTutorial(action, stateBefore, stateAfter);
  });

  document.addEventListener("change", function (event) {
    var settingName = event.target.getAttribute("data-setting");

    if (!settingName) {
      return;
    }

    window.GameState.updateSetting(settingName, !!event.target.checked);
    if (event.target.checked) {
      playSound("click");
    }
  });

  document.addEventListener("keydown", function (event) {
    var state = window.GameState.getState();

    if (state.currentScreen !== "start" || event.key !== "Enter") {
      return;
    }

    playSound("click");
    if (state.hasSave) {
      window.GameState.continueGame();
    } else {
      window.GameState.startNewGame();
    }
  });
});
