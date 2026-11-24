import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { certifications, education, experience, profile, skillGroups, stats } from "../data/profile";
import { color, font, useLayout, type InteractionState } from "../theme";
import { Body, Mono, openUrl, Rule } from "./ui";

/** Offset that lines content up with the section title column on wide screens. */
function useIndent() {
  const { bp, contentWidth } = useLayout();
  return bp === "phone" ? 0 : contentWidth * 0.28 + 32;
}

export function About() {
  const { bp } = useLayout();
  const indent = useIndent();
  return (
    <View style={{ marginLeft: indent }}>
      {profile.intro.map((p) => (
        <Text key={p.slice(0, 20)} style={[styles.prose, { fontSize: bp === "phone" ? 18 : 21, lineHeight: bp === "phone" ? 29 : 33 }]}>
          {p}
        </Text>
      ))}
      <View style={[styles.stats, bp === "phone" && { flexDirection: "column" }]}>
        {stats.map((s, i) => (
          <View
            key={s.label}
            style={[
              styles.stat,
              bp !== "phone" && i > 0 && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: color.line, paddingLeft: 24 },
              bp === "phone" && i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.line },
            ]}
          >
            <Text style={styles.statValue}>{s.value}</Text>
            <Body style={{ fontSize: 14, lineHeight: 21 }}>{s.label}</Body>
          </View>
        ))}
      </View>
    </View>
  );
}

