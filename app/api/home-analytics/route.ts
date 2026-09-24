import { NextResponse } from "next/server";
import { getSiteAnalytics } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const analytics = await getSiteAnalytics();
  return NextResponse.json(
    { analytics },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } }
  );
}
