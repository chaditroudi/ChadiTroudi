// Mock data for the "Sharpen Your Skills" module
// Replace with Supabase queries when backend is ready

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  skillCount: number;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  estimatedHours: number;
  progress: number; // 0-100
  completed: boolean;
  bookmarked: boolean;
  xpReward: number;
  tags: string[];
  resources: SkillResource[];
  milestones: SkillMilestone[];
  progressHistory: { date: string; progress: number }[];
}

export interface SkillResource {
  id: string;
  title: string;
  type: "article" | "video" | "exercise" | "project";
  url: string;
  duration: string;
}

export interface SkillMilestone {
  id: string;
  title: string;
  reached: boolean;
  xp: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly";
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  completed: boolean;
  expiresAt: string;
  skillId: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  level: number;
  avatar: string;
  isCurrentUser?: boolean;
}

export interface ActivityEntry {
  id: string;
  action: string;
  skillTitle: string;
  xpEarned: number;
  timestamp: string;
}

export interface WeeklyStats {
  day: string;
  xp: number;
  minutes: number;
}

// ─── Categories ───
export const skillCategories: SkillCategory[] = [
  { id: "frontend", name: "Frontend Development", icon: "🎨", color: "blue", skillCount: 8 },
  { id: "backend", name: "Backend Development", icon: "⚙️", color: "emerald", skillCount: 7 },
  { id: "algorithms", name: "Algorithms & DSA", icon: "🧠", color: "purple", skillCount: 6 },
  { id: "databases", name: "Databases", icon: "🗄️", color: "orange", skillCount: 5 },
  { id: "devops", name: "DevOps & Cloud", icon: "☁️", color: "cyan", skillCount: 4 },
  { id: "ai-ml", name: "AI & Machine Learning", icon: "🤖", color: "pink", skillCount: 5 },
];

