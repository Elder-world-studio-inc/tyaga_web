import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, MoreHorizontal, X, AlertCircle, RefreshCw } from 'lucide-react';
import { ollamaService, ChatMessage } from '../../services/ollamaService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatInterfaceProps {
  agentName: string;
  agentType: 'mentor' | 'money';
  description: string;
  onClose?: () => void;
  suggestions?: string[];
}

export default function AIChatInterface({ agentName, agentType, description, onClose, suggestions = [] }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I am ${agentName}. ${description} How can I assist you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkModels();
  }, []);

  const checkModels = async () => {
    const available = await ollamaService.getModels();
    if (available.length > 0) {
      const modelNames = available.map(m => m.name);
      setModels(modelNames);
      
      // Prioritize faster/efficient models for better responsiveness
      const priorityModels = ['qwen2.5-coder:14b', 'qwen2.5-coder', 'phi3', 'gemma2', 'llama3:8b', 'mistral', 'llama3'];
      let preferred = modelNames[0];
      
      for (const p of priorityModels) {
        const found = modelNames.find(m => m.includes(p));
        if (found) {
          preferred = found;
          break;
        }
      }
      
      setSelectedModel(preferred);
      setError(null);
    } else {
      setModels([]);
      setError('No AI models found on server.');
    }
  };

  const handlePullModel = async () => {
    setIsTyping(true);
    setError('Pulling "llama3" model... this may take a while.');
    const success = await ollamaService.pullModel('llama3');
    if (success) {
      await checkModels();
      setError(null);
    } else {
      setError('Failed to pull model. Check server logs.');
    }
    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedModel) return;

    const userText = inputValue;
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Construct context with system prompt
      const systemPrompt = agentType === 'mentor' 
        ? "You are MentorGPT, a helpful career and curriculum advisor. Provide guidance on learning paths, skills, and industry trends."
        : "You are MoneyGPT, a financial advisor for startups. Help with funding, valuation, and financial modeling.";

      const chatHistory: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userText }
      ];

      // Create placeholder message for streaming response
      const responseMsgId = (Date.now() + 1).toString();
      const initialAiMessage: Message = {
        id: responseMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, initialAiMessage]);

      let fullContent = '';
      
      // Optimization: Limit tokens and context to improve speed
      const options = {
        num_ctx: 4096,     // Context window size
        num_predict: 1024, // Max tokens to generate
        temperature: 0.7,  // Creativity balance
      };

      for await (const chunk of ollamaService.chatStream(selectedModel, chatHistory, options)) {
        fullContent += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === responseMsgId 
            ? { ...msg, content: fullContent } 
            : msg
        ));
      }

    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error connecting to the AI brain.",
        timestamp: new Date()
      };
      // If we already added a message (streaming started then failed), we might want to append error or add new message
      // Simple approach: Add error message
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#13141f] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${agentType === 'mentor' ? 'bg-blue-500/20' : 'bg-green-500/20'}`}>
            <Bot size={24} className={agentType === 'mentor' ? 'text-blue-400' : 'text-green-400'} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{agentName}</h3>
            <div className="flex items-center gap-2">
              <p className="text-xs text-white/50">{agentType === 'mentor' ? 'Career Guide' : 'Financial Advisor'}</p>
              {selectedModel && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/40">{selectedModel}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <button 
              onClick={checkModels} 
              className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
              title="Refresh Connection"
            >
                <RefreshCw size={16} />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
                <MoreHorizontal size={20} />
            </button>
            {onClose && (
                <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-lg text-white/60 hover:text-red-400 transition-colors">
                    <X size={20} />
                </button>
            )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-purple-600' : (agentType === 'mentor' ? 'bg-blue-600' : 'bg-green-600')
              }`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              
              <div className={`p-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-purple-600/20 border border-purple-500/20 text-white rounded-tr-sm' 
                  : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-sm'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <span className="text-[10px] text-white/30 mt-1 block">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  agentType === 'mentor' ? 'bg-blue-600' : 'bg-green-600'
               }`}>
                  <Sparkles size={14} className="animate-pulse" />
               </div>
               <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                 <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
            </div>
          </div>
        )}

        {/* Error / Empty State */}
        {error && (
          <div className="flex flex-col items-center justify-center p-6 bg-red-500/10 border border-red-500/20 rounded-xl my-4">
             <AlertCircle className="text-red-400 mb-2" size={24} />
             <p className="text-red-200 text-sm text-center mb-3">{error}</p>
             {models.length === 0 && (
               <button 
                 onClick={handlePullModel}
                 className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs rounded-lg transition-colors flex items-center gap-2"
               >
                 <RefreshCw size={12} />
                 Attempt to Pull "llama3"
               </button>
             )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        {suggestions.length > 0 && messages.length === 1 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                {suggestions.map((suggestion, idx) => (
                    <button 
                        key={idx}
                        onClick={() => {
                            setInputValue(suggestion);
                            // Optional: auto-send
                        }}
                        className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 hover:text-white transition-colors"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        )}
        
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${agentName} anything...`}
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder-white/20"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="p-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center text-white/20 mt-2">
          AI interactions are private and secure. Models can make mistakes.
        </p>
      </div>
    </div>
  );
}
