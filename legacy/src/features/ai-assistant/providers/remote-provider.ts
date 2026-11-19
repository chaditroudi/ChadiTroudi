import type { AIProvider } from "./ai-provider";
import type { AIMessage, AIStreamChunk, AIRequestContext, AIToolType } from "../types";
import { supabase } from "@/integrations/supabase/client";

/** Calls the Supabase Edge Function which proxies to the configured provider */
async function callEdgeFunction(
  body: Record<string, unknown>,
  onChunk?: (chunk: AIStreamChunk) => void
): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  const baseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string;

  const res = await fetch(`${baseUrl}/functions/v1/ai-assistant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
      apikey: (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "Unknown error");
    throw new Error(`AI request failed (${res.status}): ${errText}`);
  }

  // Streaming
  if (body.stream && res.body && onChunk) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      const lines = text.split("\n");
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6).trim();
        if (payload === "[DONE]") {
          onChunk({ content: "", done: true });
          continue;
        }
        try {
          const parsed = JSON.parse(payload);
          const delta = parsed.choices?.[0]?.delta?.content || "";
          if (delta) {
            full += delta;
            onChunk({ content: delta, done: false });
          }
        } catch { /* skip malformed chunks */ }
      }
    }
    return full;
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content || json.content || JSON.stringify(json);
}

export class RemoteAIProvider implements AIProvider {
  readonly name: string;
  readonly model: string;

  constructor(name: string, model: string) {
    this.name = name;
    this.model = model;
  }

  async chat(messages: AIMessage[], context?: AIRequestContext): Promise<string> {
    return callEdgeFunction({
      provider: this.name,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      context,
      stream: false,
    });
  }

  async chatStream(
    messages: AIMessage[],
    context?: AIRequestContext,
    onChunk?: (chunk: AIStreamChunk) => void
  ): Promise<string> {
    return callEdgeFunction(
      {
        provider: this.name,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        context,
        stream: true,
      },
      onChunk
    );
  }

  async generateTool(
    type: AIToolType,
    prompt: string,
    context?: AIRequestContext
  ): Promise<string> {
    return callEdgeFunction({
      provider: this.name,
      toolType: type,
      prompt,
      context,
      stream: false,
    });
  }
}

export const openaiProvider = new RemoteAIProvider("openai", "gpt-4o-mini");
export const deepseekProvider = new RemoteAIProvider("deepseek", "deepseek-chat");
