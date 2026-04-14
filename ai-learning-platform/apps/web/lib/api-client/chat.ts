import type { ChatMessage } from "@/features/chat/types";

type ChatApiPayload = {
  messages: ChatMessage[];
};

export async function postChatMessage(
  payload: ChatApiPayload,
  signal?: AbortSignal
): Promise<ChatMessage> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    let message = "Request failed.";
    try {
      const data = (await response.json()) as Partial<ChatMessage> & {
        content?: string;
      };
      if (typeof data?.content === "string" && data.content.trim()) {
        message = data.content.trim();
      }
    } catch {
      // ignore malformed error payloads
    }
    throw new Error(message);
  }

  return (await response.json()) as ChatMessage;
}
