import { useEffect, useState, useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { colors, radii, space } from "@/lib/brand";
import { loadFlipLog, clearFlipLog, type SavedScan } from "@/lib/storage";

export default function LogScreen() {
  const [items, setItems] = useState<SavedScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setItems(await loadFlipLog());
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const onClear = () => {
    Alert.alert("Clear flip log?", "This removes every saved scan. Cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await clearFlipLog();
          setItems([]);
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={s.empty}>
        <Text style={s.bodyMuted}>Loading…</Text>
      </View>
    );
  }
  if (items.length === 0) {
    return (
      <View style={s.empty}>
        <Text style={s.h2}>No scans saved yet</Text>
        <Text style={s.bodyMuted}>Save a result from the Scan tab and it lands here.</Text>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: space[4], paddingBottom: 80 }}
        ItemSeparatorComponent={() => <View style={{ height: space[3] }} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.mint500} />}
        renderItem={({ item }) => <Row item={item} />}
      />
      <TouchableOpacity onPress={onClear} style={s.clearBtn}>
        <Trash2 size={16} color={colors.skip} />
        <Text style={s.clearText}>Clear log</Text>
      </TouchableOpacity>
    </View>
  );
}

function Row({ item }: { item: SavedScan }) {
  const v = item.score.verdict;
  const tone = v === "buy" ? colors.buy : v === "skip" ? colors.skip : v === "maybe" ? colors.maybe : colors.muted;
  return (
    <View style={s.row}>
      {item.imageDataUri ? (
        <Image source={{ uri: item.imageDataUri }} style={s.thumb} />
      ) : (
        <View style={[s.thumb, { backgroundColor: colors.sand, alignItems: "center", justifyContent: "center" }]}>
          <Text style={{ color: colors.muted, fontSize: 11 }}>UPC</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={s.title} numberOfLines={1}>
          {item.identify.title}
        </Text>
        <Text style={s.meta}>
          {item.comp.median != null ? `$${item.comp.median.toFixed(2)}` : "no comp"}
          {"  ·  "}
          net {item.score.netUsd != null ? `$${item.score.netUsd.toFixed(2)}` : "—"}
        </Text>
      </View>
      <View style={[s.pill, { backgroundColor: tone }]}>
        <Text style={s.pillText}>{v.toUpperCase()}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: space[6], backgroundColor: colors.cream },
  h2: { fontSize: 18, fontWeight: "700", color: colors.ink, marginBottom: space[2] },
  bodyMuted: { fontSize: 14, color: colors.muted, textAlign: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: space[3],
    borderWidth: 1,
    borderColor: colors.line,
    gap: 12,
  },
  thumb: { width: 56, height: 56, borderRadius: radii.md },
  title: { fontSize: 14, fontWeight: "600", color: colors.ink },
  meta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  pillText: { color: colors.white, fontSize: 10, fontWeight: "700", letterSpacing: 0.6 },
  clearBtn: {
    position: "absolute",
    bottom: space[4],
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  clearText: { color: colors.skip, marginLeft: 6, fontSize: 13, fontWeight: "600" },
});
