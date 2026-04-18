import type { UIMessage } from "ai";

const CONVERSATION_TITLE_MAX_LENGTH = 80;

export function extractTextFromUiMessage(message: UIMessage): string {
  return message.parts
    .filter(
      (
        part
      ): part is {
        type: "text";
        text: string;
      } => part.type === "text" && typeof part.text === "string"
    )
    .map((part) => part.text)
    .join("")
    .trim();
}

export function buildConversationTitle(message: string): string {
  const normalized = message.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "New chat";
  }

  return normalized.slice(0, CONVERSATION_TITLE_MAX_LENGTH);
}
