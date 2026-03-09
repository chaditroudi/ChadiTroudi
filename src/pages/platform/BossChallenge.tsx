import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Swords, Timer, Play, RotateCcw, CheckCircle2, XCircle,
  ArrowLeft, Sparkles, Shield, Zap, AlertTriangle
} from "lucide-react";

interface Island {
  id: string;
  name: string;
  icon: string;
  order_index: number;
  description: string;
}

interface EvalResult {
  passed: boolean;
  score: number;
  feedback: string;
  errors: string[];
  suggestions: string[];
  correctedCode: string | null;
}

const BOSS_CHALLENGES: Record<number, { title: string; description: string; language: string; timeLimit: number; starterCode: string; expectedOutput: string }> = {
  1: {
    title: "The Variable Master",
    description: "Create a program that declares variables of different types (string, number, boolean), performs operations on them, and prints a formatted summary. Include at least one calculation and one string concatenation.",
    language: "javascript",
    timeLimit: 600,
    starterCode: `// Boss Challenge: The Variable Master
// Create variables, perform operations, print a summary

`,
    expectedOutput: "A program using multiple variable types with operations",
  },
  2: {
    title: "The Logic Gate Guardian",
    description: "Write a function that takes a number and returns a string classification: 'fizzbuzz' if divisible by both 3 and 5, 'fizz' if divisible by 3, 'buzz' if divisible by 5, or the number as a string. Test it with numbers 1-20.",
    language: "javascript",
    timeLimit: 600,
    starterCode: `// Boss Challenge: The Logic Gate Guardian
// Implement FizzBuzz with proper conditional logic

function classify(n) {
  // Your code here
}

// Test with 1-20
for (let i = 1; i <= 20; i++) {
  console.log(classify(i));
}
`,
    expectedOutput: "Correct FizzBuzz output for 1-20",
  },
  3: {
    title: "The Loop Dragon",
    description: "Write a program that finds all prime numbers between 2 and 100 using nested loops. Store them in an array and print the total count and the primes.",
    language: "javascript",
    timeLimit: 900,
    starterCode: `// Boss Challenge: The Loop Dragon
// Find all prime numbers between 2 and 100

function findPrimes(max) {
  // Your code here
}

const primes = findPrimes(100);
console.log("Count:", primes.length);
console.log("Primes:", primes);
`,
    expectedOutput: "25 prime numbers between 2 and 100",
  },
  4: {
    title: "The Function Wizard",
    description: "Create a mini calculator using higher-order functions. Write a function 'createCalculator' that returns an object with add, subtract, multiply, divide methods. Each method should handle edge cases (like division by zero).",
    language: "javascript",
    timeLimit: 900,
    starterCode: `// Boss Challenge: The Function Wizard
// Create a calculator using higher-order functions

function createCalculator() {
  // Your code here
}

const calc = createCalculator();
console.log(calc.add(10, 5));
console.log(calc.subtract(10, 5));
console.log(calc.multiply(10, 5));
console.log(calc.divide(10, 5));
console.log(calc.divide(10, 0));
`,
    expectedOutput: "Calculator with proper results and edge case handling",
  },
  5: {
    title: "The Data Structure Kraken",
    description: "Implement a Stack class with push, pop, peek, isEmpty, and size methods. Then use it to check if a string of brackets '()[]{}' is balanced.",
    language: "javascript",
    timeLimit: 1200,
    starterCode: `// Boss Challenge: The Data Structure Kraken
// Implement a Stack and use it for bracket matching

class Stack {
  // Your code here
}

function isBalanced(str) {
  // Use your Stack class
}

console.log(isBalanced("()[]{}"));    // true
console.log(isBalanced("([{}])"));    // true
console.log(isBalanced("([)]"));      // false
console.log(isBalanced("{[}"));       // false
`,
    expectedOutput: "Correct bracket matching results",
  },
  6: {
    title: "The Algorithm Phoenix",
    description: "Implement binary search and merge sort. Then use binary search to find a target in a sorted array produced by merge sort.",
    language: "javascript",
    timeLimit: 1200,
    starterCode: `// Boss Challenge: The Algorithm Phoenix
// Implement merge sort and binary search

function mergeSort(arr) {
  // Your code here
}

function binarySearch(arr, target) {
  // Your code here - return index or -1
}

const unsorted = [38, 27, 43, 3, 9, 82, 10];
const sorted = mergeSort(unsorted);
console.log("Sorted:", sorted);
console.log("Find 43:", binarySearch(sorted, 43));
console.log("Find 99:", binarySearch(sorted, 99));
`,
    expectedOutput: "Correct sorting and search results",
  },
  7: {
    title: "The Project Architect",
    description: "Build a simple todo list manager with functions to: add a task, remove by id, mark complete, list all tasks, and filter by status. Use an array of objects as storage.",
    language: "javascript",
    timeLimit: 1500,
    starterCode: `// Boss Challenge: The Project Architect
// Build a Todo List Manager

class TodoManager {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }
  
  // Implement: add, remove, complete, listAll, filterByStatus
}

const todo = new TodoManager();
todo.add("Learn JavaScript");
todo.add("Build a project");
todo.add("Deploy app");
todo.complete(1);
console.log(todo.listAll());
console.log(todo.filterByStatus("completed"));
`,
    expectedOutput: "Working todo manager with all operations",
  },
  8: {
    title: "The AI Overlord",
    description: "Implement a simple k-nearest neighbors classifier. Given a dataset of 2D points with labels, classify a new point by finding the k closest points and returning the majority label.",
    language: "javascript",
    timeLimit: 1800,
    starterCode: `// Boss Challenge: The AI Overlord
// Implement K-Nearest Neighbors

function knn(dataset, point, k) {
  // dataset: [{x, y, label}]
  // point: {x, y}
  // k: number of neighbors
  // return: predicted label
}

const data = [
  {x: 1, y: 1, label: "A"}, {x: 1.5, y: 2, label: "A"},
  {x: 3, y: 3, label: "A"}, {x: 5, y: 4, label: "B"},
  {x: 6, y: 5, label: "B"}, {x: 5.5, y: 6, label: "B"},
];

console.log(knn(data, {x: 2, y: 2}, 3)); // "A"
console.log(knn(data, {x: 5, y: 5}, 3)); // "B"
`,
    expectedOutput: "Correct KNN classification",
  },
};

