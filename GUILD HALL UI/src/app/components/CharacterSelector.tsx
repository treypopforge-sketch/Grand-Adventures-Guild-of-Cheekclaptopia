import { X, User, Sword, Shield, Zap } from 'lucide-react';
import { Character } from './PartySlot';

interface CharacterSelectorProps {
  availableCharacters: Character[];
  onSelect: (character: Character) => void;
  onClose: () => void;
}

export function CharacterSelector({ availableCharacters, onSelect, onClose }: CharacterSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full bg-gradient-to-b from-zinc-900 to-black border-t-2 border-yellow-600/50 rounded-t-2xl p-6 animate-in slide-in-from-bottom duration-300 max-h-[70vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-yellow-100 text-lg">Select Character</h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Character List */}
        <div className="space-y-3">
          {availableCharacters.map((character) => (
            <button
              key={character.id}
              onClick={() => onSelect(character)}
              className="w-full bg-black/60 border border-zinc-800 rounded-lg p-4 hover:border-yellow-600/50 hover:bg-black/80 transition-all active:scale-95"
            >
              <div className="flex items-center gap-4">
                {/* Character Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded-full flex items-center justify-center border-2 border-yellow-600/50 shadow-lg shadow-yellow-600/20">
                  <User className="w-7 h-7 text-yellow-500" />
                </div>

                {/* Character Info */}
                <div className="flex-1 text-left">
                  <p className="text-yellow-100 font-medium mb-1">{character.name}</p>
                  <div className="flex gap-3 text-xs">
                    <div className="flex items-center gap-1 text-zinc-400">
                      <Sword className="w-3 h-3 text-red-400" />
                      <span>ATK {character.attack}</span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-400">
                      <Shield className="w-3 h-3 text-blue-400" />
                      <span>DEF {character.defense}</span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-400">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span>SPD {character.speed}</span>
                    </div>
                  </div>
                </div>

                {/* Power Level */}
                <div className="text-right">
                  <p className="text-xs text-zinc-500">Power</p>
                  <p className="text-yellow-500 font-bold">{character.attack + character.defense + character.speed}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
