import './AlbumStats.css';

export default function AlbumStats({ albums }) {
    return (
        <div className="section-card album-stats">
            <h2 className="section-title">
                <span className="section-icon">💿</span>
                Top Albums
            </h2>

            <div className="albums-list">
                {albums.map((album, index) => (
                    <div
                        className="album-row"
                        key={album.album}
                        style={{ animationDelay: `${index * 0.06}s` }}
                    >
                        <div className="album-rank">
                            <span className="rank-number">{index + 1}</span>
                        </div>
                        <div className="album-info">
                            <div className="album-name">{album.album}</div>
                            <div className="album-artist">{album.artist}</div>
                        </div>
                        <div className="album-meta">
                            <span className="album-plays">{album.plays} plays</span>
                            <span className="album-tracks">{album.uniqueTracks} tracks</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
