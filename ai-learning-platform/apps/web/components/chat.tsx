"use client";

import { FormEvent, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: nextMessages }),
        signal: controller.signal,
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
          // ignore JSON parse errors
        }

        throw new Error(message);
      }

      const assistantMessage = (await response.json()) as ChatMessage;

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "The request timed out or failed. Check the server log and try again.";
      setMessages((currentMessages) => [
        ...currentMessages,
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

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="border p-4 h-96 overflow-y-auto rounded">
        {messages.map((m) => (
          <div key={m.id} className="mb-2">
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}

        {isLoading && <p>Thinking...</p>}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Ask anything..."
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-black text-white px-4 rounded disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </div>
  );
}
