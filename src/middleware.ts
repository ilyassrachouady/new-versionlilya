import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, locales } from "@/lib/i18n/config";
import { copyCookies, updateSupabaseSession } from "@/lib/supabase/middleware";

const PUBLIC_FILE = /\.[^/]+$/;

/** Picks the best supported locale from Accept-Language, defaulting to English. */
function detectLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;

  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), quality: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of preferred) {
    const base = tag.split("-")[0];
    if ((locales as readonly string[]).includes(base)) return base;
  }
  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAuth = pathname.startsWith("/auth/");
  const isAdminLogin = pathname === "/admin/login";

  if (isAdmin || isAuth) {
    const { response, user } = await updateSupabaseSession(request);

    if (isAdmin && !isAdminLogin && !user) {
      const login = request.nextUrl.clone();
      login.pathname = "/admin/login";
      login.search = "";
      if (pathname !== "/admin") login.searchParams.set("next", pathname);
      return copyCookies(response, NextResponse.redirect(login));
    }

    return response;
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
