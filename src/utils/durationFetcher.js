/**
 * Fetch real video durations using the YouTube IFrame Player API.
 * No API key needed — works entirely client-side.
 */

let apiReady = false;
let apiReadyPromise = null;

/**
 * Load the YouTube IFrame API script (once).
 */
function loadYouTubeAPI() {
    if (apiReadyPromise) return apiReadyPromise;

    apiReadyPromise = new Promise((resolve) => {
        if (window.YT && window.YT.Player) {
            apiReady = true;
            resolve();
            return;
        }

        // YouTube API calls this global function when ready
        window.onYouTubeIframeAPIReady = () => {
            apiReady = true;
            resolve();
        };

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
    });

    return apiReadyPromise;
}

/**
 * Get duration (in seconds) for a single video ID.
 * Creates a hidden player, waits for it to be ready, gets duration, then destroys it.
 */
function getVideoDuration(videoId, containerId) {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            // If we can't get the duration within 8s, give up
            try { player.destroy(); } catch (e) { /* ignore */ }
            resolve(null);
        }, 8000);

        const player = new window.YT.Player(containerId, {
            videoId: videoId,
            width: 1,
            height: 1,
            playerVars: {
                autoplay: 0,
                controls: 0,
                mute: 1,
            },
            events: {
                onReady: () => {
                    const duration = player.getDuration();
                    clearTimeout(timeout);
                    try { player.destroy(); } catch (e) { /* ignore */ }
                    resolve(duration > 0 ? duration : null);
                },
                onError: () => {
                    clearTimeout(timeout);
                    try { player.destroy(); } catch (e) { /* ignore */ }
                    resolve(null);
                },
            },
        });
    });
}

/**
 * Fetch durations for a list of video IDs.
 * Returns a Map of videoId → duration in seconds.
 *
 * @param {string[]} videoIds - Array of YouTube video IDs
 * @param {function} onProgress - Optional callback: (completed, total) => void
 * @returns {Promise<Map<string, number>>}
 */
export async function fetchDurations(videoIds, onProgress) {
    await loadYouTubeAPI();

    const durationMap = new Map();

    // Create a hidden container for the players
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;overflow:hidden;pointer-events:none;';
    document.body.appendChild(container);

    // Process videos sequentially (YouTube API doesn't like too many concurrent players)
    for (let i = 0; i < videoIds.length; i++) {
        const videoId = videoIds[i];

        // Create a unique div for this player
        const playerDiv = document.createElement('div');
        playerDiv.id = `yt-duration-player-${i}`;
        container.appendChild(playerDiv);

        const duration = await getVideoDuration(videoId, playerDiv.id);
        if (duration !== null) {
            durationMap.set(videoId, duration);
        }

        if (onProgress) {
            onProgress(i + 1, videoIds.length);
        }
    }

    // Clean up
    document.body.removeChild(container);

    return durationMap;
}
