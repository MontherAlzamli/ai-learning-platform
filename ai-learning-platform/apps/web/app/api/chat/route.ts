import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

type IncomingMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(req: Request) {
  try {
    if (!apiKey) {
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

    const { messages } = await req.json();

    const sanitizedMessages = Array.isArray(messages)
      ? messages
          .filter(
            (message): message is IncomingMessage =>
              typeof message?.role === "string" &&
              typeof message?.content === "string"
          )
          .map((message) => ({
            role: message.role,
            content: message.content,
          }))
      : [];

    if (sanitizedMessages.length === 0) {
      return Response.json(
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Please send a message first.",
        },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: sanitizedMessages,
      max_completion_tokens: 300,
    });

    const content = completion.choices?.[0]?.message?.content ?? "No response";

    return Response.json({
      id: crypto.randomUUID(),
      role: "assistant",
      content: content.trim(),
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

    // Log full details server-side for debugging.
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
