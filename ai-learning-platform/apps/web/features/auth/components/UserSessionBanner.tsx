"use client";

import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui";

import { useCurrentUser } from "../hooks/use-current-user";

export function UserSessionBanner() {
  const locale = useLocale();
  const t = useTranslations("common");
  const { user } = useCurrentUser();

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
          {t("app.sessionLabel")}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">
          {t("app.greeting", { name: user?.name || user?.email || "Learner" })}
        </h2>
        <p className="mt-1 text-sm text-slate-300">{user?.email}</p>
      </div>

      <Button
        type="button"
        variant="secondary"
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"
        onClick={() =>
          signOut({
            callbackUrl: `/${locale}/login`,
          })
        }
      >
        {t("auth.actions.logout")}
      </Button>
    </div>
  );
}
