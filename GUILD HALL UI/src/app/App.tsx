import { useState } from 'react';
import { PartySlot, Character } from './components/PartySlot';
import { CharacterSelector } from './components/CharacterSelector';
import { 
  Coins, 
  AlertTriangle, 
  Swords, 
  ArrowLeft, 
  Play,
  Circle
} from 'lucide-react';

// Mock data
const AVAILABLE_CHARACTERS: Character[] = [
  { id: '1', name: 'Aria the Knight', attack: 8, defense: 6, speed: 4, icon: 'knight' },
  { id: '2', name: 'Finn the Rogue', attack: 6, defense: 3, speed: 9, icon: 'rogue' },
  { id: '3', name: 'Luna the Mage', attack: 10, defense: 2, speed: 6, icon: 'mage' },
  { id: '4', name: 'Bjorn the Warrior', attack: 9, defense: 7, speed: 3, icon: 'warrior' },
  { id: '5', name: 'Sylvia the Healer', attack: 3, defense: 8, speed: 7, icon: 'healer' },
];

const CURRENT_MISSION = {
  name: 'Goblin Raid',
  difficulty: 15,
  reward: 100,
  description: 'Clear the goblin camp near the eastern forest',
};

export default function App() {
  const [party, setParty] = useState<(Character | null)[]>([null, null, null]);
  const [showSelector, setShowSelector] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const handleSlotTap = (slotIndex: number) => {
    setSelectedSlot(slotIndex);
    setShowSelector(true);
  };

  const handleCharacterSelect = (character: Character) => {
    if (selectedSlot !== null) {
      const newParty = [...party];
      // Remove character from other slots if already assigned
      const existingIndex = newParty.findIndex(c => c?.id === character.id);
      if (existingIndex !== -1) {
        newParty[existingIndex] = null;
      }
      newParty[selectedSlot] = character;
      setParty(newParty);
    }
    setShowSelector(false);
    setSelectedSlot(null);
  };

  const handleCloseSelector = () => {
    setShowSelector(false);
    setSelectedSlot(null);
  };

  // Calculate party power
  const partyPower = party.reduce((total, char) => {
    if (char) {
      return total + char.attack + char.defense + char.speed;
    }
    return total;
  }, 0);

  const hasParty = party.some(char => char !== null);
  const powerDifference = partyPower - CURRENT_MISSION.difficulty;
  const isAdvantage = powerDifference >= 0;

  // Get available characters (exclude those already in party)
  const availableCharacters = AVAILABLE_CHARACTERS.filter(
    char => !party.some(p => p?.id === char.id)
  );

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1667018357712-b62b5c59930e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZmFudGFzeSUyMGNhc3RsZSUyMGludGVyaW9yJTIwaGFsbHxlbnwxfHx8fDE3NzQ5MjI2NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
        }}
      />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col p-6 max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl text-yellow-100 mb-2 tracking-wide">GUILD HALL</h1>
          <p className="text-zinc-500 text-sm">Prepare your party for battle</p>
        </div>

        {/* TOP SECTION - Mission Info Panel */}
        <div className="bg-gradient-to-b from-zinc-900/90 to-black/90 border-2 border-yellow-600/30 rounded-lg p-5 mb-6 shadow-xl shadow-yellow-600/10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl text-yellow-100 mb-2 font-medium">{CURRENT_MISSION.name}</h2>
              
              {/* Difficulty */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-zinc-400 text-sm">Difficulty:</span>
                  <span className="text-yellow-100 font-bold">{CURRENT_MISSION.difficulty}</span>
                </div>
                
                {/* Difficulty Dots */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Circle
                      key={i}
                      className={`w-2 h-2 ${
                        i < Math.ceil(CURRENT_MISSION.difficulty / 5)
                          ? 'fill-orange-500 text-orange-500'
                          : 'fill-zinc-700 text-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Reward */}
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="text-zinc-400 text-sm">Reward:</span>
                <span className="text-yellow-500 font-bold">{CURRENT_MISSION.reward} Gold</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
        </div>

        {/* MIDDLE SECTION - Party Slots */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Swords className="w-5 h-5 text-yellow-500" />
            <h3 className="text-yellow-100">Party Formation</h3>
          </div>
          
          <div className="space-y-3 mb-5">
            {party.map((character, index) => (
              <PartySlot
                key={index}
                character={character || undefined}
                onTap={() => handleSlotTap(index)}
                slotNumber={index + 1}
              />
            ))}
          </div>

          {/* Total Party Power */}
          <div className="bg-gradient-to-r from-yellow-600/10 via-yellow-600/20 to-yellow-600/10 border border-yellow-600/40 rounded-lg p-4 shadow-lg shadow-yellow-600/20">
            <div className="text-center">
              <p className="text-zinc-400 text-sm mb-1">Total Party Power</p>
              <p className="text-4xl font-bold text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                {partyPower}
              </p>
            </div>
          </div>
        </div>

        {/* Mission Comparison */}
        {hasParty && (
          <div className="mb-6">
            <div className={`border-2 rounded-lg p-4 ${
              isAdvantage 
                ? 'bg-green-950/30 border-green-600/50' 
                : 'bg-red-950/30 border-red-600/50'
            }`}>
              <div className="flex items-center justify-center gap-3">
                <div className="text-center">
                  <p className="text-xs text-zinc-400 mb-1">Your Power</p>
                  <p className={`text-2xl font-bold ${isAdvantage ? 'text-green-400' : 'text-red-400'}`}>
                    {partyPower}
                  </p>
                </div>
                
                <span className="text-2xl text-zinc-500">vs</span>
                
                <div className="text-center">
                  <p className="text-xs text-zinc-400 mb-1">Difficulty</p>
                  <p className="text-2xl font-bold text-zinc-300">{CURRENT_MISSION.difficulty}</p>
                </div>
              </div>
              
              <p className={`text-center mt-3 text-sm ${
                isAdvantage ? 'text-green-400' : 'text-red-400'
              }`}>
                {isAdvantage 
                  ? `+${powerDifference} Advantage` 
                  : `${powerDifference} Disadvantage - High Risk!`
                }
              </p>
            </div>
          </div>
        )}

        {/* Spacer to push buttons to bottom */}
        <div className="flex-1" />

        {/* BOTTOM SECTION - Action Buttons */}
        <div className="space-y-3 mt-auto">
          {/* Primary Action */}
          <button
            disabled={!hasParty}
            className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              hasParty
                ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black shadow-lg shadow-yellow-600/50 hover:shadow-yellow-600/70 hover:scale-[1.02] active:scale-95'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <Play className="w-5 h-5" />
            Start Mission
          </button>

          {/* Secondary Action */}
          <button className="w-full py-3 rounded-lg font-medium text-zinc-400 border border-zinc-700 hover:border-zinc-600 hover:text-zinc-300 transition-all active:scale-95 flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Map
          </button>
        </div>
      </div>

      {/* Character Selector Modal */}
      {showSelector && (
        <CharacterSelector
          availableCharacters={availableCharacters}
          onSelect={handleCharacterSelect}
          onClose={handleCloseSelector}
        />
      )}
    </div>
  );
}
