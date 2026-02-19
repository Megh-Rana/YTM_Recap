/**
 * Stats engine — computes all recap statistics from parsed music entries.
 * All functions accept an array of entries (already filtered by time range).
 *
 * Duration strategy:
 * - If a durationMap is provided (videoId → seconds), use real durations for known songs
 * - For unknown songs, fall back to AVG_SONG_DURATION_MINUTES
 */

const AVG_SONG_DURATION_MINUTES = 3.5;

/**
 * Get song duration in minutes, using real duration if available.
 */
function getSongMinutes(videoId, durationMap) {
    if (durationMap && durationMap.has(videoId)) {
        return durationMap.get(videoId) / 60;
    }
    return AVG_SONG_DURATION_MINUTES;
}

/**
 * Filter entries by year. Pass null for all-time.
 */
export function filterByYear(entries, year) {
    if (year === null || year === 'all') return entries;
    return entries.filter(e => e.year === Number(year));
}

/**
 * Get all unique years present in the data.
 */
export function getAvailableYears(entries) {
    const years = [...new Set(entries.map(e => e.year))];
    return years.sort((a, b) => b - a); // descending
}

/**
 * Get the video IDs of the top N most-played songs.
 * Used to know which songs to fetch durations for.
 */
export function getTopVideoIds(entries, limit = 20) {
    const counts = new Map();
    for (const entry of entries) {
        const key = entry.videoId;
        if (!key) continue;
        counts.set(key, (counts.get(key) || 0) + 1);
    }
    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([id]) => id);
}

/**
 * Compute overall summary stats.
 * @param {Map<string, number>} durationMap - Optional map of videoId → duration in seconds
 */
export function getSummaryStats(entries, durationMap = null) {
    const totalPlays = entries.length;

    // Calculate total minutes using real durations where available
    let totalMinutes = 0;
    let knownDurationPlays = 0;
    for (const entry of entries) {
        if (durationMap && durationMap.has(entry.videoId)) {
            totalMinutes += durationMap.get(entry.videoId) / 60;
            knownDurationPlays++;
        } else {
            totalMinutes += AVG_SONG_DURATION_MINUTES;
        }
    }

    const totalHours = totalMinutes / 60;
    const uniqueArtists = new Set(entries.map(e => e.artist)).size;
    const uniqueSongs = new Set(entries.map(e => e.videoId)).size;

    // Date range
    const times = entries.map(e => e.time.getTime());
    const earliest = new Date(Math.min(...times));
    const latest = new Date(Math.max(...times));

    return {
        totalPlays,
        totalMinutes: Math.round(totalMinutes),
        totalHours: Math.round(totalHours * 10) / 10,
        uniqueArtists,
        uniqueSongs,
        earliest,
        latest,
        knownDurationPlays,
        hasRealDurations: knownDurationPlays > 0,
    };
}

/**
 * Top artists by play count.
 * @param {Map<string, number>} durationMap - Optional map of videoId → duration in seconds
 */
export function getTopArtists(entries, limit = 10, durationMap = null) {
    const counts = new Map();

    for (const entry of entries) {
        if (!counts.has(entry.artist)) {
            counts.set(entry.artist, { plays: 0, minutes: 0 });
        }
        const current = counts.get(entry.artist);
        current.plays += 1;
        current.minutes += getSongMinutes(entry.videoId, durationMap);
    }

    return [...counts.entries()]
        .map(([name, data]) => ({
            name,
            plays: data.plays,
            hours: Math.round((data.minutes / 60) * 10) / 10,
        }))
        .sort((a, b) => b.plays - a.plays)
        .slice(0, limit);
}

/**
 * Top songs by play count.
 * @param {Map<string, number>} durationMap - Optional map of videoId → duration in seconds
 */
