// Fetches artist photo: tries Wikipedia first, falls back to YouTube thumbnail.
const cache = new Map();

async function fetchWikipediaPhoto(artistName) {
  const q = encodeURIComponent(artistName);
  const res = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&titles=${q}&prop=pageimages&format=json&pithumbsize=200&origin=*`
  );
  const data = await res.json();
  const pages = data?.query?.pages ?? {};
  const page = Object.values(pages)[0];
  return page?.thumbnail?.source ?? null;
}

export function ytThumb(videoId) {
  return videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : null;
}

export async function fetchArtistPhoto(artistName, fallbackVideoId = null) {
  if (cache.has(artistName)) return cache.get(artistName);

  let url = null;
  try {
    url = await fetchWikipediaPhoto(artistName);
  } catch { /* ignore */ }

  // Fall back to YouTube thumbnail of their most-played song
  if (!url && fallbackVideoId) {
    url = ytThumb(fallbackVideoId);
  }

  cache.set(artistName, url);
  return url;
}
