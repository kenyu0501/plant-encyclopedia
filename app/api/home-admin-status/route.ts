import { NextResponse } from "next/server";
import { getCurrentUser, isAdminUser } from "@/lib/auth";
import { getPendingViewerPhotoCount } from "@/lib/queries";

export async function GET() {
  const user = await getCurrentUser();
  const isAdmin = await isAdminUser(user);
  const pendingViewerPhotoCount = isAdmin ? await getPendingViewerPhotoCount() : 0;

  return NextResponse.json(
    { pendingViewerPhotoCount },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
