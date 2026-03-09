import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Play, Sparkles, ArrowLeft, Bot, Send, Lightbulb,
  RotateCcw, Copy, Check, Code2, Terminal, ChevronDown,
  Loader2, Bug, BookOpen, Brain, Zap, GraduationCap
} from "lucide-react";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

type Message = { role: "user" | "assistant"; content: string };

const LANGUAGE_TEMPLATES: Record<string, { label: string; template: string }> = {
  javascript: {
    label: "JavaScript",
    template: `// Welcome to the Coding Playground! 🚀
// Write your JavaScript code here

function greet(name) {
  return \`Hello, \${name}! Welcome to CodeCamp!\`;
}

console.log(greet("Coder"));
`,
  },
  python: {
    label: "Python",
    template: `# Welcome to the Coding Playground! 🚀
# Write your Python code here

def greet(name):
    return f"Hello, {name}! Welcome to CodeCamp!"

print(greet("Coder"))
`,
  },
  java: {
    label: "Java",
    template: `// Welcome to the Coding Playground! 🚀
// Write your Java code here

public class Main {
    public static String greet(String name) {
        return "Hello, " + name + "! Welcome to CodeCamp!";
    }

    public static void main(String[] args) {
        System.out.println(greet("Coder"));
    }
}
`,
  },
  typescript: {
    label: "TypeScript",
    template: `// Welcome to the Coding Playground! 🚀
// Write your TypeScript code here

function greet(name: string): string {
  return \`Hello, \${name}! Welcome to CodeCamp!\`;
}

console.log(greet("Coder"));
`,
  },
};

