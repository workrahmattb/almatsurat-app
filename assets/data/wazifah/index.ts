import sugro from './sugro.json';
import kubro from './kubro.json';

export interface WazifahSection {
  section_number: number;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  repetition: number;
  source: string;
  header_bismillah?: boolean; // Tampilkan Bismillah di header card (hanya untuk beberapa section tertentu)
  ayatPairs?: { ayat: number; arabic: string; translation: string }[]; // Per-ayat pairs (opsional, untuk surat Al-Quran)
}

export interface Wazifah {
  id: string;
  title: string;
  description: string;
  sections: WazifahSection[];
}

export const wazifahSugro: Wazifah = sugro as Wazifah;
export const wazifahKubro: Wazifah = kubro as Wazifah;

export function getWazifahById(id: 'sugro' | 'kubro'): Wazifah {
  return id === 'sugro' ? wazifahSugro : wazifahKubro;
}
