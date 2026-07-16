export const RECENT_CULTIVARS_STORAGE_KEY = "kenyu-recent-cultivars";
export const RECENT_CULTIVARS_EVENT = "kenyu-recent-cultivars-updated";

export type RecentCultivar = {
  id: string;
  fruitName: string;
  cultivarName: string;
  href: string;
  viewedAt: number;
};

export function readRecentCultivars(): RecentCultivar[] {
  try {
    const value = window.localStorage.getItem(RECENT_CULTIVARS_STORAGE_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecentCultivar).slice(0, 8);
  } catch {
    return [];
  }
}

export function saveRecentCultivar(item: Omit<RecentCultivar, "viewedAt">) {
  try {
    const items = readRecentCultivars().filter((current) => current.id !== item.id);
    const updated = [{ ...item, viewedAt: Date.now() }, ...items].slice(0, 8);
    window.localStorage.setItem(RECENT_CULTIVARS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(RECENT_CULTIVARS_EVENT));
  } catch {
    // localStorageが利用できない環境では履歴を保存しません。
  }
}

function isRecentCultivar(value: unknown): value is RecentCultivar {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<RecentCultivar>;
  return (
    typeof item.id === "string" &&
    typeof item.fruitName === "string" &&
    typeof item.cultivarName === "string" &&
    typeof item.href === "string" &&
    item.href.startsWith("/fruits/") &&
    typeof item.viewedAt === "number"
  );
}
