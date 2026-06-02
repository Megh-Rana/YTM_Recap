// Fetches artist thumbnail URL from Wikipedia's API (no key required).
// Returns null if not found or on any error.
const cache = new Map();

export async function fetchArtistPhoto(artistName) {
  if (cache.has(artistName)) return cache.get(artistName);

  try {
    const q = encodeURIComponent(artistName);
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${q}&prop=pageimages&format=json&pithumbsize=200&origin=*`
    );
    const data = await res.json();
    const pages = data?.query?.pages ?? {};
    const page = Object.values(pages)[0];
    const url = page?.thumbnail?.source ?? null;
    cache.set(artistName, url);
    return url;
  } catch {
    cache.set(artistName, null);
    return null;
  }
}
