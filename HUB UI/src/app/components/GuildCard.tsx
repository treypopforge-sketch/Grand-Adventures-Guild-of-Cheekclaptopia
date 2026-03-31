import { Shield } from 'lucide-react';

export function GuildCard() {
  return (
    <div className="mx-6 mb-6 bg-black/70 backdrop-blur-md rounded-2xl border-2 border-yellow-600/60 shadow-[0_0_25px_rgba(234,179,8,0.2)] p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-yellow-600/20 rounded-lg border border-yellow-600/50">
          <Shield className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-yellow-400">Guild Level 5</h2>
          <p className="text-sm text-gray-400">12 Adventurers</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-300 italic">
        Your guild is growing stronger
      </p>
    </div>
  );
}
