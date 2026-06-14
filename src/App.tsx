import { useState } from "react";
import { Sparkles, Swords, BarChart3, Bell, Terminal, ShoppingBag, X, Check, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PanelView, Product, ActiveDomain } from "./types";
import Chatbot from "./components/Chatbot";
import Dashboard from "./components/Dashboard";
import Tabletop from "./components/Tabletop";

export default function App() {
  const [activePanel, setActivePanel] = useState<PanelView>("assistant");
  const [activeDomain, setActiveDomain] = useState<ActiveDomain>("electronics");
  
  // Custom interactive notifications instead of iframe-unfriendly alert() calls
  const [alertNotification, setAlertNotification] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: "success" | "info" | "tactical";
  }>({
    show: false,
    title: "",
    message: "",
    type: "success"
  });

  // Action hook triggered when deploying a weapon/product
  const handleDeployProduct = (prod: Product) => {
    setAlertNotification({
      show: true,
      title: "Tactical Weapon Deployed",
      message: `The ${prod.name} (${prod.specs.slice(0, 40)}...) has been successfully dispatched to coordinates. Faction: ${activeDomain.toUpperCase()}`,
      type: "tactical"
    });
  };

  const closeNotification = () => {
    setAlertNotification(prev => ({ ...prev, show: false }));
  };

  return (
    <div className="bg-[#070a13] text-slate-100 min-h-screen font-sans flex flex-col selection:bg-brand-mint selection:text-slate-950">
      
      {/* GLOBAL HEADER BAR */}
      <header className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand section */}
          <div className="flex items-center gap-3">
            <div className="bg-brand-mint/10 text-brand-mint border border-brand-mint/20 p-2 rounded-xl animate-pulse">
              <Swords size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-medium tracking-tight text-lg text-slate-100">
                  Oistarians
                </span>
                <span className="text-[9px] font-mono font-bold bg-brand-blue/20 text-brand-blue px-1.5 py-0.5 rounded border border-brand-blue/30 uppercase">
                  v3.0 Core
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight">AI Conversational Strategy & Recommendation Suite</p>
            </div>
          </div>

          {/* Navigation Tabs - Span across views */}
          <nav className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            {[
              { id: "assistant", label: "AI Recommender", icon: Sparkles },
              { id: "dashboard", label: "Merchant Admin", icon: BarChart3 },
              { id: "tabletop", label: "Tabletop Campaign", icon: AwardsIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePanel(tab.id as PanelView)}
                className={`flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
                  activePanel === tab.id
                    ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/15 font-semibold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                }`}
              >
                <tab.icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Quick status status details */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <span className="w-1.5 h-1.5 bg-brand-mint rounded-full animate-ping" />
              Campaign Sync: Ok
            </span>
            <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-brand-mint transition-colors">
              <Bell size={14} />
            </div>
          </div>

        </div>
      </header>

      {/* MAIN LAYOUT CANVAS */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        
        {/* Animated component screen loading depending on tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {activePanel === "assistant" && (
              <Chatbot 
                activeDomain={activeDomain} 
                setActiveDomain={setActiveDomain} 
                onRecommendedProduct={handleDeployProduct}
              />
            )}
            
            {activePanel === "dashboard" && (
              <Dashboard activeDomain={activeDomain} />
            )}
            
            {activePanel === "tabletop" && (
              <Tabletop />
            )}
          </motion.div>
        </AnimatePresence>

        {/* CUSTOM OVERLAY IN-APP ALERTS MODAL */}
        <AnimatePresence>
          {alertNotification.show && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative"
              >
                <button 
                  onClick={closeNotification}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-brand-mint/10 border border-brand-mint/20 text-brand-mint rounded-xl mt-1">
                    <Terminal size={22} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-slate-100 text-base flex items-center gap-2">
                      {alertNotification.title}
                      <span className="text-[9px] bg-brand-mint/10 text-brand-mint px-2 py-0.5 rounded font-mono font-medium uppercase tracking-wider">
                        Success
                      </span>
                    </h3>
                    <p className="text-slate-300 text-xs mt-3 leading-relaxed bg-slate-950/50 p-4 border border-slate-850 rounded-xl font-mono">
                      {alertNotification.message}
                    </p>
                    
                    <div className="mt-5 flex justify-end gap-3">
                      <button
                        onClick={closeNotification}
                        className="text-xs bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-xl font-medium transition-colors"
                      >
                        Close Logs
                      </button>
                      <button
                        onClick={closeNotification}
                        className="text-xs bg-brand-mint text-slate-950 hover:bg-white font-bold px-4 py-2 rounded-xl transition-colors"
                      >
                        Acknowledge Order
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>

      {/* FOOTER METRICS AND STATUS */}
      <footer className="bg-slate-900/40 border-t border-slate-800/80 py-4 mt-8 shrink-0 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} Oistarians Intelligence Hub. Built and verified via Google AI Studio.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-brand-mint rounded-full" /> Sandbox Server: Live
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-brand-blue rounded-full" /> Gemini 3.5 Core Integration
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Custom subicon indicator wrapper
function AwardsIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}
