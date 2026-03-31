(function () {
  var STORAGE_KEY = "cheekclaptopia-save-v1";
  var listeners = [];
  var toastTimer = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadSave() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function createRunState() {
    var starterAdventurers = clone(window.GameData.starterAdventurers);
    var starterOffers = window.GameSystems.generateTavernOffers(
      starterAdventurers.map(function (adventurer) { return adventurer.id; }),
      [],
      3
    );

    return {
      gold: 180,
      adventurers: starterAdventurers,
      currentParty: [],
      currentMission: null,
      currentScreen: "hub",
      previousScreen: "hub",
      selectedLocationId: null,
      selectedMapLocationId: null,
      activeHubPanel: null,
      tavernOffers: starterOffers,
      settings: {
        music: true,
        sound: true
      },
      lastResult: null,
      toast: null,
      hasSave: true,
      progress: {
        started: true,
        missionsCompleted: 0,
        successfulMissions: 0,
        recruitedCount: 0,
        discoveredLocations: []
      }
    };
  }

  function createMenuState() {
    return {
      gold: 0,
      adventurers: [],
      currentParty: [],
      currentMission: null,
      currentScreen: "start",
      previousScreen: "start",
      selectedLocationId: null,
      selectedMapLocationId: null,
      activeHubPanel: null,
      tavernOffers: [],
      settings: {
        music: true,
        sound: true
      },
      lastResult: null,
      toast: null,
      hasSave: !!loadSave(),
      progress: {
        started: false,
        missionsCompleted: 0,
        successfulMissions: 0,
        recruitedCount: 0,
        discoveredLocations: []
      }
    };
  }

  var state = createMenuState();

  function serializableState() {
    return {
      gold: state.gold,
      adventurers: clone(state.adventurers),
      currentParty: clone(state.currentParty),
      currentMission: clone(state.currentMission),
      selectedLocationId: state.selectedLocationId,
      selectedMapLocationId: state.selectedMapLocationId,
      tavernOffers: clone(state.tavernOffers),
      settings: clone(state.settings),
      lastResult: clone(state.lastResult),
      progress: clone(state.progress)
    };
  }

  function persist() {
    if (!state.progress.started) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableState()));
      state.hasSave = true;
    } catch (error) {
      showToast("Save failed on this device.");
    }
  }

  function emit() {
    listeners.forEach(function (listener) {
      listener(getState());
    });
  }

  function getState() {
    return clone(state);
  }

  function subscribe(listener) {
    listeners.push(listener);
    return function () {
      listeners = listeners.filter(function (entry) {
        return entry !== listener;
      });
    };
  }

  function dismissToast() {
    state.toast = null;
    emit();
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    state.toast = {
      id: Date.now(),
      message: message
    };
    emit();
    toastTimer = window.setTimeout(function () {
      dismissToast();
    }, 2400);
  }

  function hydrateFromSave(savedState) {
    var fresh = createRunState();
    fresh.gold = typeof savedState.gold === "number" ? savedState.gold : fresh.gold;
    fresh.adventurers = Array.isArray(savedState.adventurers) ? savedState.adventurers : fresh.adventurers;
    fresh.currentParty = Array.isArray(savedState.currentParty) ? savedState.currentParty : [];
    fresh.currentMission = savedState.currentMission || null;
    fresh.selectedLocationId = savedState.selectedLocationId || null;
    fresh.selectedMapLocationId = savedState.selectedMapLocationId || savedState.selectedLocationId || null;
    fresh.tavernOffers = Array.isArray(savedState.tavernOffers) ? savedState.tavernOffers : fresh.tavernOffers;
    fresh.settings = Object.assign({}, fresh.settings, savedState.settings || {});
    fresh.lastResult = savedState.lastResult || null;
    fresh.progress = Object.assign({}, fresh.progress, savedState.progress || {});
    fresh.currentScreen = "hub";
    fresh.previousScreen = "hub";
    fresh.activeHubPanel = null;
    fresh.toast = null;
    fresh.hasSave = true;
    return fresh;
  }

  function initialize() {
    state = createMenuState();
    emit();
  }

  function startNewGame() {
    state = createRunState();
    persist();
    emit();
    showToast("A new guild has been founded.");
  }

  function continueGame() {
    var savedState = loadSave();
    if (!savedState) {
      showToast("No saved guild found yet.");
      return;
    }

    state = hydrateFromSave(savedState);
    persist();
    emit();
    showToast("Welcome back, Guildmaster.");
  }

  function changeScreen(screenName) {
    if (!state.progress.started && screenName !== "start" && screenName !== "settings") {
      showToast("Start a guild first.");
      return;
    }

    if (screenName === "guildHall" && !state.selectedLocationId) {
      state.currentScreen = "map";
      emit();
      showToast("Pick a map location before opening the Guild Hall.");
      return;
    }

    if (screenName !== "settings") {
      state.previousScreen = state.currentScreen;
    }

    state.currentScreen = screenName;
    state.activeHubPanel = null;
    persist();
    emit();
  }

  function openSettings() {
    state.previousScreen = state.currentScreen;
    state.currentScreen = "settings";
    emit();
  }

  function closeSettings() {
    state.currentScreen = state.progress.started ? state.previousScreen : "start";
    emit();
  }

  function selectMapLocation(locationId) {
    var missions = window.GameSystems.buildMissionsForLocation(locationId);
    state.selectedMapLocationId = locationId;
    state.selectedLocationId = locationId;
    state.currentMission = missions[0] || null;

    if (state.progress.discoveredLocations.indexOf(locationId) === -1) {
      state.progress.discoveredLocations.push(locationId);
    }

    persist();
    emit();
  }

  function enterGuildHall() {
    if (!state.selectedLocationId) {
      showToast("Choose a location on the map first.");
      return;
    }

    state.currentScreen = "guildHall";
    state.previousScreen = "map";
    persist();
    emit();
  }

  function chooseMission(missionId) {
    if (!state.selectedLocationId) {
      return;
    }

    var mission = window.GameSystems.buildMissionsForLocation(state.selectedLocationId).find(function (entry) {
      return entry.id === missionId;
    }) || null;

    if (!mission) {
      return;
    }

    state.currentMission = mission;
    persist();
    emit();
  }

  function togglePartyMember(adventurerId) {
    var currentIndex = state.currentParty.indexOf(adventurerId);
    if (currentIndex !== -1) {
      state.currentParty.splice(currentIndex, 1);
      persist();
      emit();
      return;
    }

    if (state.currentParty.length >= window.GameData.maxPartySize) {
      showToast("Only three heroes can enter a mission.");
      return;
    }

    var adventurer = window.GameSystems.getAdventurerById(state.adventurers, adventurerId);
    if (!adventurer) {
      return;
    }

    state.currentParty.push(adventurerId);
    persist();
    emit();
  }

  function openHubPanel(panelName) {
    state.activeHubPanel = state.activeHubPanel === panelName ? null : panelName;
    emit();
  }

  function closeHubPanel() {
    state.activeHubPanel = null;
    emit();
  }

  function recruitFromOffer(offerId) {
    var offer = state.tavernOffers.find(function (entry) {
      return entry.id === offerId;
    });

    if (!offer) {
      return;
    }

    if (state.gold < offer.cost) {
      showToast("Not enough gold for that recruit.");
      return;
    }

    state.gold -= offer.cost;
    state.adventurers.push(clone(offer.adventurer));
    state.progress.recruitedCount += 1;
    state.tavernOffers = state.tavernOffers.filter(function (entry) {
      return entry.id !== offerId;
    });

    var ownedIds = state.adventurers.map(function (adventurer) {
      return adventurer.id;
    });
    var offeredIds = state.tavernOffers.map(function (entry) {
      return entry.adventurer.id;
    });
    var replacement = window.GameSystems.generateTavernOffers(ownedIds, offeredIds, 1);
    if (replacement.length) {
      state.tavernOffers = state.tavernOffers.concat(replacement);
    }

    persist();
    emit();
    showToast(offer.adventurer.name + " joined the guild.");
  }

  function startMission() {
    if (!state.currentMission) {
      showToast("Choose a mission first.");
      return;
    }

    if (!state.currentParty.length) {
      showToast("Assign at least one adventurer.");
      return;
    }

    var result = window.GameSystems.resolveMission(state);
    if (!result) {
      return;
    }

    state.gold += result.rewardGold;
    state.lastResult = result;
    state.progress.missionsCompleted += 1;
    if (["criticalSuccess", "perfectSuccess", "success", "partialSuccess"].indexOf(result.outcome) !== -1) {
      state.progress.successfulMissions += 1;
    }
    state.currentScreen = "result";
    persist();
    emit();
  }

  function returnToHub() {
    state.currentScreen = "hub";
    state.previousScreen = "result";
    state.activeHubPanel = null;
    persist();
    emit();
  }

  function updateSetting(settingKey, value) {
    state.settings[settingKey] = value;
    persist();
    emit();
  }

  function resetProgress() {
    window.localStorage.removeItem(STORAGE_KEY);
    state = createMenuState();
    emit();
    showToast("Progress reset.");
  }

  window.GameState = {
    changeScreen: changeScreen,
    chooseMission: chooseMission,
    closeHubPanel: closeHubPanel,
    closeSettings: closeSettings,
    continueGame: continueGame,
    dismissToast: dismissToast,
    enterGuildHall: enterGuildHall,
    getState: getState,
    initialize: initialize,
    openHubPanel: openHubPanel,
    openSettings: openSettings,
    recruitFromOffer: recruitFromOffer,
    resetProgress: resetProgress,
    returnToHub: returnToHub,
    selectMapLocation: selectMapLocation,
    startMission: startMission,
    startNewGame: startNewGame,
    subscribe: subscribe,
    togglePartyMember: togglePartyMember,
    updateSetting: updateSetting
  };
}());
