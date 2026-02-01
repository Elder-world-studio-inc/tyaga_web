import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Plus, Loader2, ArrowRight } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

export default function TeamDashboard({ showHeader = true }: { showHeader?: boolean }) {
  const { token } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('http://localhost:3000/teams', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (err) {
      console.error('Failed to fetch teams', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newTeamName })
      });
      
      if (!response.ok) throw new Error('Failed to create team');
      
      const team = await response.json();
      setTeams([...teams, team]);
      setNewTeamName('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={`h-full flex flex-col ${showHeader ? 'p-6' : ''}`}>
      {showHeader && (
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
              <Users className="text-primary" /> Team Management
            </h1>
            <p className="text-text-muted mt-1">Manage your teams and collaborations</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create Team Card */}
        <div className="p-6 rounded-xl bg-surface/5 border border-dashed border-text-main/20 hover:border-primary/50 transition-colors group">
          <h3 className="text-lg font-semibold text-text-main mb-4">Create New Team</h3>
          <form onSubmit={createTeam} className="space-y-4">
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Team Name"
              className="w-full px-4 py-2 rounded-lg bg-background/50 border border-white/10 text-text-main placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={isCreating}
              className="w-full py-2 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
            >
              {isCreating ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
              Create Team
            </button>
          </form>
        </div>

        {/* Team List */}
        {isLoading ? (
          <div className="col-span-full flex justify-center p-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          teams.map((team) => (
            <div key={team.id} className="p-6 rounded-xl bg-surface/10 backdrop-blur-md border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="text-text-muted hover:text-primary cursor-pointer" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">{team.name}</h3>
              <p className="text-text-muted text-sm">{team.description || 'No description provided'}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
                <span className="px-2 py-1 rounded-full bg-surface/20">Owner</span>
                {/* Add member count or other meta info here */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
