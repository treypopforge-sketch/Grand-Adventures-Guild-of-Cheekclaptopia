# Grand-Adventures-Guild-of-Cheekclaptopia

🎮 Adventurer’s Guild Manager (MVP)

A browser-based fantasy guild management simulator where you recruit adventurers, build parties, and send them on missions in a living, evolving world.

This project is currently in MVP development, focused on building a strong core loop before expanding into a full narrative RPG system.

🧠 Core Concept

You play as a Guild Master, responsible for:

Recruiting adventurers
Managing parties
Selecting missions
Balancing risk vs reward
Growing your guild over time

The game blends:

Strategy
Simulation
RPG systems
Light roguelite mechanics

Start Game → Recruit → Build Party → Select Location → Choose Mission → Run Mission → Earn Gold → Repeat

Current Features
🧍 Adventurer system (ATK / DEF / SPD)
🍺 Tavern recruitment system
🧩 Party system (1–3 parties scaling with level)
🗺️ World map with selectable locations
📜 Mission generation by difficulty (Easy / Medium / Hard)
🎲 Dice-based mission resolution system
💰 Gold rewards scaling with performance
😴 Fatigue system (adventurers become tired after missions)
📅 Day cycle with “End Day” recovery
⚙️ Tech Stack
HTML5 – structure
CSS3 – styling & UI effects
Vanilla JavaScript – game logic

No frameworks — built lightweight for:

fast iteration
browser playability
easy expansion

/project-root
│── index.html        # Main entry point
│── style.css         # UI styling
│── app.js            # App initialization
│── ui.js             # Rendering system
│── state.js          # Game state & persistence
│── systems.js        # Core gameplay systems
│── data.js           # Game data (classes, missions, locations)

🧩 Core Systems
🧠 Game Systems

Handles:

Power calculation
Mission generation
Dice rolls
Outcome resolution

Example: mission resolution uses party power + dice roll vs difficulty


🧾 Game State

Handles:

Save/load system (localStorage)
Party management
Day progression
Mission flow
Recruitment

Fully reactive state system driving UI updates


🎨 UI System

Handles:

Screen rendering (Hub, Map, Guild Hall, Results)
Dynamic components (cards, panels, overlays)
Navigation + interactions

Fully generated UI from state (no frameworks)


📊 Game Data

Defines:

Classes (Warrior, Mage, etc.)
Locations
Mission templates
Difficulty scaling

Easily expandable content system


🚀 Development Roadmap

This project follows a structured build plan from the GDD:

✅ Phase 1 — Core System (Current)
Basic loop functional
Party + mission system working
UI MVP complete
🔜 Phase 2 — Quest Mode (NEXT BIG STEP)
Interactive events (choices + dice rolls)
Dialogue-driven UI
Multi-step missions
🔜 Phase 3 — Time System
Multi-day quests
Calendar system
Persistent quest progress
🔜 Phase 4 — Multi-Party Strategy
Parallel missions
Party switching
Scheduling decisions
🔜 Phase 5+ — Expansion
Guild facilities (Inn, Blacksmith, Training)
Gear system
Narrative content
Event system
🎯 Design Philosophy
Simple → Deep
Playable at every stage
Systems before content
Decision-driven gameplay

From the GDD:

“Time is a strategic resource. Every decision matters.”

🧪 How to Run
Download or clone the repo
Open index.html in your browser
Start a new game

No installation required.

💡 Future Vision

The final game will evolve into:

A narrative-driven RPG management sim
With:
Multi-day quests
Event-driven storytelling
Character progression
Risk-heavy decisions (injury, death, etc.)
Stylized UI (JRPG-inspired)
🤝 Contributing / Feedback

This is an actively evolving project. Feedback, ideas, and system suggestions are welcome.

🏷️ Project Status

🚧 In Development (MVP → Full Game Transition)
