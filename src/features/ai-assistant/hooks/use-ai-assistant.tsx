import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import type {
  AIMessage,
  AIProviderType,
  AIProviderStatus,
  AvatarState,
  AvatarConfig,
  AIRequestContext,
  AIToolType,
  AIToolResult,
  ChatSession,
} from "../types";
import { openaiProvider, deepseekProvider, mockAiProvider, type AIProvider } from "../providers";

// ─── Provider availability check ───
async function checkProvider(type: AIProviderType): Promise<boolean> {
  if (type === "mock") return true;
  try {
    const baseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string;
    const res = await fetch(`${baseUrl}/functions/v1/ai-assistant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
      },
      body: JSON.stringify({ provider: type, messages: [{ role: "user", content: "ping" }] }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function getProvider(type: AIProviderType): AIProvider {
  switch (type) {
    case "openai": return openaiProvider;
    case "deepseek": return deepseekProvider;
    default: return mockAiProvider;
  }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ─── Context Type ───
interface AIAssistantContextType {
  // Chat
  messages: AIMessage[];
  isStreaming: boolean;
  sendMessage: (content: string, context?: AIRequestContext) => Promise<void>;
  generateTool: (type: AIToolType, prompt: string, context?: AIRequestContext) => Promise<AIToolResult | null>;
  clearChat: () => void;
  stopStreaming: () => void;

  // Provider
  activeProvider: AIProviderType;
  setActiveProvider: (p: AIProviderType) => void;
  providerStatuses: AIProviderStatus[];
  isDemoMode: boolean;

  // Avatar
  avatarState: AvatarState;
  avatarConfig: AvatarConfig;
  updateAvatarConfig: (cfg: Partial<AvatarConfig>) => void;

  // Voice
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  isSpeaking: boolean;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  replayLast: () => void;

  // Panel
  isPanelOpen: boolean;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;

  // Quick actions
  quickAction: (action: string, context?: AIRequestContext) => Promise<void>;
}

const AIAssistantContext = createContext<AIAssistantContextType | null>(null);

export const useAIAssistant = () => {
  const ctx = useContext(AIAssistantContext);
  if (!ctx) throw new Error("useAIAssistant must be used within AIAssistantProvider");
  return ctx;
};

// ─── Provider ───
export const AIAssistantProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeProvider, setActiveProvider] = useState<AIProviderType>("mock");
  const [providerStatuses, setProviderStatuses] = useState<AIProviderStatus[]>([
    { provider: "openai", available: false, label: "OpenAI", model: "gpt-4o-mini" },
    { provider: "deepseek", available: false, label: "DeepSeek", model: "deepseek-chat" },
    { provider: "mock", available: true, label: "Demo Mode", model: "demo" },
  ]);
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    voiceEnabled: true,
    voiceSpeed: 1,
    autoSpeak: false,
  });
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const lastResponseRef = useRef<string>("");
  const abortRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  const isDemoMode = activeProvider === "mock";

  // ─── Pre-load TTS voices (Chrome loads them async) ───
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      if (resumeTimerRef.current) clearInterval(resumeTimerRef.current);
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* ignore */ }
      }
    };
  }, []);

  // ─── Check providers on mount (only once) ───
  useState(() => {
    (async () => {
      const results = await Promise.allSettled([
        checkProvider("openai"),
        checkProvider("deepseek"),
      ]);
      const openaiOk = results[0].status === "fulfilled" && results[0].value;
      const deepseekOk = results[1].status === "fulfilled" && results[1].value;

      setProviderStatuses([
        { provider: "openai", available: openaiOk, label: "OpenAI", model: "gpt-4o-mini" },
        { provider: "deepseek", available: deepseekOk, label: "DeepSeek", model: "deepseek-chat" },
        { provider: "mock", available: true, label: "Demo Mode", model: "demo" },
      ]);

      // Auto-select best available
      if (openaiOk) setActiveProvider("openai");
      else if (deepseekOk) setActiveProvider("deepseek");
      else setActiveProvider("mock");
    })();
  });

  // ─── Send message ───
  const sendMessage = useCallback(
    async (content: string, context?: AIRequestContext) => {
      const userMsg: AIMessage = { id: uid(), role: "user", content, timestamp: Date.now() };
      const assistantMsg: AIMessage = { id: uid(), role: "assistant", content: "", timestamp: Date.now() };

      setMessages(prev => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);
      setAvatarState("thinking");

      const provider = getProvider(activeProvider);
      const allMsgs = [...messages, userMsg];

      try {
        const full = await provider.chatStream(allMsgs, context, (chunk) => {
          if (chunk.done) return;
          setMessages(prev => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last.id === assistantMsg.id) {
              copy[copy.length - 1] = { ...last, content: last.content + chunk.content };
            }
            return copy;
          });
          setAvatarState("speaking");
        });

        lastResponseRef.current = full;

        // Try to parse tool results
        let toolResult: AIToolResult | undefined;
        try {
          const parsed = JSON.parse(full);
          if (parsed.type && parsed.data) toolResult = parsed as AIToolResult;
        } catch { /* not JSON, regular chat */ }

        setMessages(prev => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last.id === assistantMsg.id) {
            copy[copy.length - 1] = { ...last, content: full, toolResult };
          }
          return copy;
        });

        if (avatarConfig.autoSpeak && avatarConfig.voiceEnabled) {
          speak(toolResult ? "Here are your results!" : full.slice(0, 500));
        }
      } catch (err) {
        setMessages(prev => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last.id === assistantMsg.id) {
            copy[copy.length - 1] = {
              ...last,
              content: "Sorry, I encountered an error. Please try again.",
            };
          }
          return copy;
        });
      } finally {
        setIsStreaming(false);
        setAvatarState("idle");
      }
    },
    [messages, activeProvider, avatarConfig]
  );

  // ─── Generate tool ───
  const generateTool = useCallback(
    async (type: AIToolType, prompt: string, context?: AIRequestContext): Promise<AIToolResult | null> => {
      setAvatarState("thinking");
      const provider = getProvider(activeProvider);
      try {
        const result = await provider.generateTool(type, prompt, context);
        setAvatarState("idle");
        const parsed = JSON.parse(result);
        if (parsed.type && parsed.data) return parsed as AIToolResult;
        return null;
      } catch {
        setAvatarState("idle");
        return null;
      }
    },
    [activeProvider]
  );

  const clearChat = useCallback(() => setMessages([]), []);
  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setAvatarState("idle");
  }, []);

  // ─── Voice: Speech-to-Text ───
  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    // Stop any existing recognition first
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setAvatarState("listening");
    };
    recognition.onresult = (e: any) => {
      const transcript = e.results?.[0]?.[0]?.transcript;
      setIsListening(false);
      setAvatarState("idle");
      if (transcript) sendMessage(transcript);
    };
    recognition.onerror = (e: any) => {
      console.warn("Speech recognition error:", e.error);
      setIsListening(false);
      setAvatarState("idle");
    };
    recognition.onend = () => {
      setIsListening(false);
      setAvatarState("idle");
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      console.warn("Failed to start speech recognition:", err);
      setIsListening(false);
      setAvatarState("idle");
    }
  }, [sendMessage]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setAvatarState("idle");
  }, []);

  // ─── Voice: Text-to-Speech ───
  const speak = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window) || !text.trim()) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Clear any existing Chrome resume timer
      if (resumeTimerRef.current) {
        clearInterval(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }

      // Strip markdown for cleaner speech
      const clean = text
        .replace(/```[\s\S]*?```/g, "code block")
        .replace(/[*_#`>]/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/\n{2,}/g, ". ")
        .slice(0, 1000);

      const startSpeaking = () => {
        const utt = new SpeechSynthesisUtterance(clean);
        utt.rate = avatarConfig.voiceSpeed;
        utt.pitch = 1;

        // Use pre-loaded voices (fallback to getVoices() if ref empty)
        const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.lang.startsWith("en") && v.localService) ||
                          voices.find(v => v.lang.startsWith("en")) ||
                          voices[0];
        if (preferred) utt.voice = preferred;

        utt.onstart = () => {
          setIsSpeaking(true);
          setAvatarState("speaking");
          // Chrome pauses long utterances after ~15s — keep resuming
          resumeTimerRef.current = setInterval(() => {
            if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
              window.speechSynthesis.pause();
              window.speechSynthesis.resume();
            }
          }, 10000);
        };
        utt.onend = () => {
          if (resumeTimerRef.current) { clearInterval(resumeTimerRef.current); resumeTimerRef.current = null; }
          setIsSpeaking(false);
          setAvatarState("idle");
        };
        utt.onerror = (e) => {
          // "interrupted" is expected when cancel() is called
          if (e.error !== "interrupted") console.warn("TTS error:", e.error);
          if (resumeTimerRef.current) { clearInterval(resumeTimerRef.current); resumeTimerRef.current = null; }
          setIsSpeaking(false);
          setAvatarState("idle");
        };

        synthUtteranceRef.current = utt;
        window.speechSynthesis.speak(utt);
      };

      // Chrome bug: calling speak() right after cancel() silently fails.
      // Small delay ensures the cancel completes first.
      setTimeout(startSpeaking, 80);
    },
    [avatarConfig.voiceSpeed]
  );

  const stopSpeaking = useCallback(() => {
    if (resumeTimerRef.current) { clearInterval(resumeTimerRef.current); resumeTimerRef.current = null; }
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setAvatarState("idle");
  }, []);

  const replayLast = useCallback(() => {
    if (lastResponseRef.current) speak(lastResponseRef.current);
  }, [speak]);

  const updateAvatarConfig = useCallback((cfg: Partial<AvatarConfig>) => {
    setAvatarConfig(prev => ({ ...prev, ...cfg }));
  }, []);

  // ─── Quick actions ───
  const QUICK_PROMPTS: Record<string, string> = {
    "explain": "Explain this lesson to me in simple terms.",
    "summarize": "Summarize my recent notes and key takeaways.",
    "quiz": "Generate a quiz with 5 questions on my recent learning topics.",
    "flashcards": "Create flashcards for my current study material.",
    "study-plan": "Build me a personalized weekly study plan based on my progress.",
    "weak-areas": "Analyze my weak areas and suggest improvements.",
    "recommend-skill": "Recommend the next skill I should learn and why.",
    "help-answer": "Help me write a clear, helpful answer to this question.",
    "improve-post": "Improve my post to make it clearer and more helpful.",
    "summarize-thread": "Summarize this discussion thread and highlight key points.",
  };

  const quickAction = useCallback(
    async (action: string, context?: AIRequestContext) => {
      const prompt = QUICK_PROMPTS[action] || action;
      setIsPanelOpen(true);
      await sendMessage(prompt, context);
    },
    [sendMessage]
  );

  const value = useMemo(
    () => ({
      messages,
      isStreaming,
      sendMessage,
      generateTool,
      clearChat,
      stopStreaming,
      activeProvider,
      setActiveProvider,
      providerStatuses,
      isDemoMode,
      avatarState,
      avatarConfig,
      updateAvatarConfig,
      isListening,
      startListening,
      stopListening,
      isSpeaking,
      speak,
      stopSpeaking,
      replayLast,
      isPanelOpen,
      togglePanel: () => setIsPanelOpen(p => !p),
      openPanel: () => setIsPanelOpen(true),
      closePanel: () => setIsPanelOpen(false),
      quickAction,
    }),
    [
      messages, isStreaming, sendMessage, generateTool, clearChat, stopStreaming,
      activeProvider, providerStatuses, isDemoMode,
      avatarState, avatarConfig, updateAvatarConfig,
      isListening, startListening, stopListening,
      isSpeaking, speak, stopSpeaking, replayLast,
      isPanelOpen, quickAction,
    ]
  );

  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  );
};
