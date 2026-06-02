import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { UploadCloud, FileArchive, ArrowRight, FileJson } from 'lucide-react';
import { useTheme } from '../theme';
import ThemeToggle from './ThemeToggle';

const sans = { fontFamily: "Rubik, system-ui, sans-serif" };

export default function LandingPage({ onFileSelected, isProcessing, progress }) {
  const { p } = useTheme();
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);
  const elevation = `0 1px 0 ${p.shadow}, 0 14px 36px -14px ${p.shadow}`;

  function handleFiles(files) {
    if (!files || !files[0]) return;
    onFileSelected(files[0]);
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: p.bg, color: p.ink, ...sans }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '20px 40px' }}>
        <div style={{ fontWeight: 700, letterSpacing: '-0.02em', fontSize: 'clamp(15px, 4vw, 20px)' }}>
          Youtube Music Recap
        </div>
        <ThemeToggle />
      </header>

      <main style={{ padding: '0 40px 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}
              style={{
                fontSize: 'clamp(40px, 9vw, 110px)',
                lineHeight: 0.95, fontWeight: 600, letterSpacing: '-0.04em',
                maxWidth: 900, margin: '0 auto',
              }}
            >
              Your year in <span style={{ color: p.accentDeep }}>sound</span>,
              <br />beautifully told.
            </motion.h1>
            <p style={{ marginTop: 24, maxWidth: 500, margin: '24px auto 0', color: p.inkSoft, fontSize: 16, lineHeight: 1.55 }}>
              Drop your Google Takeout file. Watch a year of listening turn into a clean, considered recap — processed entirely in your browser.
            </p>
          </div>

          {/* Drop zone */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => !isProcessing && inputRef.current?.click()}
            whileHover={!isProcessing ? { y: -2 } : {}}
            style={{
              position: 'relative', cursor: isProcessing ? 'default' : 'pointer',
              borderRadius: 28, overflow: 'hidden',
              minHeight: 'clamp(320px, 45vh, 500px)',
              background: drag ? p.mint : p.dropZone,
              border: `1.5px dashed ${drag ? p.accentDeep : p.border + '55'}`,
              boxShadow: drag ? `0 0 0 6px ${p.accentDeep}18, ${elevation}` : elevation,
              transition: 'background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
            }}
          >
            <div style={{ position: 'absolute', top: 20, left: 24, fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', color: p.inkMute }}>DROP ZONE</div>
            <div style={{ position: 'absolute', top: 20, right: 24, fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', color: p.inkMute }}>.ZIP · UP TO 2GB</div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '64px 24px', height: '100%' }}>
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    style={{ width: 80, height: 80, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, background: p.accentDeep, color: '#fff' }}
                  >
                    <UploadCloud size={40} strokeWidth={1.8} />
                  </motion.div>
                  <div style={{ fontSize: 'clamp(20px, 4vw, 36px)', fontWeight: 600, letterSpacing: '-0.03em' }}>Processing your data...</div>
                  <div style={{ marginTop: 12, color: p.inkSoft, fontSize: 15 }}>{progress}</div>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ y: drag ? -8 : 0 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                    style={{ width: 80, height: 80, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, background: p.accentDeep, color: '#fff', boxShadow: `0 10px 28px -10px ${p.accentDeep}88` }}
                  >
                    <UploadCloud size={40} strokeWidth={1.8} />
                  </motion.div>
                  <div style={{ fontSize: 'clamp(24px, 5vw, 56px)', fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05 }}>
                    {drag ? 'Release to upload' : 'Drop your Takeout file'}
                  </div>
                  <div style={{ marginTop: 16, color: p.inkSoft, fontSize: 16 }}>
                    or <span style={{ textDecoration: 'underline', textUnderlineOffset: 4, fontWeight: 600, color: p.ink }}>click to browse</span>
                  </div>
                  <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, padding: '6px 12px', borderRadius: 999, background: p.bg, color: p.inkSoft, border: `1px solid ${p.border}20`, fontWeight: 500 }}>
                    <FileArchive size={14} /> takeout-XXXXXXXX.zip
                  </div>
                </>
              )}
            </div>
            <input ref={inputRef} type="file" accept=".zip,.json" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
          </motion.div>

          {/* Instructions */}
          <div style={{ marginTop: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.22em', color: p.inkMute }}>HOW TO GET YOUR FILE</div>
              <div style={{ flex: 1, height: 1, background: p.border, opacity: 0.15 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {[
                { n: '01', t: 'Visit Google Takeout', d: 'Go to takeout.google.com and sign in.', c: p.pink },
                { n: '02', t: 'Select YouTube & export JSON', d: 'Deselect everything else. Choose JSON as the format — not HTML.', c: p.mint, icon: FileJson },
                { n: '03', t: 'Download & drop', d: 'Export, download the .zip, then drop it above.', c: p.aqua },
              ].map(s => (
                <motion.div key={s.n} whileHover={{ y: -2 }}
                  style={{ borderRadius: 20, padding: 20, background: p.card, border: `1px solid ${p.border}14`, boxShadow: elevation }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: s.c, color: p.ink, fontWeight: 700, letterSpacing: '0.08em' }}>{s.n}</div>
                    {s.icon ? <s.icon size={16} style={{ color: p.accentDeep }} /> : <ArrowRight size={16} style={{ color: p.inkMute }} />}
                  </div>
                  <div style={{ marginTop: 12, fontWeight: 600, letterSpacing: '-0.015em', fontSize: 18 }}>{s.t}</div>
                  <div style={{ marginTop: 4, color: p.inkSoft, fontSize: 14, lineHeight: 1.5 }}>{s.d}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
