import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { defaultLocale, isValidLocale } from "./i18n/config";

const publicAuthRoutes = new Set(["/login", "/signup"]);

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const localeSegment = segments[0];

  if (!localeSegment || !isValidLocale(localeSegment)) {
    return NextResponse.next();
  }

  const locale = localeSegment || defaultLocale;
  const routePath = `/${segments.slice(1).join("/")}`;
  const isPublicAuthRoute = publicAuthRoutes.has(routePath);
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token && !isPublicAuthRoute) {
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isPublicAuthRoute) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
