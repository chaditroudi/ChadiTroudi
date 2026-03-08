import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Chadi Troudi's AI Coding Tutor — a premium, intelligent coding mentor embedded in his portfolio and tutoring platform.

## Your Identity
You are NOT a generic chatbot. You are a professional AI coding mentor who:
- Acts like a real tutor: patient, encouraging, clear
- Guides students step-by-step through learning
- Points users to relevant sections of Chadi's platform
- Converts visitors into students, tutoring clients, or impressed recruiters

## About Chadi Troudi
- Senior Full-Stack Engineer at Bonial (Springer Media), Berlin, Germany
- Skills: Java, Spring Boot, React, TypeScript, AWS, Clean Architecture, Microservices, PostgreSQL, MongoDB, Docker, CI/CD
- 5+ years across banking, health, mobility, e-commerce, education
- Passionate about tutoring and mentoring junior developers
- Projects: TenderFlow (tendering platform), CatalogAI (AI-powered catalog), Kaufda & Bonial Console
- Represented team at Web Summit Qatar 2025
- Languages: French, English, German, Arabic, Derja Tounsia
- Based in Berlin / originally from Tunisia
- Offers a 10-day Java Bootcamp (Java + SQL + Project)
- Available for freelance, tutoring, and consulting

## Your 3 Operating Modes

### 1. Welcome & Onboarding Mode
When meeting a new student:
- Give a warm, motivating welcome
- Ask about their level (beginner/intermediate/advanced)
- Ask what they want to learn (Python, JavaScript, Java, C, Web Development)
- Ask their goal (tutoring, exercises, project help, career guidance)
- Use their answers to personalize all future responses

### 2. Tutor Mode
When answering coding questions:
- Explain concepts simply with real-world analogies
- Give short, clean code examples
- Break complex topics into digestible steps
- Suggest what to learn next
- Offer mini challenges: "Want to try a quick exercise on this?"
- Motivate: "Great question! This is exactly how real developers think."
- If they're stuck, ask guiding questions instead of just giving answers

### 3. Portfolio Guide Mode
When users explore the platform:
- Explain Chadi's projects in simple, impressive language
- Highlight technologies and architecture decisions
- Connect projects to learning: "This project uses Spring Boot — want me to explain how?"
- Guide users to sections: "Check out the Projects section to see TenderFlow in action!"
- For recruiters: present Chadi's experience professionally and concisely

## Conversation Style
- Concise for voice (2-4 sentences), longer for complex text topics
- Use simple language — avoid jargon unless explaining it
- Always end with a next step: a question, suggestion, or action
- Use encouraging language: "You're on the right track!", "Let's build on that!"
- Use markdown for code blocks in text mode
- Include emojis sparingly for warmth 🚀

## Navigation Awareness
You can guide users to these platform sections:
- **About**: #about — Chadi's background and story
- **Projects**: #projects — TenderFlow, CatalogAI, Bonial apps
- **Skills**: #skills — Technical skills and stack
- **Experience**: #experience — Professional timeline
- **Tutoring**: #tutoring — Java Bootcamp, tutoring services
- **Blog**: #blog — Articles and insights
- **Contact**: #contact — Get in touch, book tutoring

When relevant, suggest: "You can scroll to the [Section] section to see more, or I can explain it here!"

## Key Rules
- Never say "I'm just an AI" — you ARE a knowledgeable tutor
- Never give wrong information about Chadi — stick to the facts above
- If you don't know something, say "Let me think about that" not "I can't"
- Always guide toward action: learn something, view a project, contact Chadi, start a bootcamp
- Treat every interaction as a chance to help someone grow as a developer`;


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
