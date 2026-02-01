import React, { useState } from 'react';
import { Package, Upload, DollarSign, Star, Download, Search, Filter, Plus, User, Users, Palette, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '../context/NavigationContext';
import UserManagement from './admin/UserManagement';

interface MarketWidget {
  id: string;
  name: string;
  description: string;
  price: number; // 0 for free
  author: string;
  rating: number;
  downloads: number;
  tags: string[];
  image?: string;
}

const MOCK_MARKET_WIDGETS: MarketWidget[] = [
  {
    id: 'w1',
    name: 'Advanced Analytics Pro',
    description: 'Deep dive into your system metrics with predictive analysis.',
    price: 49.99,
    author: 'Elder World Studio Inc',
    rating: 4.8,
    downloads: 1240,
    tags: ['Analytics', 'Pro'],
  },
  {
    id: 'w2',
    name: 'Social Media Feed',
    description: 'Aggregate feeds from Twitter, LinkedIn, and Instagram.',
    price: 0,
    author: 'Elder World Studio Inc',
    rating: 4.2,
    downloads: 850,
    tags: ['Social', 'Free'],
  },
  {
    id: 'w3',
    name: 'Crypto Ticker',
    description: 'Real-time cryptocurrency prices and portfolio tracking.',
    price: 9.99,
    author: 'Elder World Studio Inc',
    rating: 4.5,
    downloads: 320,
    tags: ['Finance'],
  },
  {
    id: 'w4',
    name: 'Team Calendar',
    description: 'Shared calendar widget for team coordination.',
    price: 15.00,
    author: 'Elder World Studio Inc',
    rating: 4.9,
    downloads: 2100,
    tags: ['Productivity', 'Team'],
  }
];

export default function SettingsView() {
  const { currentView } = useNavigation();
  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'marketplace' | 'general'>(
    (currentView.data?.tab as 'profile' | 'users' | 'marketplace' | 'general') || 'profile'
  );
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Settings</h1>
          <p className="text-text-muted mt-1">Manage your account, teams, and application preferences.</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-surface/30 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'profile' ? 'bg-primary/20 text-primary shadow-sm' : 'text-text-muted hover:text-text-main'
            }`}
          >
            <User size={16} /> Profile
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'users' ? 'bg-primary/20 text-primary shadow-sm' : 'text-text-muted hover:text-text-main'
            }`}
          >
            <Users size={16} /> User Management
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'marketplace' ? 'bg-primary/20 text-primary shadow-sm' : 'text-text-muted hover:text-text-main'
            }`}
          >
            <Package size={16} /> Marketplace
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'general' ? 'bg-primary/20 text-primary shadow-sm' : 'text-text-muted hover:text-text-main'
            }`}
          >
            General
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activeTab === 'profile' && <UserPersonalization />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'marketplace' && <WidgetMarketplace searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        {activeTab === 'general' && <GeneralSettings />}
      </div>
    </div>
  );
}

function UserPersonalization() {
    const { user } = useAuth();
    const { theme, setTheme, availableThemes } = useTheme();
    const [name, setName] = useState(user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : ''));
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            // In a real app, use a toast notification here
            console.log('Profile updated:', { name });
        }, 800);
    };

    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-text-main">Personal Information</h2>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Email Address</label>
                        <input 
                            type="email" 
                            value={user?.email || ''} 
                            disabled 
                            className="w-full bg-surface/30 border border-white/10 rounded-lg px-4 py-2 text-text-muted cursor-not-allowed"
                        />
                         <p className="text-xs text-text-muted mt-1">Email cannot be changed.</p>
                     </div>
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-surface/30 border border-white/10 rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary/50"
                            placeholder="Your Name"
                        />
                     </div>
                </div>
            </div>

             <div className="glass-panel p-6 rounded-xl border border-white/5">
                <h2 className="text-xl font-semibold mb-6 text-text-main">Appearance</h2>
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-text-muted">Theme Preference</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {availableThemes.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={`relative p-4 rounded-lg border transition-all text-left ${
                                    theme === t.id 
                                    ? 'bg-primary/10 border-primary text-text-main' 
                                    : 'bg-surface/30 border-white/5 text-text-muted hover:bg-surface/50'
                                }`}
                            >
                                <span className="font-medium">{t.name}</span>
                                {theme === t.id && (
                                    <div className="absolute top-3 right-3 text-primary">
                                        <Check size={16} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
             </div>
        </div>
    );
}

function GeneralSettings() {
  return (
    <div className="glass-panel p-6 rounded-xl border border-white/5">
      <h2 className="text-xl font-semibold mb-4 text-text-main">Application Settings</h2>
      <p className="text-text-muted">General application configuration options would go here.</p>
      {/* Placeholder for future general settings */}
    </div>
  );
}

function WidgetMarketplace({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (s: string) => void }) {
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search for widgets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/30 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-text-main focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <button className="px-4 py-2 bg-surface/30 border border-white/10 rounded-lg text-text-main hover:bg-surface/50 flex items-center gap-2">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Featured Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
          <Star className="text-yellow-500" size={18} /> Featured Widgets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {MOCK_MARKET_WIDGETS.slice(0, 3).map(widget => (
             <WidgetCard key={widget.id} widget={widget} featured />
           ))}
        </div>
      </div>

      {/* All Widgets */}
      <div>
        <h3 className="text-lg font-semibold text-text-main mb-4">All Widgets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_MARKET_WIDGETS.map(widget => (
            <WidgetCard key={widget.id} widget={widget} />
          ))}
        </div>
      </div>
    </div>
  );
}

function WidgetCard({ widget, featured }: { widget: MarketWidget, featured?: boolean }) {
  return (
    <div className={`glass-panel p-5 rounded-xl border border-white/5 hover:border-primary/30 transition-all hover:translate-y-[-2px] group ${featured ? 'bg-gradient-to-br from-surface/40 to-primary/5' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Package size={24} />
        </div>
        {widget.price === 0 ? (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">FREE</span>
        ) : (
          <span className="px-2 py-1 bg-surface/50 text-text-main text-xs font-bold rounded-full flex items-center">
             ${widget.price}
          </span>
        )}
      </div>
      
      <h4 className="text-lg font-bold text-text-main mb-1 group-hover:text-primary transition-colors">{widget.name}</h4>
      <p className="text-sm text-text-muted mb-4 line-clamp-2 h-10">{widget.description}</p>
      
      <div className="flex items-center justify-between text-xs text-text-muted mb-4">
        <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500 fill-yellow-500" /> {widget.rating}</span>
        <span className="flex items-center gap-1"><Download size={12} /> {widget.downloads}</span>
        <span className="text-primary/80 font-medium">{widget.author}</span>
      </div>

      <button className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2">
        {widget.price === 0 ? 'Install' : 'Buy Now'}
      </button>
    </div>
  );
}
