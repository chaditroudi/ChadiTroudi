import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Search, Bug, Clock, Star, Trophy, Target, ChevronRight,
  CheckCircle2, XCircle, AlertTriangle, ArrowRight, RotateCcw,
  Loader2, Zap, Timer, Eye, EyeOff, Lightbulb,
  Award, TrendingUp, Flame, Play, Shield, FileCode2,
  Terminal, AlertCircle, ChevronDown, ChevronUp, Lock,
  Unlock, Sparkles, History, Brain, Skull,
} from "lucide-react";

// ─── Types ───
type CaseDifficulty = "rookie" | "detective" | "mastermind";
type CaseStatus = "locked" | "available" | "in-progress" | "solved";
type BugType = "syntax" | "logic" | "runtime" | "race-condition" | "memory-leak" | "off-by-one" | "null-reference" | "type-error";

interface DebugCase {
  id: string;
  title: string;
  story: string;
  difficulty: CaseDifficulty;
  timeLimit: number; // seconds
  xpReward: number;
  bugs: CaseBug[];
  stackTrace: string;
  codeFile: string;
  fileName: string;
  language: string;
  redHerrings: string[];
  status: CaseStatus;
  bestTime?: number;
}

interface CaseBug {
  id: string;
  line: number;
  type: BugType;
  description: string;
  hint: string;
  found: boolean;
  fixed: boolean;
}