// ─── Skills ───
export const skills: Skill[] = [
  {
    id: "html-css",
    title: "HTML & CSS Mastery",
    description: "Master semantic HTML5 and modern CSS techniques including Flexbox, Grid, animations, and responsive design patterns.",
    categoryId: "frontend",
    difficulty: "beginner",
    estimatedHours: 20,
    progress: 85,
    completed: false,
    bookmarked: true,
    xpReward: 500,
    tags: ["HTML", "CSS", "Responsive", "Flexbox", "Grid"],
    resources: [
      { id: "r1", title: "CSS Grid Complete Guide", type: "article", url: "#", duration: "30 min" },
      { id: "r2", title: "Building Responsive Layouts", type: "video", url: "#", duration: "45 min" },
      { id: "r3", title: "CSS Animation Challenge", type: "exercise", url: "#", duration: "1 hr" },
    ],
    milestones: [
      { id: "m1", title: "First Webpage", reached: true, xp: 50 },
      { id: "m2", title: "Responsive Layout", reached: true, xp: 100 },
      { id: "m3", title: "CSS Animations", reached: true, xp: 100 },
      { id: "m4", title: "Full Project", reached: false, xp: 250 },
    ],
    progressHistory: [
      { date: "Mar 1", progress: 40 }, { date: "Mar 3", progress: 55 },
      { date: "Mar 5", progress: 65 }, { date: "Mar 7", progress: 75 },
      { date: "Mar 9", progress: 82 }, { date: "Mar 11", progress: 85 },
    ],
  },
  {
    id: "javascript",
    title: "JavaScript Fundamentals",
    description: "Deep dive into JavaScript: closures, prototypes, async/await, ES6+ features, and the event loop.",
    categoryId: "frontend",
    difficulty: "beginner",
    estimatedHours: 30,
    progress: 72,
    completed: false,
    bookmarked: false,
    xpReward: 700,
    tags: ["JavaScript", "ES6", "Async", "DOM"],
    resources: [
      { id: "r4", title: "JavaScript: The Good Parts", type: "article", url: "#", duration: "45 min" },
      { id: "r5", title: "Async JavaScript Deep Dive", type: "video", url: "#", duration: "1 hr" },
      { id: "r6", title: "Build a Todo App", type: "project", url: "#", duration: "3 hrs" },
    ],
    milestones: [
      { id: "m5", title: "Variables & Types", reached: true, xp: 50 },
      { id: "m6", title: "Functions & Closures", reached: true, xp: 100 },
      { id: "m7", title: "Async/Await", reached: true, xp: 150 },
      { id: "m8", title: "DOM Manipulation", reached: false, xp: 200 },
    ],
    progressHistory: [
      { date: "Mar 1", progress: 30 }, { date: "Mar 3", progress: 42 },
      { date: "Mar 5", progress: 55 }, { date: "Mar 7", progress: 62 },
      { date: "Mar 9", progress: 68 }, { date: "Mar 11", progress: 72 },
    ],
  },
  {
    id: "react",
    title: "React & Modern UI",
    description: "Build production-ready UIs with React hooks, context, state management, and performance patterns.",
    categoryId: "frontend",
    difficulty: "intermediate",
    estimatedHours: 40,
    progress: 45,
    completed: false,
    bookmarked: true,
    xpReward: 1000,
    tags: ["React", "Hooks", "State", "Components"],
    resources: [
      { id: "r7", title: "React Hooks Explained", type: "video", url: "#", duration: "50 min" },
      { id: "r8", title: "State Management Patterns", type: "article", url: "#", duration: "30 min" },
      { id: "r9", title: "Build a Dashboard", type: "project", url: "#", duration: "5 hrs" },
    ],
    milestones: [
      { id: "m9", title: "Components & Props", reached: true, xp: 100 },
      { id: "m10", title: "Hooks Mastery", reached: true, xp: 200 },
      { id: "m11", title: "Advanced Patterns", reached: false, xp: 300 },
      { id: "m12", title: "Full App", reached: false, xp: 400 },
    ],
    progressHistory: [
      { date: "Mar 1", progress: 15 }, { date: "Mar 3", progress: 22 },
      { date: "Mar 5", progress: 30 }, { date: "Mar 7", progress: 35 },
      { date: "Mar 9", progress: 40 }, { date: "Mar 11", progress: 45 },
    ],
  },
  {
    id: "typescript",
    title: "TypeScript Proficiency",
    description: "Learn TypeScript from basics to advanced generics, utility types, and enterprise patterns.",
    categoryId: "frontend",
    difficulty: "intermediate",
    estimatedHours: 25,
    progress: 30,
    completed: false,
    bookmarked: false,
    xpReward: 800,
    tags: ["TypeScript", "Types", "Generics"],
    resources: [
      { id: "r10", title: "TypeScript Handbook", type: "article", url: "#", duration: "1 hr" },
      { id: "r11", title: "Advanced Generics", type: "video", url: "#", duration: "40 min" },
    ],
    milestones: [
      { id: "m13", title: "Basic Types", reached: true, xp: 100 },
      { id: "m14", title: "Interfaces", reached: false, xp: 200 },
      { id: "m15", title: "Generics", reached: false, xp: 250 },
    ],
    progressHistory: [
      { date: "Mar 1", progress: 10 }, { date: "Mar 5", progress: 18 },
      { date: "Mar 9", progress: 25 }, { date: "Mar 11", progress: 30 },
    ],
  },
  {
    id: "nodejs",
    title: "Node.js & Express",
    description: "Build scalable server-side applications with Node.js, Express, middleware, and REST APIs.",
    categoryId: "backend",
    difficulty: "intermediate",
    estimatedHours: 35,
    progress: 60,
    completed: false,
    bookmarked: true,
    xpReward: 900,
    tags: ["Node.js", "Express", "REST", "API"],
    resources: [
      { id: "r12", title: "RESTful API Design", type: "article", url: "#", duration: "25 min" },
      { id: "r13", title: "Express Middleware Deep Dive", type: "video", url: "#", duration: "35 min" },
      { id: "r14", title: "Build an API", type: "project", url: "#", duration: "4 hrs" },
    ],
    milestones: [
      { id: "m16", title: "Server Setup", reached: true, xp: 100 },
      { id: "m17", title: "REST Endpoints", reached: true, xp: 200 },
      { id: "m18", title: "Auth & Security", reached: false, xp: 300 },
    ],
    progressHistory: [
      { date: "Mar 1", progress: 35 }, { date: "Mar 5", progress: 48 },
      { date: "Mar 9", progress: 55 }, { date: "Mar 11", progress: 60 },
    ],
  },
  {
    id: "python",
    title: "Python for Backend",
    description: "Master Python for web development with Flask/Django, data processing, and scripting.",
    categoryId: "backend",
    difficulty: "beginner",
    estimatedHours: 28,
    progress: 100,
    completed: true,
    bookmarked: false,
    xpReward: 600,
    tags: ["Python", "Flask", "Django"],
    resources: [
      { id: "r15", title: "Python Best Practices", type: "article", url: "#", duration: "20 min" },
    ],
    milestones: [
      { id: "m19", title: "Python Basics", reached: true, xp: 100 },
      { id: "m20", title: "Web Framework", reached: true, xp: 200 },
      { id: "m21", title: "Full API", reached: true, xp: 300 },
    ],
    progressHistory: [
      { date: "Feb 15", progress: 50 }, { date: "Feb 20", progress: 70 },
      { date: "Feb 25", progress: 85 }, { date: "Mar 1", progress: 100 },
    ],
  },
  {
    id: "sql",
    title: "SQL & Database Design",
    description: "Learn relational databases, SQL queries, normalization, indexing, and query optimization.",
    categoryId: "databases",
    difficulty: "beginner",
    estimatedHours: 20,
    progress: 50,
    completed: false,
    bookmarked: false,
    xpReward: 500,
    tags: ["SQL", "PostgreSQL", "Database"],
    resources: [
      { id: "r16", title: "SQL Queries Masterclass", type: "video", url: "#", duration: "1 hr" },
    ],
    milestones: [
      { id: "m22", title: "Basic Queries", reached: true, xp: 100 },
      { id: "m23", title: "Joins & Subqueries", reached: true, xp: 150 },
      { id: "m24", title: "Optimization", reached: false, xp: 250 },
    ],
    progressHistory: [
      { date: "Mar 1", progress: 25 }, { date: "Mar 5", progress: 38 },
      { date: "Mar 9", progress: 45 }, { date: "Mar 11", progress: 50 },
    ],
  },
  {
    id: "sorting-algorithms",
    title: "Sorting & Searching",
    description: "Understand sorting algorithms, binary search, and their time/space complexity analysis.",
    categoryId: "algorithms",
    difficulty: "intermediate",
    estimatedHours: 15,
    progress: 20,
    completed: false,
    bookmarked: false,
    xpReward: 600,
    tags: ["Algorithms", "Sorting", "Big-O"],
    resources: [
      { id: "r17", title: "Visualizing Sorting Algorithms", type: "video", url: "#", duration: "30 min" },
    ],
    milestones: [
      { id: "m25", title: "Bubble & Selection", reached: true, xp: 100 },
      { id: "m26", title: "Merge & Quick Sort", reached: false, xp: 200 },
      { id: "m27", title: "Advanced Searching", reached: false, xp: 300 },
    ],
    progressHistory: [
      { date: "Mar 5", progress: 10 }, { date: "Mar 9", progress: 15 },
      { date: "Mar 11", progress: 20 },
    ],
  },
  {
    id: "docker",
    title: "Docker & Containers",
    description: "Learn containerization with Docker: images, volumes, networks, and Docker Compose.",
    categoryId: "devops",
    difficulty: "advanced",
    estimatedHours: 22,
    progress: 0,
    completed: false,
    bookmarked: false,
    xpReward: 800,
    tags: ["Docker", "Containers", "DevOps"],
    resources: [
      { id: "r18", title: "Docker from Zero to Hero", type: "video", url: "#", duration: "2 hrs" },
    ],
    milestones: [
      { id: "m28", title: "First Container", reached: false, xp: 150 },
      { id: "m29", title: "Docker Compose", reached: false, xp: 300 },
    ],
    progressHistory: [],
  },
  {
    id: "ml-basics",
    title: "Machine Learning Basics",
    description: "Introduction to ML concepts: regression, classification, neural networks, and model evaluation.",
    categoryId: "ai-ml",
    difficulty: "advanced",
    estimatedHours: 45,
    progress: 10,
    completed: false,
    bookmarked: true,
    xpReward: 1200,
    tags: ["ML", "AI", "Neural Networks", "Python"],
    resources: [
      { id: "r19", title: "ML Crash Course", type: "video", url: "#", duration: "3 hrs" },
      { id: "r20", title: "Train Your First Model", type: "project", url: "#", duration: "5 hrs" },
    ],
    milestones: [
      { id: "m30", title: "ML Concepts", reached: true, xp: 200 },
      { id: "m31", title: "First Model", reached: false, xp: 400 },
      { id: "m32", title: "Neural Networks", reached: false, xp: 600 },
    ],
    progressHistory: [
      { date: "Mar 9", progress: 5 }, { date: "Mar 11", progress: 10 },
    ],
  },
];

