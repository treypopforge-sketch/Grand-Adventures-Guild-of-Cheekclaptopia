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

  function getTodayString() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, "0");
    var day = String(now.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function createParty(id) {
    return {
      id: id,
      members: []
    };
  }

  function defaultProgress() {
    return {
      started: true,
      missionsCompleted: 0,
      successfulMissions: 0,
      recruitedCount: 0,
      discoveredLocations: []
    };
  }

  function normalizeAdventurer(adventurer) {
    var status = adventurer.status;
    if (!status) {
      status = adventurer.isTired ? "tired" : "ready";
    }

    return {
      id: adventurer.id,
      name: adventurer.name,
      class: adventurer.class,
      atk: adventurer.atk,
      def: adventurer.def,
      spd: adventurer.spd,
      status: status,
      injuryDaysRemaining: adventurer.injuryDaysRemaining || 0
    };
  }

  function normalizeAdventurers(adventurers) {
    return adventurers.map(normalizeAdventurer);
  }

  function getPartyById(targetState, partyId) {
    return targetState.currentParties.find(function (party) {
      return String(party.id) === String(partyId);
    }) || null;
  }

  function getActiveParty(targetState) {
    return getPartyById(targetState, targetState.activePartyId) || targetState.currentParties[0] || null;
  }

  function applyGuildProgression(targetState) {
    var previousLevel = typeof targetState.guildLevel === "number" ? targetState.guildLevel : 1;
    var previousMaxParties = typeof targetState.maxParties === "number" ? targetState.maxParties : 1;
    var nextLevel = window.GameSystems.getGuildLevelFromGoldSpent(targetState.totalGoldSpent || 0);
    var nextMaxParties = window.GameSystems.getPartyCapacityForLevel(nextLevel);

    targetState.guildLevel = nextLevel;
    targetState.maxParties = nextMaxParties;

    return {
      leveledUp: nextLevel > previousLevel,
      capacityIncreased: nextMaxParties > previousMaxParties,
      previousLevel: previousLevel,
      nextLevel: nextLevel
    };
  }

  function spendGold(targetState, amount) {
    if (targetState.gold < amount) {
      return {
        success: false,
        progression: null
      };
    }

    targetState.gold -= amount;
    targetState.totalGoldSpent += amount;

    return {
      success: true,
      progression: applyGuildProgression(targetState)
    };
  }

  function syncPartyStructure(targetState) {
    var desiredCount = targetState.maxParties || window.GameSystems.getPartyCapacity(targetState);
    var seenAdventurers = {};
    var nextId = 1;

    targetState.currentParties = Array.isArray(targetState.currentParties) ? targetState.currentParties.map(function (party) {
      var normalizedMembers = Array.isArray(party.members) ? party.members.filter(function (memberId) {
        if (seenAdventurers[memberId]) {
          return false;
        }
        seenAdventurers[memberId] = true;
        return true;
      }) : [];

      var normalizedId = party.id || nextId;
      nextId = Math.max(nextId, Number(normalizedId) + 1);

      return {
        id: normalizedId,
        members: normalizedMembers
      };
    }) : [];

    while (targetState.currentParties.length < desiredCount) {
      targetState.currentParties.push(createParty(nextId));
      nextId += 1;
    }

    if (!targetState.currentParties.length) {
      targetState.currentParties.push(createParty(1));
    }

    if (!getPartyById(targetState, targetState.activePartyId)) {
      targetState.activePartyId = targetState.currentParties[0].id;
    }
  }

  function selectFirstMissionForLocation(targetState) {
    if (!targetState.selectedLocationId) {
      targetState.currentMission = null;
      return [];
    }

    var missions = window.GameSystems.getMissionsForLocation(targetState, targetState.selectedLocationId);
    targetState.currentMission = missions[0] || null;
    return missions;
  }

  function regenerateDailyContent(targetState) {
    targetState.currentMissions = window.GameSystems.generateDailyMissions(targetState);
    targetState.tavernOffers = window.GameSystems.generateTavernOffers(targetState, 3);

    if (targetState.selectedLocationId) {
      selectFirstMissionForLocation(targetState);
    } else {
      targetState.currentMission = null;
    }
  }

  function applyDailyReward(targetState) {
    var today = getTodayString();
    var reward = 0;

    if (targetState.lastLoginDay !== today) {
      reward = window.GameData.dailyRewardGold || 100;
      targetState.gold += reward;
      targetState.lastLoginDay = today;
      regenerateDailyContent(targetState);
    } else if (!Array.isArray(targetState.currentMissions) || !targetState.currentMissions.length) {
      targetState.currentMissions = window.GameSystems.generateDailyMissions(targetState);
      if (targetState.selectedLocationId) {
        selectFirstMissionForLocation(targetState);
      }
    }

    return reward;
  }

  function createRunState(options) {
    var settings = options && options.settings ? clone(options.settings) : {
      music: true,
      sound: true
    };
    var meta = options && options.meta ? options.meta : {
      guildLevel: 1,
      totalGoldSpent: 0,
      maxParties: 1,
      lastLoginDay: getTodayString()
    };
    var freshState = {
      gold: 180 + ((options && options.bonusGold) || 0),
      day: 1,
      guildLevel: meta.guildLevel || 1,
      totalGoldSpent: meta.totalGoldSpent || 0,
      maxParties: meta.maxParties || 1,
      lastLoginDay: meta.lastLoginDay || getTodayString(),
      adventurers: normalizeAdventurers((options && options.adventurers) || clone(window.GameData.starterAdventurers)),
      currentParties: [createParty(1)],
      activePartyId: 1,
      currentMission: null,
      currentMissions: [],
      currentScreen: (options && options.currentScreen) || "hub",
      previousScreen: (options && options.previousScreen) || "hub",
      selectedLocationId: null,
      selectedMapLocationId: null,
      activeHubPanel: null,
      tavernOffers: [],
      settings: settings,
      lastResult: null,
      toast: null,
      hasSave: true,
      progress: clone((options && options.progress) || defaultProgress())
    };

    applyGuildProgression(freshState);
    syncPartyStructure(freshState);
    regenerateDailyContent(freshState);
    return freshState;
  }

  function createMenuState() {
    return {
      gold: 0,
      day: 1,
      guildLevel: 1,
      totalGoldSpent: 0,
      maxParties: 1,
      lastLoginDay: null,
      adventurers: [],
      currentParties: [createParty(1)],
      activePartyId: 1,
      currentMission: null,
      currentMissions: [],
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
      day: state.day,
      guildLevel: state.guildLevel,
      totalGoldSpent: state.totalGoldSpent,
      maxParties: state.maxParties,
      lastLoginDay: state.lastLoginDay,
      adventurers: clone(state.adventurers),
      currentParties: clone(state.currentParties),
      activePartyId: state.activePartyId,
      currentMission: clone(state.currentMission),
      currentMissions: clone(state.currentMissions),
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
    var fresh = createRunState({
      currentScreen: "hub",
      previousScreen: "hub"
    });

    fresh.gold = typeof savedState.gold === "number" ? savedState.gold : fresh.gold;
    fresh.day = typeof savedState.day === "number" ? savedState.day : fresh.day;
    fresh.totalGoldSpent = typeof savedState.totalGoldSpent === "number" ? savedState.totalGoldSpent : 0;
    fresh.guildLevel = typeof savedState.guildLevel === "number"
      ? savedState.guildLevel
      : Math.max(savedState.tavernLevel || 1, window.GameSystems.getGuildLevelFromGoldSpent(fresh.totalGoldSpent));
    fresh.maxParties = typeof savedState.maxParties === "number"
      ? savedState.maxParties
      : window.GameSystems.getPartyCapacityForLevel(fresh.guildLevel);
    fresh.lastLoginDay = savedState.lastLoginDay || fresh.lastLoginDay;
    fresh.adventurers = Array.isArray(savedState.adventurers) ? normalizeAdventurers(savedState.adventurers) : fresh.adventurers;
    fresh.currentParties = Array.isArray(savedState.currentParties) ? savedState.currentParties : [createParty(1)];
    if (!savedState.currentParties && Array.isArray(savedState.currentParty)) {
      fresh.currentParties[0].members = savedState.currentParty.slice(0, window.GameData.maxPartySize);
    }
    fresh.activePartyId = savedState.activePartyId || fresh.currentParties[0].id;
    fresh.currentMission = savedState.currentMission || null;
    fresh.currentMissions = Array.isArray(savedState.currentMissions) ? savedState.currentMissions : [];
    fresh.selectedLocationId = savedState.selectedLocationId || null;
    fresh.selectedMapLocationId = savedState.selectedMapLocationId || savedState.selectedLocationId || null;
    fresh.tavernOffers = Array.isArray(savedState.tavernOffers) ? savedState.tavernOffers.map(function (offer) {
      return {
        id: offer.id,
        adventurer: normalizeAdventurer(offer.adventurer),
        cost: offer.cost
      };
    }) : [];
    fresh.settings = Object.assign({}, fresh.settings, savedState.settings || {});
    fresh.lastResult = savedState.lastResult || null;
    fresh.progress = Object.assign({}, fresh.progress, savedState.progress || {});

    applyGuildProgression(fresh);
    syncPartyStructure(fresh);

    if (!fresh.currentMissions.length) {
      fresh.currentMissions = window.GameSystems.generateDailyMissions(fresh);
    }

    if (!fresh.currentMission || !fresh.currentMissions.some(function (mission) {
      return mission.id === fresh.currentMission.id;
    })) {
      selectFirstMissionForLocation(fresh);
    }

    if (!fresh.tavernOffers.length) {
      fresh.tavernOffers = window.GameSystems.generateTavernOffers(fresh, 3);
    }

    return {
      state: fresh,
      dailyRewardGranted: applyDailyReward(fresh)
    };
  }

  function initialize() {
    var savedState = loadSave();

    if (!savedState) {
      state = createMenuState();
      emit();
      return;
    }

    var hydrated = hydrateFromSave(savedState);
    state = hydrated.state;
    state.currentScreen = "start";
    state.previousScreen = "start";
    state.activeHubPanel = null;
    persist();
    emit();

    if (hydrated.dailyRewardGranted) {
      showToast("Daily Reward: +" + hydrated.dailyRewardGranted + " Gold");
    }
  }

  function startNewGame() {
    state = createRunState();
    persist();
    emit();
    showToast("A new guild has been founded.");
  }

  function startNewRun() {
    var meta = {
      guildLevel: state.guildLevel,
      totalGoldSpent: state.totalGoldSpent,
      maxParties: state.maxParties,
      lastLoginDay: getTodayString()
    };

    state = createRunState({
      meta: meta,
      settings: state.settings,
      bonusGold: window.GameData.newRunBonusGold || 50
    });
    persist();
    emit();
    showToast("New Run Started - Bonus Applied");
  }

  function continueGame() {
    var savedState = loadSave();
    if (!savedState) {
      showToast("No saved guild found yet.");
      return;
    }

    var hydrated = hydrateFromSave(savedState);
    state = hydrated.state;
    persist();
    emit();

    if (hydrated.dailyRewardGranted) {
      showToast("Daily Reward: +" + hydrated.dailyRewardGranted + " Gold");
      return;
    }

    showToast("Welcome back, Guildmaster.");
  }

  function changeScreen(screenName) {
    if (!state.progress.started && screenName !== "start" && screenName !== "settings") {
      showToast("Start a guild first.");
      return;
    }

    if (screenName === "guildHall") {
      if (!state.selectedLocationId) {
        state.currentScreen = "map";
        emit();
        showToast("Pick a map location before opening the Guild Hall.");
        return;
      }

      if (!window.GameSystems.getMissionsForLocation(state, state.selectedLocationId).length) {
        state.currentScreen = "map";
        emit();
        showToast("No contracts are available there today.");
        return;
      }
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
    state.selectedMapLocationId = locationId;
    state.selectedLocationId = locationId;

    if (state.progress.discoveredLocations.indexOf(locationId) === -1) {
      state.progress.discoveredLocations.push(locationId);
    }

    selectFirstMissionForLocation(state);
    persist();
    emit();
  }

  function enterGuildHall() {
    if (!state.selectedLocationId) {
      showToast("Choose a location on the map first.");
      return;
    }

    if (!window.GameSystems.getMissionsForLocation(state, state.selectedLocationId).length) {
      showToast("No contracts are available there today.");
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

    var mission = window.GameSystems.getMissionsForLocation(state, state.selectedLocationId).find(function (entry) {
      return entry.id === missionId;
    }) || null;

    if (!mission) {
      return;
    }

    state.currentMission = mission;
    persist();
    emit();
  }

  function selectParty(partyId) {
    var party = getPartyById(state, partyId);
    if (!party) {
      return;
    }

    state.activePartyId = party.id;
    persist();
    emit();
  }

  function togglePartyMember(adventurerId) {
    var activeParty = getActiveParty(state);
    var adventurer = window.GameSystems.getAdventurerById(state.adventurers, adventurerId);

    if (!activeParty || !adventurer) {
      return;
    }

    var currentIndex = activeParty.members.indexOf(adventurerId);
    if (currentIndex !== -1) {
      activeParty.members.splice(currentIndex, 1);
      persist();
      emit();
      return;
    }

    if (adventurer.status !== "ready") {
      showToast(adventurer.name + " is " + adventurer.status + " and cannot be assigned.");
      return;
    }

    var assignedParty = state.currentParties.find(function (party) {
      return party.members.indexOf(adventurerId) !== -1;
    });

    if (assignedParty && assignedParty.id !== activeParty.id) {
      showToast(adventurer.name + " is already assigned to Party " + assignedParty.id + ".");
      return;
    }

    if (activeParty.members.length >= window.GameData.maxPartySize) {
      showToast("Only three heroes can enter a party.");
      return;
    }

    activeParty.members.push(adventurerId);
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

    var spendResult = spendGold(state, offer.cost);
    if (!spendResult.success) {
      showToast("Not enough gold for that recruit.");
      return;
    }

    state.adventurers.push(normalizeAdventurer(clone(offer.adventurer)));
    state.progress.recruitedCount += 1;

    if (spendResult.progression && spendResult.progression.leveledUp) {
      syncPartyStructure(state);
      regenerateDailyContent(state);
      persist();
      emit();

      if (spendResult.progression.capacityIncreased) {
        showToast("Guild Level Up! Party capacity increased!");
      } else {
        showToast("Guild Level Up! Better recruits are arriving.");
      }
      return;
    }

    state.tavernOffers = state.tavernOffers.filter(function (entry) {
      return entry.id !== offerId;
    });
    state.tavernOffers = state.tavernOffers.concat(window.GameSystems.generateTavernOffers(state, 1));
    syncPartyStructure(state);
    persist();
    emit();
    showToast(offer.adventurer.name + " joined the guild.");
  }

  function startMission(partyId) {
    var party = getPartyById(state, partyId || state.activePartyId);

    if (!state.currentMission) {
      showToast("Choose a mission first.");
      return;
    }

    if (!party || !party.members.length) {
      showToast("Assign at least one adventurer.");
      return;
    }

    var partyMembers = window.GameSystems.getPartyMembers(state, party.id);
    if (partyMembers.some(function (member) { return member.status !== "ready"; })) {
      showToast("That party has members who still need to recover.");
      return;
    }

    var result = window.GameSystems.resolveMission(state, party.id);
    if (!result) {
      return;
    }

    state.gold += result.rewardGold;
    state.lastResult = result;
    state.progress.missionsCompleted += 1;
    if (["criticalSuccess", "perfectSuccess", "success", "partialSuccess"].indexOf(result.outcome) !== -1) {
      state.progress.successfulMissions += 1;
    }

    partyMembers.forEach(function (member) {
      if (result.outcome === "criticalFailure") {
        member.status = "injured";
        member.injuryDaysRemaining = 2;
      } else {
        member.status = "tired";
        member.injuryDaysRemaining = 0;
      }
    });

    syncPartyStructure(state);
    state.currentScreen = "result";
    persist();
    emit();
  }

  function endDay() {
    if (!state.progress.started) {
      return;
    }

    state.day += 1;
    state.adventurers.forEach(function (adventurer) {
      if (adventurer.status === "tired") {
        adventurer.status = "ready";
        adventurer.injuryDaysRemaining = 0;
      } else if (adventurer.status === "injured") {
        adventurer.injuryDaysRemaining = Math.max(0, adventurer.injuryDaysRemaining - 1);
        if (adventurer.injuryDaysRemaining === 0) {
          adventurer.status = "ready";
        }
      }
    });
    window.GameSystems.runEndOfDayHooks(state);
    regenerateDailyContent(state);
    persist();
    emit();
    showToast("A new day begins. Fresh contracts are available.");
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
    endDay: endDay,
    enterGuildHall: enterGuildHall,
    getState: getState,
    initialize: initialize,
    openHubPanel: openHubPanel,
    openSettings: openSettings,
    recruitFromOffer: recruitFromOffer,
    resetProgress: resetProgress,
    returnToHub: returnToHub,
    selectMapLocation: selectMapLocation,
    selectParty: selectParty,
    startMission: startMission,
    startNewGame: startNewGame,
    startNewRun: startNewRun,
    subscribe: subscribe,
    togglePartyMember: togglePartyMember,
    updateSetting: updateSetting
  };
}());
