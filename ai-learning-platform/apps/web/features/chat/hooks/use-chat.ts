"use client";

import { useState } from "react";

import { postChatMessage } from "@/lib/api-client/chat";

import type { ChatMessage } from "../types";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedInput,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    try {
      const assistantMessage = await postChatMessage(
        { messages: nextMessages },
        controller.signal
      );
      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "The request timed out or failed. Check the server log and try again.";
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }

  return {
    messages,
    input,
    isLoading,
    setInput,
    submitMessage,
  };
}
