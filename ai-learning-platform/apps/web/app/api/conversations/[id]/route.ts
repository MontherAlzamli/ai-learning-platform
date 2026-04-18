import { getConversationForUser, toUiMessages } from "@/lib/db/chat";
import { requireUser } from "@/lib/auth";

export async function GET(
  _req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const user = await requireUser();

  if (!user) {
    return Response.json(
      { error: "You need to be signed in to view this conversation." },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const conversation = await getConversationForUser({
    userId: user.id,
    conversationId: id,
  });

  if (!conversation) {
    return Response.json({ error: "Conversation not found." }, { status: 404 });
  }

  return Response.json({
    conversation: {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    },
    messages: toUiMessages(conversation.messages),
  });
}
