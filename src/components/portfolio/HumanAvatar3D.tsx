import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface HumanAvatar3DProps {
  isSpeaking: boolean;
  isListening: boolean;
  isThinking?: boolean;
}

const HumanAvatar3D = ({ isSpeaking, isListening, isThinking = false }: HumanAvatar3DProps) => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const isActive = isSpeaking || isListening || isThinking;
  const stateColor = isSpeaking ? "#22c55e" : isListening ? "#3b82f6" : isThinking ? "#f59e0b" : "#6b7280";

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none" style={{ minHeight: "280px" }}>
      {/* Ambient glow behind avatar */}
      <motion.div
        className="absolute rounded-full blur-[60px] pointer-events-none"
        style={{ width: 120, height: 120, background: stateColor, opacity: 0.12 }}
        animate={isActive ? { scale: [1, 1.3, 1], opacity: [0.08, 0.18, 0.08] } : { opacity: 0.06 }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <svg viewBox="0 0 200 380" className="w-full h-full max-w-[200px] max-h-[360px]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4a574" />
            <stop offset="100%" stopColor="#c8956c" />
          </linearGradient>
          <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#162d4a" />
          </linearGradient>
          <linearGradient id="pants" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2a3a" />
            <stop offset="100%" stopColor="#1f1f2e" />
          </linearGradient>
          <linearGradient id="hair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c1810" />
            <stop offset="100%" stopColor="#1a0e08" />
          </linearGradient>
          <radialGradient id="floorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={stateColor} stopOpacity={isActive ? "0.15" : "0.04"} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Floor shadow */}
        <ellipse cx="100" cy="370" rx="50" ry="8" fill="url(#floorGlow)" />

        {/* ═══ BODY GROUP — breathing ═══ */}
        <motion.g
          animate={{ y: [0, -1.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* ── LEGS ── */}
          <g>
            {/* Left leg */}
            <rect x="72" y="275" width="22" height="55" rx="8" fill="url(#pants)" />
            <rect x="70" y="325" width="26" height="16" rx="6" fill="#1a1a24" /> {/* shoe */}
            <rect x="66" y="335" width="32" height="8" rx="4" fill="#111118" /> {/* sole */}

            {/* Right leg */}
            <rect x="106" y="275" width="22" height="55" rx="8" fill="url(#pants)" />
            <rect x="104" y="325" width="26" height="16" rx="6" fill="#1a1a24" />
            <rect x="102" y="335" width="32" height="8" rx="4" fill="#111118" />

            {/* Belt */}
            <rect x="68" y="268" width="64" height="10" rx="4" fill="#222" />
            <rect x="96" y="270" width="8" height="6" rx="2" fill="#888" /> {/* buckle */}
          </g>

          {/* ── TORSO ── */}
          <motion.g
            animate={isSpeaking ? { rotate: [-0.5, 0.8, -0.3, 0.5, -0.5] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "100px", originY: "220px" }}
          >
            {/* Body / shirt */}
            <path d="M 68 170 Q 62 200 65 270 L 135 270 Q 138 200 132 170 Z" fill="url(#shirt)" filter="url(#shadow)" />

            {/* Collar - V-neck white */}
            <path d="M 87 170 L 100 195 L 113 170" fill="none" stroke="#e8e8e8" strokeWidth="3" strokeLinecap="round" />

            {/* Pocket */}
            <rect x="110" y="210" width="14" height="16" rx="2" fill="none" stroke="#2a4a70" strokeWidth="1" />

            {/* ── LEFT ARM ── */}
            <motion.g
              animate={isSpeaking
                ? { rotate: [-5, 15, -8, 12, -5] }
                : isListening
                ? { rotate: [-2, 2, -2] }
                : { rotate: [0, -2, 0] }
              }
              transition={{
                duration: isSpeaking ? 1.5 : 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ originX: "62px", originY: "178px" }}
            >
              {/* Upper arm */}
              <path d="M 62 175 Q 48 200 50 230" stroke="url(#shirt)" strokeWidth="20" strokeLinecap="round" fill="none" />

              {/* Forearm — skin */}
              <motion.g
                animate={isSpeaking ? { rotate: [-10, 20, -5, 15, -10] } : { rotate: 0 }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ originX: "50px", originY: "230px" }}
              >
                <path d="M 50 228 Q 44 250 48 268" stroke="url(#skin)" strokeWidth="14" strokeLinecap="round" fill="none" />
                {/* Hand */}
                <motion.g
                  animate={isSpeaking ? { rotate: [-15, 20, -10, 15, -15] } : {}}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ originX: "48px", originY: "268px" }}
                >
                  <ellipse cx="48" cy="275" rx="9" ry="11" fill="url(#skin)" />
                  {/* Fingers */}
                  <path d="M 42 280 Q 40 288 43 290" stroke="#c8956c" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M 46 282 Q 45 291 47 293" stroke="#c8956c" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M 50 282 Q 51 291 50 293" stroke="#c8956c" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M 54 280 Q 56 288 54 290" stroke="#c8956c" strokeWidth="3" strokeLinecap="round" fill="none" />
                </motion.g>
              </motion.g>
            </motion.g>

            {/* ── RIGHT ARM ── */}
            <motion.g
              animate={isSpeaking
                ? { rotate: [5, -15, 8, -12, 5] }
                : isListening
                ? { rotate: [2, -2, 2] }
                : { rotate: [0, 2, 0] }
              }
              transition={{
                duration: isSpeaking ? 1.8 : 3.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ originX: "138px", originY: "178px" }}
            >
              <path d="M 138 175 Q 152 200 150 230" stroke="url(#shirt)" strokeWidth="20" strokeLinecap="round" fill="none" />

              <motion.g
                animate={isSpeaking ? { rotate: [10, -20, 5, -15, 10] } : { rotate: 0 }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{ originX: "150px", originY: "230px" }}
              >
                <path d="M 150 228 Q 156 250 152 268" stroke="url(#skin)" strokeWidth="14" strokeLinecap="round" fill="none" />
                <motion.g
                  animate={isSpeaking ? { rotate: [15, -20, 10, -15, 15] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ originX: "152px", originY: "268px" }}
                >
                  <ellipse cx="152" cy="275" rx="9" ry="11" fill="url(#skin)" />
                  <path d="M 146 280 Q 144 288 147 290" stroke="#c8956c" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M 150 282 Q 149 291 151 293" stroke="#c8956c" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M 154 282 Q 155 291 154 293" stroke="#c8956c" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M 158 280 Q 160 288 158 290" stroke="#c8956c" strokeWidth="3" strokeLinecap="round" fill="none" />
                </motion.g>
              </motion.g>
            </motion.g>

            {/* ── NECK ── */}
            <rect x="90" y="148" width="20" height="25" rx="6" fill="url(#skin)" />

            {/* ── HEAD ── */}
            <motion.g
              animate={isSpeaking
                ? { rotate: [-2, 3, -1, 2, -2], y: [0, -1, 0.5, -0.5, 0] }
                : isListening
                ? { rotate: [-1, 1, -1], y: [0, -0.5, 0] }
                : { rotate: [0, 0.8, 0, -0.8, 0] }
              }
              transition={{
                duration: isSpeaking ? 1.2 : isListening ? 2 : 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ originX: "100px", originY: "148px" }}
            >
              {/* Face shape */}
              <ellipse cx="100" cy="115" rx="34" ry="40" fill="url(#skin)" filter="url(#shadow)" />

              {/* Jaw definition */}
              <path d="M 72 125 Q 80 155 100 158 Q 120 155 128 125" fill="url(#skin)" />

              {/* Hair — full head */}
              <ellipse cx="100" cy="90" rx="36" ry="32" fill="url(#hair)" />
              {/* Hair front sweep */}
              <path d="M 66 100 Q 70 75 100 70 Q 130 75 134 100" fill="url(#hair)" />
              {/* Side hair */}
              <rect x="64" y="95" width="8" height="20" rx="4" fill="url(#hair)" />
              <rect x="128" y="95" width="8" height="20" rx="4" fill="url(#hair)" />

              {/* Ears */}
              <ellipse cx="66" cy="115" rx="5" ry="10" fill="#c8956c" />
              <ellipse cx="134" cy="115" rx="5" ry="10" fill="#c8956c" />

              {/* ─ Eyes ─ */}
              {/* Left eye */}
              <ellipse cx="86" cy="112" rx="8" ry={blink ? 0.5 : 5} fill="white" />
              <motion.circle cx="86" cy="112" r={blink ? 0.3 : 3.5} fill="#3a2a1a"
                animate={isListening ? { cx: [85, 87, 85] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <circle cx="87" cy="111" r={blink ? 0 : 1.5} fill="black" />
              <circle cx="88" cy="110" r={blink ? 0 : 0.8} fill="white" opacity="0.7" />

              {/* Right eye */}
              <ellipse cx="114" cy="112" rx="8" ry={blink ? 0.5 : 5} fill="white" />
              <motion.circle cx="114" cy="112" r={blink ? 0.3 : 3.5} fill="#3a2a1a"
                animate={isListening ? { cx: [113, 115, 113] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <circle cx="115" cy="111" r={blink ? 0 : 1.5} fill="black" />
              <circle cx="116" cy="110" r={blink ? 0 : 0.8} fill="white" opacity="0.7" />

              {/* Eyebrows */}
              <motion.path
                d="M 77 104 Q 86 99 95 104"
                fill="none" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round"
                animate={isSpeaking
                  ? { d: ["M 77 104 Q 86 99 95 104", "M 77 102 Q 86 96 95 102", "M 77 104 Q 86 99 95 104"] }
                  : isListening
                  ? { d: ["M 77 104 Q 86 99 95 104", "M 77 102 Q 86 97 95 102", "M 77 104 Q 86 99 95 104"] }
                  : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.path
                d="M 105 104 Q 114 99 123 104"
                fill="none" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round"
                animate={isSpeaking
                  ? { d: ["M 105 104 Q 114 99 123 104", "M 105 102 Q 114 96 123 102", "M 105 104 Q 114 99 123 104"] }
                  : isListening
                  ? { d: ["M 105 104 Q 114 99 123 104", "M 105 102 Q 114 97 123 102", "M 105 104 Q 114 99 123 104"] }
                  : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Nose */}
              <path d="M 100 118 L 96 130 Q 100 133 104 130 Z" fill="#b8845c" opacity="0.6" />

              {/* ─ Mouth ─ */}
              <motion.path
                d={isSpeaking ? undefined : "M 88 140 Q 94 146 100 146 Q 106 146 112 140"}
                fill="none" stroke="#a06050" strokeWidth="2.5" strokeLinecap="round"
                animate={isSpeaking ? {
                  d: [
                    "M 88 140 Q 94 146 100 146 Q 106 146 112 140",
                    "M 88 138 Q 94 150 100 152 Q 106 150 112 138",
                    "M 88 140 Q 94 143 100 143 Q 106 143 112 140",
                    "M 88 139 Q 94 149 100 150 Q 106 149 112 139",
                    "M 88 140 Q 94 146 100 146 Q 106 146 112 140",
                  ],
                } : {}}
                transition={{ duration: 0.4, repeat: Infinity }}
              />
              {/* Mouth opening when speaking */}
              {isSpeaking && (
                <motion.ellipse cx="100" cy="144" rx="7"
                  fill="#5a2020"
                  animate={{ ry: [1, 5, 2, 4, 1] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                />
              )}
              {/* Teeth hint when speaking */}
              {isSpeaking && (
                <motion.rect x="94" y="141" width="12" rx="2" fill="white" opacity="0.8"
                  animate={{ height: [0, 3, 1, 3, 0] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                />
              )}

              {/* Slight smile when not speaking */}
              {!isSpeaking && !isListening && (
                <path d="M 92 144 Q 100 149 108 144" fill="none" stroke="#a06050" strokeWidth="1" opacity="0.4" />
              )}
            </motion.g>
          </motion.g>
        </motion.g>

        {/* Voice waves when speaking */}
        {isSpeaking && [0, 1, 2].map(i => (
          <motion.ellipse key={`sw${i}`} cx="100" cy="140"
            fill="none" stroke={stateColor} strokeWidth="0.8"
            animate={{ rx: [15 + i * 12, 35 + i * 15], ry: [8 + i * 6, 18 + i * 10], opacity: [0.25, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.35 }}
          />
        ))}

        {/* Listening pulse */}
        {isListening && [0, 1].map(i => (
          <motion.circle key={`lp${i}`} cx="100" cy="200"
            fill="none" stroke="#3b82f6" strokeWidth="1"
            animate={{ r: [10 + i * 10, 35 + i * 15], opacity: [0.3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}

        {/* Thinking dots */}
        {isThinking && (
          <g>
            {[0, 1, 2].map(i => (
              <motion.circle key={`td${i}`} cx={85 + i * 15} cy="50" r="4" fill={stateColor}
                animate={{ opacity: [0.2, 1, 0.2], y: [0, -5, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
};

export default HumanAvatar3D;
