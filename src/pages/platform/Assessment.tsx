import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Brain, CheckCircle2, XCircle, ChevronRight, Trophy,
  Target, Sparkles, BarChart3
} from "lucide-react";

interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correct: number;
  difficulty: string;
  explanation: string;
}

const ASSESSMENT_QUESTIONS: Question[] = [
  // Programming Fundamentals
  { id: "f1", category: "fundamentals", question: "What is a variable in programming?", options: ["A fixed value that never changes", "A named storage location for data", "A type of function", "A loop structure"], correct: 1, difficulty: "beginner", explanation: "A variable is a named container that stores data which can be changed during program execution." },
  { id: "f2", category: "fundamentals", question: "What does the '==' operator do in most languages?", options: ["Assigns a value", "Compares two values for equality", "Declares a variable", "Creates a loop"], correct: 1, difficulty: "beginner", explanation: "The '==' operator compares two values and returns true if they are equal." },
  { id: "f3", category: "fundamentals", question: "What is the output of: print(type([1,2,3])) in Python?", options: ["<class 'tuple'>", "<class 'dict'>", "<class 'list'>", "<class 'set'>"], correct: 2, difficulty: "beginner", explanation: "Square brackets [] create a list in Python." },

  // Problem Solving
  { id: "p1", category: "problem_solving", question: "What is the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correct: 2, difficulty: "intermediate", explanation: "Binary search halves the search space each step, giving O(log n) complexity." },
  { id: "p2", category: "problem_solving", question: "Which data structure uses FIFO (First In, First Out)?", options: ["Stack", "Queue", "Tree", "Hash Map"], correct: 1, difficulty: "intermediate", explanation: "A Queue follows FIFO — the first element added is the first to be removed." },
  { id: "p3", category: "problem_solving", question: "What does recursion require to avoid infinite loops?", options: ["A for loop", "A base case", "A global variable", "Multiple parameters"], correct: 1, difficulty: "intermediate", explanation: "Every recursive function needs a base case that stops the recursion." },

  // Algorithms
  { id: "a1", category: "algorithms", question: "Which sorting algorithm has the best average-case time complexity?", options: ["Bubble Sort - O(n²)", "Merge Sort - O(n log n)", "Selection Sort - O(n²)", "Insertion Sort - O(n²)"], correct: 1, difficulty: "intermediate", explanation: "Merge Sort consistently achieves O(n log n) in all cases." },
  { id: "a2", category: "algorithms", question: "What is memoization?", options: ["Writing notes in code comments", "Storing results of expensive function calls", "A type of sorting algorithm", "Memory management technique"], correct: 1, difficulty: "advanced", explanation: "Memoization caches the results of function calls to avoid redundant computations." },

  // Web Development
  { id: "w1", category: "web_development", question: "What does HTML stand for?", options: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyper Text Marketing Language", "High Tech Modern Language"], correct: 1, difficulty: "beginner", explanation: "HTML = HyperText Markup Language, the standard for creating web pages." },
  { id: "w2", category: "web_development", question: "What is the purpose of CSS?", options: ["Server-side logic", "Database management", "Styling and layout of web pages", "JavaScript compilation"], correct: 2, difficulty: "beginner", explanation: "CSS (Cascading Style Sheets) controls the visual presentation of web pages." },
  { id: "w3", category: "web_development", question: "What does REST stand for in API design?", options: ["Real-time Event Stream Transfer", "Representational State Transfer", "Remote Execution Server Technology", "Reliable Encrypted Secure Transfer"], correct: 1, difficulty: "intermediate", explanation: "REST = Representational State Transfer, an architectural style for web APIs." },

  // JavaScript
  { id: "j1", category: "javascript", question: "What will console.log(typeof null) output?", options: ["'null'", "'undefined'", "'object'", "'boolean'"], correct: 2, difficulty: "intermediate", explanation: "This is a famous JavaScript quirk — typeof null returns 'object' due to a legacy bug." },
  { id: "j2", category: "javascript", question: "What is a closure in JavaScript?", options: ["A way to close the browser", "A function with access to its outer scope", "A method to end a loop", "A CSS property"], correct: 1, difficulty: "advanced", explanation: "A closure is a function that retains access to variables from its enclosing scope." },

  // Python
  { id: "py1", category: "python", question: "What does 'len()' do in Python?", options: ["Creates a list", "Returns the length of an object", "Loops through items", "Sorts a list"], correct: 1, difficulty: "beginner", explanation: "len() returns the number of items in a container like a list, string, or dictionary." },
  { id: "py2", category: "python", question: "What is a list comprehension?", options: ["A way to understand lists", "A compact way to create lists from iterables", "A list sorting method", "A debugging tool"], correct: 1, difficulty: "intermediate", explanation: "List comprehensions provide a concise syntax to create lists: [x*2 for x in range(5)]" },

  // AI/ML Basics
  { id: "ai1", category: "ai_ml", question: "What is machine learning?", options: ["Programming a machine to follow exact rules", "Systems that learn patterns from data", "Building physical robots", "Creating websites with animations"], correct: 1, difficulty: "beginner", explanation: "ML enables systems to learn and improve from data without being explicitly programmed." },
  { id: "ai2", category: "ai_ml", question: "What is a neural network inspired by?", options: ["Computer circuits", "The human brain", "Tree data structures", "Internet protocols"], correct: 1, difficulty: "intermediate", explanation: "Neural networks are inspired by the structure and function of biological neurons in the brain." },
];

const CATEGORIES = [
  { id: "fundamentals", label: "Fundamentals", icon: "📝" },
  { id: "problem_solving", label: "Problem Solving", icon: "🧩" },
  { id: "algorithms", label: "Algorithms", icon: "⚙️" },
  { id: "web_development", label: "Web Dev", icon: "🌐" },
  { id: "javascript", label: "JavaScript", icon: "🟨" },
  { id: "python", label: "Python", icon: "🐍" },
  { id: "ai_ml", label: "AI / ML", icon: "🤖" },
];

const Assessment = () => {
  const { user, loading, requireAuth } = usePlatformAuth();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"intro" | "quiz" | "results">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { requireAuth(); }, [loading, user]);

  const question = ASSESSMENT_QUESTIONS[currentQ];
  const progress = ((currentQ + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  const handleAnswer = () => {
    if (selectedAnswer === null) return;
    setAnswers(prev => ({ ...prev, [question.id]: selectedAnswer }));
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    if (currentQ < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setPhase("results");
    }
  };

  // Calculate scores by category
  const getScores = () => {
    const scores: Record<string, { correct: number; total: number }> = {};
    ASSESSMENT_QUESTIONS.forEach(q => {
      if (!scores[q.category]) scores[q.category] = { correct: 0, total: 0 };
      scores[q.category].total++;
      if (answers[q.id] === q.correct) scores[q.category].correct++;
    });
    return scores;
  };

  const getTotalScore = () => {
    const correct = ASSESSMENT_QUESTIONS.filter(q => answers[q.id] === q.correct).length;
    return Math.round((correct / ASSESSMENT_QUESTIONS.length) * 100);
  };

  const getRecommendedLevel = () => {
    const score = getTotalScore();
    if (score >= 85) return 5;
    if (score >= 70) return 4;
    if (score >= 55) return 3;
    if (score >= 40) return 2;
    return 1;
  };

  const getWeakTopics = () => {
    const scores = getScores();
    return Object.entries(scores)
      .filter(([, s]) => s.total > 0 && (s.correct / s.total) < 0.5)
      .map(([cat]) => cat);
  };

  const getStrongTopics = () => {
    const scores = getScores();
    return Object.entries(scores)
      .filter(([, s]) => s.total > 0 && (s.correct / s.total) >= 0.7)
      .map(([cat]) => cat);
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);

    const scores = getScores();
    const totalScore = getTotalScore();
    const recommendedLevel = getRecommendedLevel();

    // Save assessment scores by category
    const inserts = Object.entries(scores).map(([category, s]) => ({
      user_id: user.id,
      category,
      score: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
      total_questions: s.total,
    }));

    await supabase.from("skill_assessments").insert(inserts);

    // Update student profile
    await supabase.from("student_profiles").update({
      assessment_completed: true,
      assessment_score: totalScore,
      recommended_level: recommendedLevel,
      current_level: recommendedLevel,
      weak_topics: getWeakTopics(),
      strong_topics: getStrongTopics(),
    }).eq("user_id", user.id);

    toast.success(`Placed at Level ${recommendedLevel}! Let's start learning 🚀`);
    navigate("/platform/dashboard");
    setSaving(false);
  };

  if (loading || !user) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {phase !== "intro" && (
        <div className="h-1 bg-muted">
          <motion.div className="h-full bg-primary" animate={{ width: phase === "results" ? "100%" : `${progress}%` }} />
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {/* Intro */}
            {phase === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center space-y-6">
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mx-auto">
                  <Brain className="w-10 h-10 text-primary" />
                </motion.div>
                <h1 className="text-3xl font-bold font-display text-foreground">Skill Assessment</h1>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Answer {ASSESSMENT_QUESTIONS.length} quick questions across programming topics. We'll use your results to place you at the right level.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {CATEGORIES.map(c => (
                    <Badge key={c.id} variant="secondary" className="text-xs">
                      {c.icon} {c.label}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Takes about 5 minutes • No pressure, be honest!</p>
                <Button size="lg" onClick={() => setPhase("quiz")} className="gap-2">
                  Start Assessment <ChevronRight className="w-4 h-4" />
                </Button>
                <div>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/platform/dashboard")} className="text-muted-foreground">
                    Skip for now
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Quiz */}
            {phase === "quiz" && question && (
              <motion.div key={question.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Question {currentQ + 1}/{ASSESSMENT_QUESTIONS.length}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {CATEGORIES.find(c => c.id === question.category)?.icon} {CATEGORIES.find(c => c.id === question.category)?.label}
                  </Badge>
                </div>

                <h2 className="text-xl font-bold text-foreground">{question.question}</h2>

                <div className="space-y-2">
                  {question.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => !showExplanation && setSelectedAnswer(i)}
                      disabled={showExplanation}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-sm ${
                        showExplanation && i === question.correct
                          ? "bg-emerald-500/10 border-emerald-500 text-foreground"
                          : showExplanation && i === selectedAnswer && i !== question.correct
                          ? "bg-destructive/10 border-destructive text-foreground"
                          : selectedAnswer === i
                          ? "bg-primary/10 border-primary"
                          : "bg-card border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono flex-shrink-0">
                          {showExplanation && i === question.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
                           showExplanation && i === selectedAnswer && i !== question.correct ? <XCircle className="w-4 h-4 text-destructive" /> :
                           String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </div>
                    </button>
                  ))}
                </div>

                {showExplanation && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground border border-border">
                    <p className="font-medium text-foreground mb-1">
                      {answers[question.id] === question.correct ? "✅ Correct!" : "❌ Not quite"}
                    </p>
                    <p>{question.explanation}</p>
                  </motion.div>
                )}

                <div className="flex justify-end">
                  {!showExplanation ? (
                    <Button onClick={handleAnswer} disabled={selectedAnswer === null}>
                      Submit
                    </Button>
                  ) : (
                    <Button onClick={nextQuestion} className="gap-1">
                      {currentQ < ASSESSMENT_QUESTIONS.length - 1 ? "Next" : "See Results"} <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Results */}
            {phase === "results" && (
              <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4">
                    <Trophy className="w-10 h-10 text-primary" />
                  </motion.div>
                  <h1 className="text-3xl font-bold font-display text-foreground">Assessment Complete!</h1>
                  <p className="text-muted-foreground mt-2">Here's how you did across topics</p>
                </div>

                {/* Overall Score */}
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
                  <p className="text-5xl font-bold text-primary">{getTotalScore()}%</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Recommended: <span className="text-foreground font-bold">Level {getRecommendedLevel()}</span>
                  </p>
                </div>

                {/* Category Breakdown */}
                <div className="space-y-3">
                  {CATEGORIES.map(cat => {
                    const scores = getScores();
                    const s = scores[cat.id];
                    if (!s) return null;
                    const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                    return (
                      <div key={cat.id} className="bg-card border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">{cat.icon} {cat.label}</span>
                          <span className={`text-sm font-bold ${pct >= 70 ? "text-emerald-500" : pct >= 40 ? "text-yellow-500" : "text-destructive"}`}>
                            {s.correct}/{s.total} ({pct}%)
                          </span>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>
                    );
                  })}
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                    <h3 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-emerald-500" /> Strengths
                    </h3>
                    {getStrongTopics().length > 0 ? (
                      <div className="space-y-1">
                        {getStrongTopics().map(t => (
                          <p key={t} className="text-xs text-muted-foreground">
                            ✅ {CATEGORIES.find(c => c.id === t)?.label}
                          </p>
                        ))}
                      </div>
                    ) : <p className="text-xs text-muted-foreground">Keep practicing!</p>}
                  </div>
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
                    <h3 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-1">
                      <Target className="w-4 h-4 text-orange-500" /> Focus Areas
                    </h3>
                    {getWeakTopics().length > 0 ? (
                      <div className="space-y-1">
                        {getWeakTopics().map(t => (
                          <p key={t} className="text-xs text-muted-foreground">
                            🎯 {CATEGORIES.find(c => c.id === t)?.label}
                          </p>
                        ))}
                      </div>
                    ) : <p className="text-xs text-muted-foreground">Great job!</p>}
                  </div>
                </div>

                <Button onClick={handleFinish} disabled={saving} className="w-full gap-2" size="lg">
                  {saving ? "Setting up your path..." : `Start at Level ${getRecommendedLevel()}`}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
