import { openai } from "@ai-sdk/openai";
import {
  consumeStream,
  convertToModelMessages,
  type UIMessage,
  streamText,
} from "ai";

import {
  buildConversationTitle,
  extractTextFromUiMessage,
} from "@/features/chat/lib/message";
import { getServerAuthSession } from "@/lib/auth";
import {
  type ChatMessageRole,
  createMessageForConversation,
  ensureConversationForUser,
} from "@/lib/db/chat";

export async function handleChatPost(req: Request) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user) {
      return Response.json(
        {
          error: "You need to be signed in to use the chat.",
        },
        { status: 401 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {
          error:
            "OPENAI_API_KEY is missing. Add it to apps/web/.env.local and restart the dev server.",
        },
        { status: 500 }
      );
    }

    const body = (await req.json()) as {
      messages?: UIMessage[];
      conversationId?: string;
    };
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const conversationId =
      typeof body.conversationId === "string" ? body.conversationId.trim() : "";
    const latestMessage = messages.at(-1);

    if (!latestMessage || latestMessage.role !== "user") {
      return Response.json(
        {
          error: "A user message is required to start the chat stream.",
        },
        { status: 400 }
      );
    }

    const latestUserMessage = extractTextFromUiMessage(latestMessage);

    if (!latestUserMessage) {
      return Response.json(
        {
          error: "The latest user message is empty.",
        },
        { status: 400 }
      );
    }

    let conversation;

    try {
      conversation = await ensureConversationForUser({
        userId: session.user.id,
        conversationId,
        title: buildConversationTitle(latestUserMessage),
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Conversation not found.") {
        return Response.json({ error: error.message }, { status: 404 });
      }

      throw error;
    }

    await createMessageForConversation({
      conversationId: conversation.id,
      role: "user" satisfies ChatMessageRole,
      content: latestUserMessage,
    });

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      consumeSseStream: consumeStream,
      async onFinish({ responseMessage }) {
        const assistantMessage = extractTextFromUiMessage(responseMessage);

        if (!assistantMessage) {
          return;
        }

        await createMessageForConversation({
          conversationId: conversation.id,
          role: "assistant",
          content: assistantMessage,
        });
      },
    });
  } catch (error) {
    const status =
      typeof error === "object" && error && "status" in error
        ? Number((error as { status?: unknown }).status)
        : undefined;
    const code =
      typeof error === "object" && error && "code" in error
        ? String((error as { code?: unknown }).code)
        : undefined;

    console.error("Chat route failed:", error);

    if (status === 429 || code === "insufficient_quota") {
      return Response.json(
        {
          error:
            "OpenAI quota exceeded (429). Check your OpenAI plan/billing and API key limits, then try again.",
        },
        { status: 429 }
      );
    }

    return Response.json(
      {
        error: "Server error while calling the model. Check server logs.",
      },
      { status: 500 }
    );
  }
}
