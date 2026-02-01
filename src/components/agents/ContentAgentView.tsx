import React from 'react';
import { PenTool, Image as ImageIcon, Video, FileText, Sparkles } from 'lucide-react';

interface ContentAgentViewProps {
  agentName: string;
}

export default function ContentAgentView({ agentName }: ContentAgentViewProps) {
  return (
    <div className="p-8 text-white h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <PenTool className="text-blue-400" size={24} />
            </div>
            <h1 className="text-3xl font-bold">{agentName} Studio</h1>
          </div>
          <p className="text-white/60">AI-powered content generation and asset management.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generator Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-yellow-400" />
                Generate New Content
              </h2>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: FileText, label: 'Blog Post' },
                  { icon: ImageIcon, label: 'Social Image' },
                  { icon: Video, label: 'Short Video' },
                ].map((type, i) => (
                  <button key={i} className="flex flex-col items-center justify-center p-4 bg-black/20 hover:bg-white/5 border border-white/10 rounded-xl transition-all">
                    <type.icon size={24} className="mb-2 text-white/60" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1 uppercase tracking-wider">Prompt / Topic</label>
                  <textarea 
                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:border-blue-500 outline-none resize-none"
                    placeholder="Describe what you want to create..."
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center gap-2">
                    <Sparkles size={16} />
                    Generate
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Outputs */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Generations</h3>
              <div className="grid grid-cols-2 gap-4">
                 {[1, 2].map((_, i) => (
                   <div key={i} className="bg-black/20 rounded-xl overflow-hidden border border-white/5">
                     <div className="h-32 bg-white/5 flex items-center justify-center text-white/20">
                       Preview Image
                     </div>
                     <div className="p-3">
                       <div className="text-sm font-medium mb-1">Crypto Trends 2026</div>
                       <div className="text-xs text-white/40">Generated 2h ago</div>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Queue */}
          <div className="space-y-6">
             <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
               <h3 className="text-lg font-semibold mb-4">Production Queue</h3>
               <div className="space-y-3">
                 {[
                   { title: 'Weekly Newsletter', status: 'Drafting', color: 'text-yellow-400' },
                   { title: 'Insta Story - Promo', status: 'Rendering', color: 'text-blue-400' },
                   { title: 'LinkedIn Post', status: 'Scheduled', color: 'text-green-400' },
                 ].map((item, i) => (
                   <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5">
                     <div className="text-sm font-medium mb-1">{item.title}</div>
                     <div className={`text-xs ${item.color}`}>{item.status}</div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
