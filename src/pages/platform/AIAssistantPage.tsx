import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, BookOpen, Brain, Target, FileText,
  MessagesSquare, Mic, Volume2, Lightbulb, Zap,
  GraduationCap, HelpCircle, Bot, Wifi, WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAIAssistant } from "@/features/ai-assistant/hooks/use-ai-assistant";
import { AIChatPanel } from "@/features/ai-assistant/components/AIChatPanel";
import { AIAvatar } from "@/features/ai-assistant/avatar/AIAvatar";
import { ToolResultRenderer } from "@/features/ai-assistant/components/AIResultCards";
import { ExerciseSolver } from "@/features/ai-assistant/components/ExerciseSolver";
import type { AIToolResult, AIToolType } from "@/features/ai-assistant/types";

const quickTools: Array<{
  icon: typeof Sparkles;
  label: string;
  description: string;
  action: string;
  color: string;
  bg: string;
}> = [
  { icon: HelpCircle, label: "Explain Lesson", description: "Get simple explanations", action: "explain", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: FileText, label: "Summarize Notes", description: "Key takeaways from your notes", action: "summarize", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: Brain, label: "Quiz Me", description: "Test your knowledge", action: "quiz", color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: BookOpen, label: "Flashcards", description: "Create study flashcards", action: "flashcards", color: "text-amber-500", bg: "bg-amber-500/10" },
  { icon: Target, label: "Study Plan", description: "Personalized weekly plan", action: "study-plan", color: "text-primary", bg: "bg-primary/10" },
  { icon: Lightbulb, label: "Weak Areas", description: "Find what to improve", action: "weak-areas", color: "text-red-500", bg: "bg-red-500/10" },
  { icon: Zap, label: "Next Skill", description: "Recommended skill path", action: "recommend-skill", color: "text-orange-500", bg: "bg-orange-500/10" },
  { icon: GraduationCap, label: "Improve Post", description: "Make your answer better", action: "improve-post", color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { icon: FileText, label: "Solve Exercise", description: "Upload PDF & get solutions", action: "solve-exercise", color: "text-rose-500", bg: "bg-rose-500/10" },
];

const AIAssistantPage = () => {
  const {
    quickAction, generateTool, isDemoMode,
    activeProvider, providerStatuses,
    avatarState, isListening, startListening, stopListening,
    isSpeaking, speak, stopSpeaking,
  } = useAIAssistant();

  const [activeTab, setActiveTab] = useState("chat");
  const [toolResult, setToolResult] = useState<AIToolResult | null>(null);
  const [toolLoading, setToolLoading] = useState(false);

  const handleQuickTool = async (action: string) => {
    if (action === "solve-exercise") {
      setActiveTab("solve");
      return;
    }
    setToolLoading(true);
    setActiveTab("tools");
    const result = await generateTool(action as AIToolType, `Generate ${action} based on my current progress and learning topics.`);
    setToolResult(result);
    setToolLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-primary" /> AI Assistant
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your personal AI study coach — chat, learn, practice, improve
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Provider status badges */}
            {providerStatuses.map(p => (
              <Badge
                key={p.provider}
                variant={p.provider === activeProvider ? "default" : "outline"}
                className={`text-[10px] ${
                  p.provider === activeProvider
                    ? "bg-primary text-primary-foreground"
                    : p.available
                    ? "text-foreground border-border"
                    : "text-muted-foreground/50 border-border/50"
                }`}
              >
                {p.available ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                {p.label}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Avatar + Quick Actions Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-primary/5 via-card to-primary/5 border border-primary/10 rounded-2xl p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <AIAvatar size="lg" showWaves={true} showLabel={true} />
            <div className="flex items-center gap-2 mt-3">
              <Button
                variant={isListening ? "default" : "outline"}
                size="sm"
                className={`gap-1 text-xs ${isListening ? "bg-blue-500 hover:bg-blue-600 animate-pulse" : ""}`}
                onClick={isListening ? stopListening : startListening}
              >
                <Mic className="w-3 h-3" /> {isListening ? "Listening..." : "Voice"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-xs"
                onClick={isSpeaking ? stopSpeaking : () => speak("Hello! I'm your AI study coach. How can I help you today?")}
              >
                <Volume2 className="w-3 h-3" /> {isSpeaking ? "Stop" : "Speak"}
              </Button>
            </div>
          </div>

          {/* Quick tools grid */}
          <div className="flex-1 w-full">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickTools.map(tool => (
                <button
                  key={tool.action}
                  onClick={() => handleQuickTool(tool.action)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <div className={`w-9 h-9 rounded-lg ${tool.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <tool.icon className={`w-4 h-4 ${tool.color}`} />
                  </div>
                  <span className="text-[11px] font-medium text-foreground">{tool.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs: Chat / Tools */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="chat" className="gap-1">
            <MessagesSquare className="w-3.5 h-3.5" /> Chat
          </TabsTrigger>
          <TabsTrigger value="tools" className="gap-1">
            <Brain className="w-3.5 h-3.5" /> Tools & Results
          </TabsTrigger>
          <TabsTrigger value="solve" className="gap-1">
            <FileText className="w-3.5 h-3.5" /> Solve Exercise
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-border rounded-2xl overflow-hidden h-[500px]"
          >
            <AIChatPanel mode="compact" showAvatar={false} />
          </motion.div>
        </TabsContent>

        <TabsContent value="solve">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ExerciseSolver />
          </motion.div>
        </TabsContent>

        <TabsContent value="tools">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {toolLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <AIAvatar size="md" showWaves={true} />
                <p className="text-sm text-muted-foreground mt-4 animate-pulse">Generating results...</p>
              </div>
            ) : toolResult ? (
              <div className="max-w-lg mx-auto">
                <ToolResultRenderer result={toolResult} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <p className="text-sm text-muted-foreground">Use a quick action above to generate results here.</p>
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Demo mode banner */}
      {isDemoMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center"
        >
          <p className="text-sm text-foreground font-medium flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-500" /> Running in Demo Mode
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Configure OpenAI or DeepSeek API keys to get real AI-powered responses.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AIAssistantPage;
