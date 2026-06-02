import { motion } from 'motion/react';
import { useTheme } from '../theme';

const sans = { fontFamily: "Rubik, system-ui, sans-serif" };
const PASTEL_INK = '#1F1A2E';
const PASTEL_INK_SOFT = '#5A5468';

const DOMINANT_MESSAGES = {
  energetic:   "You ran on high-octane all year. Music was your fuel.",
  happy:       "Your playlist was basically sunshine in audio form.",
  romantic:    "Love was the soundtrack of your year.",
  melancholic: "You felt it all deeply. The bittersweet hits different.",
  chill:       "You kept it smooth. No rush, just vibes.",
  intense:     "Raw, dark, and unapologetic. You don't do half measures.",
};

export default function MoodCard({ moodData }) {
  const { p } = useTheme();
  if (!moodData) return null;

  const { profile, dominant } = moodData;
  const top = profile.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderRadius: 24, padding: 20, position: 'relative', overflow: 'hidden',
        background: dominant.color + '22',
        border: `1.5px solid ${dominant.color}55`,
        boxShadow: `0 1px 0 ${p.shadow}, 0 14px 36px -14px ${p.shadow}`,
        ...sans,
      }}
    >
      {/* Decorative blob */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: dominant.color, opacity: 0.12, pointerEvents: 'none' }} />

      <div style={{ position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', color: p.inkMute, textTransform: 'uppercase' }}>Your Mood in Music</div>
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 36 }}>{dominant.emoji}</span>
              <div style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 700, letterSpacing: '-0.03em', color: PASTEL_INK }}>
                {dominant.label}
              </div>
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: PASTEL_INK_SOFT, maxWidth: 320, lineHeight: 1.5 }}>
              {DOMINANT_MESSAGES[dominant.id]}
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 'clamp(32px, 6vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', color: dominant.color, lineHeight: 1 }}>
              {dominant.pct}%
            </div>
            <div style={{ fontSize: 11, color: PASTEL_INK_SOFT, marginTop: 2 }}>dominant mood</div>
          </div>
        </div>

        {/* Mood bar */}
        <div style={{ marginTop: 20, display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', gap: 2 }}>
          {top.filter(m => m.pct > 0).map(m => (
            <motion.div
              key={m.id}
              initial={{ width: 0 }}
              animate={{ width: `${m.pct}%` }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              title={`${m.label}: ${m.pct}%`}
              style={{ background: m.color, borderRadius: 999, minWidth: m.pct > 2 ? 4 : 0 }}
            />
          ))}
        </div>

        {/* Mood legend */}
        <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
          {top.filter(m => m.pct > 0).map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: m.id === dominant.id ? 700 : 500, color: m.id === dominant.id ? PASTEL_INK : PASTEL_INK_SOFT }}>
                {m.emoji} {m.label} <span style={{ opacity: 0.7 }}>{m.pct}%</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
