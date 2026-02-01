import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Layout, Save } from 'lucide-react';
import { useNavigation, ViewType } from '../context/NavigationContext';
import { WidgetPalette } from './builder/WidgetPalette';
import { DraggableGrid } from './builder/DraggableGrid';
import { WidgetInstance, WIDGET_REGISTRY } from './builder/types';

const DEFAULT_WIDGETS: WidgetInstance[] = [
  { id: '1', type: 'stat-card', title: 'Brand Status' },
  { id: '2', type: 'list-feed', title: 'Internal Campaigns' },
  { id: '3', type: 'text-block', title: 'AI Agents' },
];

export default function HomeDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
    const saved = localStorage.getItem('dashboard-layout');
    return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
  });

  const { navigateTo } = useNavigation();

  const handleAddWidget = (type: string) => {
    const def = WIDGET_REGISTRY.find(w => w.type === type);
    if (!def) return;
    
    const newWidget: WidgetInstance = {
      id: Date.now().toString(),
      type: def.type,
      title: def.label,
    };
    
    setWidgets([...widgets, newWidget]);
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  const saveLayout = () => {
    localStorage.setItem('dashboard-layout', JSON.stringify(widgets));
    setIsEditMode(false);
  };
  
  const searchableItems: { id: string; title: string; type: ViewType; desc: string }[] = [
    { id: 'orchestrator', title: 'Orchestrator', type: 'orchestrator', desc: 'Manage AI agents and microservices slots' },
    { id: 'agent-lab', title: 'Agent Lab', type: 'dashboard', desc: 'Create and deploy n8n workflows' },
    { id: 'rights', title: 'Rights Management', type: 'dashboard', desc: 'Track musical works and royalties' },
    { id: 'marketing', title: 'Marketing Tools', type: 'dashboard', desc: 'Launch campaigns and view analytics' },
    { id: 'resources', title: 'Resource Hub', type: 'dashboard', desc: 'Funding guides and curriculum' },
    { id: 'architecture', title: 'System Architecture', type: 'dashboard', desc: 'View microservices map' },
    { id: 'settings', title: 'Settings', type: 'settings', desc: 'Application configuration' },
  ];

  const filteredItems = searchQuery 
    ? searchableItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="flex-1 flex relative h-full overflow-hidden">
      {isEditMode && <WidgetPalette />}
      
      <div className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* Header / Search */}
        <div className="relative z-10 w-full max-w-6xl mx-auto mt-12 px-6 flex items-start gap-4">
          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dim rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative flex items-center bg-surface/10 backdrop-blur-xl border border-text-main/10 rounded-2xl p-4 shadow-2xl">
              <Search className="text-text-muted ml-2 mr-4" size={24} />
              <input 
                type="text" 
                placeholder="Search features (e.g., 'Marketing', 'Rights')..."
                className="bg-transparent border-none outline-none text-xl w-full text-text-main placeholder-text-muted/50 font-light"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Search Results Dropdown */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-background border border-text-main/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => {
                          navigateTo({ id: item.id, title: item.title, type: item.type });
                          setSearchQuery('');
                      }}
                      className="p-4 hover:bg-surface/10 cursor-pointer border-b border-text-main/5 last:border-0 flex items-center justify-between group"
                    >
                      <div>
                          <div className="text-text-main font-medium">{item.title}</div>
                          <div className="text-text-muted text-sm">{item.desc}</div>
                      </div>
                      <ArrowRight size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-text-muted text-center">No results found</div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => isEditMode ? saveLayout() : setIsEditMode(true)}
            className={`p-4 rounded-2xl border transition-all ${
              isEditMode 
                ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(var(--color-primary),0.4)]' 
                : 'bg-surface/10 border-text-main/10 text-text-muted hover:text-text-main hover:bg-surface/20'
            }`}
            title={isEditMode ? "Save Layout" : "Edit Layout"}
          >
            {isEditMode ? <Save size={24} /> : <Layout size={24} />}
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-8 overflow-y-auto z-10">
          <div className="max-w-6xl mx-auto">
             <DraggableGrid 
               widgets={widgets} 
               isEditMode={isEditMode}
               onAddWidget={handleAddWidget}
               onRemoveWidget={handleRemoveWidget}
             />
          </div>
        </div>
      </div>
    </div>
  );
}
