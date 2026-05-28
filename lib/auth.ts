import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase-server";

export function isConfiguredAdminUserId(userId: string) {
  const adminIds = process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(",").map((id) => id.trim()).filter(Boolean) ?? [];
  return adminIds.includes(userId);
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}

export async function isAdminUser(user: User | null) {
  if (!user) return false;
  if (isConfiguredAdminUserId(user.id)) return true;
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return data?.role === "admin";
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  const isAdmin = await isAdminUser(user);
  return { user, isAdmin };
}
