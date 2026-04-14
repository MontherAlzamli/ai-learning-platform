import { handleChatPost } from "@/features/chat/api/handle-chat-post";

export async function POST(req: Request) {
  return handleChatPost(req);
}
