import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { useAIAssistant } from "../hooks/use-ai-assistant";
import { AIChatPanel } from "./AIChatPanel";

export const AIFloatingWidget = () => {
  const { isPanelOpen, togglePanel, closePanel, isDemoMode, avatarState, messages } = useAIAssistant();
  const hasMessages = messages.filter(m => m.role === "user").length > 0;

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isPanelOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePanel}
            className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center group"
          >
            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />

            {/* Notification dot */}
            {avatarState !== "idle" && (
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-background"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}

            {/* Unread indicator */}
            {hasMessages && (
              <div className="absolute -top-0.5 -left-0.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-background" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[91] md:hidden"
              onClick={closePanel}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-[92] w-full md:w-[420px] h-[100dvh] md:h-[600px] md:max-h-[85vh] md:rounded-2xl overflow-hidden border border-border bg-background shadow-2xl"
            >
              {/* Close bar */}
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={closePanel}
                  className="w-7 h-7 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <AIChatPanel mode="compact" showAvatar={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
