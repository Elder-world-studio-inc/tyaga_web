import fs from 'fs';
import path from 'path';
import { N8nService } from './n8nService.js';
import { config } from './config.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Orchestrator {
  constructor() {
    this.slots = [];
    this.agents = [];
    this.works = [];
    this.campaigns = [];
    this.analytics = [];
    // Save data in the current directory or a data directory
    this.dataPath = path.join(__dirname, 'orchestrator-data.json');
    this.n8nService = new N8nService();
    
    this.initialize();
  }

  initialize() {
    this.initializeSlots();
    this.loadState();
    // this.checkServiceHealth();
    // setInterval(() => this.checkServiceHealth(), 30000); 
  }

  loadState() {
    try {
      if (fs.existsSync(this.dataPath)) {
        const data = fs.readFileSync(this.dataPath, 'utf-8');
        const parsed = JSON.parse(data);
        if (parsed.slots && parsed.agents) {
          this.slots = parsed.slots;
          this.agents = parsed.agents;
          this.works = parsed.works || [];
          this.campaigns = parsed.campaigns || [];
          console.log(`State loaded from ${this.dataPath}`);
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to load state:', error);
    }
    return false;
  }

  saveState() {
    try {
      const data = {
        slots: this.slots,
        agents: this.agents,
        works: this.works,
        campaigns: this.campaigns,
        analytics: this.analytics
      };
      fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }

  initializeSlots() {
    this.slots = [
      { id: 'auth', name: 'Auth Service', phase: 'Foundation', assignedAgentId: null, status: 'Idle' },
      { id: 'api-gateway', name: 'API Gateway', phase: 'Foundation', assignedAgentId: null, status: 'Idle' },
      { id: 'rights-tracking', name: 'Rights Tracking', phase: 'Foundation', assignedAgentId: null, status: 'Idle' },
      { id: 'brand-mgmt', name: 'Brand Management', phase: 'Foundation', assignedAgentId: null, status: 'Idle' },
      { id: 'omnivael-hub', name: 'Omnivael Hub', phase: 'Content', assignedAgentId: null, status: 'Idle' },
      { id: 'music-streaming', name: 'Music Streaming', phase: 'Content', assignedAgentId: null, status: 'Idle' },
      { id: 'art-nft', name: 'Art & NFT', phase: 'Content', assignedAgentId: null, status: 'Idle' },
      { id: 'content-mgmt', name: 'Content Mgmt', phase: 'Content', assignedAgentId: null, status: 'Idle' },
      { id: 'social-mgmt', name: 'Social Media Hub', phase: 'Content', assignedAgentId: null, status: 'Idle' },
      { id: 'payment', name: 'Payment Processing', phase: 'Content', assignedAgentId: null, status: 'Idle' },
      { id: 'analytics', name: 'Analytics Engine', phase: 'Content', assignedAgentId: null, status: 'Idle' },
      { id: 'ai-orchestrator', name: 'AI Orchestrator', phase: 'AI & Scale', assignedAgentId: null, status: 'Idle' },
      { id: 'marketing-engine', name: 'Marketing Engine', phase: 'AI & Scale', assignedAgentId: null, status: 'Idle' },
      { id: 'blockchain', name: 'Blockchain Integration', phase: 'AI & Scale', assignedAgentId: null, status: 'Idle' },
    ];
  }

  async getOrchestratorData() {
    await Promise.all([this.fetchWorks(), this.fetchCampaigns(), this.fetchAnalytics(), this.fetchAgents()]);
    return {
      slots: this.slots,
      agents: this.agents,
      works: this.works,
      campaigns: this.campaigns,
      analytics: this.analytics
    };
  }

  async getN8nWorkflows() {
    return this.n8nService.getWorkflows();
  }

  async fetchWorks() {
    try {
      const response = await fetch(`${config.API_BASE_URL}/works`);
      if (response.ok) {
        const works = await response.json();
        this.works = works.map((w) => ({
          id: w.id,
          title: w.title,
          iswc: w.iswc || '',
          writers: w.writers ? w.writers.map((wr) => `${wr.name} (${wr.performanceSplit}%)`).join(', ') : '',
          status: 'Registered',
          audioUrl: w.audioUrl
        }));
      }
    } catch (error) {
      console.error('Failed to fetch works from API:', error);
    }
  }

  async fetchCampaigns() {
    try {
        const response = await fetch(`${config.API_BASE_URL}/campaigns`);
        if (response.ok) {
            const campaigns = await response.json();
            this.campaigns = campaigns;
        }
    } catch (error) {
        console.error('Failed to fetch campaigns:', error);
    }
  }

  async fetchAnalytics() {
    try {
        const response = await fetch(`${config.API_BASE_URL}/campaigns/analytics`);
        if (response.ok) {
            this.analytics = await response.json();
        }
    } catch (error) {
        console.error('Failed to fetch analytics:', error);
    }
  }

  async fetchAgents() {
    try {
        const workflows = await this.n8nService.getWorkflows();
        this.agents = workflows.map(wf => ({
            id: wf.id,
            name: wf.name,
            type: 'Automation',
            n8nWorkflowId: wf.id
        }));
    } catch (error) {
        console.error('Failed to fetch n8n workflows as agents:', error);
    }
  }

  async createAgent(agentData) {
    const newAgent = {
      id: `agent-${Date.now()}`,
      ...agentData,
    };
    
    try {
        const workflow = await this.n8nService.createWorkflow(newAgent.name);
        if (workflow) {
            newAgent.n8nWorkflowId = workflow.id;
        }
    } catch (e) {
        console.error("Failed to create n8n workflow", e);
    }

    this.agents.push(newAgent);
    this.saveState();
    return newAgent;
  }

  assignAgent(slotId, agentId) {
    const slotIndex = this.slots.findIndex(s => s.id === slotId);
    if (slotIndex !== -1) {
      this.slots[slotIndex].assignedAgentId = agentId;
      if (agentId) {
          this.slots[slotIndex].status = 'Active';
      } else {
          this.slots[slotIndex].status = 'Idle';
      }
      this.saveState();
      return this.slots[slotIndex];
    }
    throw new Error(`Slot ${slotId} not found`);
  }

  async createWork(workData, file) {
    // Writers string parsing
    const writers = workData.writers.split(',').map((s) => {
        const match = s.match(/(.*)\s*\((\d+)%\)/);
        if (match) {
            return {
                name: match[1].trim(),
                performanceSplit: parseInt(match[2]),
                mechanicalSplit: parseInt(match[2])
            };
        }
        return { name: s.trim(), performanceSplit: 0, mechanicalSplit: 0 };
    });

    const formData = new FormData();
    formData.append('title', workData.title);
    formData.append('iswc', workData.iswc || '');
    formData.append('writers', JSON.stringify(writers));

    if (file) {
        try {
            // file is a multer file object
            // { fieldname, originalname, encoding, mimetype, buffer, size }
            const blob = new Blob([file.buffer]);
            formData.append('audioFile', blob, file.originalname);
        } catch (err) {
            console.error('Failed to process audio file:', err);
        }
    }

    try {
        const response = await fetch(`${config.API_BASE_URL}/works`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const savedWork = await response.json();
            const newWork = {
                id: savedWork.id,
                title: savedWork.title,
                iswc: savedWork.iswc || '',
                writers: workData.writers,
                status: 'Registered'
            };
            this.works.push(newWork);
            return newWork;
        } else {
            const text = await response.text();
            console.error('API Error:', text);
            throw new Error(text);
        }
    } catch (error) {
         console.error('Failed to create work on API:', error);
         throw error;
    }
  }

  async createCampaign(campaignData) {
    const payload = {
        name: campaignData.name,
        platform: campaignData.platform,
        contentStrategy: campaignData.contentStrategy,
        status: 'Draft'
    };

    try {
        const response = await fetch(`${config.API_BASE_URL}/campaigns`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const newCampaign = await response.json();
            this.campaigns.push(newCampaign);
            return newCampaign;
        }
    } catch (error) {
        console.error("Failed to create campaign:", error);
    }
    throw new Error("Failed to create campaign");
  }

  async triggerCampaign(campaignId) {
    try {
        const response = await fetch(`${config.API_BASE_URL}/campaigns/${campaignId}/trigger`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const campaign = this.campaigns.find(c => c.id === campaignId);
            if (campaign) campaign.status = 'Active';
            return { success: true, message: "Campaign triggered" };
        }
    } catch (error) {
        console.error("Failed to trigger campaign:", error);
    }
    throw new Error("Failed to trigger campaign");
  }
}
