import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
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
        type: 'kitab',
        reference_id: kitab.id,
        title: kitab.title,
        subtitle: chapterData.chapter_title,
        chapter_number: chapterNumber,
      });
    }
  }, [kitab, chapterData, chapterNumber, navigation, updateProgress]);

  if (!kitab || !chapterData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text, fontSize: 17 }}>Bab tidak ditemukan</Text>
      </View>
    );
  }

  const bookmarked = isBookmarked('chapter', undefined, undefined, kitab.id, chapterNumber);
  const handleBookmark = () => {
    if (bookmarked) {
      const bookmarkId = getBookmarkId('chapter', undefined, undefined, kitab.id, chapterNumber);
      if (bookmarkId) removeBookmark(bookmarkId);
    } else {
      addBookmark({
        type: 'chapter',
        kitab_id: kitab.id,
        kitab_title: kitab.title,
        chapter_number: chapterNumber,
        chapter_title: chapterData.chapter_title,
      });
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
    >
      <View style={[styles.chapterHeader, { paddingTop: insets.top + Spacing.four }]}>
        <Text style={[styles.kitabTitle, { color: colors.textSecondary }]}>{kitab.title}</Text>
        <Text style={[styles.chapterTitle, { color: colors.text }]}>Bab {chapterNumber}: {chapterData.chapter_title}</Text>

        <TouchableOpacity
          onPress={handleBookmark}
          style={[styles.bookmarkBtn, { backgroundColor: bookmarked ? colors.accentLight : colors.backgroundSelected }]}
          activeOpacity={0.7}
        >
          <Ionicons
            name={bookmarked ? 'heart' : 'heart-outline'}
            size={18}
            color={bookmarked ? colors.bookmark : colors.textSecondary}
          />
          <Text style={[styles.bookmarkText, { color: bookmarked ? colors.bookmark : colors.textSecondary }]}>
            {bookmarked ? 'Hapus Bookmark' : 'Tandai Bookmark'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.contentContainer, { backgroundColor: colors.backgroundElement }]}>
        <Text style={[styles.contentText, { color: colors.text, fontSize: translationFontSize, lineHeight: translationFontSize * 1.7 }]}>
          {chapterData.content}
        </Text>
      </View>

      <View style={styles.navContainer}>
        {chapterNumber > 1 && (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: colors.backgroundElement }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={18} color={colors.text} />
            <Text style={[styles.navButtonText, { color: colors.text }]}>Sebelumnya</Text>
          </TouchableOpacity>
        )}
        {chapterNumber < kitab.chapters.length && (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: colors.accent }]}
            onPress={() => router.push(`/kitab/${kitab.id}/${chapterNumber + 1}`)}
            activeOpacity={0.7}
          >
            <Text style={[styles.navButtonText, { color: '#fff' }]}>Selanjutnya</Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chapterHeader: {
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.five,
    alignItems: 'center',
  },
  kitabTitle: { ...Typography.subhead, marginBottom: Spacing.one },
  chapterTitle: { ...Typography.title2, textAlign: 'center' },
  bookmarkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.pill,
    gap: Spacing.two,
  },
  bookmarkText: { ...Typography.subhead, fontWeight: '500' },
  contentContainer: {
    marginHorizontal: Spacing.four,
    marginTop: Spacing.three,
    padding: Spacing.five,
    borderRadius: Radius.lg,
    ...Shadows.card,
  },
  contentText: { textAlign: 'justify' },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    gap: Spacing.three,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.md,
    gap: Spacing.one,
    ...Shadows.soft,
  },
  navButtonText: { ...Typography.subhead, fontWeight: '600' },
});
