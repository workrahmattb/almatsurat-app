import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { getKitabById } from '@/assets/data';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
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
        <Text style={{ color: colors.text, fontSize: 17 }}>Kitab tidak ditemukan</Text>
      </View>
    );
  }

  const renderChapter = ({ item }: ListRenderItemInfo<KitabChapter>) => (
    <TouchableOpacity
      style={[styles.chapterCard, { backgroundColor: colors.backgroundElement }]}
      onPress={() => router.push(`/kitab/${kitab.id}/${item.chapter_number}`)}
      activeOpacity={0.7}
    >
      <View style={[styles.chapterNumber, { backgroundColor: colors.accent }]}>
        <Text style={styles.chapterNumberText}>{item.chapter_number}</Text>
      </View>
      <View style={styles.chapterInfo}>
        <Text style={[styles.chapterTitle, { color: colors.text }]}>{item.chapter_title}</Text>
        <Text style={[styles.chapterMeta, { color: colors.textSecondary }]}>Bab {item.chapter_number}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={[styles.container, { backgroundColor: colors.background }]}
      data={kitab.chapters}
      keyExtractor={(item) => String(item.chapter_number)}
      renderItem={renderChapter}
      ListHeaderComponent={
        <View style={[styles.header, { paddingTop: insets.top + Spacing.four }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{kitab.title}</Text>
          <Text style={[styles.headerAuthor, { color: colors.textSecondary }]}>{kitab.author}</Text>
          {kitab.description ? (
            <Text style={[styles.headerDesc, { color: colors.textSecondary }]}>{kitab.description}</Text>
          ) : null}
          <View style={styles.headerMetaContainer}>
            <Ionicons name="document-text" size={14} color={colors.textTertiary} />
            <Text style={[styles.headerMeta, { color: colors.textTertiary }]}>{kitab.chapters.length} bab</Text>
          </View>
        </View>
      }
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.four,
    marginBottom: Spacing.two,
  },
  headerTitle: { ...Typography.title1, textAlign: 'center' },
  headerAuthor: { ...Typography.subhead, marginTop: Spacing.one, textAlign: 'center' },
  headerDesc: { ...Typography.footnote, marginTop: Spacing.two, textAlign: 'center', lineHeight: 18 },
  headerMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
    gap: Spacing.one,
  },
  headerMeta: { ...Typography.caption1, fontWeight: '500' },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.two,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    ...Shadows.card,
  },
  chapterNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.four,
  },
  chapterNumberText: { color: '#fff', ...Typography.headline },
  chapterInfo: { flex: 1 },
  chapterTitle: { ...Typography.headline },
  chapterMeta: { ...Typography.caption1, marginTop: Spacing.half },
});
