import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, challenge } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert coding tutor evaluating a student's solution. Analyze the code and respond with a JSON object (no markdown, no code fences) with these fields:
- "passed": boolean - whether the solution is correct
- "score": number 0-100 - quality score
- "feedback": string - encouraging, specific feedback (2-3 sentences)
- "errors": string[] - list of specific errors or issues found (empty if none)
- "suggestions": string[] - improvement suggestions (empty if perfect)
- "correctedCode": string | null - if there are errors, provide corrected code; null if correct

Be encouraging but honest. Point out both strengths and areas for improvement.`;

    const userPrompt = `Challenge: ${challenge.title}
Description: ${challenge.description}
Difficulty: ${challenge.difficulty}
Language: ${challenge.language}
Expected Output: ${challenge.expected_output || "N/A"}

Student's Code:
\`\`\`${challenge.language}
${code}
\`\`\`

Evaluate this solution.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response, handling potential markdown fences
    let evaluation;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      evaluation = JSON.parse(cleaned);
    } catch {
      evaluation = {
        passed: false,
        score: 0,
        feedback: content,
        errors: [],
        suggestions: [],
        correctedCode: null,
      };
    }

    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
