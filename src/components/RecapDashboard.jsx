import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Music2, Flame, Repeat, Disc3, Headphones, TrendingUp, Sparkles } from 'lucide-react';
import { useTheme } from '../theme';
import ThemeToggle from './ThemeToggle';
import WaveChart from './WaveChart';
import YearSelect from './YearSelect';
import AutoFitText from './AutoFitText';
import RecapPlayer from './RecapPlayer';
import { fetchArtistPhoto } from '../utils/artistPhoto';
import {
  filterByYear, getAvailableYears, getSummaryStats,
  getTopArtists, getTopSongs, getMonthlyBreakdown,
  getPeakHours, getListeningStreak,
} from '../utils/statsEngine';

const sans = { fontFamily: "Rubik, system-ui, sans-serif" };
const PASTEL_INK = '#1F1A2E';
const PASTEL_INK_SOFT = '#5A5468';
const PASTEL_INK_MUTE = '#8C8898';

const ARTIST_COLORS = ['#E94B7B', '#5BB8C4', '#F4D03F', '#7DBE3C', '#FF8FB5', '#A084CA', '#E07A5F', '#4A90D9', '#F39C12', '#27AE60'];

function Tile({ children, bg, fg, delay = 0, style = {}, className = '' }) {
  const { p } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={className}
      style={{
        borderRadius: 24, padding: 24, position: 'relative', overflow: 'hidden', height: '100%',
        background: bg ?? p.card, color: fg ?? p.ink,
        border: `1px solid ${p.border}14`,
        boxShadow: `0 1px 0 ${p.shadow}, 0 14px 36px -14px ${p.shadow}`,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

function Label({ icon: Icon, text, mute }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, textTransform: 'uppercase', ...sans, letterSpacing: '0.2em', fontWeight: 600, color: mute }}>
      <Icon size={14} />
      {text}
    </div>
  );
}

