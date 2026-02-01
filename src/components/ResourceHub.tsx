import React, { useState, useEffect } from 'react';
import { BookOpen, DollarSign, Users, TrendingUp, FileText, ExternalLink, Lightbulb, Bot, Sparkles, X, RefreshCw } from 'lucide-react';
import AIChatInterface from './agents/AIChatInterface';
import { ollamaService, ChatMessage } from '../services/ollamaService';
import ResourceViewer from './resources/ResourceViewer';
import BerkusCalculator from './resources/BerkusCalculator';
import { CURRICULUM_CONTENT, PITCH_DECK_TEMPLATE, TERM_SHEET_GUIDE, CROWDFUNDING_CONTENT, MARKET_RESEARCH_CONTENT, ADDITIONAL_TEMPLATES } from './resources/ResourceData';

interface ResourceItem {
  id: string;
  title: string;
  type: 'article' | 'tool' | 'template' | 'external';
  content?: string | React.ReactNode;
  externalUrl?: string;
  component?: string; // identifier for special components
}

interface ResourceSectionData {
  weeklyCurriculum: ResourceItem[];
  fundingSources: ResourceItem[];
  crowdfunding: ResourceItem[];
  valuationTerms: ResourceItem[];
  marketResearch: ResourceItem[];
  pitchDecks: ResourceItem[];
}

const DEFAULT_RESOURCES: ResourceSectionData = {
  weeklyCurriculum: [
    { id: 'w1', title: "Week 1: AI-First Business Models", type: 'article', content: CURRICULUM_CONTENT.week1, externalUrl: "https://startup.google.com/programs/accelerator/ai-first/" },
    { id: 'w2', title: "Week 2: Legal Structure & DAOs", type: 'article', content: CURRICULUM_CONTENT.week2, externalUrl: "https://seedlegals.com/resources/startups/" },
    { id: 'w3', title: "Week 3: Non-Dilutive Funding", type: 'article', content: CURRICULUM_CONTENT.week3, externalUrl: "https://seedfund.nsf.gov/" },
    { id: 'w4', title: "Week 4: Product-Market Fit", type: 'article', content: CURRICULUM_CONTENT.week4, externalUrl: "https://www.ycombinator.com/library/5z-the-real-product-market-fit" },
    { id: 'w5', title: "Week 5: Algorithmic Governance", type: 'article', content: CURRICULUM_CONTENT.week5, externalUrl: "https://www.nist.gov/itl/ai-risk-management-framework" },
    { id: 'w6', title: "Week 6: The 2026 Pitch", type: 'article', content: CURRICULUM_CONTENT.week6, externalUrl: "https://seedlegals.com/us/resources/pitch-deck-template-us-startups/" },
  ],
  fundingSources: [
    { id: 'f1', title: "AI Grant ($250k SAFE)", type: 'article', content: "The AI Grant is a direct investment for AI-native product startups. \n\n**Offer**: $250,000 uncapped SAFE.\n**Focus**: Products using LLMs, Agents, or new AI modalities.\n**Apply**: Visit aigrant.com during their batch intake.", externalUrl: "https://aigrant.com/" },
    { id: 'f2', title: "Google Startups Cloud ($350k)", type: 'article', content: "Google offers up to $350,000 in cloud credits for AI startups.\n\n**Requirements**: Series A or earlier, AI-first product.\n**Benefit**: Essential for training models and running inference without burning cash.", externalUrl: "https://cloud.google.com/startup/ai" },
    { id: 'f3', title: "America's Seed Fund (NSF)", type: 'article', content: "The NSF seeds deep tech startups with up to $2M.\n\n**Phase I**: $275k for concept validation (6-12 months).\n**Phase II**: $1M+ for prototype and commercialization.\n**Equity**: 0% (It is a Grant).", externalUrl: "https://seedfund.nsf.gov/" },
    { id: 'f4', title: "SBA Loans & Grants", type: 'article', content: "Standard US Government small business support.\n\n**7(a) Loans**: Common for working capital.\n**Microloans**: Up to $50k for startups.", externalUrl: "https://www.sba.gov/funding-programs/loans" },
  ],
  crowdfunding: [
    { id: 'c1', title: "Republic (Crypto/Token)", type: 'article', content: CROWDFUNDING_CONTENT.republic, externalUrl: "https://republic.com/" },
    { id: 'c2', title: "StartEngine (Equity)", type: 'article', content: CROWDFUNDING_CONTENT.startengine, externalUrl: "https://www.startengine.com/" },
    { id: 'c3', title: "Kickstarter (Pre-sales)", type: 'article', content: CROWDFUNDING_CONTENT.kickstarter, externalUrl: "https://www.kickstarter.com/" },
  ],
  valuationTerms: [
    { id: 'v1', title: "Berkus Valuation Calculator", type: 'tool', component: 'BerkusCalculator' },
    { id: 'v2', title: "Term Sheet Guide 2026", type: 'article', content: TERM_SHEET_GUIDE, externalUrl: "https://seedlegals.com/resources/term-sheet-guide/" },
    { id: 'v3', title: "YC SAFE Template", type: 'article', content: ADDITIONAL_TEMPLATES.ycSafe, externalUrl: "https://www.ycombinator.com/documents" },
  ],
  marketResearch: [
    { id: 'm1', title: "State of AI Report", type: 'article', content: MARKET_RESEARCH_CONTENT.stateOfAI, externalUrl: "https://www.stateof.ai/" },
    { id: 'm2', title: "Practical Founders", type: 'article', content: MARKET_RESEARCH_CONTENT.practicalFounders, externalUrl: "https://practicalfounders.com" },
  ],
  pitchDecks: [
    { id: 'p1', title: "Standard Pitch Template", type: 'template', content: PITCH_DECK_TEMPLATE },
    { id: 'p2', title: "Sequoia Capital Deck", type: 'template', content: ADDITIONAL_TEMPLATES.sequoiaDeck, externalUrl: "https://www.sequoiacap.com/article/writing-a-business-plan/" },
  ],
};

