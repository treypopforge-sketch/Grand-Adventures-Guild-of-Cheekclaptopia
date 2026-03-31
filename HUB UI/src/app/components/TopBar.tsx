import { Coins, Gem } from 'lucide-react';

export function TopBar() {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-600/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="text-yellow-400 font-semibold">12,450</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50 opacity-50">
        <Gem className="w-5 h-5 text-gray-500" />
        <span className="text-gray-500 font-semibold">0</span>
      </div>
    </div>
  );
}
