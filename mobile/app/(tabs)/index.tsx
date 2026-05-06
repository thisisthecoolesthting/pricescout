import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Camera as CameraIcon, RefreshCw } from "lucide-react-native";
import { colors, radii, space } from "@/lib/brand";
import { identifyFromImage, lookupByUpc, type IdentifyResponse } from "@/lib/api";
import { saveScan } from "@/lib/storage";

type Phase =
  | { kind: "idle" }
  | { kind: "starting" }
  | { kind: "ready" }
  | { kind: "captured"; uri: string }
  | { kind: "identifying" }
  | { kind: "result"; payload: IdentifyResponse; uri: string | null }
  | { kind: "error"; message: string };

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const camRef = useRef<CameraView | null>(null);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [costBasis, setCostBasis] = useState<string>("3.00");

  // Permission gate
  if (!permission) {
    return <Centered><ActivityIndicator color={colors.mint500} /></Centered>;
  }
  if (!permission.granted) {
    return (
      <Centered>
        <Text style={s.h1}>Camera access needed</Text>
        <Text style={s.body}>PriceScout uses the camera to identify thrift-store items.</Text>
        <Pressable label="Allow camera" onPress={requestPermission} primary />
      </Centered>
    );
  }

  const onShutter = async () => {
    if (!camRef.current) return;
    setPhase({ kind: "captured", uri: "" });
    try {
      const photo = await camRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
        skipProcessing: true,
      });
      if (!photo?.base64) throw new Error("No image captured.");
      setPhase({ kind: "identifying" });
      const cost = parseFloat(costBasis) || 0;
      const dataUri = `data:image/jpeg;base64,${photo.base64}`;
      const payload = await identifyFromImage(dataUri, cost);
      setPhase({ kind: "result", payload, uri: photo.uri ?? null });
    } catch (e) {
      setPhase({ kind: "error", message: e instanceof Error ? e.message : "Capture failed" });
    }
  };

  const onBarcodeScanned = async (data: { data: string; type: string }) => {
    if (phase.kind !== "ready") return; // ignore while not actively scanning
    if (!/^\d{8,14}$/.test(data.data)) return; // only UPC/ISBN-shaped
    setPhase({ kind: "identifying" });
    try {
      const cost = parseFloat(costBasis) || 0;
      const payload = await lookupByUpc(data.data, cost);
      setPhase({ kind: "result", payload, uri: null });
    } catch (e) {
      setPhase({ kind: "error", message: e instanceof Error ? e.message : "Lookup failed" });
    }
  };

  const onSave = async () => {
    if (phase.kind !== "result") return;
    try {
      await saveScan({
        ...phase.payload,
        id: `scan-${Date.now()}`,
        scannedAt: new Date().toISOString(),
        imageDataUri: phase.uri,
      });
      Alert.alert("Saved to flip log");
    } catch (e) {
      Alert.alert("Save failed", e instanceof Error ? e.message : String(e));
    }
  };

  const reset = () => setPhase({ kind: "ready" });

  return (
    <View style={s.root}>
      {phase.kind === "idle" || phase.kind === "starting" || phase.kind === "ready" ? (
        <View style={s.cameraWrap}>
          <CameraView
            ref={camRef}
            style={s.camera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["upc_a", "upc_e", "ean8", "ean13", "code128"] }}
            onBarcodeScanned={phase.kind === "ready" ? onBarcodeScanned : undefined}
            onCameraReady={() => setPhase({ kind: "ready" })}
          />
          <View style={s.reticle} pointerEvents="none" />
          <View style={s.cameraOverlay}>
            <Text style={s.overlayText}>Point at the item · barcode auto-reads</Text>
          </View>
        </View>
      ) : null}

      {phase.kind === "result" ? (
        <ScrollView contentContainerStyle={s.resultPad}>
          <VerdictCard payload={phase.payload} />
          <View style={s.row}>
            <Pressable label="Save to flip log" onPress={onSave} primary />
            <Pressable label="Scan again" onPress={reset} icon={<RefreshCw size={16} color={colors.ink} />} />
          </View>
        </ScrollView>
      ) : null}

      {phase.kind === "identifying" || phase.kind === "captured" ? (
        <Centered>
          <ActivityIndicator color={colors.mint500} size="large" />
          <Text style={[s.body, { marginTop: space[3] }]}>Identifying…</Text>
        </Centered>
      ) : null}

      {phase.kind === "error" ? (
        <Centered>
          <Text style={[s.h1, { color: colors.skip }]}>Scan failed</Text>
          <Text style={s.body}>{phase.message}</Text>
          <Pressable label="Try again" onPress={reset} primary />
        </Centered>
      ) : null}

      {/* Bottom controls — always visible while in camera mode */}
      {phase.kind === "ready" ? (
        <View style={s.bottomBar}>
          <View style={s.costBox}>
            <Text style={s.costLabel}>Your cost</Text>
            <View style={s.costInputWrap}>
              <Text style={s.costPrefix}>$</Text>
              <TextInput
                value={costBasis}
                onChangeText={setCostBasis}
                keyboardType="decimal-pad"
                style={s.costInput}
                placeholder="3.00"
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>
          <TouchableOpacity onPress={onShutter} style={s.shutter} accessibilityLabel="Capture">
            <View style={s.shutterInner}>
              <CameraIcon color={colors.white} size={26} />
            </View>
          </TouchableOpacity>
          <View style={{ width: 110 }} />
        </View>
      ) : null}
    </View>
  );
}

