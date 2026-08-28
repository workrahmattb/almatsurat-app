import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Bookmark } from '@/types';

interface BookmarkState {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'created_at'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (
    type: 'ayat' | 'chapter',
    surahId?: number,
    ayatNumber?: number,
    kitabId?: string,
    chapterNumber?: number,
  ) => boolean;
  getBookmarkId: (
    type: 'ayat' | 'chapter',
    surahId?: number,
    ayatNumber?: number,
    kitabId?: string,
    chapterNumber?: number,
  ) => string | null;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (bookmarkData) => {
        const newBookmark: Bookmark = {
          ...bookmarkData,
          id: `bm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          bookmarks: [newBookmark, ...state.bookmarks],
        }));
      },

      removeBookmark: (id) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        }));
      },

      isBookmarked: (type, surahId, ayatNumber, kitabId, chapterNumber) => {
        const { bookmarks } = get();
        if (type === 'ayat') {
          return bookmarks.some(
            (b) =>
              b.type === 'ayat' &&
              b.surah_id === surahId &&
              b.ayat_number === ayatNumber,
          );
        }
        return bookmarks.some(
          (b) =>
            b.type === 'chapter' &&
            b.kitab_id === kitabId &&
            b.chapter_number === chapterNumber,
        );
      },

      getBookmarkId: (type, surahId, ayatNumber, kitabId, chapterNumber) => {
        const { bookmarks } = get();
        if (type === 'ayat') {
          const found = bookmarks.find(
            (b) =>
              b.type === 'ayat' &&
              b.surah_id === surahId &&
              b.ayat_number === ayatNumber,
          );
          return found?.id ?? null;
        }
        const found = bookmarks.find(
          (b) =>
            b.type === 'chapter' &&
            b.kitab_id === kitabId &&
            b.chapter_number === chapterNumber,
        );
        return found?.id ?? null;
      },
    }),
    {
      name: 'bookmarks-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
