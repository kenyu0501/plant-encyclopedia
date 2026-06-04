import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let path: unknown;

  try {
    ({ path } = (await request.json()) as { path?: unknown });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof path !== "string" || !path.startsWith("/") || path.length > 500) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("track_page_view", { p_path: path });

  if (error) {
    console.error("Failed to track page view", error);
    return NextResponse.json({ error: "Failed to track page view" }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
