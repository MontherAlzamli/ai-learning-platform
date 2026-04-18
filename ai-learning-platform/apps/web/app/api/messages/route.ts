import { requireUser } from "@/lib/auth";
import {
  CHAT_MESSAGE_ROLES,
  type ChatMessageRole,
  saveConversationMessage,
} from "@/lib/db/chat";

export async function POST(req: Request) {
  const user = await requireUser();

  if (!user) {
    return Response.json(
      { error: "You need to be signed in to save messages." },
      { status: 401 }
    );
  }

  const body = (await req.json().catch(() => null)) as
    | {
        conversationId?: string;
        role?: string;
        content?: string;
      }
    | null;

  const conversationId = body?.conversationId?.trim();
  const content = body?.content?.trim();

  if (!conversationId || !content || !body?.role) {
    return Response.json(
      { error: "conversationId, role, and content are required." },
      { status: 400 }
    );
  }

  if (!CHAT_MESSAGE_ROLES.includes(body.role as (typeof CHAT_MESSAGE_ROLES)[number])) {
    return Response.json(
      { error: "role must be either user or assistant." },
      { status: 400 }
    );
  }

  const role = body.role as ChatMessageRole;

  try {
    const message = await saveConversationMessage({
      userId: user.id,
      conversationId,
      role,
      content,
    });

    return Response.json({ message }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Conversation not found.") {
      return Response.json({ error: error.message }, { status: 404 });
    }

    console.error("Message save failed:", error);

    return Response.json(
      { error: "Unable to save message." },
      { status: 500 }
    );
  }
}
