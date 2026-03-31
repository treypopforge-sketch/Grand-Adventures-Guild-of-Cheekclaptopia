import { Beer, Scroll, Users, Map } from 'lucide-react';
import { TopBar } from './components/TopBar';
import { GuildCard } from './components/GuildCard';
import { ActionButton } from './components/ActionButton';
import { BottomNav } from './components/BottomNav';

export default function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-950">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1762425476633-917a77df324c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZmFudGFzeSUyMGNhc3RsZSUyMG1lZGlldmFsJTIwbmlnaHR8ZW58MXx8fHwxNzc0OTIwODM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)'
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-gray-950/80 to-black/90" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen pb-24">
        <TopBar />
        
        <div className="flex-1 flex flex-col pt-6">
          <GuildCard />
          
          <div className="px-6 space-y-4">
            <ActionButton
              icon={Beer}
              title="Tavern"
              subtitle="Find new adventurers"
            />
            
            <ActionButton
              icon={Scroll}
              title="Guild Hall"
              subtitle="Send parties on missions"
            />
            
            <ActionButton
              icon={Users}
              title="Roster"
              subtitle="Manage your team"
            />
            
            <ActionButton
              icon={Map}
              title="Map"
              subtitle="Choose locations"
            />
          </div>
        </div>
        
        <BottomNav />
      </div>
    </div>
  );
}
