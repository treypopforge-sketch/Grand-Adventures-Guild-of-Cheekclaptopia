(function () {
  function adventurer(id, name, heroClass, atk, def, spd) {
    return {
      id: id,
      name: name,
      class: heroClass,
      atk: atk,
      def: def,
      spd: spd
    };
  }

  window.GameData = {
    maxPartySize: 3,
    difficultyConfig: {
      Easy: { dc: 10, rewardGold: 90, badge: "easy" },
      Medium: { dc: 15, rewardGold: 140, badge: "medium" },
      Hard: { dc: 20, rewardGold: 210, badge: "hard" }
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
    recruitPool: [
      adventurer("bjorn-warrior", "Bjorn the Warrior", "Warrior", 4, 3, 1),
      adventurer("elara-mage", "Elara Starflame", "Mage", 5, 1, 3),
      adventurer("tamsin-healer", "Tamsin Dawnveil", "Healer", 2, 4, 2),
      adventurer("nyx-rogue", "Nyx Shadowstep", "Rogue", 4, 1, 5),
      adventurer("gideon-warrior", "Gideon Ironwall", "Warrior", 3, 4, 1),
      adventurer("mira-mage", "Mira Emberglass", "Mage", 4, 2, 4),
      adventurer("ione-healer", "Ione Mercybloom", "Healer", 2, 5, 2),
      adventurer("kael-rogue", "Kael Quickhand", "Rogue", 4, 2, 4),
      adventurer("sera-warrior", "Sera Goldshield", "Warrior", 4, 3, 2),
      adventurer("orin-mage", "Orin Moonspark", "Mage", 5, 1, 2),
      adventurer("vesper-healer", "Vesper Kindroot", "Healer", 3, 4, 3),
      adventurer("cato-rogue", "Cato Nightmark", "Rogue", 5, 1, 4)
    ],
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
          { title: "Roadside Patrol", summary: "Escort a merchant road and repel petty bandits." },
          { title: "Wolf Cull", summary: "Thin a hungry pack stalking the outer farms." }
        ],
        Medium: [
          { title: "Bandit Sweep", summary: "Break a camp that has been extorting locals." },
          { title: "Smuggler Sting", summary: "Catch a black-market ring before dawn." }
        ],
        Hard: [
          { title: "Night Siege", summary: "Hold the town gate through a brutal moonless assault." },
          { title: "Beast Hunt", summary: "Bring down a monster that already ruined two patrols." }
        ]
      },
      capital: {
        Easy: [
          { title: "Ward Security", summary: "Guard civic workers while they restore order." },
          { title: "Pilgrim Escort", summary: "Lead travelers safely across tense district lines." }
        ],
        Medium: [
          { title: "Guild Contract", summary: "Settle a violent dispute between rival factions." },
          { title: "Treasury Recovery", summary: "Recover stolen taxes before they disappear underground." }
        ],
        Hard: [
          { title: "Citadel Defense", summary: "Hold a breached district until reinforcements arrive." },
          { title: "Shadow Coup", summary: "Expose and break a conspiracy inside the ruling court." }
        ]
      },
      stronghold: {
        Easy: [
          { title: "Outer Watch", summary: "Rotate with sentries and answer a probing attack." },
          { title: "Supply Run", summary: "Deliver supplies through contested territory." }
        ],
        Medium: [
          { title: "Wall Breach", summary: "Patch a broken flank while enemies pour in." },
          { title: "Knightly Trial", summary: "Complete a dangerous proving contract for the keep." }
        ],
        Hard: [
          { title: "Fortress Breaker", summary: "Destroy an enemy engine before sunrise." },
          { title: "Champion Duel", summary: "Face an infamous commander and rout their escort." }
        ]
      },
      rift: {
        Easy: [
          { title: "Rift Scouting", summary: "Survey lesser fiends around the corrupted edges." },
          { title: "Seal Sparks", summary: "Disrupt a minor ritual before it opens wider." }
        ],
        Medium: [
          { title: "Void Cleanse", summary: "Push into cursed ground and secure a ritual circle." },
          { title: "Relic Retrieval", summary: "Recover a wardstone before cultists claim it." }
        ],
        Hard: [
          { title: "Hellgate Pressure", summary: "Survive a full surge and stabilize the breach." },
          { title: "Demon Vanguard", summary: "Defeat the fiend leading the current incursion." }
        ]
      }
    }
  };
}());
