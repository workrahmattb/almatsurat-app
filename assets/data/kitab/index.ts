import kitab001 from './kitab-001.json';
import kitab002 from './kitab-002.json';
import type { Kitab } from '@/types';

export const kitabData: Kitab[] = [kitab001 as Kitab, kitab002 as Kitab];

export function getKitabById(id: string): Kitab | undefined {
  return kitabData.find((k) => k.id === id);
}
