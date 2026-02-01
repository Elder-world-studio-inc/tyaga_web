import React, { useState } from 'react';
import { Layers, Database, Cloud, Users, Music, Palette, ShoppingBag, BarChart3, Lock, Zap, GitBranch, Bot, LucideIcon } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  icon: LucideIcon;
  phase: number;
  tech: string;
  purpose: string;
  connects: string[];
}

interface ServiceCategory {
  [key: string]: Service[];
}

interface PhaseInfo {
  name: string;
  color: string;
  focus: string;
}

export default function MicroservicesArchitecture() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string>('all');

  const services: ServiceCategory = {
    core: [
      {
        id: 'auth',
        name: 'Authentication & Identity',
        icon: Lock,
        phase: 1,
        tech: 'Auth0 / Supabase',
        purpose: 'User management, roles (artist, admin, fan), SSO',
        connects: ['all services']
      },
      {
        id: 'api-gateway',
        name: 'API Gateway',
        icon: GitBranch,
        phase: 1,
        tech: 'Kong / AWS API Gateway',
        purpose: 'Route requests, rate limiting, API versioning',
        connects: ['all backend services']
      }
    ],
    content: [
      {
        id: 'music-streaming',
        name: 'Music Streaming Service',
        icon: Music,
        phase: 2,
        tech: 'Node.js + AWS S3/CloudFront',
        purpose: 'Audio file storage, streaming, playlists, metadata',
        connects: ['rights-mgmt', 'analytics']
      },
      {
        id: 'art-nft',
        name: 'Art & NFT Service',
        icon: Palette,
        phase: 2,
        tech: 'Web3.js + IPFS + Ethereum',
        purpose: 'NFT minting, marketplace, pixel art evolution tracking',
        connects: ['blockchain', 'payment']
      },
      {
        id: 'rights-mgmt',
        name: 'Rights & Royalties',
        icon: BarChart3,
        phase: 1,
        tech: 'Python + PostgreSQL',
        purpose: 'Copyright tracking, royalty calculations, splits',
        connects: ['payment', 'analytics']
      }
    ],
    ai: [
      {
        id: 'ai-orchestrator',
        name: 'AI Workflow Orchestrator',
        icon: Bot,
        phase: 3,
        tech: 'LangChain + n8n',
        purpose: 'Coordinate agentic AI tasks (marketing, content gen, automation)',
        connects: ['marketing-engine', 'content-mgmt']
      },
      {
        id: 'marketing-engine',
        name: 'Marketing Automation',
        icon: Zap,
        phase: 3,
        tech: 'Python + AI APIs',
        purpose: 'SEO optimization, campaign generation, trend analysis',
        connects: ['analytics', 'social-mgmt']
      }
    ],
    business: [
      {
        id: 'brand-mgmt',
        name: 'Multi-Brand Manager',
        icon: Layers,
        phase: 1,
        tech: 'Node.js + MongoDB',
        purpose: 'Handle DBA structure, brand switching, cross-brand analytics',
        connects: ['all services']
      },
      {
        id: 'content-mgmt',
        name: 'Content Management',
        icon: Database,
        phase: 2,
        tech: 'Strapi / Contentful',
        purpose: 'Blog posts, marketing materials, document versioning',
        connects: ['marketing-engine', 'social-mgmt']
      },
      {
        id: 'social-mgmt',
        name: 'Social Media Hub',
        icon: Users,
        phase: 2,
        tech: 'Buffer API + Custom',
        purpose: 'Cross-platform posting, engagement tracking, community mgmt',
        connects: ['analytics', 'marketing-engine']
      }
    ],
    infrastructure: [
      {
        id: 'payment',
        name: 'Payment Processing',
        icon: ShoppingBag,
        phase: 2,
        tech: 'Stripe + Crypto wallets',
        purpose: 'Fiat & crypto payments, subscriptions, royalty payouts',
        connects: ['rights-mgmt', 'art-nft']
      },
      {
        id: 'analytics',
        name: 'Analytics Engine',
        icon: BarChart3,
        phase: 2,
        tech: 'ClickHouse + Grafana',
        purpose: 'Real-time dashboards, user behavior, revenue tracking',
        connects: ['all services']
      },
      {
        id: 'blockchain',
        name: 'Blockchain Integration',
        icon: Cloud,
        phase: 3,
        tech: 'Ethereum + Polygon',
        purpose: 'Smart contracts, NFT verification, decentralized storage',
        connects: ['art-nft', 'rights-mgmt']
      }
    ]
  };

  const phases: { [key: number]: PhaseInfo } = {
    1: { name: 'Foundation', color: 'bg-blue-500', focus: 'Core identity, rights tracking, multi-brand setup' },
    2: { name: 'Content & Revenue', color: 'bg-green-500', focus: 'Music/art delivery, payments, analytics' },
    3: { name: 'AI & Scale', color: 'bg-purple-500', focus: 'Automation, blockchain, advanced features' }
  };

  const getServicesByPhase = () => {
    if (selectedPhase === 'all') return services;
    
    const filtered: ServiceCategory = {};
    Object.keys(services).forEach(category => {
      const filteredServices = services[category].filter(s => s.phase === parseInt(selectedPhase));
      if (filteredServices.length > 0) {
        filtered[category] = filteredServices;
      }
    });
    return filtered;
  };

  const ServiceCard = ({ service, category }: { service: Service; category: string }) => {
    const Icon = service.icon;
    const isSelected = selectedService?.id === service.id;
    const phaseColor = phases[service.phase].color;

    return (
      <div
        onClick={() => setSelectedService(isSelected ? null : service)}
        className={`p-4 rounded-xl border transition-all cursor-pointer ${
          isSelected 
            ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-white/70'}`}>
             <Icon className="w-5 h-5" />
          </div>
          <span className="font-semibold text-sm text-white">{service.name}</span>
        </div>
        <div className={`inline-block px-2 py-1 rounded text-xs text-white font-medium ${phaseColor} bg-opacity-80 mb-3`}>
          Phase {service.phase}
        </div>
        <div className="text-xs text-white/50 font-mono">{service.tech}</div>
      </div>
    );
  };

  const displayServices = getServicesByPhase();

  return (
    <div className="w-full h-full overflow-y-auto p-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Microservices Architecture</h1>
          <p className="text-white/60">Music, Art & Web3 Platform - Modular Design</p>
        </div>

        {/* Phase Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedPhase('all')}
            className={`px-4 py-2 rounded-lg font-medium transition border ${
              selectedPhase === 'all' 
                ? 'bg-white/10 text-white border-white/20' 
                : 'bg-transparent text-white/60 border-transparent hover:bg-white/5'
            }`}
          >
            All Phases
          </button>
          {[1, 2, 3].map(phase => (
            <button
              key={phase}
              onClick={() => setSelectedPhase(phase.toString())}
              className={`px-4 py-2 rounded-lg font-medium transition border ${
                selectedPhase === phase.toString()
                  ? `${phases[phase].color} text-white border-transparent bg-opacity-80`
                  : 'bg-transparent text-white/60 border-transparent hover:bg-white/5'
              }`}
            >
              Phase {phase}: {phases[phase].name}
            </button>
          ))}
        </div>

        {/* Phase Legend */}
        {selectedPhase === 'all' && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(phase => (
              <div key={phase} className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className={`inline-block px-3 py-1 rounded text-white ${phases[phase].color} mb-2 font-semibold text-xs`}>
                  Phase {phase}
                </div>
                <div className="text-sm text-white/70">{phases[phase].focus}</div>
              </div>
            ))}
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          {Object.entries(displayServices).map(([category, serviceList]) => (
            <div key={category} className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-6 capitalize flex items-center gap-2">
                {category === 'ai' ? 'AI & Automation' : category} Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceList.map(service => (
                  <ServiceCard key={service.id} service={service} category={category} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Service Details */}
        {selectedService && (
          <div className="fixed bottom-0 left-0 right-0 bg-[#0F0720]/90 backdrop-blur-xl border-t border-white/10 p-6 shadow-2xl z-50 transform transition-transform duration-300 slide-in-from-bottom-10">
             <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-start">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg">
                   <selectedService.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-white">{selectedService.name}</h3>
                      <button onClick={() => setSelectedService(null)} className="text-white/40 hover:text-white">Close</button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                      <div>
                         <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Technology</span>
                         <p className="text-white/90 mt-1">{selectedService.tech}</p>
                      </div>
                      <div>
                         <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Purpose</span>
                         <p className="text-white/90 mt-1">{selectedService.purpose}</p>
                      </div>
                      <div>
                         <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Connects To</span>
                         <div className="flex flex-wrap gap-2 mt-1">
                            {selectedService.connects.map(c => (
                               <span key={c} className="text-xs bg-white/10 px-2 py-1 rounded text-white/70">{c}</span>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Implementation Notes */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">🚀 Getting Started with AI Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white/80">
            <div>
              <h3 className="font-semibold text-white mb-2">AI Stack</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li><strong className="text-purple-300">n8n:</strong> Workflow automation</li>
                <li><strong className="text-purple-300">LangChain:</strong> Agent orchestration</li>
                <li><strong className="text-purple-300">AutoGPT:</strong> Autonomous tasks</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Phase 1 Priority</h3>
              <p className="text-sm text-white/60">Focus on Auth, API Gateway, Brand Management, and Rights tracking first.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Principles</h3>
              <p className="text-sm text-white/60">Modularity, Data Ownership, and decentralized IP management.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
