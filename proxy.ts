import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase-middleware";

export async function proxy(request: NextRequest) {
  const publicCachedPaths = new Set(["/", "/api/home-analytics", "/api/public-search"]);
  if (publicCachedPaths.has(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|ads.txt|robots.txt|sitemap.xml|icons/).*)"]
};
