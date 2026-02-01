import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Megaphone, Zap, BarChart, ExternalLink, Play, Loader2, Plus, X } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'Draft' | 'Active' | 'Completed';
  platform: string;
  contentStrategy?: string;
}

export default function MarketingTools() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analytics, setAnalytics] = useState<number[]>([]);
  const [isTriggering, setIsTriggering] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: '', platform: '', contentStrategy: '' });

  const fetchCampaigns = async () => {
    try {
      const data = await apiClient.getOrchestratorData();
      if (data.campaigns) {
        setCampaigns(data.campaigns);
      }
      if (data.analytics) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async () => {
    if (!newCampaign.name) return;
    try {
      await apiClient.createCampaign(newCampaign);
      setNewCampaign({ name: '', platform: '', contentStrategy: '' });
      setIsModalOpen(false);
      fetchCampaigns();
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const handleTriggerCampaign = async (id: string) => {
    setIsTriggering(id);
    try {
      await apiClient.triggerCampaign(id);
      fetchCampaigns();
    } catch (error) {
      console.error('Failed to trigger campaign:', error);
      alert('Failed to start campaign.');
    } finally {
      setIsTriggering(null);
    }
  };

  return (
    <div className="w-full h-full p-8 overflow-y-auto relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Marketing & AI Agents</h1>
            <p className="text-white/60">Automate your release campaigns with autonomous agents.</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-white/70">n8n Connected</span>
             </div>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl font-medium transition-all"
             >
                <Plus size={18} />
                New Campaign
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Left Column: Tools */}
           <div className="lg:col-span-2 space-y-6">
              
              {/* Campaign Cards */}
              {campaigns.length === 0 ? (
                 <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center text-white/40">
                    No active campaigns. Create one to get started.
                 </div>
              ) : (
                campaigns.map(campaign => (
                    <div key={campaign.id} className="glass-panel p-6 rounded-2xl border border-purple-500/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-purple-600/20 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-500/20 rounded-xl text-purple-300">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{campaign.name}</h3>
                                    <p className="text-white/50 text-sm">Target: {campaign.platform}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                campaign.status === 'Active' 
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                    : 'bg-white/5 text-white/70 border-white/10'
                            }`}>
                                {campaign.status}
                            </span>
                        </div>

                        {campaign.contentStrategy && (
                            <div className="space-y-4 mb-8">
                                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                    <div className="text-xs text-white/40 uppercase tracking-widest mb-2">Strategy</div>
                                    <p className="text-white/80 text-sm leading-relaxed">
                                        "{campaign.contentStrategy}"
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button 
                                onClick={() => handleTriggerCampaign(campaign.id)}
                                disabled={isTriggering === campaign.id || campaign.status === 'Active'}
                                className={`flex-1 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                                    campaign.status === 'Active'
                                        ? 'bg-green-500 text-black cursor-default'
                                        : 'bg-white text-black hover:bg-white/90'
                                }`}
                            >
                                {isTriggering === campaign.id ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
                                {isTriggering === campaign.id ? 'Starting...' : campaign.status === 'Active' ? 'Running' : 'Trigger Campaign'}
                            </button>
                            <button className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all">
                                Edit Workflow
                            </button>
                        </div>
                    </div>
                ))
              )}

              {/* Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <ToolCard 
                    title="Social Scheduler" 
                    desc="Auto-post across 5 platforms via Buffer." 
                    icon={<Megaphone size={20} />} 
                 />
                 <ToolCard 
                    title="Fan Analytics" 
                    desc="Analyze engagement spikes from Spotify." 
                    icon={<BarChart size={20} />} 
                 />
              </div>

           </div>

           {/* Right Column: Analytics/Status */}
           <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 h-full">
                 <h3 className="text-lg font-semibold text-white mb-6">Audience Reach</h3>
                 
                 {/* Analytics Chart */}
                 <div className="flex items-end justify-between h-48 gap-2 mb-4">
                    {(analytics.length > 0 ? analytics : [0,0,0,0,0,0,0]).map((h, i) => (
                       <div key={i} className="w-full bg-purple-500/20 rounded-t-sm hover:bg-purple-500/40 transition-all relative group">
                          <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-purple-500 rounded-t-sm opacity-60 group-hover:opacity-100 transition-opacity" />
                       </div>
                    ))}
                 </div>
                 <div className="flex justify-between text-xs text-white/30">
                    <span>Mon</span>
                    <span>Sun</span>
                 </div>

                 <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                    <div className="flex justify-between text-sm">
                       <span className="text-white/60">New Followers</span>
                       <span className="text-white font-medium">+1,240</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-white/60">Engagement Rate</span>
                       <span className="text-white font-medium">4.8%</span>
                    </div>
                 </div>

              </div>
           </div>

        </div>

      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">New Campaign</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-1">Campaign Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500"
                            value={newCampaign.name}
                            onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-1">Platform(s)</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Instagram, TikTok"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500"
                            value={newCampaign.platform}
                            onChange={(e) => setNewCampaign({...newCampaign, platform: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-1">Strategy Note</label>
                        <textarea 
                            rows={3}
                            placeholder="Describe the content strategy..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500"
                            value={newCampaign.contentStrategy}
                            onChange={(e) => setNewCampaign({...newCampaign, contentStrategy: e.target.value})}
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleCreateCampaign}
                        disabled={!newCampaign.name}
                        className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-xl font-medium transition-colors"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

function ToolCard({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
   return (
      <div className="glass-panel p-5 rounded-xl border border-white/10 hover:bg-white/5 transition-all cursor-pointer group">
         <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-white/5 text-white/70 group-hover:text-purple-300 group-hover:bg-purple-500/20 transition-colors">
               {icon}
            </div>
            <ExternalLink size={16} className="text-white/20 group-hover:text-white/50" />
         </div>
         <h4 className="font-semibold text-white mb-1">{title}</h4>
         <p className="text-sm text-white/50">{desc}</p>
      </div>
   )
}
