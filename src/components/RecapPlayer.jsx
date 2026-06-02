import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, ChevronLeft, ChevronRight, Headphones, Flame, Disc3, Music2, Sparkles } from 'lucide-react';
import { useTheme } from '../theme';
import AutoFitText from './AutoFitText';
import { fetchArtistPhoto, ytThumb } from '../utils/artistPhoto';

const sans = { fontFamily: "Rubik, system-ui, sans-serif" };
const SLIDE_MS = 5000;

export default function RecapPlayer({ onClose, stats, topArtists, topSongs, monthly, hourly, streak, range }) {
  const { p } = useTheme();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [artistPhoto, setArtistPhoto] = useState(null);

  // Fetch #1 artist photo
  useEffect(() => {
    if (!topArtists[0]) return;
    fetchArtistPhoto(topArtists[0].name, topArtists[0].topVideoId).then(setArtistPhoto);
  }, [topArtists]);

  const songPhoto = topSongs[0]?.videoId ? ytThumb(topSongs[0].videoId) : null;

  const slides = buildSlides({ p, stats, topArtists, topSongs, monthly, hourly, streak, range, artistPhoto, songPhoto });

  useEffect(() => {
    if (!playing) return;
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / SLIDE_MS, 1);
      setProgress(pct);
      if (pct >= 1) { setI(v => (v + 1) % slides.length); setProgress(0); }
    }, 40);
    return () => clearInterval(id);
  }, [i, playing, slides.length]);

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') { setI(v => (v + 1) % slides.length); setProgress(0); }
      if (e.key === 'ArrowLeft') { setI(v => (v - 1 + slides.length) % slides.length); setProgress(0); }
      if (e.key === ' ') { e.preventDefault(); setPlaying(v => !v); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length, onClose]);

  const slide = slides[i];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, background: 'rgba(10,8,20,0.88)', backdropFilter: 'blur(10px)', ...sans }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        style={{ position: 'relative', width: '100%', maxWidth: 420, aspectRatio: '9/16', borderRadius: 36, overflow: 'hidden', background: slide.bg, color: slide.fg, boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6)' }}
      >
        {/* Progress bars */}
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10, display: 'flex', gap: 4 }}>
          {slides.map((_, idx) => (
            <div key={idx} style={{ flex: 1, height: 4, borderRadius: 999, overflow: 'hidden', background: 'rgba(255,255,255,0.22)' }}>
              <div style={{ height: '100%', background: slide.fg, width: idx < i ? '100%' : idx === i ? `${progress * 100}%` : '0%', transition: 'width 0.04s linear' }} />
            </div>
          ))}
        </div>

        <button onClick={onClose}
          style={{ position: 'absolute', top: 28, right: 16, zIndex: 10, width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', color: slide.fg, border: 'none', cursor: 'pointer' }}>
          <X size={16} />
        </button>

        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            style={{ position: 'absolute', inset: 0, padding: '64px 28px 96px', display: 'flex', flexDirection: 'column' }}>
            {slide.render()}
          </motion.div>
        </AnimatePresence>

        {/* Tap zones */}
        <button onClick={() => { setI(v => (v - 1 + slides.length) % slides.length); setProgress(0); }}
          style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '33%', background: 'transparent', border: 'none', cursor: 'pointer' }} aria-label="Previous" />
        <button onClick={() => { setI(v => (v + 1) % slides.length); setProgress(0); }}
          style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '33%', background: 'transparent', border: 'none', cursor: 'pointer' }} aria-label="Next" />

        {/* Controls */}
        <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => { setI(v => (v - 1 + slides.length) % slides.length); setProgress(0); }}
            style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', color: slide.fg, border: 'none', cursor: 'pointer' }}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setPlaying(v => !v)}
            style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: slide.fg, color: slide.bg, border: 'none', cursor: 'pointer' }}>
            {playing ? <Pause size={20} style={{ fill: 'currentColor' }} /> : <Play size={20} style={{ fill: 'currentColor' }} />}
          </button>
          <button onClick={() => { setI(v => (v + 1) % slides.length); setProgress(0); }}
            style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', color: slide.fg, border: 'none', cursor: 'pointer' }}>
            <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Counter({ to, color, style = {} }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const dur = 1200, start = Date.now();
    const id = setInterval(() => {
      const t = Math.min((Date.now() - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(to * eased));
      if (t >= 1) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [to]);
  return (
    <div style={{ fontSize: 'clamp(80px, 20vw, 140px)', fontWeight: 600, letterSpacing: '0.005em', lineHeight: 0.9, color, fontVariantNumeric: 'tabular-nums', ...style }}>
      {val.toLocaleString()}
    </div>
  );
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_SHORT = ['J','F','M','A','M','J','J','A','S','O','N','D'];

function buildSlides({ p, stats, topArtists, topSongs, monthly, hourly, streak, range, artistPhoto, songPhoto }) {
  const PASTEL_INK = '#1F1A2E';
  const PASTEL_INK_SOFT = '#5A5468';
  const peakMonthIdx = monthly.indexOf(Math.max(...monthly));
  const maxHourly = Math.max(...hourly, 1);
  const peakHourIdx = hourly.indexOf(maxHourly);
  const peakHourLabel = peakHourIdx < 12 ? `${peakHourIdx === 0 ? 12 : peakHourIdx}:00 AM` : `${peakHourIdx === 12 ? 12 : peakHourIdx - 12}:00 PM`;

  return [
    // 1. Intro
    {
      bg: p.accentDeep, fg: '#fff',
      render: () => (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 150, damping: 14, delay: 0.1 }}
            style={{ marginBottom: 24, marginInline: 'auto', width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: p.accentDeep }}>
            <Sparkles size={32} />
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.22em' }}>YOUR {range.toUpperCase()}</motion.div>
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35, type: 'spring', stiffness: 100 }}
            style={{ fontSize: 72, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 0.95, marginTop: 14 }}>in sound.</motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ marginTop: 32, fontSize: 14, opacity: 0.9 }}>
            Let's look back.
          </motion.div>
        </div>
      ),
    },
    // 2. Hours
    {
      bg: p.ink2, fg: p.bg,
      render: () => (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, letterSpacing: '0.2em', opacity: 0.7 }}>
            <Headphones size={14} /> YOU LISTENED FOR
          </motion.div>
          <Counter to={Math.round(stats.totalHours)} color={p.accentDeep} style={{ marginTop: 12 }} />
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ marginTop: 8, fontSize: 30, fontWeight: 600, letterSpacing: '-0.03em' }}>hours of music.</motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            style={{ marginTop: 32, display: 'inline-block', alignSelf: 'flex-start', padding: '6px 12px', borderRadius: 999, fontSize: 12, background: p.mint, color: p.ink2, fontWeight: 600, letterSpacing: '0.08em' }}>
            {stats.totalPlays?.toLocaleString()} TOTAL PLAYS
          </motion.div>
        </div>
      ),
    },
    // 3. Top artist
    ...(topArtists.length > 0 ? [{
      bg: p.mint, fg: PASTEL_INK,
      render: () => (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', color: PASTEL_INK_SOFT }}>
            <Music2 size={14} /> YOUR #1 ARTIST
          </motion.div>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 140 }}
            style={{ marginTop: 20, width: 128, height: 128, borderRadius: 24, background: topArtists[0].color, overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.18)' }}>
            {artistPhoto && <img src={artistPhoto} alt={topArtists[0].name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </motion.div>
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}
            style={{ marginTop: 24, fontSize: 56, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 0.98 }}>
            {topArtists[0].name}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
            style={{ marginTop: 16, fontSize: 15, fontWeight: 500, color: PASTEL_INK_SOFT }}>
            {topArtists[0].plays} plays · {topArtists[0].hours} hrs together
          </motion.div>
        </div>
      ),
    }] : []),
    // 4. Top song
    ...(topSongs.length > 0 ? [{
      bg: p.aqua, fg: PASTEL_INK,
      render: () => (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', color: PASTEL_INK_SOFT }}>
            <Disc3 size={14} /> SONG ON REPEAT
          </motion.div>
          {songPhoto && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 140 }}
              style={{ marginTop: 16, width: 128, height: 96, borderRadius: 16, overflow: 'hidden', boxShadow: '0 16px 36px -10px rgba(0,0,0,0.2)', flexShrink: 0 }}>
              <img src={songPhoto} alt={topSongs[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          )}
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            style={{ marginTop: songPhoto ? 16 : 20, color: PASTEL_INK }}>
            <AutoFitText maxFontSize={64} style={{ fontFamily: 'Rubik, system-ui, sans-serif', fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {topSongs[0].title}
            </AutoFitText>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ marginTop: 12, fontSize: 17, fontWeight: 500, color: PASTEL_INK_SOFT }}>{topSongs[0].artist}</motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            style={{ marginTop: 20, alignSelf: 'flex-start', padding: '8px 16px', borderRadius: 999, background: PASTEL_INK, color: '#fff', fontWeight: 600, fontSize: 13 }}>
            {topSongs[0].plays} plays
          </motion.div>
        </div>
      ),
    }] : []),
    // 5. Top 5 artists
    ...(topArtists.length >= 3 ? [{
      bg: p.cream, fg: PASTEL_INK,
      render: () => (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', color: PASTEL_INK_SOFT }}>
            <Music2 size={14} /> YOUR TOP 5
          </div>
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topArtists.slice(0, 5).map((a, idx) => (
              <motion.div key={a.name} initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 + idx * 0.12, type: 'spring', stiffness: 140, damping: 16 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em', color: PASTEL_INK_SOFT + '80', width: 36, fontVariantNumeric: 'tabular-nums' }}>{idx + 1}</div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: a.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600, fontSize: 18, letterSpacing: '-0.02em' }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: PASTEL_INK_SOFT }}>{a.plays} plays</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    }] : []),
    // 6. Peak hour
    {
      bg: p.pink, fg: PASTEL_INK,
      render: () => (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', color: PASTEL_INK_SOFT }}>
            <Flame size={14} /> PEAK HOUR
          </motion.div>
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 130 }}
            style={{ marginTop: 16, fontSize: 80, fontWeight: 600, letterSpacing: '-0.05em', lineHeight: 0.9 }}>
            {peakHourLabel}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{ marginTop: 12, fontSize: 17, fontWeight: 500, color: PASTEL_INK_SOFT }}>
            Your music came alive.
          </motion.div>
          <motion.svg initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            viewBox="0 0 240 60" style={{ marginTop: 32, width: '100%' }}>
            <polyline
              points={hourly.map((v, idx) => `${(idx / 23) * 240},${60 - (v / maxHourly) * 50 - 5}`).join(' ')}
              fill="none" stroke={p.accentDeep} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            />
          </motion.svg>
        </div>
      ),
    },
    // 7. Streak
    {
      bg: p.accentDeep, fg: '#fff',
      render: () => (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', opacity: 0.85 }}>
            <Flame size={14} /> LONGEST STREAK
          </motion.div>
          <Counter to={streak.longest} color="#fff" style={{ marginTop: 12 }} />
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ marginTop: 8, fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em' }}>days straight.</motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4 }}>
            {Array.from({ length: Math.min(streak.longest, 47) }).map((_, idx) => (
              <motion.div key={idx} initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 1 + idx * 0.015, type: 'spring', stiffness: 200 }}
                style={{ aspectRatio: 1, borderRadius: 2, background: 'rgba(255,255,255,0.9)' }} />
            ))}
          </motion.div>
        </div>
      ),
    },
    // 8. Monthly
    {
      bg: p.cream, fg: PASTEL_INK,
      render: () => (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', color: PASTEL_INK_SOFT }}>
            <Sparkles size={14} /> MONTH BY MONTH
          </div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            style={{ marginTop: 12, fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.02 }}>
            <span style={{ color: p.accentDeep }}>{MONTH_NAMES[peakMonthIdx]}</span><br />was your peak.
          </motion.div>
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6, height: 160 }}>
            {MONTH_SHORT.map((m, idx) => {
              const maxM = Math.max(...monthly, 1);
              const pct = (monthly[idx] / maxM) * 100;
              const peak = idx === peakMonthIdx && monthly[idx] > 0;
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${pct}%` }}
                    transition={{ delay: 0.3 + idx * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{ width: '100%', borderRadius: 6, background: peak ? p.accentDeep : p.aqua, minHeight: 4 }} />
                  <div style={{ fontSize: 10, fontWeight: 600, color: PASTEL_INK_SOFT }}>{m}</div>
                </div>
              );
            })}
          </div>
        </div>
      ),
    },
    // 9. Outro
    {
      bg: p.ink2, fg: p.bg,
      render: () => (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 130, damping: 14 }}
            style={{ marginInline: 'auto', marginBottom: 24, fontSize: 12, fontWeight: 600, letterSpacing: '0.22em', color: p.accentDeep }}>
            YOUTUBE MUSIC RECAP
          </motion.div>
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 54, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1 }}>
            Thanks for<br /><span style={{ color: p.accentDeep }}>listening</span>.
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{ marginTop: 32, fontSize: 14, opacity: 0.7 }}>
            {stats.totalHours ? `${Math.round(stats.totalHours).toLocaleString()} hours · ${stats.totalPlays?.toLocaleString()} plays` : ''}
          </motion.div>
        </div>
      ),
    },
  ];
}
