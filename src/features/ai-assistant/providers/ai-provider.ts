import type { AIMessage, AIStreamChunk, AIRequestContext, AIToolType } from "../types";

export interface AIProvider {
  readonly name: string;
  readonly model: string;
  chat(messages: AIMessage[], context?: AIRequestContext): Promise<string>;
  chatStream(
    messages: AIMessage[],
    context?: AIRequestContext,
    onChunk?: (chunk: AIStreamChunk) => void
  ): Promise<string>;
  generateTool(
    type: AIToolType,
    prompt: string,
    context?: AIRequestContext
  ): Promise<string>;
}
