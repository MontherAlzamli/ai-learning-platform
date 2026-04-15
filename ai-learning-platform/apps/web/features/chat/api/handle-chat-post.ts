import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  type UIMessage,
  streamText,
} from "ai";

export async function handleChatPost(req: Request) {
  try {
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
    };
    const messages = Array.isArray(body.messages) ? body.messages : [];

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
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
