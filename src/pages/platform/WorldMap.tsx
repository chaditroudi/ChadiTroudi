import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Lock, CheckCircle2, Star, Sparkles,
  Trophy, Compass, Anchor, Swords, Volume2, VolumeX, Music
} from "lucide-react";

// Island images
import island1 from "@/assets/islands/island-1-village.png";
import island2 from "@/assets/islands/island-2-forest.png";
import island3 from "@/assets/islands/island-3-mountains.png";
import island4 from "@/assets/islands/island-4-valley.png";
import island5 from "@/assets/islands/island-5-harbor.png";
import island6 from "@/assets/islands/island-6-algorithm.png";
import island7 from "@/assets/islands/island-7-project.png";
import island8 from "@/assets/islands/island-8-ai.png";

const ISLAND_IMAGES = [island1, island2, island3, island4, island5, island6, island7, island8];

interface Island {
  id: string;
  name: string;
  description: string;
  icon: string;
  order_index: number;
  color: string;
  unlock_requirement_xp: number;
  unlock_requirement_completion: number;
}

interface IslandProgress {
  island_id: string;
  completion_percentage: number;
  boss_completed: boolean;
  unlocked: boolean;
}

// Zigzag positions for the islands on the scrollable map
const ISLAND_LAYOUT = [
  { x: 20, y: 0, side: "left" },
  { x: 55, y: 1, side: "right" },
  { x: 15, y: 2, side: "left" },
  { x: 60, y: 3, side: "right" },
  { x: 10, y: 4, side: "left" },
  { x: 50, y: 5, side: "right" },
  { x: 25, y: 6, side: "left" },
  { x: 55, y: 7, side: "right" },
];

// Sound engine with ambient ocean music
class SoundEngine {
  private ctx: AudioContext | null = null;
  public muted = false;
  private ambientNodes: { oscs: OscillatorNode[]; gains: GainNode[]; masterGain: GainNode | null } = { oscs: [], gains: [], masterGain: null };
  public ambientPlaying = false;

  private getCtx() {
    if (!this.ctx) this.ctx = new AudioContext();
    return this.ctx;
  }

  play(type: "hover" | "click" | "unlock" | "wave" | "locked") {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      switch (type) {
        case "hover":
          osc.type = "sine"; osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now); osc.stop(now + 0.1); break;
        case "click":
          osc.type = "square"; osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.start(now); osc.stop(now + 0.15); break;
        case "unlock":
          osc.type = "sine"; osc.frequency.setValueAtTime(523, now);
          osc.frequency.setValueAtTime(659, now + 0.1);
          osc.frequency.setValueAtTime(784, now + 0.2);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc.start(now); osc.stop(now + 0.4); break;
        case "wave":
          osc.type = "sine"; osc.frequency.setValueAtTime(180, now);
          osc.frequency.linearRampToValueAtTime(220, now + 0.5);
          gain.gain.setValueAtTime(0.025, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          osc.start(now); osc.stop(now + 0.8); break;
        case "locked":
          osc.type = "sawtooth"; osc.frequency.setValueAtTime(200, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now); osc.stop(now + 0.3); break;
      }
    } catch {}
  }

  startAmbient() {
    if (this.ambientPlaying) return;
    try {
      const ctx = this.getCtx();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2);
      masterGain.connect(ctx.destination);

      const oscs: OscillatorNode[] = [];
      const gains: GainNode[] = [];

      // Deep ocean drone layers
      const freqs = [55, 82.5, 110, 165];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        // Gentle frequency wobble for wave-like feel
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = "sine";
        lfo.frequency.setValueAtTime(0.1 + i * 0.05, ctx.currentTime);
        lfoGain.gain.setValueAtTime(1 + i * 0.5, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        gain.gain.setValueAtTime(0.3 - i * 0.05, ctx.currentTime);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        oscs.push(osc, lfo);
        gains.push(gain, lfoGain);
      });

      // White noise for waves (filtered)
      const bufferSize = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.setValueAtTime(400, ctx.currentTime);
      // Modulate filter for wave swells
      const noiseLfo = ctx.createOscillator();
      const noiseLfoGain = ctx.createGain();
      noiseLfo.type = "sine";
      noiseLfo.frequency.setValueAtTime(0.08, ctx.currentTime);
      noiseLfoGain.gain.setValueAtTime(200, ctx.currentTime);
      noiseLfo.connect(noiseLfoGain);
      noiseLfoGain.connect(noiseFilter.frequency);
      noiseLfo.start();

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5, ctx.currentTime);
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noiseSource.start();

      this.ambientNodes = { oscs: [...oscs, noiseLfo], gains: [...gains, noiseGain, noiseLfoGain], masterGain };
      // Store noiseSource separately for cleanup
      (this.ambientNodes as any).noiseSource = noiseSource;
      this.ambientPlaying = true;
    } catch {}
  }

  stopAmbient() {
    if (!this.ambientPlaying) return;
    try {
      const ctx = this.getCtx();
      if (this.ambientNodes.masterGain) {
        this.ambientNodes.masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      }
      setTimeout(() => {
        this.ambientNodes.oscs.forEach(o => { try { o.stop(); } catch {} });
        try { (this.ambientNodes as any).noiseSource?.stop(); } catch {}
        this.ambientNodes = { oscs: [], gains: [], masterGain: null };
      }, 1200);
      this.ambientPlaying = false;
    } catch {}
  }

  toggleAmbient() {
    if (this.ambientPlaying) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
    return this.ambientPlaying;
  }
}

