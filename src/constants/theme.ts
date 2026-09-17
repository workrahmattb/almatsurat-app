/**
 * Al-Ma'tsurat Theme — Digital Mushaf Design System
 * Warm cream backgrounds, deep emerald accents, elegant Islamic aesthetic
 */

export const Colors = {
  light: {
    text: '#1C1C1E',
    textSecondary: '#636366',
    textTertiary: '#8E8E93',
    background: '#FAFAF5',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#F2F2F7',
    backgroundSecondary: '#F5F5F0',
    accent: '#0A7B4F',
    accentLight: '#E8F5EE',
    accentSecondary: '#C9A96E',
    accentSecondaryLight: '#FDF8F0',
    separator: '#E5E5EA',
    separatorOpaque: '#C6C6C8',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    bookmark: '#FF3B30',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
  },
  dark: {
    text: '#F2F2F7',
    textSecondary: '#AEAEB2',
    textTertiary: '#636366',
    background: '#1C1C1E',
    backgroundElement: '#2C2C2E',
    backgroundSelected: '#3A3A3C',
    backgroundSecondary: '#232324',
    accent: '#34C759',
    accentLight: '#1A3D2A',
    accentSecondary: '#D4A84B',
    accentSecondaryLight: '#2D2418',
    separator: '#38383A',
    separatorOpaque: '#48484A',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    bookmark: '#FF453A',
    surface: '#2C2C2E',
    surfaceElevated: '#3A3A3C',
  },
} as const;

export type ThemePalette = (typeof Colors)[keyof typeof Colors];

/** Rounded corner presets — modern, soft look */
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

/** Cross-platform shadow presets (iOS shadow* + Android elevation) */
export const Shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;

export const Fonts = {
  sans: 'system-ui',
  serif: 'serif',
  rounded: 'system-ui',
  mono: 'monospace',
  arabic: 'KFGQPC-Uthmanic-HAFS',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  eight: 32,
  ten: 40,
  twelve: 48,
} as const;

export const Typography = {
  largeTitle: { fontSize: 34, fontWeight: '700' as const },
  title1: { fontSize: 28, fontWeight: '700' as const },
  title2: { fontSize: 22, fontWeight: '700' as const },
  title3: { fontSize: 20, fontWeight: '600' as const },
  headline: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 17, fontWeight: '400' as const },
  callout: { fontSize: 16, fontWeight: '400' as const },
  subhead: { fontSize: 15, fontWeight: '400' as const },
  footnote: { fontSize: 13, fontWeight: '400' as const },
  caption1: { fontSize: 12, fontWeight: '400' as const },
  caption2: { fontSize: 11, fontWeight: '400' as const },
} as const;

export const BottomTabInset = 0;
export const MaxContentWidth = 800;
