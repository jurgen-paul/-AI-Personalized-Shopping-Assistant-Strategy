import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI client (will lazily query GEMINI_API_KEY)
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. Using mock fallback mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Structured Mock Product Database
const PRODUCTS_DATABASE = {
  electronics: [
    {
      id: "tech_probook",
      name: "ProBook X-15 Creator",
      category: "electronics",
      price: 1150,
      image: "💻",
      specs: "15.6\" 100% sRGB display, Intel Core i7, 16GB RAM, RTX 4060 GPU, 1TB NVMe, 80Wh battery",
      description: "Optimized for graphic designers, digital artists, and entry-level CAD software. Balanced budget and power."
    },
    {
      id: "tech_zenith",
      name: "Zenith Creator Lite",
      category: "electronics",
      price: 950,
      image: "💻",
      specs: "15.6\" IPS 99% sRGB, AMD Ryzen 7, 16GB RAM, Integrated Radeon Graphics, 512GB SSD",
      description: "Affordable creative work laptop with an excellent color-accurate screen but relies on active CPU rendering."
    },
    {
      id: "tech_aeroblade",
      name: "Aero Blade Ultimate Pro",
      category: "electronics",
      price: 1699,
      image: "💻",
      specs: "16\" OLED 4K Display, Intel Ultra 9, 32GB RAM, RTX 4080 GPU, 2TB SSD, aluminum alloy frame",
      description: "Ultimate luxury creative workspace for 3D modeling, deep rendering, high-frame video editing, and extreme multitasking."
    },
    {
      id: "tech_soundflow",
      name: "SoundFlow Onyx ANC",
      category: "electronics",
      price: 299,
      image: "🎧",
      specs: "Hybrid Active Noise Cancelling, 40h battery, Spatial Sound, studio reference response",
      description: "Premium over-ear headphones designed for concentration and sound editing in noisy conditions."
    },
    {
      id: "tech_curved_monitor",
      name: "UltraAlign 34\" Ultrawide",
      category: "electronics",
      price: 449,
      image: "🖥️",
      specs: "34\" Curved QHD, 144Hz, HDR 400, 100% sRGB, dual-input picture-by-picture",
      description: "Wide field of view perfect for dual timelines, design artboards, or managing deep tactical logs."
    }
  ],
  oistaria: [
    {
      id: "relic_dreadplate",
      name: "Ether-Forged Dreadplate",
      category: "oistaria",
      price: 4800,
      image: "🛡️",
      specs: "Plate armor, +45 Defense rating, +200 Ether resistance, Heavy chassis, Oistarian Crest",
      description: "Premium tactical armor engineered for Vanguard Knights and Oistarian Phalanxes. Resists kinetic and spell attacks. Heavy but grants high-morale bonus."
    },
    {
      id: "relic_focus_staff",
      name: "Warlord's Command Focus Staff",
      category: "oistaria",
      price: 3200,
      image: "🪄",
      specs: "Spell Focus Catalyst, +25% Flanking spell damage, instant ether-discharge channeler",
      description: "Carried by high-tier Arcanum Bolt-Casters. Allows reality-altering projection onto enemy coordinates. Increases flanking efficiency significantly."
    },
    {
      id: "relic_saboteur_cloak",
      name: "Saboteur's Cloak of Illusion",
      category: "oistaria",
      price: 1800,
      image: "🧥",
      specs: "Cloaking textile, grants Fog of War active state, +30% Flanking accuracy, lightweight",
      description: "Ideal for specialists like the Saboteur. Distorts local space, rendering the wearer invisible to remote Concord Rangers, initiating clean surprise attacks."
    },
    {
      id: "relic_golem_core",
      name: "Titan-Forged Golem Core",
      category: "oistaria",
      price: 8500,
      image: "🔋",
      specs: "Siege cell engine, unlocks Colossus companion, +500 Max Morale payload, infinite power",
      description: "A supreme heavy artifact. Unlocks the capability to construct or activate a massive Titan-Forged Golem war engine. Immune to basic magic override."
    },
    {
      id: "relic_skylancer_spear",
      name: "Concord Sky-Lancer Spear",
      category: "oistaria",
      price: 3600,
      image: "🔱",
      specs: "Aerodynamic reach spear, grants +15% Elevation advantage bonus, high-grade ironbound steel",
      description: "Unravels defensive matrices. Ideal for airborne shock lancemen attacking from high physical coordinates, delivering absolute damage penetration."
    }
  ],
  fashion: [
    {
      id: "style_serum",
      name: "DermaRestore Squalane Centella",
      category: "fashion",
      price: 42,
      image: "🧪",
      specs: "50ml, Squalane 2%, Centella Asiatica 5%, pH-balanced, fragrance-free, clinically certified",
      description: "Targeted soothing moisturizer for highly sensitive, compromised, or hyper-reactive skin. Instantly calms redness and repairs active barrier cells."
    },
    {
      id: "style_cream",
      name: "LuxeShield Barrier Recovery",
      category: "fashion",
      price: 35,
      image: "🧴",
      specs: "75ml, 3x Essential Ceramides, Hyaluronic Acid, deep lipid nourishment",
      description: "Thick daily protective cream for repairing dried patches under stress or harsh desert environments."
    },
    {
      id: "style_coat",
      name: "The Tactical Vanguard Coat",
      category: "fashion",
      price: 195,
      image: "🧥",
      specs: "Dual-layer heavy wax canvas, storm-collared, 8 tactical internal pockets, water-repellent",
      description: "An elegant, highly robust technical coat modeled after the legendary Oistarian robes. Styled in matte coal-gray, perfect for urban elements."
    },
    {
      id: "style_backpack",
      name: "Nomad Utility Rolltop",
      category: "fashion",
      price: 110,
      image: "🎒",
      specs: "24L expandable, 1000D Cordura, waterproof zippers, individual padded laptop cradle",
      description: "Minimalist expandable travel pack for designers and commuters. Combines sleek display profiles with active utility layouts."
    }
  ]
};

