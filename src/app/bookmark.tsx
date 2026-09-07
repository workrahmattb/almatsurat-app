import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Radius, Shadows, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useBookmarkStore } from '@/stores';
import type { Bookmark } from '@/types';

export default function BookmarkScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];
  const bookmarks = useBookmarkStore((s) => s.bookmarks);

  const renderBookmark = ({ item }: { item: Bookmark }) => {
    const isAyat = item.type === 'ayat';

    return (
      <TouchableOpacity
        style={[styles.bookmarkCard, { backgroundColor: colors.backgroundElement, borderColor: colors.glassBorder, borderWidth: 1 }]}
        onPress={() => {
          if (isAyat && item.surah_id) router.push(`/surah/${item.surah_id}`);
          else if (!isAyat && item.kitab_id) router.push(`/kitab/${item.kitab_id}`);
        }}
      >
        <View style={[styles.bookmarkIcon, { backgroundColor: colors.accent }]}>
          <Text style={styles.bookmarkEmoji}>{isAyat ? '📖' : '📚'}</Text>
        </View>
        <View style={styles.bookmarkInfo}>
          <Text style={[styles.bookmarkTitle, { color: colors.text }]}>
            {isAyat ? item.surah_name : item.kitab_title}
          </Text>
          <Text style={[styles.bookmarkSubtitle, { color: colors.textSecondary }]}>
            {isAyat ? `Ayat ${item.ayat_number}` : `Bab ${item.chapter_number}: ${item.chapter_title}`}
          </Text>
          <Text style={[styles.bookmarkDate, { color: colors.textSecondary }]}>
            {new Date(item.created_at).toLocaleDateString('id-ID')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (bookmarks.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>❤️ Favorit</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📌</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Belum ada bookmark</Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Tap icon bookmark pada ayat atau bab untuk menandainya</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>❤️ Favorit</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>{bookmarks.length} bookmark</Text>
      </View>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        renderItem={renderBookmark}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.four, paddingTop: Spacing.four + 20, paddingBottom: Spacing.three },
  headerTitle: { fontSize: 28, fontWeight: '700' },
  headerSubtitle: { fontSize: 14, marginTop: 2 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.four },
  emptyEmoji: { fontSize: 64, marginBottom: Spacing.three },
  emptyText: { fontSize: 18, fontWeight: '600', marginBottom: Spacing.one },
  emptySubtext: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  bookmarkCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.three, marginBottom: Spacing.one, padding: Spacing.three, borderRadius: Radius.lg, ...Shadows.card },
  bookmarkIcon: { width: 48, height: 48, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.three, ...Shadows.soft },
  bookmarkEmoji: { fontSize: 24 },
  bookmarkInfo: { flex: 1 },
  bookmarkTitle: { fontSize: 16, fontWeight: '700' },
  bookmarkSubtitle: { fontSize: 14, marginTop: 2 },
  bookmarkDate: { fontSize: 11, marginTop: 4 },
});