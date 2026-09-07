import { useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Radius, Shadows, Spacing } from '@/constants/theme';
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
            else if (latestProgress.type === 'kitab') router.push(`/kitab/${latestProgress.reference_id}`);
            else if (latestProgress.type === 'wazifah') {
              const route = latestProgress.wazifah_type === 'kubro' ? '/wazifah-kubro' : '/wazifah-sugro';
              router.push({ pathname: route, params: { scrollToSection: latestProgress.section_number } });
            }
          }}
        >
          <Text style={styles.continueLabel}>📖 Lanjutkan Membaca</Text>
          <Text style={styles.continueTitle}>{latestProgress.title}</Text>
          {latestProgress.section_title && (
            <Text style={styles.continueSubtitle}>{latestProgress.section_title}</Text>
          )}
          {latestProgress.subtitle && (
            <Text style={styles.continueSubtitle}>{latestProgress.subtitle}</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Main Menu */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.menuCard, { backgroundColor: colors.accent2 }]}
          onPress={() => router.push('/wazifah-sugro')}
        >
          <Text style={styles.menuEmoji}>📖</Text>
          <Text style={styles.menuTitle}>Wazifah Sugro</Text>
          <Text style={styles.menuDesc}>Dzikir ringkas untuk kesibukan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuCard, { backgroundColor: colors.accent2 }]}
          onPress={() => router.push('/wazifah-kubro')}
        >
          <Text style={styles.menuEmoji}>📚</Text>
          <Text style={styles.menuTitle}>Wazifah Kubro</Text>
          <Text style={styles.menuDesc}>Dzikir lengkap untuk ibadah optimal</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Donasi Button */}
      <TouchableOpacity
        style={[styles.donasiBtn, { backgroundColor: colors.accent }]}
        activeOpacity={0.85}
        onPress={() => Linking.openURL('https://saweria.co/rahmattb')}
      >
        <Text style={styles.donasiText}>Donasi untuk Pengembangan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.four, paddingBottom: Spacing.three },
  headerLeft: { flex: 1 },
  appName: { fontSize: 30, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4 },
  settingsBtn: { width: 44, height: 44, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center', marginTop: 4, ...Shadows.soft },
  settingsIcon: { fontSize: 20, color: '#fff', fontWeight: '700' },
  continueCard: { marginHorizontal: Spacing.three, marginBottom: Spacing.three, padding: Spacing.four, borderRadius: Radius.lg, borderLeftWidth: 4, ...Shadows.elevated },
  continueLabel: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', marginBottom: 4 },
  continueTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  continueSubtitle: { fontSize: 13, marginTop: 4, color: 'rgba(255,255,255,0.7)' },
  menuContainer: { flexDirection: 'row', paddingHorizontal: Spacing.three, gap: Spacing.two, marginBottom: Spacing.three },
  menuCard: {
    flex: 1,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    alignItems: 'center',
    ...Shadows.card,
  },
  menuEmoji: { fontSize: 40, marginBottom: Spacing.two },
  menuTitle: { color: '#fff', fontSize: 19, fontWeight: '700', textAlign: 'center' },
  menuDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4, textAlign: 'center' },
  donasiBtn: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Radius.pill,
    ...Shadows.elevated,
  },
  donasiText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
