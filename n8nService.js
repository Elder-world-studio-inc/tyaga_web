import { config } from './config.js';
import fetch from 'node-fetch'; // Need to install node-fetch if using Node < 18, but Node 18+ has global fetch. Assuming Node 18+ for Hostinger.

export class N8nService {
  constructor() {
    this.baseUrl = config.N8N_URL.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = config.N8N_API_KEY;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/api/v1${endpoint}`;
    const headers = {
      'X-N8N-API-KEY': this.apiKey,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    console.log(`[N8nService] Requesting: ${url}`);
    
    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`n8n API Error (${response.status}): ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[N8nService] Request failed:', error);
      throw error;
    }
  }

  async getWorkflows() {
    try {
      const data = await this.request('/workflows');
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
      return [];
    }
  }

  async createWorkflow(name) {
    try {
      const payload = {
        name: name,
        nodes: [],
        connections: {},
        settings: {},
        active: true
      };
      
      const data = await this.request('/workflows', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      return data;
    } catch (error) {
      console.error('Failed to create workflow:', error);
      return null;
    }
  }

  async activateWorkflow(id) {
    try {
      await this.request(`/workflows/${id}/activate`, { method: 'POST' });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deactivateWorkflow(id) {
    try {
      await this.request(`/workflows/${id}/deactivate`, { method: 'POST' });
      return true;
    } catch (error) {
      return false;
    }
  }
}
