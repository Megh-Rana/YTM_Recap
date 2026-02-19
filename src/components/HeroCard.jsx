import { useEffect, useRef, useState } from 'react';
import './HeroCard.css';

function AnimatedNumber({ value, suffix = '', decimals = 0 }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const duration = 1500;
        const start = performance.now();
        const startVal = 0;

        function animate(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = startVal + (value - startVal) * eased;
            setDisplay(current);
            if (progress < 1) {
                ref.current = requestAnimationFrame(animate);
            }
        }

        ref.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(ref.current);
    }, [value]);

    const formatted = decimals > 0
        ? display.toFixed(decimals)
        : Math.round(display).toLocaleString();

    return <span className="animated-number">{formatted}{suffix}</span>;
}

export default function HeroCard({ stats }) {
    return (
        <div className="hero-card">
            <div className="hero-title">Your Music Journey</div>
            <div className="hero-subtitle">
                {stats.earliest.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {' — '}
                {stats.latest.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>

            <div className="hero-stats-grid">
                <div className="hero-stat">
                    <div className="hero-stat-value">
                        <AnimatedNumber value={stats.totalHours} decimals={1} />
                    </div>
                    <div className="hero-stat-label">Hours Listened*</div>
                </div>
                <div className="hero-stat">
                    <div className="hero-stat-value">
                        <AnimatedNumber value={stats.totalPlays} />
                    </div>
                    <div className="hero-stat-label">Songs Played</div>
                </div>
                <div className="hero-stat">
                    <div className="hero-stat-value">
                        <AnimatedNumber value={stats.uniqueArtists} />
                    </div>
                    <div className="hero-stat-label">Unique Artists</div>
                </div>
                <div className="hero-stat">
                    <div className="hero-stat-value">
                        <AnimatedNumber value={stats.uniqueSongs} />
                    </div>
                    <div className="hero-stat-label">Unique Songs</div>
                </div>
            </div>

            <div className="hero-estimate-note">
                {stats.hasRealDurations
                    ? `* Uses real durations for top songs (${stats.knownDurationPlays.toLocaleString()} plays), ~3.5 min estimate for others`
                    : '* Estimated at ~3.5 min per song (Google Takeout doesn\'t track actual play duration)'}
            </div>
        </div>
    );
}
