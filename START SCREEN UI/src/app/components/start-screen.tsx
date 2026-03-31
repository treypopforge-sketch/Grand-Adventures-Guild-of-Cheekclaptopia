import { useState } from 'react';
import { Swords, Play, BookOpen, Settings, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

export function StartScreen() {
  const [isMuted, setIsMuted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const menuOptions = [
    { id: 'new-game', label: 'New Game', icon: Play },
    { id: 'continue', label: 'Continue', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="relative size-full overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80"
          alt="Fantasy background"
          className="size-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
      </div>

      {/* Animated particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-400/20"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: Math.random() * 5 + 's',
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-between size-full p-8 md:p-16">
        {/* Header - Game Title */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Swords className="w-12 h-12 md:w-16 md:h-16 text-amber-500" />
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)] max-w-5xl leading-tight">
                Grand Adventures Guild of Cheekclaptopia
              </h1>
              <Swords className="w-12 h-12 md:w-16 md:h-16 text-amber-500 scale-x-[-1]" />
            </div>
            <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
          </div>
        </div>

        {/* Menu Options */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          {menuOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                onMouseEnter={() => setSelectedOption(option.id)}
                className={`
                  group relative px-8 py-4 text-xl font-semibold
                  border-2 transition-all duration-300
                  ${
                    selectedOption === option.id
                      ? 'border-amber-500 bg-amber-500/20 text-amber-100 scale-105 shadow-[0_0_30px_rgba(251,191,36,0.4)]'
                      : 'border-amber-700/50 bg-black/30 text-amber-200/70 hover:border-amber-600 hover:bg-amber-600/10'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-3">
                  <Icon className="w-6 h-6" />
                  <span className="tracking-wider">{option.label}</span>
                </div>
                
                {/* Animated border glow */}
                {selectedOption === option.id && (
                  <div className="absolute inset-0 border-2 border-amber-400 animate-pulse pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer - Audio Control */}
        <div className="flex items-center justify-between w-full max-w-md pt-8">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-full border border-amber-700/50 bg-black/30 text-amber-400 hover:bg-amber-600/10 hover:border-amber-600 transition-all"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          
          <p className="text-sm text-amber-200/40 tracking-wide">
            Press ENTER to start
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}