import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ReadingProgress } from '@/types';

interface ProgressState {
  progress: ReadingProgress[];
  updateProgress: (data: Omit<ReadingProgress, 'id' | 'last_read'>) => void;
  getProgress: (type: 'surah' | 'kitab', referenceId: string) => ReadingProgress | undefined;
  getLatestProgress: () => ReadingProgress | undefined;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: [],

      updateProgress: (data) => {
        const { progress } = get();
        const existing = progress.find(
          (p) => p.type === data.type && p.reference_id === data.reference_id,
        );

        if (existing) {
          set({
            progress: progress.map((p) =>
              p.id === existing.id
                ? { ...p, ...data, last_read: new Date().toISOString() }
                : p,
            ),
          });
        } else {
          const newProgress: ReadingProgress = {
            ...data,
            id: `prog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            last_read: new Date().toISOString(),
          };
          set({ progress: [newProgress, ...progress] });
        }
      },

      getProgress: (type, referenceId) => {
        return get().progress.find(
          (p) => p.type === type && p.reference_id === referenceId,
        );
      },

      getLatestProgress: () => {
        const { progress } = get();
        if (progress.length === 0) return undefined;
        return progress.reduce((latest, current) =>
          new Date(current.last_read) > new Date(latest.last_read)
            ? current
            : latest,
        );
      },
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
