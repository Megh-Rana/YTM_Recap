import './TopArtists.css';

export default function TopArtists({ artists }) {
    const maxPlays = artists.length > 0 ? artists[0].plays : 1;

    return (
        <div className="section-card top-artists">
            <h2 className="section-title">
                <span className="section-icon">🎤</span>
                Top Artists
            </h2>

            <div className="artists-list">
                {artists.map((artist, index) => (
                    <div
                        className="artist-row"
                        key={artist.name}
                        style={{ animationDelay: `${index * 0.06}s` }}
                    >
                        <div className="artist-rank">
                            {index < 3 ? (
                                <span className={`rank-badge rank-${index + 1}`}>{index + 1}</span>
                            ) : (
                                <span className="rank-number">{index + 1}</span>
                            )}
                        </div>

                        <div className="artist-info">
                            <div className="artist-name">{artist.name}</div>
                            <div className="artist-meta">
                                {artist.plays} plays · {artist.hours} hrs
                            </div>
                        </div>

                        <div className="artist-bar-container">
                            <div
                                className="artist-bar"
                                style={{ width: `${(artist.plays / maxPlays) * 100}%` }}
                            />
                        </div>

                        <div className="artist-plays">{artist.plays}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
