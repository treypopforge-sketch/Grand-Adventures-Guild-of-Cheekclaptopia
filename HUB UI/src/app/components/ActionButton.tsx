import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick?: () => void;
}

export function ActionButton({ icon: Icon, title, subtitle, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-black/60 backdrop-blur-sm border-2 border-yellow-600/50 rounded-xl p-5 
                 shadow-[0_0_20px_rgba(234,179,8,0.15)] 
                 hover:border-yellow-500/70 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]
                 active:scale-[0.98] transition-all duration-200
                 flex items-center gap-4"
    >
      <div className="p-3 bg-yellow-600/20 rounded-lg border border-yellow-600/50">
        <Icon className="w-7 h-7 text-yellow-500" />
      </div>
      <div className="flex-1 text-left">
        <h3 className="text-lg font-bold text-yellow-400 mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
    </button>
  );
}
