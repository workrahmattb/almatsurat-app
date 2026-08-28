/**
 * Futuristic Glassmorphism Theme
 * Deep dark gradients + soft neon glows + glass surfaces
 */
import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0f0f17',
    textSecondary: '#6b6b7b',
    background: '#f0f2fa',
    backgroundElement: 'rgba(255,255,255,0.55)',
    backgroundSelected: 'rgba(255,255,255,0.85)',
    glassBorder: 'rgba(255,255,255,0.45)',
    glassShadow: 'rgba(15,15,23,0.08)',
    primary: '#111827',
    accent: '#9333ea',
    accent2: '#0ea5e9',
    accent3: '#f59e0b',
    surface: '#ffffff',
  },
  dark: {
    text: '#f1f1f7',
    textSecondary: '#9ca3af',
    background: '#06080f',
    backgroundElement: 'rgba(255,255,255,0.05)',
    backgroundSelected: 'rgba(255,255,255,0.12)',
    glassBorder: 'rgba(255,255,255,0.10)',
    glassShadow: 'rgba(0,0,0,0.50)',
    primary: '#111827',
    accent: '#9333ea',
    accent2: '#0ea5e9',
    accent3: '#f59e0b',
    surface: '#0f1118',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: { sans: 'var(--font-display)', serif: 'var(--font-serif)', rounded: 'var(--font-rounded)', mono: 'var(--font-mono)' },
});

export const Spacing = { half: 2, one: 4, two: 8, three: 16, four: 24, five: 32, six: 64 } as const;
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
