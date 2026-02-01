import React from 'react';
import { Home, Settings, Layers, Zap, Music, Megaphone, BookOpen, Cpu, Bot } from 'lucide-react';
import { NavigationProvider, useNavigation, ViewType } from './context/NavigationContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeToggle } from './components/ThemeToggle';
import MainView from './components/MainView';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationProvider>
          <MainLayout />
        </NavigationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function MainLayout() {
  const { currentView, navigateTo } = useNavigation();

  const isTabActive = (id: string) => currentView.id === id;

  const handleNavClick = (id: string, title: string, type: ViewType) => {
    navigateTo({ id, title, type });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden text-text-main bg-background transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-20 flex flex-col items-center py-8 glass-panel border-r border-text-main/10 z-20">
        <div className="mb-8 p-2 rounded-full bg-primary/20 text-primary cursor-pointer hover:bg-primary/30 transition-colors" title="Tyaga CCM">
          <Zap size={24} fill="currentColor" />
        </div>
        
        <nav className="flex-1 flex flex-col gap-6 w-full px-2">
          <NavIcon 
            icon={<Home size={20} />} 
            active={isTabActive('home')} 
            label="Home"
            onClick={() => handleNavClick('home', 'Home', 'dashboard')} 
          />
          {/* Teams moved to Settings */}
          <NavIcon 
            icon={<Cpu size={20} />} 
            active={isTabActive('orchestrator')} 
            label="Orchestrator"
            onClick={() => handleNavClick('orchestrator', 'Orchestrator', 'orchestrator')} 
          />
          <NavIcon 
            icon={<Bot size={20} />} 
            active={isTabActive('agent-lab')} 
            label="Agent Lab"
            onClick={() => handleNavClick('agent-lab', 'Agent Lab', 'dashboard')} 
          />
          <NavIcon 
            icon={<BookOpen size={20} />} 
            active={isTabActive('resources')} 
            label="Resources"
            onClick={() => handleNavClick('resources', 'Resources', 'dashboard')} 
          />
          <NavIcon 
            icon={<Music size={20} />} 
            active={isTabActive('rights')} 
            label="Rights"
            onClick={() => handleNavClick('rights', 'Rights', 'dashboard')} 
          />
          <NavIcon 
            icon={<Megaphone size={20} />} 
            active={isTabActive('marketing')} 
            label="Marketing"
            onClick={() => handleNavClick('marketing', 'Marketing', 'dashboard')} 
          />
          <NavIcon 
            icon={<Layers size={20} />} 
            active={isTabActive('architecture')} 
            label="Architecture"
            onClick={() => handleNavClick('architecture', 'Architecture', 'dashboard')} 
          />
          <div className="flex-1" />
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
          <NavIcon 
            icon={<Settings size={20} />} 
            active={isTabActive('settings')} 
            label="Settings"
            onClick={() => handleNavClick('settings', 'Settings', 'settings')} 
          />
        </nav>
      </aside>

      {/* Main Content with MainView */}
      <main className="flex-1 relative overflow-hidden">
         <MainView />
      </main>
    </div>
  );
}

function NavIcon({ icon, active, onClick, label }: { icon: React.ReactNode, active: boolean, onClick: () => void, label: string }) {
  return (
    <div className="relative group flex justify-center">
        <button 
        onClick={onClick}
        className={`p-3 rounded-xl transition-all duration-200 ${
            active 
            ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(var(--color-primary),0.2)] scale-105' 
            : 'text-text-muted hover:text-text-main hover:bg-surface/10 hover:scale-105'
        }`}
        >
        {icon}
        </button>
        {/* Tooltip */}
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-surface/90 backdrop-blur-md border border-text-main/10 rounded-md text-xs text-text-main opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {label}
        </div>
    </div>
  )
}

export default App;
