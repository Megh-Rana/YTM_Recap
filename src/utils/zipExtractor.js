import JSZip from 'jszip';

/**
 * Extract Google Takeout ZIP and locate relevant files.
 * Returns raw file contents for watch-history, music library, and search-history.
 */
export async function extractTakeoutZip(file) {
  const zip = await JSZip.loadAsync(file);
  
  const result = {
    watchHistory: null,
    musicLibrary: null,
    searchHistory: null,
  };

  const fileEntries = Object.keys(zip.files);

  for (const path of fileEntries) {
    const lowerPath = path.toLowerCase();

    if (lowerPath.includes('watch-history') && lowerPath.endsWith('.json')) {
      result.watchHistory = await zip.files[path].async('string');
    } else if (lowerPath.includes('music library songs') && lowerPath.endsWith('.csv')) {
      result.musicLibrary = await zip.files[path].async('string');
    } else if (lowerPath.includes('search-history') && lowerPath.endsWith('.json')) {
      result.searchHistory = await zip.files[path].async('string');
    }
  }

  if (!result.watchHistory) {
    throw new Error(
      'Could not find watch-history.json in the ZIP. Make sure you exported YouTube history from Google Takeout in JSON format.'
    );
  }

  return result;
}
