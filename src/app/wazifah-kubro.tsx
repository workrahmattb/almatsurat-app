import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProgressStore, useSettingsStore } from '@/stores';
import { getWazifahById, type WazifahSection } from '@/assets/data/wazifah';
import { getAyatPairs, type AyatPair } from '@/assets/data/wazifah/perayat-adapter';

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Banner */}
      <View style={[styles.header, { backgroundColor: colors.accent }]}>
        <Text style={styles.headerTitle}>{wazifah.title}</Text>
        <Text style={styles.headerDesc}>{wazifah.description}</Text>
      </View>

      <FlatList
        data={wazifah.sections}
        keyExtractor={(item: WazifahSection) => String(item.section_number)}
        contentContainerStyle={{ paddingHorizontal: Spacing.three, paddingTop: Spacing.two, paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <SectionCard
            section={item}
            index={index}
            colors={colors}
            arabicFontSize={arabicFontSize}
            translationFontSize={translationFontSize}
            accentColor={colors.accent2}
            isFirst={index === 0}
            isLast={index === wazifah.sections.length - 1}
          />
        )}
      />
    </View>
  );
}

function SectionCard({
  section,
  index,
  colors,
  arabicFontSize,
  translationFontSize,
  accentColor,
  isFirst,
  isLast,
}: {
  section: WazifahSection;
  index: number;
  colors: typeof Colors.dark;
  arabicFontSize: number;
  translationFontSize: number;
  accentColor: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const ayatPairs = getAyatPairs(section);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.backgroundElement,
          borderColor: colors.glassBorder,
          borderWidth: 1,
          marginTop: isFirst ? 0 : Spacing.two,
          borderTopLeftRadius: isFirst ? 16 : 12,
          borderTopRightRadius: isFirst ? 16 : 12,
          borderBottomLeftRadius: isLast ? 16 : 12,
          borderBottomRightRadius: isLast ? 16 : 12,
        },
      ]}
    >
      {/* Card Header: Nomor + Judul + Info */}
      <View style={[styles.cardHeader, { backgroundColor: accentColor, borderTopLeftRadius: isFirst ? 15 : 11, borderTopRightRadius: isFirst ? 15 : 11 }]}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardNomor}>{section.section_number}</Text>
        </View>
        <View style={styles.cardHeaderRight}>
          <Text style={styles.cardTitle}>{section.title}</Text>
          <View style={styles.cardMetaRow}>
            <Text style={styles.cardSource}>{section.source}</Text>
            <Text style={[styles.cardMetaDot, { color: 'rgba(255,255,255,0.6)' }]}>•</Text>
            <Text style={styles.cardRepetisi}>{section.repetition}x</Text>
          </View>
        </View>
      </View>

      {/* Per-ayat content */}
      <View style={styles.ayatList}>
        {ayatPairs.length > 0 ? (
          ayatPairs.map((ayat: AyatPair, i: number) => (
            <View key={i} style={styles.ayatItem}>
              <View style={styles.ayatHeader}>
                <Text style={[styles.ayatNumber, { color: colors.accent }]}>Ayat {ayat.ayat}</Text>
              </View>
              <Text
                style={[
                  styles.arabicText,
                  { color: colors.text, fontSize: arabicFontSize, lineHeight: arabicFontSize * 1.9 },
                ]}
              >
                {ayat.arabic}
              </Text>
              <Text
                style={[
                  styles.translationText,
                  { color: colors.textSecondary, fontSize: translationFontSize, lineHeight: translationFontSize * 1.7 },
                ]}
              >
                {ayat.translation}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.ayatItem}>
            <Text
              style={[
                styles.arabicText,
                { color: colors.text, fontSize: arabicFontSize, lineHeight: arabicFontSize * 1.9 },
              ]}
            >
              {section.arabic}
            </Text>
            <Text
              style={[
                styles.translationText,
                { color: colors.textSecondary, fontSize: translationFontSize, lineHeight: translationFontSize * 1.7 },
              ]}
            >
              {section.translation}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four + 20,
    paddingBottom: Spacing.three,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 28, color: '#fff', fontWeight: '800', textAlign: 'center' },
  headerDesc: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 6, textAlign: 'center' },
  card: {
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  cardHeaderLeft: {
    marginRight: Spacing.two,
  },
  cardNomor: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    minWidth: 36,
  },
  cardHeaderRight: { flex: 1 },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 3,
  },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center' },
  cardSource: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
  cardMetaDot: { fontSize: 11, marginHorizontal: 4 },
  cardRepetisi: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: '600' },
  ayatList: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.three,
  },
  ayatItem: {},
  ayatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ayatNumber: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  arabicText: {
    textAlign: 'right',
    fontFamily: 'KFGQPC-Uthmanic-HAFS',
    fontWeight: '600',
    marginBottom: Spacing.one,
  },
  translationText: {
    fontWeight: '500',
  },
});