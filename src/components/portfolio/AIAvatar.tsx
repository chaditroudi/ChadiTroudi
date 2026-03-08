import { motion } from "framer-motion";
import robotImg from "@/assets/robot-avatar.jpg";

interface AIAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const AIAvatar = ({ isSpeaking, isListening, size = "md" }: AIAvatarProps) => {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-20 h-20",
    lg: "w-32 h-32",
    xl: "w-44 h-44",
  };

  return (
    <div className={`relative ${sizes[size]} flex items-center justify-center`}>
      {/* Neon glow rings */}
      <motion.div
        className="absolute inset-[-15%] rounded-full"
        style={{
          background: isSpeaking
            ? "radial-gradient(circle, hsl(152 100% 50% / 0.4) 0%, hsl(180 100% 50% / 0.15) 40%, transparent 70%)"
            : isListening
            ? "radial-gradient(circle, hsl(200 100% 60% / 0.4) 0%, hsl(220 100% 50% / 0.15) 40%, transparent 70%)"
            : "radial-gradient(circle, hsl(152 80% 50% / 0.15) 0%, transparent 60%)",
        }}
        animate={{
          scale: isSpeaking ? [1, 1.2, 1] : isListening ? [1, 1.15, 1] : [1, 1.05, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: isSpeaking ? 0.5 : 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Neon pulse rings */}
      {(isSpeaking || isListening) && (
        <>
          <motion.div
            className="absolute inset-[-8%] rounded-full"
            style={{
              border: `2px solid ${isSpeaking ? "hsl(152 100% 50% / 0.5)" : "hsl(200 100% 60% / 0.5)"}`,
              boxShadow: isSpeaking
                ? "0 0 15px hsl(152 100% 50% / 0.3), inset 0 0 15px hsl(152 100% 50% / 0.1)"
                : "0 0 15px hsl(200 100% 60% / 0.3), inset 0 0 15px hsl(200 100% 60% / 0.1)",
            }}
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-[-8%] rounded-full"
            style={{
              border: `1px solid ${isSpeaking ? "hsl(152 100% 50% / 0.3)" : "hsl(200 100% 60% / 0.3)"}`,
            }}
            animate={{ scale: [1, 1.7], opacity: [0.4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          />
        </>
      )}

      {/* Neon border frame */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: isSpeaking
            ? "2px solid hsl(152 100% 50% / 0.7)"
            : isListening
            ? "2px solid hsl(200 100% 60% / 0.7)"
            : "2px solid hsl(152 80% 50% / 0.3)",
          boxShadow: isSpeaking
            ? "0 0 20px hsl(152 100% 50% / 0.4), 0 0 40px hsl(152 100% 50% / 0.2), inset 0 0 20px hsl(152 100% 50% / 0.1)"
            : isListening
            ? "0 0 20px hsl(200 100% 60% / 0.4), 0 0 40px hsl(200 100% 60% / 0.2), inset 0 0 20px hsl(200 100% 60% / 0.1)"
            : "0 0 10px hsl(152 80% 50% / 0.15)",
        }}
        animate={{
          boxShadow: isSpeaking
            ? [
                "0 0 20px hsl(152 100% 50% / 0.4), 0 0 40px hsl(152 100% 50% / 0.2)",
                "0 0 30px hsl(152 100% 50% / 0.6), 0 0 60px hsl(152 100% 50% / 0.3)",
                "0 0 20px hsl(152 100% 50% / 0.4), 0 0 40px hsl(152 100% 50% / 0.2)",
              ]
            : isListening
            ? [
                "0 0 20px hsl(200 100% 60% / 0.4), 0 0 40px hsl(200 100% 60% / 0.2)",
                "0 0 30px hsl(200 100% 60% / 0.6), 0 0 60px hsl(200 100% 60% / 0.3)",
                "0 0 20px hsl(200 100% 60% / 0.4), 0 0 40px hsl(200 100% 60% / 0.2)",
              ]
            : undefined,
        }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Robot image */}
      <motion.div
        className="relative w-full h-full rounded-full overflow-hidden"
        animate={{
          scale: isSpeaking ? [1, 1.02, 1] : 1,
        }}
        transition={{ duration: 0.6, repeat: Infinity }}
      >
        <img
          src={robotImg}
          alt="AI Tutor Robot"
          className="w-full h-full object-cover"
        />
        {/* Neon overlay when active */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: isSpeaking
              ? "linear-gradient(180deg, hsl(152 100% 50% / 0.05) 0%, hsl(152 100% 50% / 0.15) 100%)"
              : isListening
              ? "linear-gradient(180deg, hsl(200 100% 60% / 0.05) 0%, hsl(200 100% 60% / 0.15) 100%)"
              : "transparent",
          }}
          animate={{ opacity: isSpeaking || isListening ? [0.5, 1, 0.5] : 0 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>

      {/* Speaking equalizer overlay at bottom */}
      {isSpeaking && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-[2px]">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              className="w-[3px] rounded-full"
              style={{ background: "hsl(152 100% 50%)", boxShadow: "0 0 6px hsl(152 100% 50% / 0.6)" }}
              animate={{ height: [3, 12, 3] }}
              transition={{ duration: 0.35, repeat: Infinity, delay: i * 0.06 }}
            />
          ))}
        </div>
      )}

      {/* Listening wave indicator */}
      {isListening && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-[2px]">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              className="w-[3px] rounded-full"
              style={{ background: "hsl(200 100% 60%)", boxShadow: "0 0 6px hsl(200 100% 60% / 0.6)" }}
              animate={{ height: [2, 10, 2] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.08 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AIAvatar;
