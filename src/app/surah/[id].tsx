import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { getSurahById } from '@/assets/data';
import { Colors, Radius, Shadows, Spacing, Typography, type ThemePalette } from '@/constants/theme';
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
        <Text style={{ color: colors.text, fontSize: 17 }}>Surah tidak ditemukan</Text>
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
        <View style={[styles.header, { paddingTop: insets.top + Spacing.four }]}>
          <Text style={[styles.headerArabic, { color: colors.text }]}>{surah.name_arabic}</Text>
          <Text style={[styles.headerLatin, { color: colors.text }]}>{surah.name_latin}</Text>
          <View style={styles.headerMetaContainer}>
            <Text style={[styles.headerMeta, { color: colors.textSecondary }]}>
              {surah.translation_id}
            </Text>
            <View style={[styles.metaDot, { backgroundColor: colors.separator }]} />
            <Text style={[styles.headerMeta, { color: colors.textSecondary }]}>
              {surah.total_ayat} ayat
            </Text>
          </View>
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
    <View style={[styles.ayatCard, { backgroundColor: colors.backgroundElement }]}>
      <View style={styles.ayatHeader}>
        <View style={[styles.ayatNumberBadge, { backgroundColor: colors.accentLight }]}>
          <Text style={[styles.ayatNumberText, { color: colors.accent }]}>{ayat.number}</Text>
        </View>
        <TouchableOpacity onPress={handleBookmark} hitSlop={8} style={styles.bookmarkBtn}>
          <Ionicons
            name={isBookmarked ? 'heart' : 'heart-outline'}
            size={22}
            color={isBookmarked ? colors.bookmark : colors.textTertiary}
          />
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
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.five,
    marginBottom: Spacing.three,
  },
  headerArabic: {
    fontFamily: 'KFGQPC-Uthmanic-HAFS',
    fontSize: 40,
    textAlign: 'center',
    marginBottom: Spacing.three,
  },
  headerLatin: { ...Typography.title1, textAlign: 'center' },
  headerMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.two,
    gap: Spacing.two,
  },
  headerMeta: { ...Typography.subhead },
  metaDot: { width: 4, height: 4, borderRadius: 2 },
  ayatCard: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.three,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    ...Shadows.card,
  },
  ayatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  ayatNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ayatNumberText: { ...Typography.subhead, fontWeight: '700' },
  bookmarkBtn: { padding: Spacing.one },
  arabicText: {
    textAlign: 'right',
    fontFamily: 'KFGQPC-Uthmanic-HAFS',
    marginBottom: Spacing.three,
  },
  translationText: { ...Typography.subhead },
});
