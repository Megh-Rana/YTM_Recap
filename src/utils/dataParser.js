import Papa from 'papaparse';

/**
 * Parse and clean the raw Google Takeout data.
 * Filters YouTube Music entries, cleans titles/artists, and builds album lookup.
 */

function cleanArtistName(name) {
    // Remove " - Topic" suffix that YouTube Music adds to channel names
    return name.replace(/\s*-\s*Topic$/i, '').trim();
}

function cleanTitle(title) {
    // Remove "Watched " prefix from watch history entries
    return title.replace(/^Watched\s+/i, '').trim();
}

function extractVideoId(url) {
    if (!url) return null;
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
}

/**
 * Parse watch history JSON and return cleaned music entries.
 */
export function parseWatchHistory(jsonString) {
    const raw = JSON.parse(jsonString);

    return raw
        .filter(entry => {
            // Only YouTube Music entries with subtitles (artist info)
            return (
                entry.header === 'YouTube Music' &&
                entry.subtitles &&
                entry.subtitles.length > 0 &&
                entry.title &&
                entry.titleUrl
            );
        })
        .map(entry => {
            const videoId = extractVideoId(entry.titleUrl);
            const artist = cleanArtistName(entry.subtitles[0].name);
            const title = cleanTitle(entry.title);
            const time = new Date(entry.time);

            return {
                videoId,
                title,
                artist,
                url: entry.titleUrl,
                time,
                year: time.getFullYear(),
                month: time.getMonth(), // 0-indexed
                hour: time.getHours(),
                dayOfWeek: time.getDay(),
                dateKey: `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, '0')}`,
            };
        })
        .sort((a, b) => b.time - a.time); // Most recent first
}

/**
 * Parse music library CSV and build lookup maps.
 * Returns a Map of videoId → { songTitle, albumTitle, artists[] }
 */
export function parseMusicLibrary(csvString) {
    if (!csvString) return new Map();

    const parsed = Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
    });

    const lookup = new Map();

    for (const row of parsed.data) {
        const videoId = row['Video ID'];
        if (!videoId) continue;

        const artists = [];
        for (let i = 1; i <= 18; i++) {
            const key = i === 1 ? 'Artist Name 1' : `Artist Name ${i}`;
            if (row[key] && row[key].trim()) {
                artists.push(row[key].trim());
            }
        }

        lookup.set(videoId, {
            songTitle: row['Song Title'] || '',
            albumTitle: row['Album Title'] || '',
            artists,
        });
    }

    return lookup;
}

/**
 * Parse search history and return cleaned entries.
 */
export function parseSearchHistory(jsonString) {
    if (!jsonString) return [];

    const raw = JSON.parse(jsonString);
    return raw
        .filter(entry => entry.header === 'YouTube Music' && entry.title)
        .map(entry => ({
            query: entry.title.replace(/^Searched for\s+/i, '').trim(),
            time: new Date(entry.time),
        }))
        .sort((a, b) => b.time - a.time);
}

/**
 * Enrich watch history entries with album data from the music library CSV.
 */
export function enrichWithLibrary(entries, libraryMap) {
    return entries.map(entry => {
        const libData = libraryMap.get(entry.videoId);
        if (libData) {
            return {
                ...entry,
                album: libData.albumTitle || null,
                libraryArtists: libData.artists,
            };
        }
        return { ...entry, album: null, libraryArtists: [] };
    });
}
