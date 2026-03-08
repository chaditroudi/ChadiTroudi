import { motion } from "framer-motion";
import tutorAvatar from "@/assets/tutor-avatar.png";

interface HumanAvatar3DProps {
  isSpeaking: boolean;
  isListening: boolean;
  isThinking?: boolean;
}

const HumanAvatar3D = ({ isSpeaking, isListening, isThinking = false }: HumanAvatar3DProps) => {
  const stateColor = isSpeaking ? "#22c55e" : isListening ? "#3b82f6" : isThinking ? "#f59e0b" : "#6b7280";

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none" style={{ minHeight: "280px" }}>
      {/* Ambient glow */}
      <motion.div
        className="absolute rounded-full blur-[80px] pointer-events-none"
        style={{ width: 180, height: 180, background: stateColor, opacity: 0.15 }}
        animate={isSpeaking || isListening ? { scale: [1, 1.4, 1], opacity: [0.1, 0.25, 0.1] } : { opacity: 0.08 }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Avatar container */}
      <div className="relative flex flex-col items-center">
        {/* Sound waves when speaking */}
        {isSpeaking && [0, 1, 2].map(i => (
          <motion.div
            key={`wave-${i}`}
            className="absolute rounded-full border-2 pointer-events-none"
            style={{ borderColor: stateColor, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
            animate={{ width: [80 + i * 30, 140 + i * 40], height: [80 + i * 30, 140 + i * 40], opacity: [0.4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}

        {/* Listening pulse rings */}
        {isListening && [0, 1].map(i => (
          <motion.div
            key={`pulse-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{ background: `${stateColor}20`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
            animate={{ width: [100 + i * 20, 180 + i * 30], height: [100 + i * 20, 180 + i * 30], opacity: [0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
          />
        ))}

        {/* Thinking dots */}
        {isThinking && (
          <div className="absolute -top-8 flex gap-2">
            {[0, 1, 2].map(i => (
              <motion.div
                key={`dot-${i}`}
                className="w-3 h-3 rounded-full"
                style={{ background: stateColor }}
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        )}

        {/* Avatar image with state-based ring */}
        <motion.div
          className="relative rounded-full overflow-hidden"
          style={{
            width: 160,
            height: 160,
            boxShadow: `0 0 40px ${stateColor}40, 0 0 80px ${stateColor}15`,
            border: `3px solid ${stateColor}`,
          }}
          animate={isSpeaking
            ? { scale: [1, 1.03, 1, 1.02, 1] }
            : isListening
            ? { scale: [1, 1.02, 1] }
            : { scale: 1 }
          }
          transition={{
            duration: isSpeaking ? 0.6 : 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <img
            src={tutorAvatar}
            alt="AI Coding Tutor"
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* Speaking mouth overlay animation */}
          {isSpeaking && (
            <motion.div
              className="absolute bottom-0 left-0 right-0"
              style={{ background: "linear-gradient(to top, rgba(34,197,94,0.15), transparent)", height: "30%" }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Status indicator dot */}
        <motion.div
          className="absolute -bottom-1 right-1/2 translate-x-1/2 w-4 h-4 rounded-full border-2"
          style={{
            background: stateColor,
            borderColor: "hsl(222 22% 7%)",
            boxShadow: `0 0 12px ${stateColor}80`,
          }}
          animate={isSpeaking || isListening ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* Audio level bars when speaking */}
        {isSpeaking && (
          <div className="flex gap-1 mt-4 items-end h-6">
            {[0, 1, 2, 3, 4].map(i => (
              <motion.div
                key={`bar-${i}`}
                className="w-1.5 rounded-full"
                style={{ background: stateColor }}
                animate={{ height: [4, 12 + Math.random() * 12, 4] }}
                transition={{ duration: 0.3 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HumanAvatar3D;
