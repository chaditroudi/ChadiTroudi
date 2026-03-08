import { motion } from "framer-motion";

interface AIAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const AIAvatar = ({ isSpeaking, isListening, size = "md" }: AIAvatarProps) => {
  const sizes = {
    sm: { container: "w-12 h-12", svg: 60 },
    md: { container: "w-24 h-24", svg: 100 },
    lg: { container: "w-36 h-36", svg: 150 },
    xl: { container: "w-52 h-52", svg: 220 },
  };

  const s = sizes[size];

  return (
    <div className={`relative ${s.container} flex items-center justify-center`}>
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-[-20%] rounded-full"
        style={{
          background: isSpeaking
            ? "radial-gradient(circle, hsl(152 68% 46% / 0.35) 0%, hsl(180 60% 40% / 0.1) 50%, transparent 70%)"
            : isListening
            ? "radial-gradient(circle, hsl(200 80% 55% / 0.35) 0%, transparent 70%)"
            : "radial-gradient(circle, hsl(152 68% 46% / 0.1) 0%, transparent 70%)",
        }}
        animate={{
          scale: isSpeaking ? [1, 1.15, 1] : isListening ? [1, 1.1, 1] : [1, 1.03, 1],
          opacity: isSpeaking ? [0.7, 1, 0.7] : [0.4, 0.6, 0.4],
        }}
        transition={{ duration: isSpeaking ? 0.5 : 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pulse rings when active */}
      {(isSpeaking || isListening) && (
        <>
          <motion.div
            className="absolute inset-[-10%] rounded-full border"
            style={{ borderColor: isSpeaking ? "hsl(152 68% 46% / 0.25)" : "hsl(200 70% 50% / 0.25)" }}
            animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-[-10%] rounded-full border"
            style={{ borderColor: isSpeaking ? "hsl(152 68% 46% / 0.15)" : "hsl(200 70% 50% / 0.15)" }}
            animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }}
          />
        </>
      )}

      {/* Robot SVG */}
      <motion.svg
        viewBox="0 0 200 240"
        className="relative w-full h-full drop-shadow-lg"
        animate={{
          // Subtle body sway
          rotate: isSpeaking ? [0, -1.5, 1.5, 0] : isListening ? [0, -1, 1, 0] : 0,
          y: isSpeaking ? [0, -2, 0] : [0, -1, 0],
        }}
        transition={{
          duration: isSpeaking ? 1.2 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <defs>
          {/* Robot body gradient */}
          <linearGradient id="robotBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(210 15% 55%)" />
            <stop offset="100%" stopColor="hsl(210 15% 35%)" />
          </linearGradient>
          <linearGradient id="robotHead" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(210 15% 65%)" />
            <stop offset="100%" stopColor="hsl(210 15% 45%)" />
          </linearGradient>
          <linearGradient id="screenGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(152 68% 46% / 0.15)" />
            <stop offset="100%" stopColor="hsl(180 50% 40% / 0.05)" />
          </linearGradient>
          <radialGradient id="eyeGlow">
            <stop offset="0%" stopColor="hsl(152 80% 60%)" />
            <stop offset="70%" stopColor="hsl(152 68% 46%)" />
            <stop offset="100%" stopColor="hsl(152 60% 35%)" />
          </radialGradient>
          <radialGradient id="eyeGlowBlue">
            <stop offset="0%" stopColor="hsl(200 90% 65%)" />
            <stop offset="70%" stopColor="hsl(200 80% 55%)" />
            <stop offset="100%" stopColor="hsl(200 70% 40%)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* === ANTENNA === */}
        <motion.g
          animate={isSpeaking ? { rotate: [0, -8, 8, 0] } : isListening ? { rotate: [0, -5, 5, 0] } : {}}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ originX: "100px", originY: "30px" }}
        >
          <line x1="100" y1="30" x2="100" y2="8" stroke="hsl(210 15% 50%)" strokeWidth="3" strokeLinecap="round" />
          <motion.circle
            cx="100" cy="6" r="5"
            fill={isListening ? "url(#eyeGlowBlue)" : "url(#eyeGlow)"}
            filter="url(#glow)"
            animate={{
              r: isSpeaking ? [5, 6.5, 5] : isListening ? [5, 7, 5] : [5, 5.5, 5],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: isSpeaking ? 0.4 : 1.5, repeat: Infinity }}
          />
        </motion.g>

