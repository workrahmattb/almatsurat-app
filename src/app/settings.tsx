import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSettingsStore, type ThemeMode } from '@/stores';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const {
    arabicFontSize,
    translationFontSize,
    themeMode,
    setArabicFontSize,
    setTranslationFontSize,
    setThemeMode,
  } = useSettingsStore();

  const themeOptions: { value: ThemeMode; label: string; emoji: string }[] = [
    { value: 'light', label: 'Terang', emoji: '☀️' },
    { value: 'dark', label: 'Gelap', emoji: '🌙' },
    { value: 'system', label: 'Sistem', emoji: '📱' },
  ];

  const fontSizesArabic = [20, 24, 28, 32, 36, 40];
  const fontSizesTranslation = [12, 14, 16, 18, 20, 22];

  return (
    <ScrollViewWrapper insets={insets} colors={colors}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>⚙️ Pengaturan</Text>
        </View>

        {/* Theme Section */}
        <View style={[styles.section, { backgroundColor: colors.backgroundElement, borderColor: colors.glassBorder, borderWidth: 1 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🎨 Tema</Text>
          <View style={styles.themeRow}>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor: themeMode === option.value ? colors.accent : colors.backgroundSelected,
                    borderColor: themeMode === option.value ? colors.accent : colors.glassBorder,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => setThemeMode(option.value)}
              >
                <Text style={{ fontSize: 20, color: themeMode === option.value ? '#fff' : colors.text }}>{option.emoji}</Text>
                <Text
                  style={{
                    color: themeMode === option.value ? '#fff' : colors.text,
                    fontWeight: '600',
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Arabic Font Size */}
        <View style={[styles.section, { backgroundColor: colors.backgroundElement, borderColor: colors.glassBorder, borderWidth: 1 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🔤 Ukuran Font Arab</Text>
          <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>Ukuran saat ini: {arabicFontSize}px</Text>
          <View style={styles.fontRow}>
            {fontSizesArabic.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.fontOption,
                  {
                    backgroundColor: arabicFontSize === size ? colors.accent : colors.backgroundSelected,
                    borderColor: arabicFontSize === size ? colors.accent : colors.glassBorder,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => setArabicFontSize(size)}
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

        {/* Translation Font Size */}
        <View style={[styles.section, { backgroundColor: colors.backgroundElement, borderColor: colors.glassBorder, borderWidth: 1 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📝 Ukuran Font Terjemahan</Text>
          <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>Ukuran saat ini: {translationFontSize}px</Text>
          <View style={styles.fontRow}>
            {fontSizesTranslation.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.fontOption,
                  {
                    backgroundColor: translationFontSize === size ? colors.accent : colors.backgroundSelected,
                    borderColor: translationFontSize === size ? colors.accent : colors.glassBorder,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => setTranslationFontSize(size)}
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

        {/* Preview */}
        <View style={[styles.section, { backgroundColor: colors.backgroundElement, borderColor: colors.glassBorder, borderWidth: 1 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>👁️ Preview</Text>
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
              marginTop: 8,
              lineHeight: translationFontSize * 1.5,
            }}
          >
            Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.
          </Text>
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Muslim App v1.0</Text>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Quran & Kitab Reader • Offline</Text>
        </View>
      </View>
    </ScrollViewWrapper>
  );
}

function ScrollViewWrapper({
  children,
  insets,
  colors,
}: {
  children: React.ReactNode;
  insets: any;
  colors: any;
}) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.four, paddingTop: Spacing.four + 20, paddingBottom: Spacing.three },
  headerTitle: { fontSize: 28, fontWeight: '700' },
  section: { marginHorizontal: Spacing.three, marginBottom: Spacing.two, padding: Spacing.three, borderRadius: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: Spacing.one },
  sectionDesc: { fontSize: 13, marginBottom: Spacing.two },
  themeRow: { flexDirection: 'row', gap: Spacing.two },
  themeOption: { flex: 1, alignItems: 'center', paddingVertical: Spacing.two, borderRadius: 12, borderWidth: 1 },
  fontRow: { flexDirection: 'row', gap: Spacing.one, flexWrap: 'wrap' },
  fontOption: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  footer: { alignItems: 'center', paddingVertical: Spacing.four, gap: 4 },
  footerText: { fontSize: 13 },
});