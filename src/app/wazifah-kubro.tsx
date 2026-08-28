import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProgressStore, useSettingsStore } from '@/stores';
import { getWazifahById } from '@/assets/data/wazifah';

export default function WazifahKubroScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const { arabicFontSize, translationFontSize } = useSettingsStore();
  const updateProgress = useProgressStore((s) => s.updateProgress);

  const wazifah = getWazifahById('kubro');

  useEffect(() => {
    if (wazifah) updateProgress({ type: 'wazifah', reference_id: wazifah.id, title: wazifah.title });
  }, [wazifah, updateProgress]);

  if (!wazifah) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text, fontSize: 18 }}>Wazifah tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
    >
      {/* Header Banner */}
      <View style={[styles.header, { backgroundColor: 'rgba(92,58,26,0.92)', borderBottomColor: 'rgba(255,255,255,0.08)', borderBottomWidth: 1 }]}>
        <Text style={styles.headerTitle}>{wazifah.title}</Text>
        <Text style={styles.headerDesc}>{wazifah.description}</Text>
      </View>

      {wazifah.sections.map((section) => (
        <View key={section.section_number} style={[styles.sectionCard, { backgroundColor: colors.backgroundElement, borderColor: colors.glassBorder, borderWidth: 1, shadowColor: colors.glassShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 6 }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: '#5c3a1a', shadowColor: '#5c3a1a', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 8, elevation: 8 }]}>
              <Text style={styles.sectionNumberText}>{section.section_number}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
              <Text style={[styles.sectionSource, { color: colors.textSecondary }]}>
                {section.source} • {section.repetition}x
              </Text>
            </View>
          </View>

          <Text style={[styles.arabicText, { color: colors.text, fontSize: arabicFontSize, lineHeight: arabicFontSize * 1.8 }]}>
            {section.arabic}
          </Text>

          <Text style={[styles.translationText, { color: colors.textSecondary, fontSize: translationFontSize, lineHeight: translationFontSize * 1.6 }]}>
            {section.translation}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.four, paddingTop: Spacing.four + 20, paddingBottom: Spacing.four, alignItems: 'center' },
  headerTitle: { fontSize: 28, color: '#fff', fontWeight: '800', textAlign: 'center', letterSpacing: -0.5 },
  headerDesc: { fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 6, textAlign: 'center' },
  sectionCard: { marginHorizontal: Spacing.three, marginTop: Spacing.three, padding: Spacing.three, borderRadius: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.three },
  sectionNumber: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.two },
  sectionNumberText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  sectionTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.2 },
  sectionSource: { fontSize: 12, marginTop: 3, opacity: 0.85 },
  arabicText: { textAlign: 'right', fontFamily: 'KFGQPC-Uthmanic-HAFS', fontWeight: '600', marginBottom: Spacing.two },
  translationText: { fontWeight: '500', marginTop: 4 },
});