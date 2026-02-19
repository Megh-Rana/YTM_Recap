import './PeakHours.css';

export default function PeakHours({ data }) {
    const maxCount = Math.max(...data.map(d => d.count));

    return (
        <div className="section-card peak-hours">
            <h2 className="section-title">
                <span className="section-icon">🕐</span>
                When You Listen
            </h2>

            <div className="hours-grid">
                {data.map((hour, index) => {
                    const intensity = maxCount > 0 ? hour.count / maxCount : 0;
                    return (
                        <div
                            className="hour-cell"
                            key={hour.hour}
                            style={{
                                '--intensity': intensity,
                                animationDelay: `${index * 0.03}s`,
                            }}
                            title={`${hour.label}: ${hour.count} songs`}
                        >
                            <div
                                className="hour-fill"
                                style={{ opacity: 0.15 + intensity * 0.85 }}
                            />
                            <span className="hour-label">{hour.label}</span>
                            <span className="hour-count">{hour.count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