// ─── Mock Cases ───
const DEBUG_CASES: DebugCase[] = [
  {
    id: "case-1",
    title: "The Vanishing User",
    story: "Users report that their profiles disappear after saving. The support team is flooded with tickets. The deployed code passed all tests. What went wrong?",
    difficulty: "rookie",
    timeLimit: 300,
    xpReward: 50,
    stackTrace: `TypeError: Cannot read properties of undefined (reading 'name')
    at UserProfile.save (user-profile.js:24)
    at handleSubmit (form-handler.js:15)
    at HTMLFormElement.<anonymous> (form-handler.js:8)`,
    fileName: "user-profile.js",
    language: "javascript",
    codeFile: `const UserProfile = {
  data: null,

  async load(userId) {
    const response = await fetch(\`/api/users/\${userId}\`);
    const userData = await response.json();
    this.data = userData;
    return this.data;
  },

  validate() {
    // BUG 1: Should check this.data, not this.data.name
    // This passes when data exists but fails on empty response
    if (this.data.name && this.data.email) {
      return true;
    }
    return false;
  },

  async save() {
    if (!this.validate()) {
      throw new Error("Invalid profile data");
    }

    // BUG 2: Not awaiting the response
    const result = fetch("/api/users/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.data),
    });

    // This runs before the fetch completes
    this.data = null; // Clearing too early
    return result;
  },

  getDisplayName() {
    // Red herring: This works fine
    return this.data?.name || "Anonymous";
  }
};

// Form handler
document.getElementById("profile-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await UserProfile.save();
    showSuccess("Profile saved!");
  } catch (err) {
    showError(err.message);
  }
});`,
    bugs: [
      { id: "b1", line: 14, type: "null-reference", description: "No null check on this.data before accessing properties", hint: "What happens when this.data is null or undefined?", found: false, fixed: false },
      { id: "b2", line: 28, type: "logic", description: "fetch() not awaited - data cleared before save completes", hint: "The save request is async but something else runs immediately after...", found: false, fixed: false },
    ],
    redHerrings: ["getDisplayName uses optional chaining correctly — it's not the issue", "The form event listener properly awaits save()"],
    status: "available",
  },
  {
    id: "case-2",
    title: "The Infinite Loop of Doom",
    story: "The checkout page freezes after users add a discount code. CPU usage spikes to 100%. The code review found nothing. Can you spot the trap?",
    difficulty: "rookie",
    timeLimit: 360,
    xpReward: 75,
    stackTrace: `Maximum call stack size exceeded
    at applyDiscount (pricing.js:31)
    at applyDiscount (pricing.js:35)
    at applyDiscount (pricing.js:35)
    at applyDiscount (pricing.js:35)
    ... 10000+ frames`,
    fileName: "pricing.js",
    language: "javascript",
    codeFile: `class PricingEngine {
  constructor(items) {
    this.items = items;
    this.discounts = [];
    this.total = 0;
  }

  calculateSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  // BUG 1: No base case to stop recursion when discount is 0 or items empty
  applyDiscount(code) {
    const discount = this.lookupDiscount(code);
    if (discount.type === "percentage") {
      this.total = this.calculateSubtotal() * (1 - discount.value / 100);
    } else if (discount.type === "bogo") {
      // BUG 2: Calls itself instead of applyBogoDiscount
      this.applyDiscount(code);
    } else {
      this.total = this.calculateSubtotal() - discount.value;
    }
    return this.total;
  }

  applyBogoDiscount(code) {
    const cheapest = Math.min(...this.items.map(i => i.price));
    this.total = this.calculateSubtotal() - cheapest;
    return this.total;
  }

  lookupDiscount(code) {
    const discounts = {
      "SAVE20": { type: "percentage", value: 20 },
      "BOGO": { type: "bogo", value: 0 },
      "FLAT10": { type: "flat", value: 10 },
    };
    // BUG 3: Returns undefined for unknown codes (no fallback)
    return discounts[code];
  }

  formatPrice(amount) {
    // Red herring: This is fine
    return "$" + amount.toFixed(2);
  }
}`,
    bugs: [
      { id: "b1", line: 21, type: "logic", description: "Recursive call to applyDiscount instead of applyBogoDiscount", hint: "Look at what method is being called for BOGO discounts...", found: false, fixed: false },
      { id: "b2", line: 39, type: "runtime", description: "No fallback for unknown discount codes — returns undefined", hint: "What does lookupDiscount return when the code doesn't exist?", found: false, fixed: false },
    ],
    redHerrings: ["calculateSubtotal uses reduce correctly", "formatPrice works fine for valid numbers"],
    status: "available",
  },
  {
    id: "case-3",
    title: "The Ghost in the Machine",
    story: "Notifications are being sent to random users. Some users get messages meant for others. The notification system passed QA last week. Something changed...",
    difficulty: "detective",
    timeLimit: 480,
    xpReward: 120,
    stackTrace: `[WARN] NotificationService: Delivered to user_382 but recipient was user_517
[WARN] NotificationService: Delivered to user_104 but recipient was user_891
[ERROR] NotificationService: Queue processing out of order
[DEBUG] Worker pool: 4 workers, shared state detected`,
    fileName: "notification-worker.js",
    language: "javascript",
    codeFile: `// Shared mutable state between workers!
let currentNotification = null;

class NotificationWorker {
  constructor(workerId) {
    this.workerId = workerId;
    this.processing = false;
  }

  // BUG 1: Race condition — shared mutable currentNotification
  async processQueue(queue) {
    while (queue.length > 0) {
      currentNotification = queue.shift();
      this.processing = true;

      // Simulate async work (API call, template render, etc.)
      await this.sendNotification(currentNotification);

      this.processing = false;
    }
  }

  async sendNotification(notification) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));

    // BUG 2: Uses the shared variable instead of the parameter
    // By the time this runs, another worker may have changed currentNotification
    const recipient = currentNotification.userId;
    const message = currentNotification.message;

    await this.deliver(recipient, message);
    console.log(\`Worker \${this.workerId}: Sent to \${recipient}\`);
  }

  async deliver(userId, message) {
    // BUG 3: No error handling for failed deliveries
    const response = await fetch(\`/api/notify/\${userId}\`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
    // Missing: if (!response.ok) throw ...
    return response;
  }
}

// Worker pool setup
const workers = Array.from({ length: 4 }, (_, i) => new NotificationWorker(i));
function distributeWork(queue) {
  const chunkSize = Math.ceil(queue.length / workers.length);
  workers.forEach((worker, i) => {
    const chunk = queue.slice(i * chunkSize, (i + 1) * chunkSize);
    worker.processQueue(chunk); // All workers run concurrently
  });
}`,
    bugs: [
      { id: "b1", line: 1, type: "race-condition", description: "Shared mutable state (currentNotification) accessed by multiple workers concurrently", hint: "Multiple async workers are reading/writing the same variable...", found: false, fixed: false },
      { id: "b2", line: 30, type: "race-condition", description: "sendNotification reads shared variable instead of local parameter", hint: "The parameter 'notification' is passed but something else is used...", found: false, fixed: false },
      { id: "b3", line: 39, type: "runtime", description: "No error handling for failed HTTP requests in deliver()", hint: "What happens when the API returns an error status?", found: false, fixed: false },
    ],
    redHerrings: ["The worker pool distribution logic is correct", "setTimeout delay is just simulation — the bug isn't timing-related"],
    status: "available",
  },
  {
    id: "case-4",
    title: "Memory Eater",
    story: "The dashboard becomes increasingly slow over time. After running for a few hours, the app crashes with an out-of-memory error. The codebase looks clean...",
    difficulty: "detective",
    timeLimit: 540,
    xpReward: 150,
    stackTrace: `FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
    at EventTracker.track (analytics.js:18)
    at Dashboard.onUpdate (dashboard.js:42)
    at setInterval (dashboard.js:55)`,
    fileName: "analytics.js",
    language: "javascript",
    codeFile: `class EventTracker {
  constructor() {
    this.events = [];
    this.listeners = new Map();
    this.cache = {};
  }

  // BUG 1: Events array grows forever — never cleaned up
  track(eventName, data) {
    this.events.push({
      name: eventName,
      data: data,
      timestamp: Date.now(),
      // Creates new object reference each time
      metadata: { ...data, tracked: true },
    });

    this.notifyListeners(eventName, data);
  }

  // BUG 2: Listeners are added but never removed (addEventListener without cleanup)
  subscribe(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push(callback);
    // No unsubscribe mechanism returned
  }

  notifyListeners(eventName, data) {
    const callbacks = this.listeners.get(eventName) || [];
    callbacks.forEach(cb => cb(data));
  }

  // BUG 3: Cache never invalidated — grows with every unique key
  getStats(key) {
    if (!this.cache[key]) {
      this.cache[key] = this.events
        .filter(e => e.name === key)
        .map(e => ({ ...e, computed: true })); // Creates copies
    }
    return this.cache[key];
  }

  getEventCount() {
    return this.events.length;
  }
}

// Dashboard usage
const tracker = new EventTracker();

// This runs every 2 seconds, forever
setInterval(() => {
  tracker.track("dashboard.view", {
    page: window.location.pathname,
    viewport: { width: window.innerWidth, height: window.innerHeight },
  });
  // Stale cache keeps growing
  const stats = tracker.getStats("dashboard.view");
  updateDashboard(stats);
}, 2000);

// Components subscribe but never unsubscribe when unmounted
function initWidget(name) {
  tracker.subscribe("dashboard.view", (data) => {
    console.log(\`Widget \${name} updated\`);
  });
}`,
    bugs: [
      { id: "b1", line: 10, type: "memory-leak", description: "Events array grows unbounded — never pruned or capped", hint: "New events push into the array every 2 seconds but nothing ever removes them...", found: false, fixed: false },
      { id: "b2", line: 24, type: "memory-leak", description: "No unsubscribe mechanism — listeners accumulate in the Map", hint: "Components subscribe but what happens when they unmount?", found: false, fixed: false },
      { id: "b3", line: 40, type: "memory-leak", description: "Cache never invalidated — getStats creates copies that persist", hint: "The cache stores filtered copies but when is it ever cleared?", found: false, fixed: false },
    ],
    redHerrings: ["setInterval itself is fine — the issue isn't the interval", "notifyListeners properly iterates the callbacks"],
    status: "available",
  },
  {
    id: "case-5",
    title: "The Time Traveler's Bug",
    story: "Users in different time zones see wildly incorrect dates. A booking system shows events happening yesterday that are actually tomorrow. Daylight saving time is suspicious...",
    difficulty: "mastermind",
    timeLimit: 600,
    xpReward: 200,
    stackTrace: `[ERROR] BookingEngine: Event "Conference" scheduled for 2026-03-08 rendered as 2026-03-07
[WARN] DateUtils: Timezone offset mismatch: expected -05:00, got -04:00
[DEBUG] User timezone: America/New_York, Server timezone: UTC`,
    fileName: "date-utils.js",
    language: "javascript",
    codeFile: `class DateUtils {
  // BUG 1: Assumes all days have 24 hours (DST transition days don't)
  static addDays(date, days) {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }

  // BUG 2: Uses local timezone methods on UTC dates
  static formatDate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return \`\${year}-\${month}-\${day}\`;
  }

  // This is fine — red herring
  static parseDate(dateString) {
    return new Date(dateString + "T00:00:00.000Z");
  }

  // BUG 3: Compares dates without normalizing timezone
  static isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  // BUG 4: Off-by-one in month calculation
  static getMonthName(date) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    // getMonth() is 0-indexed, this adds 1 making it wrong for the array
    return months[date.getMonth() + 1];
  }

  static isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }
}

// Booking system
class BookingEngine {
  static getUpcomingEvents(events, userTimezone) {
    const now = new Date();
    return events
      .filter(e => new Date(e.date) > now)
      .map(e => ({
        ...e,
        displayDate: DateUtils.formatDate(e.date),
        isToday: DateUtils.isSameDay(new Date(e.date), now),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}`,
    bugs: [
      { id: "b1", line: 4, type: "logic", description: "addDays assumes 24h days — breaks on DST transition (23h or 25h days)", hint: "Not every day has exactly 24 hours... think about clock changes", found: false, fixed: false },
      { id: "b2", line: 10, type: "logic", description: "Uses local timezone getDate/getMonth instead of UTC equivalents for ISO dates", hint: "getFullYear vs getUTCFullYear — which should you use for ISO strings?", found: false, fixed: false },
      { id: "b3", line: 24, type: "logic", description: "isSameDay compares using local timezone — breaks across timezone boundaries", hint: "Two dates in different timezones can have different local 'days'", found: false, fixed: false },
      { id: "b4", line: 37, type: "off-by-one", description: "getMonth() is already 0-indexed; adding 1 shifts the month name", hint: "The months array is 0-indexed and so is getMonth(). What does +1 do?", found: false, fixed: false },
    ],
    redHerrings: ["parseDate appends 'Z' which is correct for UTC", "isWeekend correctly checks day 0 (Sunday) and 6 (Saturday)", "The sort in getUpcomingEvents is correct"],
    status: "locked",
  },
  {
    id: "case-6",
    title: "The Phantom Transaction",
    story: "A fintech app shows double charges on some accounts. Database logs show single writes but the balance is wrong. The ORM passed all unit tests. This one's tricky...",
    difficulty: "mastermind",
    timeLimit: 720,
    xpReward: 250,
    stackTrace: `[CRITICAL] AccountService: Balance mismatch detected for account_4921
  Expected: $487.50, Actual: $437.50 (double debit of $50.00)
[DEBUG] Transaction log shows 1 debit entry
[DEBUG] Two concurrent requests detected at 2026-03-10T14:22:01.003Z`,
    fileName: "account-service.js",
    language: "javascript",
    codeFile: `class AccountService {
  constructor(db) {
    this.db = db;
  }

  // BUG 1: Read-then-write without transaction isolation
  // Two concurrent requests can read the same balance, then both write
  async debit(accountId, amount) {
    // Step 1: Read current balance
    const account = await this.db.findOne("accounts", { id: accountId });

    if (account.balance < amount) {
      throw new Error("Insufficient funds");
    }

    // Step 2: Calculate new balance
    // BUG: Between read and write, another request may have already debited
    const newBalance = account.balance - amount;

    // Step 3: Write new balance
    await this.db.update("accounts", { id: accountId }, { balance: newBalance });

    // BUG 2: Transaction log written outside the atomic operation
    await this.logTransaction(accountId, -amount, newBalance);

    return { success: true, newBalance };
  }

  // BUG 3: No idempotency key — retry logic can cause duplicate transactions
  async processPayment(paymentId, accountId, amount) {
    // No check for whether this payment was already processed
    const result = await this.debit(accountId, amount);

    await this.db.insert("payments", {
      paymentId,
      accountId,
      amount,
      status: "completed",
      // Missing: created_at timestamp
    });

    return result;
  }

  async logTransaction(accountId, amount, resultingBalance) {
    await this.db.insert("transaction_log", {
      accountId,
      amount,
      resultingBalance,
      timestamp: Date.now(),
    });
  }

  // Red herring: this is fine
  async getBalance(accountId) {
    const account = await this.db.findOne("accounts", { id: accountId });
    return account?.balance ?? 0;
  }

  // Red herring: correctly calculates with floating point awareness
  formatCurrency(amount) {
    return "$" + (Math.round(amount * 100) / 100).toFixed(2);
  }
}`,
    bugs: [
      { id: "b1", line: 8, type: "race-condition", description: "Read-then-write without transaction isolation — concurrent requests cause double debit", hint: "Two requests read the same balance simultaneously, then both subtract...", found: false, fixed: false },
      { id: "b2", line: 25, type: "logic", description: "Transaction log is written outside atomic operation — can succeed even if debit is rolled back", hint: "What happens if the update succeeds but something fails after?", found: false, fixed: false },
      { id: "b3", line: 31, type: "logic", description: "No idempotency check — payment retries cause duplicate debits", hint: "What if the network times out and the client retries the same payment?", found: false, fixed: false },
    ],
    redHerrings: ["getBalance uses optional chaining correctly", "formatCurrency handles floating point with Math.round"],
    status: "locked",
  },
];

