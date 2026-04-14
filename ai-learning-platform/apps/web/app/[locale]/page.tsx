"use client";

import { useTranslations } from "next-intl";

import Chat from "@/features/chat/components/Chat";
import { Card } from "@/components/ui";

export default function LocaleHomePage() {
  const t = useTranslations("common");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-white">
      <Card className="w-full max-w-xl rounded-3xl p-10 text-center shadow-2xl">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-sky-300">
          AI Learning Platform
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          {t("welcome")}
        </h1>
        <div className="p-10">
          <Chat />
        </div>
      </Card>
    </main>
  );
}