function VerdictCard({ payload }: { payload: IdentifyResponse }) {
  const v = payload.score.verdict;
  const tone =
    v === "buy" ? colors.buy : v === "skip" ? colors.skip : v === "maybe" ? colors.maybe : colors.muted;
  const label = v === "buy" ? "Buy" : v === "skip" ? "Skip" : v === "maybe" ? "Maybe" : "Unknown";
  return (
    <View style={s.card}>
      <View style={[s.verdictPill, { backgroundColor: tone }]}>
        <Text style={s.verdictText}>{label}</Text>
      </View>
      <Text style={s.h2}>{payload.identify.title}</Text>
      <Text style={s.bodyMuted}>{payload.identify.category}</Text>
      <View style={s.statsGrid}>
        <Stat label="Comp median" value={payload.comp.median != null ? `$${payload.comp.median.toFixed(2)}` : "—"} />
        <Stat label="Sample" value={String(payload.comp.sampleSize)} />
        <Stat label="Your cost" value={`$${payload.costBasis.toFixed(2)}`} />
        <Stat label="Net (est.)" value={payload.score.netUsd != null ? `$${payload.score.netUsd.toFixed(2)}` : "—"} />
      </View>
      <Text style={s.bodyMuted}>{stripHtml(payload.score.explanation)}</Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.statBox}>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={s.statValue}>{value}</Text>
    </View>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <View style={s.centered}>{children}</View>;
}

function Pressable({
  label,
  onPress,
  primary,
  icon,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[s.btn, primary ? s.btnPrimary : s.btnGhost]}>
      {icon ? <View style={{ marginRight: 6 }}>{icon}</View> : null}
      <Text style={[s.btnText, primary ? s.btnTextPrimary : s.btnTextGhost]}>{label}</Text>
    </TouchableOpacity>
  );
}

function stripHtml(s: string): string {
  return s.replace(/&middot;/g, "·").replace(/&mdash;/g, "—").replace(/<[^>]+>/g, "");
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  cameraWrap: { flex: 1, position: "relative" },
  camera: { flex: 1 },
  reticle: {
    position: "absolute",
    top: "20%",
    left: "10%",
    right: "10%",
    bottom: "32%",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
    borderRadius: radii.md,
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 130,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  overlayText: {
    color: colors.white,
    fontSize: 12,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space[4],
  },
  costBox: { width: 110 },
  costLabel: { color: colors.white, fontSize: 11, opacity: 0.8, marginBottom: 4 },
  costInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: radii.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  costPrefix: { color: colors.muted, marginRight: 4 },
  costInput: { flex: 1, color: colors.ink, fontSize: 16, padding: 0 },
  shutter: {
    width: 78,
    height: 78,
    borderRadius: 999,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: colors.mint500,
    alignItems: "center",
    justifyContent: "center",
  },
  resultPad: { padding: space[4] },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: space[5],
    marginBottom: space[4],
    borderWidth: 1,
    borderColor: colors.line,
  },
  verdictPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: space[3],
  },
  verdictText: { color: colors.white, fontWeight: "700", fontSize: 12, letterSpacing: 0.6 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: space[3] },
  statBox: {
    flexBasis: "47%",
    backgroundColor: colors.cream,
    borderRadius: radii.md,
    padding: space[3],
  },
  statLabel: { fontSize: 10, color: colors.muted, textTransform: "uppercase", letterSpacing: 0.6 },
  statValue: { fontSize: 16, fontWeight: "700", color: colors.ink, marginTop: 2 },
  row: { flexDirection: "row", gap: 10 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: space[6], backgroundColor: colors.cream },
  h1: { fontSize: 22, fontWeight: "700", color: colors.ink, marginBottom: space[2] },
  h2: { fontSize: 18, fontWeight: "700", color: colors.ink, marginBottom: 4 },
  body: { fontSize: 15, color: colors.body, lineHeight: 22, textAlign: "center", marginBottom: space[3] },
  bodyMuted: { fontSize: 13, color: colors.muted, lineHeight: 19 },
  btn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 12, paddingHorizontal: 16, borderRadius: radii.lg, flex: 1 },
  btnPrimary: { backgroundColor: colors.mint500 },
  btnGhost: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  btnText: { fontSize: 14, fontWeight: "600" },
  btnTextPrimary: { color: colors.white },
  btnTextGhost: { color: colors.ink },
});
