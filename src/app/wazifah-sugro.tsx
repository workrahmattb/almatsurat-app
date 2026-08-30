import { useCallback, useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getWazifahById, type WazifahSection } from "@/assets/data/wazifah";
import {
  getAyatPairs,
  type AyatPair,
} from "@/assets/data/wazifah/perayat-adapter";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useProgressStore, useSettingsStore } from "@/stores";
import { useLocalSearchParams } from "expo-router";

export default function WazifahSugroScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const { arabicFontSize, translationFontSize } = useSettingsStore();
  const updateProgress = useProgressStore((s) => s.updateProgress);
  const wazifah = getWazifahById("sugro");
  const params = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: {
        item: WazifahSection;
        key: string;
        index: number;
        isVisible: boolean;
      }[];
    }) => {
      if (viewableItems.length > 0 && wazifah && viewableItems[0].item) {
        const visible = viewableItems[viewableItems.length - 1].item;
        console.log(
          "SUGRO VISIBLE -> section:",
          visible.section_number,
          "| title:",
          visible.title,
        );
        updateProgress({
          type: "wazifah",
          reference_id: wazifah.id,
          title: wazifah.title,
          wazifah_type: "sugro",
          section_number: visible.section_number,
          section_title: visible.title,
        });
      }
    },
    [wazifah, updateProgress],
  );

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
        // Small delay to ensure FlatList is ready
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

  // Jangan panggil updateProgress kosong di awal — biar data scroll tersimpan
  // useEffect(() => {
  //   if (wazifah) updateProgress({ type: 'wazifah', reference_id: wazifah.id, title: wazifah.title, wazifah_type: 'sugro' });
  // }, [wazifah, updateProgress]);

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
        <Text style={{ color: colors.text, fontSize: 18 }}>
          Wazifah tidak ditemukan
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Banner */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>{wazifah.title}</Text>
        <Text style={styles.headerDesc}>{wazifah.description}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={wazifah.sections}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item: WazifahSection) => String(item.section_number)}
        contentContainerStyle={{}}
        snapToInterval={Dimensions.get("window").width}
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        getItemLayout={getItemLayout}
        renderItem={({ item, index }) => (
          <ScrollView
            style={{ width: Dimensions.get("window").width }}
            contentContainerStyle={{
              paddingHorizontal: Spacing.two,
              paddingBottom: insets.bottom + 40,
              alignItems: "center",
            }}
            showsVerticalScrollIndicator={false}
          >
            <SectionCard
              section={item}
              index={index}
              colors={colors}
              arabicFontSize={arabicFontSize}
              translationFontSize={translationFontSize}
              accentColor={colors.accent}
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
          borderRadius: 16,
          marginHorizontal: Spacing.two,
        },
      ]}
    >
      {/* Card Header: Judul + Info (center) */}
      <View
        style={[
          styles.cardHeader,
          {
            backgroundColor: accentColor,
            borderTopLeftRadius: isFirst ? 15 : 11,
            borderTopRightRadius: isFirst ? 15 : 11,
          },
        ]}
      >
        <Text style={styles.cardTitle}>{section.title}</Text>
        <View style={styles.cardMetaRow}>
          <Text style={styles.cardSource}>{section.source}</Text>
          <Text
            style={[styles.cardMetaDot, { color: "rgba(255,255,255,0.6)" }]}
          >
            •
          </Text>
          <Text style={styles.cardRepetisi}>{section.repetition}x</Text>
        </View>
      </View>

      {/* Bismillah header jika diperlukan */}
      {(section as any).header_bismillah && (
        <Text
          style={[
            styles.bismillahText,
            {
              fontSize: arabicFontSize * 1,
              color: '#000000',
              textAlign: "right",
              marginHorizontal: Spacing.three,
              marginTop: Spacing.one,
            },
          ]}
        >
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </Text>
      )}

      {/* Per-ayat content */}
      <View style={styles.ayatList}>
        {ayatPairs.length > 0 ? (
          ayatPairs.map((ayat: AyatPair, i: number) => (
            <View key={i} style={styles.ayatItem}>
              <View style={styles.ayatHeader}>
                <Text style={[styles.ayatNumber, { color: colors.accent }]}>
                  Ayat {ayat.ayat}
                </Text>
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
                {i > 0 && "— "} {ayat.translation}
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
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four + 20,
    paddingBottom: Spacing.three,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "800",
    textAlign: "center",
  },
  headerDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
    textAlign: "center",
  },
  card: {
    overflow: "hidden",
  },
  cardHeader: {
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  cardHeaderRight: { flex: 1 },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 3,
    textAlign: "center",
  },
  cardMetaRow: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  cardSource: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },
  cardMetaDot: { fontSize: 11, marginHorizontal: 4 },
  cardRepetisi: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
  },
  ayatList: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.three,
  },
  ayatItem: {},
  ayatHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ayatNumber: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  arabicText: {
    textAlign: "right",
    fontFamily: "KFGQPC-Uthmanic-HAFS",
    fontWeight: "600",
    marginBottom: Spacing.one,
  },
  bismillahText: {
    textAlign: "right",
    fontFamily: "KFGQPC-Uthmanic-HAFS",
    fontWeight: "600",
  },
  translationText: {
    fontWeight: "500",
  },
});