// ─── Challenges ───
export const challenges: Challenge[] = [
  { id: "c1", title: "CSS Flexbox Puzzle", description: "Solve 3 layout challenges using only Flexbox", type: "daily", difficulty: "easy", xpReward: 50, completed: false, expiresAt: "2026-03-11T23:59:59", skillId: "html-css" },
  { id: "c2", title: "Debug the API", description: "Find and fix 3 bugs in a REST API endpoint", type: "daily", difficulty: "medium", xpReward: 75, completed: true, expiresAt: "2026-03-11T23:59:59", skillId: "nodejs" },
  { id: "c3", title: "Algorithm Sprint", description: "Implement quicksort and benchmark it against mergesort", type: "daily", difficulty: "hard", xpReward: 100, completed: false, expiresAt: "2026-03-11T23:59:59", skillId: "sorting-algorithms" },
  { id: "c4", title: "Build a Mini Dashboard", description: "Create a responsive stats dashboard with charts using React", type: "weekly", difficulty: "medium", xpReward: 250, completed: false, expiresAt: "2026-03-17T23:59:59", skillId: "react" },
  { id: "c5", title: "Full-Stack CRUD App", description: "Build a complete CRUD app with auth, API, and database", type: "weekly", difficulty: "hard", xpReward: 400, completed: false, expiresAt: "2026-03-17T23:59:59", skillId: "nodejs" },
  { id: "c6", title: "Type Challenge", description: "Solve 5 advanced TypeScript type puzzles", type: "daily", difficulty: "hard", xpReward: 100, completed: false, expiresAt: "2026-03-11T23:59:59", skillId: "typescript" },
];

