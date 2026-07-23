export const CULTIVAR_FAVORITES_STORAGE_KEY = "kenyu-cultivar-favorites";
export const CULTIVAR_FAVORITES_EVENT = "kenyu-cultivar-favorites-updated";

export type FavoriteStatus = "growing" | "want" | "interested";

export type FavoriteCultivar = {
  id: string;
  fruitName: string;
  cultivarName: string;
  href: string;
  status: FavoriteStatus;
  savedAt: number;
};

export const favoriteStatusOptions: {
  value: FavoriteStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "growing",
    label: "育てている",
    description: "現在栽培している品種"
  },
  {
    value: "want",
    label: "育てたい",
    description: "これから育てたい品種"
  },
  {
    value: "interested",
    label: "気になる",
    description: "あとで見返したい品種"
  }
];

export function readFavoriteCultivars(): FavoriteCultivar[] {
  try {
    const value = window.localStorage.getItem(CULTIVAR_FAVORITES_STORAGE_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isFavoriteCultivar).sort((a, b) => b.savedAt - a.savedAt);
  } catch {
    return [];
  }
}

export function saveFavoriteCultivar(
  item: Omit<FavoriteCultivar, "savedAt" | "status">,
  status: FavoriteStatus
) {
  try {
    const items = readFavoriteCultivars().filter((current) => current.id !== item.id);
    const updated = [{ ...item, status, savedAt: Date.now() }, ...items];
    window.localStorage.setItem(CULTIVAR_FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    dispatchFavoritesUpdated();
  } catch {
    // localStorageが利用できない環境では保存しません。
  }
}

export function removeFavoriteCultivar(id: string) {
  try {
    const updated = readFavoriteCultivars().filter((item) => item.id !== id);
    window.localStorage.setItem(CULTIVAR_FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    dispatchFavoritesUpdated();
  } catch {
    // localStorageが利用できない環境では何もしません。
  }
}

export function getFavoriteStatus(id: string) {
  return readFavoriteCultivars().find((item) => item.id === id)?.status ?? null;
}

export function getFavoriteStatusLabel(status: FavoriteStatus) {
  return favoriteStatusOptions.find((option) => option.value === status)?.label ?? status;
}

function dispatchFavoritesUpdated() {
  window.dispatchEvent(new Event(CULTIVAR_FAVORITES_EVENT));
}

function isFavoriteCultivar(value: unknown): value is FavoriteCultivar {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<FavoriteCultivar>;
  return (
    typeof item.id === "string" &&
    typeof item.fruitName === "string" &&
    typeof item.cultivarName === "string" &&
    typeof item.href === "string" &&
    item.href.startsWith("/fruits/") &&
    isFavoriteStatus(item.status) &&
    typeof item.savedAt === "number"
  );
}

function isFavoriteStatus(value: unknown): value is FavoriteStatus {
  return value === "growing" || value === "want" || value === "interested";
}
