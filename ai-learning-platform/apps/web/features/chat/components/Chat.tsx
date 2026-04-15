"use client";

import { useEffect, useMemo, useRef } from "react";

import { Card } from "@/components/ui";
import { cn } from "@/components/ui/cn";

import { useChat } from "../hooks/use-chat";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

export default function Chat() {
  const {
    messages,
    input,
    status,
    error,
    setInput,
    handleSubmit,
    stop,
  } = useChat();

  const isStreaming = status === "streaming" || status === "submitted";
  const lastAssistantMessageId = useMemo(() => {
    const assistantMessages = messages.filter(
      (message) => message.role === "assistant"
    );
    return assistantMessages.at(-1)?.id;
  }, [messages]);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  return (
    <Card className="mx-auto mt-8 flex h-[75vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/70 p-0 shadow-2xl">
      <div
        ref={viewportRef}
        className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-5 sm:px-6"
      >
        {messages.length === 0 ? (
          <div className="mx-auto flex h-full max-w-md items-center text-center text-sm text-slate-300">
            Start the conversation. Responses stream in real-time with markdown
            support.
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              showTypingCursor={
                isStreaming &&
                message.role === "assistant" &&
                message.id === lastAssistantMessageId
              }
            />
          ))
        )}

        {status === "submitted" ? (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-700 bg-slate-800/90 px-3 py-2">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300" />
            </div>
          </div>
        ) : null}

        <div ref={endRef} />
      </div>

      <div className="border-t border-slate-700 bg-slate-950 px-4 pb-4 sm:px-6">
        {error ? (
          <p className="pt-3 text-sm text-rose-300">
            {error.message || "Something went wrong while generating a reply."}
          </p>
        ) : null}
        <ChatInput
          input={input}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          onStop={stop}
          isStreaming={isStreaming}
        />
        <p
          className={cn(
            "mt-2 text-xs text-slate-400",
            isStreaming ? "opacity-100" : "opacity-70"
          )}
        >
          Enter to send, Shift+Enter for newline.
        </p>
      </div>
    </Card>
  );
}
