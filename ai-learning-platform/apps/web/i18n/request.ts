import { getRequestConfig } from "next-intl/server";

import { defaultLocale, getCommonMessages, isValidLocale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale =
    requestedLocale && isValidLocale(requestedLocale)
      ? requestedLocale
      : defaultLocale;

  return {
    locale,
    messages: {
      common: await getCommonMessages(locale),
    },
  };
});
