import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  ArrowLeft, Lock, CheckCircle2, Star, Sparkles,
  Trophy, Compass, Anchor, Swords, Volume2, VolumeX
} from "lucide-react";

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

// ─── Sound Engine ──────────────────────────────────────────
class SoundEngine {
  private ctx: AudioContext | null = null;
  public muted = false;

  private getCtx() {
    if (!this.ctx) this.ctx = new AudioContext();
    return this.ctx;
  }

  play(type: "hover" | "click" | "unlock" | "wave" | "sail" | "boss") {
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
          osc.type = "sine";
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        case "click":
          osc.type = "square";
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
          osc.frequency.exponentialRampToValueAtTime(660, now + 0.1);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        case "unlock":
          osc.type = "sine";
          osc.frequency.setValueAtTime(523, now);
          osc.frequency.setValueAtTime(659, now + 0.1);
          osc.frequency.setValueAtTime(784, now + 0.2);
          osc.frequency.setValueAtTime(1047, now + 0.3);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);
          break;
        case "wave":
          osc.type = "sine";
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.linearRampToValueAtTime(220, now + 0.5);
          osc.frequency.linearRampToValueAtTime(160, now + 1);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.linearRampToValueAtTime(0.05, now + 0.5);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          osc.start(now);
          osc.stop(now + 1.2);
          break;
        case "sail":
          osc.type = "triangle";
          osc.frequency.setValueAtTime(330, now);
          osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
          osc.frequency.exponentialRampToValueAtTime(550, now + 0.3);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
          break;
        case "boss":
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);
          break;
      }
    } catch {}
  }
}

// ─── Canvas Particle ──────────────────────────────────────
interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number;
  color: string; type: "bubble" | "sparkle" | "leaf";
}

// ─── Cloud ────────────────────────────────────────────────
interface Cloud {
  x: number; y: number; speed: number; width: number; opacity: number;
}

// ─── Fish ─────────────────────────────────────────────────
interface Fish {
  x: number; y: number; speed: number; size: number; color: string; dir: number; wiggle: number;
}

// ─── Wave ─────────────────────────────────────────────────
interface WaveLine {
  y: number; amplitude: number; frequency: number; speed: number; opacity: number;
}

// ─── Ship ─────────────────────────────────────────────────
interface Ship {
  x: number; y: number; targetX: number; targetY: number; angle: number;
}

// ─── Island Positions (normalized 0-1) ────────────────────
const ISLAND_NORM = [
  { x: 0.15, y: 0.82 },
  { x: 0.38, y: 0.70 },
  { x: 0.18, y: 0.55 },
  { x: 0.50, y: 0.45 },
  { x: 0.22, y: 0.33 },
  { x: 0.55, y: 0.22 },
  { x: 0.72, y: 0.14 },
  { x: 0.85, y: 0.07 },
];

const ISLAND_COLORS: Record<string, string> = {
  emerald: "#10b981", green: "#22c55e", amber: "#f59e0b", blue: "#3b82f6",
  purple: "#a855f7", orange: "#f97316", cyan: "#06b6d4", pink: "#ec4899",
  primary: "#10b981",
};

