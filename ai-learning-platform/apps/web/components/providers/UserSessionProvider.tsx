"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

type UserSessionProviderProps = {
  children: ReactNode;
  session: Session | null;
};

export function UserSessionProvider({
  children,
  session,
}: UserSessionProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
