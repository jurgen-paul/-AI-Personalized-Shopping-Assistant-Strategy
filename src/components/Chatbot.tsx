import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, ThumbsUp, ThumbsDown, Trash2, Shield, Circle, Database, Star, Check, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Message, Product, ExtractedPreferences, ActiveDomain } from "../types";
import { PRODUCTS_CATALOG } from "../productsData";
import chatbotAvatar from "../assets/images/chatbot_avatar.jpg";

interface ChatbotProps {
  activeDomain: ActiveDomain;
  setActiveDomain: (domain: ActiveDomain) => void;
  onRecommendedProduct: (product: Product) => void;
}

const PRESET_QUERIES: Record<ActiveDomain, string[]> = {
  electronics: [
    "Laptop for graphic design under €1200",
    "Max specs premium workstation laptop",
    "Good headphones with active noise cancelling"
  ],
  oistaria: [
    "Deploy legendary armor with highest physical defenses",
    "Equip Arcanum staff for maximum spell damage boost",
    "Saboteur stealth cloak to unlock active Fog of War"
  ],
  fashion: [
    "Soothe dry skin serum for sensitive face layers",
    "Technical waterproof coat styled in slate charcoal",
    "Minimalist modular backpack for designer travel"
  ]
};

export default function Chatbot({ activeDomain, setActiveDomain, onRecommendedProduct }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hail, Commander! I am the Oistarian AI Assistant. Tell me your campaign budget or product needs, and I shall scan our repository for the supreme recommendations.",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<ExtractedPreferences>({
    budget: "Flexible",
    useCase: "General Scan",
    constraints: ["Ais-powered Search"]
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: "msg_" + Date.now(),
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          domain: activeDomain
        })
      });

      if (!response.ok) throw new Error("Connection failed");

      const data = await response.json();

      const assistantMessage: Message = {
        id: "msg_" + (Date.now() + 1),
        role: "assistant",
        content: data.reply || "I have received your inquiry but am unable to process it at this time.",
        timestamp: new Date(),
        recommendedProducts: data.recommendedProducts
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (data.extractedPreferences) {
        setPreferences({
          budget: data.extractedPreferences.budget || "Not Specified",
          useCase: data.extractedPreferences.useCase || "Tactical Command",
          constraints: data.extractedPreferences.constraints || []
        });
      }

    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: "msg_err_" + Date.now(),
        role: "assistant",
        content: "Error: Failed to synchronize with the Oistarian high tactics server. Ensure your GEMINI_API_KEY is configured in Settings.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Database re-synchronized. Active domain: ${activeDomain.toUpperCase()}. Initiate transmission, Commander.`,
        timestamp: new Date()
      }
    ]);
    setPreferences({
      budget: "Flexible",
      useCase: "General Scan",
      constraints: []
    });
  };

  const handleFeedback = (msgId: string, type: "like" | "dislike") => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return { ...m, feedback: type };
      }
      return m;
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full items-stretch">
      {/* LEFT: MAIN CHAT PANEL - Span 3 */}
      <div className="lg:col-span-3 flex flex-col bg-brand-charcoal/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-[650px] relative">
        
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-4">
            {/* Hooded Avatar Wrapper with custom ring glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-brand-mint/30 rounded-full blur-sm animate-pulse" />
              <img 
                src={chatbotAvatar} 
                alt="Oistarian Avatar" 
                className="w-12 h-12 rounded-full border-2 border-brand-mint object-cover relative z-10"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-brand-mint border-2 border-slate-900 rounded-full z-20" />
            </div>
            
            <div>
              <h3 className="font-display font-medium text-slate-100 flex items-center gap-1.5 leading-tight">
                The Oistarian Commander
                <span className="text-[10px] bg-brand-mint/10 text-brand-mint px-2 py-0.5 rounded-full border border-brand-mint/20 font-mono font-medium uppercase tracking-wider">
                  Tactics Core
                </span>
              </h3>
              <p className="text-xs text-slate-400">Conversational Shopping Companion</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Domain Switcher Pill Selector */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              {(["electronics", "oistaria", "fashion"] as ActiveDomain[]).map(d => (
                <button
                  key={d}
                  onClick={() => {
                    setActiveDomain(d);
                    clearChat();
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-mono transition-all duration-200 uppercase tracking-tight ${
                    activeDomain === d 
                      ? "bg-brand-blue text-white shadow-md font-semibold" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {d === "oistaria" ? "Tactical RPG" : d}
                </button>
              ))}
            </div>

            <button 
              onClick={clearChat}
              title="Clear Database Feed"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Messaging Logs Screen */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Assistant Avatar Left */}
                {msg.role === "assistant" && (
                  <div className="shrink-0">
                    <img 
                      src={chatbotAvatar} 
                      alt="Avatar" 
                      className="w-9 h-9 rounded-full border border-slate-700 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className={`max-w-[80%] flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-brand-blue/90 text-white rounded-tr-none shadow-lg shadow-brand-blue/10" 
                      : "bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none shadow-md"
                  }`}>
                    {msg.content}
                  </div>

                  {/* Show Recommended Products Cards inside Chat */}
                  {msg.role === "assistant" && msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 mt-3 w-full">
                      {msg.recommendedProducts.map(rec => {
                        const localProd = PRODUCTS_CATALOG[activeDomain]?.find(p => p.id === rec.id);
                        if (!localProd) return null;
                        return (
                          <div 
                            key={rec.id}
                            className="bg-slate-950 p-4 border border-slate-800/80 rounded-xl flex flex-col md:flex-row items-stretch md:items-center gap-4 transition-all duration-300 hover:border-brand-mint/40 group shadow-lg"
                          >
                            <span className="text-3xl p-2 bg-slate-900 border border-slate-800 rounded-lg shrink-0 self-center">
                              {localProd.image}
                            </span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-display font-medium text-slate-200 text-sm group-hover:text-brand-mint transition-colors">
                                  {localProd.name}
                                </h4>
                                <span className="text-xs font-mono font-bold text-brand-mint bg-brand-mint/10 px-2 py-0.5 rounded">
                                  {activeDomain === "oistaria" ? `⚡ ${localProd.price} Ether` : `€${localProd.price}`}
                                </span>
                              </div>
                              <p className="text-slate-400 text-xs mt-1 italic">
                                "{rec.reason}"
                              </p>
                              <div className="mt-2.5 flex items-center justify-between">
                                <span className="text-[10px] text-slate-500 max-w-[200px] truncate block">
                                  {localProd.specs}
                                </span>
                                <button
                                  onClick={() => onRecommendedProduct(localProd)}
                                  className="text-[11px] bg-slate-900 text-slate-200 border border-slate-700 hover:bg-brand-mint hover:text-slate-950 hover:border-brand-mint font-semibold px-3 py-1 rounded-md transition-all uppercase tracking-wider"
                                >
                                  Deploy Weapon
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Micro actions & Timestamp & Feedback */}
                  <div className="flex items-center gap-3 mt-1.5 px-1.5 text-[10px] text-slate-500">
                    <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    
                    {msg.role === "assistant" && msg.id !== "welcome" && (
                      <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
                        <button 
                          onClick={() => handleFeedback(msg.id, "like")}
                          className={`hover:text-brand-mint transition-colors ${msg.feedback === "like" ? "text-brand-mint font-bold" : ""}`}
                          title="Accurate recommendation"
                        >
                          <ThumbsUp size={11} />
                        </button>
                        <button 
                          onClick={() => handleFeedback(msg.id, "dislike")}
                          className={`hover:text-rose-400 transition-colors ${msg.feedback === "dislike" ? "text-rose-400 font-bold" : ""}`}
                          title="Irrelevant suggestion"
                        >
                          <ThumbsDown size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <div className="shrink-0">
                  <img src={chatbotAvatar} alt="Commander" className="w-9 h-9 rounded-full border border-slate-700 object-cover" />
                </div>
                <div className="bg-slate-900 border border-slate-800 px-4 py-3.5 rounded-2xl rounded-tl-none flex items-center gap-2 max-w-[100px]">
                  <Circle className="w-2 h-2 bg-brand-mint rounded-full animate-bounce" />
                  <Circle className="w-2 h-2 bg-brand-mint rounded-full animate-bounce [animation-delay:0.2s]" />
                  <Circle className="w-2 h-2 bg-brand-mint rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
          {/* Quick Prompts Tag Suggestions */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none">
            <span className="text-[10px] text-slate-500 uppercase font-mono shrink-0 flex items-center gap-1">
              <Sparkles size={10} className="text-brand-mint" /> Try:
            </span>
            {PRESET_QUERIES[activeDomain].map((q, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(q)}
                className="text-xs bg-slate-950 border border-slate-800 text-slate-300 hover:text-brand-mint hover:border-brand-mint/50 px-3 py-1 rounded-full whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }} 
            className="flex gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Inquire Oistarian database for ${activeDomain}...`}
              className="flex-1 bg-slate-950 text-slate-100 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-mint transition-colors tracking-wide"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="bg-brand-mint text-slate-950 hover:bg-white border border-brand-mint hover:border-white font-bold p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center shadow-lg shadow-brand-mint/10"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: EXTRACTION & PREFERENCES INSIGHTS PANEL - Span 1 */}
      <div className="flex flex-col gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col shadow-xl">
          <h3 className="font-display font-medium text-slate-100 text-sm flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
            <Database size={16} className="text-brand-mint" />
            AI Extraction Log
          </h3>

          <div className="space-y-4 flex-1">
            {/* Extracted Objective/Use-case */}
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1">Extracted Strategy / Objective</span>
              <div className="bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-xl flex items-center gap-2.5">
                <Shield size={14} className="text-brand-blue" />
                <span className="text-xs font-medium text-slate-200">{preferences.useCase}</span>
              </div>
            </div>

            {/* Extracted Budget constraints */}
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1">Budget Multipliers</span>
              <div className="bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-brand-mint">{preferences.budget}</span>
                <span className="text-[9px] uppercase font-mono text-slate-500">Constraint</span>
              </div>
            </div>

            {/* Constraints Checklist */}
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-2">Technical Constraints Found</span>
              <div className="space-y-2">
                {preferences.constraints && preferences.constraints.length > 0 ? (
                  preferences.constraints.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-950/60 border border-slate-800/60 px-3 py-1.5 rounded-lg text-slate-300">
                      <Check size={12} className="text-brand-mint" />
                      <span className="text-xs font-mono font-medium">{c}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 italic p-3 text-center border border-dashed border-slate-800 rounded-xl">
                    Waiting for tactical query...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 mt-4 text-xs text-slate-400 space-y-2">
            <h4 className="font-semibold text-slate-300 flex items-center gap-1.5 font-sans">
              <Star size={12} className="text-brand-mint fill-brand-mint" />
              Oistarian AI Intel
            </h4>
            <p className="leading-relaxed text-[11px] text-slate-400">
              This panel represents real-time preference mapping extracted directly through Gemini models. It dynamically extracts pricing arrays, constraints and parameters.
            </p>
          </div>
        </div>

        {/* Quick Campaign Map preview or stats links */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-xl">
          <div className="p-2.5 bg-brand-mint/10 text-brand-mint rounded-xl border border-brand-mint/20">
            <Star size={18} />
          </div>
          <div>
            <h4 className="text-xs font-display font-medium text-slate-200">The Oistarian Legion</h4>
            <p className="text-[10px] text-slate-400">Level 8 Strategos • Act I Complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}
