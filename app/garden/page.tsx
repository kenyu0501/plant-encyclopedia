import type { Metadata } from "next";
import { CultivationJournal } from "@/components/cultivation-journal";
import { PageHeader } from "@/components/page-header";
import { getPublicFruitOptions } from "@/lib/queries";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "栽培記録",
  description: "育てている熱帯果樹の植付け、開花、施肥、剪定、収穫、写真を記録できます。"
};

export default async function GardenPage() {
  const supabase = await createClient();
  const [{ data: userResult }, fruits] = await Promise.all([
    supabase.auth.getUser(),
    getPublicFruitOptions()
  ]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="栽培記録"
        description="所有株ごとに、植付け・開花・施肥・剪定・収穫・写真を時系列で残せます。記録は非公開です。"
      />
      <CultivationJournal fruits={fruits} initialUser={userResult.user ?? null} />
    </div>
  );
}
