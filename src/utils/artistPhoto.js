const cache = new Map();

// YouTube thumbnail (always reliable since it comes from actual listen history)
export function ytThumb(videoId) {
  return videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : null;
}

async function fetchWikipediaPhoto(query) {
  const q = encodeURIComponent(query);
  const res = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&titles=${q}&prop=pageimages|categories&format=json&pithumbsize=300&origin=*`
  );
  const data = await res.json();
  const pages = data?.query?.pages ?? {};
  const page = Object.values(pages)[0];
  if (!page || page.missing !== undefined) return null;

  // Reject if page has film/album/song categories (wrong result)
  const cats = (page.categories ?? []).map(c => c.title.toLowerCase());
  const isWrong = cats.some(c =>
    c.includes('film') || c.includes('album') || c.includes('song') ||
    c.includes('television') || c.includes('serial')
  );
  if (isWrong) return null;

  return page?.thumbnail?.source ?? null;
}

export async function fetchArtistPhoto(artistName, fallbackVideoId = null) {
  if (cache.has(artistName)) return cache.get(artistName);

  let url = null;
  try {
    // Try "Artist music" first (avoids film/show disambiguation)
    url = await fetchWikipediaPhoto(artistName + ' music');
    // If not found, try bare name
    if (!url) url = await fetchWikipediaPhoto(artistName);
  } catch { /* ignore */ }

  // Always fall back to YouTube thumbnail — guaranteed to be relevant
  if (!url && fallbackVideoId) url = ytThumb(fallbackVideoId);

  cache.set(artistName, url);
  return url;
}
