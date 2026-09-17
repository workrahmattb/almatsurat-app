import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSettingsStore } from '@/stores';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const {
    arabicFontSize,
    translationFontSize,
    setArabicFontSize,
    setTranslationFontSize,
  } = useSettingsStore();

  const fontSizesArabic = [20, 24, 28, 32, 36, 40];
  const fontSizesTranslation = [12, 14, 16, 18, 20, 22];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.four }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Pengaturan</Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.backgroundElement }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="text" size={20} color={colors.accent} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ukuran Font Arab</Text>
        </View>
        <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>Ukuran saat ini: {arabicFontSize}px</Text>
        <View style={styles.fontRow}>
          {fontSizesArabic.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.fontOption,
                {
                  backgroundColor: arabicFontSize === size ? colors.accent : colors.backgroundSelected,
                },
              ]}
              onPress={() => setArabicFontSize(size)}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  color: arabicFontSize === size ? '#fff' : colors.text,
                  fontWeight: '600',
                }}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.backgroundElement }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="document-text" size={20} color={colors.accentSecondary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ukuran Font Terjemahan</Text>
        </View>
        <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>Ukuran saat ini: {translationFontSize}px</Text>
        <View style={styles.fontRow}>
          {fontSizesTranslation.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.fontOption,
                {
                  backgroundColor: translationFontSize === size ? colors.accent : colors.backgroundSelected,
                },
              ]}
              onPress={() => setTranslationFontSize(size)}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  color: translationFontSize === size ? '#fff' : colors.text,
                  fontWeight: '600',
                }}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.backgroundElement }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="eye" size={20} color={colors.textSecondary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preview</Text>
        </View>
        <View style={[styles.previewContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <Text
            style={{
              fontSize: arabicFontSize,
              textAlign: 'center',
              fontFamily: 'KFGQPC-Uthmanic-HAFS',
              color: colors.text,
              lineHeight: arabicFontSize * 1.8,
            }}
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </Text>
          <Text
            style={{
              fontSize: translationFontSize,
              textAlign: 'center',
              color: colors.textSecondary,
              marginTop: Spacing.three,
              lineHeight: translationFontSize * 1.5,
            }}
          >
            Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textTertiary }]}>Al-Ma'tsurat v1.0</Text>
        <Text style={[styles.footerText, { color: colors.textTertiary }]}>Quran & Kitab Reader • Offline</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.four,
  },
  headerTitle: { ...Typography.largeTitle },
  section: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.three,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    ...Shadows.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.two,
    gap: Spacing.two,
  },
  sectionTitle: { ...Typography.headline },
  sectionDesc: { ...Typography.footnote, marginBottom: Spacing.three },
  fontRow: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' },
  fontOption: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    padding: Spacing.five,
    borderRadius: Radius.md,
    marginTop: Spacing.two,
  },
  footer: { alignItems: 'center', paddingVertical: Spacing.five, gap: Spacing.one },
  footerText: { ...Typography.footnote },
});
