import { createClient } from "@/lib/supabase-server";
import type { Cultivar, CultivarWithFruit, Fruit, FruitWithChildren, Photo } from "@/types/database";

export type AdminCultivar = Cultivar & {
  fruits: Pick<Fruit, "name_ja" | "slug"> | null;
};

export type AdminPhoto = Photo & {
  fruits: Pick<Fruit, "name_ja" | "slug"> | null;
  cultivars: Pick<Cultivar, "name_ja" | "slug"> | null;
};

export async function getPublicFruits(limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("fruits")
    .select("*, photos(*), cultivars(id), videos(*)")
    .eq("is_public", true)
    .order("name_ja", { ascending: true });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }
  return (data as FruitWithChildren[]).map((fruit) => ({
    ...fruit,
    photos: (fruit.photos ?? []).filter((photo) => photo.approval_status === "approved"),
    videos: (fruit.videos ?? []).filter((video) => video.is_public),
    cultivars: (fruit.cultivars ?? []).filter((cultivar) => cultivar.is_public !== false)
  }));
}

export async function getPublicFruitBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fruits")
    .select("*, photos(*), videos(*), cultivars(*)")
    .eq("slug", slug)
    .eq("is_public", true)
    .order("name_ja", { referencedTable: "cultivars", ascending: true })
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }
  const fruit = data as FruitWithChildren | null;
  if (!fruit) return null;

  return {
    ...fruit,
    photos: (fruit.photos ?? []).filter((photo) => photo.approval_status === "approved"),
    videos: (fruit.videos ?? []).filter((video) => video.is_public),
    cultivars: (fruit.cultivars ?? []).filter((cultivar) => cultivar.is_public)
  };
}

export async function getPublicCultivarBySlugs(fruitSlug: string, cultivarSlug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cultivars")
    .select("*, fruits!inner(*), photos(*), videos(*)")
    .eq("slug", cultivarSlug)
    .eq("is_public", true)
    .eq("fruits.slug", fruitSlug)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }
  const cultivar = data as CultivarWithFruit | null;
  if (!cultivar || !cultivar.fruits?.is_public || !cultivar.is_public) return null;

  return {
    ...cultivar,
    photos: (cultivar.photos ?? []).filter((photo) => photo.approval_status === "approved"),
    videos: (cultivar.videos ?? []).filter((video) => video.is_public)
  };
}

export async function getAdminFruits() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("fruits").select("*").order("name_ja", { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return data as Fruit[];
}

export async function getAdminCultivars() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cultivars")
    .select("*, fruits(name_ja, slug)")
    .order("name_ja", { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return data as AdminCultivar[];
}

export async function getAdminPhotos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*, fruits(name_ja, slug), cultivars(name_ja, slug)")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data as AdminPhoto[];
}
