import { useState } from "react";
import { Shield, Swords, Users, Star, Compass, Award, Trophy, Info, Flame, AlertCircle } from "lucide-react";

interface Unit {
  name: string;
  class: string;
  faction: string;
  hp: number;
  attack: number;
  speed: number;
  armor: number;
  cost: number;
  perk: string;
  unlocked: boolean;
}

export default function Tabletop() {
  // Game state
  const [etherCrystals, setEtherCrystals] = useState(12000);
  const [commanderSkillPoints, setCommanderSkillPoints] = useState(3);
  const [activeFactionFilter, setActiveFactionFilter] = useState("all");
  
  // Battle Calculator State
  const [attackerElevation, setAttackerElevation] = useState(2); // meters
  const [defenderElevation, setDefenderElevation] = useState(0);
  const [isFlankingAttack, setIsFlankingAttack] = useState(true);
  const [baseDamage, setBaseDamage] = useState(150);
  const [activeTerrain, setActiveTerrain] = useState("desert");

  // Custom Commander skills state
  const [unlockedSkills, setUnlockedSkills] = useState({
    tacticalInsight: true,
    rallyingCry: false,
    precisionStrike: false,
    arcaneOverride: false
  });

  // Faction Roster matching user instructions
  const [roster, setRoster] = useState<Unit[]>([
    {
      name: "Oistarian Phalanx",
      class: "Frontline",
      faction: "Oistarian Dominion",
      hp: 190,
      attack: 30,
      speed: 12,
      armor: 45,
      cost: 1500,
      perk: "Shock Flank resistance - immune to frontal stun.",
      unlocked: true
    },
    {
      name: "Concord Ranger",
      class: "Ranged",
      faction: "Free Concord",
      hp: 110,
      attack: 45,
      speed: 24,
      armor: 15,
      cost: 1200,
      perk: "Precision Arrow - elevation damage multiplier x1.5.",
      unlocked: true
    },
    {
      name: "Saboteur",
      class: "Specialist",
      faction: "Arcanum Circle",
      hp: 95,
      attack: 55,
      speed: 35,
      armor: 8,
      cost: 1800,
      perk: "Smoke Discharges - initiates active Fog of War.",
      unlocked: false
    },
    {
      name: "Ironbound Crusher",
      class: "Frontline",
      faction: "Ironbound Clans",
      hp: 220,
      attack: 40,
      speed: 8,
      armor: 55,
      cost: 2500,
      perk: "Siege Breaker - deals x2 damage to mechanical frames.",
      unlocked: false
    },
    {
      name: "Titan-Forged Golem",
      class: "Elite",
      faction: "Oistarian Dominion",
      hp: 450,
      attack: 85,
      speed: 10,
      armor: 80,
      cost: 6500,
      perk: "Cataclysm Ward - morale system immunity.",
      unlocked: false
    }
  ]);

  // Commander skills definition
  const skills = [
    {
      id: "tacticalInsight",
      name: "Tactical Insight",
      desc: "Reveal hidden enemy units. Removes active Fog of War from coordinates.",
      cost: 1,
      tag: "Passive"
    },
    {
      id: "rallyingCry",
      name: "Rallying Cry",
      desc: "Boost morale of all allies (+25 max morale limit & clears stun fatigue).",
      cost: 2,
      tag: "Buff Active"
    },
    {
      id: "precisionStrike",
      name: "Precision Strike",
      desc: "Target a key enemy unit. Increases Flanking modifier damage to +35%.",
      cost: 2,
      tag: "Combat Core"
    },
    {
      id: "arcaneOverride",
      name: "Arcane Override",
      desc: "Disable enemy war machines and golem armor structures for 1 combat turn.",
      cost: 3,
      tag: "Tactical Sabotage"
    }
  ];

  // Campaign Nodes matching instructions ACT I, II, III
  const campaignSectors = [
    { id: "s1", name: "Act I — Embers of Return", desc: "Skirmishes with Oistarian scouts and discovery of ancient war-vaults", progress: "100%", status: "Secured" },
    { id: "s2", name: "Act II — Dominion Rising", desc: "Deployment of heavy ether war engines. Split clans and coordinate sieges", progress: "40%", status: "Contested" },
    { id: "s3", name: "Act III — The Strategos", desc: "Final assault on the massive Oistarian Citadel stronghold.", progress: "0%", status: "Locked" }
  ];

  // Logic: Calculate Flanking, Elevation, Terrains
  const calculateBattleModifiers = () => {
    let multiplier = 1.0;
    
    // Flanking Bonus: +20% damage
    if (isFlankingAttack) multiplier += 0.20;
    
    // Elevation Advantage: Attacker high ground vs defender -> +10% accuracy/damage potential
    if (attackerElevation > defenderElevation) {
      multiplier += 0.10;
    }

    // Terrain modifier
    if (activeTerrain === "desert") multiplier -= 0.05; // sandstorm friction
    if (activeTerrain === "cliffs") multiplier += 0.15; // rocky elevations

    const totalModifiedDamage = Math.round(baseDamage * multiplier);
    const bonusPct = Math.round((multiplier - 1.0) * 100);

    return { totalModifiedDamage, bonusPct };
  };

  const { totalModifiedDamage, bonusPct } = calculateBattleModifiers();

  // Logic: Recruit / Unlock unit
  const handleRecruitUnit = (unitName: string, cost: number) => {
    if (etherCrystals < cost) {
      alert("Insufficient Ether Crystals! Secure more territories first.");
      return;
    }
    setEtherCrystals(prev => prev - cost);
    setRoster(prev => prev.map(u => {
      if (u.name === unitName) {
        return { ...u, unlocked: true };
      }
      return u;
    }));
  };

  // Logic: Learn skill
  const handleLearnSkill = (skillId: string, cost: number) => {
    if (commanderSkillPoints < cost) return;
    setCommanderSkillPoints(prev => prev - cost);
    setUnlockedSkills(prev => ({
      ...prev,
      [skillId]: true
    }));
  };

  const filteredRoster = roster.filter(u => {
    if (activeFactionFilter === "all") return true;
    return u.faction.toLowerCase().includes(activeFactionFilter);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT & CENTER PANEL: Maps, Campaigns and Recruitment (Span 2) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Header summary of crystals and skills */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[9px] uppercase font-mono text-slate-500">Oistarian Currency Vault</span>
              <div className="text-xl font-display font-medium text-brand-mint flex items-center gap-1.5 mt-0.5">
                ⚡ {etherCrystals.toLocaleString()} <span className="text-xs text-slate-400 font-sans">Ether Crystals</span>
              </div>
            </div>
            <div className="border-l border-slate-800 pl-6">
              <span className="text-[9px] uppercase font-mono text-slate-500">Commander Ability Pool</span>
              <div className="text-xl font-display font-medium text-brand-blue flex items-center gap-1.5 mt-0.5">
                🔮 {commanderSkillPoints} <span className="text-xs text-slate-400 font-sans">Skill Points Available</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-md">
            AMSTERDAM DOMINION CONTROLLER
          </span>
        </div>

        {/* Tactical Battle Interactive Calculator */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-brand-mint/5 blur-2xl rounded-full" />
          <h3 className="text-sm font-display font-medium text-slate-100 flex items-center gap-2 mb-4 border-b border-slate-800/80 pb-3">
            <Swords size={16} className="text-brand-mint" />
            Combat Parameter Calculator (Flanking & Elevation)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
            {/* Input Parameters panel */}
            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-850">
              
              {/* Flanking switch */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-200 block">Flanking Maneuver</span>
                  <span className="text-[10px] text-slate-500">Grants a hard +20% damage bonus</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFlankingAttack(!isFlankingAttack)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all font-semibold ${
                    isFlankingAttack 
                      ? "bg-brand-mint/20 text-brand-mint border-brand-mint/40" 
                      : "bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300"
                  }`}
                >
                  {isFlankingAttack ? "Active Flank" : "Front Frontal"}
                </button>
              </div>

              {/* Elevations */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1">Elevation Levels</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400">Attacker (meters)</label>
                    <input 
                      type="number"
                      value={attackerElevation}
                      onChange={(e) => setAttackerElevation(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-brand-mint font-mono focus:border-brand-mint focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Defender (meters)</label>
                    <input 
                      type="number"
                      value={defenderElevation}
                      onChange={(e) => setDefenderElevation(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-slate-300 font-mono focus:border-brand-mint focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Base Damage */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Base Attack Value</span>
                  <input
                    type="number"
                    value={baseDamage}
                    onChange={(e) => setBaseDamage(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Battle Terrain</span>
                  <select
                    value={activeTerrain}
                    onChange={(e) => setActiveTerrain(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-slate-300"
                  >
                    <option value="desert">Oistarian Desert (-5% sandstorm)</option>
                    <option value="cliffs">Rocky Summit Cliffs (+15% high-ground)</option>
                    <option value="vault">Steel Vaults (Flat terrain, 0%)</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Calculations Result */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-5 rounded-xl border border-slate-800/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Tactical Evaluation Output</span>
                
                {/* Result Block */}
                <div className="mt-3 flex items-baseline gap-2">
                  <div className="text-4xl font-display font-medium text-slate-100 tracking-tight">
                    {totalModifiedDamage}
                  </div>
                  <span className="text-xs text-slate-400 uppercase font-mono">Dmg Payload</span>
                </div>

                <div className="mt-2 text-xs flex items-center gap-1.5 text-brand-mint">
                  <Flame size={14} />
                  Damage Modifier Boost: <span className="font-bold">+{bonusPct}% multiplier</span>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-800/80 pt-3 text-[11px] text-slate-400 space-y-1 leading-relaxed">
                <div className="flex justify-between">
                  <span>Elevation Margin:</span>
                  <span className="font-mono text-slate-200">
                    {attackerElevation > defenderElevation ? `+${attackerElevation - defenderElevation}m High Ground` : "Flat Terrain"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Flanking Damage Bonus:</span>
                  <span className="font-mono text-brand-mint">{isFlankingAttack ? "+20% added" : "0% (front tackle)"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Faction Roster & Unit Recruitment */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-display font-medium text-slate-100 flex items-center gap-2">
              <Users size={16} className="text-brand-blue" />
              Oistarian Legion Garrison
            </h3>
            
            {/* Roster Filters */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
              {["all", "dominion", "concord", "circle"].map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFactionFilter(f)}
                  className={`text-[10px] px-2.5 py-1 rounded font-mono uppercase ${
                    activeFactionFilter === f 
                      ? "bg-brand-blue text-white shadow" 
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Unit Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRoster.map(u => (
              <div 
                key={u.name}
                className={`bg-slate-950 border rounded-xl p-4 flex flex-col justify-between transition-colors ${
                  u.unlocked ? "border-slate-800/85 hover:border-slate-700" : "border-slate-850/60 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-display font-medium text-slate-100">{u.name}</h4>
                      <p className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">{u.faction} • {u.class}</p>
                    </div>
                    {u.unlocked ? (
                      <span className="text-[9px] uppercase font-mono text-brand-mint bg-brand-mint/10 border border-brand-mint/20 px-2 py-0.5 rounded">
                        Deployed
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                        Locked
                      </span>
                    )}
                  </div>

                  <p className="text-slate-400 text-xs mt-2 italic leading-relaxed">
                    "{u.perk}"
                  </p>

                  {/* Stat Meters */}
                  <div className="grid grid-cols-4 gap-2 mt-3.5 bg-slate-900/50 p-2 rounded-lg border border-slate-850">
                    <div className="text-center">
                      <span className="text-[9px] text-slate-500 block uppercase">hp</span>
                      <strong className="text-xs text-slate-300 font-mono">{u.hp}</strong>
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] text-slate-500 block uppercase">atk</span>
                      <strong className="text-xs text-slate-300 font-mono">{u.attack}</strong>
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] text-slate-500 block uppercase">spd</span>
                      <strong className="text-xs text-slate-300 font-mono">{u.speed}</strong>
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] text-slate-500 block uppercase">def</span>
                      <strong className="text-xs text-slate-300 font-mono">{u.armor}</strong>
                    </div>
                  </div>
                </div>

                {/* Lock recruiting state */}
                {!u.unlocked && (
                  <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-brand-mint">
                      ⚡ {u.cost.toLocaleString()} Crystals
                    </span>
                    <button
                      onClick={() => handleRecruitUnit(u.name, u.cost)}
                      className="text-[10px] bg-brand-mint text-slate-950 font-bold px-3 py-1.5 rounded-lg hover:bg-white transition-colors uppercase tracking-wider"
                    >
                      Commence Recruitment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT PANEL: Campaign Acts & Commander Skill Tree (Span 1) */}
      <div className="space-y-6">
        
        {/* Campaign Sectors Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-display font-medium text-slate-100 flex items-center gap-2 mb-4">
            <Compass size={16} className="text-brand-blue" />
            Campaign Terrains & Acts
          </h3>

          <div className="space-y-3">
            {campaignSectors.map(s => (
              <div key={s.id} className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-display font-semibold text-slate-100">{s.name}</h4>
                  <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                    s.status === "Secured" ? "bg-brand-mint/10 text-brand-mint border border-brand-mint/20" :
                    s.status === "Contested" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                    "bg-slate-900 text-slate-500 border border-slate-800"
                  }`}>
                    {s.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 lines-clamp-2 leading-relaxed">{s.desc}</p>
                
                {/* Horizontal Progress Bar */}
                <div className="mt-3.5 flex items-center gap-2">
                  <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-brand-blue h-full" style={{ width: s.progress }} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{s.progress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commander Skill Tree */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-display font-medium text-slate-100 flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <Award size={16} className="text-brand-mint" />
            Commander Strategos Skills
          </h3>

          <div className="space-y-4">
            {skills.map(s => {
              const isUnlocked = unlockedSkills[s.id as keyof typeof unlockedSkills];
              return (
                <div 
                  key={s.id}
                  className={`border rounded-xl p-3.5 flex flex-col justify-between transition-colors ${
                    isUnlocked 
                      ? "bg-slate-950 border-slate-700/80" 
                      : "bg-slate-950/40 border-slate-850/60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`text-xs font-display font-semibold ${isUnlocked ? "text-brand-mint" : "text-slate-400"}`}>
                        {s.name}
                      </h4>
                      <span className="text-[8px] font-mono tracking-wider text-slate-500 uppercase">{s.tag}</span>
                    </div>
                    {isUnlocked ? (
                      <span className="text-[8px] font-mono uppercase bg-slate-900 text-brand-mint px-2 py-0.5 rounded border border-brand-mint/10">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[8px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                        LOCKED
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    {s.desc}
                  </p>

                  {!isUnlocked && (
                    <div className="mt-3.5 pt-2 border-t border-slate-900 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">
                        Requires: {s.cost} Skill Pts
                      </span>
                      <button
                        onClick={() => handleLearnSkill(s.id, s.cost)}
                        disabled={commanderSkillPoints < s.cost}
                        className="text-[9px] bg-slate-100 hover:bg-brand-blue hover:text-white text-slate-950 disabled:opacity-45 disabled:hover:bg-slate-100 disabled:hover:text-slate-950 px-2 py-1.5 rounded-lg transition-colors font-bold uppercase tracking-wider"
                      >
                        Learn Ability
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
