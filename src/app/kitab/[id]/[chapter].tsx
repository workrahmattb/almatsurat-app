import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useBookmarkStore, useProgressStore, useSettingsStore } from '@/stores';
import { getKitabById } from '@/assets/data';

export default function ChapterReaderScreen() {
  const { id, chapter } = useLocalSearchParams<{ id: string; chapter: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const { translationFontSize } = useSettingsStore();
  const { isBookmarked, addBookmark, removeBookmark, getBookmarkId } = useBookmarkStore();
  const updateProgress = useProgressStore((s) => s.updateProgress);

  const kitab = getKitabById(id ?? '');
  const chapterNumber = Number(chapter);
  const chapterData = kitab?.chapters.find((c) => c.chapter_number === chapterNumber);

  useEffect(() => {
    if (kitab && chapterData) {
      navigation.setOptions({ title: chapterData.chapter_title });
      updateProgress({
        type: 'kitab', reference_id: kitab.id, title: kitab.title,
        subtitle: chapterData.chapter_title, chapter_number: chapterNumber,
      });
    }
  }, [kitab, chapterData, chapterNumber, navigation, updateProgress]);

  if (!kitab || !chapterData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text, fontSize: 18 }}>Bab tidak ditemukan</Text>
      </View>
    );
  }

  const bookmarked = isBookmarked('chapter', undefined, undefined, kitab.id, chapterNumber);
  const handleBookmark = () => {
    if (bookmarked) {
      const bookmarkId = getBookmarkId('chapter', undefined, undefined, kitab.id, chapterNumber);
      if (bookmarkId) removeBookmark(bookmarkId);
    } else {
      addBookmark({ type: 'chapter', kitab_id: kitab.id, kitab_title: kitab.title, chapter_number: chapterNumber, chapter_title: chapterData.chapter_title });
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
      <View style={[styles.chapterHeader, { backgroundColor: colors.accent }]}>
        <Text style={styles.kitabTitle}>{kitab.title}</Text>
        <Text style={styles.chapterTitle}>Bab {chapterNumber}: {chapterData.chapter_title}</Text>
        <TouchableOpacity onPress={handleBookmark} style={[styles.bookmarkBtn, { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)', borderWidth: 1, borderRadius: 12 }]}>
          <Text style={styles.bookmarkText}>{bookmarked ? '❤️ Hapus Bookmark' : '🤍 Tandai Bookmark'}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.contentContainer, { backgroundColor: colors.backgroundElement, borderColor: colors.glassBorder, borderWidth: 1, borderRadius: 12, marginHorizontal: Spacing.three, marginTop: Spacing.three, padding: Spacing.four }]}>
        <Text style={[styles.contentText, { color: colors.text, fontSize: translationFontSize, lineHeight: translationFontSize * 1.7 }]}>
          {chapterData.content}
        </Text>
      </View>

      <View style={styles.navContainer}>
        {chapterNumber > 1 && (
          <TouchableOpacity style={[styles.navButton, { backgroundColor: colors.backgroundElement, borderColor: colors.glassBorder, borderWidth: 1 }]} onPress={() => navigation.goBack()}>
            <Text style={[styles.navButtonText, { color: colors.text }]}>← Bab Sebelumnya</Text>
          </TouchableOpacity>
        )}
        {chapterNumber < kitab.chapters.length && (
          <TouchableOpacity style={[styles.navButton, { backgroundColor: colors.primary }]} onPress={() => router.push(`/kitab/${kitab.id}/${chapterNumber + 1}`)}>
            <Text style={[styles.navButtonText, { color: '#fff' }]}>Bab Selanjutnya →</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chapterHeader: { paddingHorizontal: Spacing.four, paddingVertical: Spacing.four, alignItems: 'center' },
  kitabTitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  chapterTitle: { fontSize: 22, color: '#fff', fontWeight: '700', textAlign: 'center' },
  bookmarkBtn: { marginTop: Spacing.two, paddingVertical: 8, paddingHorizontal: 16 },
  bookmarkText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  contentContainer: { paddingHorizontal: Spacing.four, paddingTop: Spacing.three },
  contentText: { textAlign: 'justify' },
  navContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.three, paddingTop: Spacing.four, gap: Spacing.two },
  navButton: { flex: 1, paddingVertical: Spacing.two, paddingHorizontal: Spacing.three, borderRadius: 12, alignItems: 'center' },
  navButtonText: { fontSize: 14, fontWeight: '600' },
});