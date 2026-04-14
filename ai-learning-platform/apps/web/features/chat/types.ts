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
