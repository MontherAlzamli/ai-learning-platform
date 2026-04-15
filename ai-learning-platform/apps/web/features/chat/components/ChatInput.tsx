"use client";

import type { FormEvent } from "react";

import { FormControl } from "@openedx/paragon";

import { Button } from "@/components/ui";

type ChatInputProps = {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onStop: () => void;
  isStreaming: boolean;
};

export default function ChatInput({
  input,
  onInputChange,
  onSubmit,
  onStop,
  isStreaming,
}: ChatInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-4 flex items-end gap-2 border-t border-slate-700/70 pt-4"
    >
      <FormControl
        as="textarea"
        rows={2}
        value={input}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
          onInputChange(event.target.value)
        }
        onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (!isStreaming && input.trim()) {
              event.currentTarget.form?.requestSubmit();
            }
          }
        }}
        className="max-h-40 min-h-[52px] flex-1 resize-y rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-400"
        placeholder="Send a message..."
        aria-label="Chat message input"
      />

      {isStreaming ? (
        <Button type="button" variant="secondary" onClick={onStop}>
          Stop
        </Button>
      ) : (
        <Button type="submit" variant="primary" disabled={!input.trim()}>
          Send
        </Button>
      )}
    </form>
  );
}
