import type { ReactNode } from "react";

import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { UserSessionProvider } from "@/components/providers/UserSessionProvider";
import { getServerAuthSession } from "@/lib/auth";

import { defaultLocale, getCommonMessages, isValidLocale } from "../../i18n/config";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: requestedLocale } = await params;
  const locale = isValidLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const messages = await getCommonMessages(locale);
  const session = await getServerAuthSession();

  setRequestLocale(locale);

  return (
    <UserSessionProvider session={session}>
      <NextIntlClientProvider locale={locale} messages={{ common: messages }}>
        <div dir={locale === "ar" ? "rtl" : "ltr"}>{children}</div>
      </NextIntlClientProvider>
    </UserSessionProvider>
  );
}