const BossChallenge = () => {
  const { islandId } = useParams();
  const navigate = useNavigate();
  const { user, loading, requireAuth } = usePlatformAuth();
  const [island, setIsland] = useState<Island | null>(null);
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [showReward, setShowReward] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { requireAuth(); }, [loading, user]);

  useEffect(() => {
    if (!user || !islandId) return;
    loadIsland();
  }, [user, islandId]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const loadIsland = async () => {
    const { data } = await supabase.from("islands").select("*").eq("id", islandId!).single();
    if (data) {
      const islandData = data as unknown as Island;
      setIsland(islandData);
      const challenge = BOSS_CHALLENGES[islandData.order_index];
      if (challenge) {
        setCode(challenge.starterCode);
        setTimeLeft(challenge.timeLimit);
      }
    }
  };

  const startChallenge = () => {
    setStarted(true);
    setResult(null);
    const challenge = BOSS_CHALLENGES[island?.order_index || 1];
    if (challenge) setTimeLeft(challenge.timeLimit);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          toast.error("⏰ Time's up! The boss defeated you this time.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Play start sound
    playSound(440, 0.15, "square");
    setTimeout(() => playSound(554, 0.15, "square"), 150);
    setTimeout(() => playSound(659, 0.2, "square"), 300);
  };

  const playSound = (freq: number, dur: number, type: OscillatorType = "sine") => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch {}
  };

  const submitSolution = async () => {
    if (!island || !user || timeLeft <= 0) return;
    if (timerRef.current) clearInterval(timerRef.current);
    
    setEvaluating(true);
    const challenge = BOSS_CHALLENGES[island.order_index];
    
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-challenge", {
        body: {
          code,
          challenge: {
            title: `Boss: ${challenge.title}`,
            description: challenge.description,
            difficulty: "boss",
            language: challenge.language,
            expected_output: challenge.expectedOutput,
          },
        },
      });

      if (error) throw error;
      
      const evalResult = data as EvalResult;
      setResult(evalResult);

      if (evalResult.passed && evalResult.score >= 60) {
        // PASSED - unlock next island
        playSound(523, 0.2, "square");
        setTimeout(() => playSound(659, 0.2, "square"), 200);
        setTimeout(() => playSound(784, 0.3, "square"), 400);
        setTimeout(() => playSound(1047, 0.5, "square"), 600);
        
        // Upsert island progress
        await supabase.from("island_progress").upsert({
          user_id: user.id,
          island_id: islandId!,
          completion_percentage: 100,
          boss_completed: true,
          unlocked: true,
          completed_at: new Date().toISOString(),
        }, { onConflict: "user_id,island_id" });

        // Award XP
        const xpAmount = 200 + Math.floor(evalResult.score * 2);
        await supabase.from("xp_logs").insert({
          user_id: user.id,
          amount: xpAmount,
          source: "boss_challenge",
          description: `Boss defeated: ${island.name} — ${challenge.title}`,
        });

        const { data: profile } = await supabase
          .from("student_profiles")
          .select("total_xp")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          await supabase.from("student_profiles")
            .update({ total_xp: (profile as any).total_xp + xpAmount, last_active_at: new Date().toISOString() })
            .eq("user_id", user.id);
        }

        // Show treasure chest reward
        setTimeout(() => setShowReward(true), 1500);
      } else {
        playSound(200, 0.4, "sawtooth");
      }
    } catch (err) {
      console.error("Eval error:", err);
      toast.error("Failed to evaluate. Please try again.");
    } finally {
      setEvaluating(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (loading || !island) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading boss challenge...</div>;

  const challenge = BOSS_CHALLENGES[island.order_index];
  if (!challenge) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Boss challenge not found for this island.</div>;

  const timePct = (timeLeft / challenge.timeLimit) * 100;
  const timeUrgent = timeLeft < 60;

  return (
    <div className="min-h-screen bg-background">
      {/* Reward Overlay */}
      <AnimatePresence>
        {showReward && (
          <TreasureChestReward
            islandName={island.name}
            islandIcon={island.icon}
            score={result?.score || 0}
            onClose={() => navigate("/platform/world-map")}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-red-500/5 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/platform/island/${islandId}`)} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Swords className="w-5 h-5 text-orange-500" />
            <div>
              <h1 className="font-bold text-foreground text-sm">Boss Challenge</h1>
              <p className="text-xs text-muted-foreground">{island.icon} {island.name}</p>
            </div>
          </div>
          {started && (
            <div className="flex items-center gap-3">
              <Badge variant={timeUrgent ? "destructive" : "secondary"} className="gap-1 font-mono text-sm">
                <Timer className="w-3.5 h-3.5" />
                {formatTime(timeLeft)}
              </Badge>
              <div className="w-24">
                <Progress value={timePct} className={`h-2 ${timeUrgent ? "[&>div]:bg-destructive" : ""}`} />
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {!started ? (
          /* Pre-start screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center py-16"
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, -3, 3, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              ⚔️
            </motion.div>
            <h1 className="text-3xl font-bold font-display text-foreground mb-2">{challenge.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{island.icon} Island {island.order_index}: {island.name}</p>
            
            <div className="bg-card border border-border rounded-2xl p-6 text-left mb-8">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" /> Challenge Description
              </h3>
              <p className="text-muted-foreground mb-4">{challenge.description}</p>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-muted/30 rounded-xl p-3">
                  <Timer className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Time Limit</p>
                  <p className="font-bold text-foreground">{formatTime(challenge.timeLimit)}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3">
                  <Zap className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">XP Reward</p>
                  <p className="font-bold text-foreground">200+</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Difficulty</p>
                  <p className="font-bold text-foreground">Boss</p>
                </div>
              </div>
            </div>

            <Button size="lg" onClick={startChallenge} className="bg-orange-500 hover:bg-orange-600 text-white gap-2 text-lg px-8 py-6">
              <Swords className="w-5 h-5" /> Begin Boss Fight
            </Button>
          </motion.div>
        ) : (
          /* Challenge in progress */
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Problem */}
            <div>
              <div className="bg-card border border-border rounded-2xl p-6 mb-4">
                <h2 className="font-bold text-foreground text-lg mb-1 flex items-center gap-2">
                  <Swords className="w-5 h-5 text-orange-500" /> {challenge.title}
                </h2>
                <p className="text-muted-foreground text-sm">{challenge.description}</p>
              </div>

              {/* Result */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`rounded-2xl border p-6 ${
                      result.passed && result.score >= 60
                        ? "bg-primary/5 border-primary/30"
                        : "bg-destructive/5 border-destructive/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {result.passed && result.score >= 60 ? (
                        <CheckCircle2 className="w-8 h-8 text-primary" />
                      ) : (
                        <XCircle className="w-8 h-8 text-destructive" />
                      )}
                      <div>
                        <h3 className="font-bold text-foreground">
                          {result.passed && result.score >= 60 ? "🏆 Boss Defeated!" : "💀 Boss Wins This Round"}
                        </h3>
                        <p className="text-sm text-muted-foreground">Score: {result.score}/100</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{result.feedback}</p>
                    
                    {result.errors.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-bold text-destructive mb-1">Errors:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {result.errors.map((e, i) => <li key={i}>• {e}</li>)}
                        </ul>
                      </div>
                    )}
                    {result.suggestions.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-muted-foreground mb-1">Suggestions:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {result.suggestions.map((s, i) => <li key={i}>💡 {s}</li>)}
                        </ul>
                      </div>
                    )}

                    {!(result.passed && result.score >= 60) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 gap-1"
                        onClick={() => {
                          setResult(null);
                          startChallenge();
                        }}
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Try Again
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Editor */}
            <div className="flex flex-col">
              <div className="bg-card border border-border rounded-2xl overflow-hidden flex-1 flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    <span className="text-xs text-muted-foreground ml-2 font-mono">{challenge.language}</span>
                  </div>
                </div>
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  disabled={timeLeft <= 0 || !!result}
                  className="flex-1 min-h-[400px] p-4 bg-background font-mono text-sm text-foreground resize-none focus:outline-none"
                  spellCheck={false}
                />
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={submitSolution}
                  disabled={evaluating || timeLeft <= 0 || !code.trim() || (result?.passed && result.score >= 60)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white gap-2"
                  size="lg"
                >
                  {evaluating ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                      AI Evaluating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Submit Solution
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

/* ====== Treasure Chest Reward Component ====== */
const TreasureChestReward = ({
  islandName,
  islandIcon,
  score,
  onClose,
}: {
  islandName: string;
  islandIcon: string;
  score: number;
  onClose: () => void;
}) => {
  const [opened, setOpened] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<{ id: number; x: number; y: number; color: string; rotation: number; delay: number }[]>([]);

  const playVictorySound = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const notes = [523, 587, 659, 784, 880, 1047];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.3);
      });
    } catch {}
  }, []);

  const openChest = () => {
    setOpened(true);
    playVictorySound();
    
    // Generate confetti
    const colors = ["#f59e0b", "#ef4444", "#22c55e", "#3b82f6", "#a855f7", "#ec4899", "#14b8a6"];
    const pieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * -50 - 20,
      color: colors[i % colors.length],
      rotation: Math.random() * 720 - 360,
      delay: Math.random() * 0.5,
    }));
    setConfettiPieces(pieces);
  };

  const xpEarned = 200 + Math.floor(score * 2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      {/* Confetti */}
      {confettiPieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, rotate: 0, scale: 0 }}
          animate={{
            y: "110vh",
            rotate: p.rotation,
            scale: [0, 1.5, 1],
          }}
          transition={{ duration: 3 + Math.random() * 2, delay: p.delay, ease: "easeOut" }}
          className="fixed w-3 h-3 rounded-sm z-50"
          style={{ backgroundColor: p.color, left: 0, top: 0 }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="bg-card border border-border rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden"
      >
        {/* Glow background */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 via-transparent to-orange-500/5 pointer-events-none" />

        {!opened ? (
          <>
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, -2, 2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-6 relative z-10 cursor-pointer"
              onClick={openChest}
            >
              🎁
            </motion.div>
            <h2 className="text-2xl font-bold font-display text-foreground mb-2 relative z-10">
              Island Conquered!
            </h2>
            <p className="text-muted-foreground mb-6 relative z-10">
              You defeated the boss of {islandIcon} {islandName}!
            </p>
            <Button
              onClick={openChest}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white gap-2 relative z-10"
            >
              <Sparkles className="w-5 h-5" /> Open Treasure Chest
            </Button>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 360 }}
              transition={{ duration: 1 }}
              className="text-8xl mb-4 relative z-10"
            >
              🏆
            </motion.div>
            <h2 className="text-2xl font-bold font-display text-foreground mb-1 relative z-10">
              {islandIcon} {islandName} Mastered!
            </h2>
            <p className="text-muted-foreground mb-6 relative z-10">You've earned these rewards:</p>

            <div className="space-y-3 mb-6 relative z-10">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3"
              >
                <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Zap className="w-4 h-4 text-yellow-500" /> Bonus XP
                </span>
                <span className="text-yellow-500 font-bold">+{xpEarned} XP</span>
              </motion.div>

              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-4 py-3"
              >
                <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                  🏅 Badge Earned
                </span>
                <span className="text-primary font-bold">Master of {islandName}</span>
              </motion.div>

              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3"
              >
                <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                  🔓 Next Island
                </span>
                <span className="text-emerald-500 font-bold">Unlocked!</span>
              </motion.div>

              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="flex items-center justify-between bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-3"
              >
                <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                  ⭐ Score
                </span>
                <span className="text-purple-500 font-bold">{score}/100</span>
              </motion.div>
            </div>

            <Button onClick={onClose} size="lg" className="w-full gap-2 relative z-10">
              Continue Adventure →
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BossChallenge;
