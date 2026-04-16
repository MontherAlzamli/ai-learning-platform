import { getServerSession } from "next-auth";

import { authOptions } from "./config";

export async function getServerAuthSession() {
  return getServerSession(authOptions);
}

export async function requireUser() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return null;
  }

  return session.user;
}

export { authOptions };
