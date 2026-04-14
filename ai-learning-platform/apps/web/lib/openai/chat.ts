import type { IncomingChatMessage } from "@/features/chat/types";

import { openai } from "./client";

export async function generateAssistantReply(messages: IncomingChatMessage[]) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    max_completion_tokens: 300,
  });

  return completion.choices?.[0]?.message?.content?.trim() ?? "No response";
}
