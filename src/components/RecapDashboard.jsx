import { useState, useMemo } from 'react';
import YearFilter from './YearFilter';
import HeroCard from './HeroCard';
import TopArtists from './TopArtists';
import TopSongs from './TopSongs';
import ListeningTimeline from './ListeningTimeline';
import PeakHours from './PeakHours';
import AlbumStats from './AlbumStats';
import StreakCard from './StreakCard';
import './RecapDashboard.css';

import {
    filterByYear,
    getAvailableYears,
    getSummaryStats,
    getTopArtists,
    getTopSongs,
    getMonthlyBreakdown,
    getPeakHours,
    getAlbumStats,
    getListeningStreak,
} from '../utils/statsEngine';

export default function RecapDashboard({ entries, durationMap, onReset }) {
    const years = useMemo(() => getAvailableYears(entries), [entries]);
    const [selectedYear, setSelectedYear] = useState('all');

    const filtered = useMemo(() => filterByYear(entries, selectedYear), [entries, selectedYear]);

    const stats = useMemo(() => getSummaryStats(filtered, durationMap), [filtered, durationMap]);
    const topArtists = useMemo(() => getTopArtists(filtered, 10, durationMap), [filtered, durationMap]);
    const topSongs = useMemo(() => getTopSongs(filtered, 10, durationMap), [filtered, durationMap]);
    const monthlyData = useMemo(() => getMonthlyBreakdown(filtered), [filtered]);
    const peakHours = useMemo(() => getPeakHours(filtered), [filtered]);
    const albums = useMemo(() => getAlbumStats(filtered, 10, durationMap), [filtered, durationMap]);
    const streak = useMemo(() => getListeningStreak(filtered), [filtered]);

    return (
        <div className="recap-dashboard">
            {/* Animated background orbs */}
            <div className="bg-orb bg-orb-1" />
            <div className="bg-orb bg-orb-2" />
            <div className="bg-orb bg-orb-3" />

            <div className="recap-container">
                <header className="recap-header">
                    <div className="recap-header-left">
                        <h1 className="recap-title">Your YTM Recap</h1>
                    </div>
                    <button className="reset-button" onClick={onReset}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                        Upload New
                    </button>
                </header>

                <YearFilter
                    years={years}
                    selected={selectedYear}
                    onChange={setSelectedYear}
                />

                <HeroCard stats={stats} />

                <StreakCard streak={streak} />

                <div className="recap-grid">
                    <TopArtists artists={topArtists} />
                    <TopSongs songs={topSongs} />
                </div>

                <ListeningTimeline data={monthlyData} />

                <div className="recap-grid">
                    <PeakHours data={peakHours} />
                    {albums.length > 0 && <AlbumStats albums={albums} />}
                </div>

                <footer className="recap-footer">
                    <p>
                        Generated with <span className="footer-heart">♥</span> by YTM Recap · All data processed locally in your browser
                    </p>
                </footer>
            </div>
        </div>
    );
}
