(function () {
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function calculatePower(adventurer) {
    var power = adventurer.atk + (adventurer.def * 0.7) + (adventurer.spd * 0.5);
    return Math.round(power);
  }

  function getLocationById(locationId) {
    return window.GameData.locations.find(function (location) {
      return location.id === locationId;
    }) || null;
  }

  function getMissionTemplate(location, difficultyLabel) {
    var locationIndex = window.GameData.locations.findIndex(function (entry) {
      return entry.id === location.id;
    });
    var templates = window.GameData.missionTemplates[location.type][difficultyLabel];
    return templates[locationIndex % templates.length];
  }

  function buildMissionsForLocation(locationId) {
    var location = getLocationById(locationId);
    if (!location) {
      return [];
    }

    return Object.keys(window.GameData.difficultyConfig).map(function (difficultyLabel) {
      var config = window.GameData.difficultyConfig[difficultyLabel];
      var template = getMissionTemplate(location, difficultyLabel);

      return {
        id: location.id + "-" + difficultyLabel.toLowerCase(),
        locationId: location.id,
        name: location.name + ": " + template.title,
        summary: template.summary,
        difficulty: difficultyLabel,
        dc: config.dc,
        rewardGold: config.rewardGold
      };
    });
  }

  function getAdventurerById(adventurers, adventurerId) {
    return adventurers.find(function (adventurer) {
      return adventurer.id === adventurerId;
    }) || null;
  }

  function getPartyMembers(state) {
    return state.currentParty.map(function (id) {
      return getAdventurerById(state.adventurers, id);
    }).filter(Boolean);
  }

  function getPartyPower(state) {
    return getPartyMembers(state).reduce(function (sum, member) {
      return sum + calculatePower(member);
    }, 0);
  }

  function getGuildLevel(state) {
    return 1 + Math.floor((state.progress.missionsCompleted + state.adventurers.length) / 3);
  }

  function rewardMultiplierForOutcome(outcome) {
    if (outcome === "criticalSuccess") {
      return randomInt(150, 200) / 100;
    }
    if (outcome === "perfectSuccess") {
      return 1.25;
    }
    if (outcome === "success") {
      return 1;
    }
    if (outcome === "partialSuccess") {
      return randomInt(50, 75) / 100;
    }
    return 0;
  }

  function outcomeLabel(outcome) {
    var labels = {
      criticalSuccess: "CRITICAL SUCCESS",
      criticalFailure: "CRITICAL FAILURE",
      perfectSuccess: "PERFECT SUCCESS",
      success: "SUCCESS",
      partialSuccess: "PARTIAL SUCCESS",
      failure: "FAILURE"
    };

    return labels[outcome];
  }

  function resolveMission(state) {
    if (!state.currentMission || !state.currentParty.length) {
      return null;
    }

    var partyPower = getPartyPower(state);
    var roll = randomInt(1, 20);
    var luck = randomInt(-5, 5);
    var total = partyPower + roll + luck;
    var dc = state.currentMission.dc;
    var outcome = "failure";

    if (roll === 20) {
      outcome = "criticalSuccess";
    } else if (roll === 1) {
      outcome = "criticalFailure";
    } else if (total >= dc + 10) {
      outcome = "perfectSuccess";
    } else if (total >= dc) {
      outcome = "success";
    } else if (total >= dc - 5) {
      outcome = "partialSuccess";
    }

    var rewardMultiplier = rewardMultiplierForOutcome(outcome);
    var rewardGold = Math.round(state.currentMission.rewardGold * rewardMultiplier);

    return {
      missionId: state.currentMission.id,
      missionName: state.currentMission.name,
      locationId: state.currentMission.locationId,
      locationName: getLocationById(state.currentMission.locationId).name,
      difficulty: state.currentMission.difficulty,
      dc: dc,
      partyIds: clone(state.currentParty),
      partyPower: partyPower,
      roll: roll,
      luck: luck,
      total: total,
      outcome: outcome,
      outcomeLabel: outcomeLabel(outcome),
      rewardGold: rewardGold,
      rewardMultiplier: rewardMultiplier
    };
  }

  function generateTavernOffers(ownedIds, offeredIds, count) {
    var blockedIds = ownedIds.concat(offeredIds);
    var available = window.GameData.recruitPool.filter(function (candidate) {
      return blockedIds.indexOf(candidate.id) === -1;
    });

    return available.slice(0, count).map(function (candidate, index) {
      var power = calculatePower(candidate);
      return {
        id: "offer-" + candidate.id,
        adventurer: clone(candidate),
        cost: 70 + (power * 12) + (index * 5)
      };
    });
  }

  function getNodeTypeMeta(type) {
    return {
      town: { label: "Town", badge: "node-town" },
      capital: { label: "Capital", badge: "node-capital" },
      stronghold: { label: "Stronghold", badge: "node-stronghold" },
      rift: { label: "Rift", badge: "node-rift" }
    }[type];
  }

  window.GameSystems = {
    buildMissionsForLocation: buildMissionsForLocation,
    calculatePower: calculatePower,
    generateTavernOffers: generateTavernOffers,
    getAdventurerById: getAdventurerById,
    getGuildLevel: getGuildLevel,
    getLocationById: getLocationById,
    getNodeTypeMeta: getNodeTypeMeta,
    getPartyMembers: getPartyMembers,
    getPartyPower: getPartyPower,
    outcomeLabel: outcomeLabel,
    resolveMission: resolveMission
  };
}());
