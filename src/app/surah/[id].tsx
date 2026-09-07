import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getSurahById } from '@/assets/data';
import { Colors, Radius, Shadows, Spacing, type ThemePalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useBookmarkStore, useProgressStore, useSettingsStore } from '@/stores';
import type { Ayat, Surah } from '@/types';

export default function SurahReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const { arabicFontSize, translationFontSize } = useSettingsStore();
  const updateProgress = useProgressStore((s) => s.updateProgress);

  const surah = getSurahById(Number(id));

  useEffect(() => {
    if (surah) {
      navigation.setOptions({ title: surah.name_latin });
      updateProgress({
        type: 'surah',
        reference_id: String(surah.id),
        title: surah.name_latin,
      });
    }
  }, [surah, navigation, updateProgress]);

  if (!surah) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text, fontSize: 18 }}>Surah tidak ditemukan</Text>
      </View>
    );
  }

  const renderAyat = ({ item }: ListRenderItemInfo<Ayat>) => (
    <AyatRow
      surah={surah}
      ayat={item}
      colors={colors}
      arabicFontSize={arabicFontSize}
      translationFontSize={translationFontSize}
    />
  );

  return (
    <FlatList
      style={[styles.container, { backgroundColor: colors.background }]}
      data={surah.ayat}
      keyExtractor={(item) => String(item.number)}
      renderItem={renderAyat}
      ListHeaderComponent={
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <Text style={styles.headerArabic}>{surah.name_arabic}</Text>
          <Text style={styles.headerLatin}>{surah.name_latin}</Text>
          <Text style={styles.headerMeta}>
            {surah.translation_id} • {surah.total_ayat} ayat
          </Text>
        </View>
      }
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

function AyatRow({
  surah,
  ayat,
  colors,
  arabicFontSize,
  translationFontSize,
}: {
  surah: Surah;
  ayat: Ayat;
  colors: ThemePalette;
  arabicFontSize: number;
  translationFontSize: number;
}) {
  const isBookmarked = useBookmarkStore((s) => s.isBookmarked('ayat', surah.id, ayat.number));
  const addBookmark = useBookmarkStore((s) => s.addBookmark);
  const removeBookmark = useBookmarkStore((s) => s.removeBookmark);
  const getBookmarkId = useBookmarkStore((s) => s.getBookmarkId);

  const handleBookmark = () => {
    if (isBookmarked) {
      const bookmarkId = getBookmarkId('ayat', surah.id, ayat.number);
      if (bookmarkId) removeBookmark(bookmarkId);
    } else {
      addBookmark({
        type: 'ayat',
        surah_id: surah.id,
        surah_name: surah.name_latin,
        ayat_number: ayat.number,
      });
    }
  };

  return (
    <View
      style={[
        styles.ayatCard,
        { backgroundColor: colors.backgroundElement, borderColor: colors.glassBorder, borderWidth: 1 },
      ]}
    >
      <View style={styles.ayatHeader}>
        <View style={[styles.ayatNumberBadge, { backgroundColor: colors.accent3 }]}>
          <Text style={[styles.ayatNumberText, { color: colors.accent }]}>{ayat.number}</Text>
        </View>
        <TouchableOpacity onPress={handleBookmark} hitSlop={8} style={styles.bookmarkBtn}>
          <Text style={styles.bookmarkIcon}>{isBookmarked ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.arabicText,
          { color: colors.text, fontSize: arabicFontSize, lineHeight: arabicFontSize * 1.9 },
        ]}
      >
        {ayat.arabic}
      </Text>

      <Text
        style={[
          styles.translationText,
          {
            color: colors.textSecondary,
            fontSize: translationFontSize,
            lineHeight: translationFontSize * 1.7,
          },
        ]}
      >
        {ayat.translation}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', paddingHorizontal: Spacing.four, paddingVertical: Spacing.four, marginBottom: Spacing.two, borderBottomLeftRadius: Radius.xl, borderBottomRightRadius: Radius.xl, ...Shadows.soft },
  headerArabic: { color: '#fff', fontFamily: 'KFGQPC-Uthmanic-HAFS', fontSize: 38, textAlign: 'center', marginBottom: Spacing.two },
  headerLatin: { color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  headerMeta: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4, textAlign: 'center' },
  ayatCard: { marginHorizontal: Spacing.three, marginBottom: Spacing.two, padding: Spacing.three, borderRadius: Radius.lg, ...Shadows.card },
  ayatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.two },
  ayatNumberBadge: { minWidth: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.one },
  ayatNumberText: { fontSize: 13, fontWeight: '800' },
  bookmarkBtn: { padding: 4 },
  bookmarkIcon: { fontSize: 18 },
  arabicText: { textAlign: 'right', fontFamily: 'KFGQPC-Uthmanic-HAFS', fontWeight: '600', marginBottom: Spacing.one },
  translationText: { fontWeight: '500' },
});