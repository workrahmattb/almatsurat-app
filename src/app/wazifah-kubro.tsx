import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getWazifahById, type WazifahSection } from "@/assets/data/wazifah";
import {
  getAyatPairs,
  type AyatPair,
} from "@/assets/data/wazifah/perayat-adapter";
import {
  Colors,
  Radius,
  Shadows,
  Spacing,
  Typography,
  type ThemePalette,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useProgressStore, useSettingsStore } from "@/stores";
import { useLocalSearchParams } from "expo-router";

export default function WazifahKubroScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const { arabicFontSize, translationFontSize } = useSettingsStore();
  const updateProgress = useProgressStore((s) => s.updateProgress);

  const wazifah = getWazifahById("kubro");
  const params = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);

  const getItemLayout = useCallback((data: any, index: number) => {
    const cardWidth = Dimensions.get("window").width;
    return { length: cardWidth, offset: cardWidth * index, index };
  }, []);

  useEffect(() => {
    if (wazifah && params.scrollToSection) {
      const target = Number(params.scrollToSection);
      const index = wazifah.sections.findIndex(
        (s) => s.section_number === target,
      );
      if (index >= 0 && flatListRef.current) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0,
          });
        }, 100);
      }
    }
  }, [wazifah, params.scrollToSection]);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<WazifahSection>[] }) => {
      if (viewableItems.length > 0 && wazifah && viewableItems[0].item) {
        const visible = viewableItems[viewableItems.length - 1].item;
        updateProgress({
          type: "wazifah",
          reference_id: wazifah.id,
          title: wazifah.title,
          wazifah_type: "kubro",
          section_number: visible.section_number,
          section_title: visible.title,
        });
      }
    },
    [wazifah, updateProgress],
  );

  if (!wazifah) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text style={{ color: colors.text, fontSize: 17 }}>
          Wazifah tidak ditemukan
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.four }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {wazifah.title}
        </Text>
        <Text style={[styles.headerDesc, { color: colors.textSecondary }]}>
          {wazifah.description}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={wazifah.sections}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item: WazifahSection) => String(item.section_number)}
        snapToInterval={Dimensions.get("window").width}
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        getItemLayout={getItemLayout}
        renderItem={({ item, index }) => (
          <ScrollView
            style={{ width: Dimensions.get("window").width }}
            contentContainerStyle={{
              paddingHorizontal: Spacing.four,
              paddingBottom: insets.bottom + 40,
              alignItems: "center",
            }}
            showsVerticalScrollIndicator={false}
          >
            <SectionCard
              section={item}
              colors={colors}
              arabicFontSize={arabicFontSize}
              translationFontSize={translationFontSize}
              isFirst={index === 0}
              isLast={index === wazifah.sections.length - 1}
            />
          </ScrollView>
        )}
      />
    </View>
  );
}

function SectionCard({
  section,
  colors,
  arabicFontSize,
  translationFontSize,
  isFirst,
  isLast,
}: {
  section: WazifahSection;
  colors: ThemePalette;
  arabicFontSize: number;
  translationFontSize: number;
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
          borderRadius: Radius.lg,
          width: Dimensions.get("window").width - Spacing.four * 2,
          ...Shadows.card,
        },
      ]}
    >
      <View
        style={[
          styles.cardHeader,
          {
            backgroundColor: colors.accent,
            borderTopLeftRadius: Radius.lg,
            borderTopRightRadius: Radius.lg,
          },
        ]}
      >
        <Text style={styles.cardTitle}>{section.title}</Text>
        <View style={styles.cardMetaRow}>
          <Ionicons
            name="book-outline"
            size={12}
            color="rgba(255,255,255,0.7)"
          />
          <Text style={styles.cardSource}>{section.source}</Text>
          <Text style={styles.cardMetaDot}>•</Text>
          <Text style={styles.cardRepetisi}>{section.repetition}x</Text>
        </View>
      </View>

      {(section as any).header_bismillah && (
        <View style={styles.bismillahContainer}>
          <View style={[styles.divider, { backgroundColor: colors.accent }]} />
          <Text
            style={[
              styles.bismillahText,
              { fontSize: arabicFontSize, color: colors.text },
            ]}
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.accent }]} />
        </View>
      )}

      <View style={styles.ayatList}>
        {ayatPairs.length > 0 ? (
          ayatPairs.map((ayat: AyatPair, i: number) => (
            <View
              key={i}
              style={[
                styles.ayatItem,
                i < ayatPairs.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.separator,
                  paddingBottom: Spacing.four,
                  marginBottom: Spacing.four,
                },
              ]}
            >
              <View style={styles.ayatHeader}>
                <View
                  style={[
                    styles.ayatNumberBadge,
                    { backgroundColor: colors.accentLight },
                  ]}
                >
                  <Text
                    style={[styles.ayatNumberText, { color: colors.accent }]}
                  >
                    {ayat.ayat}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.arabicText,
                  {
                    color: colors.text,
                    fontSize: arabicFontSize,
                    lineHeight: arabicFontSize * 1.9,
                  },
                ]}
              >
                {ayat.arabic}
              </Text>
              <Text
                style={[
                  styles.translationText,
                  {
                    color: colors.textSecondary,
                    fontSize: translationFontSize,
                    lineHeight: translationFontSize * 1.7,
                  },
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
                {
                  color: colors.text,
                  fontSize: arabicFontSize,
                  lineHeight: arabicFontSize * 1.9,
                },
              ]}
            >
              {section.arabic}
            </Text>
            <Text
              style={[
                styles.translationText,
                {
                  color: colors.textSecondary,
                  fontSize: translationFontSize,
                  lineHeight: translationFontSize * 1.7,
                },
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
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.four,
  },
  headerTitle: { ...Typography.title1 },
  headerDesc: { ...Typography.subhead, marginTop: Spacing.one },
  card: {
    overflow: "hidden",
  },
  cardHeader: {
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  cardTitle: {
    ...Typography.headline,
    color: "#fff",
    marginBottom: Spacing.half,
    textAlign: "center",
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
  },
  cardSource: {
    ...Typography.caption1,
    color: "rgba(255,255,255,0.7)",
  },
  cardMetaDot: { ...Typography.caption1, color: "rgba(255,255,255,0.5)" },
  cardRepetisi: {
    ...Typography.caption1,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
  },
  bismillahContainer: {
    alignItems: "center",
    paddingVertical: Spacing.four,
    gap: Spacing.two,
  },
  divider: {
    width: 60,
    height: 1,
  },
  bismillahText: {
    fontFamily: "KFGQPC-Uthmanic-HAFS",
    textAlign: "center",
  },
  ayatList: {
    padding: Spacing.four,
  },
  ayatItem: {},
  ayatHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  ayatNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  ayatNumberText: {
    ...Typography.caption1,
    fontWeight: "700",
  },
  arabicText: {
    textAlign: "right",
    fontFamily: "KFGQPC-Uthmanic-HAFS",
    marginBottom: Spacing.two,
  },
  translationText: {
    ...Typography.subhead,
    textAlign: 'justify',
  },
});
