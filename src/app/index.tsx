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
      {/* Hero Header */}
      <View style={[styles.hero, { paddingTop: insets.top + Spacing.five }]}>
        <View style={styles.heroInner}>
          <Text style={[styles.appName, { color: colors.text, textShadowColor: colors.accent, shadowOpacity: 0.35 }]}>Al-Ma'tsurat</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Dzikir Pagi & Petang</Text>
          <Text style={[styles.tagline, { color: colors.accent }]}>✨ Futuristic • Solid • Elegant</Text>
        </View>
        <TouchableOpacity style={[styles.settingsBtn, { backgroundColor: colors.backgroundElement, borderColor: colors.glassBorder, borderWidth: 1 }]} onPress={() => router.push('/settings')}>
          <Text style={[styles.settingsIcon, { color: colors.text }]}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Continue Reading Card */}
      {latestProgress && (
        <TouchableOpacity
          style={[styles.continueCard, { backgroundColor: colors.backgroundElement, borderColor: colors.glassBorder, borderWidth: 1 }]}
          onPress={() => {
            if (latestProgress.type === 'surah') router.push(`/surah/${latestProgress.reference_id}`);
            else router.push(`/kitab/${latestProgress.reference_id}`);
          }}
        >
          <View style={styles.continueTop}>
            <Text style={[styles.continueLabel, { color: colors.accent }]}>✦ Lanjutkan Membaca</Text>
          </View>
          <Text style={[styles.continueTitle, { color: colors.text }]}>{latestProgress.title}</Text>
          {latestProgress.subtitle && (
            <Text style={[styles.continueSubtitle, { color: colors.textSecondary }]}>{latestProgress.subtitle}</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Main Menu */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.menuCard, { backgroundColor: 'rgba(26,92,46,0.9)', borderColor: 'rgba(38,197,255,0.25)', borderWidth: 1 }]}
          onPress={() => router.push('/wazifah-sugro')}
        >
          <Text style={styles.menuEmoji}>📖</Text>
          <Text style={styles.menuTitle}>Wazifah Sugro</Text>
          <Text style={styles.menuDesc}>Dzikir ringkas untuk kesibukan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuCard, { backgroundColor: 'rgba(92,58,26,0.9)', borderColor: 'rgba(245,158,11,0.25)', borderWidth: 1 }]}
          onPress={() => router.push('/wazifah-kubro')}
        >
          <Text style={styles.menuEmoji}>📚</Text>
          <Text style={styles.menuTitle}>Wazifah Kubro</Text>
          <Text style={styles.menuDesc}>Dzikir lengkap untuk ibadah optimal</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={[styles.statsContainer, { backgroundColor: colors.backgroundElement, borderColor: colors.glassBorder, borderWidth: 1 }]}>
        <Text style={[styles.statsTitle, { color: colors.text }]}>✦ Statistik</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.accent2 }]}>{quranData.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Surah</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.accent3 }]}>{kitabData.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Kitab</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>{'100%'}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Offline</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: Spacing.four, paddingBottom: Spacing.four },
  heroInner: { flex: 1 },
  appName: { fontSize: 36, fontWeight: '800', letterSpacing: -1, textShadowRadius: 12 },
  subtitle: { fontSize: 16, marginTop: 6, opacity: 0.85 },
  tagline: { fontSize: 13, marginTop: 4, fontWeight: '600', letterSpacing: 0.5 },
  settingsBtn: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  settingsIcon: { fontSize: 22, fontWeight: '700' },
  continueCard: { marginHorizontal: Spacing.three, marginBottom: Spacing.three, padding: Spacing.three, borderRadius: 16 },
  continueTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  continueLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  continueTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  continueSubtitle: { fontSize: 14, marginTop: 4, opacity: 0.7 },
  menuContainer: { paddingHorizontal: Spacing.three, gap: Spacing.two, marginBottom: Spacing.three },
  menuCard: { padding: Spacing.four, borderRadius: 18, alignItems: 'center', borderTopWidth: 1 },
  menuEmoji: { fontSize: 44, marginBottom: Spacing.two },
  menuTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  menuDesc: { color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 6 },
  statsContainer: { marginHorizontal: Spacing.three, padding: Spacing.three, borderRadius: 16 },
  statsTitle: { fontSize: 16, fontWeight: '800', marginBottom: Spacing.two, letterSpacing: 0.3 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: '800', letterSpacing: -1 },
  statLabel: { fontSize: 12, marginTop: 4, opacity: 0.8 },
});
