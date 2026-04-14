"use client";

import { FormEvent, useState } from "react";
import type { ChangeEvent } from "react";

import { Button, Card, Input } from "@/components/ui";

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
    <Card className="mx-auto mt-10 max-w-xl">
      <div className="h-96 overflow-y-auto rounded-md border border-slate-700 bg-slate-900/60 p-4">
        {messages.map((m) => (
          <div key={m.id} className="mb-2 text-sm text-slate-100">
            <strong className="uppercase text-sky-300">{m.role}:</strong>{" "}
            {m.content}
          </div>
        ))}

        {isLoading && <p className="text-sm text-slate-300">Thinking...</p>}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Input
          value={input}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setInput(event.target.value)
          }
          className="flex-1"
          placeholder="Ask anything..."
        />
        <Button
          type="submit"
          disabled={isLoading}
          variant="primary"
        >
          Send
        </Button>
      </form>
    </Card>
  );
}
