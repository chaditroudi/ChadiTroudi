import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface AIAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const AIAvatar = ({ isSpeaking, isListening, size = "md" }: AIAvatarProps) => {
  const [blink, setBlink] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3200 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setBreathPhase(p => (p + 1) % 100), 50);
    return () => clearInterval(interval);
  }, []);

  const isActive = isSpeaking || isListening;
  const accentHue = isSpeaking ? "152" : isListening ? "200" : "152";
  const accentColor = isSpeaking ? "#00d97e" : isListening ? "#38bdf8" : "#22c55e";
  const breathY = Math.sin(breathPhase * 0.063) * 2;

  if (size === "full") {
    return (
      <div ref={ref} className="relative w-full h-full flex items-center justify-center select-none">
        <svg viewBox="0 0 260 440" className="w-full h-full max-w-[240px] max-h-[400px]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a3f4b" />
              <stop offset="100%" stopColor="#2a2e38" />
            </linearGradient>
            <linearGradient id="darkSkinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2e323c" />
              <stop offset="100%" stopColor="#22252e" />
            </linearGradient>
            <linearGradient id="faceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#44495a" />
              <stop offset="100%" stopColor="#353a48" />
            </linearGradient>
            <linearGradient id="chestGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#32364080" />
              <stop offset="100%" stopColor="#282c3580" />
            </linearGradient>
            <radialGradient id="floorGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accentColor} stopOpacity={isActive ? "0.12" : "0.04"} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Floor glow */}
          <ellipse cx="130" cy="420" rx="70" ry="12" fill="url(#floorGlow)" />

          <motion.g animate={{ y: breathY }} transition={{ duration: 0 }}>
            {/* ═══ LEGS ═══ */}
            {/* Left leg */}
            <motion.g
              animate={isSpeaking ? { rotate: [-0.5, 0.5, -0.5] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ originX: "105px", originY: "310px" }}
            >
              {/* Thigh */}
              <path d="M 97 310 Q 93 340 95 365 L 115 365 Q 117 340 113 310 Z" fill="url(#skinGrad)" />
              {/* Knee joint - sleek */}
              <ellipse cx="105" cy="365" rx="12" ry="8" fill="#353a48" stroke={`${accentColor}30`} strokeWidth="0.8" />
              {/* Shin */}
              <path d="M 95 370 Q 92 395 94 410 L 116 410 Q 118 395 115 370 Z" fill="url(#darkSkinGrad)" />
              {/* Ankle */}
              <ellipse cx="105" cy="410" rx="10" ry="6" fill="#2e323c" />
              {/* Foot - sleek shoe shape */}
              <path d="M 85 414 Q 84 420 88 424 L 122 424 Q 126 420 122 414 Z" fill="#22252e" stroke={`${accentColor}20`} strokeWidth="0.8" />
              {/* Shoe accent line */}
              <line x1="90" y1="420" x2="120" y2="420" stroke={accentColor} strokeWidth="0.8" strokeOpacity="0.3" />
            </motion.g>

            {/* Right leg */}
            <motion.g
              animate={isSpeaking ? { rotate: [0.5, -0.5, 0.5] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ originX: "155px", originY: "310px" }}
            >
              <path d="M 147 310 Q 143 340 145 365 L 165 365 Q 167 340 163 310 Z" fill="url(#skinGrad)" />
              <ellipse cx="155" cy="365" rx="12" ry="8" fill="#353a48" stroke={`${accentColor}30`} strokeWidth="0.8" />
              <path d="M 145 370 Q 142 395 144 410 L 166 410 Q 168 395 165 370 Z" fill="url(#darkSkinGrad)" />
              <ellipse cx="155" cy="410" rx="10" ry="6" fill="#2e323c" />
              <path d="M 135 414 Q 134 420 138 424 L 172 424 Q 176 420 172 414 Z" fill="#22252e" stroke={`${accentColor}20`} strokeWidth="0.8" />
              <line x1="140" y1="420" x2="170" y2="420" stroke={accentColor} strokeWidth="0.8" strokeOpacity="0.3" />
            </motion.g>

            {/* ═══ TORSO ═══ */}
            <motion.g
              animate={isSpeaking ? { y: [0, -1.5, 0, 1, 0] } : {}}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Hip / pelvis */}
              <path d="M 90 300 Q 85 310 95 315 L 165 315 Q 175 310 170 300 Z" fill="url(#darkSkinGrad)" />
              {/* Belt line */}
              <rect x="92" y="298" width="76" height="8" rx="4" fill="#1e2028" stroke={`${accentColor}25`} strokeWidth="0.8" />
              <circle cx="130" cy="302" r="3" fill={`${accentColor}40`} />

              {/* Main torso - broader shoulders, tapered waist */}
              <path d="M 90 300 Q 82 270 78 230 Q 76 205 85 185 L 130 178 L 175 185 Q 184 205 182 230 Q 178 270 170 300 Z" fill="url(#skinGrad)" />
              
              {/* Chest plate with subtle V shape */}
              <path d="M 105 195 L 130 190 L 155 195 L 155 255 Q 145 265 130 268 Q 115 265 105 255 Z" fill="url(#chestGrad)" stroke={`${accentColor}15`} strokeWidth="1" />
              
              {/* Chest arc reactor / core */}
              <motion.circle cx="130" cy="225" r="12" fill="none" stroke={`${accentColor}30`} strokeWidth="1.5"
                animate={isActive ? { r: [11, 13, 11], strokeOpacity: [0.3, 0.7, 0.3] } : { strokeOpacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: isActive ? 0.8 : 3, repeat: Infinity }}
              />
              <motion.circle cx="130" cy="225" r="6" fill={`${accentColor}15`} stroke={`${accentColor}60`} strokeWidth="1"
                animate={isActive ? { r: [5, 7, 5] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <motion.circle cx="130" cy="225" r="2.5" fill={accentColor} filter="url(#softGlow)"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: isActive ? 0.5 : 2, repeat: Infinity }}
              />

              {/* Subtle abs / panel lines */}
              <line x1="130" y1="245" x2="130" y2="290" stroke={`${accentColor}10`} strokeWidth="0.5" />
              <line x1="115" y1="260" x2="145" y2="260" stroke={`${accentColor}08`} strokeWidth="0.5" />
              <line x1="118" y1="278" x2="142" y2="278" stroke={`${accentColor}08`} strokeWidth="0.5" />

              {/* ═══ LEFT ARM ═══ */}
              <motion.g
                animate={isSpeaking
                  ? { rotate: [-8, 12, -5, 15, -8] }
                  : { rotate: [0, -3, 0] }
                }
                transition={isSpeaking
                  ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }
                style={{ originX: "82px", originY: "192px" }}
              >
                {/* Shoulder sphere */}
                <circle cx="82" cy="192" r="12" fill="#3a3f4b" stroke={`${accentColor}20`} strokeWidth="1" />
                <circle cx="82" cy="192" r="4" fill={`${accentColor}15`} />
                
                {/* Upper arm */}
                <path d="M 73 200 Q 68 225 70 250 L 88 250 Q 90 225 87 200 Z" fill="url(#skinGrad)" />
                
                {/* Elbow */}
                <ellipse cx="79" cy="252" rx="10" ry="7" fill="#353a48" stroke={`${accentColor}20`} strokeWidth="0.8" />
                
                {/* Forearm */}
                <path d="M 71 257 Q 68 278 70 295 L 86 295 Q 88 278 85 257 Z" fill="url(#darkSkinGrad)" />
                
                {/* Wrist */}
                <rect x="70" y="293" width="16" height="4" rx="2" fill="#2a2e38" stroke={`${accentColor}15`} strokeWidth="0.5" />
                
                {/* Hand - natural curve */}
                <motion.g
                  animate={isSpeaking ? { rotate: [-15, 20, -10, 15, -15] } : { rotate: [0, -2, 0] }}
                  transition={{ duration: isSpeaking ? 1 : 4, repeat: Infinity }}
                  style={{ originX: "78px", originY: "298px" }}
                >
                  <path d="M 70 298 Q 66 305 70 312 Q 74 316 82 316 Q 88 316 90 312 Q 92 305 88 298 Z" fill="#3a3f4b" />
                  {/* Fingers suggestion */}
                  <path d="M 72 312 Q 70 318 72 320" fill="none" stroke="#44495a" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 77 314 Q 76 321 77 323" fill="none" stroke="#44495a" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 82 314 Q 83 321 82 323" fill="none" stroke="#44495a" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 87 312 Q 89 318 87 320" fill="none" stroke="#44495a" strokeWidth="1.5" strokeLinecap="round" />
                </motion.g>
              </motion.g>

              {/* ═══ RIGHT ARM ═══ */}
              <motion.g
                animate={isSpeaking
                  ? { rotate: [8, -12, 5, -15, 8] }
                  : { rotate: [0, 3, 0] }
                }
                transition={isSpeaking
                  ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
                }
                style={{ originX: "178px", originY: "192px" }}
              >
                <circle cx="178" cy="192" r="12" fill="#3a3f4b" stroke={`${accentColor}20`} strokeWidth="1" />
                <circle cx="178" cy="192" r="4" fill={`${accentColor}15`} />
                
                <path d="M 173 200 Q 170 225 172 250 L 188 250 Q 190 225 187 200 Z" fill="url(#skinGrad)" />
                <ellipse cx="180" cy="252" rx="10" ry="7" fill="#353a48" stroke={`${accentColor}20`} strokeWidth="0.8" />
                <path d="M 174 257 Q 172 278 174 295 L 188 295 Q 190 278 187 257 Z" fill="url(#darkSkinGrad)" />
                <rect x="174" y="293" width="16" height="4" rx="2" fill="#2a2e38" stroke={`${accentColor}15`} strokeWidth="0.5" />
                
                <motion.g
                  animate={isSpeaking ? { rotate: [15, -20, 10, -15, 15] } : { rotate: [0, 2, 0] }}
                  transition={{ duration: isSpeaking ? 1.2 : 4, repeat: Infinity }}
                  style={{ originX: "181px", originY: "298px" }}
                >
                  <path d="M 174 298 Q 172 305 174 312 Q 177 316 183 316 Q 189 316 191 312 Q 193 305 190 298 Z" fill="#3a3f4b" />
                  <path d="M 175 312 Q 173 318 175 320" fill="none" stroke="#44495a" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 180 314 Q 179 321 180 323" fill="none" stroke="#44495a" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 185 314 Q 186 321 185 323" fill="none" stroke="#44495a" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 189 312 Q 191 318 189 320" fill="none" stroke="#44495a" strokeWidth="1.5" strokeLinecap="round" />
                </motion.g>
              </motion.g>

              {/* ═══ NECK ═══ */}
              <path d="M 118 180 Q 115 170 118 162 L 142 162 Q 145 170 142 180 Z" fill="url(#darkSkinGrad)" />
              {/* Neck ring accent */}
              <rect x="119" y="168" width="22" height="3" rx="1.5" fill={`${accentColor}15`} />

              {/* ═══ HEAD ═══ */}
              <motion.g
                animate={isSpeaking
                  ? { rotate: [-2, 3, -1, 2, -2], y: [0, -1, 0, -0.5, 0] }
                  : { rotate: [0, 1, 0, -1, 0], y: [0, -0.5, 0] }
                }
                transition={isSpeaking
                  ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }
                style={{ originX: "130px", originY: "162px" }}
              >
                {/* Head shape - more human-like oval */}
                <ellipse cx="130" cy="128" rx="38" ry="42" fill="url(#faceGrad)" />
                
                {/* Face plate contour */}
                <ellipse cx="130" cy="130" rx="32" ry="35" fill="none" stroke={`${accentColor}10`} strokeWidth="0.8" />
                
                {/* Forehead panel line */}
                <path d="M 108 108 Q 130 98 152 108" fill="none" stroke={`${accentColor}12`} strokeWidth="0.8" />

                {/* ─── EYES ─── */}
                {/* Eye sockets */}
                <ellipse cx="115" cy="125" rx="14" ry="10" fill="#1e2028" />
                <ellipse cx="145" cy="125" rx="14" ry="10" fill="#1e2028" />
                
                {/* Eye whites / screens */}
                <ellipse cx="115" cy="125" rx="11" ry={blink ? 1 : 7.5} fill="#252830" />
                <ellipse cx="145" cy="125" rx="11" ry={blink ? 1 : 7.5} fill="#252830" />
                
                {/* Iris glow */}
                <motion.ellipse cx="115" cy="125" rx="6" ry={blink ? 0.5 : 5}
                  fill={accentColor} fillOpacity={isActive ? 0.8 : 0.5}
                  animate={isSpeaking ? { ry: [4, 5.5, 4], fillOpacity: [0.6, 1, 0.6] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
                <motion.ellipse cx="145" cy="125" rx="6" ry={blink ? 0.5 : 5}
                  fill={accentColor} fillOpacity={isActive ? 0.8 : 0.5}
                  animate={isSpeaking ? { ry: [4, 5.5, 4], fillOpacity: [0.6, 1, 0.6] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
                
                {/* Eye pupils */}
                <motion.circle cx="115" cy="125" r={blink ? 0.3 : 2.5} fill="white" fillOpacity="0.9" />
                <motion.circle cx="145" cy="125" r={blink ? 0.3 : 2.5} fill="white" fillOpacity="0.9" />
                
                {/* Eye highlight */}
                <circle cx="118" cy="122" r="1.5" fill="white" fillOpacity={blink ? 0 : 0.4} />
                <circle cx="148" cy="122" r="1.5" fill="white" fillOpacity={blink ? 0 : 0.4} />
                
                {/* Eyebrows - subtle */}
                <motion.path d="M 103 113 Q 115 108 127 113" fill="none" stroke="#555a6a" strokeWidth="2" strokeLinecap="round"
                  animate={isSpeaking ? { d: ["M 103 113 Q 115 108 127 113", "M 103 111 Q 115 106 127 111", "M 103 113 Q 115 108 127 113"] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.path d="M 133 113 Q 145 108 157 113" fill="none" stroke="#555a6a" strokeWidth="2" strokeLinecap="round"
                  animate={isSpeaking ? { d: ["M 133 113 Q 145 108 157 113", "M 133 111 Q 145 106 157 111", "M 133 113 Q 145 108 157 113"] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Nose - subtle line */}
                <path d="M 130 132 L 128 140 Q 130 142 132 140 Z" fill="#4a4f5e" fillOpacity="0.5" />

                {/* ─── MOUTH ─── */}
                <motion.path
                  d={isSpeaking ? undefined : "M 118 150 Q 124 154 130 154 Q 136 154 142 150"}
                  fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round"
                  strokeOpacity={isSpeaking ? 0.8 : 0.3}
                  animate={isSpeaking ? {
                    d: [
                      "M 118 150 Q 124 154 130 154 Q 136 154 142 150",
                      "M 118 148 Q 124 158 130 160 Q 136 158 142 148",
                      "M 118 150 Q 124 152 130 152 Q 136 152 142 150",
                      "M 118 149 Q 124 156 130 158 Q 136 156 142 149",
                      "M 118 150 Q 124 154 130 154 Q 136 154 142 150",
                    ],
                    strokeOpacity: [0.5, 0.9, 0.4, 0.8, 0.5],
                  } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
                {/* Mouth interior when speaking */}
                {isSpeaking && (
                  <motion.ellipse cx="130" cy="153" rx="8"
                    fill={`${accentColor}20`}
                    animate={{ ry: [1, 5, 2, 4, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}

                {/* ─── EARS ─── */}
                <ellipse cx="91" cy="128" rx="5" ry="12" fill="#353a48" stroke={`${accentColor}15`} strokeWidth="0.8" />
                <ellipse cx="169" cy="128" rx="5" ry="12" fill="#353a48" stroke={`${accentColor}15`} strokeWidth="0.8" />
                {/* Ear accent lights */}
                <motion.circle cx="91" cy="128" r="2" fill={accentColor}
                  animate={isActive ? { opacity: [0.3, 0.8, 0.3] } : { opacity: 0.15 }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <motion.circle cx="169" cy="128" r="2" fill={accentColor}
                  animate={isActive ? { opacity: [0.3, 0.8, 0.3] } : { opacity: 0.15 }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                />

                {/* ─── HAIR / TOP OF HEAD ─── */}
                {/* Smooth helmet-like top with subtle panels */}
                <path d="M 95 105 Q 95 80 130 75 Q 165 80 165 105" fill="none" stroke={`${accentColor}12`} strokeWidth="0.8" />
                
                {/* Antenna - sleek */}
                <line x1="130" y1="88" x2="130" y2="68" stroke="#555a6a" strokeWidth="2" strokeLinecap="round" />
                <motion.circle cx="130" cy="65" r="4" fill={`${accentColor}30`} stroke={accentColor} strokeWidth="1"
                  filter="url(#softGlow)"
                  animate={isActive
                    ? { r: [3, 5, 3], fillOpacity: [0.3, 0.7, 0.3] }
                    : { fillOpacity: [0.1, 0.3, 0.1] }
                  }
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.g>
            </motion.g>
          </motion.g>

          {/* Sound waves when speaking */}
          {isSpeaking && [0, 1, 2].map(i => (
            <motion.ellipse key={`sw${i}`} cx="130" cy="150"
              fill="none" stroke={`${accentColor}`} strokeWidth="0.8"
              animate={{ rx: [20 + i * 15, 40 + i * 20], ry: [10 + i * 8, 20 + i * 10], opacity: [0.3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.35 }}
            />
          ))}

          {/* Listening pulse from chest */}
          {isListening && [0, 1].map(i => (
            <motion.circle key={`lw${i}`} cx="130" cy="225"
              fill="none" stroke="#38bdf8" strokeWidth="1"
              animate={{ r: [15 + i * 12, 40 + i * 20], opacity: [0.3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </svg>
      </div>
    );
  }

  // Compact avatar for small sizes
  const sizes: Record<string, string> = { sm: "w-10 h-10", md: "w-20 h-20", lg: "w-32 h-32", xl: "w-44 h-44" };

  return (
    <div ref={ref} className={`relative ${sizes[size] || sizes.md} flex items-center justify-center`}>
      <motion.div className="absolute inset-[-12%] rounded-full"
        style={{ background: `radial-gradient(circle, ${accentColor}${isActive ? "40" : "15"} 0%, transparent 70%)` }}
        animate={{ scale: isActive ? [1, 1.12, 1] : [1, 1.03, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: isSpeaking ? 0.6 : 2.5, repeat: Infinity }}
      />
      {isActive && [0, 0.4].map(delay => (
        <motion.div key={delay} className="absolute inset-[-6%] rounded-full"
          style={{ border: `${delay === 0 ? 2 : 1}px solid ${accentColor}${delay === 0 ? "50" : "25"}` }}
          animate={{ scale: [1, 1.3 + delay], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay }}
        />
      ))}
      <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center"
        style={{ background: "#1e2028", border: `2px solid ${accentColor}${isActive ? "50" : "20"}` }}>
        <svg viewBox="0 0 60 60" className="w-[75%] h-[75%]">
          <ellipse cx="30" cy="28" rx="18" ry="20" fill="#353a48" />
          <ellipse cx="23" cy="26" rx="5" ry={blink ? 0.5 : 3.5} fill={accentColor} fillOpacity="0.7" />
          <ellipse cx="37" cy="26" rx="5" ry={blink ? 0.5 : 3.5} fill={accentColor} fillOpacity="0.7" />
          <circle cx="24" cy="25" r="1.2" fill="white" fillOpacity={blink ? 0 : 0.5} />
          <circle cx="38" cy="25" r="1.2" fill="white" fillOpacity={blink ? 0 : 0.5} />
          <motion.path
            d="M 23 35 Q 27 38 30 38 Q 33 38 37 35"
            fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round"
            strokeOpacity={isSpeaking ? 0.8 : 0.3}
            animate={isSpeaking ? { d: ["M 23 35 Q 27 38 30 38 Q 33 38 37 35", "M 23 34 Q 27 40 30 41 Q 33 40 37 34", "M 23 35 Q 27 38 30 38 Q 33 38 37 35"] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <line x1="30" y1="10" x2="30" y2="3" stroke="#555a6a" strokeWidth="1.5" strokeLinecap="round" />
          <motion.circle cx="30" cy="2" r="2" fill={accentColor} fillOpacity={isActive ? 0.6 : 0.2}
            animate={isActive ? { opacity: [0.4, 1, 0.4] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </svg>
      </div>
      {!isActive && (
        <motion.div className="absolute inset-0 rounded-full"
          style={{ boxShadow: `0 0 15px ${accentColor}20` }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
    </div>
  );
});

AIAvatar.displayName = "AIAvatar";

export default AIAvatar;
