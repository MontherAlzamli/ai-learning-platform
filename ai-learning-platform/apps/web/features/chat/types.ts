import type { UIMessage } from "ai";

export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type IncomingChatMessage = {
  role: ChatRole;
  content: string;
};

export type ConversationSummary = {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ConversationDetail = {
  conversation: ConversationSummary;
  messages: UIMessage[];
};
