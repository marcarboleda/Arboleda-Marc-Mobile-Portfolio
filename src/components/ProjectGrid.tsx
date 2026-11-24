import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PROJECTS, type Project, type Visual } from "../data/projects";
import { color, useLayout, webOnly, type InteractionState, type Theme } from "../theme";
import { HelmetCurve, TabulaResultsChart } from "./Charts";
import { RegistryDemo } from "./RegistryDemo";

type Rect = { x: number; y: number; w: number; h: number };

const COVER_H = 250;
const CARD_RADIUS = 35;

/* ------------------------------------------------------------------ */
/* Grid                                                                 */
/* ------------------------------------------------------------------ */

export function ProjectGrid({ theme }: { theme: Theme }) {
  const { bp, contentWidth } = useLayout();
  const cols = bp === "desktop" ? 3 : bp === "tablet" ? 2 : 1;
  const gap = bp === "phone" ? 18 : 22;
  const cardW = (contentWidth - gap * (cols - 1)) / cols;

  const refs = useRef<Record<string, View | null>>({});
  const [open, setOpen] = useState<{ project: Project; origin: Rect } | null>(null);

  const openProject = (p: Project) => {
    const node = refs.current[p.id];
    const fallback: Rect = { x: 0, y: 0, w: cardW, h: COVER_H + 180 };
    if (!node) return setOpen({ project: p, origin: fallback });
    node.measureInWindow((x, y, w, h) => setOpen({ project: p, origin: w ? { x, y, w, h } : fallback }));
  };

  return (
    <View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap }}>
        {PROJECTS.map((p) => (
          <View key={p.id} style={{ width: cardW }} ref={(r) => { refs.current[p.id] = r; }} collapsable={false}>
            <ProjectCard project={p} theme={theme} hidden={open?.project.id === p.id} onPress={() => openProject(p)} />
          </View>
        ))}
      </View>
      {open ? <ProjectDetail project={open.project} origin={open.origin} theme={theme} onClosed={() => setOpen(null)} /> : null}
    </View>
  );
}

