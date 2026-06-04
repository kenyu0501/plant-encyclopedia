export function getYoutubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace("/", "");
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/")[2];
      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

export function getYoutubeThumbnail(url: string) {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export function getYoutubeKey(url: string) {
  return getYoutubeId(url) ?? url.trim().replace(/\/+$/, "").toLowerCase();
}

export function uniqueYoutubeLinks<T extends { youtube_url: string }>(videos: T[]) {
  const seen = new Set<string>();

  return videos.filter((video) => {
    const key = getYoutubeKey(video.youtube_url);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
