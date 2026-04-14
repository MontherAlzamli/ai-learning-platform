export const locales = ["en", "ar"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export function isValidLocale(locale: string): locale is AppLocale {
  return locales.includes(locale as AppLocale);
}

export async function getCommonMessages(locale: string) {
  const resolvedLocale = isValidLocale(locale) ? locale : defaultLocale;

  switch (resolvedLocale) {
    case "ar":
      return (await import("../app/locales/ar/common.json")).default;
    case "en":
    default:
      return (await import("../app/locales/en/common.json")).default;
  }
}
