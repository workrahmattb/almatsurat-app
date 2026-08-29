import { getSurahById } from '@/assets/data/quran';
import type { WazifahSection } from '@/assets/data/wazifah';

export interface AyatPair {
  ayat: number;
  arabic: string;
  translation: string;
}

/**
 * Adapter to get ayat pairs from wazifah section.
 * Returns array if section has ayatPairs or is Quranic (split by ۝).
 * Returns empty array for non-Quran sections so UI hides "Ayat" label.
 */
export function getAyatPairs(section: WazifahSection): AyatPair[] {
  // 1. Explicit manual pairs (most control)
  if (section.ayatPairs && section.ayatPairs.length > 0) {
    return section.ayatPairs;
  }

  const source = section.source || '';

  // 2. Quranic source: split by ۝
  if (source.startsWith('QS')) {
    const arabicParts = section.arabic.split('۝').map(p => p.trim()).filter(p => p.length > 0);
    const translationParts = section.translation.split('۝').map(p => p.trim()).filter(p => p.length > 0);
    if (arabicParts.length > 0 && arabicParts.length === translationParts.length) {
      return arabicParts.map((arabic, i) => ({
        ayat: i + 1,
        arabic,
        translation: translationParts[i],
      }));
    }
    // Partial split: use arabic split at least
    if (arabicParts.length > 1) {
      return arabicParts.map((arabic, i) => ({
        ayat: i + 1, arabic, translation: '' }));
    }
  }

  // 3. Non-Quran (Doa, Sunnah, etc.): return empty so UI hides label
  return [];
}