const WorldMap = () => {
  const { user, loading, requireAuth } = usePlatformAuth();
  const [islands, setIslands] = useState<Island[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, IslandProgress>>({});
  const [totalXp, setTotalXp] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [hoveredIsland, setHoveredIsland] = useState<number | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const soundRef = useRef(new SoundEngine());
  const navigate = useNavigate();

  // Mutable refs for animation state
  const cloudsRef = useRef<Cloud[]>([]);
  const fishRef = useRef<Fish[]>([]);
  const wavesRef = useRef<WaveLine[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const shipRef = useRef<Ship>({ x: 0, y: 0, targetX: 0, targetY: 0, angle: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const lastWaveSound = useRef(0);
  const islandRectsRef = useRef<{ x: number; y: number; r: number; idx: number }[]>([]);

  useEffect(() => { requireAuth(); }, [loading, user]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

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
    setDataLoaded(true);
  };

  const isIslandUnlocked = useCallback((island: Island, idx: number, islandsArr: Island[], pMap: Record<string, IslandProgress>, xp: number) => {
    if (idx === 0) return true;
    if (xp < island.unlock_requirement_xp) return false;
    const prevIsland = islandsArr[idx - 1];
    if (prevIsland) {
      const prevProgress = pMap[prevIsland.id];
      if (!prevProgress?.boss_completed && island.unlock_requirement_completion > 0) {
        return (prevProgress?.completion_percentage || 0) >= island.unlock_requirement_completion;
      }
    }
    return true;
  }, []);

  const getCurrentIslandIdx = useCallback((islandsArr: Island[], pMap: Record<string, IslandProgress>, xp: number) => {
    for (let i = islandsArr.length - 1; i >= 0; i--) {
      if (isIslandUnlocked(islandsArr[i], i, islandsArr, pMap, xp)) {
        const progress = pMap[islandsArr[i].id];
        if (!progress?.boss_completed) return i;
      }
    }
    return 0;
  }, [isIslandUnlocked]);

  // ─── Initialize canvas entities ─────────────────────────
  const initEntities = useCallback((w: number, h: number) => {
    // Clouds
    cloudsRef.current = Array.from({ length: 6 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.3,
      speed: 0.15 + Math.random() * 0.3,
      width: 60 + Math.random() * 100,
      opacity: 0.15 + Math.random() * 0.2,
    }));

    // Fish
    fishRef.current = Array.from({ length: 10 }, () => ({
      x: Math.random() * w,
      y: h * 0.5 + Math.random() * h * 0.45,
      speed: 0.3 + Math.random() * 0.8,
      size: 6 + Math.random() * 10,
      color: ["#f97316", "#06b6d4", "#eab308", "#ec4899", "#8b5cf6"][Math.floor(Math.random() * 5)],
      dir: Math.random() > 0.5 ? 1 : -1,
      wiggle: Math.random() * Math.PI * 2,
    }));

    // Waves
    wavesRef.current = Array.from({ length: 5 }, (_, i) => ({
      y: h * 0.3 + i * (h * 0.14),
      amplitude: 8 + Math.random() * 12,
      frequency: 0.008 + Math.random() * 0.005,
      speed: 0.3 + Math.random() * 0.5,
      opacity: 0.04 + Math.random() * 0.06,
    }));
  }, []);

  // ─── Draw functions ─────────────────────────────────────
  const drawWater = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    // Deep ocean gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#0c1929");
    grad.addColorStop(0.3, "#0f2942");
    grad.addColorStop(0.6, "#0d3b5e");
    grad.addColorStop(1, "#0a2f4a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Animated wave lines
    wavesRef.current.forEach(wave => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(56, 189, 248, ${wave.opacity})`;
      ctx.lineWidth = 1.5;
      for (let x = 0; x < w; x += 3) {
        const y = wave.y + Math.sin(x * wave.frequency + t * wave.speed) * wave.amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    // Sparkle on water
    for (let i = 0; i < 15; i++) {
      const sx = ((i * 137 + t * 20) % w);
      const sy = ((i * 211 + t * 5) % h);
      const sparkleAlpha = 0.1 + Math.sin(t * 2 + i) * 0.08;
      ctx.beginPath();
      ctx.fillStyle = `rgba(147, 197, 253, ${sparkleAlpha})`;
      ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawCloud = (ctx: CanvasRenderingContext2D, cloud: Cloud) => {
    ctx.fillStyle = `rgba(200, 220, 240, ${cloud.opacity})`;
    const cx = cloud.x, cy = cloud.y, w = cloud.width;
    ctx.beginPath();
    ctx.ellipse(cx, cy, w * 0.4, w * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx - w * 0.15, cy - w * 0.05, w * 0.25, w * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + w * 0.18, cy - w * 0.03, w * 0.22, w * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawFish = (ctx: CanvasRenderingContext2D, fish: Fish, t: number) => {
    const wY = Math.sin(t * 3 + fish.wiggle) * 4;
    ctx.save();
    ctx.translate(fish.x, fish.y + wY);
    ctx.scale(fish.dir, 1);
    ctx.fillStyle = fish.color;
    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, fish.size, fish.size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tail
    ctx.beginPath();
    ctx.moveTo(-fish.size, 0);
    ctx.lineTo(-fish.size - fish.size * 0.6, -fish.size * 0.4);
    ctx.lineTo(-fish.size - fish.size * 0.6, fish.size * 0.4);
    ctx.closePath();
    ctx.fill();
    // Eye
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(fish.size * 0.4, -fish.size * 0.1, fish.size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawIslandShape = (
    ctx: CanvasRenderingContext2D,
    cx: number, cy: number, r: number,
    color: string, unlocked: boolean, isCurrent: boolean,
    bossComplete: boolean, pct: number, t: number
  ) => {
    // Island base - green land mass
    const landGrad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
    if (!unlocked) {
      landGrad.addColorStop(0, "rgba(60, 60, 70, 0.6)");
      landGrad.addColorStop(1, "rgba(40, 40, 50, 0.3)");
    } else {
      landGrad.addColorStop(0, color + "cc");
      landGrad.addColorStop(0.7, color + "88");
      landGrad.addColorStop(1, color + "22");
    }

    // Organic island shape
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 2; a += 0.1) {
      const wobble = 1 + Math.sin(a * 3 + t * 0.5) * 0.08 + Math.cos(a * 5) * 0.05;
      const px = cx + Math.cos(a) * r * wobble;
      const py = cy + Math.sin(a) * r * wobble * 0.7;
      if (a === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = landGrad;
    ctx.fill();

    // Beach ring
    if (unlocked) {
      ctx.strokeStyle = "#fbbf24" + "44";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Sand/shore
    if (unlocked) {
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += 0.1) {
        const wobble = 1 + Math.sin(a * 3 + t * 0.5) * 0.08 + Math.cos(a * 5) * 0.05;
        const px = cx + Math.cos(a) * (r + 4) * wobble;
        const py = cy + Math.sin(a) * (r + 4) * wobble * 0.7;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(251, 191, 36, 0.15)";
      ctx.lineWidth = 6;
      ctx.stroke();
    }

    // Palm tree
    if (unlocked) {
      const treeX = cx - r * 0.2;
      const treeY = cy - r * 0.15;
      // Trunk
      ctx.strokeStyle = "#92400e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(treeX, treeY + r * 0.3);
      ctx.quadraticCurveTo(treeX - 3, treeY + r * 0.1, treeX + 2, treeY - r * 0.2);
      ctx.stroke();
      // Leaves
      const leafColor = bossComplete ? "#059669" : "#22c55e";
      for (let i = 0; i < 5; i++) {
        const angle = -Math.PI / 2 + (i - 2) * 0.5 + Math.sin(t * 1.5 + i) * 0.05;
        ctx.strokeStyle = leafColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(treeX + 2, treeY - r * 0.2);
        ctx.quadraticCurveTo(
          treeX + 2 + Math.cos(angle) * r * 0.25,
          treeY - r * 0.2 + Math.sin(angle) * r * 0.25 - 5,
          treeX + 2 + Math.cos(angle) * r * 0.45,
          treeY - r * 0.2 + Math.sin(angle) * r * 0.35
        );
        ctx.stroke();
      }
    }

    // Glow for current island
    if (isCurrent && unlocked) {
      const glowAlpha = 0.15 + Math.sin(t * 2) * 0.1;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 15 + Math.sin(t * 2) * 5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(16, 185, 129, ${glowAlpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Progress ring
    if (unlocked && pct > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, r + 8, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * pct / 100), false);
      ctx.strokeStyle = bossComplete ? "#10b981" : color;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.lineCap = "butt";
    }

    // Lock icon
    if (!unlocked) {
      ctx.fillStyle = "rgba(200, 200, 210, 0.5)";
      ctx.font = `${r * 0.5}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🔒", cx, cy);
    }

    // Boss complete flag
    if (bossComplete) {
      ctx.font = `${r * 0.4}px serif`;
      ctx.textAlign = "center";
      ctx.fillText("🏆", cx + r * 0.5, cy - r * 0.5);
    }
  };

  const drawPath = (
    ctx: CanvasRenderingContext2D,
    x1: number, y1: number, x2: number, y2: number,
    completed: boolean, t: number
  ) => {
    const midX = (x1 + x2) / 2 + (x1 < x2 ? 40 : -40);
    const midY = (y1 + y2) / 2;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(midX, midY, x2, y2);

    if (completed) {
      ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
    } else {
      ctx.strokeStyle = "rgba(100, 140, 180, 0.25)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Animated dots along path
    if (completed) {
      for (let i = 0; i < 3; i++) {
        const prog = ((t * 0.3 + i * 0.33) % 1);
        const tt = prog;
        const px = (1 - tt) * (1 - tt) * x1 + 2 * (1 - tt) * tt * midX + tt * tt * x2;
        const py = (1 - tt) * (1 - tt) * y1 + 2 * (1 - tt) * tt * midY + tt * tt * y2;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${0.6 - prog * 0.4})`;
        ctx.fill();
      }
    }
  };

  const drawShip = (ctx: CanvasRenderingContext2D, ship: Ship, t: number) => {
    ctx.save();
    ctx.translate(ship.x, ship.y + Math.sin(t * 2) * 3);
    ctx.rotate(Math.sin(t * 1.5) * 0.05);
    ctx.font = "28px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("⛵", 0, 0);
    // Wake trail
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(-i * 8, i * 3, 2 + i, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(147, 197, 253, ${0.15 - i * 0.03})`;
      ctx.fill();
    }
    ctx.restore();
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    particlesRef.current.forEach(p => {
      const alpha = (1 - p.life / p.maxLife);
      if (p.type === "sparkle") {
        ctx.fillStyle = `rgba(250, 204, 21, ${alpha * 0.8})`;
        ctx.beginPath();
        // 4-point star
        const s = p.size * alpha;
        ctx.moveTo(p.x, p.y - s);
        ctx.lineTo(p.x + s * 0.3, p.y - s * 0.3);
        ctx.lineTo(p.x + s, p.y);
        ctx.lineTo(p.x + s * 0.3, p.y + s * 0.3);
        ctx.lineTo(p.x, p.y + s);
        ctx.lineTo(p.x - s * 0.3, p.y + s * 0.3);
        ctx.lineTo(p.x - s, p.y);
        ctx.lineTo(p.x - s * 0.3, p.y - s * 0.3);
        ctx.closePath();
        ctx.fill();
      } else if (p.type === "bubble") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(147, 197, 253, ${alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(34, 197, 94, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  const spawnParticles = (x: number, y: number, type: "sparkle" | "bubble" | "leaf", count: number) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3 - 1,
        life: 0, maxLife: 40 + Math.random() * 30,
        size: 3 + Math.random() * 5,
        color: "", type,
      });
    }
  };

  // ─── Main animation loop ───────────────────────────────
  useEffect(() => {
    if (!dataLoaded || islands.length === 0) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      initEntities(rect.width, rect.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const currentIdx = getCurrentIslandIdx(islands, progressMap, totalXp);
    const w = container.getBoundingClientRect().width;
    const h = container.getBoundingClientRect().height;

    // Set ship to current island
    const sp = ISLAND_NORM[currentIdx];
    if (sp) {
      shipRef.current = { x: sp.x * w + 40, y: sp.y * h, targetX: sp.x * w + 40, targetY: sp.y * h, angle: 0 };
    }

    // Build island hit rects
    const r = Math.min(w, h) * 0.055;
    islandRectsRef.current = islands.map((_, i) => {
      const pos = ISLAND_NORM[i];
      return pos ? { x: pos.x * w, y: pos.y * h, r: r + 10, idx: i } : { x: 0, y: 0, r: 0, idx: i };
    });

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let prevHover = -1;

    const loop = () => {
      const cw = container.getBoundingClientRect().width;
      const ch = container.getBoundingClientRect().height;
      timeRef.current += 0.016;
      const t = timeRef.current;

      ctx.clearRect(0, 0, cw, ch);

      // Water
      drawWater(ctx, cw, ch, t);

      // Clouds
      cloudsRef.current.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > cw + cloud.width) cloud.x = -cloud.width;
        drawCloud(ctx, cloud);
      });

      // Paths between islands
      islands.slice(0, -1).forEach((island, i) => {
        const from = ISLAND_NORM[i];
        const to = ISLAND_NORM[i + 1];
        if (!from || !to) return;
        const completed = progressMap[island.id]?.boss_completed || false;
        drawPath(ctx, from.x * cw, from.y * ch, to.x * cw, to.y * ch, completed, t);
      });

      // Fish
      fishRef.current.forEach(fish => {
        fish.x += fish.speed * fish.dir;
        if (fish.x > cw + 20) { fish.x = -20; fish.dir = 1; }
        if (fish.x < -20) { fish.x = cw + 20; fish.dir = -1; }
        drawFish(ctx, fish, t);
      });

      // Islands
      const islandR = Math.min(cw, ch) * 0.055;
      islands.forEach((island, i) => {
        const pos = ISLAND_NORM[i];
        if (!pos) return;
        const cx = pos.x * cw;
        const cy = pos.y * ch;
        const unlocked = isIslandUnlocked(island, i, islands, progressMap, totalXp);
        const isCurrent = i === currentIdx;
        const bossComplete = progressMap[island.id]?.boss_completed || false;
        const pct = progressMap[island.id]?.completion_percentage || 0;
        const col = ISLAND_COLORS[island.color] || ISLAND_COLORS.primary;

        // Hover scale
        const isHovered = hoveredIsland === i;
        const scale = isHovered && unlocked ? 1.12 : 1;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        ctx.translate(-cx, -cy);

        drawIslandShape(ctx, cx, cy, islandR, col, unlocked, isCurrent, bossComplete, pct, t);

        // Label below island
        if (unlocked) {
          ctx.fillStyle = "#e2e8f0";
          ctx.font = "bold 11px 'Space Grotesk', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(island.name, cx, cy + islandR + 20);

          // Pct
          ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
          ctx.font = "9px 'Space Grotesk', sans-serif";
          ctx.fillText(`${Math.round(pct)}%`, cx, cy + islandR + 32);
        }

        // Icon
        if (unlocked) {
          ctx.font = `${islandR * 0.55}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(island.icon, cx + islandR * 0.25, cy + islandR * 0.1);
        }

        ctx.restore();
      });

      // Ship
      const ship = shipRef.current;
      ship.x += (ship.targetX - ship.x) * 0.02;
      ship.y += (ship.targetY - ship.y) * 0.02;
      drawShip(ctx, ship, t);

      // Particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.02;
        p.life++;
        return p.life < p.maxLife;
      });
      drawParticles(ctx);

      // Periodic wave sound
      if (t - lastWaveSound.current > 12) {
        soundRef.current.play("wave");
        lastWaveSound.current = t;
      }

      // Periodic bubbles
      if (Math.random() < 0.02) {
        spawnParticles(Math.random() * cw, ch - 20, "bubble", 2);
      }

      // Check hover
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      let foundHover = -1;
      islandRectsRef.current.forEach(ir => {
        const dx = mx - ir.x;
        const dy = my - ir.y;
        if (Math.sqrt(dx * dx + dy * dy) < ir.r) {
          foundHover = ir.idx;
        }
      });
      if (foundHover !== prevHover) {
        if (foundHover >= 0) {
          soundRef.current.play("hover");
          spawnParticles(
            ISLAND_NORM[foundHover]!.x * cw,
            ISLAND_NORM[foundHover]!.y * ch,
            "sparkle", 5
          );
        }
        prevHover = foundHover;
        setHoveredIsland(foundHover >= 0 ? foundHover : null);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [dataLoaded, islands, progressMap, totalXp, hoveredIsland, isIslandUnlocked, getCurrentIslandIdx, initEntities]);

  // ─── Mouse handlers ─────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    islandRectsRef.current.forEach(ir => {
      const dx = mx - ir.x;
      const dy = my - ir.y;
      if (Math.sqrt(dx * dx + dy * dy) < ir.r) {
        const island = islands[ir.idx];
        if (!island) return;
        const unlocked = isIslandUnlocked(island, ir.idx, islands, progressMap, totalXp);
        if (unlocked) {
          soundRef.current.play("click");
          spawnParticles(ir.x, ir.y, "sparkle", 12);
          // Move ship
          shipRef.current.targetX = ir.x + 40;
          shipRef.current.targetY = ir.y;
          setTimeout(() => {
            soundRef.current.play("sail");
            navigate(`/platform/island/${island.id}`);
          }, 400);
        } else {
          soundRef.current.play("boss");
          spawnParticles(ir.x, ir.y, "leaf", 6);
        }
      }
    });
  };

  const toggleSound = () => {
    setSoundOn(prev => {
      soundRef.current.muted = prev;
      return !prev;
    });
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;

  const currentIdx = islands.length > 0 ? getCurrentIslandIdx(islands, progressMap, totalXp) : 0;
  const overallProgress = islands.length > 0 ? Math.round((completedCount / islands.length) * 100) : 0;
  const currentIsland = islands[currentIdx];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/platform/dashboard">
              <Button variant="ghost" size="sm" className="gap-1"><ArrowLeft className="w-4 h-4" /> Dashboard</Button>
            </Link>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground font-display">World Map</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggleSound} className="gap-1">
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Badge variant="secondary" className="gap-1">
              <Trophy className="w-3 h-3 text-yellow-500" /> {completedCount}/{islands.length}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Star className="w-3 h-3 text-yellow-500" /> {totalXp.toLocaleString()} XP
            </Badge>
          </div>
        </div>
      </header>

      {/* Info bar */}
      <div className="bg-card/60 border-b border-border/30 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentIsland && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Currently exploring:</span>
                <span className="font-bold text-foreground">{currentIsland?.icon} {currentIsland?.name}</span>
              </motion.div>
            )}
          </div>
          <div className="flex items-center gap-2 w-48">
            <span className="text-xs text-muted-foreground">Journey</span>
            <Progress value={overallProgress} className="h-1.5 flex-1" />
            <span className="text-xs font-bold text-foreground">{overallProgress}%</span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 relative min-h-[600px]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-pointer"
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        />

        {/* Tooltip for hovered island */}
        {hoveredIsland !== null && islands[hoveredIsland] && (() => {
          const island = islands[hoveredIsland];
          const unlocked = isIslandUnlocked(island, hoveredIsland, islands, progressMap, totalXp);
          const pct = progressMap[island.id]?.completion_percentage || 0;
          const bossComplete = progressMap[island.id]?.boss_completed || false;
          const pos = ISLAND_NORM[hoveredIsland];
          if (!pos) return null;
          const container = containerRef.current;
          if (!container) return null;
          const cw = container.getBoundingClientRect().width;
          const ch = container.getBoundingClientRect().height;

          return (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-30 pointer-events-none"
              style={{
                left: pos.x * cw,
                top: pos.y * ch - 90,
                transform: "translateX(-50%)",
              }}
            >
              <div className="bg-card/95 backdrop-blur-xl border border-border/60 rounded-xl px-4 py-3 shadow-2xl min-w-[180px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{island.icon}</span>
                  <div>
                    <p className="font-bold text-foreground text-sm">{island.name}</p>
                    <p className="text-[10px] text-muted-foreground">Island {island.order_index}</p>
                  </div>
                </div>
                {unlocked ? (
                  <>
                    <Progress value={Number(pct)} className="h-1.5 mt-2" />
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground">{Math.round(Number(pct))}% complete</span>
                      {bossComplete && <span className="text-[10px] text-primary font-bold">🏆 Mastered</span>}
                    </div>
                    <p className="text-[10px] text-primary mt-1 font-medium">Click to explore →</p>
                  </>
                ) : (
                  <p className="text-[10px] text-muted-foreground mt-1">🔒 Complete previous island to unlock</p>
                )}
              </div>
            </motion.div>
          );
        })()}
      </div>

      {/* Legend */}
      <div className="bg-card/60 border-t border-border/30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" /> Current</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-primary" /> Completed</span>
          <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Locked</span>
          <span className="flex items-center gap-1.5"><Swords className="w-3 h-3 text-orange-500" /> Boss Ready</span>
          <span className="flex items-center gap-1.5"><Anchor className="w-3 h-3" /> {islands.length} Islands</span>
          <span className="flex items-center gap-1.5">⛵ Sail to explore</span>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
