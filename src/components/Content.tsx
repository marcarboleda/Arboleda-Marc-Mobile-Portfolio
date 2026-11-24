import { useState, type ReactNode } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { certifications, education, experience, profile, skillGroups } from "../data/profile";
import { color, font, radius, useLayout, webOnly, type InteractionState } from "../theme";
import { Glass, openUrl } from "./ui";

export function About() {
  const { bp } = useLayout();
  const wide = bp !== "phone";
  return (
    <View style={[{ gap: 20 }, wide && { flexDirection: "row" }]}>
      <Glass style={[styles.aboutMain, wide && { flex: 1.6 }]}>
        {profile.intro.map((p, i) => (
          <Text key={i} style={[styles.prose, i === 0 && { color: color.text }, { fontSize: bp === "phone" ? 18 : 21, lineHeight: bp === "phone" ? 29 : 33 }]}>
            {p}
          </Text>
        ))}
      </Glass>
      <View style={[{ gap: 20 }, wide && { flex: 1 }]}>
        {[
          { k: "Focus", v: "Data analytics · QA · Data management" },
          { k: "Education", v: "BS Computer Science, De La Salle Lipa (2023 – present)" },
          { k: "Languages", v: "Python · R · C# · C++ · TypeScript · Java" },
        ].map((x) => (
          <Glass key={x.k} style={styles.aboutTile}>
            <Text style={styles.tileLabel}>{x.k}</Text>
            <Text style={styles.tileValue}>{x.v}</Text>
          </Glass>
        ))}
      </View>
    </View>
  );
}

export function Skills() {
  const { bp } = useLayout();
  const cols = bp === "desktop" ? 4 : bp === "tablet" ? 2 : 1;
  const icons = ["▦", "◎", "◇", "⌘"];
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -8 }}>
      {skillGroups.map((g, i) => (
        <View key={g.title} style={{ width: `${100 / cols}%`, padding: 8 }}>
          <HoverGlass style={styles.skillCard}>
            <View style={styles.skillIcon}>
              <Text style={{ color: color.accent, fontSize: 18 }}>{icons[i]}</Text>
            </View>
            <Text style={styles.skillTitle}>{g.title}</Text>
            <View style={{ gap: 10, marginTop: 16 }}>
              {g.items.map((it) => (
                <View key={it} style={{ flexDirection: "row", gap: 10 }}>
                  <Text style={{ color: color.faint, fontFamily: font.mono, fontSize: 13, lineHeight: 21 }}>—</Text>
                  <Text style={styles.skillItem}>{it}</Text>
                </View>
              ))}
            </View>
          </HoverGlass>
        </View>
      ))}
    </View>
  );
}

function HoverGlass({ children, style }: { children: ReactNode; style?: object }) {
  const [h, setH] = useState(false);
  return (
    <View
      style={[styles.hoverGlass, h && { borderColor: color.borderHi, transform: [{ translateY: -3 }] }, webOnly({ transitionDuration: "220ms" }), style]}
      {...({ onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) } as object)}
    >
      {children}
    </View>
  );
}

