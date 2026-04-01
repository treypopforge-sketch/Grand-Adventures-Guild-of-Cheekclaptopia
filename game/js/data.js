(function () {
  function adventurer(id, name, heroClass, atk, def, spd) {
    return {
      id: id,
      name: name,
      class: heroClass,
      atk: atk,
      def: def,
      spd: spd,
      status: "ready",
      injuryDaysRemaining: 0
    };
  }

  function mission(title, summary, missionType, primaryStat, options) {
    return {
      title: title,
      summary: summary,
      missionType: missionType,
      primaryStat: primaryStat,
      dc: options.dc,
      rewardRange: options.rewardRange,
      modifierBias: options.modifierBias || [],
      difficulty: options.difficulty || null,
      isRare: !!options.isRare,
      isBoss: !!options.isBoss,
      bonusRewardGold: options.bonusRewardGold || 0
    };
  }

  window.GameData = {
    maxPartySize: 3,
    guildLevelThresholds: [0, 300, 800, 1600, 3000],
    dailyRewardGold: 100,
    newRunBonusGold: 50,
    difficultyConfig: {
      Easy: { dc: 10, rewardGold: 90, badge: "easy" },
      Medium: { dc: 15, rewardGold: 140, badge: "medium" },
      Hard: { dc: 20, rewardGold: 210, badge: "hard" }
    },
    missionTypeDetails: {
      Assault: { label: "Assault", short: "AST" },
      Defense: { label: "Defense", short: "DEF" },
      Recon: { label: "Recon", short: "REC" },
      Escort: { label: "Escort", short: "ESC" },
      Raid: { label: "Raid", short: "RAD" }
    },
    missionModifiers: [
      {
        id: "standard",
        label: "Standard",
        tag: "[Standard]",
        dcDelta: 0,
        rewardMultiplier: 1,
        rollBonus: 0,
        luckMin: -5,
        luckMax: 5
      },
      {
        id: "high-risk",
        label: "High Risk",
        tag: "[High Risk]",
        dcDelta: 3,
        rewardMultiplier: 1.5,
        rollBonus: 0,
        luckMin: -5,
        luckMax: 5
      },
      {
        id: "favorable",
        label: "Favorable Conditions",
        tag: "[Favorable]",
        dcDelta: -1,
        rewardMultiplier: 1,
        rollBonus: 2,
        luckMin: -4,
        luckMax: 5
      },
      {
        id: "unstable",
        label: "Unstable",
        tag: "[Unstable]",
        dcDelta: 0,
        rewardMultiplier: 1.2,
        rollBonus: 0,
        luckMin: -8,
        luckMax: 8
      },
      {
        id: "foggy-conditions",
        label: "Foggy Conditions",
        tag: "[Foggy]",
        dcDelta: 0,
        rewardMultiplier: 1.05,
        rollBonus: 0,
        luckMin: -6,
        luckMax: 4,
        statPenaltyKey: "spd",
        statPenaltyValue: 2
      },
      {
        id: "fortified-enemy",
        label: "Fortified Enemy",
        tag: "[Fortified]",
        dcDelta: 2,
        rewardMultiplier: 1.15,
        rollBonus: 0,
        luckMin: -5,
        luckMax: 4
      },
      {
        id: "inspired-party",
        label: "Inspired Party",
        tag: "[Inspired]",
        dcDelta: 0,
        rewardMultiplier: 1.05,
        rollBonus: 1,
        luckMin: -4,
        luckMax: 6
      }
    ],
    statLabels: {
      atk: "Attack",
      def: "Defense",
      spd: "Speed"
    },
    classDetails: {
      Warrior: {
        short: "W",
        flavor: "Front line bruiser",
        statBias: { atk: 1, def: 0, spd: 0 }
      },
      Mage: {
        short: "M",
        flavor: "Arcane artillery",
        statBias: { atk: 0, def: 0, spd: 1 }
      },
      Healer: {
        short: "H",
        flavor: "Support and recovery",
        statBias: { atk: 0, def: 1, spd: 0 }
      },
      Rogue: {
        short: "R",
        flavor: "Speed and precision",
        statBias: { atk: 0, def: 0, spd: 1 }
      },
      Paladin: {
        short: "P",
        flavor: "Sacred defender who steadies the line",
        statBias: { atk: 0, def: 1, spd: 0 }
      },
      Ranger: {
        short: "Rg",
        flavor: "Tracker and skirmisher built for mobility",
        statBias: { atk: 0, def: 0, spd: 1 }
      },
      Berserker: {
        short: "B",
        flavor: "Wild attacker who trades safety for damage",
        statBias: { atk: 2, def: -1, spd: 0 }
      }
    },
    starterAdventurers: [
      adventurer("aria-knight", "Aria the Knight", "Warrior", 3, 2, 1),
      adventurer("luna-mage", "Luna the Mage", "Mage", 4, 1, 3),
      adventurer("sylvia-healer", "Sylvia the Healer", "Healer", 2, 3, 2),
      adventurer("finn-rogue", "Finn the Rogue", "Rogue", 3, 1, 4)
    ],
    tavernStatRanges: {
      1: { min: 3, max: 8 },
      2: { min: 5, max: 10 },
      3: { min: 7, max: 12 }
    },
    recruitNamePools: {
      Warrior: [
        "Bjorn the Warrior",
        "Sera Goldshield",
        "Gideon Ironwall",
        "Rhea Stormblade",
        "Torvin Redcrest",
        "Maeve Lionguard"
      ],
      Mage: [
        "Elara Starflame",
        "Mira Emberglass",
        "Orin Moonspark",
        "Cassia Runeveil",
        "Veyra Spellwake",
        "Talin Ashmire"
      ],
      Healer: [
        "Tamsin Dawnveil",
        "Ione Mercybloom",
        "Vesper Kindroot",
        "Liora Sunmend",
        "Pella Softwind",
        "Nerin Gracewell"
      ],
      Rogue: [
        "Nyx Shadowstep",
        "Kael Quickhand",
        "Cato Nightmark",
        "Sable Duskrun",
        "Riven Lockpick",
        "Mara Swiftcloak"
      ],
      Paladin: [
        "Alden Brightshield",
        "Seraphine Dawnward",
        "Garrick Sunwall",
        "Helena Oathkeep",
        "Lucan Goldvow",
        "Maris Lighthelm"
      ],
      Ranger: [
        "Rowan Fartrail",
        "Asha Greenmark",
        "Kellan Windstep",
        "Tera Longshot",
        "Iris Briarpath",
        "Dain Quickbow"
      ],
      Berserker: [
        "Brakka Redfury",
        "Holt Wildmaw",
        "Siv Flameaxe",
        "Drogan Bloodcry",
        "Vika Stormrage",
        "Rusk Ironhowl"
      ]
    },
    locations: [
      { id: "northwatch", name: "Northwatch", type: "town", x: 14, y: 24, flavor: "A cold frontier settlement guarding the northern pass." },
      { id: "harfang", name: "Harfang", type: "capital", x: 20, y: 33, flavor: "A bustling capital where noble contracts are plentiful." },
      { id: "solharon-keep", name: "Solharon Keep", type: "stronghold", x: 25, y: 44, flavor: "A knightly bastion facing relentless raiders." },
      { id: "dragos-rift", name: "Dragos Rift", type: "rift", x: 39, y: 30, flavor: "A cursed scar in the earth that leaks chaos." },
      { id: "free-crossing", name: "Free Crossing", type: "town", x: 50, y: 39, flavor: "A caravan town with coin to spare and trouble nearby." },
      { id: "valdion", name: "Valdion", type: "capital", x: 59, y: 47, flavor: "The trade heartland where guild fame spreads quickly." },
      { id: "thaloryn-keep", name: "Thaloryn Keep", type: "stronghold", x: 71, y: 31, flavor: "A moonlit fortress with elite contracts." },
      { id: "obsidian-isles", name: "Obsidian Isles", type: "capital", x: 86, y: 35, flavor: "Volcanic holdings rich with dangerous work." },
      { id: "tokitland", name: "Tokitland", type: "town", x: 81, y: 50, flavor: "Island skirmishes and smugglers plague the coast." },
      { id: "avallah", name: "Avallah", type: "stronghold", x: 87, y: 60, flavor: "Highland outposts call for hardened adventurers." },
      { id: "al-qatel", name: "Al-Qatel", type: "capital", x: 48, y: 70, flavor: "Desert fortunes await anyone who survives the dunes." },
      { id: "sunder-point", name: "Sunder Point", type: "town", x: 21, y: 65, flavor: "A rough port town with monster bounties offshore." }
    ],
    missionTemplates: {
      town: {
        Easy: [
          mission("Roadside Patrol", "Scout the caravan road, spot hidden threats, and break contact before the raiders regroup.", "Recon", "spd", {
            dc: 10,
            rewardRange: { min: 80, max: 110 },
            modifierBias: ["foggy-conditions", "standard", "inspired-party"]
          }),
          mission("Hearthguard Escort", "Move villagers and grain wagons to safety while trouble gathers on the edges of town.", "Escort", "def", {
            dc: 10,
            rewardRange: { min: 85, max: 115 },
            modifierBias: ["favorable", "standard"]
          }),
          mission("Farmstead Skirmish", "Drive marauders away from the fields before the harvest stores are burned.", "Assault", "atk", {
            dc: 11,
            rewardRange: { min: 95, max: 125 },
            modifierBias: ["high-risk", "inspired-party"]
          })
        ],
        Medium: [
          mission("Bandit Sweep", "Crush a hardened bandit camp before the outlaws spread deeper into the countryside.", "Assault", "atk", {
            dc: 15,
            rewardRange: { min: 135, max: 170 },
            modifierBias: ["high-risk", "fortified-enemy"]
          }),
          mission("Smuggler Sting", "Track a contraband ring through alleyways and cut off its escape route before dawn.", "Recon", "spd", {
            dc: 14,
            rewardRange: { min: 130, max: 165 },
            modifierBias: ["unstable", "foggy-conditions"]
          }),
          mission("Supply Caravan", "Guard food and medicine on a tense march between exposed hamlets.", "Escort", "def", {
            dc: 15,
            rewardRange: { min: 130, max: 160 },
            modifierBias: ["favorable", "fortified-enemy"]
          })
        ],
        Hard: [
          mission("Night Siege", "Hold the town gate under a savage midnight assault while terrified citizens scramble behind you.", "Defense", "def", {
            dc: 19,
            rewardRange: { min: 180, max: 220 },
            modifierBias: ["fortified-enemy", "foggy-conditions"]
          }),
          mission("Beast Hunt", "Corner a predator that already shattered two patrols and now stalks the outer roads.", "Raid", "atk", {
            dc: 21,
            rewardRange: { min: 215, max: 260 },
            modifierBias: ["high-risk", "unstable"]
          }),
          mission("Evacuation Line", "Escort the last wave of townsfolk through a collapsing battle line without losing the convoy.", "Escort", "def", {
            dc: 20,
            rewardRange: { min: 190, max: 235 },
            modifierBias: ["foggy-conditions", "high-risk"]
          })
        ]
      },
      capital: {
        Easy: [
          mission("Ward Security", "Reinforce civic guards while workers restore order across a fragile district.", "Defense", "def", {
            dc: 10,
            rewardRange: { min: 80, max: 110 },
            modifierBias: ["favorable", "standard"]
          }),
          mission("Pilgrim Escort", "Shepherd a nervous group of travelers safely through crowded and dangerous streets.", "Escort", "def", {
            dc: 11,
            rewardRange: { min: 90, max: 120 },
            modifierBias: ["favorable", "foggy-conditions"]
          }),
          mission("Archive Recon", "Quietly map hidden entries and suspicious traffic around a sealed archive ward.", "Recon", "spd", {
            dc: 10,
            rewardRange: { min: 85, max: 115 },
            modifierBias: ["foggy-conditions", "inspired-party"]
          })
        ],
        Medium: [
          mission("Guild Contract", "Break a violent standoff between rival factions before it erupts into open chaos.", "Assault", "atk", {
            dc: 15,
            rewardRange: { min: 140, max: 175 },
            modifierBias: ["high-risk", "inspired-party"]
          }),
          mission("Treasury Recovery", "Trace stolen taxes through the undercity and reclaim the coffers before they vanish.", "Recon", "spd", {
            dc: 15,
            rewardRange: { min: 135, max: 170 },
            modifierBias: ["unstable", "foggy-conditions"]
          }),
          mission("Procession Guard", "Protect a politically charged parade route from saboteurs and panic alike.", "Escort", "def", {
            dc: 14,
            rewardRange: { min: 135, max: 165 },
            modifierBias: ["favorable", "standard"]
          })
        ],
        Hard: [
          mission("Citadel Defense", "Hold a breached district line until exhausted reinforcements can rally behind you.", "Defense", "def", {
            dc: 19,
            rewardRange: { min: 190, max: 230 },
            modifierBias: ["fortified-enemy", "inspired-party"]
          }),
          mission("Shadow Coup", "Unmask a coup cell hidden in the court and seize its leader before the city wakes.", "Recon", "spd", {
            dc: 20,
            rewardRange: { min: 200, max: 240 },
            modifierBias: ["foggy-conditions", "unstable"]
          }),
          mission("Noble Quarter Raid", "Smash a fortified rebel hold before it can ignite a full district uprising.", "Raid", "atk", {
            dc: 22,
            rewardRange: { min: 225, max: 275 },
            modifierBias: ["high-risk", "fortified-enemy"]
          })
        ]
      },
      stronghold: {
        Easy: [
          mission("Outer Watch", "Rotate with sentries and hold the perimeter against probing enemy pressure.", "Defense", "def", {
            dc: 10,
            rewardRange: { min: 80, max: 110 },
            modifierBias: ["standard", "favorable"]
          }),
          mission("Supply Run", "Move weapons and medicine through hostile ground before the gate stocks fail.", "Escort", "def", {
            dc: 11,
            rewardRange: { min: 90, max: 120 },
            modifierBias: ["foggy-conditions", "favorable"]
          }),
          mission("Ridge Recon", "Survey the ridge line and expose where the next attack column will emerge.", "Recon", "spd", {
            dc: 10,
            rewardRange: { min: 85, max: 115 },
            modifierBias: ["foggy-conditions", "unstable"]
          })
        ],
        Medium: [
          mission("Wall Breach", "Stabilize a cracked flank under pressure while enemy troops pour toward the gap.", "Defense", "def", {
            dc: 15,
            rewardRange: { min: 135, max: 170 },
            modifierBias: ["fortified-enemy", "standard"]
          }),
          mission("Knightly Trial", "Win a brutal proving contract meant to separate true champions from pretenders.", "Assault", "atk", {
            dc: 16,
            rewardRange: { min: 145, max: 180 },
            modifierBias: ["high-risk", "inspired-party"]
          }),
          mission("Border Sweep", "Raid enemy pickets before they can encircle the keep's exposed outworks.", "Raid", "atk", {
            dc: 17,
            rewardRange: { min: 160, max: 195 },
            modifierBias: ["high-risk", "unstable"]
          })
        ],
        Hard: [
          mission("Fortress Breaker", "Destroy an enemy siege engine under fire before it tears open the walls.", "Raid", "atk", {
            dc: 22,
            rewardRange: { min: 225, max: 275 },
            modifierBias: ["high-risk", "fortified-enemy"]
          }),
          mission("Champion Duel", "Crush the famed commander leading the siege and throw the enemy line into panic.", "Assault", "atk", {
            dc: 21,
            rewardRange: { min: 210, max: 255 },
            modifierBias: ["inspired-party", "high-risk"]
          }),
          mission("Last Gate", "Stand on the final gatehouse and keep the fortress from falling before dawn.", "Defense", "def", {
            dc: 20,
            rewardRange: { min: 195, max: 240 },
            modifierBias: ["fortified-enemy", "favorable"]
          })
        ]
      },
      rift: {
        Easy: [
          mission("Rift Scouting", "Slip around corrupted edges and chart which breaches are widening fastest.", "Recon", "spd", {
            dc: 10,
            rewardRange: { min: 85, max: 115 },
            modifierBias: ["unstable", "foggy-conditions"]
          }),
          mission("Seal Sparks", "Hold a ritual perimeter long enough for a warding team to finish its work.", "Defense", "def", {
            dc: 11,
            rewardRange: { min: 90, max: 120 },
            modifierBias: ["favorable", "standard"]
          }),
          mission("Shard Escort", "Protect a fragile relic carrier through tainted ground before the seal fails.", "Escort", "def", {
            dc: 11,
            rewardRange: { min: 95, max: 125 },
            modifierBias: ["foggy-conditions", "favorable"]
          })
        ],
        Medium: [
          mission("Void Cleanse", "Force your way into cursed terrain and break the fiends guarding the ritual site.", "Assault", "atk", {
            dc: 16,
            rewardRange: { min: 150, max: 185 },
            modifierBias: ["high-risk", "unstable"]
          }),
          mission("Relic Retrieval", "Snatch a wardstone from cult hands before the entire zone ignites.", "Recon", "spd", {
            dc: 15,
            rewardRange: { min: 140, max: 175 },
            modifierBias: ["foggy-conditions", "unstable"]
          }),
          mission("Wardstone Escort", "Carry a volatile seal core into position while the breach lashes out at every step.", "Escort", "def", {
            dc: 16,
            rewardRange: { min: 145, max: 180 },
            modifierBias: ["favorable", "high-risk"]
          })
        ],
        Hard: [
          mission("Hellgate Pressure", "Endure a full infernal surge and keep the breach from tearing fully open.", "Defense", "def", {
            dc: 20,
            rewardRange: { min: 200, max: 245 },
            modifierBias: ["fortified-enemy", "unstable"]
          }),
          mission("Demon Vanguard", "Slay the fiend leading the incursion before it snowballs into a full invasion.", "Raid", "atk", {
            dc: 22,
            rewardRange: { min: 225, max: 280 },
            modifierBias: ["high-risk", "unstable"]
          }),
          mission("Ashen Breakthrough", "Punch through a collapsing ritual front and seize the ritual focus intact.", "Assault", "atk", {
            dc: 21,
            rewardRange: { min: 210, max: 255 },
            modifierBias: ["high-risk", "foggy-conditions"]
          })
        ]
      }
    },
    rareEventMissions: [
      mission("Treasure Caravan", "A private vault convoy slipped its escort and now races through contested territory loaded with coin.", "Escort", "spd", {
        dc: 18,
        rewardRange: { min: 260, max: 340 },
        modifierBias: ["high-risk", "foggy-conditions"],
        difficulty: "Hard",
        isRare: true
      }),
      mission("Ambush!", "What looked like a routine contract was bait. Enemies wait on every side and the escape lanes are closing.", "Assault", "atk", {
        dc: 19,
        rewardRange: { min: 230, max: 300 },
        modifierBias: ["high-risk", "unstable"],
        difficulty: "Hard",
        isRare: true
      }),
      mission("Lost Artifact", "A relic has surfaced in the chaos, and several factions are converging to seize it first.", "Recon", "spd", {
        dc: 17,
        rewardRange: { min: 220, max: 280 },
        modifierBias: ["favorable", "foggy-conditions"],
        difficulty: "Medium",
        isRare: true,
        bonusRewardGold: 30
      })
    ],
    bossMissionTemplates: [
      mission("Ancient Dragon Hunt", "A dragon has claimed the skies over the region. One decisive strike could make the guild legendary.", "Raid", "atk", {
        dc: 25,
        rewardRange: { min: 340, max: 430 },
        modifierBias: ["high-risk", "fortified-enemy"],
        difficulty: "Hard",
        isBoss: true,
        bonusRewardGold: 90
      }),
      mission("Rift Tyrant", "A towering fiend now anchors the breach. If it is not broken, the entire front may collapse.", "Defense", "def", {
        dc: 24,
        rewardRange: { min: 320, max: 400 },
        modifierBias: ["unstable", "fortified-enemy"],
        difficulty: "Hard",
        isBoss: true,
        bonusRewardGold: 80
      }),
      mission("Usurper Warmarshal", "An elite warlord has united the raiders. End the campaign by cutting down the commander at its heart.", "Assault", "atk", {
        dc: 23,
        rewardRange: { min: 300, max: 380 },
        modifierBias: ["high-risk", "inspired-party"],
        difficulty: "Hard",
        isBoss: true,
        bonusRewardGold: 70
      })
    ],
    missionReportLines: {
      Assault: {
        criticalSuccess: ["The enemy lines were shattered in a decisive strike."],
        perfectSuccess: ["The assault landed exactly where the foe was weakest."],
        success: ["The party broke through and seized the objective under pressure."],
        partialSuccess: ["The strike connected, but the enemy made the guild pay for every step."],
        failure: ["The assault stalled before the line could be broken."],
        criticalFailure: ["The charge collapsed and the battlefield turned into a rout."]
      },
      Defense: {
        criticalSuccess: ["The defenses held firm and the attackers were thrown back hard."],
        perfectSuccess: ["Every gap was sealed before the enemy could exploit it."],
        success: ["The line bent, but it did not break."],
        partialSuccess: ["The defenders held just long enough to scrape through the contract."],
        failure: ["The defenses crumbled under relentless pressure."],
        criticalFailure: ["The defense collapsed outright, leaving the field in chaos."]
      },
      Recon: {
        criticalSuccess: ["The scouts moved unseen and returned with complete control of the field."],
        perfectSuccess: ["The reconnaissance was sharp, quiet, and dangerously effective."],
        success: ["The team gathered what it needed and slipped out ahead of pursuit."],
        partialSuccess: ["The scouts made it back, but the route was messier than planned."],
        failure: ["The party lost the trail and the opportunity slipped away."],
        criticalFailure: ["The recon unraveled and the party stumbled into the enemy's grip."]
      },
      Escort: {
        criticalSuccess: ["Every charge under the guild's care arrived untouched and ahead of schedule."],
        perfectSuccess: ["The escort route stayed secure from start to finish."],
        success: ["The convoy made it through despite steady resistance."],
        partialSuccess: ["The escort survived, but only after a punishing march."],
        failure: ["The route broke down and the protected target was lost."],
        criticalFailure: ["The escort column was scattered in disaster before the destination was reached."]
      },
      Raid: {
        criticalSuccess: ["The raid hit like thunder and left the target in ruins."],
        perfectSuccess: ["The raiders struck deep and withdrew with the field firmly won."],
        success: ["The raid succeeded after a brutal exchange of blows."],
        partialSuccess: ["The target was damaged, but the raid nearly came apart on the way out."],
        failure: ["The raid bogged down before the target could be broken."],
        criticalFailure: ["The raid was swallowed by resistance and turned into a nightmare withdrawal."]
      }
    },
    modifierReportNotes: {
      rare: {
        success: ["A fortunate turn led to unexpected riches."],
        failure: ["The rare opportunity vanished before the guild could truly claim it."]
      },
      boss: {
        success: ["Stories of the guild's victory will travel far beyond this region."],
        failure: ["The boss still stands, and the cost of facing it will be felt tomorrow."]
      },
      "high-risk": {
        success: ["The danger paid off in heavier spoils."],
        failure: ["The added risk tipped the contract over the edge."]
      },
      "unstable": {
        success: ["Wild conditions broke in the guild's favor at the perfect moment."],
        failure: ["The unstable field shifted at the worst possible time."]
      },
      "foggy-conditions": {
        success: ["Even in poor visibility, the party kept its bearings."],
        failure: ["The haze ruined timing and visibility when it mattered most."]
      },
      "fortified-enemy": {
        success: ["The enemy's strong position was cracked apart through sheer resolve."],
        failure: ["The fortified position proved harder to crack than expected."]
      },
      "inspired-party": {
        success: ["The party's momentum never faltered once the push began."],
        failure: ["Even strong morale could not save the plan from unraveling."]
      }
    }
  };
}());
