import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Bot, Cpu, Home, Settings, Users } from 'lucide-react';
import SlotOrchestrator from './SlotOrchestrator';
import MarketingAgentView from './agents/MarketingView';
import ContentAgentView from './agents/ContentAgentView';
import AgentLab from './AgentLab';
import HomeDashboard from './HomeDashboard';
import ResourceHub from './ResourceHub';
import RightsDashboard from './RightsDashboard';
import MarketingTools from './MarketingTools';
import MicroservicesArchitecture from './MicroservicesArchitecture';
import SettingsView from './Settings';
import LoginView from './auth/LoginView';
import RegisterView from './auth/RegisterView';
import TeamDashboard from './teams/TeamDashboard';

export default function MainView() {
  const { currentView, goBack, canGoBack } = useNavigation();
  const { isAuthenticated } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (!isAuthenticated) {
    return showRegister 
      ? <RegisterView onToggleLogin={() => setShowRegister(false)} />
      : <LoginView onToggleRegister={() => setShowRegister(true)} />;
  }

  const renderContent = () => {
    // Specific IDs override types
    switch (currentView.id) {
      case 'home': return <HomeDashboard />;
      case 'teams': return <TeamDashboard />;
      case 'resources': return <ResourceHub />;
      case 'rights': return <RightsDashboard />;
      case 'marketing': return <MarketingTools />;
      case 'architecture': return <MicroservicesArchitecture />;
      case 'agent-lab': return <AgentLab />;
      case 'settings': return <SettingsView />;
    }

    // Fallback to types
    switch (currentView.type) {
      case 'orchestrator':
        return <SlotOrchestrator />;
      case 'agent-view':
        const agentType = currentView.data?.agentType || 'General';
        const agentName = currentView.data?.agentName || 'Unknown Agent';
        
        if (agentType === 'Marketing') return <MarketingAgentView agentName={agentName} />;
        if (agentType === 'Content') return <ContentAgentView agentName={agentName} />;
        
        return (
          <div className="flex flex-col items-center justify-center h-full text-text-muted">
            <Bot size={48} className="mb-4 opacity-50" />
            <h2 className="text-xl font-semibold">Generic Agent Interface</h2>
            <p className="mt-2">No specific dashboard found for type: {agentType}</p>
          </div>
        );
      default:
        return <div className="p-8 text-text-main">Unknown View: {currentView.id}</div>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background/50 backdrop-blur-sm transition-all duration-300">
      {/* Header Bar */}
      <div className="flex items-center h-16 px-6 border-b border-text-main/5 bg-surface/5 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4">
            {canGoBack && (
                <button 
                    onClick={goBack}
                    className="p-2 rounded-full hover:bg-surface/10 text-text-muted hover:text-text-main transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
            )}
            <div>
                <h1 className="text-lg font-semibold text-text-main tracking-tight flex items-center gap-2">
                    {getIconForView(currentView.type, currentView.id)}
                    {currentView.title}
                </h1>
            </div>
        </div>
        
        <div className="flex-1" />
        
        {/* Right side header actions can go here (like User Profile, Notifications) */}
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="System Online" />
            <span className="text-xs text-text-muted font-mono uppercase">System Online</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative animate-in fade-in slide-in-from-bottom-2 duration-300">
         {renderContent()}
      </div>
    </div>
  );
}

function getIconForView(type: string, id: string) {
    if (id === 'home') return <Home size={18} className="text-primary" />;
    if (id === 'teams') return <Users size={18} className="text-primary" />;
    if (type === 'orchestrator') return <Cpu size={18} className="text-primary" />;
    if (type === 'agent-view') return <Bot size={18} className="text-primary-glow" />;
    if (id === 'settings') return <Settings size={18} className="text-text-muted" />;
    return null;
}
