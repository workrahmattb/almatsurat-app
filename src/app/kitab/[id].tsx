import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProgressStore, useSettingsStore } from '@/stores';
import { getWazifahById } from '@/assets/data/wazifah';

export default function WazifahKubroReaderScreen() {
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

      // Update reading progress
      updateProgress({
        type: 'wazifah',
        reference_id: wazifah.id,
        title: wazifah.title,
      });
    }
  }, [wazifah, navigation, updateProgress]);

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
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#5c3a1a' }]}>
        <Text style={styles.headerTitle}>{wazifah.title}</Text>
        <Text style={styles.headerDesc}>{wazifah.description}</Text>
      </View>

      {/* Sections */}
      {wazifah.sections.map((section) => (
        <View key={section.section_number} style={[styles.sectionCard, { backgroundColor: colors.backgroundElement }]}>
          {/* Section Title */}
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: '#5c3a1a' }]}>
              <Text style={styles.sectionNumberText}>{section.section_number}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
              <Text style={[styles.sectionSource, { color: colors.textSecondary }]}>
                {section.source} • {section.repetition}x
              </Text>
            </View>
          </View>

          {/* Arabic Text */}
          <Text
            style={[
              styles.arabicText,
              {
                color: colors.text,
                fontSize: arabicFontSize,
                lineHeight: arabicFontSize * 1.8,
              },
            ]}
          >
            {section.arabic}
          </Text>

          {/* Transliteration */}
          <Text
            style={[
              styles.transliterationText,
              {
                color: colors.textSecondary,
                fontSize: translationFontSize,
                lineHeight: translationFontSize * 1.5,
              },
            ]}
          >
            {section.transliteration}
          </Text>

          {/* Translation */}
          <Text
            style={[
              styles.translationText,
              {
                color: colors.textSecondary,
                fontSize: translationFontSize,
                lineHeight: translationFontSize * 1.6,
              },
            ]}
          >
            {section.translation}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  headerDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionCard: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  sectionNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.two,
  },
  sectionNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionSource: {
    fontSize: 12,
    marginTop: 2,
  },
  arabicText: {
    textAlign: 'right',
    fontFamily: 'KFGQPC-Uthmanic-HAFS',
    fontWeight: '600',
    marginBottom: Spacing.two,
  },
  transliterationText: {
    fontStyle: 'italic',
    marginBottom: Spacing.two,
  },
  translationText: {
    fontWeight: '500',
  },
});
