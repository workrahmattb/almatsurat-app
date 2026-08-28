// === Quran Types ===
export interface Ayat {
  number: number;
  arabic: string;
  translation: string;
}

export interface Surah {
  id: number;
  name_arabic: string;
  name_latin: string;
  translation_id: string;
  total_ayat: number;
  ayat: Ayat[];
}

// === Kitab Types ===
export interface KitabChapter {
  chapter_number: number;
  chapter_title: string;
  content: string;
}

export interface Kitab {
  id: string;
  title: string;
  author: string;
  description?: string;
  chapters: KitabChapter[];
}

// === Wazifah Types (Al-Ma'tsurat) ===
export interface WazifahSection {
  section_number: number;
  title: string;
  arabic: string;
  translation: string;
  repetition: number;
  source: string;
}

export interface Wazifah {
  id: string;
  title: string;
  description: string;
  sections: WazifahSection[];
}

// === Bookmark Types ===
export type BookmarkType = 'ayat' | 'chapter' | 'wazifah';

export interface Bookmark {
  id: string;
  type: BookmarkType;
  // For ayat bookmark
  surah_id?: number;
  surah_name?: string;
  ayat_number?: number;
  // For chapter bookmark
  kitab_id?: string;
  kitab_title?: string;
  chapter_number?: number;
  chapter_title?: string;
  // For wazifah bookmark
  wazifah_id?: string;
  wazifah_title?: string;
  section_number?: number;
  section_title?: string;
  created_at: string;
}

// === Reading Progress Types ===
export interface ReadingProgress {
  id: string;
  type: 'surah' | 'kitab' | 'wazifah';
  reference_id: string; // surah id or kitab id or wazifah id
  title: string;
  subtitle?: string;
  chapter_number?: number; // for kitab
  ayat_number?: number; // for surah
  section_number?: number; // for wazifah
  last_read: string;
}
