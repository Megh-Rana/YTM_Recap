import { createContext, useContext } from 'react';

export const lightPalette = {
  bg: 'hsl(57, 95%, 89%)',
  bgAlt: 'hsl(55, 88%, 84%)',
  ink: '#1F1A2E',
  inkSoft: '#5A5468',
  inkMute: '#8C8898',
  card: '#FFFFFF',
  border: '#1F1A2E',
  shadow: 'rgba(31,26,46,0.10)',
  pink: '#FFCFDF',
  cream: 'hsl(57, 95%, 89%)',
  mint: '#E0F9B5',
  aqua: '#A5DEE5',
  accentDeep: '#E94B7B',
  ink2: '#1F1A2E',
  dropZone: '#FFF1F5',
};

export const darkPalette = {
  bg: '#1A1726',
  bgAlt: '#22203A',
  ink: '#FEFDCA',
  inkSoft: '#B8B4A0',
  inkMute: '#75716A',
  card: '#262338',
  border: '#3A3650',
  shadow: 'rgba(0,0,0,0.45)',
  pink: '#FF8FB5',
  cream: '#FEFDCA',
  mint: '#B8E883',
  aqua: '#7CC9D4',
  accentDeep: '#FF6B9D',
  ink2: '#0F0D1A',
  dropZone: '#2E2440',
};

export const ThemeContext = createContext({
  mode: 'light',
  toggle: () => {},
  p: lightPalette,
});

export const useTheme = () => useContext(ThemeContext);