export default function ResourceHub() {
  const [activeAgent, setActiveAgent] = useState<'mentor' | 'money' | null>(null);
  const [resources, setResources] = useState<ResourceSectionData>(DEFAULT_RESOURCES);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const prefillWithAI = async () => {
    setIsGenerating(true);
    try {
      const models = await ollamaService.getModels();
      const modelToUse = models.find(m => m.name.includes('llama3'))?.name || models[0]?.name;

      if (!modelToUse) {
        alert('No AI models found. Please ensure Ollama is running.');
        setIsGenerating(false);
        return;
      }

      const prompt = `
        You are an expert startup advisor for the year 2026. 
        Please generate a JSON object containing curated resources for a startup resource hub.
        
        The JSON structure must be:
        {
          "weeklyCurriculum": [{ "title": "Week X: Topic", "content": "Summary of the topic..." }],
          "fundingSources": [{ "title": "Name", "content": "Description..." }]
        }
        
        RETURN ONLY THE JSON OBJECT.
      `;

      const messages: ChatMessage[] = [
        { role: 'system', content: 'You are a helpful JSON generator. You only output valid JSON.' },
        { role: 'user', content: prompt }
      ];

      const response = await ollamaService.chat(modelToUse, messages, { temperature: 0.7 });
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      const data = JSON.parse(jsonString);
      
      // Transform AI data to ResourceItem format
      const transform = (items: any[], type: 'article' | 'tool' | 'template') => 
        items?.map((item, i) => ({
          id: `ai-${Date.now()}-${i}`,
          title: item.title,
          type: type,
          content: item.content,
          externalUrl: item.href
        })) || [];

      if (data.weeklyCurriculum) {
        setResources(prev => ({
          ...prev,
          weeklyCurriculum: transform(data.weeklyCurriculum, 'article'),
          fundingSources: transform(data.fundingSources, 'article')
        }));
      }

    } catch (error) {
      console.error('Failed to generate resources:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResourceClick = (item: ResourceItem) => {
    if (item.type === 'external' && item.externalUrl) {
      window.open(item.externalUrl, '_blank');
    } else {
      setSelectedResource(item);
    }
  };

  const renderResourceContent = (item: ResourceItem) => {
    if (item.component === 'BerkusCalculator') {
      return <BerkusCalculator />;
    }
    return item.content;
  };

  return (
    <div className="w-full h-full relative overflow-hidden flex">
      {/* Resource Viewer Modal */}
      {selectedResource && (
        <ResourceViewer
          title={selectedResource.title}
          type={selectedResource.type}
          content={renderResourceContent(selectedResource)}
          externalUrl={selectedResource.externalUrl}
          onClose={() => setSelectedResource(null)}
        />
      )}

      <div className={`flex-1 h-full p-8 overflow-y-auto transition-all duration-300 ${activeAgent ? 'pr-[450px]' : ''}`}>
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Resource Hub</h1>
              <p className="text-white/60">Curated materials for funding, valuation, and curriculum progression.</p>
            </div>
            <button 
              onClick={prefillWithAI}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                isGenerating 
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-200 cursor-wait' 
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-purple-500/50'
              }`}
            >
              {isGenerating ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles className="text-purple-400" size={16} />}
              <span>{isGenerating ? 'Generating 2026 Resources...' : 'Prefill with 2026 Standards'}</span>
            </button>
          </div>

          {/* AI Assistants Section */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="text-purple-400" size={20} />
              AI Advisors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* MentorGPT Card */}
              <div 
                onClick={() => setActiveAgent('mentor')}
                className={`group relative p-6 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                  activeAgent === 'mentor' 
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]' 
                    : 'bg-gradient-to-br from-blue-900/20 to-black/40 border-white/10 hover:border-blue-500/30 hover:bg-blue-900/30'
                }`}
              >
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Bot size={28} />
                  </div>
                  {activeAgent === 'mentor' && <div className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">Active</div>}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">MentorGPT</h3>
                <p className="text-white/60 text-sm mb-4 relative z-10">
                  Your personal guide for career development, skill enhancement, and curriculum insights.
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-400 font-medium relative z-10">
                  <span>Start Session</span>
                  <ExternalLink size={12} />
                </div>
                {/* Background glow */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all" />
              </div>

              {/* MoneyGPT Card */}
              <div 
                onClick={() => setActiveAgent('money')}
                className={`group relative p-6 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                  activeAgent === 'money' 
                    ? 'bg-green-600/20 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]' 
                    : 'bg-gradient-to-br from-green-900/20 to-black/40 border-white/10 hover:border-green-500/30 hover:bg-green-900/30'
                }`}
              >
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="p-3 rounded-xl bg-green-500/20 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <DollarSign size={28} />
                  </div>
                  {activeAgent === 'money' && <div className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">Active</div>}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">MoneyGPT</h3>
                <p className="text-white/60 text-sm mb-4 relative z-10">
                  Expert advice on funding, valuation models, investment strategies, and financial planning.
                </p>
                <div className="flex items-center gap-2 text-xs text-green-400 font-medium relative z-10">
                  <span>Start Session</span>
                  <ExternalLink size={12} />
                </div>
                {/* Background glow */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-500/20 rounded-full blur-3xl group-hover:bg-green-500/30 transition-all" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Weekly Curriculum */}
            <ResourceCard title="Weekly Curriculum" icon={<BookOpen size={20} />}>
               {resources.weeklyCurriculum.map((item, i) => (
                  <ResourceLink key={i} item={item} onClick={handleResourceClick} />
               ))}
            </ResourceCard>

            {/* Funding Sources */}
            <ResourceCard title="Funding Sources" icon={<DollarSign size={20} />}>
               {resources.fundingSources.map((item, i) => (
                  <ResourceLink key={i} item={item} onClick={handleResourceClick} />
               ))}
            </ResourceCard>

            {/* Crowdfunding & Campaigns */}
            <ResourceCard title="Crowdfunding" icon={<Users size={20} />}>
               {resources.crowdfunding.map((item, i) => (
                  <ResourceLink key={i} item={item} onClick={handleResourceClick} />
               ))}
            </ResourceCard>

            {/* Tools & Valuation */}
            <ResourceCard title="Valuation & Terms" icon={<TrendingUp size={20} />}>
               {resources.valuationTerms.map((item, i) => (
                  <ResourceLink key={i} item={item} onClick={handleResourceClick} />
               ))}
            </ResourceCard>

            {/* Research & Articles */}
            <ResourceCard title="Market Research" icon={<Lightbulb size={20} />}>
               {resources.marketResearch.map((item, i) => (
                  <ResourceLink key={i} item={item} onClick={handleResourceClick} />
               ))}
            </ResourceCard>

            {/* Pitches */}
            <ResourceCard title="Pitch Decks" icon={<FileText size={20} />}>
               {resources.pitchDecks.map((item, i) => (
                  <ResourceLink key={i} item={item} onClick={handleResourceClick} />
               ))}
            </ResourceCard>
          </div>
        </div>
      </div>

      {/* AI Side Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-[400px] bg-[#0F0720]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transition-transform duration-300 ease-in-out z-50 transform ${
          activeAgent ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {activeAgent === 'mentor' && (
          <AIChatInterface 
            agentName="MentorGPT" 
            agentType="mentor"
            description="I can help you with career advice, learning paths, and curriculum questions."
            onClose={() => setActiveAgent(null)}
            suggestions={[
              "What should I learn next?",
              "Explain Week 3 curriculum",
              "How do I improve my leadership skills?",
              "What are the latest industry trends?"
            ]}
          />
        )}
        {activeAgent === 'money' && (
          <AIChatInterface 
            agentName="MoneyGPT" 
            agentType="money"
            description="I can assist with funding strategies, valuation models, and financial planning."
            onClose={() => setActiveAgent(null)}
            suggestions={[
              "How do I value my pre-revenue startup?",
              "What are the requirements for SBA loans?",
              "Create a 12-month budget template",
              "Explain the Berkus Method"
            ]}
          />
        )}
      </div>
    </div>
  );
}

function ResourceCard({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-colors h-full">
       <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
             {icon}
          </div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
       </div>
       <div className="space-y-3">
          {children}
       </div>
    </div>
  )
}

function ResourceLink({ item, onClick }: { item: ResourceItem, onClick: (item: ResourceItem) => void }) {
  return (
    <button 
      onClick={() => onClick(item)}
      className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group text-left"
    >
      <span className="text-sm text-white/80 group-hover:text-white truncate pr-2">{item.title}</span>
      {item.type === 'external' ? (
        <ExternalLink size={14} className="text-white/20 group-hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-all" />
      ) : (
        <BookOpen size={14} className="text-white/20 group-hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-all" />
      )}
    </button>
  )
}
