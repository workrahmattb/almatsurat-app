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
      <View style={[styles.chapterHeader, { backgroundColor: 'rgba(92,58,26,0.92)', borderBottomColor: 'rgba(255,255,255,0.08)', borderBottomWidth: 1 }]}>
        <Text style={styles.kitabTitle}>{kitab.title}</Text>
        <Text style={styles.chapterTitle}>Bab {chapterNumber}: {chapterData.chapter_title}</Text>
        <TouchableOpacity onPress={handleBookmark} style={[styles.bookmarkBtn, { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderRadius: 14 }]}>
          <Text style={styles.bookmarkText}>{bookmarked ? '❤️ Hapus Bookmark' : '🤍 Tandai Bookmark'}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.contentContainer, { backgroundColor: colors.backgroundElement, borderColor: colors.glassBorder, borderWidth: 1, borderRadius: 16, marginHorizontal: Spacing.three, marginTop: Spacing.three, padding: Spacing.four, shadowColor: colors.glassShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 6 }]}>
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
          <TouchableOpacity style={[styles.navButton, { backgroundColor: 'rgba(92,58,26,0.9)', borderColor: 'rgba(245,158,11,0.3)', borderWidth: 1 }]} onPress={() => router.push(`/kitab/${kitab.id}/${chapterNumber + 1}`)}>
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
  kitabTitle: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 4, fontWeight: '500' },
  chapterTitle: { fontSize: 24, color: '#fff', fontWeight: '800', textAlign: 'center', letterSpacing: -0.5 },
  bookmarkBtn: { marginTop: Spacing.two, paddingVertical: 10, paddingHorizontal: 20 },
  bookmarkText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  contentContainer: { paddingHorizontal: Spacing.four, paddingTop: Spacing.three },
  contentText: { textAlign: 'justify' },
  navContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.three, paddingTop: Spacing.four, gap: Spacing.two, paddingBottom: Spacing.four },
  navButton: { flex: 1, paddingVertical: Spacing.two, paddingHorizontal: Spacing.three, borderRadius: 14, alignItems: 'center' },
  navButtonText: { fontSize: 14, fontWeight: '700', letterSpacing: -0.1 },
});