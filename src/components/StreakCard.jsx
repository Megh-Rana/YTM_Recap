import './StreakCard.css';

export default function StreakCard({ streak }) {
    return (
        <div className="section-card streak-card">
            <div className="streak-grid">
                <div className="streak-item">
                    <div className="streak-value">{streak.longest}</div>
                    <div className="streak-label">Longest Streak (days)</div>
                </div>
                <div className="streak-divider" />
                <div className="streak-item">
                    <div className="streak-value">{streak.totalDays}</div>
                    <div className="streak-label">Days with Music</div>
                </div>
                <div className="streak-divider" />
                <div className="streak-item">
                    <div className={`streak-value ${streak.current > 0 ? 'streak-active' : ''}`}>
                        {streak.current > 0 ? `🔥 ${streak.current}` : '—'}
                    </div>
                    <div className="streak-label">Current Streak</div>
                </div>
            </div>
        </div>
    );
}