export function getTopSongs(entries, limit = 10, durationMap = null) {
    const counts = new Map();

    for (const entry of entries) {
        const key = entry.videoId || entry.title;
        if (!counts.has(key)) {
            counts.set(key, {
                videoId: entry.videoId,
                title: entry.title,
                artist: entry.artist,
                url: entry.url,
                album: entry.album || null,
                plays: 0,
            });
        }
        counts.get(key).plays += 1;
    }

    return [...counts.values()]
        .sort((a, b) => b.plays - a.plays)
        .slice(0, limit)
        .map(song => {
            const durationSec = durationMap && durationMap.has(song.videoId)
                ? durationMap.get(song.videoId)
                : null;
            return {
                ...song,
                durationSec,
                durationFormatted: durationSec ? formatDuration(durationSec) : null,
                totalMinutes: durationSec
                    ? Math.round((durationSec / 60) * song.plays * 10) / 10
                    : null,
            };
        });
}

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * Monthly listening breakdown — number of plays per month.
 */
export function getMonthlyBreakdown(entries) {
    const months = new Map();

    for (const entry of entries) {
        const key = entry.dateKey; // "YYYY-MM"
        months.set(key, (months.get(key) || 0) + 1);
    }

    return [...months.entries()]
        .map(([key, count]) => ({
            month: key,
            label: formatMonthLabel(key),
            count,
        }))
        .sort((a, b) => a.month.localeCompare(b.month));
}

function formatMonthLabel(dateKey) {
    const [year, month] = dateKey.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
}

/**
 * Peak listening hours — distribution across 24 hours.
 */
export function getPeakHours(entries) {
    const hours = new Array(24).fill(0);

    for (const entry of entries) {
        hours[entry.hour] += 1;
    }

    return hours.map((count, hour) => ({
        hour,
        label: formatHourLabel(hour),
        count,
    }));
}

function formatHourLabel(hour) {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
}

/**
 * Album stats — group by album, count total plays.
 * Only includes entries that have album data.
 * @param {Map<string, number>} durationMap - Optional map of videoId → duration in seconds
 */
export function getAlbumStats(entries, limit = 10, durationMap = null) {
    const albums = new Map();

    for (const entry of entries) {
        if (!entry.album) continue;
        if (!albums.has(entry.album)) {
            albums.set(entry.album, {
                album: entry.album,
                artist: entry.artist,
                plays: 0,
                minutes: 0,
                uniqueSongs: new Set(),
            });
        }
        const albumData = albums.get(entry.album);
        albumData.plays += 1;
        albumData.minutes += getSongMinutes(entry.videoId, durationMap);
        albumData.uniqueSongs.add(entry.videoId);
    }

    return [...albums.values()]
        .map(a => ({
            album: a.album,
            artist: a.artist,
            plays: a.plays,
            uniqueTracks: a.uniqueSongs.size,
            hours: Math.round((a.minutes / 60) * 10) / 10,
        }))
        .sort((a, b) => b.plays - a.plays)
        .slice(0, limit);
}

/**
 * Listening streak — longest consecutive days with at least one listen.
 */
export function getListeningStreak(entries) {
    if (entries.length === 0) return { current: 0, longest: 0 };

    // Get unique dates
    const dateSet = new Set();
    for (const entry of entries) {
        const d = entry.time;
        dateSet.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    }

    const dates = [...dateSet].sort();
    let longest = 1;
    let current = 1;

    for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
            current += 1;
            longest = Math.max(longest, current);
        } else {
            current = 1;
        }
    }

    // Check if current streak is still active (last date is today or yesterday)
    const lastDate = new Date(dates[dates.length - 1]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffFromToday = (today - lastDate) / (1000 * 60 * 60 * 24);
    const isActive = diffFromToday <= 1;

    return {
        longest: Math.max(longest, current),
        current: isActive ? current : 0,
        totalDays: dates.length,
    };
}

/**
 * Day of week breakdown.
 */
export function getDayOfWeekBreakdown(entries) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = new Array(7).fill(0);

    for (const entry of entries) {
        counts[entry.dayOfWeek] += 1;
    }

    return counts.map((count, i) => ({
        day: days[i],
        count,
    }));
}
