import './TopSongs.css';

export default function TopSongs({ songs }) {
    return (
        <div className="section-card top-songs">
            <h2 className="section-title">
                <span className="section-icon">🎵</span>
                Top Songs
            </h2>

            <div className="songs-list">
                {songs.map((song, index) => (
                    <div
                        className="song-row"
                        key={song.url || index}
                        style={{ animationDelay: `${index * 0.06}s` }}
                    >
                        <div className="song-rank">
                            {index < 3 ? (
                                <span className={`rank-badge rank-${index + 1}`}>{index + 1}</span>
                            ) : (
                                <span className="rank-number">{index + 1}</span>
                            )}
                        </div>

                        <div className="song-info">
                            <div className="song-title">{song.title}</div>
                            <div className="song-artist">
                                {song.artist}
                                {song.album && <span className="song-album"> · {song.album}</span>}
                                {song.durationFormatted && (
                                    <span className="song-duration"> · {song.durationFormatted}</span>
                                )}
                            </div>
                        </div>

                        <div className="song-count">
                            <span className="count-number">{song.plays}</span>
                            <span className="count-label">plays</span>
                            {song.totalMinutes && (
                                <span className="count-time">{Math.round(song.totalMinutes)} min</span>
                            )}
                        </div>

                        {song.url && (
                            <a
                                href={song.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="song-link"
                                title="Play on YouTube Music"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
