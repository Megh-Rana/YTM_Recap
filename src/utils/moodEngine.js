/**
 * Heuristic mood classifier — no external API.
 * Scores songs against keyword patterns, weighted by play count.
 */

const MOODS = [
  {
    id: 'energetic',
    label: 'Energetic',
    emoji: '⚡',
    color: '#F4D03F',
    desc: 'High energy, pumped up',
    keywords: [
      'pump','energy','power','fire','beast','rage','fury','epic','warrior','thunder',
      'electric','ignite','rush','charge','blast','burn','fuel','hype','turbo','loud',
      'wild','hype','anthem','battle','fight','run','workout','gym','race','speed',
    ],
  },
  {
    id: 'happy',
    label: 'Happy',
    emoji: '🌟',
    color: '#FFB347',
    desc: 'Uplifting, joyful vibes',
    keywords: [
      'happy','joy','sunshine','smile','good','fun','bright','glow','shine','blessed',
      'celebrate','party','dance','vibe','feel good','summer','light','cheer','laugh',
      'love life','wonderful','amazing','fantastic','beautiful day','positive','lucky',
      'khushi','anand','mast','teri ore','rang','rang de','gulabi','rang barse',
    ],
  },
  {
    id: 'romantic',
    label: 'Romantic',
    emoji: '💕',
    color: '#E94B7B',
    desc: 'Love & longing',
    keywords: [
      'love','heart','kiss','romance','darling','baby','honey','forever','together',
      'yours','mine','beautiful','crush','desire','passion','tender','sweet','adore',
      'pyaar','ishq','mohabbat','dil','tere','meri','sanam','jaanu','mehboob','dilbar',
      'beloved','embrace','hold','close','serenade','devoted',
    ],
  },
  {
    id: 'melancholic',
    label: 'Melancholic',
    emoji: '🌧',
    color: '#7CC9D4',
    desc: 'Sad, reflective, nostalgic',
    keywords: [
      'sad','cry','tears','lonely','alone','miss','lost','broken','hurt','pain',
      'goodbye','leave','fade','empty','dark','night','shadow','rain','storm','cold',
      'dard','judai','tanha','rootha','bichad','alvida','bewafa','rona','aansu',
      'nostalgia','memory','remember','past','gone','wish','regret','sorrow','mourn',
    ],
  },
  {
    id: 'chill',
    label: 'Chill',
    emoji: '🌊',
    color: '#A5DEE5',
    desc: 'Relaxed, laid-back, calm',
    keywords: [
      'chill','calm','relax','easy','slow','drift','flow','wave','mellow','smooth',
      'lofi','lo-fi','acoustic','soft','gentle','quiet','peaceful','breath','float',
      'soothing','breeze','dream','hazy','lazy','sunset','vibe','cafe','coffee',
    ],
  },
  {
    id: 'intense',
    label: 'Intense',
    emoji: '🔥',
    color: '#E07A5F',
    desc: 'Dark, dramatic, passionate',
    keywords: [
      'dark','shadow','blood','war','kill','demon','devil','hell','chaos','destroy',
      'intense','deep','heavy','raw','brutal','shred','metal','scream','death','grave',
      'thriller','horror','beast','monster','villain','revenge','hunt','wrath','fear',
      'obsess','possess','haunt','torment','consume','devour',
    ],
  },
];

function scoreSong(title, artist) {
  const text = `${title} ${artist}`.toLowerCase();
  const scores = {};
  for (const mood of MOODS) {
    scores[mood.id] = mood.keywords.filter(k => text.includes(k)).length;
  }
  return scores;
}

export function getMoodProfile(entries) {
  // Tally weighted scores per mood
  const totals = Object.fromEntries(MOODS.map(m => [m.id, 0]));
  let totalWeightedPlays = 0;

  // Group by song, use play count as weight
  const songMap = new Map();
  for (const e of entries) {
    const key = e.videoId || e.title;
    if (!songMap.has(key)) songMap.set(key, { title: e.title, artist: e.artist, plays: 0 });
    songMap.get(key).plays++;
  }

  for (const { title, artist, plays } of songMap.values()) {
    const scores = scoreSong(title, artist);
    const hasMatch = Object.values(scores).some(s => s > 0);
    if (!hasMatch) continue;
    for (const id in scores) totals[id] += scores[id] * plays;
    totalWeightedPlays += plays;
  }

  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  const profile = MOODS.map(m => ({
    ...m,
    score: totals[m.id],
    pct: Math.round((totals[m.id] / total) * 100),
  })).sort((a, b) => b.score - a.score);

  return {
    profile,           // sorted moods with pct
    dominant: profile[0],
    coverage: Math.round((totalWeightedPlays / entries.length) * 100), // % of plays that matched any mood
  };
}
