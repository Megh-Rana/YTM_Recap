import { useMemo } from 'react';
import { useTheme } from '../theme';

export default function WaveChart({ data }) {
  const { p } = useTheme();
  const { path, fill, points, peakHour } = useMemo(() => {
    const W = 800, H = 220;
    const max = Math.max(...data, 1);
    const step = W / (data.length - 1);
    const pts = data.map((v, i) => ({ x: i * step, y: H - (v / max) * (H - 30) - 10 }));
    const d = pts.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const p0 = arr[i - 1];
      return `${acc} C ${p0.x + step / 2} ${p0.y}, ${pt.x - step / 2} ${pt.y}, ${pt.x} ${pt.y}`;
    }, '');
    let peakIdx = 0;
    data.forEach((v, i) => { if (v > data[peakIdx]) peakIdx = i; });
    return { path: d, fill: `${d} L ${W} ${H} L 0 ${H} Z`, points: pts, peakHour: peakIdx };
  }, [data]);

  const peak = points[peakHour];

  return (
    <div style={{ width: '100%' }}>
      <svg viewBox="0 0 800 240" style={{ width: '100%', height: 'auto' }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1F1A2E" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#1F1A2E" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fill} fill="url(#waveFill)" />
        <path d={path} fill="none" stroke="#1F1A2E" strokeWidth="2.5" strokeLinecap="round" />
        {peak && (
          <g>
            <circle cx={peak.x} cy={peak.y} r="14" fill={p.accentDeep} opacity="0.18" />
            <circle cx={peak.x} cy={peak.y} r="6" fill={p.accentDeep} stroke="#fff" strokeWidth="2" />
          </g>
        )}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginTop: 8, paddingInline: 4, letterSpacing: '0.16em', color: '#5A5468', fontWeight: 600 }}>
        {['12AM', '6AM', '12PM', '6PM', '11PM'].map(l => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}