        {/* === HEAD === */}
        <motion.g
          filter="url(#softShadow)"
          animate={{
            // Head tilt when speaking
            rotate: isSpeaking ? [0, -2, 2, -1, 0] : 0,
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "100px", originY: "70px" }}
        >
          {/* Head shape */}
          <rect x="55" y="30" width="90" height="75" rx="18" fill="url(#robotHead)" />
          {/* Head rim */}
          <rect x="55" y="30" width="90" height="75" rx="18" fill="none" stroke="hsl(210 10% 75%)" strokeWidth="1.5" />
          {/* Face screen area */}
          <rect x="63" y="38" width="74" height="55" rx="12" fill="hsl(210 20% 15%)" />
          <rect x="63" y="38" width="74" height="55" rx="12" fill="url(#screenGlow)" />

          {/* === EYES === */}
          {/* Left eye */}
          <motion.g
            animate={
              isSpeaking
                ? { scaleY: [1, 0.85, 1, 0.9, 1] }
                : {}
            }
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ originX: "85px", originY: "58px" }}
          >
            <motion.circle
              cx="85" cy="58" r="10"
              fill={isListening ? "url(#eyeGlowBlue)" : "url(#eyeGlow)"}
              filter="url(#glow)"
              animate={{
                r: isSpeaking ? [10, 11, 9, 10] : [10, 10.5, 10],
              }}
              transition={{ duration: isSpeaking ? 0.6 : 2, repeat: Infinity }}
            />
            {/* Pupil */}
            <motion.circle
              cx="85" cy="58" r="4"
              fill="hsl(210 20% 10%)"
              animate={
                isListening
                  ? { cx: [85, 83, 87, 85] }
                  : isSpeaking
                  ? { cy: [58, 57, 59, 58] }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Eye shine */}
            <circle cx="88" cy="55" r="2.5" fill="white" opacity="0.7" />
          </motion.g>

          {/* Right eye */}
          <motion.g
            animate={
              isSpeaking
                ? { scaleY: [1, 0.9, 1, 0.85, 1] }
                : {}
            }
            transition={{ duration: 0.5, repeat: Infinity, delay: 0.05 }}
            style={{ originX: "115px", originY: "58px" }}
          >
            <motion.circle
              cx="115" cy="58" r="10"
              fill={isListening ? "url(#eyeGlowBlue)" : "url(#eyeGlow)"}
              filter="url(#glow)"
              animate={{
                r: isSpeaking ? [10, 9, 11, 10] : [10, 10.5, 10],
              }}
              transition={{ duration: isSpeaking ? 0.6 : 2, repeat: Infinity, delay: 0.1 }}
            />
            {/* Pupil */}
            <motion.circle
              cx="115" cy="58" r="4"
              fill="hsl(210 20% 10%)"
              animate={
                isListening
                  ? { cx: [115, 113, 117, 115] }
                  : isSpeaking
                  ? { cy: [58, 57, 59, 58] }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Eye shine */}
            <circle cx="118" cy="55" r="2.5" fill="white" opacity="0.7" />
          </motion.g>

          {/* === EYEBROWS === */}
          <motion.rect
            x="74" y="44" width="22" height="3" rx="1.5"
            fill="hsl(152 68% 46% / 0.6)"
            animate={
              isListening
                ? { y: [44, 42, 44], rotate: [0, -5, 0] }
                : isSpeaking
                ? { y: [44, 43, 44] }
                : {}
            }
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.rect
            x="104" y="44" width="22" height="3" rx="1.5"
            fill="hsl(152 68% 46% / 0.6)"
            animate={
              isListening
                ? { y: [44, 42, 44], rotate: [0, 5, 0] }
                : isSpeaking
                ? { y: [44, 43, 44] }
                : {}
            }
            transition={{ duration: 1, repeat: Infinity }}
          />

          {/* === MOUTH / SPEAKER === */}
          <motion.g>
            {/* Speaker grille background */}
            <rect x="82" y="74" width="36" height="12" rx="6" fill="hsl(210 20% 12%)" />
            
            {/* Sound bars - animate when speaking */}
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.rect
                key={i}
                x={87 + i * 6}
                y={76}
                width="2.5"
                height="8"
                rx="1"
                fill={isSpeaking ? "hsl(152 68% 46%)" : "hsl(152 68% 46% / 0.3)"}
                animate={
                  isSpeaking
                    ? {
                        height: [3, 8, 4, 7, 3],
                        y: [78.5, 76, 78, 76.5, 78.5],
                      }
                    : { height: 3, y: 78.5 }
                }
                transition={{
                  duration: 0.35,
                  repeat: Infinity,
                  delay: i * 0.07,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.g>

          {/* Ear pieces */}
          <rect x="47" y="52" width="10" height="20" rx="4" fill="hsl(210 15% 50%)" />
          <rect x="143" y="52" width="10" height="20" rx="4" fill="hsl(210 15% 50%)" />
          {/* Ear lights */}
          <motion.circle
            cx="52" cy="62" r="3"
            fill={isListening ? "hsl(200 80% 55%)" : "hsl(152 68% 46% / 0.4)"}
            filter={isListening ? "url(#glow)" : undefined}
            animate={isListening ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <motion.circle
            cx="148" cy="62" r="3"
            fill={isListening ? "hsl(200 80% 55%)" : "hsl(152 68% 46% / 0.4)"}
            filter={isListening ? "url(#glow)" : undefined}
            animate={isListening ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
          />
        </motion.g>

        {/* === NECK === */}
        <rect x="88" y="105" width="24" height="15" rx="4" fill="hsl(210 15% 45%)" />
        {/* Neck joint rings */}
        <rect x="85" y="108" width="30" height="3" rx="1.5" fill="hsl(210 10% 55%)" />
        <rect x="85" y="114" width="30" height="3" rx="1.5" fill="hsl(210 10% 55%)" />

        {/* === BODY === */}
        <motion.g
          animate={{
            y: isSpeaking ? [0, -1, 0] : 0,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Torso */}
          <rect x="55" y="118" width="90" height="70" rx="14" fill="url(#robotBody)" filter="url(#softShadow)" />
          <rect x="55" y="118" width="90" height="70" rx="14" fill="none" stroke="hsl(210 10% 60%)" strokeWidth="1" />
          
          {/* Chest plate / core */}
          <rect x="72" y="128" width="56" height="40" rx="8" fill="hsl(210 20% 18%)" />
          
          {/* Core energy light */}
          <motion.circle
            cx="100" cy="148" r="12"
            fill={isSpeaking ? "hsl(152 68% 46% / 0.3)" : isListening ? "hsl(200 80% 55% / 0.3)" : "hsl(152 68% 46% / 0.15)"}
            filter="url(#glow)"
            animate={{
              r: isSpeaking ? [12, 14, 12] : [12, 13, 12],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: isSpeaking ? 0.6 : 2, repeat: Infinity }}
          />
          <motion.circle
            cx="100" cy="148" r="6"
            fill={isSpeaking ? "hsl(152 80% 55%)" : isListening ? "hsl(200 80% 60%)" : "hsl(152 68% 46%)"}
            filter="url(#glow)"
            animate={{
              r: isSpeaking ? [6, 7.5, 6] : [6, 6.5, 6],
            }}
            transition={{ duration: isSpeaking ? 0.4 : 2, repeat: Infinity }}
          />

          {/* Chest status bars */}
          {[0, 1, 2].map((i) => (
            <motion.rect
              key={`bar-${i}`}
              x={78 + i * 16}
              y="170"
              width="10"
              height="3"
              rx="1.5"
              fill="hsl(152 68% 46% / 0.5)"
              animate={isSpeaking ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.4 }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}

          {/* === ARMS === */}
          {/* Left arm */}
          <motion.g
            animate={
              isSpeaking
                ? { rotate: [0, -5, 3, -2, 0] }
                : isListening
                ? { rotate: [0, -3, 0] }
                : {}
            }
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "55px", originY: "128px" }}
          >
            <rect x="32" y="125" width="22" height="50" rx="10" fill="hsl(210 15% 50%)" />
            {/* Shoulder joint */}
            <circle cx="55" cy="128" r="8" fill="hsl(210 15% 55%)" />
            <circle cx="55" cy="128" r="4" fill="hsl(210 15% 45%)" />
            {/* Hand */}
            <circle cx="43" cy="178" r="9" fill="hsl(210 15% 55%)" />
            <circle cx="43" cy="178" r="5" fill="hsl(210 15% 45%)" />
          </motion.g>

          {/* Right arm */}
          <motion.g
            animate={
              isSpeaking
                ? { rotate: [0, 5, -3, 2, 0] }
                : isListening
                ? { rotate: [0, 3, 0] }
                : {}
            }
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            style={{ originX: "145px", originY: "128px" }}
          >
            <rect x="146" y="125" width="22" height="50" rx="10" fill="hsl(210 15% 50%)" />
            {/* Shoulder joint */}
            <circle cx="145" cy="128" r="8" fill="hsl(210 15% 55%)" />
            <circle cx="145" cy="128" r="4" fill="hsl(210 15% 45%)" />
            {/* Hand */}
            <circle cx="157" cy="178" r="9" fill="hsl(210 15% 55%)" />
            <circle cx="157" cy="178" r="5" fill="hsl(210 15% 45%)" />
          </motion.g>
        </motion.g>

        {/* Listening indicator under robot */}
        {isListening && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <motion.rect
                key={i}
                x={72 + i * 8}
                y="200"
                width="4"
                height="6"
                rx="2"
                fill="hsl(200 80% 55%)"
                animate={{ height: [4, 14, 4], y: [202, 196, 202] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.08 }}
              />
            ))}
          </motion.g>
        )}
      </motion.svg>
    </div>
  );
};

export default AIAvatar;
