import { useState, useCallback, useMemo } from 'react';
import LandingPage from './components/LandingPage';
import RecapDashboard from './components/RecapDashboard';
import { extractTakeoutZip } from './utils/zipExtractor';
import { parseWatchHistory, parseMusicLibrary, enrichWithLibrary } from './utils/dataParser';
import { getTopVideoIds } from './utils/statsEngine';
import { fetchDurations } from './utils/durationFetcher';
import { ThemeContext, lightPalette, darkPalette } from './theme';
import './index.css';

function App() {
  const [entries, setEntries] = useState(null);
  const [durationMap, setDurationMap] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('light');

  const themeCtx = useMemo(() => ({
    mode,
    toggle: () => setMode(m => m === 'light' ? 'dark' : 'light'),
    p: mode === 'light' ? lightPalette : darkPalette,
  }), [mode]);

  const handleFileSelected = useCallback(async (file) => {
    setIsProcessing(true);
    setError(null);
    try {
      setProgress('Extracting ZIP archive...');
      const rawFiles = await extractTakeoutZip(file);

      setProgress('Parsing watch history...');
      await new Promise(r => setTimeout(r, 100));
      let musicEntries = parseWatchHistory(rawFiles.watchHistory);

      if (rawFiles.musicLibrary) {
        setProgress('Cross-referencing with music library...');
        await new Promise(r => setTimeout(r, 100));
        const libraryMap = parseMusicLibrary(rawFiles.musicLibrary);
        musicEntries = enrichWithLibrary(musicEntries, libraryMap);
      }

      setProgress('Fetching real song durations from YouTube...');
      await new Promise(r => setTimeout(r, 100));
      const topIds = getTopVideoIds(musicEntries, 20);
      const durations = await fetchDurations(topIds, (done, total) => {
        setProgress(`Fetching song durations... (${done}/${total})`);
      });

      setProgress('Building your recap...');
      await new Promise(r => setTimeout(r, 300));
      setDurationMap(durations);
      setEntries(musicEntries);
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err.message || 'Something went wrong while processing your data.');
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  }, []);

  const handleReset = useCallback(() => {
    setEntries(null);
    setDurationMap(null);
    setError(null);
  }, []);

  return (
    <ThemeContext.Provider value={themeCtx}>
      <div style={{ minHeight: '100vh', background: themeCtx.p.bg }}>
        {entries ? (
          <RecapDashboard entries={entries} durationMap={durationMap} onReset={handleReset} />
        ) : (
          <LandingPage onFileSelected={handleFileSelected} isProcessing={isProcessing} progress={progress} />
        )}
        {error && (
          <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#1F1A2E', color: '#fff', padding: '12px 20px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', zIndex: 100, fontFamily: 'Rubik, system-ui, sans-serif', fontSize: 14 }}>
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7, fontSize: 16 }}>✕</button>
          </div>
        )}
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
