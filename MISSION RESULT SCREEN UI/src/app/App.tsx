import { MissionResult } from './components/MissionResult';
import { useState } from 'react';

// Example scenarios for different outcomes
const scenarios = [
  {
    id: 1,
    missionName: 'Goblin Raid',
    difficulty: 15,
    rolled: 17,
    luckBonus: 2,
    outcome: 'success' as const,
    goldReward: 120,
    partyMemberCount: 3,
  },
  {
    id: 2,
    missionName: 'Dragon\'s Lair',
    difficulty: 20,
    rolled: 19,
    luckBonus: 5,
    outcome: 'critical-success' as const,
    goldReward: 500,
    partyMemberCount: 4,
  },
  {
    id: 3,
    missionName: 'Bandit Ambush',
    difficulty: 18,
    rolled: 14,
    luckBonus: 2,
    outcome: 'partial-success' as const,
    goldReward: 80,
    partyMemberCount: 2,
  },
  {
    id: 4,
    missionName: 'Ancient Tomb',
    difficulty: 16,
    rolled: 8,
    luckBonus: 1,
    outcome: 'failure' as const,
    goldReward: 0,
    partyMemberCount: 3,
  },
];

export default function App() {
  const [currentScenario, setCurrentScenario] = useState(0);

  const handleContinue = () => {
    setCurrentScenario((prev) => (prev + 1) % scenarios.length);
  };

  return (
    <div className="size-full">
      <div onClick={handleContinue}>
        <MissionResult {...scenarios[currentScenario]} />
      </div>
      
      {/* Scenario indicator */}
      <div className="fixed bottom-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg text-xs z-50 border border-zinc-700">
        <p className="mb-1">Click anywhere to cycle through outcomes:</p>
        <div className="flex gap-2">
          {scenarios.map((scenario, index) => (
            <div
              key={scenario.id}
              className={`w-2 h-2 rounded-full ${
                index === currentScenario ? 'bg-yellow-400' : 'bg-zinc-600'
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-zinc-400">
          Current: <span className="text-yellow-400">{scenarios[currentScenario].outcome}</span>
        </p>
      </div>
    </div>
  );
}