export function Experience() {
  const { bp } = useLayout();
  const wide = bp !== "phone";

  return (
    <View style={[{ gap: 20 }, bp === "desktop" && { flexDirection: "row", alignItems: "flex-start" }]}>
      <View style={[{ gap: 20 }, bp === "desktop" && { flex: 1.5 }]}>
        {experience.map((e, i) => (
          <HoverGlass key={e.role} style={styles.expCard}>
            <View style={[styles.expHead, !wide && { flexDirection: "column", alignItems: "flex-start", gap: 6 }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={[styles.expDot, i > 0 && { backgroundColor: color.faint }]} />
                <Text style={styles.expRole}>{e.role}</Text>
              </View>
              <Text style={styles.expPeriod}>{e.period}</Text>
            </View>
            <Text style={styles.expOrg}>{e.org}</Text>
            <View style={{ gap: 10, marginTop: 16 }}>
              {e.points.map((p) => (
                <View key={p} style={{ flexDirection: "row", gap: 12 }}>
                  <Text style={{ color: color.accent, fontFamily: font.mono, lineHeight: 23 }}>›</Text>
                  <Text style={styles.expPoint}>{p}</Text>
                </View>
              ))}
            </View>
          </HoverGlass>
        ))}
      </View>

      <View style={[{ gap: 20 }, bp === "desktop" && { flex: 1 }]}>
        <HoverGlass style={styles.expCard}>
          <Text style={styles.tileLabel}>Education</Text>
          {education.map((ed) => (
            <View key={ed.school} style={styles.listRow}>
              <Text style={styles.listTitle}>{ed.school}</Text>
              <Text style={styles.listSub}>{ed.detail}</Text>
              <Text style={styles.listMeta}>
                {ed.period} · {ed.place}
              </Text>
            </View>
          ))}
        </HoverGlass>
        <HoverGlass style={styles.expCard}>
          <Text style={styles.tileLabel}>Certifications</Text>
          {certifications.map((c) => (
            <View key={c.title} style={[styles.listRow, { flexDirection: "row", justifyContent: "space-between", gap: 12 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listTitle}>{c.title}</Text>
                <Text style={styles.listSub}>
                  {c.issuer}
                  {c.note ? ` · ${c.note}` : ""}
                </Text>
              </View>
              <Text style={styles.listMeta}>{c.date}</Text>
            </View>
          ))}
        </HoverGlass>
      </View>
    </View>
  );
}

export function Contact({ onResume }: { onResume: () => void }) {
  const { bp } = useLayout();
  const [copied, setCopied] = useState(false);
  const big = bp === "desktop" ? 64 : bp === "tablet" ? 48 : 30;

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
    { label: "LinkedIn", value: profile.linkedinLabel, url: profile.linkedin },
    { label: "GitHub", value: profile.githubLabel, url: profile.github },
    { label: "Résumé", value: "Download PDF", url: "", action: onResume },
  ];

  return (
    <View style={styles.contactCard}>
      <View style={[styles.glow, webOnly({ filter: "blur(90px)" })]} pointerEvents="none" />
      <Text style={styles.tileLabel}>Email me at</Text>
      <Pressable onPress={() => openUrl(`mailto:${profile.email}`)} accessibilityRole="link" accessibilityLabel={`Email ${profile.email}`}>
        {(s) => (
          <Text style={[styles.bigMail, { fontSize: big, lineHeight: big * 1.15, letterSpacing: -big * 0.035 }, (s as InteractionState).hovered && { color: color.accent }]}>
            {profile.email.replace("@", "​@")}
          </Text>
        )}
      </Pressable>
      <View style={{ flexDirection: "row", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
        <Pressable onPress={() => openUrl(`mailto:${profile.email}`)} style={(s) => [styles.mailBtn, (s as InteractionState).hovered && { backgroundColor: "#D4FA8A" }]} accessibilityRole="link">
          <Text style={styles.mailBtnText}>Send an email ↗</Text>
        </Pressable>
        {Platform.OS === "web" ? (
          <Pressable onPress={copy} accessibilityRole="button" style={(s) => [styles.copyBtn, (s as InteractionState).hovered && { borderColor: color.borderHi }]}>
            <Text style={styles.copyText}>{copied ? "✓ Copied" : "Copy address"}</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={[styles.linkGrid, bp === "phone" && { flexDirection: "column" }]}>
        {links.map((l) => (
          <Pressable key={l.label} onPress={() => (l.action ? l.action() : openUrl(l.url))} accessibilityRole="link" style={{ flex: 1 }}>
            {(s) => {
              const hovered = (s as InteractionState).hovered;
              return (
                <View style={[styles.linkTile, hovered && { borderColor: color.borderHi, backgroundColor: color.glassHi }]}>
                  <Text style={styles.tileLabel}>{l.label}</Text>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                    <Text style={styles.linkValue} numberOfLines={1}>
                      {l.value}
                    </Text>
                    <Text style={[styles.arrow, hovered && { color: color.accent }]}>↗</Text>
                  </View>
                </View>
              );
            }}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function Footer() {
  const { gutter, contentWidth, bp } = useLayout();
  return (
    <View style={{ paddingHorizontal: gutter, alignItems: "center", paddingTop: 100, paddingBottom: 36 }}>
      <View style={{ width: contentWidth }}>
        <View style={[styles.footRow, bp === "phone" && { flexDirection: "column", alignItems: "flex-start" }]}>
          <Text style={styles.footText}>© 2026 Marc Bradley Arboleda</Text>
          <Text style={styles.footText}>Built with Expo · React Native Web · deployed on Vercel</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  aboutMain: { padding: 28, gap: 18, borderRadius: radius.xl },
  prose: { fontFamily: font.regular, color: color.muted },
  aboutTile: { padding: 22, borderRadius: radius.lg },
  tileLabel: { fontFamily: font.mono, fontSize: 11, letterSpacing: 1.2, color: color.faint, textTransform: "uppercase" },
  tileValue: { fontFamily: font.medium, fontSize: 16, lineHeight: 24, color: color.text, marginTop: 8 },
  hoverGlass: { backgroundColor: color.glass, borderWidth: 1, borderColor: color.border, borderRadius: radius.lg },
  skillCard: { padding: 24, flex: 1 },
  skillIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: color.accentSoft, alignItems: "center", justifyContent: "center" },
  skillTitle: { fontFamily: font.semibold, fontSize: 22, color: color.text, marginTop: 18, letterSpacing: -0.5 },
  skillItem: { flex: 1, fontFamily: font.regular, fontSize: 14, lineHeight: 21, color: color.muted },
  expCard: { padding: 24 },
  expHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  expDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: color.accent },
  expRole: { fontFamily: font.semibold, fontSize: 22, color: color.text, letterSpacing: -0.5 },
  expPeriod: { fontFamily: font.mono, fontSize: 12, color: color.muted },
  expOrg: { fontFamily: font.regular, fontSize: 14, color: color.faint, marginTop: 6, marginLeft: 22 },
  expPoint: { flex: 1, fontFamily: font.regular, fontSize: 15, lineHeight: 23, color: color.text, opacity: 0.9 },
  listRow: { borderTopWidth: 1, borderTopColor: color.border, paddingVertical: 14 },
  listTitle: { fontFamily: font.medium, fontSize: 15, color: color.text },
  listSub: { fontFamily: font.regular, fontSize: 14, color: color.muted, marginTop: 2 },
  listMeta: { fontFamily: font.mono, fontSize: 12, color: color.faint, marginTop: 4 },
  contactCard: { borderRadius: radius.xl, borderWidth: 1, borderColor: color.borderHi, padding: 28, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.03)" },
  glow: { position: "absolute", right: -100, top: -140, width: 420, height: 420, borderRadius: 210, backgroundColor: "rgba(197,243,107,0.12)" },
  bigMail: { fontFamily: font.semibold, color: color.text, marginTop: 10 },
  mailBtn: { backgroundColor: color.accent, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 13 },
  mailBtnText: { fontFamily: font.semibold, fontSize: 15, color: color.accentInk },
  copyBtn: { borderRadius: 999, paddingHorizontal: 20, paddingVertical: 13, borderWidth: 1, borderColor: color.border },
  copyText: { fontFamily: font.medium, fontSize: 15, color: color.text },
  linkGrid: { flexDirection: "row", gap: 12, marginTop: 36 },
  linkTile: { borderRadius: radius.md, borderWidth: 1, borderColor: color.border, padding: 18, backgroundColor: color.glass },
  linkValue: { fontFamily: font.medium, fontSize: 16, color: color.text, flex: 1 },
  arrow: { fontFamily: font.mono, fontSize: 16, color: color.muted },
  footRow: { flexDirection: "row", justifyContent: "space-between", gap: 8, borderTopWidth: 1, borderTopColor: color.border, paddingTop: 20 },
  footText: { fontFamily: font.mono, fontSize: 12, color: color.faint },
});
