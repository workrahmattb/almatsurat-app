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