export default function RecapDashboard({ entries, durationMap, onReset }) {
  const { p } = useTheme();
  const [recapOpen, setRecapOpen] = useState(false);

  const years = useMemo(() => getAvailableYears(entries), [entries]);
  const yearOptions = useMemo(() => ['All time', ...years.map(String)], [years]);
  const [range, setRange] = useState(() => years.length > 0 ? String(years[0]) : 'All time');

  const selectedYear = range === 'All time' ? 'all' : parseInt(range);
  const filtered = useMemo(() => filterByYear(entries, selectedYear), [entries, selectedYear]);

  const stats = useMemo(() => getSummaryStats(filtered, durationMap), [filtered, durationMap]);
  const topArtists = useMemo(() => getTopArtists(filtered, 7, durationMap).map((a, i) => ({ ...a, color: ARTIST_COLORS[i % ARTIST_COLORS.length] })), [filtered, durationMap]);
  const topSongs = useMemo(() => getTopSongs(filtered, 5, durationMap), [filtered, durationMap]);
  const monthlyData = useMemo(() => getMonthlyBreakdown(filtered), [filtered]);
  const peakHours = useMemo(() => getPeakHours(filtered), [filtered]);
  const streak = useMemo(() => getListeningStreak(filtered), [filtered]);

  // Hourly array (24 values)
  const hourly = useMemo(() => {
    const arr = Array(24).fill(0);
    peakHours.forEach(h => { arr[h.hour] = h.count; });
    return arr;
  }, [peakHours]);

  const peakHour = peakHours.length > 0 ? peakHours.reduce((a, b) => b.count > a.count ? b : a) : null;
  const peakHourLabel = peakHour ? peakHour.label : '--';

  // Monthly chart data (12 values)
  const monthly = useMemo(() => {
    const arr = Array(12).fill(0);
    monthlyData.forEach(d => {
      const m = new Date(d.month + '-01').getMonth();
      if (!isNaN(m)) arr[m] += d.count;
    });
    return arr;
  }, [monthlyData]);

  const peakMonthIdx = monthly.indexOf(Math.max(...monthly));
  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const MONTH_SHORT = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  const elevation = `0 1px 0 ${p.shadow}, 0 14px 36px -14px ${p.shadow}`;

  const mostReplayed = topSongs[0];

  // Fetch photos for top 5 artists
  const [artistPhotos, setArtistPhotos] = useState({});
  useEffect(() => {
    topArtists.slice(0, 5).forEach(a => {
      fetchArtistPhoto(a.name).then(url => {
        if (url) setArtistPhotos(prev => ({ ...prev, [a.name]: url }));
      });
    });
  }, [topArtists]);

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: p.bg, color: p.ink, ...sans }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '20px 40px' }}>
        <button onClick={onReset}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, fontSize: 14, background: p.card, border: `1px solid ${p.border}18`, color: p.ink, fontWeight: 500, boxShadow: `0 4px 12px -6px ${p.shadow}`, cursor: 'pointer', ...sans }}>
          <ArrowLeft size={16} /> New upload
        </button>
        <div style={{ fontWeight: 700, letterSpacing: '-0.02em', fontSize: 18 }}>Youtube Music Recap</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setRecapOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, fontSize: 14, background: p.ink, color: p.bg, fontWeight: 600, ...sans, boxShadow: `0 8px 20px -8px ${p.shadow}`, cursor: 'pointer', border: 'none' }}>
            <Play size={16} style={{ fill: 'currentColor' }} /> Play recap
          </button>
          <ThemeToggle />
        </div>
      </header>

      <main style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
            style={{ marginBottom: 36, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <h1 style={{ fontSize: 'clamp(36px, 7vw, 84px)', fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 0.98 }}>
              Your <span style={{ color: p.accentDeep }}>{range === 'All time' ? 'all-time' : range}</span> in sound.
            </h1>
            <YearSelect value={range} onChange={setRange} options={yearOptions} />
          </motion.div>

          {/* Bento grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>

            {/* Row 1: Hours hero */}
            <div style={{ gridColumn: 'span 8' }}>
              <Tile bg={p.accentDeep} fg="#fff" delay={0.05} style={{ minHeight: 320 }}>
                <div style={{ position: 'absolute', bottom: -80, right: -80, width: 288, height: 288, borderRadius: '50%', opacity: 0.25, background: p.pink }} />
                <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Label icon={Headphones} text="Hours Listened" mute="rgba(255,255,255,0.85)" />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', marginTop: 24 }}>
                    <AutoFitText maxFontSize={200} style={{ fontFamily: sans.fontFamily, fontWeight: 600, letterSpacing: '0.01em', lineHeight: 1, fontFeatureSettings: "'tnum'" }}>
                      {Math.round(stats.totalHours).toLocaleString()}
                    </AutoFitText>
                    <div style={{ marginTop: 24, fontSize: 18, fontWeight: 500, opacity: 0.9 }}>hours of music</div>
                  </div>
                </div>
              </Tile>
            </div>

            <div style={{ gridColumn: 'span 4', display: 'grid', gridTemplateRows: '1fr 1fr', gap: 16 }}>
              <Tile bg={p.mint} fg={PASTEL_INK} delay={0.1}>
                <Label icon={Flame} text="Longest Streak" mute={PASTEL_INK_SOFT} />
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <div style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1 }}>{streak.longest}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: PASTEL_INK_SOFT }}>days</div>
                </div>
                <div style={{ fontSize: 13, color: PASTEL_INK_SOFT, marginTop: 8 }}>{streak.totalDays} days with music</div>
              </Tile>
              <Tile bg={p.aqua} fg={PASTEL_INK} delay={0.15}>
                <Label icon={Repeat} text="Most Replayed" mute={PASTEL_INK_SOFT} />
                <div style={{ marginTop: 16, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{mostReplayed?.title ?? '—'}</div>
                <div style={{ fontSize: 13, color: PASTEL_INK_SOFT, marginTop: 6 }}>{mostReplayed?.artist} · {mostReplayed?.plays}×</div>
              </Tile>
            </div>

            {/* Row 2: Top Artists + When You Listen */}
            <div style={{ gridColumn: 'span 7' }}>
              <Tile delay={0.2} style={{ minHeight: 420 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <Label icon={Music2} text="Top Artists" mute={p.inkSoft} />
                  <div style={{ fontSize: 11, color: p.inkMute, fontWeight: 500, letterSpacing: '0.14em' }}>BY PLAY COUNT</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {topArtists.map((a, i) => {
                    const pct = (a.plays / (topArtists[0]?.plays || 1)) * 100;
                    const photo = artistPhotos[a.name];
                    return (
                      <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 28, fontWeight: 600, color: p.inkMute, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: a.color, overflow: 'hidden' }}>
                          {photo && <img src={photo} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500, letterSpacing: '-0.015em', fontSize: 15 }}>{a.name}</div>
                            <div style={{ fontWeight: 600, fontSize: 13, color: p.inkSoft, fontVariantNumeric: 'tabular-nums' }}>{a.plays}</div>
                          </div>
                          <div style={{ height: 8, borderRadius: 999, overflow: 'hidden', background: p.bgAlt }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 1, delay: 0.35 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                              style={{ height: '100%', borderRadius: 999, background: a.color }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Tile>
            </div>

            <div style={{ gridColumn: 'span 5' }}>
              <Tile bg={p.pink} fg={PASTEL_INK} delay={0.25} style={{ minHeight: 420 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Label icon={TrendingUp} text="When You Listen" mute={PASTEL_INK_SOFT} />
                  <div style={{ fontSize: 11, color: PASTEL_INK_MUTE, fontWeight: 500, letterSpacing: '0.14em' }}>24H CYCLE</div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1 }}>
                    {peakHourLabel}
                  </div>
                  <div style={{ fontSize: 13, color: PASTEL_INK_SOFT, marginTop: 6 }}>Your peak listening hour</div>
                </div>
                <div style={{ marginTop: 32 }}>
                  <WaveChart data={hourly} />
                </div>
              </Tile>
            </div>

            {/* Row 3: Top Songs + Stats + Total Plays */}
            <div style={{ gridColumn: 'span 5' }}>
              <Tile delay={0.3} style={{ height: '100%' }}>
                <Label icon={Disc3} text="Top Songs" mute={p.inkSoft} />
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {topSongs.map((s, i) => (
                    <div key={s.url || i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
                      <div style={{ width: 24, fontWeight: 600, color: p.inkMute, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>{i + 1}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500, letterSpacing: '-0.015em', fontSize: 15 }}>{s.title}</div>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, color: p.inkSoft }}>{s.artist}</div>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: p.inkSoft, fontVariantNumeric: 'tabular-nums' }}>{s.plays}×</div>
                    </div>
                  ))}
                </div>
              </Tile>
            </div>

            <div style={{ gridColumn: 'span 7', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 16 }}>
              <Tile bg={p.ink} fg={p.bg} delay={0.35}>
                <Label icon={Disc3} text="Unique Songs" mute={`${p.bg}90`} />
                <div style={{ marginTop: 12, fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{stats.uniqueSongs?.toLocaleString()}</div>
                <div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>tracks played</div>
              </Tile>
              <Tile bg={p.mint} fg={PASTEL_INK} delay={0.4}>
                <Label icon={Sparkles} text="Unique Artists" mute={PASTEL_INK_SOFT} />
                <div style={{ marginTop: 12, fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{stats.uniqueArtists?.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: PASTEL_INK_SOFT, marginTop: 8 }}>artists discovered</div>
              </Tile>
              <Tile bg={p.accentDeep} fg="#fff" delay={0.45} style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Label icon={Music2} text="Total Plays" mute="rgba(255,255,255,0.75)" />
                  <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.14em', fontWeight: 500 }}>ALL TIME</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 12, flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    {stats.totalPlays?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.5, textAlign: 'right' }}>
                    songs played<br />in {range.toLowerCase()}
                  </div>
                </div>
              </Tile>
            </div>

            {/* Row 4: Monthly */}
            <div style={{ gridColumn: 'span 12' }}>
              <Tile delay={0.5}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Label icon={TrendingUp} text="Monthly Listening" mute={p.inkSoft} />
                  <div style={{ fontSize: 11, color: p.inkMute, fontWeight: 500, letterSpacing: '0.14em' }}>PLAYS PER MONTH</div>
                </div>
                <div style={{ marginTop: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, height: 144 }}>
                  {MONTH_SHORT.map((m, i) => {
                    const h = monthly[i];
                    const pct = Math.max(...monthly) > 0 ? (h / Math.max(...monthly)) * 100 : 0;
                    const peak = i === peakMonthIdx && h > 0;
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${pct}%` }}
                          transition={{ duration: 0.85, delay: 0.55 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                          style={{ width: '100%', borderRadius: 6, background: peak ? p.accentDeep : p.aqua, minHeight: 6 }}
                        />
                        <div style={{ fontSize: 11, fontWeight: 600, color: p.inkMute }}>{m}</div>
                      </div>
                    );
                  })}
                </div>
                {peakMonthIdx >= 0 && monthly[peakMonthIdx] > 0 && (
                  <div style={{ marginTop: 12, fontSize: 13, color: p.inkSoft }}>
                    Peak month: <span style={{ fontWeight: 600, color: p.ink }}>{MONTH_NAMES[peakMonthIdx]}</span> with {monthly[peakMonthIdx].toLocaleString()} plays
                  </div>
                )}
              </Tile>
            </div>

          </div>

          <div style={{ marginTop: 40, textAlign: 'center', fontSize: 12, color: p.inkMute, letterSpacing: '0.14em', fontWeight: 500 }}>
            GENERATED LOCALLY · YOUTUBE MUSIC RECAP
          </div>
        </div>
      </main>

      {recapOpen && (
        <RecapPlayer
          onClose={() => setRecapOpen(false)}
          stats={stats}
          topArtists={topArtists}
          topSongs={topSongs}
          monthly={monthly}
          hourly={hourly}
          streak={streak}
          range={range}
        />
      )}
    </div>
  );
}