// ─── Achievements / Badges ───
export const sharpenAchievements: Achievement[] = [
  { id: "a1", title: "First Step", description: "Start your first skill", icon: "🚀", earned: true, earnedAt: "2026-03-01", rarity: "common" },
  { id: "a2", title: "Streak Master", description: "Maintain a 7-day learning streak", icon: "🔥", earned: true, earnedAt: "2026-03-08", rarity: "rare" },
  { id: "a3", title: "Skill Collector", description: "Start 5 different skills", icon: "📚", earned: true, earnedAt: "2026-03-05", rarity: "common" },
  { id: "a4", title: "Perfectionist", description: "Complete a skill to 100%", icon: "💎", earned: true, earnedAt: "2026-03-01", rarity: "rare" },
  { id: "a5", title: "Challenge Champion", description: "Complete 10 daily challenges", icon: "⚔️", earned: false, rarity: "epic" },
  { id: "a6", title: "Speed Demon", description: "Complete a challenge in under 5 minutes", icon: "⚡", earned: false, rarity: "rare" },
  { id: "a7", title: "Full Stack Hero", description: "Complete skills from 3 different categories", icon: "🏆", earned: false, rarity: "epic" },
  { id: "a8", title: "AI Whisperer", description: "Complete all AI & ML skills", icon: "🤖", earned: false, rarity: "legendary" },
  { id: "a9", title: "Bug Hunter", description: "Complete 5 debugging challenges", icon: "🐛", earned: false, rarity: "common" },
  { id: "a10", title: "Grandmaster", description: "Earn 10,000 skill XP total", icon: "👑", earned: false, rarity: "legendary" },
];

