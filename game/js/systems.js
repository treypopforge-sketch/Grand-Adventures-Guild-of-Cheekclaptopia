(function () {
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomFrom(list) {
    return list[randomInt(0, list.length - 1)];
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
        rewardGold: config.rewardGold,
        primaryStat: template.primaryStat
      };
    });
  }

  function getAdventurerById(adventurers, adventurerId) {
    return adventurers.find(function (adventurer) {
      return adventurer.id === adventurerId;
    }) || null;
  }

  function getPartyById(state, partyId) {
    return state.currentParties.find(function (party) {
      return String(party.id) === String(partyId);
    }) || null;
  }

  function getPartyMembers(state, partyId) {
    var party = getPartyById(state, partyId || state.activePartyId);
    if (!party) {
      return [];
    }

    return party.members.map(function (id) {
      return getAdventurerById(state.adventurers, id);
    }).filter(Boolean);
  }

  function getPartyPower(state, partyId) {
    return getPartyMembers(state, partyId).reduce(function (sum, member) {
      return sum + calculatePower(member);
    }, 0);
  }

  function getPartyStatTotal(state, partyId, statKey) {
    return getPartyMembers(state, partyId).reduce(function (sum, member) {
      return sum + (member[statKey] || 0);
    }, 0);
  }

  function getGuildLevel(state) {
    if (state && typeof state.guildLevel === "number") {
      return state.guildLevel;
    }

    return getGuildLevelFromGoldSpent(state && typeof state.totalGoldSpent === "number" ? state.totalGoldSpent : 0);
  }

  function getGuildLevelFromGoldSpent(totalGoldSpent) {
    var thresholds = window.GameData.guildLevelThresholds || [0];
    var level = 1;
    var index;

    for (index = 0; index < thresholds.length; index += 1) {
      if (totalGoldSpent >= thresholds[index]) {
        level = index + 1;
      }
    }

    return level;
  }

  function getNextGuildLevelTarget(level) {
    var thresholds = window.GameData.guildLevelThresholds || [0];
    return thresholds[level] || null;
  }

  function getGuildProgress(state) {
    var level = getGuildLevel(state);
    var thresholds = window.GameData.guildLevelThresholds || [0];
    var currentThreshold = thresholds[Math.max(0, level - 1)] || 0;
    var nextThreshold = getNextGuildLevelTarget(level);
    var spent = state.totalGoldSpent || 0;

    return {
      level: level,
      spent: spent,
      currentThreshold: currentThreshold,
      nextThreshold: nextThreshold,
      currentProgress: nextThreshold ? spent - currentThreshold : spent,
      neededForNext: nextThreshold ? nextThreshold - currentThreshold : 0
    };
  }

  function getPartyCapacity(state) {
    if (state && typeof state.maxParties === "number") {
      return state.maxParties;
    }

    return Math.max(1, Math.min(3, getGuildLevel(state)));
  }

  function getPartyCapacityForLevel(guildLevel) {
    return Math.max(1, Math.min(3, guildLevel));
  }

  function getTavernStatRange(guildLevel) {
    var clampedLevel = Math.max(1, Math.min(3, guildLevel || 1));

    if (window.GameData.tavernStatRanges[clampedLevel]) {
      return window.GameData.tavernStatRanges[clampedLevel];
    }

    return {
      min: 7,
      max: 12
    };
  }

  function generateRecruit(state, index) {
    var classes = Object.keys(window.GameData.classDetails);
    var heroClass = randomFrom(classes);
    var range = getTavernStatRange(getGuildLevel(state));
    var namePool = window.GameData.recruitNamePools[heroClass];
    var usedNames = state.adventurers.map(function (adventurer) {
      return adventurer.name;
    }).concat(state.tavernOffers.map(function (offer) {
      return offer.adventurer.name;
    }));
    var selectedName = randomFrom(namePool);
    var safety = 0;

    while (usedNames.indexOf(selectedName) !== -1 && safety < namePool.length * 2) {
      selectedName = randomFrom(namePool);
      safety += 1;
    }

    return {
      id: "recruit-" + heroClass.toLowerCase() + "-" + Date.now() + "-" + randomInt(1000, 9999) + "-" + index,
      name: selectedName,
      class: heroClass,
      atk: randomInt(range.min, range.max),
      def: randomInt(range.min, range.max),
      spd: randomInt(range.min, range.max),
      status: "ready",
      injuryDaysRemaining: 0
    };
  }

  function generateTavernOffers(state, count) {
    var offers = [];
    var workingState = {
      adventurers: clone(state.adventurers || []),
      tavernOffers: clone(state.tavernOffers || []),
      guildLevel: getGuildLevel(state)
    };

    while (offers.length < count) {
      var recruit = generateRecruit(workingState, offers.length);
      workingState.tavernOffers.push({ adventurer: recruit });
      offers.push({
        id: "offer-" + recruit.id,
        adventurer: recruit,
        cost: 70 + (calculatePower(recruit) * 12) + (getGuildLevel(state) * 8)
      });
    }

    return offers;
  }

  function getStatLabel(statKey) {
    return (window.GameData.statLabels && window.GameData.statLabels[statKey]) || statKey.toUpperCase();
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

  function buildMissionReport(outcome) {
    var reports = {
      criticalSuccess: "The party overwhelmed the enemy with ease. The guild returns triumphant and feared.",
      perfectSuccess: "The team executed the mission with near flawless precision. Their efficiency paid off.",
      success: "The mission succeeded, but not without resistance.",
      partialSuccess: "The party scraped through the contract. It counted, but the field took its toll.",
      failure: "The team struggled and returned empty-handed.",
      criticalFailure: "The contract collapsed in disaster. The survivors limped home badly hurt."
    };

    return reports[outcome];
  }

  function getClassCounts(partyMembers) {
    return partyMembers.reduce(function (counts, member) {
      counts[member.class] = (counts[member.class] || 0) + 1;
      return counts;
    }, {});
  }

  function getSynergyBonus(partyMembers) {
    var uniqueClasses = Object.keys(getClassCounts(partyMembers));
    var bonus = 0;

    if (uniqueClasses.length === 2) {
      bonus += 2;
    } else if (uniqueClasses.length >= 3) {
      bonus += 4;
    }

    if (uniqueClasses.indexOf("Warrior") !== -1 && uniqueClasses.indexOf("Healer") !== -1) {
      bonus += 2;
    }

    if (uniqueClasses.indexOf("Mage") !== -1 && uniqueClasses.indexOf("Rogue") !== -1) {
      bonus += 2;
    }

    return bonus;
  }

  function getClassBonusBundle(partyMembers, rawLuck) {
    var counts = getClassCounts(partyMembers);
    var mageBonus = (counts.Mage || 0) * 1;
    var warriorBonus = (counts.Warrior || 0) * 2;
    var healerBonus = rawLuck < 0 ? Math.min(Math.abs(rawLuck), (counts.Healer || 0) * 2) : 0;
    var rogueBonus = 0;
    var rogueTriggers = 0;
    var rogueCount = counts.Rogue || 0;
    var index;

    for (index = 0; index < rogueCount; index += 1) {
      if (Math.random() < 0.1) {
        rogueBonus += 2;
        rogueTriggers += 1;
      }
    }

    return {
      total: warriorBonus + mageBonus + healerBonus + rogueBonus,
      warriorBonus: warriorBonus,
      mageBonus: mageBonus,
      rogueBonus: rogueBonus,
      rogueTriggers: rogueTriggers,
      healerBonus: healerBonus
    };
  }

  function resolveMission(state, partyId) {
    if (!state.currentMission) {
      return null;
    }

    var party = getPartyById(state, partyId || state.activePartyId);
    if (!party || !party.members.length) {
      return null;
    }

    var partyMembers = getPartyMembers(state, party.id);
    var basePower = getPartyPower(state, party.id);
    var roll = randomInt(1, 20);
    var luck = randomInt(-5, 5);
    var statTotal = getPartyStatTotal(state, party.id, state.currentMission.primaryStat);
    var statBonus = Math.floor(statTotal / 5);
    var synergyBonus = getSynergyBonus(partyMembers);
    var classBundle = getClassBonusBundle(partyMembers, luck);
    var classBonus = classBundle.total;
    var total = basePower + roll + luck + statBonus + synergyBonus + classBonus;
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
      partyId: party.id,
      partyIds: clone(party.members),
      partyPower: basePower,
      basePower: basePower,
      roll: roll,
      luck: luck,
      statBonus: statBonus,
      statTotal: statTotal,
      primaryStat: state.currentMission.primaryStat,
      primaryStatLabel: getStatLabel(state.currentMission.primaryStat),
      synergyBonus: synergyBonus,
      classBonus: classBonus,
      classBreakdown: classBundle,
      total: total,
      difference: total - dc,
      outcome: outcome,
      outcomeLabel: outcomeLabel(outcome),
      rewardGold: rewardGold,
      rewardMultiplier: rewardMultiplier,
      report: buildMissionReport(outcome)
    };
  }

  function getNodeTypeMeta(type) {
    return {
      town: { label: "Town", badge: "node-town" },
      capital: { label: "Capital", badge: "node-capital" },
      stronghold: { label: "Stronghold", badge: "node-stronghold" },
      rift: { label: "Rift", badge: "node-rift" }
    }[type];
  }

  function getMissionRiskWarnings(state, partyId) {
    var partyMembers = getPartyMembers(state, partyId);
    var warnings = [];
    var hasUnavailable = partyMembers.some(function (member) {
      return member.status !== "ready";
    });
    var hasValuableUnit = partyMembers.some(function (member) {
      return calculatePower(member) >= 10;
    });

    if (hasUnavailable) {
      warnings.push("This party has recovering units and cannot deploy yet.");
    } else if (partyMembers.length) {
      warnings.push("This party will become unavailable after mission.");
      warnings.push("Failure may cause injury.");
    }

    if (hasValuableUnit) {
      warnings.push("A high-value adventurer is in this party.");
    }

    return warnings;
  }

  function getStatusLabel(adventurer) {
    if (adventurer.status === "injured") {
      return "Injured (" + adventurer.injuryDaysRemaining + "d)";
    }
    if (adventurer.status === "tired") {
      return "Tired";
    }
    return "Ready";
  }

  function runEndOfDayHooks() {
    return null;
  }

  window.GameSystems = {
    buildMissionReport: buildMissionReport,
    buildMissionsForLocation: buildMissionsForLocation,
    calculatePower: calculatePower,
    generateTavernOffers: generateTavernOffers,
    getAdventurerById: getAdventurerById,
    getGuildLevel: getGuildLevel,
    getGuildLevelFromGoldSpent: getGuildLevelFromGoldSpent,
    getGuildProgress: getGuildProgress,
    getLocationById: getLocationById,
    getMissionRiskWarnings: getMissionRiskWarnings,
    getNodeTypeMeta: getNodeTypeMeta,
    getNextGuildLevelTarget: getNextGuildLevelTarget,
    getPartyById: getPartyById,
    getPartyCapacity: getPartyCapacity,
    getPartyCapacityForLevel: getPartyCapacityForLevel,
    getPartyMembers: getPartyMembers,
    getPartyPower: getPartyPower,
    getPartyStatTotal: getPartyStatTotal,
    getStatLabel: getStatLabel,
    getStatusLabel: getStatusLabel,
    getTavernStatRange: getTavernStatRange,
    outcomeLabel: outcomeLabel,
    resolveMission: resolveMission,
    runEndOfDayHooks: runEndOfDayHooks
  };
}());
