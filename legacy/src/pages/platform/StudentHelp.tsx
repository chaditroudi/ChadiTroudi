import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, MessageSquare, ThumbsUp, HelpCircle, Send,
  Sparkles, Search, Filter, ArrowUp, Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAIAssistant } from "@/features/ai-assistant/hooks/use-ai-assistant";

interface Question {
  id: string;
  author: string;
  avatar: string;
  title: string;
  body: string;
  topic: string;
  votes: number;
  answers: number;
  timestamp: string;
  solved: boolean;
}

const SAMPLE_QUESTIONS: Question[] = [
  { id: "1", author: "Amine K.", avatar: "AK", title: "How do closures work in JavaScript?", body: "I understand basic functions but closures confuse me. Can someone explain with examples?", topic: "JavaScript", votes: 12, answers: 3, timestamp: "2h ago", solved: true },
  { id: "2", author: "Sara M.", avatar: "SM", title: "React useEffect cleanup function", body: "When should I use the cleanup function in useEffect? What happens if I don't?", topic: "React", votes: 8, answers: 2, timestamp: "4h ago", solved: false },
  { id: "3", author: "Youssef B.", avatar: "YB", title: "Python list comprehension vs map()", body: "Which is faster and when should I use one over the other?", topic: "Python", votes: 5, answers: 1, timestamp: "6h ago", solved: false },
  { id: "4", author: "Nour H.", avatar: "NH", title: "CSS Grid vs Flexbox for layouts", body: "I always use Flexbox. When is CSS Grid actually better?", topic: "CSS", votes: 15, answers: 4, timestamp: "1d ago", solved: true },
];

const TOPICS = ["All", "JavaScript", "React", "Python", "CSS", "TypeScript", "Node.js"];

const StudentHelp = () => {
  const { quickAction, isDemoMode } = useAIAssistant();
  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [askTitle, setAskTitle] = useState("");
  const [askBody, setAskBody] = useState("");
  const [improvingId, setImprovingId] = useState<string | null>(null);

  const filteredQuestions = SAMPLE_QUESTIONS.filter(q => {
    const matchesTopic = selectedTopic === "All" || q.topic === selectedTopic;
    const matchesSearch = !searchQuery ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const handleAIImprove = async (question: Question) => {
    setImprovingId(question.id);
    await quickAction("improve-post", { currentTopic: question.body });
    setImprovingId(null);
  };

  const handleAISuggestAnswer = async (question: Question) => {
    await quickAction("help-answer", { currentTopic: question.title + " — " + question.body });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-7 h-7 text-primary" /> Student Help & Colleagues
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ask questions, help peers, and get AI-powered suggestions
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="browse" className="gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> Browse Questions
          </TabsTrigger>
          <TabsTrigger value="ask" className="gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Ask a Question
          </TabsTrigger>
        </TabsList>

        {/* ─── Browse ─── */}
        <TabsContent value="browse">
          {/* Search + filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {TOPICS.map(topic => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedTopic === topic
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Questions list */}
          <div className="space-y-3">
            {filteredQuestions.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border border-border rounded-xl p-4 hover:border-primary/20 transition-colors"
              >
                <div className="flex gap-3">
                  {/* Vote column */}
                  <div className="flex flex-col items-center gap-0.5 shrink-0">
                    <button className="p-1 rounded hover:bg-muted transition-colors">
                      <ArrowUp className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <span className="text-sm font-bold text-foreground">{q.votes}</span>
                    <span className="text-[10px] text-muted-foreground">votes</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-foreground text-sm leading-snug">{q.title}</h3>
                      {q.solved && <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shrink-0">Solved</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{q.body}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-[9px] font-bold text-primary">{q.avatar}</div>
                        <span className="text-[11px] text-muted-foreground">{q.author} • {q.timestamp}</span>
                        <Badge variant="outline" className="text-[10px]">{q.topic}</Badge>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                          <MessageSquare className="w-3 h-3" /> {q.answers}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[11px] gap-1"
                          onClick={() => handleAISuggestAnswer(q)}
                        >
                          <Bot className="w-3 h-3" /> AI Answer
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[11px] gap-1"
                          onClick={() => handleAIImprove(q)}
                          disabled={improvingId === q.id}
                        >
                          <Sparkles className="w-3 h-3" /> {improvingId === q.id ? "Improving..." : "Improve"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Filter className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No questions match your filters.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ─── Ask ─── */}
        <TabsContent value="ask">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-border rounded-xl p-5 max-w-2xl"
          >
            <h2 className="text-lg font-bold text-foreground mb-4">Ask a Question</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
                <Input
                  placeholder="What's your question? Be specific."
                  value={askTitle}
                  onChange={e => setAskTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Details</label>
                <Textarea
                  placeholder="Explain your problem, include code snippets if relevant..."
                  value={askBody}
                  onChange={e => setAskBody(e.target.value)}
                  rows={6}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button className="gap-1" disabled={!askTitle.trim()}>
                  <Send className="w-3.5 h-3.5" /> Post Question
                </Button>
                <Button
                  variant="outline"
                  className="gap-1"
                  onClick={() => {
                    if (askBody.trim()) {
                      quickAction("improve-post", { currentTopic: askBody });
                    }
                  }}
                  disabled={!askBody.trim()}
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Improve
                </Button>
              </div>
            </div>

            {isDemoMode && (
              <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                <Bot className="w-3 h-3" /> Questions are stored locally in demo mode.
              </p>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentHelp;
