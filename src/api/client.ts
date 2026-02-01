import { OrchestratorData, Slot, Agent, Work, Campaign } from '../components/builder/types'; // Need to verify where these types are defined or redefine them

// Since I don't want to chase imports right now, I'll redefine or use 'any' temporarily, 
// but better to look at SlotOrchestrator.tsx for interfaces.

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
  works?: any[];
  campaigns?: any[];
  analytics?: number[];
}

const API_BASE = '/api'; // Relative path, assuming served from same origin or proxied

export const apiClient = {
  getOrchestratorData: async (): Promise<OrchestratorData> => {
    const response = await fetch(`${API_BASE}/orchestrator`);
    if (!response.ok) throw new Error('Failed to fetch orchestrator data');
    return response.json();
  },

  createAgent: async (agent: { name: string; type: string }) => {
    const response = await fetch(`${API_BASE}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agent),
    });
    if (!response.ok) throw new Error('Failed to create agent');
    return response.json();
  },

  assignAgent: async (data: { slotId: string; agentId: string | null }) => {
    const response = await fetch(`${API_BASE}/slots/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to assign agent');
    return response.json();
  },

  createWork: async (work: any) => {
    const formData = new FormData();
    formData.append('title', work.title);
    formData.append('iswc', work.iswc);
    formData.append('writers', work.writers);
    if (work.audioFile) {
      formData.append('audioFile', work.audioFile);
    }

    const response = await fetch(`${API_BASE}/works`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create work');
    return response.json();
  },

  createCampaign: async (campaign: any) => {
    const response = await fetch(`${API_BASE}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaign),
    });
    if (!response.ok) throw new Error('Failed to create campaign');
    return response.json();
  },

  triggerCampaign: async (id: string) => {
    const response = await fetch(`${API_BASE}/campaigns/${id}/trigger`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to trigger campaign');
    return response.json();
  },

  getN8nWorkflows: async () => {
    const response = await fetch(`${API_BASE}/n8n/workflows`);
    if (!response.ok) throw new Error('Failed to fetch n8n workflows');
    return response.json();
  },
  
  // Add other methods as needed based on grep results
};