function ProjectCard({ project: p, theme, hidden, onPress }: { project: Project; theme: Theme; hidden: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${p.title}. Open project details`}
      style={(s) => {
        const { hovered, pressed } = s as InteractionState;
        return [
          styles.card,
          { flex: 1, backgroundColor: theme.card, borderColor: hovered ? theme.tint + "70" : theme.border, opacity: hidden ? 0 : 1 },
          hovered && { transform: [{ translateY: -6 }] },
          pressed && { transform: [{ scale: 0.985 }] },
          webOnly({ transitionDuration: "260ms", transitionTimingFunction: "cubic-bezier(.2,.8,.2,1)", boxShadow: hovered ? `0 24px 60px -20px ${theme.tint}55` : "none" }),
        ];
      }}
    >
      {(s) => {
        const hovered = (s as InteractionState).hovered;
        return (
          <>
            <View style={{ height: COVER_H, overflow: "hidden" }}>
              <Cover visual={p.visuals[0]} zoom={!!hovered} />
              <View style={[styles.indexBadge]}>
                <Text style={styles.indexText}>{p.index}</Text>
              </View>
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardCategory, { color: theme.tint }]}>{p.category.toUpperCase()}</Text>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{p.title}</Text>
              <Text style={[styles.cardTagline, { color: theme.text }]} numberOfLines={3}>
                {p.tagline}
              </Text>
              <View style={[styles.cardFoot, { borderTopColor: theme.border }]}>
                <View>
                  <Text style={[styles.cardMetric, { color: theme.text }]}>{p.metrics[0].value}</Text>
                  <Text style={[styles.cardMetricLabel, { color: theme.text }]}>{p.metrics[0].label}</Text>
                </View>
                <View style={[styles.openBtn, { backgroundColor: hovered ? theme.tint : theme.tint + "18" }]}>
                  <Text style={[styles.openBtnText, { color: hovered ? "#FFFFFF" : theme.tint }]}>View ↗</Text>
                </View>
              </View>
            </View>
          </>
        );
      }}
    </Pressable>
  );
}

/** First visual of a project, cropped to fill the card's cover area. */
function Cover({ visual: v, zoom }: { visual: Visual; zoom?: boolean }) {
  if (v.kind === "image") {
    return (
      <Image
        source={v.source}
        style={[{ width: "100%", height: "100%" }, webOnly({ transitionDuration: "600ms", transform: zoom ? "scale(1.05)" : "scale(1)" })]}
        resizeMode="cover"
        accessibilityLabel={v.label}
      />
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: color.bg, paddingHorizontal: 14, paddingTop: 22 }}>
      {v.kind === "helmet-chart" ? <HelmetCurve height={COVER_H - 30} compact /> : <TabulaResultsChart height={COVER_H - 30} compact />}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Expanded detail view                                                 */
/* ------------------------------------------------------------------ */

function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce).catch(() => {});
  }, []);
  return reduce;
}

function ProjectDetail({ project: p, origin, theme, onClosed }: { project: Project; origin: Rect; theme: Theme; onClosed: () => void }) {
  const { width, height, bp } = useLayout();
  const insets = useSafeAreaInsets();
  const reduce = useReduceMotion();
  const t = useRef(new Animated.Value(0)).current;
  const closing = useRef(false);
  const phone = bp === "phone";

  const target: Rect = phone
    ? { x: 0, y: 0, w: width, h: height }
    : { x: (width - Math.min(1080, width - 64)) / 2, y: 32, w: Math.min(1080, width - 64), h: height - 64 };

  useEffect(() => {
    Animated.timing(t, {
      toValue: 1,
      duration: reduce ? 0 : 520,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [t, reduce]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    Animated.timing(t, { toValue: 0, duration: reduce ? 0 : 380, easing: Easing.bezier(0.4, 0, 0.2, 1), useNativeDriver: false }).start(() => onClosed());
  }, [t, reduce, onClosed]);

  // Escape closes the view on web.
  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const lerp = (a: number, b: number) => t.interpolate({ inputRange: [0, 1], outputRange: [a, b] });
  const contentFade = t.interpolate({ inputRange: [0, 0.55, 1], outputRange: [0, 0, 1] });
  const contentRise = t.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  return (
    <Modal visible transparent animationType="none" onRequestClose={close} statusBarTranslucent>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: theme.overlay, opacity: t }, webOnly({ backdropFilter: "blur(8px)" })]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Close project" />
      </Animated.View>

      <Animated.View
        style={[
          styles.panel,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            left: lerp(origin.x, target.x),
            top: lerp(origin.y, target.y),
            width: lerp(origin.w, target.w),
            height: lerp(origin.h, target.h),
            borderRadius: lerp(CARD_RADIUS, phone ? 0 : 32),
          },
        ]}
        accessibilityViewIsModal
      >
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 48 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingTop: phone ? insets.top + 70 : 32, paddingHorizontal: phone ? 18 : 32 }}>
            <Animated.View style={{ opacity: contentFade, transform: [{ translateY: contentRise }] }}>
              <DetailBody project={p} theme={theme} gallery={<Gallery visuals={p.visuals} theme={theme} />} />
            </Animated.View>
          </View>
        </ScrollView>

        <Pressable
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={10}
          style={(s) => [
            styles.closeBtn,
            { top: phone ? insets.top + 14 : 18, backgroundColor: (s as InteractionState).hovered ? theme.tint : theme.background, borderColor: theme.border },
          ]}
        >
          {(s) => <Text style={{ color: (s as InteractionState).hovered ? "#fff" : theme.text, fontSize: 18, fontWeight: "600" }}>✕</Text>}
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

function DetailBody({ project: p, theme, gallery }: { project: Project; theme: Theme; gallery: ReactNode }) {
  const { bp } = useLayout();
  const wide = bp !== "phone";
  const desktop = bp === "desktop";
  const [demo, setDemo] = useState(false);

  return (
    <View>
      <View style={[{ gap: desktop ? 36 : 28 }, desktop && { flexDirection: "row", alignItems: "center", paddingRight: 56 }]}>
        <View style={desktop ? { flex: 1.35 } : undefined}>{gallery}</View>
        <View style={desktop ? { flex: 1 } : undefined}>
          <Text style={[styles.dCategory, { color: theme.tint }]}>
            {p.category.toUpperCase()} · {p.year}
          </Text>
          <Text style={[styles.dTitle, { color: theme.text, fontSize: wide ? 40 : 30, lineHeight: wide ? 44 : 34 }]}>{p.title}</Text>
          <Text style={[styles.dTagline, { color: theme.text }]}>{p.tagline}</Text>
          <View style={styles.pills}>
            <Tag theme={theme} strong>
              {p.role}
            </Tag>
            <Tag theme={theme}>{p.team}</Tag>
          </View>
        </View>
      </View>

      <View style={[styles.metricsGrid, { marginTop: 28 }]}>
        {p.metrics.map((m) => (
          <View key={m.label} style={[styles.metric, { backgroundColor: theme.background, width: wide ? "23.5%" : "48%" }]}>
            <Text style={[styles.metricValue, { color: theme.tint, fontSize: wide ? 24 : 18 }]}>{m.value}</Text>
            <Text style={[styles.metricLabel, { color: theme.text }]}>{m.label}</Text>
          </View>
        ))}
      </View>

      <View style={[{ marginTop: 32, gap: 32 }, wide && { flexDirection: "row" }]}>
        <View style={wide ? { flex: 1 } : undefined}>
          <Text style={[styles.dHead, { color: theme.text }]}>About the project</Text>
          <Text style={[styles.dText, { color: theme.text }]}>{p.summary}</Text>
          <Text style={[styles.dHead, { color: theme.text, marginTop: 28 }]}>Built with</Text>
          <View style={styles.pills}>
            {p.stack.map((s) => (
              <Tag key={s} theme={theme}>
                {s}
              </Tag>
            ))}
          </View>
        </View>
        <View style={wide ? { flex: 1.25 } : undefined}>
          <Text style={[styles.dHead, { color: theme.text }]}>What I did</Text>
          <View style={{ gap: 14 }}>
            {p.did.map((d, i) => (
              <View key={d} style={{ flexDirection: "row", gap: 14 }}>
                <View style={[styles.step, { backgroundColor: theme.tint + "1F" }]}>
                  <Text style={[styles.stepText, { color: theme.tint }]}>{i + 1}</Text>
                </View>
                <Text style={[styles.dText, { color: theme.text, flex: 1, marginTop: 0 }]}>{d}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {p.demo ? (
        <View style={{ marginTop: 36 }}>
          <Pressable
            onPress={() => setDemo(!demo)}
            accessibilityRole="button"
            style={(s) => [styles.demoBtn, { backgroundColor: theme.tint }, (s as InteractionState).hovered && { opacity: 0.88 }]}
          >
            <Text style={styles.demoBtnText}>{demo ? "Hide interactive demo ↑" : "Try the interactive demo ↓"}</Text>
          </Pressable>
          {demo ? (
            <View style={{ marginTop: 18 }}>
              <Text style={[styles.dText, { color: theme.text, marginBottom: 14, marginTop: 0, fontSize: 14 }]}>
                A working copy with the same columns, validation and search logic as the real sheet. Every name, email and link is fictional.
              </Text>
              <RegistryDemo />
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function Tag({ children, theme, strong }: { children: ReactNode; theme: Theme; strong?: boolean }) {
  return (
    <View style={[styles.tag, { borderColor: strong ? theme.tint + "55" : theme.border, backgroundColor: strong ? theme.tint + "18" : "transparent" }]}>
      <Text style={[styles.tagText, { color: strong ? theme.tint : theme.text }]}>{children}</Text>
    </View>
  );
}

function Gallery({ visuals, theme }: { visuals: Visual[]; theme: Theme }) {
  const [i, setI] = useState(0);
  const v = visuals[i];
  return (
    <View>
      <View style={[styles.frame, { borderColor: theme.border }]}>
        <View style={styles.frameBar}>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <View key={c} style={[styles.light, { backgroundColor: c }]} />
            ))}
          </View>
          <View style={styles.urlBar}>
            <Text style={styles.urlText} numberOfLines={1}>
              {v.kind === "image" ? v.url : v.label}
            </Text>
          </View>
          <View style={{ width: 42 }} />
        </View>
        {v.kind === "image" ? (
          <View style={{ aspectRatio: v.aspect, width: "100%" }}>
            <Image source={v.source} style={{ width: "100%", height: "100%" }} resizeMode="cover" accessibilityLabel={v.label} />
          </View>
        ) : (
          <View style={{ padding: 20, backgroundColor: color.bg }}>{v.kind === "helmet-chart" ? <HelmetCurve /> : <TabulaResultsChart />}</View>
        )}
      </View>
      {visuals.length > 1 ? (
        <View style={styles.tabs}>
          {visuals.map((x, k) => {
            const on = k === i;
            return (
              <Pressable
                key={x.label}
                onPress={() => setI(k)}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                style={(s) => [
                  styles.tab,
                  { borderColor: on ? theme.tint : theme.border, backgroundColor: on ? theme.tint : "transparent" },
                  !on && (s as InteractionState).hovered && { borderColor: theme.tint + "80" },
                ]}
              >
                <Text style={[styles.tabText, { color: on ? "#FFFFFF" : theme.text }]}>{x.label}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: CARD_RADIUS, overflow: "hidden", borderWidth: 1 },
  indexBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    ...webOnly({ backdropFilter: "blur(8px)" }),
  },
  indexText: { color: "#fff", fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  cardInfo: { padding: 25, flex: 1 },
  cardCategory: { fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  cardTitle: { fontSize: 21, fontWeight: "800", marginTop: 10, letterSpacing: -0.4 },
  cardTagline: { fontSize: 14, lineHeight: 21, opacity: 0.65, marginTop: 8, marginBottom: 20 },
  cardFoot: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, marginTop: "auto", paddingTop: 18 },
  cardMetric: { fontSize: 20, fontWeight: "800", letterSpacing: -0.4 },
  cardMetricLabel: { fontSize: 11, opacity: 0.5, marginTop: 2, maxWidth: 170 },
  openBtn: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10 },
  openBtnText: { fontSize: 12, fontWeight: "800", letterSpacing: 0.5 },
  panel: { position: "absolute", overflow: "hidden", borderWidth: 1 },
  closeBtn: { position: "absolute", right: 18, width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  dCategory: { fontSize: 11, fontWeight: "900", letterSpacing: 1.5 },
  dTitle: { fontWeight: "800", letterSpacing: -1, marginTop: 10 },
  dTagline: { fontSize: 18, lineHeight: 27, opacity: 0.75, marginTop: 10, maxWidth: 760 },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  tag: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  tagText: { fontSize: 12, fontWeight: "700" },
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metric: { borderRadius: 20, padding: 18, flexGrow: 1 },
  metricValue: { fontWeight: "800", letterSpacing: -0.5 },
  metricLabel: { fontSize: 12, lineHeight: 17, opacity: 0.6, marginTop: 4 },
  dHead: { fontSize: 13, fontWeight: "900", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14, opacity: 0.9 },
  dText: { fontSize: 15, lineHeight: 24, opacity: 0.8 },
  step: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center", marginTop: -1 },
  stepText: { fontSize: 12, fontWeight: "800" },
  demoBtn: { alignSelf: "flex-start", borderRadius: 20, paddingHorizontal: 22, paddingVertical: 15 },
  demoBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  frame: { borderRadius: 22, overflow: "hidden", borderWidth: 1, backgroundColor: color.bgRaised },
  frameBar: { height: 36, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, gap: 12, borderBottomWidth: 1, borderBottomColor: color.border },
  light: { width: 10, height: 10, borderRadius: 5, opacity: 0.85 },
  urlBar: { flex: 1, maxWidth: 360, height: 22, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.06)", justifyContent: "center", paddingHorizontal: 10 },
  urlText: { fontSize: 11, color: color.faint, textAlign: "center" },
  tabs: { flexDirection: "row", gap: 8, marginTop: 14, flexWrap: "wrap" },
  tab: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9 },
  tabText: { fontSize: 13, fontWeight: "700" },
});
