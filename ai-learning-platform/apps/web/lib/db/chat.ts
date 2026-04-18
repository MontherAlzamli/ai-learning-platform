import type { UIMessage } from "ai";
import type { Conversation, Message } from "@prisma/client";

import { prisma } from "./prisma";

export const CHAT_MESSAGE_ROLES = ["user", "assistant"] as const;

export type ChatMessageRole = (typeof CHAT_MESSAGE_ROLES)[number];

export type ConversationSummary = Pick<
  Conversation,
  "id" | "title" | "createdAt" | "updatedAt"
>;

export type ConversationWithMessages = Conversation & {
  messages: Message[];
};

export async function createConversationForUser(params: {
  userId: string;
  title?: string | null;
}) {
  const title = params.title?.trim() || null;

  return prisma.conversation.create({
    data: {
      userId: params.userId,
      title,
    },
  });
}

export async function listConversationsForUser(userId: string) {
  return prisma.conversation.findMany({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getConversationForUser(params: {
  userId: string;
  conversationId: string;
}) {
  return prisma.conversation.findFirst({
    where: {
      id: params.conversationId,
      userId: params.userId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

export async function ensureConversationForUser(params: {
  userId: string;
  conversationId?: string | null;
  title?: string | null;
}) {
  if (!params.conversationId) {
    return createConversationForUser({
      userId: params.userId,
      title: params.title,
    });
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: params.conversationId,
      userId: params.userId,
    },
  });

  if (!conversation) {
    throw new Error("Conversation not found.");
  }

  if (!conversation.title && params.title?.trim()) {
    return prisma.conversation.update({
      where: {
        id: conversation.id,
      },
      data: {
        title: params.title.trim(),
      },
    });
  }

  return conversation;
}

export async function createMessageForConversation(params: {
  conversationId: string;
  role: ChatMessageRole;
  content: string;
}) {
  const [, message] = await prisma.$transaction([
    prisma.conversation.update({
      where: {
        id: params.conversationId,
      },
      data: {
        updatedAt: new Date(),
      },
    }),
    prisma.message.create({
      data: {
        conversationId: params.conversationId,
        role: params.role,
        content: params.content,
      },
    }),
  ]);

  return message;
}

export async function saveConversationMessage(params: {
  userId: string;
  conversationId: string;
  role: ChatMessageRole;
  content: string;
}) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: params.conversationId,
      userId: params.userId,
    },
    select: {
      id: true,
    },
  });

  if (!conversation) {
    throw new Error("Conversation not found.");
  }

  return createMessageForConversation({
    conversationId: params.conversationId,
    role: params.role,
    content: params.content,
  });
}

export function toUiMessages(messages: Message[]): UIMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role as UIMessage["role"],
    parts: [
      {
        type: "text",
        text: message.content,
      },
    ],
  }));
}
