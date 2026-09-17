import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { kitabData } from '@/assets/data';
import type { Kitab } from '@/types';

export default function KitabIndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const renderKitab = ({ item }: ListRenderItemInfo<Kitab>) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.backgroundElement }]}
      onPress={() => router.push(`/kitab/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={[styles.cardIcon, { backgroundColor: colors.accentLight }]}>
        <Ionicons name="document-text" size={24} color={colors.accent} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.cardAuthor, { color: colors.textSecondary }]}>{item.author}</Text>
        <Text style={[styles.cardMeta, { color: colors.textTertiary }]}>
          {item.chapters.length} bab
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.four }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Kitab</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Koleksi Buku Islami
        </Text>
      </View>

      <FlatList
        data={kitabData}
        keyExtractor={(item) => item.id}
        renderItem={renderKitab}
        contentContainerStyle={styles.listContent}
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
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.eight,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    borderRadius: Radius.lg,
    marginBottom: Spacing.three,
    ...Shadows.card,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.four,
  },
  cardContent: { flex: 1 },
  cardTitle: { ...Typography.headline },
  cardAuthor: { ...Typography.subhead, marginTop: Spacing.half },
  cardMeta: { ...Typography.caption1, marginTop: Spacing.one },
});
