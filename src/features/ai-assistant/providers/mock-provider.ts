import type { AIProvider } from "./ai-provider";
import type { AIMessage, AIStreamChunk, AIRequestContext, AIToolType } from "../types";

const MOCK_DELAY = 800;
const TYPING_SPEED = 20; // ms per character for streaming effect

const MOCK_RESPONSES: Record<string, string> = {
  default:
    "Great question! Let me help you with that.\n\nThis is a **demo mode** response — no AI provider is currently connected. When you configure OpenAI or DeepSeek API keys, you'll get real AI-powered answers.\n\nIn the meantime, you can explore all the features of the assistant!",
  quiz: JSON.stringify({
    type: "quiz",
    data: {
      questions: [
        {
          question: "What is the time complexity of binary search?",
          options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
          correctIndex: 1,
          explanation: "Binary search divides the search space in half at each step, giving us logarithmic time complexity.",
        },
        {
          question: "Which data structure uses FIFO ordering?",
          options: ["Stack", "Queue", "Tree", "Graph"],
          correctIndex: 1,
          explanation: "A Queue follows First-In-First-Out (FIFO) — elements are removed in the order they were added.",
        },
        {
          question: "What does CSS stand for?",
          options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"],
          correctIndex: 1,
          explanation: "CSS stands for Cascading Style Sheets, used to style HTML documents.",
        },
      ],
    },
  }),
  flashcards: JSON.stringify({
    type: "flashcards",
    data: {
      cards: [
        { front: "What is a closure in JavaScript?", back: "A closure is a function that retains access to its outer scope variables even after the outer function has returned.", hint: "Think about scope chains" },
        { front: "What is the difference between let and const?", back: "Both are block-scoped. `let` allows reassignment, `const` does not. However, `const` objects/arrays can still be mutated.", hint: "Reassignment vs mutation" },
        { front: "What is the Virtual DOM?", back: "A lightweight JavaScript copy of the real DOM. React uses it to efficiently calculate minimal changes needed to update the UI.", hint: "React optimization" },
        { front: "What is REST?", back: "Representational State Transfer — an architectural style for APIs using HTTP methods (GET, POST, PUT, DELETE) on resources.", hint: "API architecture" },
      ],
    },
  }),
  study_plan: JSON.stringify({
    type: "study_plan",
    data: {
      title: "Your 7-Day JavaScript Mastery Plan",
      plan: [
        { day: "Monday", tasks: ["Review variables & types", "Practice string methods", "Complete 3 coding challenges"], focus: "Fundamentals", duration: "2 hours" },
        { day: "Tuesday", tasks: ["Learn array methods", "Practice map/filter/reduce", "Build a small utility"], focus: "Arrays & Iteration", duration: "2 hours" },
        { day: "Wednesday", tasks: ["Understand closures", "Practice callbacks", "Explore promises"], focus: "Functions & Closures", duration: "2.5 hours" },
        { day: "Thursday", tasks: ["Async/await deep dive", "Error handling", "Fetch API practice"], focus: "Async JavaScript", duration: "2 hours" },
        { day: "Friday", tasks: ["DOM manipulation basics", "Event listeners", "Build interactive widget"], focus: "DOM & Events", duration: "2.5 hours" },
        { day: "Saturday", tasks: ["ES6+ features review", "Destructuring & spread", "Modules & imports"], focus: "Modern JS", duration: "2 hours" },
        { day: "Sunday", tasks: ["Mini project: Todo app", "Code review & refactor", "Plan next week"], focus: "Project Day", duration: "3 hours" },
      ],
    },
  }),
  weakness_analysis: JSON.stringify({
    type: "weakness_analysis",
    data: {
      weaknesses: [
        { topic: "Recursion", level: "high", suggestion: "Start with simple recursive problems like factorial and fibonacci, then move to tree traversals." },
        { topic: "CSS Flexbox", level: "medium", suggestion: "Practice with Flexbox Froggy and build 3 layouts using only flexbox." },
        { topic: "Async/Await", level: "medium", suggestion: "Build a small project that fetches data from an API and handles errors gracefully." },
        { topic: "SQL Joins", level: "low", suggestion: "You're close! Practice LEFT JOIN vs INNER JOIN with real-world examples." },
      ],
    },
  }),
  skill_recommendation: JSON.stringify({
    type: "skill_recommendation",
    data: {
      recommendations: [
        { skill: "TypeScript", reason: "Building on your JavaScript knowledge, TypeScript adds type safety and is essential for modern development.", priority: "high", estimatedTime: "2 weeks" },
        { skill: "React Testing", reason: "You've built several React projects — adding testing skills will make your code production-ready.", priority: "high", estimatedTime: "1 week" },
        { skill: "System Design", reason: "Understanding how systems scale will prepare you for senior roles and technical interviews.", priority: "medium", estimatedTime: "3 weeks" },
        { skill: "Docker Basics", reason: "Containerization is a must-know for deployment. It also helps in consistent development environments.", priority: "low", estimatedTime: "3 days" },
      ],
    },
  }),
  summary: JSON.stringify({
    type: "summary",
    data: {
      summary: "This lesson covers the fundamentals of React hooks, focusing on useState, useEffect, and custom hooks. The key takeaway is that hooks allow functional components to manage state and side effects without class components.",
      keyPoints: [
        "useState provides state management in functional components",
        "useEffect handles side effects like data fetching and subscriptions",
        "Custom hooks extract reusable logic across components",
        "Rules of hooks: only call at top level, only in React functions",
        "useEffect cleanup prevents memory leaks",
      ],
    },
  }),
  exercise_solution: JSON.stringify({
    type: "exercise_solution",
    data: {
      exerciseTitle: "Java OOP — Exam Exercise",
      solutions: [
        {
          question: "1. Create a class `Vehicle` with attributes `brand` (String) and `speed` (int). Add a constructor and a method `accelerate(int amount)` that increases speed.",
          answer: "public class Vehicle {\n    private String brand;\n    private int speed;\n\n    public Vehicle(String brand, int speed) {\n        this.brand = brand;\n        this.speed = speed;\n    }\n\n    public void accelerate(int amount) {\n        this.speed += amount;\n    }\n\n    public int getSpeed() {\n        return speed;\n    }\n}",
          explanation: "We use encapsulation (private fields) with a constructor to initialize the object. The accelerate method simply adds the given amount to the current speed.",
          tips: "Always use private fields and provide getters — this follows the encapsulation principle of OOP.",
        },
        {
          question: "2. Create a subclass `ElectricCar` that extends `Vehicle`, adds a `batteryLevel` (int) field, and overrides `accelerate` to also decrease battery by 5.",
          answer: "public class ElectricCar extends Vehicle {\n    private int batteryLevel;\n\n    public ElectricCar(String brand, int speed, int batteryLevel) {\n        super(brand, speed);\n        this.batteryLevel = batteryLevel;\n    }\n\n    @Override\n    public void accelerate(int amount) {\n        super.accelerate(amount);\n        this.batteryLevel -= 5;\n    }\n\n    public int getBatteryLevel() {\n        return batteryLevel;\n    }\n}",
          explanation: "ElectricCar inherits from Vehicle using `extends`. We call `super(...)` in the constructor and `super.accelerate(amount)` in the overridden method to reuse parent logic before adding battery drain.",
          tips: "Use @Override annotation to let the compiler check you're actually overriding a parent method.",
        },
        {
          question: "3. Write a `main` method that creates an ElectricCar, accelerates it twice, and prints the speed and battery level.",
          answer: "public class Main {\n    public static void main(String[] args) {\n        ElectricCar car = new ElectricCar(\"Tesla\", 0, 100);\n        car.accelerate(30);\n        car.accelerate(20);\n        System.out.println(\"Speed: \" + car.getSpeed());\n        System.out.println(\"Battery: \" + car.getBatteryLevel());\n    }\n}",
          explanation: "After two accelerations of 30 and 20, speed = 50. Each acceleration drains 5 battery, so battery = 100 - 5 - 5 = 90.",
          tips: "Trace through the code step by step to verify: speed starts at 0, battery at 100.",
        },
      ],
      overallNotes: "This exercise tests inheritance, method overriding, and constructor chaining (super). Make sure you understand how super() works in both constructors and methods.",
    },
  }),
};

