import { requireUser } from "@/lib/auth";
import { buildConversationTitle } from "@/features/chat/lib/message";
import {
  createConversationForUser,
  listConversationsForUser,
} from "@/lib/db/chat";

export async function GET() {
  const user = await requireUser();

  if (!user) {
    return Response.json(
      { error: "You need to be signed in to view conversations." },
      { status: 401 }
    );
  }

  const conversations = await listConversationsForUser(user.id);

  return Response.json({ conversations });
}

export async function POST(req: Request) {
  const user = await requireUser();

  if (!user) {
    return Response.json(
      { error: "You need to be signed in to create a conversation." },
      { status: 401 }
    );
  }

  const body = (await req.json().catch(() => null)) as
    | {
        title?: string;
      }
    | null;

  const conversation = await createConversationForUser({
    userId: user.id,
    title: body?.title ? buildConversationTitle(body.title) : undefined,
  });

  return Response.json({ conversation }, { status: 201 });
}