const DIFFICULTY_CONFIG: Record<CaseDifficulty, { label: string; icon: typeof Search; color: string; bg: string; border: string }> = {
  rookie: { label: "Rookie", icon: Search, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  detective: { label: "Detective", icon: Eye, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  mastermind: { label: "Mastermind", icon: Skull, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
};

const BUG_TYPE_LABELS: Record<BugType, { label: string; color: string }> = {
  syntax: { label: "Syntax", color: "text-blue-500" },
  logic: { label: "Logic Error", color: "text-amber-500" },
  runtime: { label: "Runtime", color: "text-red-500" },
  "race-condition": { label: "Race Condition", color: "text-purple-500" },
  "memory-leak": { label: "Memory Leak", color: "text-orange-500" },
  "off-by-one": { label: "Off-by-One", color: "text-pink-500" },
  "null-reference": { label: "Null Reference", color: "text-red-500" },
  "type-error": { label: "Type Error", color: "text-cyan-500" },
};

const DebugDetective = () => {
  const [activeCase, setActiveCase] = useState<DebugCase | null>(null);
  const [gameState, setGameState] = useState<"browse" | "investigate" | "solved">("browse");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [showStackTrace, setShowStackTrace] = useState(true);
  const [showRedHerrings, setShowRedHerrings] = useState(false);
  const [currentBugs, setCurrentBugs] = useState<CaseBug[]>([]);
  const [score, setScore] = useState(0);
  const [filterDifficulty, setFilterDifficulty] = useState<CaseDifficulty | "all">("all");
  const [totalXP, setTotalXP] = useState(320);
  const [solvedCases, setSolvedCases] = useState(3);
  const [streak, setStreak] = useState(2);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((t) => {
          if (t <= 1) {
            setTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const startCase = (debugCase: DebugCase) => {
    if (debugCase.status === "locked") return;
    setActiveCase(debugCase);
    setCurrentBugs(debugCase.bugs.map((b) => ({ ...b, found: false, fixed: false })));
    setTimeRemaining(debugCase.timeLimit);
    setTimerActive(true);
    setGameState("investigate");
    setHintsUsed(0);
    setSelectedLine(null);
    setScore(0);
    setShowStackTrace(true);
    setShowRedHerrings(false);
  };

  const handleLineClick = (lineNumber: number) => {
    setSelectedLine(lineNumber);

    // Check if this line has a bug
    const bugOnLine = currentBugs.find((b) => b.line === lineNumber && !b.found);
    if (bugOnLine) {
      setCurrentBugs((prev) =>
        prev.map((b) => b.id === bugOnLine.id ? { ...b, found: true } : b)
      );
      setScore((s) => s + 25);
    }
  };

  const fixBug = (bugId: string) => {
    setCurrentBugs((prev) =>
      prev.map((b) => b.id === bugId ? { ...b, fixed: true } : b)
    );
    setScore((s) => s + 25);

    // Check if all bugs fixed
    const updatedBugs = currentBugs.map((b) => b.id === bugId ? { ...b, fixed: true } : b);
    if (updatedBugs.every((b) => b.fixed)) {
      setTimerActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setGameState("solved");
      setSolvedCases((s) => s + 1);
      setStreak((s) => s + 1);
      setTotalXP((xp) => xp + (activeCase?.xpReward || 0));
    }
  };

  const useHint = (bugId: string) => {
    setHintsUsed((h) => h + 1);
    setScore((s) => Math.max(0, s - 10));
    // Mark as found via hint
    setCurrentBugs((prev) =>
      prev.map((b) => b.id === bugId ? { ...b, found: true } : b)
    );
  };

  const handleTimeUp = () => {
    setGameState("solved");
  };

  const backToBrowse = () => {
    setGameState("browse");
    setActiveCase(null);
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const allBugsFixed = currentBugs.length > 0 && currentBugs.every((b) => b.fixed);
  const bugsFound = currentBugs.filter((b) => b.found).length;
  const bugsFixed = currentBugs.filter((b) => b.fixed).length;
  const timeWarning = timeRemaining > 0 && timeRemaining < 60;

  const filteredCases = DEBUG_CASES.filter((c) =>
    filterDifficulty === "all" || c.difficulty === filterDifficulty
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                <Bug className="w-5 h-5 text-white" />
              </div>
              Debug Detective
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5">
              Investigate broken codebases, hunt bugs under pressure, and sharpen your debugging instincts
            </p>
          </div>
          {gameState !== "browse" && (
            <Button variant="outline" size="sm" onClick={backToBrowse} className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Case Files
            </Button>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ═══════════════ BROWSE CASES ═══════════════ */}
        {gameState === "browse" && (
          <motion.div key="browse" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Cases Solved", value: solvedCases, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { label: "Total XP", value: totalXP, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
                { label: "Streak", value: `${streak} 🔥`, icon: Flame, color: "text-red-500", bg: "bg-red-500/10" },
                { label: "Detective Rank", value: solvedCases >= 5 ? "Senior" : solvedCases >= 3 ? "Junior" : "Rookie", icon: Shield, color: "text-blue-500", bg: "bg-blue-500/10" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <div className={`${stat.bg} rounded-lg p-2 w-fit mx-auto mb-2`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Difficulty:</span>
              {(["all", "rookie", "detective", "mastermind"] as const).map((d) => (
                <Button
                  key={d}
                  variant={filterDifficulty === d ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7 capitalize"
                  onClick={() => setFilterDifficulty(d)}
                >
                  {d === "all" ? "All" : DIFFICULTY_CONFIG[d].label}
                </Button>
              ))}
            </div>

            {/* Case Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCases.map((c, i) => {
                const diff = DIFFICULTY_CONFIG[c.difficulty];
                const isLocked = c.status === "locked";
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={!isLocked ? { y: -3 } : {}}
                    onClick={() => startCase(c)}
                    className={`bg-card border rounded-xl p-5 transition-all cursor-pointer group relative overflow-hidden ${
                      isLocked ? "opacity-50 cursor-not-allowed border-border" : `${diff.border} hover:border-primary/30`
                    }`}
                  >
                    {isLocked && (
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <div className="text-center">
                          <Lock className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                          <p className="text-xs text-muted-foreground">Solve previous cases to unlock</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div className={`${diff.bg} rounded-lg p-2`}>
                        <diff.icon className={`w-4 h-4 ${diff.color}`} />
                      </div>
                      <Badge variant="secondary" className={`text-[9px] py-0 ${diff.bg} ${diff.color} border-0`}>
                        {diff.label}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-foreground mb-1">{c.title}</h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3">{c.story}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5"><Bug className="w-3 h-3" /> {c.bugs.length} bugs</span>
                      <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {Math.floor(c.timeLimit / 60)} min</span>
                      <span className="flex items-center gap-0.5"><Zap className="w-3 h-3" /> +{c.xpReward} XP</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══════════════ INVESTIGATE ═══════════════ */}
        {gameState === "investigate" && activeCase && (
          <motion.div key="investigate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Case Bar */}
            <div className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className={`text-[10px] ${DIFFICULTY_CONFIG[activeCase.difficulty].bg} ${DIFFICULTY_CONFIG[activeCase.difficulty].color} border-0`}>
                  {DIFFICULTY_CONFIG[activeCase.difficulty].label}
                </Badge>
                <span className="text-sm font-bold text-foreground">{activeCase.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Bugs:</span>
                  <span className="font-bold text-foreground">{bugsFound}/{activeCase.bugs.length} found</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-bold text-emerald-500">{bugsFixed}/{activeCase.bugs.length} fixed</span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-sm font-bold ${
                  timeWarning ? "bg-red-500/10 text-red-500 animate-pulse" : "bg-muted text-foreground"
                }`}>
                  <Timer className="w-4 h-4" />
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              {/* Code Panel (2 cols) */}
              <div className="lg:col-span-2 space-y-3">
                {/* Stack Trace */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowStackTrace((s) => !s)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-red-500/5 border-b border-border hover:bg-red-500/10 transition-colors"
                  >
                    <span className="text-xs font-bold text-red-500 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" /> Stack Trace / Error Log
                    </span>
                    {showStackTrace ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  <AnimatePresence>
                    {showStackTrace && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <pre className="p-4 text-xs text-red-400 font-mono bg-[#1e1e2e] overflow-x-auto whitespace-pre-wrap">{activeCase.stackTrace}</pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Code File */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="bg-muted/50 border-b border-border px-4 py-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <FileCode2 className="w-3.5 h-3.5" /> {activeCase.fileName}
                    </span>
                    <Badge variant="outline" className="text-[10px]">{activeCase.language}</Badge>
                  </div>
                  <div className="bg-[#1e1e2e] overflow-x-auto">
                    {activeCase.codeFile.split("\n").map((line, i) => {
                      const lineNum = i + 1;
                      const bugOnLine = currentBugs.find((b) => b.line === lineNum);
                      const isSelected = selectedLine === lineNum;
                      const isBugFound = bugOnLine?.found;

                      return (
                        <div
                          key={i}
                          onClick={() => handleLineClick(lineNum)}
                          className={`flex cursor-pointer hover:bg-white/5 transition-colors ${
                            isSelected ? "bg-primary/10" :
                            isBugFound ? "bg-red-500/10" : ""
                          }`}
                        >
                          <span className={`w-12 shrink-0 text-right pr-3 py-0.5 text-[11px] font-mono select-none border-r border-white/5 ${
                            isBugFound ? "text-red-400 bg-red-500/20" : "text-white/20"
                          }`}>
                            {lineNum}
                          </span>
                          <pre className="px-4 py-0.5 text-[12px] font-mono text-gray-300 whitespace-pre">
                            {line}
                          </pre>
                          {isBugFound && (
                            <span className="ml-auto pr-3 flex items-center">
                              <Bug className="w-3.5 h-3.5 text-red-400" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Investigation Panel */}
              <div className="space-y-3">
                {/* Case Brief */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5">
                    <FileCode2 className="w-4 h-4 text-primary" /> Case Brief
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{activeCase.story}</p>
                </div>

                {/* Bug Tracker */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
                    <Bug className="w-4 h-4 text-red-500" /> Bug Tracker
                  </h4>
                  <div className="space-y-2.5">
                    {currentBugs.map((bug) => {
                      const typeInfo = BUG_TYPE_LABELS[bug.type];
                      return (
                        <div key={bug.id} className={`rounded-lg border p-3 transition-all ${
                          bug.fixed ? "border-emerald-500/20 bg-emerald-500/5" :
                          bug.found ? "border-red-500/20 bg-red-500/5" :
                          "border-border"
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              {bug.fixed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              ) : bug.found ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                              ) : (
                                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                              )}
                              <span className="text-xs font-medium text-foreground">
                                {bug.found ? `Line ${bug.line}` : "??? Unknown"}
                              </span>
                            </div>
                            {bug.found && (
                              <Badge variant="secondary" className={`text-[9px] py-0 ${typeInfo.color}`}>
                                {typeInfo.label}
                              </Badge>
                            )}
                          </div>
                          {bug.found && (
                            <>
                              <p className="text-[10px] text-muted-foreground mb-2">{bug.description}</p>
                              {!bug.fixed && (
                                <Button size="sm" className="text-xs h-6 w-full gap-1" onClick={() => fixBug(bug.id)}>
                                  <CheckCircle2 className="w-3 h-3" /> Mark as Fixed
                                </Button>
                              )}
                            </>
                          )}
                          {!bug.found && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-6 w-full gap-1 text-amber-500 hover:text-amber-400"
                              onClick={() => useHint(bug.id)}
                            >
                              <Lightbulb className="w-3 h-3" /> Use Hint (-10 pts)
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Red Herrings */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <button
                    onClick={() => setShowRedHerrings((s) => !s)}
                    className="flex items-center justify-between w-full"
                  >
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <EyeOff className="w-4 h-4 text-muted-foreground" /> Red Herrings
                    </h4>
                    {showRedHerrings ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  <AnimatePresence>
                    {showRedHerrings && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <ul className="mt-2 space-y-1.5">
                          {activeCase.redHerrings.map((rh, i) => (
                            <li key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                              <XCircle className="w-3 h-3 text-muted-foreground/50 shrink-0 mt-0.5" /> {rh}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Score */}
                <div className="bg-gradient-to-br from-primary/10 to-purple-500/5 border border-primary/15 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Current Score</p>
                  <p className="text-3xl font-bold text-primary">{score}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Hints used: {hintsUsed}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════ SOLVED ═══════════════ */}
        {gameState === "solved" && activeCase && (
          <motion.div key="solved" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  allBugsFixed ? "bg-emerald-500/10" : "bg-amber-500/10"
                }`}
              >
                {allBugsFixed ? (
                  <Trophy className="w-10 h-10 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-amber-500" />
                )}
              </motion.div>

              <h2 className="text-xl font-bold text-foreground mb-1">
                {allBugsFixed ? "Case Closed! 🎉" : timeRemaining <= 0 ? "Time's Up!" : "Investigation Complete"}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">{activeCase.title}</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-lg font-bold text-foreground">{bugsFixed}/{activeCase.bugs.length}</p>
                  <p className="text-[10px] text-muted-foreground">Bugs Fixed</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-lg font-bold text-foreground">{score}</p>
                  <p className="text-[10px] text-muted-foreground">Score</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-lg font-bold text-foreground">{formatTime(activeCase.timeLimit - timeRemaining)}</p>
                  <p className="text-[10px] text-muted-foreground">Time Taken</p>
                </div>
              </div>

              {allBugsFixed && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1">
                    <Zap className="w-3 h-3" /> +{activeCase.xpReward} XP Earned
                  </Badge>
                  {hintsUsed === 0 && (
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1">
                      <Star className="w-3 h-3" /> No Hints — Bonus!
                    </Badge>
                  )}
                </div>
              )}

              {/* Bug Summary */}
              <div className="text-left space-y-2 mt-6">
                <h4 className="text-sm font-bold text-foreground mb-2">Bug Report</h4>
                {currentBugs.map((bug) => {
                  const typeInfo = BUG_TYPE_LABELS[bug.type];
                  return (
                    <div key={bug.id} className={`flex items-start gap-2.5 rounded-lg border p-3 ${
                      bug.fixed ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"
                    }`}>
                      {bug.fixed ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                      <div>
                        <p className="text-xs font-medium text-foreground">Line {bug.line} — <span className={typeInfo.color}>{typeInfo.label}</span></p>
                        <p className="text-[10px] text-muted-foreground">{bug.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={backToBrowse} className="gap-2">
                <ArrowRight className="w-4 h-4 rotate-180" /> More Cases
              </Button>
              <Button onClick={() => startCase(activeCase)} className="gap-2">
                <RotateCcw className="w-4 h-4" /> Retry Case
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DebugDetective;
