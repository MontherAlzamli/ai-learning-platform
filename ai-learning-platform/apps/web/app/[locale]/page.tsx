"use client";

import { useTranslations } from "next-intl";

import Chat from "@/features/chat/components/Chat";
import { UserSessionBanner } from "@/features/auth/components/UserSessionBanner";
import { Card } from "@/components/ui";

export default function LocaleHomePage() {
  const t = useTranslations("common");

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <UserSessionBanner />
        <Card className="w-full rounded-[2rem] border border-white/10 bg-slate-900/65 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur xl:p-10">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-sky-300">
            AI Learning Platform
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            {t("welcome")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
            {t("app.description")}
          </p>

          <Chat />
        </Card>
      </div>
    </main>
  );
}
