"use client";

import { useChat as useVercelChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { startTransition, useCallback, useEffect, useState } from "react";

import {
  createConversation,
  fetchConversation,
  fetchConversations,
} from "../api/client";
import { buildConversationTitle } from "../lib/message";
import type { ConversationSummary } from "../types";

function upsertConversation(
  conversations: ConversationSummary[],
  conversation: ConversationSummary
) {
  const nextConversations = conversations.filter(
    (item) => item.id !== conversation.id
  );
  nextConversations.unshift(conversation);
  return nextConversations;
}

export function useChat() {
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(
    null
  );
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isConversationLoading, setIsConversationLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
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

  const refreshConversations = useCallback(async () => {
    const nextConversations = await fetchConversations();

    startTransition(() => {
      setConversations(nextConversations);
    });

    return nextConversations;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadConversations() {
      try {
        setIsHistoryLoading(true);
        setHistoryError(null);
        const nextConversations = await fetchConversations();

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setConversations(nextConversations);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setHistoryError(
          error instanceof Error ? error.message : "Unable to load conversations."
        );
      } finally {
        if (!cancelled) {
          setIsHistoryLoading(false);
        }
      }
    }

    void loadConversations();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelectConversation = useCallback(
    async (conversationId: string) => {
      if (!conversationId || conversationId === currentConversationId) {
        return;
      }

      setHistoryError(null);
      setIsConversationLoading(true);

      try {
        if (chat.status === "submitted" || chat.status === "streaming") {
          await chat.stop();
        }

        const data = await fetchConversation(conversationId);

        startTransition(() => {
          setCurrentConversationId(data.conversation.id);
          setConversations((current) =>
            upsertConversation(current, data.conversation)
          );
          chat.setMessages(data.messages);
        });
      } catch (error) {
        setHistoryError(
          error instanceof Error ? error.message : "Unable to load conversation."
        );
      } finally {
        setIsConversationLoading(false);
      }
    },
    [chat, currentConversationId]
  );

  const handleNewChat = useCallback(async () => {
    setHistoryError(null);

    if (chat.status === "submitted" || chat.status === "streaming") {
      await chat.stop();
    }

    startTransition(() => {
      setCurrentConversationId(null);
      setInput("");
      chat.setMessages([]);
    });
  }, [chat]);

  const handleSubmit = useCallback(
    async (event?: { preventDefault?: () => void }) => {
      event?.preventDefault?.();

      const trimmedInput = input.trim();
      if (!trimmedInput || chat.status === "submitted" || chat.status === "streaming") {
        return;
      }

      setHistoryError(null);

      let conversationId = currentConversationId;

      try {
        if (!conversationId) {
          const createdConversation = await createConversation(
            buildConversationTitle(trimmedInput)
          );

          conversationId = createdConversation.id;
          startTransition(() => {
            setCurrentConversationId(createdConversation.id);
            setConversations((current) =>
              upsertConversation(current, createdConversation)
            );
          });
        }

        setInput("");
        await chat.sendMessage(
          { text: trimmedInput },
          {
            body: {
              conversationId,
            },
          }
        );
        await refreshConversations();
      } catch (error) {
        setInput(trimmedInput);
        setHistoryError(
          error instanceof Error ? error.message : "Unable to send message."
        );
      }
    },
    [chat, currentConversationId, input, refreshConversations]
  );

  return {
    ...chat,
    conversations,
    currentConversationId,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    handleSelectConversation,
    handleNewChat,
    isHistoryLoading,
    isConversationLoading,
    historyError,
    isLoading: chat.status === "submitted" || chat.status === "streaming",
  };
}
