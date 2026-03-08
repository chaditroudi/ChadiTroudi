import { motion } from "framer-motion";

interface AIAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  size?: "sm" | "md" | "lg";
}

const AIAvatar = ({ isSpeaking, isListening, size = "md" }: AIAvatarProps) => {
  const sizes = {
    sm: { container: "w-12 h-12", face: "w-10 h-10" },
    md: { container: "w-20 h-20", face: "w-16 h-16" },
    lg: { container: "w-28 h-28", face: "w-24 h-24" },
  };

  const s = sizes[size];

  return (
    <div className={`relative ${s.container} flex items-center justify-center`}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: isSpeaking
            ? "radial-gradient(circle, hsl(152 68% 46% / 0.4) 0%, transparent 70%)"
            : isListening
            ? "radial-gradient(circle, hsl(200 70% 50% / 0.4) 0%, transparent 70%)"
            : "radial-gradient(circle, hsl(152 68% 46% / 0.15) 0%, transparent 70%)",
        }}
        animate={{
          scale: isSpeaking ? [1, 1.3, 1] : isListening ? [1, 1.2, 1] : 1,
          opacity: isSpeaking || isListening ? [0.6, 1, 0.6] : 0.4,
        }}
        transition={{
          duration: isSpeaking ? 0.6 : 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Pulse rings when active */}
      {(isSpeaking || isListening) && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: isSpeaking
                ? "hsl(152 68% 46% / 0.3)"
                : "hsl(200 70% 50% / 0.3)",
            }}
            animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: isSpeaking
                ? "hsl(152 68% 46% / 0.2)"
                : "hsl(200 70% 50% / 0.2)",
            }}
            animate={{ scale: [1, 2], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
        </>
      )}

      {/* Face container */}
      <motion.div
        className={`${s.face} rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center relative overflow-hidden`}
        animate={{
          borderColor: isSpeaking
            ? ["hsl(152 68% 46% / 0.5)", "hsl(152 68% 46% / 0.8)", "hsl(152 68% 46% / 0.5)"]
            : isListening
            ? ["hsl(200 70% 50% / 0.5)", "hsl(200 70% 50% / 0.8)", "hsl(200 70% 50% / 0.5)"]
            : "hsl(152 68% 46% / 0.3)",
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {/* Inner gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />

        {/* Face SVG */}
        <svg viewBox="0 0 100 100" className="relative w-full h-full p-2">
          {/* Head shape */}
          <circle cx="50" cy="45" r="28" fill="hsl(30 40% 75%)" />
          
          {/* Hair */}
          <path
            d="M22 40 Q22 18 50 15 Q78 18 78 40 Q75 25 50 22 Q25 25 22 40Z"
            fill="hsl(20 30% 20%)"
          />
          
          {/* Left eye */}
          <motion.ellipse
            cx="40"
            cy="40"
            rx="4"
            ry={isSpeaking ? 3.5 : 4}
            fill="hsl(20 30% 20%)"
            animate={
              isSpeaking
                ? { ry: [4, 3, 4] }
                : { ry: 4 }
            }
            transition={{ duration: 0.3, repeat: isSpeaking ? Infinity : 0 }}
          />
          
          {/* Right eye */}
          <motion.ellipse
            cx="60"
            cy="40"
            rx="4"
            ry={isSpeaking ? 3.5 : 4}
            fill="hsl(20 30% 20%)"
            animate={
              isSpeaking
                ? { ry: [4, 3, 4] }
                : { ry: 4 }
            }
            transition={{ duration: 0.3, repeat: isSpeaking ? Infinity : 0, delay: 0.05 }}
          />
          
          {/* Eye shine */}
          <circle cx="42" cy="38" r="1.5" fill="white" opacity="0.8" />
          <circle cx="62" cy="38" r="1.5" fill="white" opacity="0.8" />
          
          {/* Eyebrows */}
          <motion.path
            d="M34 33 Q40 30 46 33"
            stroke="hsl(20 30% 20%)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            animate={isListening ? { d: "M34 31 Q40 28 46 31" } : {}}
          />
          <motion.path
            d="M54 33 Q60 30 66 33"
            stroke="hsl(20 30% 20%)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            animate={isListening ? { d: "M54 31 Q60 28 66 31" } : {}}
          />

          {/* Nose */}
          <path
            d="M48 46 Q50 49 52 46"
            stroke="hsl(20 20% 55%)"
            strokeWidth="1"
            fill="none"
          />

          {/* Mouth - animates when speaking */}
          <motion.path
            d={isSpeaking ? "M40 55 Q50 62 60 55" : "M40 55 Q50 60 60 55"}
            stroke="hsl(0 50% 55%)"
            strokeWidth="2"
            fill={isSpeaking ? "hsl(0 40% 40%)" : "none"}
            strokeLinecap="round"
            animate={
              isSpeaking
                ? {
                    d: [
                      "M40 55 Q50 62 60 55",
                      "M42 55 Q50 58 58 55",
                      "M40 55 Q50 65 60 55",
                      "M42 55 Q50 57 58 55",
                      "M40 55 Q50 62 60 55",
                    ],
                  }
                : {}
            }
            transition={{
              duration: 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Smile lines */}
          {!isSpeaking && (
            <>
              <path d="M38 54 Q37 56 38 58" stroke="hsl(20 20% 65%)" strokeWidth="0.8" fill="none" />
              <path d="M62 54 Q63 56 62 58" stroke="hsl(20 20% 65%)" strokeWidth="0.8" fill="none" />
            </>
          )}

          {/* Neck */}
          <rect x="44" y="70" width="12" height="8" rx="2" fill="hsl(30 40% 75%)" />
          
          {/* Shirt collar */}
          <path d="M35 78 Q50 82 65 78 L68 95 L32 95Z" fill="hsl(152 68% 46%)" />
          <path d="M44 78 L50 85 L56 78" stroke="hsl(152 68% 30%)" strokeWidth="1" fill="none" />
        </svg>

        {/* Listening indicator */}
        {isListening && (
          <motion.div
            className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-blue-400 rounded-full"
                animate={{ height: [2, 8, 2] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AIAvatar;
