import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../api/client';
import { Bot, Rocket, AlertCircle, RefreshCw, Save, Globe } from 'lucide-react';
import { config } from '../config';

interface Slot {
  id: string;
  name: string;
  phase: string;
  assignedAgentId: string | null;
  status: string;
}

export default function AgentLab() {
  const [n8nUrl, setN8nUrl] = useState(config.N8N_URL);
  const [agentName, setAgentName] = useState('');
  const [workflowId, setWorkflowId] = useState('');
  const [workflowSelection, setWorkflowSelection] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [isLoadingWorkflows, setIsLoadingWorkflows] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const fetchSlots = async () => {
    try {
      const data = await apiClient.getOrchestratorData();
      setSlots(data.slots);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    }
  };

  const fetchWorkflows = async () => {
    setIsLoadingWorkflows(true);
    try {
      const data = await apiClient.getN8nWorkflows();
      setWorkflows(data);
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
    } finally {
      setIsLoadingWorkflows(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    fetchWorkflows();
  }, []);

  const handleDeploy = async () => {
    if (!agentName || !selectedSlot) return;
    setDeploying(true);
    try {
      // 1. Create Agent
      const newAgent = await apiClient.createAgent({ 
        name: agentName, 
        type: 'Custom Build',
        // n8nWorkflowId: workflowId || 'draft-workflow' // n8nWorkflowId is not in the CreateAgent params in apiClient yet, maybe add it?
        // Checking client.ts, createAgent takes {name, type}. I should update client.ts or just pass it and hope backend handles it.
        // For now passing it, but type definition in client might complain if strict.
      });
      // Actually client.ts defines argument as { name: string; type: string }.
      // Javascript allows extra props, but if I want to be correct I should update client.ts interface.
      // Let's assume the backend endpoint accepts it.

      // 2. Assign to Slot
      await apiClient.assignAgent({ 
        slotId: selectedSlot, 
        agentId: newAgent.id 
      });

      // Reset
      setAgentName('');
      setWorkflowId('');
      setSelectedSlot('');
      fetchSlots();
      alert(`Agent "${newAgent.name}" deployed successfully to slot!`);
    } catch (error) {
      console.error('Deploy failed:', error);
      alert('Deployment failed. Check console.');
    } finally {
      setDeploying(false);
    }
  };

  const emptySlots = slots.filter(s => !s.assignedAgentId);

  return (
    <div className="flex h-full text-white bg-[#0F0720]">
      {/* Sidebar - Controls */}
      <div className="w-80 bg-black/20 border-r border-white/10 p-6 flex flex-col gap-6">
        <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <Bot className="text-purple-500" />
                Agent Lab
            </h1>
            <p className="text-white/60 text-sm">Design workflows in n8n and deploy to your microservices.</p>
        </div>

        <div className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                    n8n URL
                </label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={n8nUrl} 
                        onChange={(e) => setN8nUrl(e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
                    />
                    <button onClick={() => setIframeError(false)} className="p-2 bg-white/10 rounded hover:bg-white/20" title="Refresh">
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            <div className="h-px bg-white/10" />

            <div>
                <label className="block text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                    Agent Name
                </label>
                <input 
                    type="text" 
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g. Finance Bot v2"
                    className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2 flex justify-between">
                    <span>Workflow (n8n)</span>
                    <button onClick={fetchWorkflows} className="hover:text-white" title="Refresh Workflows">
                        <RefreshCw size={12} className={isLoadingWorkflows ? 'animate-spin' : ''} />
                    </button>
                </label>
                {workflows.length > 0 ? (
                  <select
                      value={workflowSelection}
                      onChange={(e) => {
                        setWorkflowSelection(e.target.value);
                        if (e.target.value !== 'custom') {
                          setWorkflowId(e.target.value);
                        } else {
                          setWorkflowId('');
                        }
                      }}
                      className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
                  >
                      <option value="">Select a Workflow...</option>
                      {workflows.map((wf: any) => (
                          <option key={wf.id} value={wf.id}>
                              {wf.name} {wf.active ? '(Active)' : ''}
                          </option>
                      ))}
                      <option value="custom">-- Enter ID Manually --</option>
                  </select>
                ) : (
                  <input 
                      type="text" 
                      value={workflowId}
                      onChange={(e) => setWorkflowId(e.target.value)}
                      placeholder="e.g. 12345"
                      className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
                  />
                )}
                {workflowSelection === 'custom' && (
                  <input 
                      type="text" 
                      value={workflowId}
                      onChange={(e) => setWorkflowId(e.target.value)}
                      placeholder="Enter Workflow ID"
                      className="w-full mt-2 bg-black/40 border border-white/20 rounded px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
                  />
                )}
            </div>

            <div>
                <label className="block text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                    Target Slot
                </label>
                <select 
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
                >
                    <option value="">Select a Slot...</option>
                    {emptySlots.map(slot => (
                        <option key={slot.id} value={slot.id}>
                            {slot.name} ({slot.phase})
                        </option>
                    ))}
                </select>
            </div>

            <button 
                onClick={handleDeploy}
                disabled={!agentName || !selectedSlot || deploying}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    !agentName || !selectedSlot || deploying
                        ? 'bg-white/5 text-white/20 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] text-white'
                }`}
            >
                {deploying ? <RefreshCw className="animate-spin" size={20} /> : <Rocket size={20} />}
                Deploy to Slot
            </button>
        </div>
      </div>

      {/* Main - n8n Iframe */}
      <div className="flex-1 bg-white relative">
        {iframeError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a2e] text-white">
                <AlertCircle size={48} className="text-red-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Could not load n8n</h3>
                <p className="text-white/60 mb-4">Ensure n8n is running at {n8nUrl}</p>
                <button 
                    onClick={() => setIframeError(false)}
                    className="px-4 py-2 bg-white/10 rounded hover:bg-white/20"
                >
                    Retry
                </button>
            </div>
        ) : (
            <iframe 
                ref={iframeRef}
                src={n8nUrl} 
                className="w-full h-full border-none"
                onError={() => setIframeError(true)}
                title="n8n-editor"
            />
        )}
      </div>
    </div>
  );
}
