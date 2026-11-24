import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { certifications, education, experience, profile, skillGroups } from "../data/profile";
import { c, font, radius, softShadow, useLayout, web, type InteractionState } from "../theme";
import { Reveal } from "./motion";
import { openUrl, Tag, TINT } from "./ui";

export function About() {
  const { bp } = useLayout();
  const wide = bp !== "phone";
  const cols = bp === "desktop" ? 3 : bp === "tablet" ? 3 : 1;
  return (
    <View style={{ gap: 20 }}>
      <View style={[{ gap: 20 }, wide && { flexDirection: "row" }]}>
        <Reveal style={wide ? { flex: 1.5 } : undefined}>
          <View style={[styles.card, { padding: 30 }, softShadow()]}>
            {profile.intro.map((p, i) => (
              <Text key={i} style={[styles.prose, i === 0 && styles.proseLead]}>
                {p}
              </Text>
            ))}
          </View>
        </Reveal>
        <Reveal delay={120} style={wide ? { flex: 1 } : undefined}>
          <View style={[styles.card, { padding: 26, gap: 18 }, softShadow()]}>
            <Text style={styles.small}>Experience</Text>
            {experience.map((e) => (
              <View key={e.role} style={styles.row}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                  <Text style={styles.rowTitle}>{e.role}</Text>
                  <Text style={styles.rowMeta}>{e.period}</Text>
                </View>
                <Text style={styles.rowSub}>{e.org}</Text>
                <Text style={styles.rowBody}>{e.summary}</Text>
              </View>
            ))}
          </View>
        </Reveal>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -10 }}>
        {skillGroups.map((g, i) => {
          const t = TINT[g.tint];
          return (
            <Reveal key={g.title} delay={i * 100} style={{ width: `${100 / cols}%`, padding: 10 }}>
              <HoverCard>
                <View style={[styles.skillIcon, { backgroundColor: t.bg }]}>
                  <Text style={{ color: t.fg, fontSize: 16 }}>{["◐", "◑", "◒"][i]}</Text>
                </View>
                <Text style={styles.skillTitle}>{g.title}</Text>
                <View style={styles.tagWrap}>
                  {g.items.map((s) => (
                    <Tag key={s} label={s} />
                  ))}
                </View>
              </HoverCard>
            </Reveal>
          );
        })}
      </View>

      <View style={[{ gap: 20 }, wide && { flexDirection: "row" }]}>
        <Reveal style={wide ? { flex: 1 } : undefined}>
          <View style={[styles.card, { padding: 26 }, softShadow()]}>
            <Text style={styles.small}>Education</Text>
            {education.map((e) => (
              <View key={e.school} style={styles.line}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{e.school}</Text>
                  <Text style={styles.rowSub}>{e.detail}</Text>
                </View>
                <Text style={styles.rowMeta}>{e.period}</Text>
              </View>
            ))}
          </View>
        </Reveal>
        <Reveal delay={120} style={wide ? { flex: 1 } : undefined}>
          <View style={[styles.card, { padding: 26 }, softShadow()]}>
            <Text style={styles.small}>Certifications</Text>
            {certifications.map((ce) => (
              <View key={ce.title} style={styles.line}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{ce.title}</Text>
                  <Text style={styles.rowSub}>{ce.issuer}</Text>
                </View>
                <Text style={styles.rowMeta}>{ce.date}</Text>
              </View>
            ))}
          </View>
        </Reveal>
      </View>
    </View>
  );
}

function HoverCard({ children }: { children: React.ReactNode }) {
  const [h, setH] = useState(false);
  return (
    <View
      {...({ onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) } as object)}
      style={[styles.card, { padding: 26, minHeight: 210 }, softShadow(h ? 1.7 : 1), h && { transform: [{ translateY: -4 }] }, web({ transition: "all 400ms cubic-bezier(.2,.8,.2,1)" })]}
    >
      {children}
    </View>
  );
}

