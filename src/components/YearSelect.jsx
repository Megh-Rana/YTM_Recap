import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../theme';

const sans = { fontFamily: "Rubik, system-ui, sans-serif" };

export default function YearSelect({ value, onChange, options }) {
  const { p } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 14px', borderRadius: 999,
          background: p.card, border: `1px solid ${p.border}18`,
          color: p.ink, ...sans, fontSize: 13, fontWeight: 500,
          boxShadow: `0 4px 12px -6px ${p.shadow}`, cursor: 'pointer',
        }}
      >
        <span style={{ color: p.inkMute, fontSize: 11, letterSpacing: '0.12em', fontWeight: 500 }}>RANGE</span>
        <span style={{ fontWeight: 600 }}>{value}</span>
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            style={{
              position: 'absolute', left: 0, marginTop: 8,
              borderRadius: 16, overflow: 'hidden', zIndex: 30, minWidth: 180,
              background: p.card, border: `1px solid ${p.border}18`,
              boxShadow: `0 20px 50px -12px ${p.shadow}`,
            }}
          >
            {options.map(o => {
              const active = o === value;
              return (
                <button key={o}
                  onClick={() => { onChange(o); setOpen(false); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', padding: '10px 16px',
                    background: active ? p.bg : 'transparent', color: p.ink,
                    ...sans, fontSize: 14, fontWeight: active ? 600 : 500,
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  {o}
                  {active && <Check size={14} style={{ color: p.accentDeep }} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
