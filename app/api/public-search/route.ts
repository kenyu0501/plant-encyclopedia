import { NextResponse } from "next/server";
import { getPublicSearchEntries } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const entries = await getPublicSearchEntries();
  return NextResponse.json(
    { entries },
    { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } }
  );
}
