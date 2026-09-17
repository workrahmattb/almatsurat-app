import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
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
        style={[styles.bookmarkCard, { backgroundColor: colors.backgroundElement }]}
        onPress={() => {
          if (isAyat && item.surah_id) router.push(`/surah/${item.surah_id}`);
        }}
        activeOpacity={0.7}
      >
        <View style={[styles.bookmarkIcon, { backgroundColor: isAyat ? colors.accentLight : colors.accentSecondaryLight }]}>
          <Ionicons
            name={isAyat ? 'book' : 'library'}
            size={22}
            color={isAyat ? colors.accent : colors.accentSecondary}
          />
        </View>
        <View style={styles.bookmarkInfo}>
          <Text style={[styles.bookmarkTitle, { color: colors.text }]}>
            {isAyat ? item.surah_name : item.kitab_title}
          </Text>
          <Text style={[styles.bookmarkSubtitle, { color: colors.textSecondary }]}>
            {isAyat ? `Ayat ${item.ayat_number}` : `Bab ${item.chapter_number}: ${item.chapter_title}`}
          </Text>
          <Text style={[styles.bookmarkDate, { color: colors.textTertiary }]}>
            {new Date(item.created_at).toLocaleDateString('id-ID')}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
      </TouchableOpacity>
    );
  };

  if (bookmarks.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.four }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Favorit</Text>
        </View>
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconContainer, { backgroundColor: colors.backgroundSelected }]}>
            <Ionicons name="heart-outline" size={48} color={colors.textTertiary} />
          </View>
          <Text style={[styles.emptyText, { color: colors.text }]}>Belum ada bookmark</Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Tap icon bookmark pada ayat atau bab untuk menandainya
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.four }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Favorit</Text>
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
  header: {
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.four,
  },
  headerTitle: { ...Typography.largeTitle },
  headerSubtitle: { ...Typography.subhead, marginTop: Spacing.one },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.five,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.five,
  },
  emptyText: { ...Typography.headline, marginBottom: Spacing.two },
  emptySubtext: { ...Typography.subhead, textAlign: 'center', lineHeight: 20 },
  bookmarkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.two,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    ...Shadows.card,
  },
  bookmarkIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.four,
  },
  bookmarkInfo: { flex: 1 },
  bookmarkTitle: { ...Typography.headline },
  bookmarkSubtitle: { ...Typography.subhead, marginTop: Spacing.half },
  bookmarkDate: { ...Typography.caption1, marginTop: Spacing.one },
});
