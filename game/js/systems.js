(function () {
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function syncLegacyAndExpandedStats(adventurer) {
    if (typeof adventurer.atk !== "number") {
      adventurer.atk = typeof adventurer.str === "number" ? adventurer.str : 0;
    }
    if (typeof adventurer.def !== "number") {
      adventurer.def = typeof adventurer.sta === "number" ? adventurer.sta : 0;
    }
    if (typeof adventurer.spd !== "number") {
      adventurer.spd = typeof adventurer.dex === "number" ? adventurer.dex : 0;
    }

    if (typeof adventurer.str !== "number") {
      adventurer.str = adventurer.atk;
    }
    if (typeof adventurer.dex !== "number") {
      adventurer.dex = adventurer.spd;
    }
    if (typeof adventurer.sta !== "number") {
      adventurer.sta = adventurer.def;
    }
    if (typeof adventurer.cha !== "number") {
      adventurer.cha = 0;
    }
    if (typeof adventurer.mp !== "number") {
      adventurer.mp = 0;
    }

    return adventurer;
  }

  function getAdventurerState(adventurer) {
    if (!adventurer) {
      return "available";
    }

    if (adventurer.state === "available" || adventurer.state === "onQuest" || adventurer.state === "recovering" || adventurer.state === "exhausted") {
      return adventurer.state;
    }

    if (adventurer.status === "injured") {
      return "exhausted";
    }

    if (adventurer.status === "tired" || adventurer.isTired) {
      return "recovering";
    }

    return "available";
  }

  function getCanonicalStatKey(statKey) {
    if (statKey === "atk" || statKey === "str") {
      return "str";
    }

    if (statKey === "def" || statKey === "sta") {
      return "sta";
    }

    if (statKey === "spd" || statKey === "dex") {
      return "dex";
    }

    return statKey;
  }

  function isAdventurerReady(adventurer) {
    return getAdventurerState(adventurer) === "available";
  }

  function getAdventurerStat(adventurer, statKey) {
    var canonicalStatKey = getCanonicalStatKey(statKey);

    if (!adventurer) {
      return 0;
    }

    if (canonicalStatKey === "str") {
      return typeof adventurer.str === "number" ? adventurer.str : (adventurer.atk || 0);
    }

    if (canonicalStatKey === "sta") {
      return typeof adventurer.sta === "number" ? adventurer.sta : (adventurer.def || 0);
    }

    if (canonicalStatKey === "dex") {
      return typeof adventurer.dex === "number" ? adventurer.dex : (adventurer.spd || 0);
    }

    if (canonicalStatKey === "cha" || canonicalStatKey === "mp") {
      return typeof adventurer[canonicalStatKey] === "number" ? adventurer[canonicalStatKey] : 0;
    }

    return typeof adventurer[canonicalStatKey] === "number" ? adventurer[canonicalStatKey] : 0;
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomFrom(list) {
    return list[randomInt(0, list.length - 1)];
  }

  function shuffle(list) {
    var copy = list.slice();
    var index;
    var swapIndex;
    var temp;

    for (index = copy.length - 1; index > 0; index -= 1) {
      swapIndex = randomInt(0, index);
      temp = copy[index];
      copy[index] = copy[swapIndex];
      copy[swapIndex] = temp;
    }

    return copy;
  }

  function calculatePower(adventurer) {
    var hasExpandedCombatStats = typeof adventurer.str === "number" && typeof adventurer.dex === "number" && typeof adventurer.sta === "number";
    var power;

    if (hasExpandedCombatStats) {
      power = (adventurer.str * 1.2) + (adventurer.dex * 0.8) + (adventurer.sta * 1.0);
    } else {
      power = (adventurer.atk || 0) + ((adventurer.def || 0) * 0.7) + ((adventurer.spd || 0) * 0.5);
    }

    return Math.round(power);
  }

  function getLocationById(locationId) {
    return window.GameData.locations.find(function (location) {
      return location.id === locationId;
    }) || null;
  }

  function getMissionTypeLabel(missionType) {
    var details = window.GameData.missionTypeDetails[missionType];
    return details ? details.label : missionType;
  }

  function getMissionTemplate(location, difficultyLabel) {
    var locationIndex = window.GameData.locations.findIndex(function (entry) {
      return entry.id === location.id;
    });
    var templates = window.GameData.missionTemplates[location.type][difficultyLabel];
    return templates[locationIndex % templates.length];
  }

  function getLocationMissionPool(location) {
    var locationTypeTemplates = window.GameData.missionTemplates[location.type];
    var pool = [];

    Object.keys(locationTypeTemplates).forEach(function (difficultyLabel) {
      locationTypeTemplates[difficultyLabel].forEach(function (template) {
        var entry = clone(template);
        entry.difficulty = entry.difficulty || difficultyLabel;
        pool.push(entry);
      });
    });

    return pool;
  }

  function findModifierById(modifierId) {
    return window.GameData.missionModifiers.find(function (modifier) {
      return modifier.id === modifierId;
    }) || window.GameData.missionModifiers[0];
  }

  function pickModifierForMission(template) {
    var allModifiers = window.GameData.missionModifiers;
    var preferredModifiers = (template.modifierBias || []).map(findModifierById);

    if (preferredModifiers.length && Math.random() < 0.75) {
      return randomFrom(preferredModifiers);
    }

    return randomFrom(allModifiers);
  }

  function getMissionSpecialTag(template) {
    if (template.isBoss) {
      return "[BOSS]";
    }
    if (template.isRare) {
      return "[RARE]";
    }
    return "";
  }

  function createMissionFromTemplate(location, template, options) {
    var difficulty = template.difficulty || (options && options.difficulty) || "Medium";
    var rewardRoll = options && typeof options.rewardRoll === "number"
      ? options.rewardRoll
      : Math.round((template.rewardRange.min + template.rewardRange.max) / 2);
    var modifier = clone((options && options.modifier) || findModifierById("standard"));
    var dcRoll = options && typeof options.dcRoll === "number" ? options.dcRoll : template.dc;
    var rewardGold = Math.max(50, Math.round(rewardRoll * (modifier.rewardMultiplier || 1)));
    var dc = Math.max(8, dcRoll + (modifier.dcDelta || 0));
    var idSeed = options && options.idSeed ? options.idSeed : location.id + "-" + difficulty.toLowerCase();
    var questId = template.questId || idSeed;

    return {
      id: idSeed,
      questId: questId,
      locationId: location.id,
      name: location.name + ": " + template.title,
      summary: template.summary,
      difficulty: difficulty,
      rank: template.rank || difficulty,
      duration: typeof template.duration === "number" ? template.duration : 1,
      events: clone(template.events || []),
      dc: dc,
      rewardGold: rewardGold,
      primaryStat: template.primaryStat,
      missionType: template.missionType,
      missionTypeLabel: getMissionTypeLabel(template.missionType),
      modifier: modifier,
      modifierBias: clone(template.modifierBias || []),
      isRare: !!template.isRare,
      isBoss: !!template.isBoss,
      specialTag: getMissionSpecialTag(template),
      bonusRewardGold: template.bonusRewardGold || 0
    };
  }

  function buildMissionsForLocation(locationId) {
    var location = getLocationById(locationId);
    if (!location) {
      return [];
    }

    return Object.keys(window.GameData.difficultyConfig).map(function (difficultyLabel) {
      var template = getMissionTemplate(location, difficultyLabel);
      return createMissionFromTemplate(location, template, {
        difficulty: difficultyLabel,
        idSeed: location.id + "-" + difficultyLabel.toLowerCase()
      });
    });
  }

  function getMissionsForLocation(state, locationId) {
    if (state && Array.isArray(state.currentMissions) && state.currentMissions.length) {
      return state.currentMissions.filter(function (mission) {
        return mission.locationId === locationId;
      });
    }

    return buildMissionsForLocation(locationId);
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
      return sum + getAdventurerStat(member, statKey);
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

  function applyClassStatBias(recruit) {
    var classDetails = window.GameData.classDetails[recruit.class] || {};
    var statBias = classDetails.statBias || {};

    recruit.atk = Math.max(1, recruit.atk + (statBias.atk || statBias.str || 0));
    recruit.def = Math.max(1, recruit.def + (statBias.def || statBias.sta || 0));
    recruit.spd = Math.max(1, recruit.spd + (statBias.spd || statBias.dex || 0));

    return syncLegacyAndExpandedStats(recruit);
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
    var recruit;

    while (usedNames.indexOf(selectedName) !== -1 && safety < namePool.length * 2) {
      selectedName = randomFrom(namePool);
      safety += 1;
    }

    recruit = {
      id: "recruit-" + heroClass.toLowerCase() + "-" + Date.now() + "-" + randomInt(1000, 9999) + "-" + index,
      name: selectedName,
      class: heroClass,
      atk: randomInt(range.min, range.max),
      def: randomInt(range.min, range.max),
      spd: randomInt(range.min, range.max),
      cha: 0,
      mp: 0,
      state: "available",
      status: "ready",
      injuryDaysRemaining: 0
    };

    return applyClassStatBias(syncLegacyAndExpandedStats(recruit));
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

  function createRandomDailyMission(location, index) {
    var template = randomFrom(getLocationMissionPool(location));
    var modifier = pickModifierForMission(template);
    return createMissionFromTemplate(location, template, {
      idSeed: "daily-" + location.id + "-" + index + "-" + Date.now(),
      rewardRoll: randomInt(template.rewardRange.min, template.rewardRange.max),
      dcRoll: template.dc + randomInt(-1, 1),
      modifier: modifier
    });
  }

  function createSpecialMission(location, template, idPrefix, index) {
    var modifier = pickModifierForMission(template);
    var dcBonus = template.isBoss ? randomInt(0, 2) : randomInt(-1, 1);

    return createMissionFromTemplate(location, template, {
      idSeed: idPrefix + "-" + location.id + "-" + index + "-" + Date.now(),
      rewardRoll: randomInt(template.rewardRange.min, template.rewardRange.max),
      dcRoll: template.dc + dcBonus,
      modifier: modifier
    });
  }

  function generateDailyMissions(state) {
    var missionCount = randomInt(3, 5);
    var locations = shuffle(window.GameData.locations).slice(0, missionCount);
    var dailyMissions = locations.map(function (location, index) {
      return createRandomDailyMission(location, index);
    });
    var rareChance = 0.14;
    var bossChance = getGuildLevel(state) >= 2 ? 0.18 : 0;
    var rareIndex;
    var bossIndex;
    var bossLocation;

    if (dailyMissions.length && Math.random() < rareChance) {
      rareIndex = randomInt(0, dailyMissions.length - 1);
      dailyMissions[rareIndex] = createSpecialMission(
        locations[rareIndex],
        randomFrom(window.GameData.rareEventMissions),
        "rare",
        rareIndex
      );
    }

    if (dailyMissions.length && Math.random() < bossChance) {
      bossIndex = randomInt(0, dailyMissions.length - 1);
      if (typeof rareIndex === "number" && dailyMissions.length > 1 && bossIndex === rareIndex) {
        bossIndex = (bossIndex + 1) % dailyMissions.length;
      }
      bossLocation = locations[bossIndex];
      dailyMissions[bossIndex] = createSpecialMission(
        bossLocation,
        randomFrom(window.GameData.bossMissionTemplates),
        "boss",
        bossIndex
      );
    }

    return dailyMissions;
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

  function isPositiveOutcome(outcome) {
    return ["criticalSuccess", "perfectSuccess", "success", "partialSuccess"].indexOf(outcome) !== -1;
  }

  function buildMissionReport(mission, outcome) {
    var missionType = mission && mission.missionType ? mission.missionType : "Assault";
    var reportLines = window.GameData.missionReportLines[missionType] || window.GameData.missionReportLines.Assault;
    var baseLine = randomFrom(reportLines[outcome] || reportLines.success);
    var modifier = mission && mission.modifier ? mission.modifier : null;
    var noteGroup = null;
    var toneKey = isPositiveOutcome(outcome) ? "success" : "failure";
    var extraNote = "";

    if (mission && mission.isBoss) {
      noteGroup = window.GameData.modifierReportNotes.boss;
    } else if (mission && mission.isRare) {
      noteGroup = window.GameData.modifierReportNotes.rare;
    } else if (modifier && window.GameData.modifierReportNotes[modifier.id]) {
      noteGroup = window.GameData.modifierReportNotes[modifier.id];
    }

    if (noteGroup && noteGroup[toneKey]) {
      extraNote = randomFrom(noteGroup[toneKey]);
    }

    return extraNote ? baseLine + " " + extraNote : baseLine;
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

    if (uniqueClasses.indexOf("Paladin") !== -1 && uniqueClasses.indexOf("Healer") !== -1) {
      bonus += 2;
    }

    if (uniqueClasses.indexOf("Ranger") !== -1 && uniqueClasses.indexOf("Rogue") !== -1) {
      bonus += 2;
    }

    return bonus;
  }

  function getClassBonusBundle(partyMembers, mission, rawLuck) {
    var counts = getClassCounts(partyMembers);
    var favoredStat = mission ? getCanonicalStatKey(mission.primaryStat) : "";
    var mageBonus = (counts.Mage || 0) * 1;
    var warriorBonus = (counts.Warrior || 0) * 2;
    var healerBonus = rawLuck < 0 ? Math.min(Math.abs(rawLuck), (counts.Healer || 0) * 2) : 0;
    var rogueBonus = 0;
    var rogueTriggers = 0;
    var rogueCount = counts.Rogue || 0;
    var paladinBonus = counts.Paladin ? (counts.Paladin + 1) : 0;
    var rangerBonus = favoredStat === "dex" ? (counts.Ranger || 0) * 2 : (counts.Ranger || 0);
    var berserkerBonus = (counts.Berserker || 0) * 2;
    var berserkerRiskPenalty = counts.Berserker ? Math.min(2, counts.Berserker) : 0;
    var index;

    for (index = 0; index < rogueCount; index += 1) {
      if (Math.random() < 0.1) {
        rogueBonus += 2;
        rogueTriggers += 1;
      }
    }

    return {
      total: warriorBonus + mageBonus + healerBonus + rogueBonus + paladinBonus + rangerBonus + berserkerBonus - berserkerRiskPenalty,
      warriorBonus: warriorBonus,
      mageBonus: mageBonus,
      rogueBonus: rogueBonus,
      rogueTriggers: rogueTriggers,
      healerBonus: healerBonus,
      paladinBonus: paladinBonus,
      rangerBonus: rangerBonus,
      berserkerBonus: berserkerBonus,
      berserkerRiskPenalty: berserkerRiskPenalty
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

    var mission = state.currentMission;
    var partyMembers = getPartyMembers(state, party.id);
    var basePower = getPartyPower(state, party.id);
    var modifier = mission.modifier || findModifierById("standard");
    var missionStatKey = getCanonicalStatKey(mission.primaryStat);
    var roll = randomInt(1, 20);
    var luck = randomInt(modifier.luckMin, modifier.luckMax);
    var statPenalty = getCanonicalStatKey(modifier.statPenaltyKey) === missionStatKey ? (modifier.statPenaltyValue || 0) : 0;
    var statTotal = Math.max(0, getPartyStatTotal(state, party.id, missionStatKey) - statPenalty);
    var statBonus = Math.floor(statTotal / 5);
    var synergyBonus = getSynergyBonus(partyMembers);
    var classBundle = getClassBonusBundle(partyMembers, mission, luck);
    var classBonus = classBundle.total;
    var modifierRollBonus = modifier.rollBonus || 0;
    var total = basePower + roll + luck + statBonus + synergyBonus + classBonus + modifierRollBonus;
    var dc = mission.dc;
    var outcome = "failure";
    var rewardMultiplier;
    var bonusRewardGold = 0;
    var rewardGold;

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

    rewardMultiplier = rewardMultiplierForOutcome(outcome);
    if (isPositiveOutcome(outcome)) {
      bonusRewardGold = mission.bonusRewardGold || 0;
    }
    rewardGold = Math.round((mission.rewardGold * rewardMultiplier) + bonusRewardGold);

    return {
      missionId: mission.id,
      missionName: mission.name,
      locationId: mission.locationId,
      locationName: getLocationById(mission.locationId).name,
      difficulty: mission.difficulty,
      dc: dc,
      partyId: party.id,
      partyIds: clone(party.members),
      partyPower: basePower,
      basePower: basePower,
      roll: roll,
      luck: luck,
      modifierRollBonus: modifierRollBonus,
      statBonus: statBonus,
      statTotal: statTotal,
      statPenalty: statPenalty,
      primaryStat: mission.primaryStat,
      primaryStatLabel: getStatLabel(mission.primaryStat),
      missionType: mission.missionType,
      missionTypeLabel: getMissionTypeLabel(mission.missionType),
      isRare: !!mission.isRare,
      isBoss: !!mission.isBoss,
      specialTag: mission.specialTag || getMissionSpecialTag(mission),
      modifier: clone(modifier),
      synergyBonus: synergyBonus,
      classBonus: classBonus,
      classBreakdown: classBundle,
      total: total,
      difference: total - dc,
      outcome: outcome,
      outcomeLabel: outcomeLabel(outcome),
      rewardGold: rewardGold,
      rewardMultiplier: rewardMultiplier,
      bonusRewardGold: bonusRewardGold,
      report: buildMissionReport(mission, outcome)
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
      return !isAdventurerReady(member);
    });
    var hasValuableUnit = partyMembers.some(function (member) {
      return calculatePower(member) >= 10;
    });
    var hasBerserker = partyMembers.some(function (member) {
      return member.class === "Berserker";
    });
    var mission = state.currentMission;

    if (hasUnavailable) {
      warnings.push("This party has unavailable adventurers and cannot deploy yet.");
    } else if (partyMembers.length) {
      warnings.push("This party will become unavailable after mission.");
      warnings.push("Failure may cause injury.");
    }

    if (mission && mission.isBoss) {
      warnings.push("Boss contracts are lethal and demand a truly strong lineup.");
    } else if (mission && mission.isRare) {
      warnings.push("Rare contracts vanish when the day rolls over.");
    }

    if (hasBerserker && mission) {
      warnings.push("Berserkers raise damage output, but they also make the run swingier.");
    }

    if (hasValuableUnit) {
      warnings.push("A high-value adventurer is in this party.");
    }

    return warnings;
  }

  function getStatusLabel(adventurer) {
    var adventurerState = getAdventurerState(adventurer);

    if (adventurerState === "onQuest") {
      return "On Quest";
    }
    if (adventurerState === "recovering") {
      return "Recovering";
    }
    if (adventurerState === "exhausted") {
      return "Exhausted (" + adventurer.injuryDaysRemaining + "d)";
    }
    return "Available";
  }

  function runEndOfDayHooks() {
    return null;
  }

  window.GameSystems = {
    buildMissionReport: buildMissionReport,
    buildMissionsForLocation: buildMissionsForLocation,
    calculatePower: calculatePower,
    generateDailyMissions: generateDailyMissions,
    generateTavernOffers: generateTavernOffers,
    getAdventurerById: getAdventurerById,
    getAdventurerState: getAdventurerState,
    getAdventurerStat: getAdventurerStat,
    getGuildLevel: getGuildLevel,
    getGuildLevelFromGoldSpent: getGuildLevelFromGoldSpent,
    getGuildProgress: getGuildProgress,
    getLocationById: getLocationById,
    getMissionRiskWarnings: getMissionRiskWarnings,
    getMissionsForLocation: getMissionsForLocation,
    getMissionTypeLabel: getMissionTypeLabel,
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
    isAdventurerReady: isAdventurerReady,
    outcomeLabel: outcomeLabel,
    resolveMission: resolveMission,
    runEndOfDayHooks: runEndOfDayHooks
  };
}());
