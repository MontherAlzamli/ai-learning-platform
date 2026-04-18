import type { ConversationDetail, ConversationSummary } from "../types";

async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => null)) as
    | (T & {
        error?: string;
      })
    | null;

  if (!response.ok) {
    throw new Error(data?.error || "Request failed.");
  }

  if (!data) {
    throw new Error("Empty response.");
  }

  return data;
}

export async function fetchConversations() {
  const response = await fetch("/api/conversations", {
    method: "GET",
    credentials: "same-origin",
  });
  const data = await parseJson<{ conversations: ConversationSummary[] }>(response);

  return data.conversations;
}

export async function createConversation(title?: string) {
  const response = await fetch("/api/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ title }),
  });
  const data = await parseJson<{ conversation: ConversationSummary }>(response);

  return data.conversation;
}

export async function fetchConversation(conversationId: string) {
  const response = await fetch(`/api/conversations/${conversationId}`, {
    method: "GET",
    credentials: "same-origin",
  });
  return parseJson<ConversationDetail>(response);
}
