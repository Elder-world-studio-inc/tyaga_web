import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Plus, CheckCircle, Clock, MoreVertical, Music, X } from 'lucide-react';

interface Work {
  id: string;
  title: string;
  iswc: string;
  writers: string;
  status: 'Pending' | 'Registered';
}

export default function RightsDashboard() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWork, setNewWork] = useState<{ title: string; iswc: string; writers: string; audioFile: File | null; audioFileName: string }>({ title: '', iswc: '', writers: '', audioFile: null, audioFileName: '' });

  const fetchWorks = async () => {
    try {
      const data = await apiClient.getOrchestratorData();
      if (data.works) {
        setWorks(data.works);
      }
    } catch (error) {
      console.error('Failed to fetch works:', error);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleCreateWork = async () => {
    if (!newWork.title) return;
    try {
      await apiClient.createWork(newWork);
      setNewWork({ title: '', iswc: '', writers: '', audioFile: null, audioFileName: '' });
      setIsModalOpen(false);
      fetchWorks();
    } catch (error) {
      console.error('Failed to create work:', error);
    }
  };

  const registeredCount = works.filter(w => w.status === 'Registered').length;
  const pendingCount = works.filter(w => w.status === 'Pending').length;

  return (
    <div className="w-full h-full p-8 overflow-y-auto relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Rights Management</h1>
            <p className="text-white/60">Track ownership, splits, and registration status across PROs.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
          >
            <Plus size={20} />
            Register New Work
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Works" value={works.length.toString()} icon={<Music size={24} />} />
          <StatCard title="Royalties Collected" value="$0.00" icon={<span className="text-2xl">$</span>} />
          <StatCard title="Pending Registrations" value={pendingCount.toString()} icon={<Clock size={24} />} />
        </div>

        {/* Works Table */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
             <h2 className="text-lg font-semibold text-white">Catalog</h2>
             <input type="text" placeholder="Search works..." className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50" />
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-white/5 text-white/50 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-6 font-medium">Title</th>
                <th className="p-6 font-medium">ISWC</th>
                <th className="p-6 font-medium">Writers & Splits</th>
                <th className="p-6 font-medium">Status</th>
                <th className="p-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {works.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-white/40">No works registered yet.</td>
                </tr>
              ) : (
                works.map((work: any) => (
                    <tr key={work.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-6">
                        <div className="font-medium text-white">{work.title}</div>
                        {work.audioUrl && (
                             <audio controls className="h-8 w-48 mt-2 opacity-70 hover:opacity-100 transition-opacity">
                                <source src={work.audioUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                             </audio>
                        )}
                    </td>
                    <td className="p-6 text-white/70 font-mono text-sm">{work.iswc || '-'}</td>
                    <td className="p-6 text-white/70">{work.writers || '-'}</td>
                    <td className="p-6">
                        <StatusBadge status={work.status} />
                    </td>
                    <td className="p-6 text-right">
                        <button className="text-white/40 hover:text-white p-2">
                        <MoreVertical size={18} />
                        </button>
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Register New Work</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-1">Title</label>
                        <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500"
                            value={newWork.title}
                            onChange={(e) => setNewWork({...newWork, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-1">ISWC (Optional)</label>
                        <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500"
                            value={newWork.iswc}
                            onChange={(e) => setNewWork({...newWork, iswc: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-1">Writers & Splits</label>
                        <input 
                            type="text" 
                            placeholder="e.g. John Doe (50%), Jane Smith (50%)"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500"
                            value={newWork.writers}
                            onChange={(e) => setNewWork({...newWork, writers: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-1">Audio File (Optional)</label>
                        <div className="flex gap-2">
                             <input 
                                type="file" 
                                accept="audio/*"
                                className="hidden"
                                id="audio-upload"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setNewWork({...newWork, audioFile: e.target.files[0], audioFileName: e.target.files[0].name})
                                    }
                                }}
                            />
                            <label 
                                htmlFor="audio-upload"
                                className="cursor-pointer flex-1 bg-white/5 border border-white/10 border-dashed rounded-lg px-4 py-2 text-white/60 hover:text-white hover:border-purple-500 transition-colors text-sm truncate"
                            >
                                {newWork.audioFileName ? newWork.audioFileName : 'Select Audio File...'}
                            </label>
                        </div>
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
                        onClick={handleCreateWork}
                        disabled={!newWork.title}
                        className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-xl font-medium transition-colors"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
       <div>
          <div className="text-white/50 text-sm mb-1">{title}</div>
          <div className="text-3xl font-bold text-white">{value}</div>
       </div>
       <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-300">
          {icon}
       </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Registered') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
        <CheckCircle size={12} /> Registered
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
      <Clock size={12} /> Pending
    </span>
  );
}
