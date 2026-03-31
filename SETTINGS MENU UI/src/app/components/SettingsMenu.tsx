import { useState } from 'react';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Volume2, VolumeX } from 'lucide-react';

interface SettingsMenuProps {
  onBack?: () => void;
}

export function SettingsMenu({ onBack }: SettingsMenuProps) {
  // Audio settings
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState([70]);
  const [sfxVolume, setSfxVolume] = useState([80]);

  // Gameplay settings
  const [showCombatLog, setShowCombatLog] = useState(true);
  const [fastMode, setFastMode] = useState(false);

  // Visual settings
  const [screenShake, setScreenShake] = useState(true);
  const [glowEffects, setGlowEffects] = useState(true);

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
      // Reset logic would go here
      console.log('Progress reset');
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image with Blur and Vignette */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1734967640286-f8835c3209fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZmFudGFzeSUyMGNhc3RsZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc0OTIyMzExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
          filter: 'blur(8px)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/40 to-black/80" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wider mb-3">
            SETTINGS
          </h1>
          <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-yellow-500 to-transparent shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
        </div>

        {/* Settings Panel */}
        <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg p-6 mb-6 shadow-2xl">
          
          {/* Audio Section */}
          <div className="mb-8">
            <h2 className="text-yellow-500 text-sm font-semibold tracking-wide mb-4">AUDIO</h2>
            
            {/* Music Toggle */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                {musicEnabled ? <Volume2 className="w-4 h-4 text-zinc-400" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
                <span className="text-zinc-200">Music</span>
              </div>
              <Switch 
                checked={musicEnabled} 
                onCheckedChange={setMusicEnabled}
                className="data-[state=checked]:bg-yellow-500"
              />
            </div>

            {/* Music Volume Slider */}
            {musicEnabled && (
              <div className="mb-4 pb-4 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-zinc-400 text-sm">Music Volume</span>
                  <span className="text-yellow-500 text-sm font-mono">{musicVolume[0]}%</span>
                </div>
                <Slider 
                  value={musicVolume} 
                  onValueChange={setMusicVolume}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:bg-yellow-500 [&_[role=slider]]:border-yellow-600 [&_[role=slider]]:shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                />
              </div>
            )}

            {/* Sound Effects Toggle */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                {sfxEnabled ? <Volume2 className="w-4 h-4 text-zinc-400" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
                <span className="text-zinc-200">Sound Effects</span>
              </div>
              <Switch 
                checked={sfxEnabled} 
                onCheckedChange={setSfxEnabled}
                className="data-[state=checked]:bg-yellow-500"
              />
            </div>

            {/* SFX Volume Slider */}
            {sfxEnabled && (
              <div className="pb-4 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-zinc-400 text-sm">SFX Volume</span>
                  <span className="text-yellow-500 text-sm font-mono">{sfxVolume[0]}%</span>
                </div>
                <Slider 
                  value={sfxVolume} 
                  onValueChange={setSfxVolume}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:bg-yellow-500 [&_[role=slider]]:border-yellow-600 [&_[role=slider]]:shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                />
              </div>
            )}
          </div>

          {/* Gameplay Section */}
          <div className="mb-8">
            <h2 className="text-yellow-500 text-sm font-semibold tracking-wide mb-4">GAMEPLAY</h2>
            
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
              <span className="text-zinc-200">Show Combat Log</span>
              <Switch 
                checked={showCombatLog} 
                onCheckedChange={setShowCombatLog}
                className="data-[state=checked]:bg-yellow-500"
              />
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <span className="text-zinc-200">Fast Mode</span>
              <Switch 
                checked={fastMode} 
                onCheckedChange={setFastMode}
                className="data-[state=checked]:bg-yellow-500"
              />
            </div>
          </div>

          {/* Visual Section */}
          <div>
            <h2 className="text-yellow-500 text-sm font-semibold tracking-wide mb-4">VISUAL</h2>
            
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
              <span className="text-zinc-200">Screen Shake</span>
              <Switch 
                checked={screenShake} 
                onCheckedChange={setScreenShake}
                className="data-[state=checked]:bg-yellow-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-200">Glow Effects</span>
              <Switch 
                checked={glowEffects} 
                onCheckedChange={setGlowEffects}
                className="data-[state=checked]:bg-yellow-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-3">
          {/* Reset Progress Button */}
          <button
            onClick={handleResetProgress}
            className="w-full py-3 px-6 bg-transparent border-2 border-orange-600/50 text-orange-400 rounded-lg hover:border-orange-500 hover:bg-orange-950/30 transition-all duration-300 text-sm font-semibold tracking-wide"
          >
            RESET PROGRESS
          </button>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-full py-4 px-6 bg-gradient-to-b from-yellow-600/20 to-yellow-700/20 border-2 border-yellow-500/50 text-yellow-500 rounded-lg font-bold text-lg tracking-wider hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]"
          >
            BACK
          </button>
        </div>
      </div>
    </div>
  );
}
