"use client";

import { Button } from "@/components/ui";
import { cn } from "@/components/ui/cn";

import type { ConversationSummary } from "../types";

type ChatSidebarProps = {
  conversations: ConversationSummary[];
  currentConversationId: string | null;
  isLoading: boolean;
  onSelectConversation: (conversationId: string) => void;
  onNewChat: () => void;
  disabled?: boolean;
};

function formatConversationDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default function ChatSidebar({
  conversations,
  currentConversationId,
  isLoading,
  onSelectConversation,
  onNewChat,
  disabled = false,
}: ChatSidebarProps) {
  return (
    <aside className="flex h-full w-full max-w-full flex-col border-b border-white/10 bg-slate-950/80 md:max-w-xs md:border-b-0 md:border-r">
      <div className="border-b border-white/10 p-4">
        <Button
          type="button"
          variant="secondary"
          className="w-full rounded-xl px-4 py-3"
          onClick={onNewChat}
          disabled={disabled}
        >
          New Chat
        </Button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {isLoading ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-300">
            Loading conversations...
          </div>
        ) : conversations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-300">
            No saved chats yet. Start a new conversation to build your history.
          </div>
        ) : (
          conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onSelectConversation(conversation.id)}
              disabled={disabled}
              className={cn(
                "w-full rounded-2xl border px-4 py-3 text-left transition-colors",
                currentConversationId === conversation.id
                  ? "border-sky-400/60 bg-sky-500/10 text-white"
                  : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
              )}
            >
              <p className="truncate text-sm font-medium">
                {conversation.title || "Untitled conversation"}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {formatConversationDate(conversation.updatedAt)}
              </p>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
