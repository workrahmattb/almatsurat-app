/**
 * Clean White-Green Theme — Solid, No Neon, No Glow
 */

export const Colors = {
  light: {
    text: '#0a2e1d',
    textSecondary: '#4a6b52',
    background: '#f6faf7',
    backgroundElement: '#ffffff',
    backgroundSelected: '#e8f5ee',
    glassBorder: '#d4eadd',
    glassShadow: 'rgba(10,46,29,0.08)',
    primary: '#0d4a2f',
    accent: '#1b7a4e',
    accent2: '#2d9e6a',
    accent3: '#c8e6d8',
    surface: '#ffffff',
  },
  dark: {
    text: '#e8f5ee',
    textSecondary: '#a8cbb5',
    background: '#0a1f14',
    backgroundElement: '#0f2d1c',
    backgroundSelected: '#16442d',
    glassBorder: '#16442d',
    glassShadow: 'rgba(0,0,0,0.35)',
    primary: '#0d4a2f',
    accent: '#2d9e6a',
    accent2: '#4dbf85',
    accent3: '#1b7a4e',
    surface: '#0f2d1c',
  },
} as const;

export const Fonts = { sans: 'system-ui', serif: 'serif', rounded: 'system-ui', mono: 'monospace' };
export const Spacing = { half: 2, one: 4, two: 8, three: 16, four: 24, five: 32, six: 64 } as const;
export const BottomTabInset = 0;
export const MaxContentWidth = 800;
