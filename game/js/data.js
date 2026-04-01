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

  function mission(title, summary, primaryStat) {
    return {
      title: title,
      summary: summary,
      primaryStat: primaryStat
    };
  }

  window.GameData = {
    maxPartySize: 3,
    difficultyConfig: {
      Easy: { dc: 10, rewardGold: 90, badge: "easy" },
      Medium: { dc: 15, rewardGold: 140, badge: "medium" },
      Hard: { dc: 20, rewardGold: 210, badge: "hard" }
    },
    statLabels: {
      atk: "Attack",
      def: "Defense",
      spd: "Speed"
    },
    classDetails: {
      Warrior: { short: "W", flavor: "Front line bruiser" },
      Mage: { short: "M", flavor: "Arcane artillery" },
      Healer: { short: "H", flavor: "Support and recovery" },
      Rogue: { short: "R", flavor: "Speed and precision" }
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
          mission("Roadside Patrol", "Escort a merchant road and repel petty bandits.", "spd"),
          mission("Wolf Cull", "Thin a hungry pack stalking the outer farms.", "atk")
        ],
        Medium: [
          mission("Bandit Sweep", "Break a camp that has been extorting locals.", "atk"),
          mission("Smuggler Sting", "Catch a black-market ring before dawn.", "spd")
        ],
        Hard: [
          mission("Night Siege", "Hold the town gate through a brutal moonless assault.", "def"),
          mission("Beast Hunt", "Bring down a monster that already ruined two patrols.", "atk")
        ]
      },
      capital: {
        Easy: [
          mission("Ward Security", "Guard civic workers while they restore order.", "def"),
          mission("Pilgrim Escort", "Lead travelers safely across tense district lines.", "spd")
        ],
        Medium: [
          mission("Guild Contract", "Settle a violent dispute between rival factions.", "atk"),
          mission("Treasury Recovery", "Recover stolen taxes before they disappear underground.", "spd")
        ],
        Hard: [
          mission("Citadel Defense", "Hold a breached district until reinforcements arrive.", "def"),
          mission("Shadow Coup", "Expose and break a conspiracy inside the ruling court.", "spd")
        ]
      },
      stronghold: {
        Easy: [
          mission("Outer Watch", "Rotate with sentries and answer a probing attack.", "def"),
          mission("Supply Run", "Deliver supplies through contested territory.", "spd")
        ],
        Medium: [
          mission("Wall Breach", "Patch a broken flank while enemies pour in.", "def"),
          mission("Knightly Trial", "Complete a dangerous proving contract for the keep.", "atk")
        ],
        Hard: [
          mission("Fortress Breaker", "Destroy an enemy engine before sunrise.", "atk"),
          mission("Champion Duel", "Face an infamous commander and rout their escort.", "def")
        ]
      },
      rift: {
        Easy: [
          mission("Rift Scouting", "Survey lesser fiends around the corrupted edges.", "spd"),
          mission("Seal Sparks", "Disrupt a minor ritual before it opens wider.", "def")
        ],
        Medium: [
          mission("Void Cleanse", "Push into cursed ground and secure a ritual circle.", "atk"),
          mission("Relic Retrieval", "Recover a wardstone before cultists claim it.", "spd")
        ],
        Hard: [
          mission("Hellgate Pressure", "Survive a full surge and stabilize the breach.", "def"),
          mission("Demon Vanguard", "Defeat the fiend leading the current incursion.", "atk")
        ]
      }
    }
  };
}());