export function Skills() {
  const { bp } = useLayout();
  const cols = bp === "desktop" ? 4 : bp === "tablet" ? 2 : 1;
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.line }}>
      {skillGroups.map((g, i) => (
        <View
          key={g.title}
          style={[
            styles.skillCol,
            { width: `${100 / cols}%` },
            i % cols !== 0 && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: color.line, paddingLeft: 20 },
          ]}
        >
          <Mono style={{ color: color.accent }}>{String(i + 1).padStart(2, "0")}</Mono>
          <Text style={styles.skillTitle}>{g.title}</Text>
          <View style={{ gap: 10, marginTop: 16 }}>
            {g.items.map((it) => (
              <Text key={it} style={styles.skillItem}>
                {it}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

export function Experience() {
  const { bp } = useLayout();
  const wide = bp !== "phone";
  const indent = useIndent();

  return (
    <View>
      {experience.map((e) => (
        <View key={e.role}>
          <Rule />
          <View style={[styles.expRow, wide && { flexDirection: "row", gap: 32 }]}>
            <View style={wide ? { width: indent - 32 } : undefined}>
              <Mono>{e.period}</Mono>
            </View>
            <View style={{ flex: wide ? 1 : undefined }}>
              <Text style={styles.expRole}>{e.role}</Text>
              <Mono dim style={{ marginTop: 6 }}>
                {e.org}
              </Mono>
              <View style={{ gap: 10, marginTop: 18 }}>
                {e.points.map((p) => (
                  <View key={p} style={{ flexDirection: "row", gap: 12 }}>
                    <Text style={styles.dash}>—</Text>
                    <Body style={{ flex: 1, fontSize: 15, lineHeight: 24, color: color.text }}>{p}</Body>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      ))}

      <View style={[{ marginTop: 64, gap: 48 }, wide && { flexDirection: "row" }]}>
        <View style={{ flex: 1 }}>
          <Mono style={{ marginBottom: 12 }}>Education</Mono>
          {education.map((ed) => (
            <View key={ed.school} style={styles.listRow}>
              <Text style={styles.listTitle}>{ed.school}</Text>
              <Body style={{ fontSize: 14, lineHeight: 21 }}>{ed.detail}</Body>
              <Mono dim style={{ marginTop: 6 }}>
                {ed.period} · {ed.place}
              </Mono>
            </View>
          ))}
        </View>
        <View style={{ flex: 1 }}>
          <Mono style={{ marginBottom: 12 }}>Certifications</Mono>
          {certifications.map((c) => (
            <View key={c.title} style={[styles.listRow, { flexDirection: "row", justifyContent: "space-between", gap: 16 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listTitle}>{c.title}</Text>
                <Body style={{ fontSize: 14, lineHeight: 21 }}>
                  {c.issuer}
                  {c.note ? ` · ${c.note}` : ""}
                </Body>
              </View>
              <Mono dim style={{ paddingTop: 4 }}>
                {c.date}
              </Mono>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export function Contact({ onResume }: { onResume: () => void }) {
  const { bp } = useLayout();
  const [copied, setCopied] = useState(false);
  const big = bp === "desktop" ? 76 : bp === "tablet" ? 56 : 34;

  const copy = async () => {
    try {
      if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(profile.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      // Clipboard can be blocked; the mailto link still works.
    }
  };

  const links = [
    { label: "Email", value: profile.email, url: `mailto:${profile.email}` },
    { label: "LinkedIn", value: profile.linkedinLabel, url: profile.linkedin },
    { label: "GitHub", value: profile.githubLabel, url: profile.github },
    { label: "Résumé", value: "Download PDF", url: "", action: onResume },
  ];

  return (
    <View>
      <Pressable onPress={() => openUrl(`mailto:${profile.email}`)} accessibilityRole="link" accessibilityLabel={`Email ${profile.email}`}>
        {(s) => (
          <Text style={[styles.bigMail, { fontSize: big, lineHeight: big * 1.1 }, (s as InteractionState).hovered && { color: color.accent }]}>
            {profile.email.replace("@", "​@")}
          </Text>
        )}
      </Pressable>
      {Platform.OS === "web" ? (
        <Pressable onPress={copy} accessibilityRole="button" style={{ alignSelf: "flex-start", marginTop: 16 }}>
          {(s) => (
            <Mono style={(s as InteractionState).hovered ? { color: color.text } : undefined}>{copied ? "✓ Copied to clipboard" : "Copy address"}</Mono>
          )}
        </Pressable>
      ) : null}

      <View style={{ marginTop: 56 }}>
        {links.map((l) => (
          <Pressable key={l.label} onPress={() => (l.action ? l.action() : openUrl(l.url))} accessibilityRole="link">
            {(s) => {
              const hovered = (s as InteractionState).hovered;
              return (
                <View style={styles.linkRow}>
                  <Mono style={{ width: 110 }}>{l.label}</Mono>
                  <Text style={[styles.linkValue, hovered && { color: color.accent }]} numberOfLines={1}>
                    {l.value}
                  </Text>
                  <Text style={[styles.arrow, hovered && { color: color.accent, transform: [{ translateX: 4 }] }]}>↗</Text>
                </View>
              );
            }}
          </Pressable>
        ))}
        <Rule />
      </View>
    </View>
  );
}

export function Footer() {
  const { gutter, contentWidth, bp } = useLayout();
  return (
    <View style={{ paddingHorizontal: gutter, alignItems: "center", paddingTop: 120, paddingBottom: 40 }}>
      <View style={{ width: contentWidth }}>
        <Text style={[styles.footName, { fontSize: bp === "phone" ? 52 : 120, lineHeight: bp === "phone" ? 56 : 120 }]}>
          Marc <Text style={{ fontFamily: font.displayItalic, color: color.muted }}>Arboleda</Text>
        </Text>
        <View style={[styles.footRow, bp === "phone" && { flexDirection: "column", alignItems: "flex-start" }]}>
          <Mono dim>© 2026 · Built with Expo & React Native Web</Mono>
          <Mono dim>{profile.location}</Mono>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  prose: { fontFamily: font.sans, color: color.text, marginBottom: 20, maxWidth: 720 },
  stats: { flexDirection: "row", marginTop: 28, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.line },
  stat: { flex: 1, paddingVertical: 20, paddingRight: 16 },
  statValue: { fontFamily: font.display, fontSize: 56, lineHeight: 60, color: color.text },
  skillCol: { paddingVertical: 24, paddingRight: 20 },
  skillTitle: { fontFamily: font.display, fontSize: 30, color: color.text, marginTop: 8 },
  skillItem: { fontFamily: font.sans, fontSize: 14, lineHeight: 21, color: color.muted },
  expRow: { paddingVertical: 28, gap: 10 },
  expRole: { fontFamily: font.display, fontSize: 34, lineHeight: 38, color: color.text },
  dash: { fontFamily: font.mono, color: color.accent, fontSize: 14, lineHeight: 24 },
  listRow: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.line, paddingVertical: 16 },
  listTitle: { fontFamily: font.sansMedium, fontSize: 16, color: color.text, marginBottom: 2 },
  bigMail: { fontFamily: font.display, color: color.text, letterSpacing: -0.5 },
  linkRow: { flexDirection: "row", alignItems: "center", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.line, paddingVertical: 20, gap: 12 },
  linkValue: { fontFamily: font.sans, fontSize: 17, color: color.text, flex: 1 },
  arrow: { fontFamily: font.mono, fontSize: 16, color: color.muted },
  footName: { fontFamily: font.display, color: color.text, letterSpacing: -2 },
  footRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 32, gap: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.line, paddingTop: 16 },
});
