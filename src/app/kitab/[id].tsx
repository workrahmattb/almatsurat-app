import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getKitabById } from '@/assets/data';
import { Colors, Radius, Shadows, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProgressStore } from '@/stores';
import type { KitabChapter } from '@/types';

export default function KitabScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const updateProgress = useProgressStore((s) => s.updateProgress);

  const kitab = getKitabById(id ?? '');

  useEffect(() => {
    if (kitab) {
      navigation.setOptions({ title: kitab.title });
      updateProgress({
        type: 'kitab',
        reference_id: kitab.id,
        title: kitab.title,
      });
    }
  }, [kitab, navigation, updateProgress]);

  if (!kitab) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text, fontSize: 18 }}>Kitab tidak ditemukan</Text>
      </View>
    );
  }

  const renderChapter = ({ item }: ListRenderItemInfo<KitabChapter>) => (
    <TouchableOpacity
      style={[
        styles.chapterCard,
        { backgroundColor: colors.backgroundElement, borderColor: colors.glassBorder, borderWidth: 1 },
      ]}
      onPress={() => router.push(`/kitab/${kitab.id}/${item.chapter_number}`)}
    >
      <View style={[styles.chapterNumber, { backgroundColor: colors.accent2 }]}>
        <Text style={styles.chapterNumberText}>{item.chapter_number}</Text>
      </View>
      <View style={styles.chapterInfo}>
        <Text style={[styles.chapterTitle, { color: colors.text }]}>{item.chapter_title}</Text>
        <Text style={[styles.chapterMeta, { color: colors.textSecondary }]}>Bab {item.chapter_number}</Text>
      </View>
      <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={[styles.container, { backgroundColor: colors.background }]}
      data={kitab.chapters}
      keyExtractor={(item) => String(item.chapter_number)}
      renderItem={renderChapter}
      ListHeaderComponent={
        <View style={[styles.header, { backgroundColor: colors.accent }]}>
          <Text style={styles.headerTitle}>{kitab.title}</Text>
          <Text style={styles.headerAuthor}>{kitab.author}</Text>
          {kitab.description ? <Text style={styles.headerDesc}>{kitab.description}</Text> : null}
          <Text style={styles.headerMeta}>{kitab.chapters.length} bab</Text>
        </View>
      }
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', paddingHorizontal: Spacing.four, paddingVertical: Spacing.four, marginBottom: Spacing.two, borderBottomLeftRadius: Radius.xl, borderBottomRightRadius: Radius.xl, ...Shadows.soft },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800', textAlign: 'center' },
  headerAuthor: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4, textAlign: 'center' },
  headerDesc: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 8, textAlign: 'center', lineHeight: 19 },
  headerMeta: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 8, fontWeight: '600' },
  chapterCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.three, marginBottom: Spacing.two, padding: Spacing.three, borderRadius: Radius.lg, ...Shadows.card },
  chapterNumber: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.three },
  chapterNumberText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  chapterInfo: { flex: 1 },
  chapterTitle: { fontSize: 16, fontWeight: '700' },
  chapterMeta: { fontSize: 12, marginTop: 2 },
  chevron: { fontSize: 22, fontWeight: '700', marginLeft: Spacing.two },
});