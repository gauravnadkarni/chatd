import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n/routing";

const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: routing.localePrefix, // Include localePrefix if you're using it (e.g., 'always', 'as-needed')
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and _next
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname.includes("favicon.ico") ||
    pathname.includes("trpc") ||
    pathname.includes("_vercel")
  ) {
    return NextResponse.next();
  }

  const middleware = intlMiddleware(request);

  return middleware;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|trpc|_vercel).*)"],
};
