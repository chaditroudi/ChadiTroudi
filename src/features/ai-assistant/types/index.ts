// ─── Provider Types ───
export type AIProviderType = "openai" | "deepseek" | "mock";

export interface AIProviderStatus {
  provider: AIProviderType;
  available: boolean;
  label: string;
  model: string;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  toolResult?: AIToolResult;
}

export interface AIStreamChunk {
  content: string;
  done: boolean;
}

export interface AIRequestContext {
  level?: number;
  xp?: number;
  experience?: string;
  weakTopics?: string[];
  strongTopics?: string[];
  goal?: string;
  currentPage?: string;
  skillContext?: string;
}

// ─── Tool Result Types ───
export type AIToolType =
  | "quiz"
  | "flashcards"
  | "study_plan"
  | "weakness_analysis"
  | "skill_recommendation"
  | "summary"
  | "explanation"
  | "thread_summary"
  | "post_improvement"
  | "answer_suggestion"
  | "exercise_solution";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
  hint?: string;
}

export interface StudyPlanDay {
  day: string;
  tasks: string[];
  focus: string;
  duration: string;
}

export interface WeaknessItem {
  topic: string;
  level: "low" | "medium" | "high";
  suggestion: string;
}

export interface SkillRecommendation {
  skill: string;
  reason: string;
  priority: "high" | "medium" | "low";
  estimatedTime: string;
}

export interface ExerciseSolution {
  exerciseTitle: string;
  solutions: {
    question: string;
    answer: string;
    explanation: string;
    tips?: string;
  }[];
  overallNotes?: string;
}

export interface AIToolResult {
  type: AIToolType;
  data:
    | { questions: QuizQuestion[] }
    | { cards: Flashcard[] }
    | { plan: StudyPlanDay[]; title: string }
    | { weaknesses: WeaknessItem[] }
    | { recommendations: SkillRecommendation[] }
    | { summary: string; keyPoints: string[] }
    | { improved: string; changes: string[] }
    | { suggestions: string[] }
    | ExerciseSolution;
}

// ─── Avatar Types ───
export type AvatarState = "idle" | "listening" | "thinking" | "speaking";

export interface AvatarConfig {
  voiceEnabled: boolean;
  voiceSpeed: number;
  voiceId?: string;
  autoSpeak: boolean;
}

// ─── Chat Session ───
export interface ChatSession {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: number;
  context?: AIRequestContext;
}
