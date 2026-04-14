import type { ReactNode } from "react";

import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

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

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={{ common: messages }}>
      <div dir={locale === "ar" ? "rtl" : "ltr"}>{children}</div>
    </NextIntlClientProvider>
  );
}
