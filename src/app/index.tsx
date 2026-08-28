import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProgressStore } from '@/stores';
import { quranData, kitabData } from '@/assets/data';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];
  const latestProgress = useProgressStore((s) => s.getLatestProgress());

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.four }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.appName, { color: colors.text }]}>☪️ Al-Ma'tsurat</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Dzikir Pagi & Petang</Text>
        </View>
        <TouchableOpacity
          style={[styles.settingsBtn, { backgroundColor: colors.accent }]}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.settingsIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Continue Reading */}
      {latestProgress && (
        <TouchableOpacity
          style={[styles.continueCard, { backgroundColor: colors.accent, borderLeftColor: colors.accent2 }]}
          onPress={() => {
            if (latestProgress.type === 'surah') router.push(`/surah/${latestProgress.reference_id}`);
            else router.push(`/kitab/${latestProgress.reference_id}`);
          }}
        >
          <Text style={styles.continueLabel}>📖 Lanjutkan Membaca</Text>
          <Text style={styles.continueTitle}>{latestProgress.title}</Text>
          {latestProgress.subtitle && (
            <Text style={styles.continueSubtitle}>{latestProgress.subtitle}</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Main Menu */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.menuCard, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/wazifah-sugro')}
        >
          <Text style={styles.menuEmoji}>📖</Text>
          <Text style={styles.menuTitle}>Wazifah Sugro</Text>
          <Text style={styles.menuDesc}>Dzikir ringkas untuk kesibukan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuCard, { backgroundColor: colors.accent }]}
          onPress={() => router.push('/wazifah-kubro')}
        >
          <Text style={styles.menuEmoji}>📚</Text>
          <Text style={styles.menuTitle}>Wazifah Kubro</Text>
          <Text style={styles.menuDesc}>Dzikir lengkap untuk ibadah optimal</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={[styles.statsContainer, { backgroundColor: colors.backgroundElement, borderColor: colors.glassBorder, borderWidth: 1 }]}>
        <Text style={[styles.statsTitle, { color: colors.text }]}>📊 Statistik</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>{quranData.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Surah</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.glassBorder }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{kitabData.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Kitab</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.glassBorder }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.accent2 }]}>100%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Offline</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.four, paddingBottom: Spacing.three },
  headerLeft: { flex: 1 },
  appName: { fontSize: 30, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4 },
  settingsBtn: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  settingsIcon: { fontSize: 20, color: '#fff', fontWeight: '700' },
  continueCard: { marginHorizontal: Spacing.three, marginBottom: Spacing.three, padding: Spacing.three, borderRadius: 12, borderLeftWidth: 4 },
  continueLabel: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', marginBottom: 4 },
  continueTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  continueSubtitle: { fontSize: 13, marginTop: 4, color: 'rgba(255,255,255,0.7)' },
  menuContainer: { paddingHorizontal: Spacing.three, gap: Spacing.two, marginBottom: Spacing.three },
  menuCard: { padding: Spacing.four, borderRadius: 14, alignItems: 'center' },
  menuEmoji: { fontSize: 40, marginBottom: Spacing.two },
  menuTitle: { color: '#fff', fontSize: 19, fontWeight: '700' },
  menuDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },
  statsContainer: { marginHorizontal: Spacing.three, padding: Spacing.three, borderRadius: 12 },
  statsTitle: { fontSize: 15, fontWeight: '700', marginBottom: Spacing.two },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: 32, borderRadius: 1 },
  statNumber: { fontSize: 24, fontWeight: '700' },
  statLabel: { fontSize: 12, marginTop: 4 },
});