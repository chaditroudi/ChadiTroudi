import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor as monacoEditor } from "monaco-editor";
import {
  Play, Sparkles, Bot, Send, Lightbulb,
  RotateCcw, Copy, Check, Code2, Terminal, ChevronDown,
  Loader2, Bug, BookOpen, Brain, GraduationCap, Trash2,
  MessageCircle, X, PanelRightOpen, PanelRightClose,
  Settings2, Maximize2, Minimize2, Type, WrapText,
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

const MONACO_LANGUAGE_MAP: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
};

const CodingPlayground = () => {
  const { user, loading, requireAuth } = usePlatformAuth();
  const isMobile = useIsMobile();
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.javascript.template);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [editorFontSize, setEditorFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(false);
  const [minimap, setMinimap] = useState(!isMobile);
  const [editorFullscreen, setEditorFullscreen] = useState(false);
  const editorRef = useRef<monacoEditor.IStandaloneCodeEditor | null>(null);

  // AI Tutor state
  const [tutorMessages, setTutorMessages] = useState<Message[]>([]);
  const [tutorInput, setTutorInput] = useState("");
  const [tutorLoading, setTutorLoading] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);
  const [studentContext, setStudentContext] = useState<any>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [tutorOpen, setTutorOpen] = useState(!isMobile);
  const [mobileTutorOpen, setMobileTutorOpen] = useState(false);
  const tutorScrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { requireAuth(); }, [loading, user]);

  // Monaco Editor mount handler
  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    // Add keyboard shortcuts
    editor.addAction({
      id: "run-code",
      label: "Run Code",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => runCode(),
    });

    // Configure JS/TS defaults for better autocomplete
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      allowJs: true,
      strict: true,
    });
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      strict: true,
    });

    // Add console.log snippet for JS/TS
    monaco.languages.registerCompletionItemProvider("javascript", {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        return {
          suggestions: [
            {
              label: "log",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "console.log(${1:value});",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Log output to console",
              range,
            },
            {
              label: "fn",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "function ${1:name}(${2:params}) {\n\t${3}\n}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Function declaration",
              range,
            },
            {
              label: "afn",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "const ${1:name} = (${2:params}) => {\n\t${3}\n};",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Arrow function",
              range,
            },
            {
              label: "forloop",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "for (let ${1:i} = 0; ${1:i} < ${2:arr}.length; ${1:i}++) {\n\t${3}\n}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "For loop",
              range,
            },
            {
              label: "foreach",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "${1:arr}.forEach((${2:item}) => {\n\t${3}\n});",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Array forEach",
              range,
            },
            {
              label: "trycatch",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "try {\n\t${1}\n} catch (${2:error}) {\n\t${3}\n}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Try/Catch block",
              range,
            },
          ],
        };
      },
    });

    editor.focus();
  }, []);

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

  const clearChat = () => {
    setTutorMessages([]);
    setHintLevel(1);
    setFailedAttempts(0);
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-muted-foreground">Loading playground...</div>
      </div>
    );
  }

  /* ─── AI Tutor Panel (shared between desktop sidebar & mobile sheet) ─── */
  const TutorPanel = () => (
    <div className="flex flex-col h-full">
      {/* Tutor Header */}
      <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-primary/5 to-transparent shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">AI Coding Tutor</h3>
              <p className="text-[10px] text-muted-foreground">Hints, reviews & debug help</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {tutorMessages.length > 0 && (
              <Button variant="ghost" size="icon" onClick={clearChat} className="w-7 h-7 text-muted-foreground hover:text-destructive" title="Clear chat">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
            {!isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setTutorOpen(false)} className="w-7 h-7 text-muted-foreground" title="Close tutor">
                <PanelRightClose className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {[
            { fn: requestHint, icon: Lightbulb, label: `Hint ${hintLevel}/4`, color: "hover:bg-yellow-500/10 hover:text-yellow-600" },
            { fn: requestCodeReview, icon: BookOpen, label: "Review", color: "hover:bg-blue-500/10 hover:text-blue-600" },
            { fn: requestDebugHelp, icon: Bug, label: "Debug", color: "hover:bg-red-500/10 hover:text-red-600" },
            { fn: requestExplainConcept, icon: Brain, label: "Explain", color: "hover:bg-purple-500/10 hover:text-purple-600" },
            { fn: requestStudyPlan, icon: GraduationCap, label: "Study Plan", color: "hover:bg-emerald-500/10 hover:text-emerald-600" },
          ].map(({ fn, icon: Icon, label, color }) => (
            <button
              key={label}
              onClick={fn}
              disabled={tutorLoading}
              className={`flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full bg-accent text-accent-foreground ${color} transition-colors disabled:opacity-50`}
            >
              <Icon className="w-3 h-3" /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div ref={tutorScrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {tutorMessages.length === 0 && (
          <div className="text-center text-muted-foreground text-xs mt-6 space-y-3 px-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Bot className="w-7 h-7 text-primary/60" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground text-sm">Hey there! I'm your AI tutor</p>
              <p className="text-[11px] leading-relaxed">Write some code, then use the buttons above or ask me anything. I can:</p>
            </div>
            <div className="text-left space-y-1.5 bg-muted/50 rounded-xl p-3 text-[11px]">
              <p>💡 Give progressive hints (easy → detailed)</p>
              <p>📝 Review your code for quality & best practices</p>
              <p>🐛 Help debug errors step by step</p>
              <p>🧠 Explain concepts used in your code</p>
              <p>📚 Create a personalized study plan</p>
            </div>
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
                <span className="whitespace-pre-wrap break-words">{msg.content}</span>
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
      <div className="p-3 border-t border-border shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); sendTutorMessage(); }}
          className="flex gap-2 items-end"
        >
          <textarea
            ref={inputRef}
            value={tutorInput}
            onChange={(e) => setTutorInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendTutorMessage();
              }
            }}
            placeholder="Ask about your code... (Shift+Enter for new line)"
            className="flex-1 bg-muted rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground resize-none min-h-[36px] max-h-[100px]"
            disabled={tutorLoading}
            rows={1}
          />
          <button
            type="submit"
            disabled={tutorLoading || !tutorInput.trim()}
            className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:opacity-90 transition-opacity shrink-0"
          >
            {tutorLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className={`h-full bg-background flex flex-col ${editorFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground font-display hidden sm:inline">Playground</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Language Selector */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="gap-1 font-mono text-xs h-8"
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

            {/* Editor Settings */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setEditorFontSize(s => Math.min(s + 1, 24))}>
                  <Type className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Increase font size ({editorFontSize}px)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setEditorFontSize(s => Math.max(s - 1, 10))}>
                  <Type className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Decrease font size</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={wordWrap ? "default" : "ghost"} size="sm" className="h-8 w-8 p-0" onClick={() => setWordWrap(!wordWrap)}>
                  <WrapText className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Word wrap {wordWrap ? "ON" : "OFF"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={minimap ? "default" : "ghost"} size="sm" className="h-8 w-8 p-0" onClick={() => setMinimap(!minimap)}>
                  <Settings2 className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Minimap {minimap ? "ON" : "OFF"}</TooltipContent>
            </Tooltip>

            <div className="w-px h-5 bg-border mx-0.5 hidden sm:block" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={resetCode} className="h-8 w-8 p-0">
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset code</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={copyCode} className="h-8 w-8 p-0">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{copied ? "Copied!" : "Copy code"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => setEditorFullscreen(!editorFullscreen)} className="h-8 w-8 p-0">
                  {editorFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{editorFullscreen ? "Exit fullscreen" : "Fullscreen"}</TooltipContent>
            </Tooltip>

            <Button size="sm" onClick={runCode} disabled={isRunning} className="gap-1 h-8">
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span className="hidden sm:inline">Run</span>
            </Button>
            <Badge variant="secondary" className="text-[10px] hidden sm:flex">Ctrl+Enter</Badge>

            {/* Tutor toggle: desktop = sidebar toggle, mobile = sheet trigger */}
            {isMobile ? (
              <Sheet open={mobileTutorOpen} onOpenChange={setMobileTutorOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 relative h-8">
                    <MessageCircle className="w-4 h-4" />
                    {tutorMessages.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground rounded-full text-[9px] flex items-center justify-center">
                        {tutorMessages.filter(m => m.role === "assistant").length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0">
                  <TutorPanel />
                </SheetContent>
              </Sheet>
            ) : !tutorOpen ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setTutorOpen(true)} className="gap-1 relative h-8">
                    <PanelRightOpen className="w-4 h-4" />
                    <span className="hidden lg:inline">AI Tutor</span>
                    {tutorMessages.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground rounded-full text-[9px] flex items-center justify-center">
                        {tutorMessages.filter(m => m.role === "assistant").length}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open AI Tutor panel</TooltipContent>
              </Tooltip>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Editor + Output Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Monaco Code Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={MONACO_LANGUAGE_MAP[language] || "javascript"}
              value={code}
              onChange={(value) => setCode(value || "")}
              onMount={handleEditorMount}
              theme="vs-dark"
              loading={
                <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground">Loading editor...</p>
                  </div>
                </div>
              }
              options={{
                fontSize: editorFontSize,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                fontLigatures: true,
                minimap: { enabled: minimap },
                wordWrap: wordWrap ? "on" : "off",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                lineNumbers: "on",
                renderLineHighlight: "all",
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
                bracketPairColorization: { enabled: true },
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
                autoIndent: "advanced",
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                quickSuggestions: {
                  other: true,
                  comments: true,
                  strings: true,
                },
                parameterHints: { enabled: true },
                suggest: {
                  showKeywords: true,
                  showSnippets: true,
                  showClasses: true,
                  showFunctions: true,
                  showVariables: true,
                  showModules: true,
                  preview: true,
                  showIcons: true,
                  filterGraceful: true,
                },
                hover: { enabled: true, delay: 200 },
                guides: {
                  bracketPairs: true,
                  indentation: true,
                },
                padding: { top: 12, bottom: 12 },
                folding: true,
                foldingStrategy: "indentation",
                showFoldingControls: "mouseover",
                matchBrackets: "always",
                renderWhitespace: "selection",
                snippetSuggestions: "top",
                contextmenu: true,
                links: true,
                colorDecorators: true,
                dragAndDrop: true,
                emptySelectionClipboard: true,
                copyWithSyntaxHighlighting: true,
              }}
            />
          </div>

          {/* Output Panel */}
          <div className="h-40 lg:h-48 border-t border-border bg-card flex flex-col shrink-0">
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

        {/* AI Tutor Panel (Desktop only — mobile uses Sheet) */}
        {!isMobile && tutorOpen && (
          <div className="w-[380px] xl:w-[420px] border-l border-border bg-card flex flex-col shrink-0">
            <TutorPanel />
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingPlayground;
