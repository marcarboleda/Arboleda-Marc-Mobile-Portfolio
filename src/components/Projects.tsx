import { useState, type ReactNode } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { PROJECTS, type Project, type Visual } from "../data/projects";
import { color, font, radius, useLayout, webOnly, type InteractionState } from "../theme";
import { HelmetCurve, TabulaResultsChart } from "./Charts";
import { RegistryDemo } from "./RegistryDemo";
import { useReveal } from "./Section";
import { Button, Chip, Pill } from "./ui";

export function Projects({ visible }: { visible: boolean }) {
  return (
    <View style={{ gap: 28 }}>
      {PROJECTS.map((p, i) => (
        <ProjectCard key={p.id} project={p} flip={i % 2 === 1} visible={visible} delay={i * 120} />
      ))}
    </View>
  );
}

function ProjectCard({ project: p, flip, visible, delay }: { project: Project; flip: boolean; visible: boolean; delay: number }) {
  const { bp } = useLayout();
  const wide = bp === "desktop";
  const reveal = useReveal(visible, delay);
  const [demo, setDemo] = useState(false);
  const [hover, setHover] = useState(false);

  return (
    <Animated.View
      style={[styles.card, hover && styles.cardHover, webOnly({ transitionDuration: "250ms" }), reveal]}
      {...({ onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) } as object)}
    >
      <View style={[styles.glow, flip ? { left: -120 } : { right: -120 }]} pointerEvents="none" />
      <View style={styles.head}>
        <Text style={styles.index}>{p.index}</Text>
        <Text style={styles.category}>{p.category}</Text>
        <Text style={styles.year}>{p.year}</Text>
      </View>

      <View style={[{ gap: wide ? 44 : 28 }, wide && { flexDirection: flip ? "row-reverse" : "row" }]}>
        <View style={wide ? { flex: 1.15 } : undefined}>
          <Gallery visuals={p.visuals} />
        </View>

        <View style={wide ? { flex: 1 } : undefined}>
          <Text style={[styles.title, { fontSize: bp === "phone" ? 32 : 42, lineHeight: bp === "phone" ? 36 : 46 }]}>{p.title}</Text>
          <Text style={styles.tagline}>{p.tagline}</Text>

          <View style={styles.roleRow}>
            <Pill label={p.role} tone="accent" />
            <Pill label={p.team} />
          </View>

          <Text style={styles.summary}>{p.summary}</Text>

          <Text style={styles.subhead}>What I did</Text>
          <View style={{ gap: 12 }}>
            {p.did.map((d) => (
              <View key={d} style={styles.didRow}>
                <View style={styles.check}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
                <Text style={styles.didText}>{d}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={[styles.metrics, bp === "phone" && { flexWrap: "wrap" }]}>
        {p.metrics.map((m) => (
          <View key={m.label} style={[styles.metric, bp === "phone" && { flexBasis: "47%" }]}>
            <Text style={[styles.metricValue, bp === "phone" && { fontSize: 21 }]}>
              {m.value}
            </Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.stack}>
          {p.stack.map((s) => (
            <Pill key={s} label={s} />
          ))}
        </View>
        {p.demo ? <Button label={demo ? "Hide interactive demo" : "Try the interactive demo"} icon={demo ? "↑" : "↓"} variant="primary" onPress={() => setDemo(!demo)} /> : null}
      </View>

      {p.demo && demo ? (
        <View style={{ marginTop: 24 }}>
          <Text style={styles.demoNote}>
            A working copy of the registry with the same columns, validation and search logic. Every name, email and link is fictional.
          </Text>
          <RegistryDemo />
        </View>
      ) : null}
    </Animated.View>
  );
}

function Gallery({ visuals }: { visuals: Visual[] }) {
  const [i, setI] = useState(0);
  const v = visuals[i];
  return (
    <View>
      <BrowserFrame url={v.kind === "image" ? v.url : v.label}>
        {v.kind === "image" ? (
          <View style={{ aspectRatio: v.aspect, width: "100%" }}>
            <Image source={v.source} style={{ width: "100%", height: "100%" }} resizeMode="cover" accessibilityLabel={v.label} />
          </View>
        ) : (
          <View style={{ padding: 18, backgroundColor: "#09090C" }}>{v.kind === "helmet-chart" ? <HelmetCurve /> : <TabulaResultsChart />}</View>
        )}
      </BrowserFrame>
      {visuals.length > 1 ? (
        <View style={styles.tabs}>
          {visuals.map((x, k) => (
            <Chip key={x.label} label={x.label} active={k === i} onPress={() => setI(k)} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function BrowserFrame({ url, children }: { url?: string; children: ReactNode }) {
  return (
    <View style={styles.frame}>
      <View style={styles.frameBar}>
        <View style={{ flexDirection: "row", gap: 6 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <View key={c} style={[styles.light, { backgroundColor: c }]} />
          ))}
        </View>
        <View style={styles.urlBar}>
          <Text style={styles.urlText} numberOfLines={1}>
            {url}
          </Text>
        </View>
        <View style={{ width: 42 }} />
      </View>
      {children}
    </View>
  );
}

export function GithubCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link" style={(s) => [styles.ghCard, (s as InteractionState).hovered && { borderColor: color.borderHi }]}>
      <Text style={styles.ghText}>More coursework and side projects are on GitHub</Text>
      <Text style={styles.ghLink}>github.com/marcarboleda ↗</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: "rgba(255,255,255,0.025)",
    padding: 22,
    overflow: "hidden",
  },
  cardHover: { borderColor: color.borderHi, backgroundColor: "rgba(255,255,255,0.035)" },
  glow: {
    position: "absolute",
    top: -160,
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: "rgba(197,243,107,0.07)",
    ...webOnly({ filter: "blur(80px)" }),
  },
  head: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 22, flexWrap: "wrap" },
  index: { fontFamily: font.monoMedium, fontSize: 13, color: color.accent },
  category: { fontFamily: font.mono, fontSize: 12, letterSpacing: 0.8, color: color.muted, textTransform: "uppercase", flex: 1 },
  year: { fontFamily: font.mono, fontSize: 12, color: color.faint },
  title: { fontFamily: font.semibold, color: color.text, letterSpacing: -1.4 },
  tagline: { fontFamily: font.regular, fontSize: 18, lineHeight: 27, color: color.text, opacity: 0.85, marginTop: 12 },
  roleRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 18 },
  summary: { fontFamily: font.regular, fontSize: 15, lineHeight: 24, color: color.muted, marginTop: 18 },
  subhead: { fontFamily: font.mono, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", color: color.accent, marginTop: 26, marginBottom: 14 },
  didRow: { flexDirection: "row", gap: 12 },
  check: { width: 20, height: 20, borderRadius: 10, backgroundColor: color.accentSoft, alignItems: "center", justifyContent: "center", marginTop: 2 },
  checkMark: { color: color.accent, fontSize: 11, fontFamily: font.bold },
  didText: { flex: 1, fontFamily: font.regular, fontSize: 15, lineHeight: 23, color: color.text },
  metrics: { flexDirection: "row", gap: 10, marginTop: 30 },
  metric: { flex: 1, borderRadius: radius.md, borderWidth: 1, borderColor: color.border, backgroundColor: "rgba(0,0,0,0.25)", padding: 16 },
  metricValue: { fontFamily: font.semibold, fontSize: 26, color: color.text, letterSpacing: -0.8 },
  metricLabel: { fontFamily: font.regular, fontSize: 13, lineHeight: 18, color: color.muted, marginTop: 4 },
  footer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16, marginTop: 22 },
  stack: { flexDirection: "row", flexWrap: "wrap", gap: 8, flex: 1, minWidth: 260 },
  demoNote: { fontFamily: font.regular, fontSize: 14, lineHeight: 22, color: color.muted, marginBottom: 14 },
  frame: { borderRadius: radius.md, overflow: "hidden", borderWidth: 1, borderColor: color.borderHi, backgroundColor: "#0E0E12" },
  frameBar: { height: 36, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: color.border, gap: 12 },
  light: { width: 10, height: 10, borderRadius: 5, opacity: 0.85 },
  urlBar: { flex: 1, maxWidth: 360, height: 22, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.05)", justifyContent: "center", paddingHorizontal: 10 },
  urlText: { fontFamily: font.mono, fontSize: 11, color: color.faint, textAlign: "center" },
  tabs: { flexDirection: "row", gap: 8, marginTop: 12, flexWrap: "wrap" },
  ghCard: {
    marginTop: 28,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: color.border,
    padding: 22,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  ghText: { fontFamily: font.regular, fontSize: 15, color: color.muted },
  ghLink: { fontFamily: font.medium, fontSize: 15, color: color.text },
});