const CodingPlayground = () => {
  const { user, loading, requireAuth } = usePlatformAuth();
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.javascript.template);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // AI Tutor state
  const [tutorMessages, setTutorMessages] = useState<Message[]>([]);
  const [tutorInput, setTutorInput] = useState("");
  const [tutorLoading, setTutorLoading] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);
  const [studentContext, setStudentContext] = useState<any>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const tutorScrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { requireAuth(); }, [loading, user]);

  // Load student context for adaptive AI
  useEffect(() => {
    if (!user) return;
    supabase.from("student_profiles").select("current_level, total_xp, experience_level, weak_topics, strong_topics, career_goal")
      .eq("user_id", user.id).maybeSingle().then(({ data }) => {
        if (data) setStudentContext(data);
      });
  }, [user]);
  useEffect(() => {
    if (tutorScrollRef.current) {
      tutorScrollRef.current.scrollTop = tutorScrollRef.current.scrollHeight;
    }
  }, [tutorMessages]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(LANGUAGE_TEMPLATES[lang].template);
    setOutput("");
    setShowLangMenu(false);
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput("");

    // Simulate execution with captured console.log for JS
    setTimeout(() => {
      if (language === "javascript" || language === "typescript") {
        try {
          const logs: string[] = [];
          const mockConsole = { log: (...args: any[]) => logs.push(args.map(String).join(" ")) };
          const wrapped = code.replace(/console\.log/g, "__console.log");
          const fn = new Function("__console", wrapped);
          fn(mockConsole);
          setOutput(logs.join("\n") || "✅ Code executed successfully (no output)");
        } catch (err: any) {
          setOutput(`❌ Error: ${err.message}`);
        }
      } else {
        setOutput(`⚠️ ${LANGUAGE_TEMPLATES[language].label} execution is simulated.\n\n` +
          `In a real environment, this code would compile and run.\n` +
          `Use the AI Tutor to review your code and get feedback! →`);
      }
      setIsRunning(false);
    }, 600);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCode = () => {
    setCode(LANGUAGE_TEMPLATES[language].template);
    setOutput("");
  };

  // AI Tutor streaming with context
  const sendTutorMessage = async (messageOverride?: string, requestedHintLevel?: number) => {
    const content = messageOverride || tutorInput.trim();
    if (!content || tutorLoading) return;

    const userMsg: Message = { role: "user", content };
    const allMessages = [...tutorMessages, userMsg];
    setTutorMessages(allMessages);
    setTutorInput("");
    setTutorLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setTutorMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages,
          context: {
            ...studentContext,
            hintLevel: requestedHintLevel || undefined,
          },
        }),
      });

      if (!resp.ok || !resp.body) throw new Error("Stream failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const c = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (c) upsertAssistant(c);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw || raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const c = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (c) upsertAssistant(c);
          } catch { /* ignore */ }
        }
      }
    } catch (err) {
      console.error("Tutor error:", err);
      upsertAssistant("Sorry, I'm having trouble right now. Please try again.");
    } finally {
      setTutorLoading(false);
    }
  };

  const requestHint = () => {
    const currentHint = hintLevel;
    setHintLevel(prev => Math.min(prev + 1, 4));
    sendTutorMessage(
      `I'm working on this ${LANGUAGE_TEMPLATES[language].label} code. Please give me a Level ${currentHint} hint (out of 4).\n\n\`\`\`${language}\n${code}\n\`\`\``,
      currentHint
    );
  };

  const requestCodeReview = () => {
    sendTutorMessage(`Please do a thorough code review of this ${LANGUAGE_TEMPLATES[language].label} code. Evaluate correctness, efficiency, readability, best practices, and give a score out of 100:\n\n\`\`\`${language}\n${code}\n\`\`\``);
  };

  const requestDebugHelp = () => {
    setFailedAttempts(prev => prev + 1);
    const ctx = output ? `\n\nOutput/Error:\n\`\`\`\n${output}\n\`\`\`` : "";
    const stuckNote = failedAttempts >= 2 ? "\n\n⚠️ I've been struggling with this for a while. Please break it into smaller steps." : "";
    sendTutorMessage(`Help me debug this ${LANGUAGE_TEMPLATES[language].label} code:${ctx}${stuckNote}\n\n\`\`\`${language}\n${code}\n\`\`\``);
  };

  const requestStudyPlan = () => {
    sendTutorMessage("Based on my current level and weak areas, what should I study today? Give me a personalized study plan with specific exercises.");
  };

  const requestExplainConcept = () => {
    sendTutorMessage(`I'm writing ${LANGUAGE_TEMPLATES[language].label} code. Can you explain the key concepts used in this code and suggest related topics to study?\n\n\`\`\`${language}\n${code}\n\`\`\``);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading playground...</div>
      </div>
    );
  }

  const lineCount = code.split("\n").length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/platform/dashboard">
              <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Dashboard</Button>
            </Link>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground font-display">Coding Playground</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="gap-1 font-mono text-xs"
              >
                {LANGUAGE_TEMPLATES[language].label}
                <ChevronDown className="w-3 h-3" />
              </Button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    {Object.entries(LANGUAGE_TEMPLATES).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => handleLanguageChange(key)}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors ${
                          key === language ? "bg-primary/10 text-primary font-medium" : "text-foreground"
                        }`}
                      >
                        {val.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button variant="ghost" size="sm" onClick={resetCode} title="Reset code">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={copyCode} title="Copy code">
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button size="sm" onClick={runCode} disabled={isRunning} className="gap-1">
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Run
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Editor + Output Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Code Editor */}
          <div className="flex-1 relative bg-[hsl(var(--foreground)/0.03)]">
            <div className="absolute inset-0 flex">
              {/* Line Numbers */}
              <div className="w-12 bg-muted/30 border-r border-border/50 py-3 px-1 overflow-hidden select-none">
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i} className="text-right text-xs leading-6 text-muted-foreground font-mono pr-2">
                    {i + 1}
                  </div>
                ))}
              </div>
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 bg-transparent text-foreground font-mono text-sm leading-6 p-3 outline-none resize-none overflow-auto"
                style={{ tabSize: 2 }}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="h-40 lg:h-48 border-t border-border bg-card flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50 bg-muted/20">
              <Terminal className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Output</span>
              {output && (
                <Badge variant="outline" className="text-[10px] ml-auto">
                  {output.startsWith("❌") ? "Error" : "Success"}
                </Badge>
              )}
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-sm text-foreground whitespace-pre-wrap">
              {isRunning ? (
                <span className="text-muted-foreground flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" /> Running...
                </span>
              ) : output ? (
                output
              ) : (
                <span className="text-muted-foreground italic">Click "Run" to see output here...</span>
              )}
            </div>
          </div>
        </div>

        {/* AI Tutor Panel */}
        <div className="w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-border bg-card flex flex-col">
          {/* Tutor Header */}
          <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">AI Coding Tutor</h3>
                <p className="text-[10px] text-muted-foreground">Get hints, reviews & debug help</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              <button onClick={requestHint} disabled={tutorLoading}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full bg-accent text-accent-foreground hover:bg-primary/10 transition-colors disabled:opacity-50">
                <Lightbulb className="w-3 h-3" /> Hint {hintLevel}/4
              </button>
              <button onClick={requestCodeReview} disabled={tutorLoading}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full bg-accent text-accent-foreground hover:bg-primary/10 transition-colors disabled:opacity-50">
                <BookOpen className="w-3 h-3" /> Review
              </button>
              <button onClick={requestDebugHelp} disabled={tutorLoading}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full bg-accent text-accent-foreground hover:bg-primary/10 transition-colors disabled:opacity-50">
                <Bug className="w-3 h-3" /> Debug
              </button>
              <button onClick={requestExplainConcept} disabled={tutorLoading}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full bg-accent text-accent-foreground hover:bg-primary/10 transition-colors disabled:opacity-50">
                <Brain className="w-3 h-3" /> Explain
              </button>
              <button onClick={requestStudyPlan} disabled={tutorLoading}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full bg-accent text-accent-foreground hover:bg-primary/10 transition-colors disabled:opacity-50">
                <GraduationCap className="w-3 h-3" /> Study Plan
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={tutorScrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {tutorMessages.length === 0 && (
              <div className="text-center text-muted-foreground text-xs mt-8 space-y-2">
                <Bot className="w-8 h-8 mx-auto opacity-40" />
                <p>Write code, then ask for hints, reviews, or debug help!</p>
                <p className="text-[10px]">Use the buttons above or type a question.</p>
              </div>
            )}

            {tutorMessages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3 h-3 text-primary" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}>
                  {msg.role === "assistant" ? (
                    <div className="prose prose-xs dark:prose-invert max-w-none [&_pre]:bg-foreground/10 [&_pre]:rounded-md [&_pre]:p-2 [&_pre]:text-[10px] [&_pre]:overflow-x-auto [&_code]:bg-foreground/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[10px] [&_code]:font-mono [&_p]:m-0 [&_ul]:m-0 [&_ol]:m-0 [&_li]:m-0 [&_h1]:text-sm [&_h2]:text-xs [&_h3]:text-xs">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <span className="line-clamp-4">{msg.content}</span>
                  )}
                </div>
              </div>
            ))}

            {tutorLoading && tutorMessages[tutorMessages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-primary" />
                </div>
                <div className="bg-muted rounded-xl rounded-bl-sm px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tutor Input */}
          <div className="p-3 border-t border-border">
            <form
              onSubmit={(e) => { e.preventDefault(); sendTutorMessage(); }}
              className="flex gap-2"
            >
              <input
                value={tutorInput}
                onChange={(e) => setTutorInput(e.target.value)}
                placeholder="Ask about your code..."
                className="flex-1 bg-muted rounded-full px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                disabled={tutorLoading}
              />
              <button
                type="submit"
                disabled={tutorLoading || !tutorInput.trim()}
                className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingPlayground;
