import { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import RecapDashboard from './components/RecapDashboard';
import { extractTakeoutZip } from './utils/zipExtractor';
import { parseWatchHistory, parseMusicLibrary, enrichWithLibrary } from './utils/dataParser';
import { getTopVideoIds } from './utils/statsEngine';
import { fetchDurations } from './utils/durationFetcher';
import './App.css';

function App() {
  const [entries, setEntries] = useState(null);
  const [durationMap, setDurationMap] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState(null);

  const handleFileSelected = useCallback(async (file) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Extract ZIP
      setProgress('Extracting ZIP archive...');
      const rawFiles = await extractTakeoutZip(file);

      // Step 2: Parse watch history
      setProgress('Parsing watch history...');
      await new Promise(r => setTimeout(r, 100));
      let musicEntries = parseWatchHistory(rawFiles.watchHistory);

      // Step 3: Parse music library (if available)
      if (rawFiles.musicLibrary) {
        setProgress('Cross-referencing with music library...');
        await new Promise(r => setTimeout(r, 100));
        const libraryMap = parseMusicLibrary(rawFiles.musicLibrary);
        musicEntries = enrichWithLibrary(musicEntries, libraryMap);
      }

      // Step 4: Get top video IDs for duration fetching
      setProgress('Fetching real song durations from YouTube...');
      await new Promise(r => setTimeout(r, 100));
      const topIds = getTopVideoIds(musicEntries, 20);

      // Step 5: Fetch real durations for top songs
      const durations = await fetchDurations(topIds, (done, total) => {
        setProgress(`Fetching song durations... (${done}/${total})`);
      });

      // Step 6: Done!
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

  if (entries) {
    return <RecapDashboard entries={entries} durationMap={durationMap} onReset={handleReset} />;
  }

  return (
    <>
      <LandingPage
        onFileSelected={handleFileSelected}
        isProcessing={isProcessing}
        progress={progress}
      />
      {error && (
        <div className="error-toast">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button className="error-dismiss" onClick={() => setError(null)}>✕</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
