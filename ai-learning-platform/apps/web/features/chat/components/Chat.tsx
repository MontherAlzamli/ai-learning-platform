"use client";

import { useEffect, useMemo, useRef } from "react";

import { Card } from "@/components/ui";
import { cn } from "@/components/ui/cn";

import { useChat } from "../hooks/use-chat";
import ChatInput from "./ChatInput";
import ChatSidebar from "./ChatSidebar";
import MessageBubble from "./MessageBubble";

export default function Chat() {
  const {
    conversations,
    currentConversationId,
    messages,
    input,
    status,
    error,
    historyError,
    isHistoryLoading,
    isConversationLoading,
    setInput,
    handleSubmit,
    handleSelectConversation,
    handleNewChat,
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
    <Card className="mx-auto mt-8 flex h-[78vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-950/70 p-0 shadow-2xl md:flex-row">
      <ChatSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        isLoading={isHistoryLoading}
        onSelectConversation={handleSelectConversation}
        onNewChat={() => void handleNewChat()}
        disabled={isStreaming}
      />

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="border-b border-slate-800 bg-slate-950/90 px-4 py-4 sm:px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
            {currentConversationId ? "Saved Conversation" : "New Conversation"}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">
            {currentConversationId
              ? "Continue your conversation"
              : "Start a fresh chat"}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Chat history is saved automatically and tied to your account.
          </p>
        </div>

        <div
          ref={viewportRef}
          className="relative flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-5 sm:px-6"
        >
          {isConversationLoading ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm">
              <div className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-slate-200 shadow-xl">
                Loading conversation...
              </div>
            </div>
          ) : null}

          {messages.length === 0 ? (
            <div className="mx-auto flex h-full max-w-md items-center text-center text-sm text-slate-300">
              {conversations.length > 0
                ? "Pick a conversation from the sidebar or start a new chat."
                : "Start the conversation. Responses stream in real-time with markdown support."}
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
          {historyError ? (
            <p className="pt-3 text-sm text-rose-300">{historyError}</p>
          ) : null}
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
            disabled={isConversationLoading}
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
      </div>
    </Card>
  );
}