const WorldMap = () => {
  const { user, loading, requireAuth } = usePlatformAuth();
  const [islands, setIslands] = useState<Island[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, IslandProgress>>({});
  const [totalXp, setTotalXp] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [musicOn, setMusicOn] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const soundRef = useRef(new SoundEngine());
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => { requireAuth(); }, [loading, user]);
  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    const [islandsRes, progressRes, profileRes] = await Promise.all([
      supabase.from("islands").select("*").order("order_index"),
      supabase.from("island_progress").select("*").eq("user_id", user!.id),
      supabase.from("student_profiles").select("total_xp").eq("user_id", user!.id).single(),
    ]);
    if (islandsRes.data) setIslands(islandsRes.data as unknown as Island[]);
    if (profileRes.data) setTotalXp((profileRes.data as any).total_xp || 0);
    if (progressRes.data) {
      const map: Record<string, IslandProgress> = {};
      let completed = 0;
      (progressRes.data as any[]).forEach(p => {
        map[p.island_id] = p;
        if (p.boss_completed) completed++;
      });
      setProgressMap(map);
      setCompletedCount(completed);
    }
  };

  const isIslandUnlocked = (island: Island, idx: number) => {
    if (idx === 0) return true;
    if (totalXp < island.unlock_requirement_xp) return false;
    const prevIsland = islands[idx - 1];
    if (prevIsland) {
      const prevProgress = progressMap[prevIsland.id];
      if (!prevProgress?.boss_completed && island.unlock_requirement_completion > 0) {
        return (prevProgress?.completion_percentage || 0) >= island.unlock_requirement_completion;
      }
    }
    return true;
  };

  const getCurrentIslandIdx = () => {
    for (let i = islands.length - 1; i >= 0; i--) {
      if (isIslandUnlocked(islands[i], i)) {
        const progress = progressMap[islands[i].id];
        if (!progress?.boss_completed) return i;
      }
    }
    return 0;
  };

  const handleIslandClick = (island: Island, idx: number) => {
    const unlocked = isIslandUnlocked(island, idx);
    if (unlocked) {
      soundRef.current.play("click");
      navigate(`/platform/island/${island.id}`);
    } else {
      soundRef.current.play("locked");
    }
  };

  const toggleSound = () => {
    setSoundOn(prev => {
      soundRef.current.muted = prev;
      return !prev;
    });
  };

  const toggleMusic = () => {
    soundRef.current.toggleAmbient();
    setMusicOn(soundRef.current.ambientPlaying);
  };

  // Cleanup ambient on unmount
  useEffect(() => {
    return () => { soundRef.current.stopAmbient(); };
  }, []);

  // Auto-scroll to current island
  useEffect(() => {
    if (islands.length > 0 && mapRef.current) {
      const currentIdx = getCurrentIslandIdx();
      const el = document.getElementById(`island-${currentIdx}`);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 500);
      }
    }
  }, [islands, progressMap]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;

  const currentIdx = getCurrentIslandIdx();
  const overallProgress = islands.length > 0 ? Math.round((completedCount / islands.length) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #0a4d8c 0%, #0e6fb5 20%, #1a90d0 40%, #2ba5d8 60%, #3dbce0 80%, #5ed4e8 100%)" }}>
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/platform/dashboard">
              <Button variant="ghost" size="sm" className="gap-1 text-white/80 hover:text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4" /> Dashboard
              </Button>
            </Link>
            <div className="h-5 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-yellow-300" />
              <span className="font-bold text-white font-display text-lg">🗺️ Adventure Map</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleMusic} className={`text-white/70 hover:text-white hover:bg-white/10 gap-1 text-xs ${musicOn ? "bg-white/10 text-cyan-300" : ""}`}>
              <Music className="w-4 h-4" /> {musicOn ? "🎵" : ""}
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleSound} className="text-white/70 hover:text-white hover:bg-white/10">
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-500/30 gap-1">
              <Trophy className="w-3 h-3" /> {completedCount}/{islands.length}
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-200 border-purple-500/30 gap-1">
              <Star className="w-3 h-3" /> {totalXp.toLocaleString()} XP
            </Badge>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-black/15 backdrop-blur-sm px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span className="text-white/70 text-sm">Journey Progress</span>
          <div className="flex-1 max-w-xs">
            <Progress value={overallProgress} className="h-2 bg-white/10" />
          </div>
          <span className="text-white font-bold text-sm">{overallProgress}%</span>
        </div>
      </div>

      {/* Scrollable map */}
      <div ref={mapRef} className="flex-1 overflow-y-auto overflow-x-hidden relative">
        {/* Animated water effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* Wave layers */}
          {[0, 1, 2, 3, 4].map(i => (
            <motion.div
              key={`wave-${i}`}
              className="absolute w-[200%] h-32"
              style={{
                top: `${20 + i * 18}%`,
                left: "-50%",
                background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${0.02 + i * 0.01}) 25%, transparent 50%, rgba(255,255,255,${0.02 + i * 0.01}) 75%, transparent 100%)`,
                borderRadius: "50%",
              }}
              animate={{ x: [0, 100, 0] }}
              transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}

          {/* Floating bubbles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`bubble-${i}`}
              className="absolute rounded-full border border-white/10 bg-white/5"
              style={{
                width: 4 + Math.random() * 8,
                height: 4 + Math.random() * 8,
                left: `${Math.random() * 100}%`,
                bottom: -10,
              }}
              animate={{ y: [0, -(600 + Math.random() * 400)], opacity: [0.3, 0] }}
              transition={{ duration: 8 + Math.random() * 6, repeat: Infinity, delay: i * 1.2, ease: "easeOut" }}
            />
          ))}

          {/* Fish */}
          {["🐠", "🐟", "🐡", "🦈"].map((fish, i) => (
            <motion.div
              key={`fish-${i}`}
              className="absolute text-2xl opacity-20"
              style={{ top: `${40 + i * 15}%` }}
              animate={{
                x: i % 2 === 0 ? ["-5vw", "105vw"] : ["105vw", "-5vw"],
                y: [0, Math.sin(i) * 20, 0],
              }}
              transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear", delay: i * 3 }}
            >
              {fish}
            </motion.div>
          ))}
        </div>

        {/* Cloud layer (fixed) */}
        <div className="fixed top-16 inset-x-0 pointer-events-none z-10">
          {["☁️", "☁️", "☁️", "⛅"].map((cloud, i) => (
            <motion.div
              key={`cloud-${i}`}
              className="absolute"
              style={{ top: i * 30, fontSize: 28 + i * 8, opacity: 0.25 - i * 0.04 }}
              animate={{ x: ["-10vw", "110vw"] }}
              transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear", delay: i * 7 }}
            >
              {cloud}
            </motion.div>
          ))}
        </div>

        {/* Map content */}
        <div className="relative z-20 pb-24 pt-8">
          {/* Path SVG behind islands */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {islands.slice(0, -1).map((island, i) => {
              const from = ISLAND_LAYOUT[i];
              const to = ISLAND_LAYOUT[i + 1];
              if (!from || !to) return null;
              const completed = progressMap[island.id]?.boss_completed;

              const y1 = from.y * 320 + 160;
              const y2 = to.y * 320 + 160;
              const x1Pct = from.x + 12;
              const x2Pct = to.x + 12;

              return (
                <g key={i}>
                  {/* Dashed or solid path */}
                  <motion.line
                    x1={`${x1Pct}%`} y1={y1}
                    x2={`${x2Pct}%`} y2={y2}
                    stroke={completed ? "rgba(250, 204, 21, 0.6)" : "rgba(255, 255, 255, 0.15)"}
                    strokeWidth={completed ? 4 : 2}
                    strokeDasharray={completed ? "0" : "12 8"}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.2, duration: 0.8 }}
                  />
                  {/* Animated dots on completed paths */}
                  {completed && (
                    <motion.circle
                      r={5}
                      fill="#fbbf24"
                      animate={{
                        cx: [`${x1Pct}%`, `${x2Pct}%`],
                        cy: [y1, y2],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Islands */}
          {islands.map((island, i) => {
            const layout = ISLAND_LAYOUT[i];
            if (!layout) return null;
            const unlocked = isIslandUnlocked(island, i);
            const progress = progressMap[island.id];
            const pct = progress?.completion_percentage || 0;
            const bossComplete = progress?.boss_completed || false;
            const isCurrent = i === currentIdx;
            const isHovered = hoveredIdx === i;
            const imgSrc = ISLAND_IMAGES[i];

            return (
              <motion.div
                id={`island-${i}`}
                key={island.id}
                className="relative"
                style={{
                  marginLeft: `${layout.x}%`,
                  marginTop: i === 0 ? 0 : -30,
                  paddingBottom: 40,
                }}
                initial={{ opacity: 0, y: 40, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.12, type: "spring", stiffness: 120 }}
              >
                {/* Current island indicator */}
                {isCurrent && unlocked && (
                  <motion.div
                    className="absolute -top-6 left-1/2 -translate-x-1/2 z-30"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-yellow-400/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> YOU ARE HERE
                    </div>
                    <div className="w-3 h-3 bg-yellow-400 rotate-45 mx-auto -mt-1.5" />
                  </motion.div>
                )}

                {/* Island card */}
                <motion.div
                  className={`relative cursor-pointer select-none w-56 sm:w-64 mx-auto ${!unlocked ? "cursor-not-allowed" : ""}`}
                  whileHover={unlocked ? { scale: 1.08, y: -8 } : {}}
                  whileTap={unlocked ? { scale: 0.97 } : {}}
                  onHoverStart={() => {
                    setHoveredIdx(i);
                    if (unlocked) soundRef.current.play("hover");
                  }}
                  onHoverEnd={() => setHoveredIdx(null)}
                  onClick={() => handleIslandClick(island, i)}
                >
                  {/* Glow ring for current */}
                  {isCurrent && unlocked && (
                    <motion.div
                      className="absolute inset-0 -m-4 rounded-3xl"
                      style={{ boxShadow: "0 0 40px rgba(250, 204, 21, 0.3), 0 0 80px rgba(250, 204, 21, 0.1)" }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* Island image */}
                  <div className="relative">
                    <motion.img
                      src={imgSrc}
                      alt={island.name}
                      className={`w-full h-auto drop-shadow-2xl transition-all duration-300 ${
                        !unlocked ? "grayscale brightness-50 opacity-60" : "brightness-105"
                      }`}
                      animate={isCurrent ? { y: [0, -4, 0] } : {}}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      draggable={false}
                    />

                    {/* Lock overlay */}
                    {!unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border-2 border-white/10"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Lock className="w-8 h-8 text-white/60" />
                        </motion.div>
                      </div>
                    )}

                    {/* Completed badge */}
                    {bossComplete && (
                      <motion.div
                        className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/40 z-20"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <Trophy className="w-6 h-6 text-white" />
                      </motion.div>
                    )}

                    {/* Boss ready badge */}
                    {unlocked && !bossComplete && Number(pct) >= 80 && (
                      <motion.div
                        className="absolute -top-2 -right-2 z-20"
                        animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/40">
                          <Swords className="w-6 h-6 text-white" />
                        </div>
                      </motion.div>
                    )}

                    {/* Sparkle particles on hover */}
                    <AnimatePresence>
                      {isHovered && unlocked && (
                        <>
                          {[...Array(6)].map((_, si) => (
                            <motion.div
                              key={si}
                              className="absolute text-yellow-300"
                              style={{
                                left: `${20 + Math.random() * 60}%`,
                                top: `${20 + Math.random() * 60}%`,
                                fontSize: 10 + Math.random() * 8,
                              }}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1.2, 0],
                                y: [0, -20 - Math.random() * 20],
                              }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.8, delay: si * 0.1 }}
                            >
                              ✨
                            </motion.div>
                          ))}
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Island info card */}
                  <motion.div
                    className={`relative -mt-4 mx-2 rounded-2xl px-4 py-3 text-center backdrop-blur-xl border shadow-xl z-10 ${
                      bossComplete
                        ? "bg-yellow-500/15 border-yellow-500/30"
                        : unlocked
                        ? "bg-white/10 border-white/20"
                        : "bg-black/20 border-white/5"
                    }`}
                  >
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5"
                      style={{ color: bossComplete ? "#fbbf24" : unlocked ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)" }}
                    >
                      Island {island.order_index}
                    </p>
                    <h3 className={`font-bold font-display text-sm ${unlocked ? "text-white" : "text-white/30"}`}>
                      {island.icon} {island.name}
                    </h3>

                    {unlocked && (
                      <>
                        <div className="mt-2 mx-auto max-w-[80%]">
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{
                                background: bossComplete
                                  ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                                  : "linear-gradient(90deg, #10b981, #06b6d4)",
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                            />
                          </div>
                        </div>
                        <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                          {Math.round(Number(pct))}% complete
                        </p>
                        {bossComplete && (
                          <p className="text-[10px] font-bold text-yellow-300 mt-0.5">🏆 Mastered!</p>
                        )}
                        {!bossComplete && Number(pct) >= 80 && (
                          <p className="text-[10px] font-bold text-orange-300 mt-0.5 animate-pulse">⚔️ Boss Ready!</p>
                        )}
                      </>
                    )}

                    {!unlocked && (
                      <p className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                        Complete previous island
                      </p>
                    )}
                  </motion.div>
                </motion.div>

                {/* Sailing ship between current and next */}
                {isCurrent && unlocked && i < islands.length - 1 && (
                  <motion.div
                    className="absolute text-3xl z-30"
                    style={{ left: "55%", bottom: -20 }}
                    animate={{
                      y: [0, -8, 0],
                      x: [0, 5, 0],
                      rotate: [0, 3, -3, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ⛵
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {/* Treasure at the end */}
          {islands.length > 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.div
                className="text-5xl"
                animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👑
              </motion.div>
              <p className="text-white/40 text-sm mt-2 font-display">Coding Master Awaits</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom legend */}
      <div className="bg-black/20 backdrop-blur-xl border-t border-white/10 px-4 py-3 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4 text-xs text-white/50">
          <span className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" /> Current
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-yellow-400" /> Completed
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-white/30" /> Locked
          </span>
          <span className="flex items-center gap-1.5">
            <Swords className="w-3 h-3 text-orange-400" /> Boss Ready
          </span>
          <span className="flex items-center gap-1.5">
            <Anchor className="w-3 h-3" /> {islands.length} Islands
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
