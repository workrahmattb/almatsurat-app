import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProgressStore } from '@/stores';

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
      <View style={[styles.header, { paddingTop: insets.top + Spacing.four }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.appName, { color: colors.text }]}>Al-Ma'tsurat</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Dzikir Pagi & Petang</Text>
        </View>
        <TouchableOpacity
          style={[styles.settingsBtn, { backgroundColor: colors.backgroundElement }]}
          onPress={() => router.push('/settings')}
          activeOpacity={0.7}
        >
          <Ionicons name="settings" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {latestProgress && (
        <TouchableOpacity
          style={[styles.continueCard, { backgroundColor: colors.backgroundElement }]}
          onPress={() => {
            if (latestProgress.type === 'surah') router.push(`/surah/${latestProgress.reference_id}`);
            else if (latestProgress.type === 'wazifah') {
              const route = latestProgress.wazifah_type === 'kubro' ? '/wazifah-kubro' : '/wazifah-sugro';
              router.push({ pathname: route, params: { scrollToSection: latestProgress.section_number } });
            }
          }}
          activeOpacity={0.7}
        >
          <View style={[styles.continueIcon, { backgroundColor: colors.accentLight }]}>
            <Ionicons name="book" size={24} color={colors.accent} />
          </View>
          <View style={styles.continueContent}>
            <Text style={[styles.continueLabel, { color: colors.textSecondary }]}>Lanjutkan Membaca</Text>
            <Text style={[styles.continueTitle, { color: colors.text }]}>{latestProgress.title}</Text>
            {latestProgress.section_title && (
              <Text style={[styles.continueSubtitle, { color: colors.textTertiary }]}>{latestProgress.section_title}</Text>
            )}
            {latestProgress.subtitle && (
              <Text style={[styles.continueSubtitle, { color: colors.textTertiary }]}>{latestProgress.subtitle}</Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Wazifah</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={[styles.menuCard, { backgroundColor: colors.backgroundElement }]}
            onPress={() => router.push('/wazifah-sugro')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="book" size={24} color={colors.accent} />
            </View>
            <Text style={[styles.menuTitle, { color: colors.text }]}>Sugro</Text>
            <Text style={[styles.menuDesc, { color: colors.textSecondary }]}>Dzikir ringkas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuCard, { backgroundColor: colors.backgroundElement }]}
            onPress={() => router.push('/wazifah-kubro')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: colors.accentSecondaryLight }]}>
              <Ionicons name="library" size={24} color={colors.accentSecondary} />
            </View>
            <Text style={[styles.menuTitle, { color: colors.text }]}>Kubro</Text>
            <Text style={[styles.menuDesc, { color: colors.textSecondary }]}>Dzikir lengkap</Text>
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.five,
  },
  headerLeft: { flex: 1 },
  appName: { ...Typography.largeTitle },
  subtitle: { ...Typography.subhead, marginTop: Spacing.one },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.five,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    ...Shadows.card,
  },
  continueIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.four,
  },
  continueContent: { flex: 1 },
  continueLabel: { ...Typography.caption1 },
  continueTitle: { ...Typography.headline, marginTop: Spacing.half },
  continueSubtitle: { ...Typography.caption1, marginTop: Spacing.one },
  section: {
    paddingHorizontal: Spacing.five,
    marginBottom: Spacing.five,
  },
  sectionTitle: { ...Typography.title3, marginBottom: Spacing.three },
  menuContainer: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  menuCard: {
    flex: 1,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    alignItems: 'center',
    ...Shadows.card,
  },
  menuIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  menuTitle: { ...Typography.headline, marginTop: Spacing.two },
  menuDesc: { ...Typography.caption1, marginTop: Spacing.one, textAlign: 'center' },
});
