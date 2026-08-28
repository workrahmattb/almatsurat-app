import surah1 from './surah-1.json';
import surah2 from './surah-2.json';
import surah112 from './surah-112.json';
import surah113 from './surah-113.json';
import surah114 from './surah-114.json';
import type { Surah } from '@/types';

export const quranData: Surah[] = [
  surah1 as Surah,
  surah2 as Surah,
  surah112 as Surah,
  surah113 as Surah,
  surah114 as Surah,
];

export function getSurahById(id: number): Surah | undefined {
  return quranData.find((s) => s.id === id);
}
