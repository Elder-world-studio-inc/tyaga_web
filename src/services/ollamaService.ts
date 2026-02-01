import { config } from '../config';

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OllamaOptions {
  num_ctx?: number;
  num_predict?: number;
  temperature?: number;
  top_k?: number;
  top_p?: number;
}

class OllamaService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.OLLAMA_URL;
  }

  async getModels(): Promise<OllamaModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Ollama getModels error:', error);
      return [];
    }
  }

  async chat(model: string, messages: ChatMessage[], options?: OllamaOptions): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          stream: false,
          options,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message?.content || 'No response from AI.';
    } catch (error) {
      console.error('Ollama chat error:', error);
      return 'Sorry, I am having trouble connecting to my brain (Ollama). Please check the server connection.';
    }
  }

  async *chatStream(model: string, messages: ChatMessage[], options?: OllamaOptions): AsyncGenerator<string, void, unknown> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
          options,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // The last element is either an empty string (if ends with \n) or an incomplete line
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          try {
            const json = JSON.parse(line);
            if (json.message?.content) {
              yield json.message.content;
            }
            if (json.done) {
              return;
            }
          } catch (e) {
            console.warn('Error parsing JSON chunk', e);
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        try {
          const json = JSON.parse(buffer);
          if (json.message?.content) {
            yield json.message.content;
          }
        } catch (e) {
           console.warn('Error parsing final JSON chunk', e);
        }
      }
    } catch (error) {
      console.error('Ollama chatStream error:', error);
      yield ' [Connection Error]';
    }
  }

  // Helper to pull a model if none exist (basic implementation)
  async pullModel(modelName: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/pull`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: modelName, stream: false }),
      });
      return response.ok;
    } catch (error) {
      console.error('Pull model error:', error);
      return false;
    }
  }
}

export const ollamaService = new OllamaService();
