import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProgressStore, useSettingsStore } from '@/stores';
import { getWazifahById } from '@/assets/data/wazifah';

export default function WazifahReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const { arabicFontSize, translationFontSize } = useSettingsStore();
  const updateProgress = useProgressStore((s) => s.updateProgress);

  const wazifah = getWazifahById(id as 'sugro' | 'kubro');

  useEffect(() => {
    if (wazifah) {
      navigation.setOptions({ title: wazifah.title });
      updateProgress({ type: 'wazifah', reference_id: wazifah.id, title: wazifah.title });
    }
  }, [wazifah, navigation, updateProgress]);

  if (!wazifah) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text, fontSize: 18 }}>Wazifah tidak ditemukan</Text>
      </View>
    );
  }

  const bannerColor = wazifah.id === 'sugro' ? colors.primary : colors.accent;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
    >
      <View style={[styles.header, { backgroundColor: bannerColor }]}>
        <Text style={styles.headerTitle}>{wazifah.title}</Text>
        <Text style={styles.headerDesc}>{wazifah.description}</Text>
      </View>

      {wazifah.sections.map((section) => (
        <View key={section.section_number} style={[styles.sectionCard, { backgroundColor: colors.backgroundElement, borderColor: colors.glassBorder, borderWidth: 1 }]}>
          <View style={styles.sectionHeader}>
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

          <Text style={[styles.transliterationText, { color: colors.textSecondary, fontSize: translationFontSize, lineHeight: translationFontSize * 1.5 }]}>
            {section.transliteration}
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
  header: { paddingHorizontal: Spacing.four, paddingVertical: Spacing.four, alignItems: 'center' },
  headerTitle: { fontSize: 28, color: '#fff', fontWeight: '800', textAlign: 'center' },
  headerDesc: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 6, textAlign: 'center' },
  sectionCard: { marginHorizontal: Spacing.three, marginTop: Spacing.three, padding: Spacing.three, borderRadius: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.three },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  sectionSource: { fontSize: 12, marginTop: 3 },
  arabicText: { textAlign: 'right', fontFamily: 'KFGQPC-Uthmanic-HAFS', fontWeight: '600', marginBottom: Spacing.two },
  transliterationText: { fontStyle: 'italic', marginBottom: Spacing.two },
  translationText: { fontWeight: '500', marginTop: 4 },
});