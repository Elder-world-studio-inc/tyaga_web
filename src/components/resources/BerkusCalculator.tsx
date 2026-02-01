import React, { useState } from 'react';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function BerkusCalculator() {
  const [values, setValues] = useState({
    idea: 0,
    prototype: 0,
    team: 0,
    relationships: 0,
    sales: 0
  });

  const MAX_PER_CATEGORY = 500000;

  const calculateTotal = () => {
    return Object.values(values).reduce((a, b) => a + b, 0);
  };

  const handleChange = (key: keyof typeof values, value: string) => {
    const numValue = Math.min(Math.max(0, Number(value)), MAX_PER_CATEGORY);
    setValues(prev => ({ ...prev, [key]: numValue }));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6 text-white">
      <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30 mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
          <TrendingUp className="text-purple-400" />
          Pre-Money Valuation Estimate
        </h3>
        <p className="text-3xl font-bold text-white">{formatCurrency(calculateTotal())}</p>
        <p className="text-sm text-white/50 mt-1">Based on the Berkus Method (Max $2.5M for early stage)</p>
      </div>

      <div className="space-y-4">
        <CategoryInput 
          label="Sound Idea (Basic Value)" 
          description="Does the startup have a sound business idea with basic value?"
          value={values.idea}
          onChange={(v) => handleChange('idea', v)}
          max={MAX_PER_CATEGORY}
        />
        <CategoryInput 
          label="Prototype (Technology)" 
          description="Is there a working prototype that reduces technology risk?"
          value={values.prototype}
          onChange={(v) => handleChange('prototype', v)}
          max={MAX_PER_CATEGORY}
        />
        <CategoryInput 
          label="Quality Management Team" 
          description="Does the team have the experience to execute the plan?"
          value={values.team}
          onChange={(v) => handleChange('team', v)}
          max={MAX_PER_CATEGORY}
        />
        <CategoryInput 
          label="Strategic Relationships" 
          description="Are there partners or relationships that reduce market risk?"
          value={values.relationships}
          onChange={(v) => handleChange('relationships', v)}
          max={MAX_PER_CATEGORY}
        />
        <CategoryInput 
          label="Product Rollout or Sales" 
          description="Is there early traction or a clear path to sales?"
          value={values.sales}
          onChange={(v) => handleChange('sales', v)}
          max={MAX_PER_CATEGORY}
        />
      </div>

      <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 flex items-start gap-3 mt-8">
        <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={18} />
        <div className="text-sm text-white/70">
          <p className="font-semibold text-blue-300 mb-1">Note on Valuation</p>
          The Berkus Method is a rule of thumb for pre-revenue startups. Actual valuation depends on market conditions, investor appetite, and negotiation.
        </div>
      </div>
    </div>
  );
}

function CategoryInput({ label, description, value, onChange, max }: { 
  label: string, 
  description: string, 
  value: number, 
  onChange: (val: string) => void,
  max: number 
}) {
  return (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
      <div className="flex justify-between mb-2">
        <label className="font-medium text-white">{label}</label>
        <span className="text-purple-300 font-mono">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)}</span>
      </div>
      <p className="text-xs text-white/50 mb-3">{description}</p>
      <input 
        type="range" 
        min="0" 
        max={max} 
        step="50000"
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />
      <div className="flex justify-between text-[10px] text-white/30 mt-1">
        <span>$0</span>
        <span>$500k</span>
      </div>
    </div>
  );
}
