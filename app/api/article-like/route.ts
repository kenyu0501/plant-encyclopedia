import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

const COOKIE_NAME = "tropical_media_visitor";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { articleId?: string } | null;
  if (!body?.articleId || !/^[0-9a-f-]{36}$/i.test(body.articleId)) return NextResponse.json({ error: "invalid request" }, { status: 400 });
  const cookieStore = await cookies();
  const existingVisitor = cookieStore.get(COOKIE_NAME)?.value;
  const visitorId = existingVisitor && /^[0-9a-f-]{36}$/i.test(existingVisitor) ? existingVisitor : randomUUID();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("toggle_article_like", { p_article_id: body.articleId, p_visitor_id: visitorId });
  if (error) return NextResponse.json({ error: "like failed" }, { status: 400 });
  const result = Array.isArray(data) ? data[0] : data;
  const response = NextResponse.json({ liked: Boolean(result?.liked), likes: Number(result?.likes ?? 0) });
  if (!existingVisitor) response.cookies.set(COOKIE_NAME, visitorId, { httpOnly: true, sameSite: "lax", secure: true, maxAge: 60 * 60 * 24 * 365, path: "/" });
  return response;
}