// ─── Leaderboard ───
export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "AlgoQueen", xp: 12450, level: 7, avatar: "🥇" },
  { rank: 2, name: "CodeNinja42", xp: 11200, level: 6, avatar: "🥈" },
  { rank: 3, name: "DevSensei", xp: 10800, level: 6, avatar: "🥉" },
  { rank: 4, name: "ReactRocket", xp: 9500, level: 5, avatar: "🚀" },
  { rank: 5, name: "You", xp: 8700, level: 5, avatar: "⭐", isCurrentUser: true },
  { rank: 6, name: "PyWizard", xp: 8200, level: 5, avatar: "🐍" },
  { rank: 7, name: "SQLMaster", xp: 7600, level: 4, avatar: "🗄️" },
  { rank: 8, name: "CloudSurfer", xp: 6900, level: 4, avatar: "☁️" },
];

// ─── Recent Activity ───
export const recentActivity: ActivityEntry[] = [
  { id: "act1", action: "Completed milestone", skillTitle: "HTML & CSS Mastery", xpEarned: 100, timestamp: "2 hours ago" },
  { id: "act2", action: "Daily challenge done", skillTitle: "Node.js & Express", xpEarned: 75, timestamp: "5 hours ago" },
  { id: "act3", action: "Started learning", skillTitle: "Machine Learning Basics", xpEarned: 25, timestamp: "1 day ago" },
  { id: "act4", action: "Bookmarked skill", skillTitle: "React & Modern UI", xpEarned: 0, timestamp: "1 day ago" },
  { id: "act5", action: "Completed skill", skillTitle: "Python for Backend", xpEarned: 300, timestamp: "2 days ago" },
  { id: "act6", action: "Weekly challenge done", skillTitle: "JavaScript Fundamentals", xpEarned: 250, timestamp: "3 days ago" },
];

// ─── Weekly Stats for Chart ───
export const weeklyStats: WeeklyStats[] = [
  { day: "Mon", xp: 150, minutes: 45 },
  { day: "Tue", xp: 220, minutes: 60 },
  { day: "Wed", xp: 80, minutes: 20 },
  { day: "Thu", xp: 310, minutes: 90 },
  { day: "Fri", xp: 180, minutes: 55 },
  { day: "Sat", xp: 400, minutes: 120 },
  { day: "Sun", xp: 260, minutes: 75 },
];

// ─── AI Recommendations ───
export const aiRecommendations = [
  {
    skillId: "react",
    reason: "You're making great progress in JavaScript — React will build on that foundation perfectly.",
    priority: "high" as const,
  },
  {
    skillId: "typescript",
    reason: "Adding TypeScript to your React skills will make you more job-ready.",
    priority: "medium" as const,
  },
  {
    skillId: "sorting-algorithms",
    reason: "Strengthen your problem-solving skills — interviews often test algorithms.",
    priority: "high" as const,
  },
  {
    skillId: "docker",
    reason: "DevOps knowledge is a great complement to your backend skills.",
    priority: "low" as const,
  },
];

// ─── Helper functions ───
export const getDifficultyColor = (d: string) => {
  const map: Record<string, string> = {
    beginner: "text-green-500 bg-green-500/10 border-green-500/20",
    intermediate: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    advanced: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    expert: "text-red-500 bg-red-500/10 border-red-500/20",
    easy: "text-green-500 bg-green-500/10 border-green-500/20",
    medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    hard: "text-red-500 bg-red-500/10 border-red-500/20",
  };
  return map[d] || "text-muted-foreground bg-muted";
};

export const getRarityColor = (r: string) => {
  const map: Record<string, string> = {
    common: "from-zinc-400 to-zinc-500",
    rare: "from-blue-400 to-blue-600",
    epic: "from-purple-400 to-purple-600",
    legendary: "from-yellow-400 to-orange-500",
  };
  return map[r] || "from-zinc-400 to-zinc-500";
};

export const getCategoryColor = (color: string) => {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/20" },
    cyan: { bg: "bg-cyan-500/10", text: "text-cyan-500", border: "border-cyan-500/20" },
    pink: { bg: "bg-pink-500/10", text: "text-pink-500", border: "border-pink-500/20" },
  };
  return map[color] || { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" };
};
