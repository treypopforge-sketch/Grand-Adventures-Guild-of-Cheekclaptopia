import { motion } from 'motion/react';
import { Sparkles, Coins, Users } from 'lucide-react';
import { useState } from 'react';

type OutcomeType = 'critical-success' | 'success' | 'partial-success' | 'failure';

interface MissionResultProps {
  missionName: string;
  difficulty: number;
  rolled: number;
  luckBonus: number;
  outcome: OutcomeType;
  goldReward: number;
  partyMemberCount?: number;
}

const outcomeConfig = {
  'critical-success': {
    label: 'CRITICAL SUCCESS',
    color: 'text-yellow-400',
    glow: 'shadow-[0_0_40px_rgba(250,204,21,0.8)]',
    bgGlow: 'bg-gradient-to-b from-yellow-500/20 to-transparent',
    borderColor: 'border-yellow-400/50',
  },
  success: {
    label: 'SUCCESS',
    color: 'text-green-400',
    glow: 'shadow-[0_0_30px_rgba(74,222,128,0.6)]',
    bgGlow: 'bg-gradient-to-b from-green-500/20 to-transparent',
    borderColor: 'border-green-400/50',
  },
  'partial-success': {
    label: 'PARTIAL SUCCESS',
    color: 'text-orange-400',
    glow: 'shadow-[0_0_30px_rgba(251,146,60,0.6)]',
    bgGlow: 'bg-gradient-to-b from-orange-500/20 to-transparent',
    borderColor: 'border-orange-400/50',
  },
  failure: {
    label: 'FAILURE',
    color: 'text-red-400',
    glow: 'shadow-[0_0_30px_rgba(248,113,113,0.6)]',
    bgGlow: 'bg-gradient-to-b from-red-500/20 to-transparent',
    borderColor: 'border-red-400/50',
  },
};

export function MissionResult({
  missionName,
  difficulty,
  rolled,
  luckBonus,
  outcome,
  goldReward,
  partyMemberCount = 3,
}: MissionResultProps) {
  const config = outcomeConfig[outcome];
  const total = rolled + luckBonus;
  const isCritical = outcome === 'critical-success';

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 20,
              opacity: 0 
            }}
            animate={{
              y: -20,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <motion.div 
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* TOP SECTION */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl tracking-wider text-zinc-300 mb-3">
            {missionName}
          </h1>
          <p className="text-zinc-500 text-sm tracking-wide">
            DIFFICULTY: <span className="text-zinc-400">{difficulty}</span>
          </p>
          
          {/* Divider with glow */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-400/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-400/50" />
          </div>
        </motion.div>

        {/* CENTER FOCUS - DICE RESULT */}
        <motion.div 
          className="mb-8 relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <div className={`${config.bgGlow} absolute inset-0 rounded-3xl blur-2xl`} />
          
          <div className="relative bg-zinc-900/80 border-2 border-zinc-800 rounded-3xl p-8 backdrop-blur-sm">
            {/* Main Dice Roll */}
            <motion.div 
              className="text-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
            >
              <p className="text-zinc-500 text-sm mb-2 tracking-widest">ROLLED</p>
              <div className={`text-8xl font-black ${config.color} ${config.glow} mb-4`}>
                {rolled}
              </div>
            </motion.div>

            {/* Secondary Stats */}
            <motion.div 
              className="text-center mb-6 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center justify-center gap-2 text-zinc-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">LUCK: </span>
                <span className="text-yellow-400">+{luckBonus}</span>
              </div>
            </motion.div>

            {/* Total Calculation */}
            <motion.div 
              className="text-center pt-6 border-t border-zinc-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-zinc-500 text-xs mb-2 tracking-widest">TOTAL SCORE</p>
              <div className="text-3xl">
                <span className={`${config.color} font-black`}>{total}</span>
                <span className="text-zinc-600 mx-3">VS</span>
                <span className="text-zinc-400 font-black">{difficulty}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* OUTCOME BANNER */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
        >
          <div className={`relative ${config.glow}`}>
            <div className={`${config.bgGlow} absolute inset-0 blur-xl`} />
            <div className={`relative bg-zinc-900 border-2 ${config.borderColor} rounded-2xl p-6 text-center overflow-hidden`}>
              {/* Background shine effect */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${outcome === 'critical-success' ? 'from-transparent via-yellow-400/20 to-transparent' : 'from-transparent'}`}
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ delay: 1.3, duration: 0.8 }}
              />
              
              <h2 className={`text-4xl font-black tracking-wider ${config.color} relative z-10`}>
                {config.label}
              </h2>
            </div>
          </div>
        </motion.div>

        {/* REWARD SECTION */}
        <motion.div 
          className="mb-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          {isCritical && (
            <motion.p 
              className="text-yellow-400 text-sm text-center mb-3 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              <Sparkles className="w-4 h-4" />
              BONUS REWARD!
              <Sparkles className="w-4 h-4" />
            </motion.p>
          )}
          
          <div className="flex items-center justify-center gap-3">
            <Coins className="w-8 h-8 text-yellow-400" />
            <span className="text-5xl font-black text-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)]">
              +{goldReward}
            </span>
            <span className="text-2xl text-yellow-500/80 tracking-wide">GOLD</span>
          </div>
        </motion.div>

        {/* Party Members (Optional Detail) */}
        <motion.div 
          className="flex items-center justify-center gap-2 mb-8 text-zinc-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <Users className="w-4 h-4" />
          <span className="text-xs tracking-wide">{partyMemberCount} HEROES</span>
        </motion.div>

        {/* BOTTOM SECTION - Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <button className="w-full bg-gradient-to-b from-yellow-500 to-yellow-600 text-black font-black text-xl py-5 rounded-2xl shadow-[0_0_30px_rgba(250,204,21,0.5)] hover:shadow-[0_0_40px_rgba(250,204,21,0.8)] active:scale-95 transition-all border-2 border-yellow-400 tracking-wider">
            CONTINUE
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
