import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check, X, RotateCcw, ChevronRight, Clock,
  Brain, Target, TrendingUp, BookOpen, Lightbulb,
  ArrowRight, Star, Zap, Trophy, FileText, Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type {
  QuizQuestion, Flashcard, StudyPlanDay,
  WeaknessItem, SkillRecommendation, AIToolResult, ExerciseSolution,
} from "../types";

// ─── Quiz Card ───
export const QuizCard = ({ questions }: { questions: QuizQuestion[] }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[current];
  const answered = selected !== null;

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
    if (i === q.correctIndex) setScore(s => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pct = (score / questions.length) * 100;
    return (
      <div className="bg-card border border-border rounded-xl p-5 text-center">
        <Trophy className={`w-10 h-10 mx-auto mb-3 ${pct >= 70 ? "text-primary" : "text-amber-500"}`} />
        <h3 className="text-lg font-bold text-foreground mb-1">Quiz Complete!</h3>
        <p className="text-2xl font-bold text-primary mb-1">{score}/{questions.length}</p>
        <Progress value={pct} className="h-2 mb-3" />
        <p className="text-sm text-muted-foreground mb-4">
          {pct >= 80 ? "Excellent work! 🎉" : pct >= 60 ? "Good job! Keep practicing." : "Keep learning — you'll improve!"}
        </p>
        <Button onClick={restart} variant="outline" size="sm" className="gap-1">
          <RotateCcw className="w-3 h-3" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground font-medium">Question {current + 1}/{questions.length}</span>
        <span className="text-xs font-bold text-primary">{score} correct</span>
      </div>
      <p className="text-sm font-semibold text-foreground mb-3">{q.question}</p>
      <div className="space-y-2 mb-3">
        {q.options.map((opt, i) => {
          let style = "border-border hover:border-primary/40 bg-card";
          if (answered) {
            if (i === q.correctIndex) style = "border-primary bg-primary/10";
            else if (i === selected) style = "border-destructive bg-destructive/10";
          } else if (i === selected) style = "border-primary bg-primary/5";

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left px-3 py-2.5 rounded-lg border-2 text-sm transition-all flex items-center gap-2 ${style}`}
            >
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {answered && i === q.correctIndex && <Check className="w-4 h-4 text-primary shrink-0" />}
              {answered && i === selected && i !== q.correctIndex && <X className="w-4 h-4 text-destructive shrink-0" />}
            </button>
          );
        })}
      </div>
      {answered && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5">
            <Lightbulb className="w-3 h-3 inline mr-1 text-amber-500" />
            {q.explanation}
          </p>
        </motion.div>
      )}
      {answered && (
        <Button onClick={next} size="sm" className="w-full gap-1">
          {current + 1 >= questions.length ? "See Results" : "Next"} <ChevronRight className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};

// ─── Flashcard Card ───
export const FlashcardStack = ({ cards }: { cards: Flashcard[] }) => {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const card = cards[idx];

  const next = () => {
    setFlipped(false);
    setShowHint(false);
    setIdx(i => (i + 1) % cards.length);
  };

  const prev = () => {
    setFlipped(false);
    setShowHint(false);
    setIdx(i => (i - 1 + cards.length) % cards.length);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
          <BookOpen className="w-3 h-3" /> Card {idx + 1}/{cards.length}
        </span>
        <button onClick={() => setFlipped(f => !f)} className="text-xs text-primary font-medium hover:underline">
          {flipped ? "Show Question" : "Show Answer"}
        </button>
      </div>

      <motion.div
        key={`${idx}-${flipped}`}
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-[100px] bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-center text-center cursor-pointer"
        onClick={() => setFlipped(f => !f)}
      >
        <div>
          <p className="text-[10px] text-muted-foreground mb-1.5 uppercase font-bold tracking-wider">
            {flipped ? "Answer" : "Question"}
          </p>
          <p className="text-sm font-medium text-foreground">{flipped ? card.back : card.front}</p>
        </div>
      </motion.div>

      {card.hint && !flipped && (
        <div className="mt-2">
          {showHint ? (
            <p className="text-xs text-muted-foreground bg-amber-500/10 rounded-lg p-2">
              <Lightbulb className="w-3 h-3 inline mr-1 text-amber-500" /> {card.hint}
            </p>
          ) : (
            <button onClick={() => setShowHint(true)} className="text-xs text-amber-500 hover:underline">
              Show hint
            </button>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-3">
        <Button onClick={prev} variant="outline" size="sm">Previous</Button>
        <Button onClick={next} size="sm">Next</Button>
      </div>
    </div>
  );
};

// ─── Study Plan Card ───
export const StudyPlanCard = ({ plan, title }: { plan: StudyPlanDay[]; title: string }) => {
  const [expanded, setExpanded] = useState<number | null>(0);
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Target className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{title}</p>
          <p className="text-[10px] text-muted-foreground">{plan.length} days</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {plan.map((day, i) => (
          <div key={i} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary w-5">{day.day.slice(0, 3)}</span>
                <span className="text-xs font-medium text-foreground">{day.focus}</span>
              </div>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {day.duration}
              </span>
            </button>
            {expanded === i && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="px-3 pb-2.5">
                <ul className="space-y-1">
                  {day.tasks.map((task, j) => (
                    <li key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <ArrowRight className="w-3 h-3 text-primary shrink-0 mt-0.5" /> {task}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Weakness Analysis Card ───
export const WeaknessCard = ({ weaknesses }: { weaknesses: WeaknessItem[] }) => {
  const levelColors = { high: "text-red-500 bg-red-500/10", medium: "text-amber-500 bg-amber-500/10", low: "text-blue-500 bg-blue-500/10" };
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
          <Brain className="w-4 h-4 text-red-500" />
        </div>
        <p className="text-sm font-bold text-foreground">Weakness Analysis</p>
      </div>
      <div className="space-y-2">
        {weaknesses.map((w, i) => (
          <div key={i} className="border border-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-foreground">{w.topic}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${levelColors[w.level]}`}>
                {w.level}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{w.suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Skill Recommendation Card ───
export const RecommendationCard = ({ recommendations }: { recommendations: SkillRecommendation[] }) => {
  const priorityIcons = { high: Star, medium: TrendingUp, low: Zap };
  const priorityColors = { high: "text-primary", medium: "text-amber-500", low: "text-blue-500" };
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
        <p className="text-sm font-bold text-foreground">Recommended Skills</p>
      </div>
      <div className="space-y-2">
        {recommendations.map((r, i) => {
          const Icon = priorityIcons[r.priority];
          return (
            <div key={i} className="border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${priorityColors[r.priority]}`} /> {r.skill}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {r.estimatedTime}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{r.reason}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Summary Card ───
export const SummaryCard = ({ summary, keyPoints }: { summary: string; keyPoints: string[] }) => (
  <div className="bg-card border border-border rounded-xl p-4">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
        <BookOpen className="w-4 h-4 text-blue-500" />
      </div>
      <p className="text-sm font-bold text-foreground">Summary</p>
    </div>
    <p className="text-sm text-muted-foreground mb-3">{summary}</p>
    <div className="space-y-1.5">
      <p className="text-xs font-bold text-foreground">Key Points:</p>
      {keyPoints.map((p, i) => (
        <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
          <Check className="w-3 h-3 text-primary shrink-0 mt-0.5" /> {p}
        </p>
      ))}
    </div>
  </div>
);

// ─── Solution Card ───
export const SolutionCard = ({ exerciseTitle, solutions, overallNotes }: ExerciseSolution) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <FileText className="w-4 h-4 text-emerald-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{exerciseTitle}</p>
          <p className="text-[10px] text-muted-foreground">{solutions.length} question{solutions.length > 1 ? "s" : ""} solved</p>
        </div>
      </div>

      <div className="space-y-3">
        {solutions.map((sol, i) => (
          <div key={i} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              className="w-full flex items-start gap-2 p-3 text-left hover:bg-muted/30 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-primary">{i + 1}</span>
              </div>
              <p className="text-xs text-foreground font-medium flex-1">{sol.question}</p>
              <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform ${expandedIdx === i ? "rotate-90" : ""}`} />
            </button>

            {expandedIdx === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="border-t border-border"
              >
                <div className="p-3 space-y-3">
                  {/* Answer / Code */}
                  <div>
                    <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider mb-1 flex items-center gap-1">
                      <Code2 className="w-3 h-3" /> Solution
                    </p>
                    <pre className="bg-muted/60 rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap">{sol.answer}</pre>
                  </div>
                  {/* Explanation */}
                  <div>
                    <p className="text-[10px] uppercase font-bold text-blue-500 tracking-wider mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" /> Explanation
                    </p>
                    <p className="text-xs text-muted-foreground">{sol.explanation}</p>
                  </div>
                  {/* Tips */}
                  {sol.tips && (
                    <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-2.5">
                      <p className="text-[10px] uppercase font-bold text-amber-600 tracking-wider mb-0.5 flex items-center gap-1">
                        <Star className="w-3 h-3" /> Tip
                      </p>
                      <p className="text-xs text-muted-foreground">{sol.tips}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {overallNotes && (
        <div className="mt-4 bg-primary/5 border border-primary/15 rounded-lg p-3">
          <p className="text-[10px] uppercase font-bold text-primary tracking-wider mb-1">Overall Notes</p>
          <p className="text-xs text-muted-foreground">{overallNotes}</p>
        </div>
      )}
    </div>
  );
};

// ─── Tool Result Renderer ───
export const ToolResultRenderer = ({ result }: { result: AIToolResult }) => {
  switch (result.type) {
    case "quiz":
      return <QuizCard questions={(result.data as any).questions} />;
    case "flashcards":
      return <FlashcardStack cards={(result.data as any).cards} />;
    case "study_plan":
      return <StudyPlanCard plan={(result.data as any).plan} title={(result.data as any).title || "Study Plan"} />;
    case "weakness_analysis":
      return <WeaknessCard weaknesses={(result.data as any).weaknesses} />;
    case "skill_recommendation":
      return <RecommendationCard recommendations={(result.data as any).recommendations} />;
    case "summary":
    case "thread_summary":
      return <SummaryCard summary={(result.data as any).summary} keyPoints={(result.data as any).keyPoints || []} />;
    case "exercise_solution":
      return <SolutionCard {...(result.data as any)} />;
    default:
      return null;
  }
};
