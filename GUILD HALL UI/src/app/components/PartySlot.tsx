import { User, Sword, Shield, Zap } from 'lucide-react';

export interface Character {
  id: string;
  name: string;
  attack: number;
  defense: number;
  speed: number;
  icon: string;
}

interface PartySlotProps {
  character?: Character;
  onTap: () => void;
  slotNumber: number;
}

export function PartySlot({ character, onTap, slotNumber }: PartySlotProps) {
  return (
    <button
      onClick={onTap}
      className="w-full bg-black/60 border border-zinc-800 rounded-lg p-4 hover:border-yellow-600/50 transition-all active:scale-95"
    >
      {character ? (
        <div className="flex items-center gap-4">
          {/* Character Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded-full flex items-center justify-center border-2 border-yellow-600/50 shadow-lg shadow-yellow-600/20">
            <User className="w-8 h-8 text-yellow-500" />
          </div>

          {/* Character Info */}
          <div className="flex-1 text-left">
            <p className="text-yellow-100 font-medium mb-1">{character.name}</p>
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1 text-zinc-400">
                <Sword className="w-3 h-3 text-red-400" />
                <span>{character.attack}</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-400">
                <Shield className="w-3 h-3 text-blue-400" />
                <span>{character.defense}</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-400">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>{character.speed}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {/* Empty Slot */}
          <div className="w-16 h-16 bg-zinc-900/50 rounded-full flex items-center justify-center border-2 border-dashed border-zinc-700">
            <User className="w-8 h-8 text-zinc-700" />
          </div>

          {/* Placeholder Text */}
          <div className="flex-1 text-left">
            <p className="text-zinc-600">Slot {slotNumber}</p>
            <p className="text-zinc-700 text-sm">Tap to assign</p>
          </div>
        </div>
      )}
    </button>
  );
}
