import { motion, AnimatePresence } from "framer-motion";
import { useAIAssistant } from "../hooks/use-ai-assistant";
import type { AvatarState } from "../types";

const STATE_LABELS: Record<AvatarState, string> = {
  idle: "Ready to help",
  listening: "Listening...",
  thinking: "Thinking...",
  speaking: "Speaking...",
};

const STATE_COLORS: Record<AvatarState, string> = {
  idle: "from-primary/60 to-emerald-500/40",
  listening: "from-blue-500/60 to-cyan-400/40",
  thinking: "from-amber-500/60 to-orange-400/40",
  speaking: "from-primary/80 to-emerald-400/60",
};

/** Animated rings around the avatar */
const PulseRings = ({ state }: { state: AvatarState }) => {
  if (state === "idle") return null;
  return (
    <>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary/30"
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary/20"
        animate={{ scale: [1, 1.7, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
      {state === "speaking" && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-emerald-400/20"
          animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />
      )}
    </>
  );
};

/** Sound wave bars for speaking/listening */
const SoundWaves = ({ state }: { state: AvatarState }) => {
  if (state !== "speaking" && state !== "listening") return null;
  const bars = state === "speaking" ? 7 : 5;
  return (
    <div className="flex items-end gap-[3px] h-6 justify-center mt-2">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-[3px] rounded-full ${
            state === "speaking" ? "bg-primary" : "bg-blue-500"
          }`}
          animate={{
            height: state === "speaking"
              ? [8, 20 + Math.random() * 12, 6, 16 + Math.random() * 8, 8]
              : [6, 12 + Math.random() * 8, 4, 10, 6],
          }}
          transition={{
            duration: 0.6 + Math.random() * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.08,
          }}
        />
      ))}
    </div>
  );
};

/** Main avatar face with eyes and mouth */
const AvatarFace = ({ state }: { state: AvatarState }) => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Eyes */}
    <div className="absolute top-[38%] flex gap-[22%]">
      <motion.div
        className="w-2.5 h-2.5 bg-white rounded-full relative"
        animate={
          state === "thinking"
            ? { y: [0, -2, 0], x: [0, 2, -2, 0] }
            : state === "listening"
            ? { scaleY: [1, 0.3, 1] }
            : {}
        }
        transition={{ duration: state === "thinking" ? 2 : 3, repeat: Infinity }}
      >
        <motion.div
          className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 bg-slate-800 rounded-full"
          animate={
            state === "thinking"
              ? { x: [0, 1.5, -1.5, 0] }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
      <motion.div
        className="w-2.5 h-2.5 bg-white rounded-full relative"
        animate={
          state === "thinking"
            ? { y: [0, -2, 0], x: [0, 2, -2, 0] }
            : state === "listening"
            ? { scaleY: [1, 0.3, 1] }
            : {}
        }
        transition={{ duration: state === "thinking" ? 2 : 3, repeat: Infinity, delay: 0.1 }}
      >
        <motion.div
          className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 bg-slate-800 rounded-full"
          animate={
            state === "thinking"
              ? { x: [0, 1.5, -1.5, 0] }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
        />
      </motion.div>
    </div>

    {/* Mouth */}
    <div className="absolute top-[60%]">
      {state === "speaking" ? (
        <motion.div
          className="w-4 h-3 bg-white/80 rounded-[50%]"
          animate={{ scaleY: [0.5, 1.2, 0.7, 1, 0.5], scaleX: [1, 0.9, 1.1, 0.95, 1] }}
          transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : state === "thinking" ? (
        <motion.div
          className="w-3 h-1.5 bg-white/60 rounded-full"
          animate={{ width: [12, 14, 10, 12], x: [0, 2, -1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      ) : (
        <motion.div
          className="w-5 h-1.5 bg-white/70 rounded-full"
          style={{ borderRadius: "0 0 50% 50%" }}
          animate={{ scaleX: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
    </div>
  </div>
);

interface AIAvatarProps {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showWaves?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-14 h-14",
  md: "w-20 h-20",
  lg: "w-28 h-28",
};

export const AIAvatar = ({ size = "md", showLabel = true, showWaves = true, className = "" }: AIAvatarProps) => {
  const { avatarState } = useAIAssistant();

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`relative ${sizeMap[size]}`}>
        <PulseRings state={avatarState} />
        <motion.div
          className={`${sizeMap[size]} rounded-full bg-gradient-to-br ${STATE_COLORS[avatarState]} flex items-center justify-center shadow-lg relative overflow-hidden`}
          animate={
            avatarState === "thinking"
              ? { scale: [1, 1.03, 1] }
              : avatarState === "speaking"
              ? { scale: [1, 1.02, 0.99, 1] }
              : {}
          }
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/10"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <AvatarFace state={avatarState} />
        </motion.div>
      </div>

      {showWaves && <SoundWaves state={avatarState} />}

      {showLabel && (
        <AnimatePresence mode="wait">
          <motion.p
            key={avatarState}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[11px] text-muted-foreground mt-1.5 font-medium"
          >
            {STATE_LABELS[avatarState]}
          </motion.p>
        </AnimatePresence>
      )}
    </div>
  );
};
