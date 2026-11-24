import { useState } from "react";
import { Image, LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from "react-native";
import { ARCHIVE, FEATURED, TRACKS, type Project, type Track } from "../data/projects";
import { color, font, useLayout, type InteractionState } from "../theme";
import { Body, Button, Chip, Mono, openUrl, Rule } from "./ui";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const animate = () => {
  if (Platform.OS !== "web") LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

type Filter = "All" | Track;

export function Work({ onDemo }: { onDemo: () => void }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState<string | null>(FEATURED[0].id);

  const match = (p: Project) => filter === "All" || p.tracks.includes(filter);
  const featured = FEATURED.filter(match);
  const archive = ARCHIVE.filter(match);
  const all = [...FEATURED, ...ARCHIVE];
  const countFor = (f: Filter) => (f === "All" ? all.length : all.filter((p) => p.tracks.includes(f)).length);

  return (
    <View>
      <View style={styles.filters}>
        <Mono dim style={{ marginRight: 6 }}>
          Filter
        </Mono>
        {(["All", ...TRACKS] as Filter[]).map((f) => (
          <Chip
            key={f}
            label={f}
            count={countFor(f)}
            active={filter === f}
            onPress={() => {
              animate();
              setFilter(f);
            }}
          />
        ))}
      </View>

      <Mono style={{ marginTop: 40, marginBottom: 4 }}>Selected work · {featured.length}</Mono>
      {featured.length === 0 ? <Body style={{ paddingVertical: 24 }}>No selected work in this category.</Body> : null}
      {featured.map((p, i) => (
        <FeaturedCase
          key={p.id}
          n={FEATURED.indexOf(p) + 1}
          project={p}
          first={i === 0}
          open={open === p.id}
          onToggle={() => {
            animate();
            setOpen(open === p.id ? null : p.id);
          }}
          onDemo={onDemo}
        />
      ))}
      <Rule />

      <Mono style={{ marginTop: 72, marginBottom: 16 }}>Archive · {archive.length}</Mono>
      <ArchiveTable rows={archive} />
    </View>
  );
}

function FeaturedCase({
  project: p,
  n,
  first,
  open,
  onToggle,
  onDemo,
}: {
  project: Project;
  n: number;
  first: boolean;
  open: boolean;
  onToggle: () => void;
  onDemo: () => void;
}) {
  const { bp, contentWidth } = useLayout();
  const wide = bp !== "phone";

  return (
    <View>
      {!first ? <Rule /> : <Rule style={{ backgroundColor: color.lineHi }} />}
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${p.title}. ${open ? "Collapse" : "Expand"} details`}
        style={(s) => [styles.caseHead, wide && { flexDirection: "row", gap: 32 }, (s as InteractionState).hovered && { backgroundColor: color.surface }]}
      >
        <View style={[wide && { width: contentWidth * 0.28 }, styles.caseMeta]}>
          <Text style={styles.caseNum}>{String(n).padStart(2, "0")}</Text>
          <View style={{ gap: 6, flex: 1 }}>
            <Mono>{[p.year, p.tracks.join(" · ")].filter(Boolean).join("  —  ")}</Mono>
            <Mono dim>{p.context}</Mono>
          </View>
        </View>
        <View style={{ flex: wide ? 1 : undefined, flexDirection: "row", alignItems: "flex-start", gap: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.caseTitle, { fontSize: bp === "phone" ? 30 : 38, lineHeight: bp === "phone" ? 34 : 42 }]}>{p.title}</Text>
            <Body style={{ marginTop: 12, maxWidth: 640 }}>{p.summary}</Body>
          </View>
          <Text style={[styles.toggle, open && { color: color.accent }]}>{open ? "−" : "+"}</Text>
        </View>
      </Pressable>

      {open ? (
        <View style={[styles.caseBody, wide && { marginLeft: contentWidth * 0.28 + 32 }]}>
          <View style={styles.kv}>
            <Mono dim>Role</Mono>
            <Text style={styles.kvValue}>{p.role}</Text>
          </View>
          <View style={{ gap: 10, marginTop: 8 }}>
            {p.points.map((pt) => (
              <View key={pt} style={styles.point}>
                <Text style={styles.bullet}>—</Text>
                <Body style={{ flex: 1, color: color.text, fontSize: 15, lineHeight: 24 }}>{pt}</Body>
              </View>
            ))}
          </View>
          <View style={styles.stack}>
            {p.stack.map((s) => (
              <Text key={s} style={styles.tag}>
                {s}
              </Text>
            ))}
          </View>
          {p.image ? (
            <View style={styles.imageFrame}>
              <Image source={p.image} style={styles.image} resizeMode="cover" accessibilityLabel={`${p.title} screenshot`} />
            </View>
          ) : null}
          <View style={{ flexDirection: "row", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            {p.demo ? <Button label="Try the live demo" icon="↓" variant="solid" onPress={onDemo} /> : null}
            {p.link ? <Button label={p.link.label} icon="↗" onPress={() => openUrl(p.link!.url)} /> : null}
          </View>
        </View>
      ) : null}
    </View>
  );
}

function ArchiveTable({ rows }: { rows: Project[] }) {
  const { bp } = useLayout();
  const [open, setOpen] = useState<string | null>(null);
  const wide = bp !== "phone";
  const desktop = bp === "desktop";

  if (rows.length === 0) return <Body>No archived projects in this category.</Body>;

  return (
    <View>
      {wide ? (
        <View style={[styles.aRow, { borderTopWidth: 0 }]}>
          <Mono dim style={styles.cYear}>
            Year
          </Mono>
          <Mono dim style={styles.cTitle}>
            Project
          </Mono>
          {desktop ? (
            <Mono dim style={styles.cContext}>
              Context
            </Mono>
          ) : null}
          <Mono dim style={styles.cStack}>
            Built with
          </Mono>
          <View style={styles.cGo} />
        </View>
      ) : null}
      {rows.map((p) => {
        const isOpen = open === p.id;
        return (
          <Pressable
            key={p.id}
            onPress={() => {
              animate();
              setOpen(isOpen ? null : p.id);
            }}
            accessibilityRole="button"
            accessibilityState={{ expanded: isOpen }}
            style={(s) => [styles.aWrap, (s as InteractionState).hovered && { backgroundColor: color.surface }]}
          >
            {(s) => {
              const hovered = (s as InteractionState).hovered;
              return (
                <>
                  {wide ? (
                    <View style={styles.aRow}>
                      <Text style={[styles.aMono, styles.cYear]}>{p.year ?? "—"}</Text>
                      <Text style={[styles.aTitle, styles.cTitle, hovered && { color: color.accent }]}>{p.title}</Text>
                      {desktop ? <Text style={[styles.aMuted, styles.cContext]}>{p.context}</Text> : null}
                      <Text style={[styles.aMuted, styles.cStack]} numberOfLines={isOpen ? undefined : 1}>
                        {p.stack.join(", ")}
                      </Text>
                      <Text style={[styles.aMono, styles.cGo, isOpen && { color: color.accent }]}>{isOpen ? "−" : "+"}</Text>
                    </View>
                  ) : (
                    <View style={[styles.aRow, { flexDirection: "column", alignItems: "stretch", gap: 4 }]}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={styles.aMono}>{p.year ?? "—"}</Text>
                        <Text style={[styles.aMono, isOpen && { color: color.accent }]}>{isOpen ? "−" : "+"}</Text>
                      </View>
                      <Text style={styles.aTitle}>{p.title}</Text>
                      <Text style={styles.aMuted}>{p.stack.join(", ")}</Text>
                    </View>
                  )}
                  {isOpen ? (
                    <View style={[styles.aDetail, wide && { paddingLeft: 92 }]}>
                      <Mono dim>
                        {p.context} · {p.role}
                      </Mono>
                      <Body style={{ marginTop: 8, maxWidth: 680, color: color.text, fontSize: 15, lineHeight: 24 }}>{p.summary}</Body>
                      {p.image ? (
                        <View style={[styles.imageFrame, { maxWidth: 560 }]}>
                          <Image source={p.image} style={styles.image} resizeMode="cover" accessibilityLabel={`${p.title} preview`} />
                        </View>
                      ) : null}
                      {p.link ? (
                        <View style={{ flexDirection: "row", marginTop: 16 }}>
                          <Button label={p.link.label} icon="↗" onPress={() => openUrl(p.link!.url)} />
                        </View>
                      ) : null}
                    </View>
                  ) : null}
                </>
              );
            }}
          </Pressable>
        );
      })}
      <Rule />
    </View>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" },
  caseHead: { paddingVertical: 28, gap: 14 },
  caseMeta: { flexDirection: "row", gap: 16 },
  caseNum: { fontFamily: font.mono, fontSize: 12, color: color.accent, letterSpacing: 1, paddingTop: 1 },
  caseTitle: { fontFamily: font.display, color: color.text, letterSpacing: -0.4 },
  toggle: { fontFamily: font.mono, fontSize: 22, color: color.muted, width: 22, textAlign: "center" },
  caseBody: { paddingBottom: 36 },
  kv: { flexDirection: "row", gap: 12, alignItems: "baseline", marginBottom: 10 },
  kvValue: { fontFamily: font.sansMedium, color: color.text, fontSize: 15 },
  point: { flexDirection: "row", gap: 12 },
  bullet: { fontFamily: font.mono, color: color.accent, fontSize: 14, lineHeight: 24 },
  stack: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 20 },
  tag: {
    fontFamily: font.mono,
    fontSize: 11,
    letterSpacing: 0.5,
    color: color.muted,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.lineHi,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  imageFrame: {
    marginTop: 24,
    aspectRatio: 16 / 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.lineHi,
    overflow: "hidden",
    backgroundColor: color.surface,
  },
  image: { width: "100%", height: "100%" },
  aWrap: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.line },
  aRow: { flexDirection: "row", alignItems: "center", paddingVertical: 16, gap: 16 },
  aDetail: { paddingBottom: 24 },
  aMono: { fontFamily: font.mono, fontSize: 12, color: color.faint, letterSpacing: 0.5 },
  aTitle: { fontFamily: font.sansMedium, fontSize: 16, color: color.text },
  aMuted: { fontFamily: font.sans, fontSize: 14, color: color.muted },
  cYear: { width: 76 },
  cTitle: { flex: 2.2 },
  cContext: { flex: 2 },
  cStack: { flex: 2 },
  cGo: { width: 20, textAlign: "right" },
});
