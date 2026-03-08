import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import tutorFullbody from "@/assets/tutor-fullbody.png";

interface HumanAvatar3DProps {
  isSpeaking: boolean;
  isListening: boolean;
  isThinking?: boolean;
}

const HumanAvatar3D = ({ isSpeaking, isListening, isThinking = false }: HumanAvatar3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>([3, 5, 8, 5, 3]);
  const stateColor = isSpeaking ? "#22c55e" : isListening ? "#3b82f6" : isThinking ? "#f59e0b" : "#6b7280";
  const stateLabel = isSpeaking ? "Speaking" : isListening ? "Listening" : isThinking ? "Thinking" : "Idle";

  // Mouse-follow parallax for interview camera feel
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [3, -3]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-4, 4]), { stiffness: 100, damping: 30 });
  const translateX = useSpring(useTransform(mouseX, [-200, 200], [-6, 6]), { stiffness: 80, damping: 25 });
  const translateY = useSpring(useTransform(mouseY, [-200, 200], [-4, 4]), { stiffness: 80, damping: 25 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Simulated audio levels when speaking
  useEffect(() => {
    if (!isSpeaking) return;
    const interval = setInterval(() => {
      setAudioLevels(Array.from({ length: 7 }, () => 2 + Math.random() * 18));
    }, 120);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none overflow-hidden"
      style={{ minHeight: "320px", perspective: "1000px" }}
    >
      {/* Interview background — dark gradient simulating studio */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222,22%,8%)] via-[hsl(222,22%,10%)] to-[hsl(222,22%,6%)]" />
        {/* Soft studio light top-left */}
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-white/[0.03] blur-[60px]" />
        {/* Rim light right */}
        <div className="absolute top-10 -right-10 w-40 h-80 rounded-full blur-[50px]" style={{ background: `${stateColor}10` }} />
      </div>

      {/* Camera frame / viewfinder overlay */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none z-30">
        {/* Corner brackets */}
        {[
          "top-3 left-3 border-t-2 border-l-2",
          "top-3 right-3 border-t-2 border-r-2",
          "bottom-3 left-3 border-b-2 border-l-2",
          "bottom-3 right-3 border-b-2 border-r-2",
        ].map((pos, i) => (
          <div key={i} className={`absolute w-5 h-5 ${pos} border-white/20 rounded-sm`} />
        ))}

        {/* REC indicator */}
        <div className="absolute top-4 right-8 flex items-center gap-2">
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="text-[10px] font-mono text-red-400/80 tracking-wider">REC</span>
        </div>

        {/* Timecode */}
        <div className="absolute top-4 left-8">
          <TimecodeDisplay />
        </div>

        {/* Status bar bottom */}
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-between px-5">
          {/* State indicator */}
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: stateColor }}
              animate={isSpeaking || isListening ? { scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <span className="text-[10px] font-mono tracking-wider" style={{ color: stateColor }}>
              {stateLabel.toUpperCase()}
            </span>
          </div>

          {/* Audio level bars */}
          <div className="flex items-end gap-[2px] h-4">
            {audioLevels.map((level, i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-full"
                style={{ backgroundColor: isSpeaking ? stateColor : "rgba(255,255,255,0.15)" }}
                animate={{ height: isSpeaking ? level : 3 }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </div>

          {/* Camera label */}
          <span className="text-[10px] font-mono text-white/30 tracking-wider">CAM 01</span>
        </div>
      </div>

      {/* Main avatar with parallax camera motion */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Ambient glow behind avatar */}
        <motion.div
          className="absolute rounded-full blur-[80px] pointer-events-none"
          style={{
            width: 200,
            height: 250,
            background: `radial-gradient(ellipse, ${stateColor}20 0%, transparent 70%)`,
            top: "10%",
          }}
          animate={
            isSpeaking || isListening
              ? { scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }
              : { opacity: 0.2 }
          }
          transition={{ duration: 2.5, repeat: Infinity }}
        />

        {/* Speaking pulse rings */}
        {isSpeaking &&
          [0, 1].map((i) => (
            <motion.div
              key={`speak-ring-${i}`}
              className="absolute rounded-full border pointer-events-none"
              style={{
                borderColor: `${stateColor}30`,
                top: "20%",
                left: "50%",
                transform: "translate(-50%, 0)",
              }}
              animate={{
                width: [120 + i * 40, 220 + i * 50],
                height: [140 + i * 40, 260 + i * 50],
                opacity: [0.4, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}

        {/* Listening sonar */}
        {isListening &&
          [0, 1, 2].map((i) => (
            <motion.div
              key={`listen-ring-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                background: `${stateColor}08`,
                border: `1px solid ${stateColor}15`,
                top: "30%",
                left: "50%",
                transform: "translate(-50%, 0)",
              }}
              animate={{
                width: [80 + i * 30, 200 + i * 40],
                height: [80 + i * 30, 200 + i * 40],
                opacity: [0.5, 0],
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}

        {/* Thinking dots */}
        {isThinking && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`dot-${i}`}
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: stateColor }}
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -8, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        )}

        {/* Full-body avatar image with interview framing */}
        <motion.div
          className="relative overflow-hidden rounded-xl"
          style={{
            width: "clamp(200px, 55vw, 280px)",
            height: "clamp(260px, 70vw, 360px)",
          }}
          animate={
            isSpeaking
              ? { scale: [1, 1.012, 1, 1.008, 1] }
              : isListening
              ? { scale: [1, 1.005, 1] }
              : { scale: 1 }
          }
          transition={{
            duration: isSpeaking ? 0.8 : 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Subtle vignette */}
          <div className="absolute inset-0 z-10 pointer-events-none rounded-xl"
            style={{
              background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
            }}
          />

          {/* Depth-of-field bottom blur (like real camera) */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to top, hsl(222 22% 7% / 0.7), transparent)",
            }}
          />

          {/* The avatar */}
          <motion.img
            src={tutorFullbody}
            alt="AI Coding Tutor"
            className="w-full h-full object-cover object-top"
            draggable={false}
            animate={
              isSpeaking
                ? { y: [0, -2, 0, -1, 0] }
                : { y: [0, -1, 0] }
            }
            transition={{
              duration: isSpeaking ? 1.2 : 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Speaking: subtle chin/mouth area highlight */}
          {isSpeaking && (
            <motion.div
              className="absolute z-10 pointer-events-none"
              style={{
                bottom: "45%",
                left: "30%",
                right: "30%",
                height: "12%",
                borderRadius: "50%",
                background: `radial-gradient(ellipse, ${stateColor}15 0%, transparent 70%)`,
              }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
          )}

          {/* Listening: subtle ear area highlight */}
          {isListening && (
            <>
              <motion.div
                className="absolute z-10 pointer-events-none"
                style={{
                  top: "25%", left: "5%", width: "15%", height: "10%",
                  borderRadius: "50%",
                  background: `radial-gradient(ellipse, ${stateColor}12 0%, transparent 70%)`,
                }}
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute z-10 pointer-events-none"
                style={{
                  top: "25%", right: "5%", width: "15%", height: "10%",
                  borderRadius: "50%",
                  background: `radial-gradient(ellipse, ${stateColor}12 0%, transparent 70%)`,
                }}
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              />
            </>
          )}
        </motion.div>

        {/* Name plate — interview style */}
        <motion.div
          className="mt-3 flex items-center gap-2 px-4 py-1.5 rounded-lg border"
          style={{
            background: "hsl(222 22% 8% / 0.8)",
            borderColor: `${stateColor}30`,
            backdropFilter: "blur(8px)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: stateColor }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-xs font-mono text-white/70 tracking-wide">AI Coding Mentor</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* Live timecode display */
const TimecodeDisplay = () => {
  const [time, setTime] = useState("00:00:00");

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
      const s = String(elapsed % 60).padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="text-[10px] font-mono text-white/30 tracking-wider tabular-nums">{time}</span>
  );
};

export default HumanAvatar3D;
