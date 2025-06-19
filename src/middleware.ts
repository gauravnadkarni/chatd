// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n/routing";
import { createClientForServer } from "./lib/supabase-server";
import { cookies } from "next/headers";
import { Locale } from "./lib/i18n/config";

const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: routing.localePrefix,
});

const publicRoutes = ["/", "/auth/callback"];

export async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);

  const pathname = request.nextUrl.pathname;
  const parts = pathname.split("/").filter(Boolean);

  let currentLocale: string | undefined;
  let pathnameWithoutLocale: string;

  if (parts.length > 0 && routing.locales.includes(parts[0] as Locale)) {
    currentLocale = parts[0];
    pathnameWithoutLocale = `/${parts.slice(1).join("/")}`;
  } else {
    currentLocale = routing.defaultLocale;
    pathnameWithoutLocale = pathname;
  }

  if (
    pathnameWithoutLocale.startsWith("/api") ||
    pathnameWithoutLocale.startsWith("/_next") ||
    pathnameWithoutLocale.startsWith("/static") ||
    pathnameWithoutLocale.includes(".") ||
    pathnameWithoutLocale.includes("favicon.ico") ||
    pathnameWithoutLocale.includes("trpc") ||
    pathnameWithoutLocale.includes("_vercel")
  ) {
    return intlResponse;
  }

  console.log("middleware-----");
  console.log("Detected Locale:", currentLocale);
  console.log("Pathname without Locale:", pathnameWithoutLocale);

  const isPublicRoute = (route: string) =>
    publicRoutes.some((r) => r === route || r.startsWith(route));

  const supabase = await createClientForServer();

  const { data } = await supabase.auth.getUser();

  // --- Authentication and Redirection Logic ---
  if (data.user) {
    // User has a session
    if (isPublicRoute(pathnameWithoutLocale)) {
      return NextResponse.redirect(
        new URL(`/${currentLocale}/chats`, request.url)
      );
    }
  } else {
    if (!isPublicRoute(pathnameWithoutLocale)) {
      console.log("Not a public route", pathname);
      return NextResponse.redirect(new URL(`/${currentLocale}`, request.url));
    }
  }
  console.log("reached end");
  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|trpc|_vercel|.*\\..*).*)",
  ],
};
