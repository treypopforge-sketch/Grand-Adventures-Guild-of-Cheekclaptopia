import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Scroll, Users, Beer, Map, X, Skull, Castle, Building2, Sword } from 'lucide-react';
import worldMapImage from 'figma:asset/0cc82cb4a91a057801b797f81289850026be29ad.png';

interface Location {
  id: string;
  name: string;
  type: 'demonic-rift' | 'capital' | 'town' | 'stronghold';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extremely Hard';
  difficultyColor: string;
  glowColor: string;
  position: { x: string; y: string };
  reward: string;
  description: string;
}

const locations: Location[] = [
  // Demonic Rifts (Black dots - Extremely Hard)
  {
    id: 'dr1',
    name: 'Northern Rift',
    type: 'demonic-rift',
    difficulty: 'Extremely Hard',
    difficultyColor: 'text-purple-300',
    glowColor: 'rgba(0, 0, 0, 0.9)',
    position: { x: '26%', y: '8%' },
    reward: '2000 Gold',
    description: 'A tear in reality where demons pour forth.',
  },
  {
    id: 'dr2',
    name: 'Dragos Rift',
    type: 'demonic-rift',
    difficulty: 'Extremely Hard',
    difficultyColor: 'text-purple-300',
    glowColor: 'rgba(0, 0, 0, 0.9)',
    position: { x: '34%', y: '34%' },
    reward: '2000 Gold',
    description: 'A demonic portal in the heart of Dragos.',
  },
  {
    id: 'dr3',
    name: 'Eastern Rift',
    type: 'demonic-rift',
    difficulty: 'Extremely Hard',
    difficultyColor: 'text-purple-300',
    glowColor: 'rgba(0, 0, 0, 0.9)',
    position: { x: '88%', y: '36%' },
    reward: '2000 Gold',
    description: 'A massive rift threatening the eastern lands.',
  },
  
  // Capital Cities (Yellow/Orange/Red dots)
  {
    id: 'cap1',
    name: 'Harfang',
    type: 'capital',
    difficulty: 'Medium',
    difficultyColor: 'text-amber-400',
    glowColor: 'rgba(250, 204, 21, 0.7)',
    position: { x: '12%', y: '24%' },
    reward: '500 Gold',
    description: 'The golden capital of Solharon.',
  },
  {
    id: 'cap2',
    name: 'Omem Empire',
    type: 'capital',
    difficulty: 'Hard',
    difficultyColor: 'text-red-400',
    glowColor: 'rgba(239, 68, 68, 0.7)',
    position: { x: '39%', y: '20%' },
    reward: '700 Gold',
    description: 'The mighty imperial capital.',
  },
  {
    id: 'cap3',
    name: 'Free Cities',
    type: 'capital',
    difficulty: 'Medium',
    difficultyColor: 'text-amber-400',
    glowColor: 'rgba(250, 204, 21, 0.7)',
    position: { x: '57%', y: '28%' },
    reward: '500 Gold',
    description: 'Independent city-states alliance.',
  },
  {
    id: 'cap4',
    name: 'Obsidian Islands',
    type: 'capital',
    difficulty: 'Hard',
    difficultyColor: 'text-red-400',
    glowColor: 'rgba(239, 68, 68, 0.7)',
    position: { x: '85%', y: '22%' },
    reward: '700 Gold',
    description: 'The volcanic island capital.',
  },
  {
    id: 'cap5',
    name: 'Al-Qatel',
    type: 'capital',
    difficulty: 'Medium',
    difficultyColor: 'text-amber-400',
    glowColor: 'rgba(250, 204, 21, 0.7)',
    position: { x: '32%', y: '60%' },
    reward: '500 Gold',
    description: 'Desert capital of the Southerlands.',
  },
  {
    id: 'cap6',
    name: 'Valdion',
    type: 'capital',
    difficulty: 'Medium',
    difficultyColor: 'text-amber-400',
    glowColor: 'rgba(250, 204, 21, 0.7)',
    position: { x: '48%', y: '53%' },
    reward: '500 Gold',
    description: 'Central capital of commerce.',
  },
  {
    id: 'cap7',
    name: 'Worgen Fall',
    type: 'capital',
    difficulty: 'Medium',
    difficultyColor: 'text-amber-400',
    glowColor: 'rgba(250, 204, 21, 0.7)',
    position: { x: '58%', y: '68%' },
    reward: '500 Gold',
    description: 'Ancient capital with rich history.',
  },
  {
    id: 'cap8',
    name: 'Ying-Ti',
    type: 'capital',
    difficulty: 'Medium',
    difficultyColor: 'text-amber-400',
    glowColor: 'rgba(250, 204, 21, 0.7)',
    position: { x: '82%', y: '72%' },
    reward: '500 Gold',
    description: 'Eastern capital of wisdom.',
  },
  {
    id: 'cap9',
    name: 'Avallah',
    type: 'capital',
    difficulty: 'Medium',
    difficultyColor: 'text-amber-400',
    glowColor: 'rgba(250, 204, 21, 0.7)',
    position: { x: '84%', y: '50%' },
    reward: '500 Gold',
    description: 'Highland capital fortress.',
  },
  {
    id: 'cap10',
    name: 'Angelas',
    type: 'capital',
    difficulty: 'Medium',
    difficultyColor: 'text-orange-400',
    glowColor: 'rgba(251, 146, 60, 0.7)',
    position: { x: '71%', y: '56%' },
    reward: '550 Gold',
    description: 'Capital of trade and diplomacy.',
  },
  {
    id: 'cap11',
    name: 'Tokitland',
    type: 'capital',
    difficulty: 'Medium',
    difficultyColor: 'text-orange-400',
    glowColor: 'rgba(251, 146, 60, 0.7)',
    position: { x: '76%', y: '41%' },
    reward: '550 Gold',
    description: 'Island capital nation.',
  },
  {
    id: 'cap12',
    name: 'Sunderlands',
    type: 'capital',
    difficulty: 'Medium',
    difficultyColor: 'text-orange-400',
    glowColor: 'rgba(251, 146, 60, 0.7)',
    position: { x: '14%', y: '56%' },
    reward: '550 Gold',
    description: 'Western coastal capital.',
  },

  // Bunny Knight Strongholds (Purple dots)
  {
    id: 'bk1',
    name: 'Solharon Stronghold',
    type: 'stronghold',
    difficulty: 'Hard',
    difficultyColor: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.7)',
    position: { x: '16%', y: '40%' },
    reward: '800 Gold',
    description: 'Elite Bunny Knight fortress in Solharon.',
  },
  {
    id: 'bk2',
    name: 'Thaloryn Stronghold',
    type: 'stronghold',
    difficulty: 'Hard',
    difficultyColor: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.7)',
    position: { x: '65%', y: '18%' },
    reward: '800 Gold',
    description: 'Northern Bunny Knight bastion.',
  },
  {
    id: 'bk3',
    name: 'Al-Qatel Stronghold',
    type: 'stronghold',
    difficulty: 'Hard',
    difficultyColor: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.7)',
    position: { x: '48%', y: '68%' },
    reward: '800 Gold',
    description: 'Desert Bunny Knight outpost.',
  },
  {
    id: 'bk4',
    name: 'Avallah Stronghold',
    type: 'stronghold',
    difficulty: 'Hard',
    difficultyColor: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.7)',
    position: { x: '88%', y: '54%' },
    reward: '800 Gold',
    description: 'Eastern highland Bunny Knight fortress.',
  },

  // Towns (Blue dots - sampling key locations)
  {
    id: 't1',
    name: 'Northwatch',
    type: 'town',
    difficulty: 'Easy',
    difficultyColor: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    position: { x: '10%', y: '16%' },
    reward: '150 Gold',
    description: 'A quiet northern settlement.',
  },
  {
    id: 't2',
    name: 'Dragos Outpost',
    type: 'town',
    difficulty: 'Medium',
    difficultyColor: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    position: { x: '43%', y: '36%' },
    reward: '200 Gold',
    description: 'Trading post near dangerous lands.',
  },
  {
    id: 't3',
    name: 'Coastal Haven',
    type: 'town',
    difficulty: 'Easy',
    difficultyColor: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    position: { x: '18%', y: '29%' },
    reward: '150 Gold',
    description: 'Peaceful fishing village.',
  },
  {
    id: 't4',
    name: 'Free Crossing',
    type: 'town',
    difficulty: 'Easy',
    difficultyColor: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    position: { x: '50%', y: '33%' },
    reward: '150 Gold',
    description: 'Crossroads settlement.',
  },
  {
    id: 't5',
    name: 'Eastern Port',
    type: 'town',
    difficulty: 'Easy',
    difficultyColor: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    position: { x: '92%', y: '25%' },
    reward: '150 Gold',
    description: 'Busy port town.',
  },
  {
    id: 't6',
    name: 'Sunder Point',
    type: 'town',
    difficulty: 'Easy',
    difficultyColor: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    position: { x: '22%', y: '64%' },
    reward: '150 Gold',
    description: 'Western frontier town.',
  },
  {
    id: 't7',
    name: 'Valdion Fields',
    type: 'town',
    difficulty: 'Easy',
    difficultyColor: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    position: { x: '55%', y: '48%' },
    reward: '150 Gold',
    description: 'Agricultural settlement.',
  },
  {
    id: 't8',
    name: 'Velkrym Bay',
    type: 'town',
    difficulty: 'Easy',
    difficultyColor: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    position: { x: '72%', y: '63%' },
    reward: '150 Gold',
    description: 'Southern coastal town.',
  },
  {
    id: 't9',
    name: 'Eastern Hills',
    type: 'town',
    difficulty: 'Easy',
    difficultyColor: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    position: { x: '90%', y: '65%' },
    reward: '150 Gold',
    description: 'Mountain village.',
  },
  {
    id: 't10',
    name: 'Island Refuge',
    type: 'town',
    difficulty: 'Easy',
    difficultyColor: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    position: { x: '82%', y: '33%' },
    reward: '150 Gold',
    description: 'Remote island settlement.',
  },
];

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [activeNav, setActiveNav] = useState('map');

  return (
    <div className="h-screen w-screen bg-slate-950 overflow-hidden flex flex-col">
      {/* Background Map with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={worldMapImage}
          alt="Fantasy World Map"
          className="w-full h-full object-cover blur-[1px]"
        />
        <div className="absolute inset-0 bg-slate-950/60" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full pb-20">
        {/* Top Section */}
        <div className="px-6 pt-8 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-amber-100 tracking-wide mb-1">
              World Map
            </h1>
            <p className="text-amber-200/70 text-sm mb-3">Select a location</p>
            <div className="h-px bg-gradient-to-r from-amber-500/80 via-amber-400 to-transparent" />
          </motion.div>
        </div>

        {/* Interactive Map Area */}
        <div className="flex-1 relative px-4">
          {locations.map((location, index) => {
            // Determine icon based on location type
            const getLocationIcon = () => {
              switch (location.type) {
                case 'demonic-rift':
                  return <Skull className="w-5 h-5 text-red-100" />;
                case 'capital':
                  return <Castle className="w-5 h-5 text-amber-300" />;
                case 'stronghold':
                  return <Sword className="w-5 h-5 text-purple-300" />;
                case 'town':
                  return <Building2 className="w-5 h-5 text-blue-300" />;
                default:
                  return <Map className="w-5 h-5 text-amber-300" />;
              }
            };

            // Determine border color based on type
            const getBorderColor = () => {
              if (selectedLocation?.id === location.id) {
                return 'border-amber-300 bg-amber-500/40';
              }
              
              switch (location.type) {
                case 'demonic-rift':
                  return 'border-red-500/80 bg-slate-900/80';
                case 'capital':
                  return 'border-amber-400/70 bg-slate-900/70';
                case 'stronghold':
                  return 'border-purple-400/70 bg-slate-900/70';
                case 'town':
                  return 'border-blue-400/60 bg-slate-900/60';
                default:
                  return 'border-amber-400/60 bg-slate-900/60';
              }
            };

            return (
              <motion.button
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: location.position.x,
                  top: location.position.y,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 + 0.3, duration: 0.4 }}
                onClick={() => setSelectedLocation(location)}
              >
                {/* Pulsing Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    boxShadow: `0 0 20px 8px ${location.glowColor}`,
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 0.3, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                
                {/* Location Node */}
                <motion.div
                  className={`relative w-11 h-11 rounded-full border-2 flex items-center justify-center ${getBorderColor()}`}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {getLocationIcon()}
                </motion.div>

                {/* Type-based Difficulty Indicator - smaller for less clutter */}
                <div
                  className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-slate-900 ${
                    location.type === 'demonic-rift'
                      ? 'bg-red-600'
                      : location.type === 'capital'
                      ? 'bg-amber-400'
                      : location.type === 'stronghold'
                      ? 'bg-purple-500'
                      : 'bg-blue-400'
                  }`}
                />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom Info Panel (Slide-up) */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            className="absolute bottom-20 left-0 right-0 z-20 px-4"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="bg-slate-900/95 backdrop-blur-md border-2 border-amber-500/50 rounded-2xl p-5 shadow-2xl relative">
              {/* Gold Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedLocation(null)}
                className="absolute top-4 right-4 text-amber-300/60 hover:text-amber-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Location Info */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-amber-100 mb-1">
                    {selectedLocation.name}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-amber-200/70">Difficulty:</span>
                    <span className={`text-sm font-semibold ${selectedLocation.difficultyColor}`}>
                      {selectedLocation.difficulty}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-amber-500/30" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-amber-200/70">Reward:</span>
                    <span className="text-amber-300 font-semibold">
                      {selectedLocation.reward}
                    </span>
                  </div>
                  <p className="text-sm text-amber-100/80 leading-relaxed">
                    {selectedLocation.description}
                  </p>
                </div>

                {/* Primary Button */}
                <motion.button
                  className="w-full py-4 mt-2 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bold rounded-xl relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-400/0 to-amber-300/30" />
                  <span className="relative text-lg">View Missions</span>
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t-2 border-amber-500/40">
        <div className="flex items-center justify-around py-3 px-4">
          {[
            { id: 'hub', icon: Home, label: 'Hub' },
            { id: 'guild', icon: Scroll, label: 'Guild Hall' },
            { id: 'roster', icon: Users, label: 'Roster' },
            { id: 'tavern', icon: Beer, label: 'Tavern' },
            { id: 'map', icon: Map, label: 'Map' },
          ].map((nav) => {
            const Icon = nav.icon;
            const isActive = activeNav === nav.id;
            
            return (
              <button
                key={nav.id}
                onClick={() => setActiveNav(nav.id)}
                className="flex flex-col items-center gap-1 min-w-[60px]"
              >
                <div className="relative">
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      isActive ? 'text-amber-400' : 'text-amber-300/50'
                    }`}
                  />
                  {isActive && (
                    <motion.div
                      className="absolute -inset-2 rounded-full"
                      style={{
                        boxShadow: '0 0 15px 3px rgba(251, 191, 36, 0.4)',
                      }}
                      layoutId="activeNav"
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    />
                  )}
                </div>
                <span
                  className={`text-xs transition-colors ${
                    isActive ? 'text-amber-300 font-semibold' : 'text-amber-300/50'
                  }`}
                >
                  {nav.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}