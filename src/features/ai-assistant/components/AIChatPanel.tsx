import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Mic, MicOff, Volume2, VolumeX, RotateCcw,
  Trash2, Settings2, ChevronDown, Sparkles, Bot,
  Wifi, WifiOff, Pause, Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAIAssistant } from "../hooks/use-ai-assistant";
import { AIAvatar } from "../avatar/AIAvatar";
import { ToolResultRenderer } from "./AIResultCards";

const SUGGESTED_PROMPTS = [
  { label: "Explain this lesson", action: "explain" },
  { label: "Quiz me", action: "quiz" },
  { label: "Create flashcards", action: "flashcards" },
  { label: "Build study plan", action: "study-plan" },
  { label: "Find weak areas", action: "weak-areas" },
  { label: "Recommend next skill", action: "recommend-skill" },
  { label: "Summarize notes", action: "summarize" },
];

/** Simple markdown-lite renderer */
const MessageContent = ({ content }: { content: string }) => {
  const lines = content.split("\n");
  return (
    <div className="text-sm leading-relaxed space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("```")) return null;
        if (line.startsWith("# ")) return <h3 key={i} className="text-base font-bold text-foreground mt-2">{line.slice(2)}</h3>;
        if (line.startsWith("## ")) return <h4 key={i} className="text-sm font-bold text-foreground mt-1.5">{line.slice(3)}</h4>;
        if (line.startsWith("- ")) return <li key={i} className="ml-3 list-disc">{renderInline(line.slice(2))}</li>;
        if (line.trim() === "") return <br key={i} />;
        return <p key={i}>{renderInline(line)}</p>;
      })}
    </div>
  );
};

function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-primary">{part.slice(1, -1)}</code>;
    return <span key={i}>{part}</span>;
  });
}

interface AIChatPanelProps {
  mode?: "full" | "compact";
  showAvatar?: boolean;
  context?: Record<string, unknown>;
}

export const AIChatPanel = ({ mode = "full", showAvatar = true, context }: AIChatPanelProps) => {
  const {
    messages,
    isStreaming,
    sendMessage,
    clearChat,
    stopStreaming,
    activeProvider,
    setActiveProvider,
    providerStatuses,
    isDemoMode,
    avatarState,
    isListening,
    startListening,
    stopListening,
    isSpeaking,
    speak,
    stopSpeaking,
    replayLast,
    quickAction,
    avatarConfig,
    updateAvatarConfig,
  } = useAIAssistant();

  const [input, setInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    sendMessage(text, context as any);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const userMessages = messages.filter(m => m.role === "user" || m.role === "assistant");

  return (
    <div className={`flex flex-col bg-background ${mode === "full" ? "h-full" : "h-[500px]"}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
        <div className="flex items-center gap-3">
          {showAvatar && <AIAvatar size="sm" showLabel={false} showWaves={false} />}
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> AI Assistant
            </h3>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isDemoMode ? "bg-amber-500" : "bg-primary"}`} />
              <span className="text-[10px] text-muted-foreground">
                {providerStatuses.find(p => p.provider === activeProvider)?.label || "Demo"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Voice controls */}
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7"
            onClick={isSpeaking ? stopSpeaking : replayLast}
            title={isSpeaking ? "Stop speaking" : "Replay last"}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7"
            onClick={() => setShowSettings(s => !s)}
          >
            <Settings2 className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={clearChat} title="Clear chat">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Settings dropdown */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border"
          >
            <div className="p-3 space-y-3 bg-card/30">
              {/* Provider selector */}
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1.5">AI Provider</p>
                <div className="flex gap-1.5">
                  {providerStatuses.map(p => (
                    <button
                      key={p.provider}
                      onClick={() => p.available && setActiveProvider(p.provider)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeProvider === p.provider
                          ? "bg-primary text-primary-foreground"
                          : p.available
                          ? "bg-muted text-foreground hover:bg-muted/80"
                          : "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                      }`}
                    >
                      {p.available ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Voice settings */}
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1.5">Voice</p>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={avatarConfig.autoSpeak}
                      onChange={e => updateAvatarConfig({ autoSpeak: e.target.checked })}
                      className="rounded border-border"
                    />
                    Auto-speak
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Speed:</span>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.25"
                      value={avatarConfig.voiceSpeed}
                      onChange={e => updateAvatarConfig({ voiceSpeed: parseFloat(e.target.value) })}
                      className="w-20 h-1"
                    />
                    <span className="text-xs text-foreground font-mono w-6">{avatarConfig.voiceSpeed}x</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {userMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            {showAvatar && <AIAvatar size="lg" className="mb-4" />}
            <h3 className="text-lg font-bold text-foreground mb-1">Hi! I'm your AI Study Coach</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-5">
              {isDemoMode
                ? "Running in demo mode — try any feature below!"
                : "Ask me anything, or try a quick action below."}
            </p>
            {isDemoMode && (
              <Badge variant="outline" className="mb-4 text-amber-500 border-amber-500/30 bg-amber-500/5">
                <WifiOff className="w-3 h-3 mr-1" /> Demo Mode — No API configured
              </Badge>
            )}
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {SUGGESTED_PROMPTS.map(p => (
                <button
                  key={p.action}
                  onClick={() => quickAction(p.action)}
                  className="px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 text-xs font-medium text-foreground transition-colors border border-border hover:border-primary/30"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          userMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" && msg.content === "" && isStreaming ? (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <motion.div className="w-1.5 h-1.5 bg-primary rounded-full" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                      <motion.div className="w-1.5 h-1.5 bg-primary rounded-full" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                      <motion.div className="w-1.5 h-1.5 bg-primary rounded-full" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                    </div>
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                ) : msg.toolResult ? (
                  <ToolResultRenderer result={msg.toolResult} />
                ) : msg.role === "assistant" ? (
                  <div>
                    <MessageContent content={msg.content} />
                    {!isStreaming && (
                      <button
                        onClick={() => speak(msg.content)}
                        className="mt-2 text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3" /> Listen
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
            </motion.div>
          ))
        )}

        {isStreaming && (
          <div className="flex justify-center">
            <Button onClick={stopStreaming} variant="outline" size="sm" className="gap-1 text-xs">
              <Pause className="w-3 h-3" /> Stop
            </Button>
          </div>
        )}
      </div>

      {/* Suggested chips when chat has messages */}
      {userMessages.length > 0 && !isStreaming && (
        <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto">
          {SUGGESTED_PROMPTS.slice(0, 4).map(p => (
            <button
              key={p.action}
              onClick={() => quickAction(p.action)}
              className="shrink-0 px-2.5 py-1 rounded-full bg-muted/50 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-border bg-card/50 p-3">
        <div className="flex items-end gap-2">
          {/* Mic button */}
          <Button
            variant={isListening ? "default" : "outline"}
            size="icon"
            className={`shrink-0 w-9 h-9 ${isListening ? "bg-blue-500 hover:bg-blue-600 animate-pulse" : ""}`}
            onClick={isListening ? stopListening : startListening}
            title={isListening ? "Stop listening" : "Voice input"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening..." : "Ask me anything..."}
              rows={1}
              className="w-full resize-none bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 max-h-32"
              style={{ minHeight: "40px" }}
            />
          </div>

          {/* Send button */}
          <Button
            size="icon"
            className="shrink-0 w-9 h-9"
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Provider badge */}
        <div className="flex items-center justify-center mt-2">
          <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
            <Bot className="w-3 h-3" />
            {isDemoMode ? "Demo mode" : `Powered by ${providerStatuses.find(p => p.provider === activeProvider)?.label}`}
          </span>
        </div>
      </div>
    </div>
  );
};
