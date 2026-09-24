import { NextResponse } from "next/server";
import { isValidNewsletterToken } from "@/lib/newsletter";
import { getAbsoluteUrl } from "@/lib/site-url";
import { createAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!isValidNewsletterToken(token)) return redirectWithStatus("invalid");

  const supabase = createAdminClient();
  if (!supabase) return redirectWithStatus("error");

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({ status: "active", confirmed_at: now, updated_at: now })
    .eq("unsubscribe_token", token!)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Newsletter confirmation failed", error);
    return redirectWithStatus("error");
  }
  if (data) return redirectWithStatus("success");

  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("status")
    .eq("unsubscribe_token", token!)
    .maybeSingle();
  return redirectWithStatus(existing?.status === "active" ? "already" : "invalid");
}

function redirectWithStatus(status: string) {
  return NextResponse.redirect(getAbsoluteUrl(`/newsletter/confirmed?status=${status}`), 303);
}