export function Contact({ onResume }: { onResume: () => void }) {
  const { bp } = useLayout();
  const [copied, setCopied] = useState(false);
  const big = bp === "desktop" ? 58 : bp === "tablet" ? 44 : 30;
  const copy = async () => {
    try {
      if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(profile.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      // The mailto link still works if clipboard access is blocked.
    }
  };
  const links = [
    { label: "LinkedIn", url: profile.linkedin },
    { label: "GitHub", url: profile.github },
    { label: "Résumé (PDF)", url: "", action: onResume },
  ];
  return (
    <Reveal>
      <View style={[styles.contact, softShadow(1.4)]}>
        <View style={[styles.contactGlow, web({ filter: "blur(60px)" })]} pointerEvents="none" />
        <Text style={styles.small}>Let’s work together</Text>
        <Text style={[styles.contactTitle, { fontSize: big, lineHeight: big * 1.12 }]}>
          Have a role in <Text style={{ fontFamily: font.displayItalic, color: c.sage }}>design or data?</Text>
        </Text>
        <Text style={styles.contactSub}>I’m open to internships, on-site, hybrid or remote. Email is the fastest way to reach me.</Text>
        <View style={styles.contactRow}>
          <Pressable onPress={() => openUrl(`mailto:${profile.email}`)} accessibilityRole="link" style={(s) => [styles.mail, (s as InteractionState).hovered && { backgroundColor: c.sage }, web({ transition: "all 220ms ease" })]}>
            <Text style={styles.mailText}>{profile.email}</Text>
          </Pressable>
          {Platform.OS === "web" ? (
            <Pressable onPress={copy} accessibilityRole="button" style={(s) => [styles.copy, (s as InteractionState).hovered && { borderColor: c.ink }]}>
              <Text style={styles.copyText}>{copied ? "Copied ✓" : "Copy email"}</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.contactLinks}>
          {links.map((l) => (
            <Pressable key={l.label} onPress={() => (l.action ? l.action() : openUrl(l.url))} accessibilityRole="link">
              {(s) => <Text style={[styles.contactLink, (s as InteractionState).hovered && { color: c.sage }]}>{l.label} ↗</Text>}
            </Pressable>
          ))}
        </View>
      </View>
    </Reveal>
  );
}

export function Footer() {
  const { gutter, contentWidth, bp } = useLayout();
  return (
    <View style={{ paddingHorizontal: gutter, alignItems: "center", paddingTop: 70, paddingBottom: 36 }}>
      <View style={[styles.footer, { width: contentWidth }, bp === "phone" && { flexDirection: "column", alignItems: "flex-start" }]}>
        <Text style={styles.footText}>© 2026 Marc Bradley Arboleda</Text>
        <Text style={styles.footText}>Designed and built with Expo · Laguna, Philippines</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: c.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: c.line },
  prose: { fontFamily: font.regular, fontSize: 17, lineHeight: 29, color: c.body, marginTop: 14 },
  proseLead: { fontFamily: font.display, fontSize: 25, lineHeight: 36, color: c.ink, marginTop: 0, letterSpacing: -0.3 },
  small: { fontFamily: font.semibold, fontSize: 12.5, letterSpacing: 1.4, textTransform: "uppercase", color: c.muted, marginBottom: 6 },
  row: { borderTopWidth: 1, borderTopColor: c.line, paddingTop: 16 },
  rowTitle: { fontFamily: font.semibold, fontSize: 15.5, color: c.ink },
  rowSub: { fontFamily: font.medium, fontSize: 13.5, color: c.muted, marginTop: 2 },
  rowMeta: { fontFamily: font.medium, fontSize: 13, color: c.muted },
  rowBody: { fontFamily: font.regular, fontSize: 14.5, lineHeight: 22, color: c.body, marginTop: 8 },
  line: { flexDirection: "row", alignItems: "flex-start", gap: 12, borderTopWidth: 1, borderTopColor: c.line, paddingVertical: 14 },
  skillIcon: { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  skillTitle: { fontFamily: font.display, fontSize: 25, color: c.ink, marginTop: 16 },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 },
  contact: { backgroundColor: c.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: c.line, padding: 34, overflow: "hidden" },
  contactGlow: { position: "absolute", right: -80, top: -120, width: 380, height: 380, borderRadius: 190, backgroundColor: c.sageSoft, opacity: 0.9 },
  contactTitle: { fontFamily: font.display, color: c.ink, letterSpacing: -1, marginTop: 6, maxWidth: 760 },
  contactSub: { fontFamily: font.regular, fontSize: 17, lineHeight: 28, color: c.body, marginTop: 16, maxWidth: 560 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 30 },
  mail: { backgroundColor: c.ink, borderRadius: 999, paddingHorizontal: 22, paddingVertical: 15 },
  mailText: { fontFamily: font.semibold, fontSize: 15, color: c.white },
  copy: { borderRadius: 999, paddingHorizontal: 20, paddingVertical: 15, borderWidth: 1, borderColor: c.lineStrong },
  copyText: { fontFamily: font.semibold, fontSize: 15, color: c.ink },
  contactLinks: { flexDirection: "row", flexWrap: "wrap", gap: 26, marginTop: 30, borderTopWidth: 1, borderTopColor: c.line, paddingTop: 22 },
  contactLink: { fontFamily: font.semibold, fontSize: 15, color: c.ink },
  footer: { flexDirection: "row", justifyContent: "space-between", gap: 8, borderTopWidth: 1, borderTopColor: c.line, paddingTop: 20 },
  footText: { fontFamily: font.medium, fontSize: 13, color: c.muted },
});
