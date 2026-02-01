import React from 'react';
import { BarChart, Users, TrendingUp, DollarSign, Activity } from 'lucide-react';

interface MarketingAgentViewProps {
  agentName: string;
}

export default function MarketingAgentView({ agentName }: MarketingAgentViewProps) {
  return (
    <div className="p-8 text-white h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <TrendingUp className="text-pink-400" size={24} />
            </div>
            <h1 className="text-3xl font-bold">{agentName} Dashboard</h1>
          </div>
          <p className="text-white/60">Real-time campaign analytics and audience engagement metrics.</p>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Reach', value: '2.4M', icon: Users, color: 'text-blue-400' },
            { label: 'Engagement Rate', value: '4.8%', icon: Activity, color: 'text-green-400' },
            { label: 'Ad Spend', value: '$12.5k', icon: DollarSign, color: 'text-yellow-400' },
            { label: 'Conversion', value: '1.2%', icon: BarChart, color: 'text-purple-400' },
          ].map((metric, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-white/40 text-sm">{metric.label}</span>
                <metric.icon size={16} className={metric.color} />
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Campaign Performance</h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl text-white/20">
              Chart Placeholder (Recharts/Chart.js)
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Active Campaigns</h3>
              <div className="space-y-3">
                {['Summer Launch', 'Influencer Outreach', 'Retargeting Q1'].map((camp, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-sm">{camp}</span>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 border border-pink-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-2 text-pink-300">Agent Suggestions</h3>
              <p className="text-sm text-white/70 mb-4">
                "Based on recent trends, increasing spend on 'Summer Launch' by 15% could boost ROI by 4%."
              </p>
              <button className="w-full py-2 bg-pink-600 hover:bg-pink-700 rounded-lg text-xs font-bold transition-colors">
                Apply Recommendation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
