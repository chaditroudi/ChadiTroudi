import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Code2, Play, CheckCircle2, XCircle, Lightbulb, ChevronDown, Trophy, Zap, Brain } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type Challenge = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  language: string;
  category: string;
  starter_code: string;
  hints: string[];
  expected_output: string | null;
};

type Evaluation = {
  passed: boolean;
  score: number;
  feedback: string;
  errors: string[];
  suggestions: string[];
  correctedCode: string | null;
};

const difficultyConfig = {
  beginner: { icon: Zap, color: "text-green-500", bg: "bg-green-500/10 border-green-500/20", label: "Beginner" },
  intermediate: { icon: Brain, color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20", label: "Intermediate" },
  advanced: { icon: Trophy, color: "text-red-500", bg: "bg-red-500/10 border-red-500/20", label: "Advanced" },
};

const ChallengesSection = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [showHints, setShowHints] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      const { data, error } = await supabase
        .from("coding_challenges")
        .select("*")
        .order("difficulty");
      if (error) {
        console.error("Error fetching challenges:", error);
        toast.error("Failed to load challenges");
      } else {
        setChallenges(data || []);
      }
      setLoading(false);
    };
    fetchChallenges();
  }, []);

  const selectChallenge = (c: Challenge) => {
    setSelectedChallenge(c);
    setCode(c.starter_code);
    setEvaluation(null);
    setShowHints(false);
  };

  const evaluateCode = async () => {
    if (!selectedChallenge || !code.trim()) return;
    setIsEvaluating(true);
    setEvaluation(null);

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evaluate-challenge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ code, challenge: selectedChallenge }),
        }
      );

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Evaluation failed");
      }

      const result: Evaluation = await resp.json();
      setEvaluation(result);

      if (result.passed) {
        toast.success("🎉 Challenge passed! Great work!");
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      toast.error("Failed to evaluate. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const filtered = filter === "all" ? challenges : challenges.filter((c) => c.difficulty === filter);

  return (
    <section id="challenges" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Code2 className="w-4 h-4" />
            Interactive Challenges
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Sharpen Your Skills
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Practice coding with real challenges. Write your solution, submit it, and get instant AI-powered feedback.
          </p>
        </motion.div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {["all", "beginner", "intermediate", "advanced"].map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                filter === d
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {d === "all" ? "All Levels" : difficultyConfig[d as keyof typeof difficultyConfig].label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Challenge List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading challenges...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No challenges found.</div>
            ) : (
              filtered.map((c, i) => {
                const cfg = difficultyConfig[c.difficulty as keyof typeof difficultyConfig] || difficultyConfig.beginner;
                const Icon = cfg.icon;
                return (
                  <motion.button
                    key={c.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => selectChallenge(c)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedChallenge?.id === c.id
                        ? "bg-primary/5 border-primary shadow-md"
                        : "bg-card border-border hover:border-primary/30 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg border ${cfg.bg}`}>
                        <Icon className={`w-4 h-4 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-foreground">{c.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                        <div className="flex gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border">
                            {c.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>

          {/* Code Editor & Evaluation */}
          <div className="space-y-4">
            {selectedChallenge ? (
              <>
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="font-bold text-lg text-foreground mb-2">{selectedChallenge.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{selectedChallenge.description}</p>
                  {selectedChallenge.expected_output && (
                    <div className="text-xs bg-muted/50 rounded-lg p-3 font-mono text-muted-foreground">
                      <span className="font-semibold text-foreground">Expected: </span>
                      {selectedChallenge.expected_output}
                    </div>
                  )}
                </div>

                {/* Code Editor */}
                <div className="relative">
                  <div className="flex items-center justify-between bg-foreground/5 rounded-t-xl px-4 py-2 border border-border border-b-0">
                    <span className="text-xs font-mono text-muted-foreground">{selectedChallenge.language}</span>
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-400/60" />
                      <span className="w-3 h-3 rounded-full bg-yellow-400/60" />
                      <span className="w-3 h-3 rounded-full bg-green-400/60" />
                    </div>
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-48 bg-card border border-border rounded-b-xl p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    spellCheck={false}
                    placeholder="Write your solution here..."
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={evaluateCode}
                    disabled={isEvaluating || !code.trim()}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isEvaluating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Submit Solution
                      </>
                    )}
                  </button>
                  {selectedChallenge.hints.length > 0 && (
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="flex items-center gap-2 px-4 rounded-xl border border-border text-sm text-muted-foreground hover:border-primary/50 transition-colors"
                    >
                      <Lightbulb className="w-4 h-4" />
                      Hints
                      <ChevronDown className={`w-3 h-3 transition-transform ${showHints ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>

                {/* Hints */}
                <AnimatePresence>
                  {showHints && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 space-y-2">
                        {selectedChallenge.hints.map((hint, i) => (
                          <div key={i} className="flex gap-2 text-sm">
                            <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{hint}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Evaluation Results */}
                <AnimatePresence>
                  {evaluation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`rounded-xl border p-5 space-y-4 ${
                        evaluation.passed
                          ? "bg-green-500/5 border-green-500/20"
                          : "bg-red-500/5 border-red-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {evaluation.passed ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500" />
                        )}
                        <div>
                          <h4 className="font-bold text-foreground">
                            {evaluation.passed ? "Passed!" : "Not quite right"}
                          </h4>
                          <p className="text-sm text-muted-foreground">Score: {evaluation.score}/100</p>
                        </div>
                        <div className="ml-auto">
                          <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-sm"
                            style={{
                              borderColor: evaluation.score >= 80 ? "hsl(var(--primary))" : evaluation.score >= 50 ? "hsl(40, 90%, 50%)" : "hsl(0, 72%, 50%)",
                              color: evaluation.score >= 80 ? "hsl(var(--primary))" : evaluation.score >= 50 ? "hsl(40, 90%, 50%)" : "hsl(0, 72%, 50%)",
                            }}
                          >
                            {evaluation.score}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-foreground">{evaluation.feedback}</p>

                      {evaluation.errors.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-red-500 uppercase mb-2">Issues Found</h5>
                          <ul className="space-y-1">
                            {evaluation.errors.map((err, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                <span className="text-red-400">•</span> {err}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {evaluation.suggestions.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-primary uppercase mb-2">Suggestions</h5>
                          <ul className="space-y-1">
                            {evaluation.suggestions.map((s, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                <span className="text-primary">→</span> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {evaluation.correctedCode && (
                        <div>
                          <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Corrected Code</h5>
                          <pre className="bg-foreground/5 rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto">
                            {evaluation.correctedCode}
                          </pre>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <Code2 className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Select a Challenge</h3>
                <p className="text-sm text-muted-foreground">
                  Pick a challenge from the list to start coding!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
