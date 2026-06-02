import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../theme';

export default function ThemeToggle() {
  const { mode, toggle, p } = useTheme();
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        width: 40, height: 40, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: p.card, border: `1px solid ${p.border}25`,
        boxShadow: `0 4px 12px -4px ${p.shadow}`, color: p.ink,
        cursor: 'pointer', overflow: 'hidden', position: 'relative',
      }}
    >
      <motion.div
        key={mode}
        initial={{ y: 16, rotate: -90, opacity: 0 }}
        animate={{ y: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {mode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
      </motion.div>
    </motion.button>
  );
}
