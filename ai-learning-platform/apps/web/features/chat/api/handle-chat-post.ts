import { generateAssistantReply } from "@/lib/openai/chat";
import { openAiApiKey } from "@/lib/openai/client";

import type { IncomingChatMessage } from "../types";

function sanitizeMessages(input: unknown): IncomingChatMessage[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter(
      (message): message is IncomingChatMessage =>
        typeof message === "object" &&
        message !== null &&
        "role" in message &&
        "content" in message &&
        typeof message.role === "string" &&
        typeof message.content === "string"
    )
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));
}

export async function handleChatPost(req: Request) {
  try {
    if (!openAiApiKey) {
      return Response.json(
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "OPENAI_API_KEY is missing. Add it to apps/web/.env.local and restart the dev server.",
        },
        { status: 500 }
      );
    }

    const body = (await req.json()) as { messages?: unknown };
    const messages = sanitizeMessages(body.messages);

    if (messages.length === 0) {
      return Response.json(
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Please send a message first.",
        },
        { status: 400 }
      );
    }

    const content = await generateAssistantReply(messages);

    return Response.json({
      id: crypto.randomUUID(),
      role: "assistant",
      content,
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
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "OpenAI quota exceeded (429). Check your OpenAI plan/billing and API key limits, then try again.",
        },
        { status: 429 }
      );
    }

    return Response.json(
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Server error while calling the model. Check the server log for details and try again.",
      },
      { status: 500 }
    );
  }
}
