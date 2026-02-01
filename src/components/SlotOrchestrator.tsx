import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { Bot, Cpu, Plus, GripVertical, AlertCircle, CheckCircle, Activity, Box } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

interface Slot {
  id: string;
  name: string;
  phase: string;
  assignedAgentId: string | null;
  status: 'Healthy' | 'Active' | 'Running' | 'Idle' | 'Error';
}

interface Agent {
  id: string;
  name: string;
  type: string;
  n8nWorkflowId?: string;
}

interface OrchestratorData {
  slots: Slot[];
  agents: Agent[];
}

export default function SlotOrchestrator() {
  const { navigateTo } = useNavigation();
  const [data, setData] = useState<OrchestratorData>({ slots: [], agents: [] });
  const [loading, setLoading] = useState(true);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentType, setNewAgentType] = useState('General');

  const fetchData = async () => {
    try {
      const result = await apiClient.getOrchestratorData();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAgent = async () => {
    if (!newAgentName) return;
    try {
      await apiClient.createAgent({ name: newAgentName, type: newAgentType });
      setNewAgentName('');
      setIsCreatingAgent(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  const handleDrop = async (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    const agentId = e.dataTransfer.getData('agentId');
    if (!agentId) return;

    try {
      await apiClient.assignAgent({ slotId, agentId });
      fetchData();
    } catch (error) {
      console.error('Failed to assign agent:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent, agentId: string) => {
    e.dataTransfer.setData('agentId', agentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Active': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Running': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'Error': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  const phases = ['Foundation', 'Content', 'AI & Scale'];

  if (loading) return <div className="p-8 text-white">Loading Orchestrator...</div>;

  return (
    <div className="flex h-full text-white">
      {/* Main Grid Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Cpu className="text-purple-500" />
              Slot-Based Orchestrator
            </h1>
            <p className="text-white/60">Drag agents to slots to activate microservices.</p>
          </div>

          <div className="space-y-8">
            {phases.map(phase => (
              <div key={phase} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold mb-4 text-purple-300">{phase} Phase</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {data.slots.filter(s => s.phase === phase).map(slot => {
                    const assignedAgent = data.agents.find(a => a.id === slot.assignedAgentId);
                    return (
                      <div
                        key={slot.id}
                        onDrop={(e) => handleDrop(e, slot.id)}
                        onDragOver={handleDragOver}
                        className={`relative p-4 rounded-xl border transition-all ${
                          assignedAgent 
                            ? 'border-purple-500/50 bg-purple-500/10' 
                            : 'border-white/10 bg-black/20 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-medium text-sm">{slot.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(slot.status)}`}>
                            {slot.status}
                          </span>
                        </div>
                        
                        <div className="min-h-[60px] flex items-center justify-center border-2 border-dashed border-white/10 rounded-lg transition-colors">
                          {assignedAgent ? (
                            <div 
                              className="flex items-center gap-2 bg-purple-600 px-3 py-2 rounded-lg w-full cursor-pointer hover:bg-purple-500 transition-colors"
                              draggable
                              onDragStart={(e) => handleDragStart(e, assignedAgent.id)}
                              onClick={() => navigateTo({
                                id: assignedAgent.id,
                                title: assignedAgent.name,
                                type: 'agent-view',
                                data: { 
                                  agentId: assignedAgent.id, 
                                  agentType: assignedAgent.type, 
                                  agentName: assignedAgent.name 
                                }
                              })}
                            >
                              <Bot size={16} />
                              <div className="flex-1 overflow-hidden">
                                <div className="text-xs font-bold truncate">{assignedAgent.name}</div>
                                <div className="text-[10px] opacity-70 truncate">{assignedAgent.type}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-text-muted/50">Drop Agent Here</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar - Agents */}
      <div className="w-80 bg-surface/5 border-l border-text-main/10 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bot size={20} className="text-primary" />
            Agents
          </h2>
          <button 
            onClick={() => setIsCreatingAgent(true)}
            className="p-2 hover:bg-surface/10 rounded-lg transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {isCreatingAgent && (
          <div className="mb-6 p-4 bg-surface/5 rounded-xl border border-text-main/10 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-sm font-medium mb-3">New Agent</h3>
            <input
              type="text"
              placeholder="Agent Name"
              value={newAgentName}
              onChange={(e) => setNewAgentName(e.target.value)}
              className="w-full bg-surface/10 border border-text-main/20 rounded px-3 py-2 text-sm mb-2 text-text-main outline-none focus:border-primary"
            />
            <select
              value={newAgentType}
              onChange={(e) => setNewAgentType(e.target.value)}
              className="w-full bg-surface/10 border border-text-main/20 rounded px-3 py-2 text-sm mb-3 text-text-main outline-none focus:border-primary"
            >
              <option value="General">General</option>
              <option value="Marketing">Marketing</option>
              <option value="Content">Content</option>
              <option value="Finance">Finance</option>
              <option value="Community">Community</option>
            </select>
            <div className="flex gap-2">
              <button 
                onClick={handleCreateAgent}
                className="flex-1 bg-primary hover:bg-primary-dim text-white text-xs font-bold py-2 rounded transition-colors"
              >
                Create
              </button>
              <button 
                onClick={() => setIsCreatingAgent(false)}
                className="flex-1 bg-surface/10 hover:bg-surface/20 text-text-main text-xs font-bold py-2 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3 overflow-y-auto flex-1">
          {data.agents.filter(a => !data.slots.find(s => s.assignedAgentId === a.id)).map(agent => (
            <div
              key={agent.id}
              draggable
              onDragStart={(e) => handleDragStart(e, agent.id)}
              className="bg-surface/5 p-3 rounded-xl border border-text-main/10 cursor-grab hover:bg-surface/10 active:cursor-grabbing group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg text-primary group-hover:bg-primary/30 transition-colors">
                  <Bot size={18} />
                </div>
                <div>
                  <div className="font-medium text-sm">{agent.name}</div>
                  <div className="text-xs text-text-muted">{agent.type}</div>
                </div>
                <GripVertical className="ml-auto text-text-muted/50" size={16} />
              </div>
            </div>
          ))}
          {data.agents.filter(a => !data.slots.find(s => s.assignedAgentId === a.id)).length === 0 && (
             <div className="text-center text-text-muted text-sm py-8">
                All agents assigned.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
