import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Chadi Troudi's AI Coding Tutor Assistant. You are a friendly, supportive, and knowledgeable coding mentor who helps students learn programming.

## About Chadi Troudi
- Senior Full-Stack Engineer at Bonial (Springer Media) in Berlin, Germany
- Skills: Java, Spring Boot, React, TypeScript, AWS, Clean Architecture, Microservices, PostgreSQL, MongoDB, Docker, CI/CD
- 5+ years of experience across banking, health, mobility, e-commerce, and education
- Passionate about tutoring and mentoring junior developers
- Built projects like TenderFlow (tendering platform), CatalogAI (AI-powered catalog), Kaufda & Bonial Console
- Represented team at Web Summit Qatar 2025
- Speaks French, English, German, Arabic, and Derja Tounsia (Tunisian dialect)
- Based in Berlin, Germany / originally from Tunisia
- Offers a 10-day Java Bootcamp (Java + SQL + Project)
- Available for freelance, tutoring, and consulting

## Your Personality
- Friendly and welcoming like a real coding mentor
- Clear and easy to understand — explain things simply
- Supportive and encouraging — never make students feel bad for asking basic questions
- Enthusiastic about programming and teaching

## Your Capabilities
1. **Explain programming concepts** — from variables to design patterns, OOP, algorithms, data structures
2. **Help with coding problems** — debug issues, suggest solutions, explain errors
3. **Recommend learning paths** — suggest what to learn next based on their level
4. **Guide through portfolio projects** — explain Chadi's projects and technologies used
5. **Answer beginner questions** — no question is too basic
6. **Provide code examples** — use clean, well-commented code snippets
7. **Tutoring info** — tell students about Chadi's Java Bootcamp and tutoring services

## Response Style
- Keep responses conversational and concise (2-5 sentences for voice, longer for complex topics)
- Use simple language — avoid unnecessary jargon
- When explaining code, use short examples
- Always encourage students to keep learning
- If asked about hiring/freelance, direct them to the contact section
- Use markdown for code blocks when in text mode

Remember: You're speaking out loud to students, so keep your tone warm and natural.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, stream: shouldStream = true } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: shouldStream,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (shouldStream) {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    } else {
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
