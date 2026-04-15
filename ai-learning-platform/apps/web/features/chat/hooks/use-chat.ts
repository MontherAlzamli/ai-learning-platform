"use client";

import { useChat as useVercelChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useState } from "react";

export function useChat() {
  const [input, setInput] = useState("");
  const chat = useVercelChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleInputChange = useCallback(
    (nextValue: string) => {
      setInput(nextValue);
    },
    [setInput]
  );

  const handleSubmit = useCallback(
    async (event?: { preventDefault?: () => void }) => {
      event?.preventDefault?.();

      const trimmedInput = input.trim();
      if (!trimmedInput || chat.status === "submitted" || chat.status === "streaming") {
        return;
      }

      setInput("");
      await chat.sendMessage({ text: trimmedInput });
    },
    [chat, input]
  );

  return {
    ...chat,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading: chat.status === "submitted" || chat.status === "streaming",
  };
}
