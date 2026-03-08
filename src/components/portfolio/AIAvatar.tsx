import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface AIAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const AIAvatar = ({ isSpeaking, isListening, size = "md" }: AIAvatarProps) => {
  const [blink, setBlink] = useState(false);
  const [breathe, setBreathe] = useState(0);

  useEffect(() => {
    if (isSpeaking || isListening) return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [isSpeaking, isListening]);

  useEffect(() => {
    const interval = setInterval(() => setBreathe(p => (p + 1) % 2), 2500);
    return () => clearInterval(interval);
  }, []);

  const isActive = isSpeaking || isListening;
  const color = isSpeaking ? "152 100% 50%" : isListening ? "200 100% 60%" : "152 80% 50%";

  if (size === "full") {
    return (
      <div className="relative w-full h-full flex items-center justify-center select-none">
        {/* Full body humanoid robot */}
        <svg viewBox="0 0 200 400" className="w-full h-full max-w-[220px] max-h-[360px]" xmlns="http://www.w3.org/2000/svg">
          {/* Ambient glow under robot */}
          <defs>
            <radialGradient id="bodyGlow" cx="50%" cy="85%" r="50%">
              <stop offset="0%" stopColor={`hsl(${color})`} stopOpacity={isActive ? 0.2 : 0.05} />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(210 20% 18%)" />
              <stop offset="100%" stopColor="hsl(210 20% 10%)" />
            </linearGradient>
            <linearGradient id="headGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(210 20% 22%)" />
              <stop offset="100%" stopColor="hsl(210 20% 14%)" />
            </linearGradient>
            <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={`hsl(${color})`} stopOpacity="0.6" />
              <stop offset="100%" stopColor={`hsl(${color})`} stopOpacity="0.1" />
            </linearGradient>
          </defs>

          <ellipse cx="100" cy="380" rx="60" ry="10" fill="url(#bodyGlow)" />

          {/* Legs */}
          <motion.g animate={{ y: breathe === 0 ? 0 : 1 }} transition={{ duration: 2.5, ease: "easeInOut" }}>
            <rect x="72" y="300" width="18" height="65" rx="8" fill="url(#bodyGrad)" stroke={`hsl(${color} / 0.15)`} strokeWidth="1" />
            <rect x="110" y="300" width="18" height="65" rx="8" fill="url(#bodyGrad)" stroke={`hsl(${color} / 0.15)`} strokeWidth="1" />
            {/* Feet */}
            <rect x="66" y="358" width="28" height="12" rx="6" fill="hsl(210 20% 12%)" stroke={`hsl(${color} / 0.2)`} strokeWidth="1" />
            <rect x="106" y="358" width="28" height="12" rx="6" fill="hsl(210 20% 12%)" stroke={`hsl(${color} / 0.2)`} strokeWidth="1" />
            {/* Knee joints */}
            <circle cx="81" cy="330" r="5" fill={`hsl(${color} / 0.2)`} stroke={`hsl(${color} / 0.3)`} strokeWidth="1" />
            <circle cx="119" cy="330" r="5" fill={`hsl(${color} / 0.2)`} stroke={`hsl(${color} / 0.3)`} strokeWidth="1" />
          </motion.g>

          {/* Torso */}
          <motion.g
            animate={isSpeaking ? { y: [0, -1, 0, 1, 0] } : { y: breathe === 0 ? [0, -1.5] : [-1.5, 0] }}
            transition={isSpeaking ? { duration: 0.6, repeat: Infinity } : { duration: 2.5, ease: "easeInOut" }}
          >
            {/* Body */}
            <rect x="62" y="175" width="76" height="130" rx="16" fill="url(#bodyGrad)" stroke={`hsl(${color} / 0.2)`} strokeWidth="1.5" />
            {/* Chest plate */}
            <rect x="75" y="190" width="50" height="50" rx="10" fill="hsl(210 20% 13%)" stroke={`hsl(${color} / 0.15)`} strokeWidth="1" />
            {/* Chest core light */}
            <motion.circle
              cx="100" cy="215" r="8"
              fill={`hsl(${color} / 0.15)`}
              stroke={`hsl(${color} / ${isActive ? 0.8 : 0.3})`}
              strokeWidth="1.5"
              animate={isActive
                ? { r: [7, 9, 7], opacity: [0.6, 1, 0.6] }
                : { opacity: [0.3, 0.6, 0.3] }
              }
              transition={{ duration: isActive ? 0.8 : 3, repeat: Infinity }}
            />
            <motion.circle
              cx="100" cy="215" r="3"
              fill={`hsl(${color})`}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: isActive ? 0.5 : 2, repeat: Infinity }}
            />
            {/* Belt/waist */}
            <rect x="68" y="285" width="64" height="20" rx="8" fill="hsl(210 20% 11%)" stroke={`hsl(${color} / 0.15)`} strokeWidth="1" />
            <circle cx="100" cy="295" r="4" fill={`hsl(${color} / 0.3)`} stroke={`hsl(${color} / 0.4)`} strokeWidth="1" />

            {/* Left Arm */}
            <motion.g
              animate={isSpeaking
                ? { rotate: [-5, 8, -3, 5, -5] }
                : { rotate: breathe === 0 ? [0, -2] : [-2, 0] }
              }
              transition={isSpeaking
                ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                : { duration: 2.5, ease: "easeInOut" }
              }
              style={{ originX: "62px", originY: "185px" }}
            >
              <rect x="38" y="180" width="18" height="70" rx="9" fill="url(#bodyGrad)" stroke={`hsl(${color} / 0.15)`} strokeWidth="1" />
              {/* Shoulder joint */}
              <circle cx="55" cy="185" r="8" fill="hsl(210 20% 14%)" stroke={`hsl(${color} / 0.2)`} strokeWidth="1.5" />
              {/* Elbow */}
              <circle cx="47" cy="225" r="4" fill={`hsl(${color} / 0.15)`} stroke={`hsl(${color} / 0.25)`} strokeWidth="1" />
              {/* Forearm */}
              <rect x="40" y="248" width="14" height="40" rx="7" fill="url(#bodyGrad)" stroke={`hsl(${color} / 0.15)`} strokeWidth="1" />
              {/* Hand */}
              <motion.g
                animate={isSpeaking ? { rotate: [-10, 15, -10] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
                style={{ originX: "47px", originY: "288px" }}
              >
                <ellipse cx="47" cy="293" rx="9" ry="7" fill="hsl(210 20% 16%)" stroke={`hsl(${color} / 0.2)`} strokeWidth="1" />
              </motion.g>
            </motion.g>

            {/* Right Arm */}
            <motion.g
              animate={isSpeaking
                ? { rotate: [5, -8, 3, -5, 5] }
                : { rotate: breathe === 0 ? [0, 2] : [2, 0] }
              }
              transition={isSpeaking
                ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
                : { duration: 2.5, ease: "easeInOut" }
              }
              style={{ originX: "138px", originY: "185px" }}
            >
              <rect x="144" y="180" width="18" height="70" rx="9" fill="url(#bodyGrad)" stroke={`hsl(${color} / 0.15)`} strokeWidth="1" />
              <circle cx="145" cy="185" r="8" fill="hsl(210 20% 14%)" stroke={`hsl(${color} / 0.2)`} strokeWidth="1.5" />
              <circle cx="153" cy="225" r="4" fill={`hsl(${color} / 0.15)`} stroke={`hsl(${color} / 0.25)`} strokeWidth="1" />
              <rect x="146" y="248" width="14" height="40" rx="7" fill="url(#bodyGrad)" stroke={`hsl(${color} / 0.15)`} strokeWidth="1" />
              <motion.g
                animate={isSpeaking ? { rotate: [10, -15, 10] } : {}}
                transition={{ duration: 0.9, repeat: Infinity }}
                style={{ originX: "153px", originY: "288px" }}
              >
                <ellipse cx="153" cy="293" rx="9" ry="7" fill="hsl(210 20% 16%)" stroke={`hsl(${color} / 0.2)`} strokeWidth="1" />
              </motion.g>
            </motion.g>

            {/* Neck */}
            <rect x="90" y="155" width="20" height="24" rx="6" fill="hsl(210 20% 15%)" stroke={`hsl(${color} / 0.15)`} strokeWidth="1" />

            {/* Head */}
            <motion.g
              animate={isSpeaking
                ? { rotate: [-2, 2, -1, 1, -2], y: [0, -1, 0] }
                : { rotate: 0, y: breathe === 0 ? [0, -1] : [-1, 0] }
              }
              transition={isSpeaking
                ? { duration: 1, repeat: Infinity }
                : { duration: 2.5, ease: "easeInOut" }
              }
              style={{ originX: "100px", originY: "155px" }}
            >
              <rect x="65" y="95" width="70" height="65" rx="18" fill="url(#headGrad)" stroke={`hsl(${color} / 0.25)`} strokeWidth="1.5" />
              {/* Visor / eye area */}
              <rect x="74" y="108" width="52" height="22" rx="8" fill="hsl(210 25% 8%)" stroke={`hsl(${color} / 0.2)`} strokeWidth="1" />
              {/* Eyes */}
              <motion.ellipse
                cx="88" cy="119" rx={blink ? 5 : 5} ry={blink ? 1 : 5}
                fill={`hsl(${color})`}
                animate={isSpeaking ? { opacity: [0.7, 1, 0.7] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <motion.ellipse
                cx="112" cy="119" rx={blink ? 5 : 5} ry={blink ? 1 : 5}
                fill={`hsl(${color})`}
                animate={isSpeaking ? { opacity: [0.7, 1, 0.7] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              {/* Eye glow */}
              <motion.ellipse cx="88" cy="119" rx="7" ry="7" fill={`hsl(${color} / 0.1)`}
                animate={isActive ? { opacity: [0.1, 0.3, 0.1] } : { opacity: 0.05 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.ellipse cx="112" cy="119" rx="7" ry="7" fill={`hsl(${color} / 0.1)`}
                animate={isActive ? { opacity: [0.1, 0.3, 0.1] } : { opacity: 0.05 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              {/* Mouth */}
              <motion.rect
                x="88" y="140" width="24" rx="3"
                fill={`hsl(${color} / ${isSpeaking ? 0.5 : 0.15})`}
                animate={isSpeaking
                  ? { height: [2, 8, 3, 6, 2], y: [142, 138, 141, 139, 142] }
                  : { height: 3, y: 142 }
                }
                transition={isSpeaking ? { duration: 0.4, repeat: Infinity } : { duration: 0.3 }}
              />
              {/* Antenna */}
              <line x1="100" y1="95" x2="100" y2="78" stroke={`hsl(${color} / 0.3)`} strokeWidth="2" strokeLinecap="round" />
              <motion.circle
                cx="100" cy="75" r="4"
                fill={`hsl(${color} / ${isActive ? 0.6 : 0.2})`}
                stroke={`hsl(${color} / ${isActive ? 0.8 : 0.3})`}
                strokeWidth="1"
                animate={isActive ? { r: [3, 5, 3], opacity: [0.5, 1, 0.5] } : { opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {/* Ear panels */}
              <rect x="60" y="112" width="8" height="16" rx="3" fill="hsl(210 20% 14%)" stroke={`hsl(${color} / 0.2)`} strokeWidth="1" />
              <rect x="132" y="112" width="8" height="16" rx="3" fill="hsl(210 20% 14%)" stroke={`hsl(${color} / 0.2)`} strokeWidth="1" />
            </motion.g>
          </motion.g>

          {/* Sound waves when speaking */}
          {isSpeaking && (
            <>
              {[0, 1, 2].map(i => (
                <motion.circle
                  key={i}
                  cx="100" cy="140"
                  r={20 + i * 12}
                  fill="none"
                  stroke={`hsl(${color} / ${0.3 - i * 0.1})`}
                  strokeWidth="1"
                  animate={{ r: [20 + i * 12, 35 + i * 15], opacity: [0.3, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </>
          )}

          {/* Listening waves */}
          {isListening && (
            <>
              {[0, 1].map(i => (
                <motion.circle
                  key={i}
                  cx="100" cy="215"
                  r={30 + i * 15}
                  fill="none"
                  stroke={`hsl(200 100% 60% / ${0.25 - i * 0.1})`}
                  strokeWidth="1"
                  animate={{ r: [30 + i * 15, 50 + i * 20], opacity: [0.25, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                />
              ))}
            </>
          )}
        </svg>

        {/* Status text below robot */}
        <motion.div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2"
          animate={isActive ? { opacity: [0.6, 1, 0.6] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {isActive && (
            <div className="flex gap-[2px]">
              {[0, 1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  className="w-[3px] rounded-full"
                  style={{ background: `hsl(${color})`, boxShadow: `0 0 4px hsl(${color} / 0.5)` }}
                  animate={{ height: isSpeaking ? [3, 14, 3] : [2, 10, 2] }}
                  transition={{ duration: isSpeaking ? 0.3 : 0.5, repeat: Infinity, delay: i * 0.07 }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // Original circular avatar for small sizes
  const sizes = { sm: "w-10 h-10", md: "w-20 h-20", lg: "w-32 h-32", xl: "w-44 h-44" };

  return (
    <div className={`relative ${sizes[size]} flex items-center justify-center`}>
      <motion.div
        className="absolute inset-[-18%] rounded-full"
        style={{ background: `radial-gradient(circle, hsl(${color} / ${isActive ? 0.35 : 0.12}) 0%, transparent 70%)` }}
        animate={{ scale: isActive ? [1, 1.15, 1] : [1, 1.04, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: isSpeaking ? 0.5 : 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {isActive && [0, 0.4].map(delay => (
        <motion.div key={delay} className="absolute inset-[-8%] rounded-full"
          style={{ border: `${delay === 0 ? 2 : 1}px solid hsl(${color} / ${delay === 0 ? 0.5 : 0.25})` }}
          animate={{ scale: [1, delay === 0 ? 1.4 : 1.7], opacity: [delay === 0 ? 0.6 : 0.3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay }}
        />
      ))}
      <motion.div className="absolute inset-0 rounded-full"
        style={{
          border: `2px solid hsl(${color} / ${isActive ? 0.7 : 0.25})`,
          boxShadow: isActive ? `0 0 20px hsl(${color} / 0.4)` : `0 0 8px hsl(${color} / 0.1)`,
        }}
      />
      <motion.div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center"
        style={{ background: "hsl(210 20% 10%)" }}
      >
        {/* Mini robot face */}
        <svg viewBox="0 0 60 60" className="w-[70%] h-[70%]">
          <rect x="12" y="15" width="36" height="30" rx="10" fill="hsl(210 20% 16%)" stroke={`hsl(${color} / 0.3)`} strokeWidth="1" />
          <motion.ellipse cx="23" cy="28" rx={blink ? 3 : 3} ry={blink ? 0.5 : 3} fill={`hsl(${color})`} />
          <motion.ellipse cx="37" cy="28" rx={blink ? 3 : 3} ry={blink ? 0.5 : 3} fill={`hsl(${color})`} />
          <motion.rect x="22" y="37" width="16" rx="2" fill={`hsl(${color} / ${isSpeaking ? 0.5 : 0.2})`}
            animate={isSpeaking ? { height: [1.5, 5, 2, 4, 1.5] } : { height: 2 }}
            transition={isSpeaking ? { duration: 0.4, repeat: Infinity } : {}}
          />
          <line x1="30" y1="15" x2="30" y2="7" stroke={`hsl(${color} / 0.3)`} strokeWidth="1.5" strokeLinecap="round" />
          <motion.circle cx="30" cy="5" r="2.5" fill={`hsl(${color} / ${isActive ? 0.6 : 0.2})`}
            animate={isActive ? { opacity: [0.4, 1, 0.4] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </svg>
        {isActive && (
          <motion.div className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, hsl(${color} / 0.02) 0%, hsl(${color} / 0.08) 100%)` }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>
      {!isActive && (
        <motion.div className="absolute inset-0 rounded-full"
          style={{ boxShadow: "0 0 15px hsl(152 80% 50% / 0.15)" }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
};

export default AIAvatar;
