import { Product } from "./types";

export const PRODUCTS_CATALOG: Record<string, Product[]> = {
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
