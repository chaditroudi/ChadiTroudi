import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import robotImg from "@/assets/robot-avatar.jpg";

interface AIAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const AIAvatar = ({ isSpeaking, isListening, size = "md" }: AIAvatarProps) => {
  const [blink, setBlink] = useState(false);

  // Natural blinking every 3-5 seconds when idle
  useEffect(() => {
    if (isSpeaking || isListening) return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [isSpeaking, isListening]);

  const sizes = {
    sm: "w-10 h-10",
    md: "w-20 h-20",
    lg: "w-32 h-32",
    xl: "w-44 h-44",
  };

  const isActive = isSpeaking || isListening;
  const color = isSpeaking ? "152 100% 50%" : isListening ? "200 100% 60%" : "152 80% 50%";

  return (
    <div className={`relative ${sizes[size]} flex items-center justify-center`}>
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-[-18%] rounded-full"
        style={{
          background: `radial-gradient(circle, hsl(${color} / ${isActive ? 0.35 : 0.12}) 0%, transparent 70%)`,
        }}
        animate={{
          scale: isActive ? [1, 1.15, 1] : [1, 1.04, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: isSpeaking ? 0.5 : 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pulse rings when active */}
      {isActive && [0, 0.4].map((delay) => (
        <motion.div
          key={delay}
          className="absolute inset-[-8%] rounded-full"
          style={{
            border: `${delay === 0 ? 2 : 1}px solid hsl(${color} / ${delay === 0 ? 0.5 : 0.25})`,
            boxShadow: delay === 0 ? `0 0 15px hsl(${color} / 0.25)` : undefined,
          }}
          animate={{ scale: [1, delay === 0 ? 1.4 : 1.7], opacity: [delay === 0 ? 0.6 : 0.3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay }}
        />
      ))}

      {/* Neon border */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: `2px solid hsl(${color} / ${isActive ? 0.7 : 0.25})`,
          boxShadow: isActive
            ? `0 0 20px hsl(${color} / 0.4), 0 0 40px hsl(${color} / 0.15), inset 0 0 15px hsl(${color} / 0.08)`
            : `0 0 8px hsl(${color} / 0.1)`,
        }}
        animate={isActive ? {
          boxShadow: [
            `0 0 20px hsl(${color} / 0.4), 0 0 40px hsl(${color} / 0.15)`,
            `0 0 30px hsl(${color} / 0.6), 0 0 60px hsl(${color} / 0.25)`,
            `0 0 20px hsl(${color} / 0.4), 0 0 40px hsl(${color} / 0.15)`,
          ],
        } : {}}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Robot image with blink overlay */}
      <motion.div
        className="relative w-full h-full rounded-full overflow-hidden"
        animate={{ scale: isSpeaking ? [1, 1.02, 1] : 1 }}
        transition={{ duration: 0.6, repeat: Infinity }}
      >
        <img src={robotImg} alt="AI Tutor Robot" className="w-full h-full object-cover" />
        
        {/* Blink overlay - subtle dark flash over eyes area */}
        <AnimatedBlink blink={blink} />

        {/* Neon color wash when active */}
        {isActive && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, hsl(${color} / 0.03) 0%, hsl(${color} / 0.12) 100%)`,
            }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Status badge */}
      {isActive && (
        <motion.div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-[2px]"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              className="w-[3px] rounded-full"
              style={{
                background: `hsl(${color})`,
                boxShadow: `0 0 6px hsl(${color} / 0.6)`,
              }}
              animate={{ height: isSpeaking ? [3, 12, 3] : [2, 10, 2] }}
              transition={{ duration: isSpeaking ? 0.35 : 0.5, repeat: Infinity, delay: i * (isSpeaking ? 0.06 : 0.08) }}
            />
          ))}
        </motion.div>
      )}

      {/* Idle breathing glow */}
      {!isActive && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: "0 0 15px hsl(152 80% 50% / 0.15)" }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
};

// Subtle blink effect
const AnimatedBlink = ({ blink }: { blink: boolean }) => (
  <motion.div
    className="absolute top-[25%] left-[15%] right-[15%] h-[12%] rounded-full"
    style={{ background: "rgba(0,0,0,0.3)" }}
    initial={{ opacity: 0, scaleY: 0 }}
    animate={{ opacity: blink ? 1 : 0, scaleY: blink ? 1 : 0 }}
    transition={{ duration: 0.09 }}
  />
);

export default AIAvatar;
