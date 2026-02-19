import { useState, useRef, useCallback } from 'react';
import './LandingPage.css';

export default function LandingPage({ onFileSelected, isProcessing, progress }) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragOut = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.zip')) {
                onFileSelected(file);
            }
        }
    }, [onFileSelected]);

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileSelected(file);
        }
    };

    return (
        <div className="landing-page">
            {/* Animated background orbs */}
            <div className="bg-orb bg-orb-1" />
            <div className="bg-orb bg-orb-2" />
            <div className="bg-orb bg-orb-3" />

            <div className="landing-content">
                <div className="landing-header">
                    <div className="logo-mark">
                        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                            <circle cx="22" cy="22" r="20" stroke="url(#logo-grad)" strokeWidth="2.5" />
                            <circle cx="22" cy="22" r="8" fill="url(#logo-grad)" />
                            <polygon points="19,17 28,22 19,27" fill="#0F111A" />
                            <defs>
                                <linearGradient id="logo-grad" x1="0" y1="0" x2="44" y2="44">
                                    <stop offset="0%" stopColor="#8B5CF6" />
                                    <stop offset="100%" stopColor="#EC4899" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1 className="landing-title">YTM Recap</h1>
                    <p className="landing-subtitle">
                        Your YouTube Music year in review — anytime you want it.
                        <br />
                        <span className="landing-privacy">100% client-side. Your data never leaves your browser.</span>
                    </p>
                </div>

                {isProcessing ? (
                    <div className="processing-state">
                        <div className="processing-spinner">
                            <div className="spinner-ring" />
                            <div className="spinner-ring spinner-ring-2" />
                        </div>
                        <div className="processing-text">{progress || 'Extracting your data...'}</div>
                    </div>
                ) : (
                    <div
                        className={`drop-zone ${isDragging ? 'drop-zone-active' : ''}`}
                        onDragEnter={handleDragIn}
                        onDragLeave={handleDragOut}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="drop-zone-icon">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M24 32V8" />
                                <path d="M16 16l8-8 8 8" />
                                <path d="M40 32v6a4 4 0 01-4 4H12a4 4 0 01-4-4v-6" />
                            </svg>
                        </div>
                        <div className="drop-zone-text">
                            Drop your Google Takeout <strong>.zip</strong> here
                        </div>
                        <div className="drop-zone-hint">or click to browse</div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".zip"
                            onChange={handleFileInput}
                            className="file-input-hidden"
                        />
                    </div>
                )}

                <div className="landing-instructions">
                    <h3>How to get your data</h3>
                    <ol>
                        <li>
                            Go to{' '}
                            <a href="https://takeout.google.com" target="_blank" rel="noopener noreferrer">
                                Google Takeout
                            </a>
                        </li>
                        <li>Deselect all, then select only <strong>YouTube and YouTube Music</strong></li>
                        <li>Click "All YouTube data included", select only <strong>history</strong> and <strong>music (library and uploads)</strong></li>
                        <li>Choose <strong>JSON</strong> format for history</li>
                        <li>Export and download the ZIP</li>
                        <li>Upload it here!</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
