import { NextResponse } from "next/server";
import { isValidNewsletterToken } from "@/lib/newsletter";
import { getAbsoluteUrl } from "@/lib/site-url";
import { createAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const status = await unsubscribe(token);
  return NextResponse.redirect(getAbsoluteUrl(`/newsletter/unsubscribed?status=${status}`), 303);
}

export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  await unsubscribe(token);
  return new NextResponse(null, { status: 200, headers: { "Cache-Control": "private, no-store" } });
}

async function unsubscribe(token: string | null) {
  if (!isValidNewsletterToken(token)) return "invalid";
  const supabase = createAdminClient();
  if (!supabase) return "error";

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({ status: "unsubscribed", updated_at: new Date().toISOString() })
    .eq("unsubscribe_token", token!)
    .neq("status", "unsubscribed")
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Newsletter unsubscribe failed", error);
    return "error";
  }
  if (data) return "success";

  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("status")
    .eq("unsubscribe_token", token!)
    .maybeSingle();
  return existing?.status === "unsubscribed" ? "already" : "invalid";
}
