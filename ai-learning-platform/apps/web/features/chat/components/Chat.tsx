"use client";

import type { ChangeEvent } from "react";

import { Button, Card, Input } from "@/components/ui";

import { useChat } from "../hooks/use-chat";

export default function Chat() {
  const { messages, input, isLoading, setInput, submitMessage } = useChat();

  return (
    <Card className="mx-auto mt-10 max-w-xl">
      <div className="h-96 overflow-y-auto rounded-md border border-slate-700 bg-slate-900/60 p-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-2 text-sm text-slate-100">
            <strong className="uppercase text-sky-300">{message.role}:</strong>{" "}
            {message.content}
          </div>
        ))}

        {isLoading && <p className="text-sm text-slate-300">Thinking...</p>}
      </div>

      <form onSubmit={submitMessage} className="mt-4 flex gap-2">
        <Input
          value={input}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setInput(event.target.value)
          }
          className="flex-1"
          placeholder="Ask anything..."
        />
        <Button type="submit" disabled={isLoading} variant="primary">
          Send
        </Button>
      </form>
    </Card>
  );
}