app.use(express.json());

// API: List internal products
app.get("/api/products", (req, res) => {
  res.json(PRODUCTS_DATABASE);
});

// API: Process Gemini Chat Recommendation
app.post("/api/recommend", async (req, res) => {
  const { messages, domain } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages configuration" });
  }

  const selectedDomain = (domain && PRODUCTS_DATABASE[domain]) ? domain : "electronics";
  const catalogList = PRODUCTS_DATABASE[selectedDomain];

  // If API key is not defined, return high-quality mock data dynamically
  if (!process.env.GEMINI_API_KEY) {
    console.log("No GEMINI_API_KEY found, executing smart mock response...");
    
    // Simple heuristic-based engine
    const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
    let recommended: any[] = [];
    let reply = "";
    let extracted = { budget: "Not specified", useCase: "General Shopper", constraints: [] as string[] };

    if (selectedDomain === "electronics") {
      extracted.useCase = "Creative & General Tech";
      if (lastUserMsg.includes("design") || lastUserMsg.includes("graphic")) {
        recommended.push({ id: "tech_probook", reason: "The ProBook X-15 Creator fits beautifully within standard creative budgets and features a color-accurate 100% sRGB display paired with a dedicated RTX 4060 GPU." });
        extracted.constraints.push("Color Accuracy", "Dedicated GPU");
        reply = "Hail, Traveler! For creative activities like graphic design, color layout is paramount. I recommend looking at our Creator series:";
      } else if (lastUserMsg.includes("budget") || lastUserMsg.includes("cheap") || lastUserMsg.includes("900") || lastUserMsg.includes("1000")) {
        recommended.push({ id: "tech_zenith", reason: "Zenith Creator Lite balances core computing tasks with an outstanding screen under modern pricing limits." });
        extracted.budget = "Under €1000";
        extracted.constraints.push("Price Constraint");
        reply = "I hear your budget needs. Finding the maximum value for cash requires physical discretion. Let me suggest this choice:";
      } else if (lastUserMsg.includes("best") || lastUserMsg.includes("premium") || lastUserMsg.includes("heavy") || lastUserMsg.includes("extreme")) {
        recommended.push({ id: "tech_aeroblade", reason: "The Aero Blade Ultimate offers unmatched processing overhead, 4K OLED pixels, and professional CAD/Render grade capabilities." });
        extracted.constraints.push("Workstation Overhead");
        reply = "Ah, you seek absolute precision regardless of resource constraints. The Ultimate catalog provides this:";
      } else {
        recommended.push({ id: "tech_probook", reason: "Our balanced workstation provides excellent mid-range utilities." });
        reply = "I am ready to formulate recommendations for your tech setup. Tell me more about your design work, budget, or specifications!";
      }
    } else if (selectedDomain === "oistaria") {
      extracted.useCase = "Oistarian Campaign Strategy";
      if (lastUserMsg.includes("armor") || lastUserMsg.includes("defense") || lastUserMsg.includes("phalanx") || lastUserMsg.includes("frontline")) {
        recommended.push({ id: "relic_dreadplate", reason: "Provides peak defensive stat multipliers to shield your units during front engagements." });
        extracted.constraints.push("Defense Multipliers");
        reply = "The Oistarian armies rely on absolute physical discipline. Enhance your frontline units with the crest:";
      } else if (lastUserMsg.includes("magic") || lastUserMsg.includes("spell") || lastUserMsg.includes("arcanum") || lastUserMsg.includes("flank")) {
        recommended.push({ id: "relic_focus_staff", reason: "Adds 25% spell amplifying damage bonus which multiplies flanking effects on high ground." });
        extracted.constraints.push("Arcane Damage Boost");
        reply = "Reality is yours to mold, scholar. This staff delivers precision ether channels:";
      } else if (lastUserMsg.includes("stealth") || lastUserMsg.includes("hide") || lastUserMsg.includes("sneak") || lastUserMsg.includes("saboteur")) {
        recommended.push({ id: "relic_saboteur_cloak", reason: "Cloaks the tactical unit, entering active Fog of War to nullify long-range counter assaults." });
        extracted.constraints.push("Invisibility Protocols");
        reply = "Shadow tactics can break even the hardest fortress wall. Master the night with this relic:";
      } else {
        recommended.push({ id: "relic_golem_core", reason: "Unlocks the colossal war unit, adding tremendous moral superiority to your combat deployment." });
        reply = "Greetings, Champion. Tell me your tactical preference (Defense, Secret Cloaking, Celestial Staves, or Heavy Siege Golems) and I will identify the supreme weapon:";
      }
    } else {
      // Fashion & Beauty
      extracted.useCase = "Daily Skincare & Outer Armor";
      if (lastUserMsg.includes("sensitive") || lastUserMsg.includes("serum") || lastUserMsg.includes("dry") || lastUserMsg.includes("skin")) {
        recommended.push({ id: "style_serum", reason: "The Squalane Centella complex is clinically certified, zero fragrances, calming sensitive cell zones safely." });
        extracted.constraints.push("Fragrance-Free", "Mild Hydration");
        reply = "Even the fiercest warrior deserves restorative comfort. Shield your touch zones with this serum:";
      } else if (lastUserMsg.includes("coat") || lastUserMsg.includes("jacket") || lastUserMsg.includes("wear")) {
        recommended.push({ id: "style_coat", reason: "Styled explicitly based on legendary military high collar designs, featuring heavy storm proof durability." });
        extracted.constraints.push("Technical Outerwear");
        reply = "Drape yourself in protective slate textures to dominate heavy elements in high style:";
      } else {
        recommended.push({ id: "style_backpack", reason: "Provides waterproof modular partitions perfect for active creators." });
        reply = "Explore our minimalist style catalog. Tell me if you are looking to treat sensitive skin layers or secure waterproof travel storage:";
      }
    }

    return res.json({
      reply: reply + " " + (recommended[0] ? `The **${PRODUCTS_DATABASE[selectedDomain].find(p=>p.id===recommended[0].id)?.name}** is the absolute best match for your current campaign.` : ""),
      recommendedProducts: recommended,
      extractedPreferences: extracted
    });
  }

  try {
    const ai = getGeminiClient();

    // Map message list to format expected by Gemini
    // We will build a prompt that includes the exact catalogs and instructs the bot to return JSON matching our schema
    const formattedCatalog = JSON.stringify(catalogList, null, 2);

    const systemPrompt = `You are "The Oistarian Commander", an epic fantasy/tactical strategist and a hyper-intelligent product recommendation AI helper. 
Your avatar is a hooded commander clad in tattered ash robes with glowing blue-teal ether sparks around you. Speak with a refined, strategic, slightly epic, yet incredibly precise, helpful and clear tone.

CRITICAL DIRECTIVES:
1. You MUST evaluate the current user query against the following catalog of items (domain: ${selectedDomain}):
${formattedCatalog}

2. Based on the history, find the matching products. Formulate a personalized recommendation.
3. You must output a JSON response EXACTLY matching this TypeScript interface. Do NOT put markdown outside of the JSON block. Return ONLY raw JSON.

Interface:
{
  "reply": "Refined, friendly, tactical and epic text explaining your perspective, talking about constraints the user has, and framing your advice.",
  "recommendedProducts": [
    {
      "id": "item_id_from_catalog",
      "reason": "Detailed explainable recommendation reasoning matching user intent"
    }
  ],
  "extractedPreferences": {
    "budget": "identified budget limit or 'Flexible'",
    "useCase": "primary objective, role, or use case",
    "constraints": ["e.g. Color accuracy", "e.g. Flanking capability", "e.g. Fragrance-free"]
  }
}`;

    // Flatten history for simplicity in content generation
    const userPrompts = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `History of conversation:\n${userPrompts}\n\nFormulate the next JSON recommendation response.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING, description: "A friendly, helpful, slightly epic response explaining the selections." },
            recommendedProducts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "The product ID being recommended." },
                  reason: { type: Type.STRING, description: "Detailed contextual reason of why it was selected." }
                },
                required: ["id", "reason"]
              }
            },
            extractedPreferences: {
              type: Type.OBJECT,
              properties: {
                budget: { type: Type.STRING },
                useCase: { type: Type.STRING },
                constraints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["budget", "useCase", "constraints"]
            }
          },
          required: ["reply", "recommendedProducts", "extractedPreferences"]
        }
      }
    });

    const textResponse = response.text?.trim() || "{}";
    const resultObj = JSON.parse(textResponse);
    return res.json(resultObj);

  } catch (error: any) {
    console.error("Gemini query failed:", error);
    return res.status(500).json({ 
      error: "Failed to connect to the tactical core.",
      details: error.message 
    });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OISTARIANS SERVER] Active, listening on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to bootstrap server:", err);
});
