import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles } from "lucide-react";

// Simple browser audio SFX using Web Audio API
function playXpSound() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Rising chime arpeggio
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.4);
    });

    // Sparkle sweep
    const noise = ctx.createOscillator();
    const noiseGain = ctx.createGain();
    noise.type = "triangle";
    noise.frequency.setValueAtTime(2000, now + 0.3);
    noise.frequency.exponentialRampToValueAtTime(4000, now + 0.6);
    noiseGain.gain.setValueAtTime(0, now + 0.3);
    noiseGain.gain.linearRampToValueAtTime(0.05, now + 0.35);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    noise.connect(noiseGain).connect(ctx.destination);
    noise.start(now + 0.3);
    noise.stop(now + 0.7);
  } catch {
    // Audio not available, fail silently
  }
}

function playLevelUpSound() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Epic fanfare
    [261.63, 329.63, 392, 523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i < 3 ? "square" : "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.5);
    });
  } catch {}
}

function playCorrectSound() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    [440, 554.37, 659.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.25);
    });
  } catch {}
}

function playWrongSound() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(200, now + 0.3);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  } catch {}
}

// Confetti particle colors
const PARTICLE_COLORS = [
  "hsl(var(--primary))",
  "hsl(48, 96%, 53%)", // gold
  "hsl(280, 87%, 65%)", // purple
  "hsl(142, 76%, 36%)", // green
  "hsl(199, 89%, 48%)", // blue
];

interface XpPopupProps {
  show: boolean;
  xp: number;
  onComplete?: () => void;
}

const XpPopup = ({ show, xp, onComplete }: XpPopupProps) => {
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (show && !hasPlayed.current) {
      hasPlayed.current = true;
      playXpSound();
      if (onComplete) {
        const t = setTimeout(onComplete, 2500);
        return () => clearTimeout(t);
      }
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
          {/* Particles */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * 360;
            const distance = 80 + Math.random() * 120;
            const x = Math.cos((angle * Math.PI) / 180) * distance;
            const y = Math.sin((angle * Math.PI) / 180) * distance;
            const size = 4 + Math.random() * 8;
            const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];

            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{ x, y: y - 40, scale: [0, 1.5, 0], opacity: [1, 1, 0] }}
                transition={{ duration: 1 + Math.random() * 0.5, delay: Math.random() * 0.2, ease: "easeOut" }}
                className="absolute rounded-full"
                style={{ width: size, height: size, backgroundColor: color }}
              />
            );
          })}

          {/* Floating stars */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`star-${i}`}
              initial={{ y: 0, x: (i - 3) * 40, opacity: 0, scale: 0, rotate: 0 }}
              animate={{
                y: -120 - Math.random() * 80,
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
                rotate: 360,
              }}
              transition={{ duration: 1.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
              className="absolute"
            >
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </motion.div>
          ))}

          {/* Main XP badge */}
          <motion.div
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: [0, 1.3, 1], y: [20, -30, -50] }}
            exit={{ opacity: 0, y: -100, scale: 0.5 }}
            transition={{ duration: 0.6, type: "spring", damping: 8 }}
            className="relative"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.8, repeat: 3 }}
              className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
            >
              <Sparkles className="w-8 h-8" />
              <span className="text-3xl font-bold font-display">+{xp} XP</span>
            </motion.div>

            {/* Glow ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: [0.8, 1.8], opacity: [0.6, 0] }}
              transition={{ duration: 1, repeat: 2 }}
              className="absolute inset-0 rounded-2xl border-2 border-yellow-400"
            />
          </motion.div>

          {/* Rising text */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: [0, 1, 1, 0], y: [40, 20, 10, -20] }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute mt-24 text-sm font-bold text-foreground"
          >
            Keep going! 🔥
          </motion.p>
        </div>
      )}
    </AnimatePresence>
  );
};

export { XpPopup, playXpSound, playLevelUpSound, playCorrectSound, playWrongSound };
