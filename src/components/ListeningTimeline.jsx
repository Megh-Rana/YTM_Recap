import { useEffect, useRef } from 'react';
import './ListeningTimeline.css';

export default function ListeningTimeline({ data }) {
    const maxCount = Math.max(...data.map(d => d.count));

    return (
        <div className="section-card listening-timeline">
            <h2 className="section-title">
                <span className="section-icon">📊</span>
                Monthly Listening
            </h2>

            <div className="timeline-chart">
                {data.map((month, index) => (
                    <div
                        className="timeline-bar-group"
                        key={month.month}
                        style={{ animationDelay: `${index * 0.04}s` }}
                    >
                        <div className="timeline-count">{month.count}</div>
                        <div className="timeline-bar-wrapper">
                            <div
                                className="timeline-bar"
                                style={{
                                    height: `${Math.max((month.count / maxCount) * 100, 3)}%`,
                                    animationDelay: `${index * 0.04 + 0.3}s`,
                                }}
                            />
                        </div>
                        <div className="timeline-label">{month.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
