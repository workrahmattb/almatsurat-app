import { getSurahById } from '@/assets/data/quran';
import type { WazifahSection } from '@/assets/data/wazifah';

export interface AyatPair {
  ayat: number;
  arabic: string;
  translation: string;
}

export function getAyatPairs(section: WazifahSection): AyatPair[] {
  const source = section.source || '';

  // Parse "QS NamaSurah X" atau "QS NamaSurah X-Y"
  // Contoh: "QS Al-Baqarah 255", "QS Al-Baqarah 256-257"
  const numMatch = source.match(/\d+(?:-(\d+))?$/);
  if (!numMatch) {
    return [{ ayat: section.section_number, arabic: section.arabic, translation: section.translation }];
  }

  const startAyat = parseInt(numMatch[0].split('-')[0], 10);
  const endAyat = numMatch[1] ? parseInt(numMatch[1], 10) : startAyat;

  // Extract surah name (everything between "QS " and the number at the end)
  const nameMatch = source.match(/QS\s+(.+?)\s+\d+/i);
  const surahName = nameMatch ? nameMatch[1].trim() : section.title;

  // Map nama surah ke ID (yang tersedia di assets/data/quran)
  let surahId = 0;
  if (surahName.toLowerCase().includes('fatihah')) surahId = 1;
  else if (surahName.toLowerCase().includes('baqarah')) surahId = 2;
  else if (surahName.toLowerCase().includes('ikhlas')) surahId = 112;
  else if (surahName.toLowerCase().includes('falaq')) surahId = 113;
  else if (surahName.toLowerCase().includes('naas')) surahId = 114;

  const surah = surahId ? getSurahById(surahId) : undefined;

  if (surah) {
    return surah.ayat
      .filter((a) => a.number >= startAyat && a.number <= endAyat)
      .map((a) => ({
        ayat: a.number,
        arabic: a.arabic,
        translation: a.translation,
      }));
  }

  // Fallback: gunakan data asli
  return [{ ayat: section.section_number, arabic: section.arabic, translation: section.translation }];
}