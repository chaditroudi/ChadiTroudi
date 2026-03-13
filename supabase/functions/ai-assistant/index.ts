import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Provider configs loaded from env
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY") || "";

const PROVIDER_CONFIGS: Record<
  string,
  { url: string; key: string; model: string }
> = {
  openai: {
    url: "https://api.openai.com/v1/chat/completions",
    key: OPENAI_API_KEY,
    model: "gpt-4o-mini",
  },
  deepseek: {
    url: "https://api.deepseek.com/chat/completions",
    key: DEEPSEEK_API_KEY,
    model: "deepseek-chat",
  },
};

const SYSTEM_PROMPT = `You are CodeCamp AI Assistant — a premium, intelligent coding mentor and study coach.

## Identity
- Personal coding coach, study planner, and learning advisor
- Patient, encouraging, adaptive, deeply knowledgeable
- Uses the Socratic method when appropriate
- Educational yet fun tone — like a smart friend who tutors

## Capabilities
You can help students with:
- Answering coding questions with clear explanations
- Explaining lessons and concepts simply
- Generating quizzes (return as structured JSON when asked)
- Creating flashcards (return as structured JSON when asked)
- Building personalized study plans
- Analyzing weak areas and recommending improvements
- Summarizing notes, lessons, or discussion threads
- Helping improve questions and answers for peer help
- Recommending skills to learn next

## Tool Output Format
When the user requests a specific tool (quiz, flashcards, study plan, weakness analysis, skill recommendation, summary), return ONLY valid JSON in this format:
{ "type": "<tool_type>", "data": { ... } }

Tool schemas:
- quiz: { "questions": [{ "question": "", "options": ["","","",""], "correctIndex": 0, "explanation": "" }] }
- flashcards: { "cards": [{ "front": "", "back": "", "hint": "" }] }
- study_plan: { "title": "", "plan": [{ "day": "", "tasks": [""], "focus": "", "duration": "" }] }
- weakness_analysis: { "weaknesses": [{ "topic": "", "level": "low|medium|high", "suggestion": "" }] }
- skill_recommendation: { "recommendations": [{ "skill": "", "reason": "", "priority": "high|medium|low", "estimatedTime": "" }] }
- summary: { "summary": "", "keyPoints": [""] }
- post_improvement: { "improved": "", "changes": [""] }
- answer_suggestion: { "suggestions": [""] }
- thread_summary: { "summary": "", "keyPoints": [""] }
- exercise_solution: { "exerciseTitle": "", "solutions": [{ "question": "", "answer": "", "explanation": "", "tips": "" }], "overallNotes": "" }

When solving exercises/exams:
- Read ALL questions carefully from the provided text
- Provide COMPLETE, correct solutions with working code
- Explain each step clearly so the student learns
- Add practical tips where relevant
- Include overall notes about the topic being tested

For regular chat, respond naturally in markdown.

## Behavior Rules
- Be concise but thorough
- Use code examples when relevant
- Never give harmful or misleading advice
- Encourage students and celebrate progress
- Adapt complexity to the student's level
- If context includes student level/XP, tailor difficulty accordingly`;

function buildMessages(
  messages: Array<{ role: string; content: string }>,
  context?: Record<string, unknown>,
  toolType?: string,
  toolPrompt?: string
) {
  const systemParts = [SYSTEM_PROMPT];

  if (context) {
    const ctx: string[] = [];
    if (context.level) ctx.push(`Student Level: ${context.level}`);
    if (context.xp) ctx.push(`Total XP: ${context.xp}`);
    if (context.experience) ctx.push(`Experience: ${context.experience}`);
    if (context.weakTopics)
      ctx.push(`Weak Topics: ${(context.weakTopics as string[]).join(", ")}`);
    if (context.strongTopics)
      ctx.push(`Strong Topics: ${(context.strongTopics as string[]).join(", ")}`);
    if (context.goal) ctx.push(`Current Goal: ${context.goal}`);
    if (context.currentPage) ctx.push(`Page Context: ${context.currentPage}`);
    if (context.skillContext) ctx.push(`Skill Context: ${context.skillContext}`);
    if (ctx.length) systemParts.push("\n## Student Context\n" + ctx.join("\n"));
  }

  const builtMessages = [
    { role: "system", content: systemParts.join("\n") },
  ];

  if (toolType && toolPrompt) {
    builtMessages.push({
      role: "user",
      content: `Generate a ${toolType} for the following: ${toolPrompt}\n\nReturn ONLY valid JSON in the tool output format specified in your instructions.`,
    });
  } else {
    builtMessages.push(...messages);
  }

  return builtMessages;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      provider: requestedProvider,
      messages,
      context,
      stream,
      toolType,
      prompt,
    } = await req.json();

    // Pick provider — if requested provider not available, try others, then fail gracefully
    let providerKey = requestedProvider || "openai";
    let config = PROVIDER_CONFIGS[providerKey];

    if (!config?.key) {
      // Fallback chain: openai → deepseek
      for (const fallback of ["openai", "deepseek"]) {
        if (PROVIDER_CONFIGS[fallback]?.key) {
          providerKey = fallback;
          config = PROVIDER_CONFIGS[fallback];
          break;
        }
      }
    }

    if (!config?.key) {
      return new Response(
        JSON.stringify({
          error: "no_provider",
          message:
            "No AI provider configured. Set OPENAI_API_KEY or DEEPSEEK_API_KEY environment variables.",
          providers: {
            openai: !!OPENAI_API_KEY,
            deepseek: !!DEEPSEEK_API_KEY,
          },
        }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const builtMessages = buildMessages(messages || [], context, toolType, prompt);

    const body: Record<string, unknown> = {
      model: config.model,
      messages: builtMessages,
      temperature: toolType ? 0.3 : 0.7,
      max_tokens: toolType ? 2000 : 1500,
    };

    if (stream) body.stream = true;

    const apiRes = await fetch(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.key}`,
      },
      body: JSON.stringify(body),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text().catch(() => "");
      return new Response(
        JSON.stringify({
          error: "provider_error",
          status: apiRes.status,
          message: errText,
          provider: providerKey,
        }),
        {
          status: apiRes.status === 429 ? 429 : 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Stream passthrough
    if (stream && apiRes.body) {
      return new Response(apiRes.body, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "X-AI-Provider": providerKey,
        },
      });
    }

    const data = await apiRes.json();
    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "X-AI-Provider": providerKey,
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "internal", message: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
