"use client";

import type { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/components/ui/cn";

type MessageBubbleProps = {
  message: UIMessage;
  showTypingCursor?: boolean;
};

function getMessageText(message: UIMessage): string {
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter(
        (
          part
        ): part is {
          type: "text";
          text: string;
        } => part.type === "text" && typeof part.text === "string"
      )
      .map((part) => part.text)
      .join("");
  }

  return "";
}

export default function MessageBubble({
  message,
  showTypingCursor = false,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const text = getMessageText(message);

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm",
          isUser
            ? "bg-sky-600 text-white rounded-br-md"
            : "bg-slate-800/90 text-slate-100 border border-slate-700 rounded-bl-md"
        )}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            ul: ({ children }) => (
              <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">
                {children}
              </ol>
            ),
            code: ({ children, className }) => {
              const isBlock = Boolean(className?.includes("language-"));
              return isBlock ? (
                <code className="block overflow-x-auto rounded-lg bg-black/40 p-3 text-xs">
                  {children}
                </code>
              ) : (
                <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">
                  {children}
                </code>
              );
            },
            h1: ({ children }) => (
              <h1 className="mb-2 text-xl font-semibold">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="mb-2 text-lg font-semibold">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-2 text-base font-semibold">{children}</h3>
            ),
          }}
        >
          {text}
        </ReactMarkdown>

        {showTypingCursor ? (
          <span
            className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-slate-200 align-middle"
            aria-hidden
          />
        ) : null}
      </div>
    </div>
  );
}
