import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, Coins, Clock, Users, BarChart3, Settings, ShieldCheck, Check, Sparkles, RefreshCw, Layers, Database } from "lucide-react";
import { Product, ActiveDomain } from "../types";
import { PRODUCTS_CATALOG } from "../productsData";

interface DashboardProps {
  activeDomain: ActiveDomain;
}

export default function Dashboard({ activeDomain }: DashboardProps) {
  const [botTone, setBotTone] = useState<"strategic" | "informative" | "friendly">("strategic");
  const [includeExplanations, setIncludeExplanations] = useState(true);
  const [enableSmartReRank, setEnableSmartReRank] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Static Metrics matching PRD/memo conversion
  const metrics = [
    {
      label: "Conversion Uplift",
      value: "+18.4%",
      change: "vs 12.1% baseline",
      icon: TrendingUp,
      color: "text-brand-mint border-brand-mint/20 bg-brand-mint/5"
    },
    {
      label: "Average Order Value (AOV)",
      value: "€164.50",
      change: "+10.2% boost from cross-sell",
      icon: Coins,
      color: "text-brand-blue border-brand-blue/20 bg-brand-blue/5"
    },
    {
      label: "Avg. Discovery Time",
      value: "1.8 mins",
      change: "-32% faster search completion",
      icon: Clock,
      color: "text-amber-400 border-amber-400/20 bg-amber-400/5"
    },
    {
      label: "Active Concurrent Chats",
      value: "142 sessions",
      change: "1,412 automated today",
      icon: Users,
      color: "text-indigo-400 border-indigo-400/20 bg-indigo-400/5"
    }
  ];

  const topRecommended = PRODUCTS_CATALOG[activeDomain].slice(0, 3);

  return (
    <div className="space-y-6">
      
      {/* Banner info */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-brand-blue/5 blur-3xl rounded-full" />
        <div className="relative z-10">
          <h2 className="font-display font-medium text-xl text-slate-100 flex items-center gap-2">
            <Layers className="text-brand-mint" size={20} />
            Merchant Control & Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Review and adjust conversational recommendation parameters, examine simulated metrics, and oversee the product index powered by server-side Gemini.
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] font-mono block text-slate-500 uppercase">Indexing Node</span>
          <span className="text-xs font-mono font-bold text-brand-mint px-2 py-1 bg-brand-mint/10 border border-brand-mint/20 rounded-md inline-block mt-1">
            STATUS: ACTIVE ON PORT 3000
          </span>
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, index) => (
          <div key={index} className="bg-brand-charcoal/80 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between h-36">
            <div className="flex items-start justify-between">
              <span className="text-xs text-slate-400 font-sans">{m.label}</span>
              <m.icon size={18} className={`p-1 border rounded-lg ${m.color}`} />
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-slate-100 tracking-tight mt-2">{m.value}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">{m.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main split: Analytics list and config panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytics charts & Top suggestions list (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Simulated Conversion Graph */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-display font-medium text-slate-200 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart3 size={16} className="text-brand-blue" />
                Conversational Conversion Analytics
              </span>
              <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-1 border border-slate-800 rounded">
                Live Indexing Feed
              </span>
            </h3>

            {/* Custom SVG / Pure CSS Visual Sparkline Chart to keep build green and ultra styled */}
            <div className="h-44 flex items-end justify-between gap-1.5 pt-4 border-b border-l border-slate-800/80 px-4 relative">
              
              {/* Background horizontal lines */}
              <div className="absolute inset-x-0 top-1/4 border-b border-slate-800/20 border-dashed" />
              <div className="absolute inset-x-0 top-2/4 border-b border-slate-800/20 border-dashed" />
              <div className="absolute inset-x-0 top-3/4 border-b border-slate-800/20 border-dashed" />

              {/* Day slots bar values */}
              {[
                { day: "Jun 08", val: 32, uplift: 10 },
                { day: "Jun 09", val: 40, uplift: 12 },
                { day: "Jun 10", val: 55, uplift: 18 },
                { day: "Jun 11", val: 62, uplift: 22 },
                { day: "Jun 12", val: 78, uplift: 28 },
                { day: "Jun 13", val: 82, uplift: 31 },
                { day: "Jun 14", val: 95, uplift: 38 }
              ].map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative">
                  {/* Hover info tooltip */}
                  <div className="absolute bottom-full mb-2 bg-slate-950 border border-brand-mint/40 text-slate-100 text-[9px] font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none text-center">
                    Uplift: +{d.uplift}%<br/>Uptake: {d.val} chats
                  </div>
                  
                  {/* Split bar: Background chat session (blue) and recommended conversion boost (mint) */}
                  <div className="w-full max-w-[28px] bg-brand-blue/20 group-hover:bg-brand-blue/30 rounded-t-sm transition-colors relative" style={{ height: `${d.val}%` }}>
                    <div className="absolute bottom-0 inset-x-0 bg-brand-mint group-hover:bg-cyan-300 transition-colors rounded-t-sm" style={{ height: `${(d.uplift / d.val) * 100}%` }} />
                  </div>
                  
                  <span className="text-[9px] text-slate-500 font-mono mt-2">{d.day}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500 font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-brand-blue rounded-xs inline-block" /> Chat Engagement</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-brand-mint rounded-xs inline-block" /> Core Conversions</span>
              </div>
              <span>Updated: Real-time via UTC Codebase</span>
            </div>
          </div>

          {/* Current Recommended Hot List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-display font-medium text-slate-200 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database size={16} className="text-brand-mint" />
                Active Index Catalog Recommendations
              </span>
              <span className="text-xs text-slate-400 font-sans">Active Loop: {activeDomain.toUpperCase()}</span>
            </h3>

            <div className="divide-y divide-slate-800">
              {topRecommended.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-1.5 bg-slate-950 border border-slate-800 rounded-lg">{p.image}</span>
                    <div>
                      <h4 className="text-xs font-display font-medium text-slate-100">{p.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{p.specs.slice(0, 50)}...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-bold text-slate-200">{activeDomain === "oistaria" ? `⚡ ${p.price} Ether` : `€${p.price}`}</span>
                    <span className="text-[9px] uppercase font-mono text-brand-mint">Weight 55%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Configurations Box (Span 1) */}
        <div className="space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-display font-medium text-slate-200 mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Settings size={16} className="text-brand-blue" />
              Calibrate Conversational Core
            </h3>

            <div className="space-y-5">
              
              {/* Bot Tone selection */}
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-2">Commander Persona Tone</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "strategic", label: "Tactical" },
                    { id: "informative", label: "Relogical" },
                    { id: "friendly", label: "Benevolent" }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setBotTone(t.id as any)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                        botTone === t.id 
                          ? "bg-slate-100 text-slate-950 border-white shadow-md font-semibold" 
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Explainability Toggles */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-2">Tactical Directives</label>
                
                <label className="flex items-center justify-between cursor-pointer group bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">Provide Explainable Reasoning</span>
                    <span className="text-[9px] text-slate-500">Append 'chosen because' justifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeExplanations}
                    onChange={(e) => setIncludeExplanations(e.target.checked)}
                    className="rounded border-slate-800 text-brand-mint focus:ring-brand-mint leading-tight "
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer group bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">Embedding Re-ranking</span>
                    <span className="text-[9px] text-slate-500">Weights based on user interaction levels</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableSmartReRank}
                    onChange={(e) => setEnableSmartReRank(e.target.checked)}
                    className="rounded border-slate-800 text-brand-mint focus:ring-brand-mint leading-tight"
                  />
                </label>
              </div>

              {/* Trigger calibrate action button */}
              <button
                onClick={handleSaveSettings}
                className="w-full bg-brand-mint hover:bg-white text-slate-950 border border-brand-mint hover:border-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-mint/5"
              >
                <Sparkles size={14} className="animate-spin text-slate-950" />
                Calibrate Commander Core
              </button>

              <AnimatePresence>
                {isSaved && (
                  <div className="p-3 bg-brand-mint/20 border border-brand-mint/40 text-brand-mint text-xs rounded-lg text-center flex items-center justify-center gap-2">
                    <ShieldCheck size={14} />
                    Gemini Tactics core calibrated successfully!
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-2.5">
            <h4 className="font-semibold text-slate-300 font-sans">Business Moat Integration</h4>
            <p className="leading-relaxed text-[11px] text-slate-400">
              The embedding system maps your product catalog into vector coordinates automatically. Every swipe, purchase, and detail inquiry reinforces the recommender algorithm.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
