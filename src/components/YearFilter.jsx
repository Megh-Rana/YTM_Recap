import { useState } from 'react';
import './YearFilter.css';

export default function YearFilter({ years, selected, onChange }) {
    return (
        <div className="year-filter">
            <button
                className={`year-pill ${selected === 'all' ? 'active' : ''}`}
                onClick={() => onChange('all')}
            >
                All Time
            </button>
            {years.map(year => (
                <button
                    key={year}
                    className={`year-pill ${selected === year ? 'active' : ''}`}
                    onClick={() => onChange(year)}
                >
                    {year}
                </button>
            ))}
        </div>
    );
}