function getResponse(prompt: string, toolType?: AIToolType): string {
  if (toolType && MOCK_RESPONSES[toolType]) return MOCK_RESPONSES[toolType];

  const lower = prompt.toLowerCase();
  if (lower.includes("quiz")) return MOCK_RESPONSES.quiz;
  if (lower.includes("flashcard")) return MOCK_RESPONSES.flashcards;
  if (lower.includes("study plan") || lower.includes("plan")) return MOCK_RESPONSES.study_plan;
  if (lower.includes("weak") || lower.includes("analysis")) return MOCK_RESPONSES.weakness_analysis;
  if (lower.includes("recommend") || lower.includes("skill")) return MOCK_RESPONSES.skill_recommendation;
  if (lower.includes("summarize") || lower.includes("summary")) return MOCK_RESPONSES.summary;
  if (lower.includes("solve") || lower.includes("exercise") || lower.includes("exam") || lower.includes("solution") || lower.includes("pdf")) return MOCK_RESPONSES.exercise_solution;

  return MOCK_RESPONSES.default;
}

export class MockAIProvider implements AIProvider {
  readonly name = "mock";
  readonly model = "demo-mode";

  async chat(messages: AIMessage[]): Promise<string> {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    const lastMsg = messages.filter(m => m.role === "user").pop();
    return getResponse(lastMsg?.content || "");
  }

  async chatStream(
    messages: AIMessage[],
    _context?: AIRequestContext,
    onChunk?: (chunk: AIStreamChunk) => void
  ): Promise<string> {
    await new Promise(r => setTimeout(r, MOCK_DELAY / 2));
    const lastMsg = messages.filter(m => m.role === "user").pop();
    const response = getResponse(lastMsg?.content || "");

    if (onChunk) {
      for (let i = 0; i < response.length; i++) {
        await new Promise(r => setTimeout(r, TYPING_SPEED));
        onChunk({ content: response[i], done: false });
      }
      onChunk({ content: "", done: true });
    }

    return response;
  }

  async generateTool(type: AIToolType, prompt: string): Promise<string> {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    return getResponse(prompt, type);
  }
}

export const mockAiProvider = new MockAIProvider();
