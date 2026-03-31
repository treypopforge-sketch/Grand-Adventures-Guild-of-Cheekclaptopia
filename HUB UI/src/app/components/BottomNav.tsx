import { Home, Scroll, Users, Beer, Map } from 'lucide-react';

export function BottomNav() {
  const navItems = [
    { icon: Home, label: 'Hub', active: true },
    { icon: Scroll, label: 'Missions', active: false },
    { icon: Users, label: 'Roster', active: false },
    { icon: Beer, label: 'Tavern', active: false },
    { icon: Map, label: 'Map', active: false },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t-2 border-yellow-600/30 shadow-[0_-5px_25px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around py-3 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                item.active
                  ? 'text-yellow-400 bg-yellow-600/10'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon 
                className={`w-6 h-6 ${
                  item.active ? 'drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]' : ''
                }`} 
              />
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
