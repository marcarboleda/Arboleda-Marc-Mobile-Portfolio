import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { certifications, education, experience, profile, skillGroups } from "../data/profile";
import { c, font, radius, softShadow, useLayout, web, type InteractionState } from "../theme";
import { Reveal } from "./motion";
import { openUrl, Tag, TINT } from "./ui";

// ─── Skill category icons ────────────────────────────────────────────────────

type SkillIconDef = { lib: "Feather" | "MCI"; name: string };
const SKILL_ICONS: Record<string, SkillIconDef> = {
  Design: { lib: "Feather", name: "pen-tool" },
  Data:   { lib: "Feather", name: "bar-chart-2" },
  Build:  { lib: "Feather", name: "code" },
};

function SkillCatIcon({ def, size, color }: { def: SkillIconDef; size: number; color: string }) {
  if (def.lib === "MCI") return <MaterialCommunityIcons name={def.name as any} size={size} color={color} />;
  return <Feather name={def.name as any} size={size} color={color} />;
}

// ─── Tool icon definitions ───────────────────────────────────────────────────

type ToolIconDef =
  | { lib: "MCI"; name: string; color: string }
  | { lib: "Feather"; name: string; color: string };

const TOOL_ICONS: Record<string, ToolIconDef> = {
  "Google Sheets":       { lib: "MCI",    name: "google-spreadsheet", color: "#0F9D58" },
  "Excel":               { lib: "MCI",    name: "microsoft-excel",    color: "#217346" },
  "Python":              { lib: "MCI",    name: "language-python",    color: "#3572A5" },
  "R":                   { lib: "MCI",    name: "language-r",         color: "#276DC3" },
  "Unity":               { lib: "MCI",    name: "unity",              color: "#1E2230" },
  "React / React Native":{ lib: "MCI",    name: "react",              color: "#61DAFB" },
  "TypeScript":          { lib: "MCI",    name: "language-typescript", color: "#3178C6" },
  "Supabase":            { lib: "Feather", name: "database",           color: "#3ECF8E" },
  "Git":                 { lib: "MCI",    name: "git",                color: "#F05032" },
  "GitHub":              { lib: "MCI",    name: "github",             color: "#24292F" },
};

function ToolIcon({ name, size }: { name: string; size: number }) {
  const def = TOOL_ICONS[name];
  if (!def) return null;
  if (def.lib === "MCI") return <MaterialCommunityIcons name={def.name as any} size={size} color={def.color} />;
  return <Feather name={def.name as any} size={size} color={def.color} />;
}

// ─── About ───────────────────────────────────────────────────────────────────

export function About() {
  return (
    <Reveal>
      <View style={[styles.card, { padding: 32 }, softShadow()]}>
        {profile.intro.map((p, i) => (
          <Text key={i} style={[styles.prose, i === 0 && styles.proseLead]}>
            {p}
          </Text>
        ))}
      </View>
    </Reveal>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────

export function ExperienceSection() {
  return (
    <Reveal>
      <View style={[styles.card, { padding: 28, gap: 0 }, softShadow()]}>
        {experience.map((e, i) => (
          <View key={e.role} style={[styles.expRow, i === 0 && { borderTopWidth: 0, paddingTop: 0 }]}>
            <View style={styles.expDot} />
            <View style={{ flex: 1, gap: 4 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <Text style={styles.rowTitle}>{e.role}</Text>
                <Text style={styles.rowMeta}>{e.period}</Text>
              </View>
              <Text style={styles.rowSub}>{e.org}</Text>
              <Text style={styles.rowBody}>{e.summary}</Text>
            </View>
          </View>
        ))}
      </View>
    </Reveal>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export function SkillsSection() {
  const { bp } = useLayout();
  const cols = bp === "desktop" ? 3 : bp === "tablet" ? 3 : 1;
  return (
    <>
      <Text style={styles.sectionLede}>
        These are the areas I've worked with through my academic projects, personal learning, and organizational experience.
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -10, marginTop: 24 }}>
        {skillGroups.map((g, i) => {
          const t = TINT[g.tint];
          const iconDef = SKILL_ICONS[g.title];
          return (
            <Reveal key={g.title} delay={i * 100} style={{ width: `${100 / cols}%`, padding: 10 }}>
              <HoverCard>
                <View style={[styles.skillIconWrap, { backgroundColor: t.bg }]}>
                  {iconDef && <SkillCatIcon def={iconDef} size={22} color={t.fg} />}
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
    </>
  );
}

// ─── Tools ───────────────────────────────────────────────────────────────────

const TOOLS = [
  "Google Sheets",
  "Excel",
  "Python",
  "R",
  "Unity",
  "React / React Native",
  "TypeScript",
  "Supabase",
  "Git",
  "GitHub",
] as const;

export function ToolsSection() {
  const { bp } = useLayout();
  const cols = bp === "desktop" ? 5 : bp === "tablet" ? 4 : 3;
  return (
    <>
      <Text style={styles.sectionLede}>
        Some of the tools and technologies I use for designing interfaces, working with data, and building applications.
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -8, marginTop: 24 }}>
        {TOOLS.map((name, i) => {
          const def = TOOL_ICONS[name];
          if (!def) return null;
          return (
            <Reveal key={name} delay={i * 55} style={{ width: `${100 / cols}%`, padding: 8 }}>
              <View style={[styles.toolCard, softShadow()]}>
                <View style={[styles.toolIconWrap, { backgroundColor: def.color + "18" }]}>
                  <ToolIcon name={name} size={28} />
                </View>
                <Text style={styles.toolName} numberOfLines={2}>{name}</Text>
              </View>
            </Reveal>
          );
        })}
      </View>
    </>
  );
}

// ─── Education ───────────────────────────────────────────────────────────────

export function EducationSection() {
  return (
    <>
      <Text style={styles.sectionLede}>
        My academic background in computer science and the foundation behind the projects I've worked on.
      </Text>
      <Reveal style={{ marginTop: 24 }}>
        <View style={[styles.card, { padding: 28 }, softShadow()]}>
          {education.map((e, i) => (
            <View key={e.school} style={[styles.line, i === 0 && { borderTopWidth: 0, paddingTop: 0 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{e.school}</Text>
                <Text style={styles.rowSub}>{e.detail}</Text>
              </View>
              <Text style={styles.rowMeta}>{e.period}</Text>
            </View>
          ))}
        </View>
      </Reveal>
    </>
  );
}

// ─── Certifications ───────────────────────────────────────────────────────────

export function CertificationsSection() {
  return (
    <>
      <Text style={styles.sectionLede}>
        Courses and certifications I've completed as part of my continued learning in programming, data science, and artificial intelligence.
      </Text>
      <Reveal style={{ marginTop: 24 }}>
        <View style={[styles.card, { padding: 28 }, softShadow()]}>
          {certifications.map((ce, i) => (
            <View key={ce.title} style={[styles.line, i === 0 && { borderTopWidth: 0, paddingTop: 0 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{ce.title}</Text>
                <Text style={styles.rowSub}>{ce.issuer}</Text>
              </View>
              <Text style={styles.rowMeta}>{ce.date}</Text>
            </View>
          ))}
        </View>
      </Reveal>
    </>
  );
}

// ─── HoverCard ───────────────────────────────────────────────────────────────

function HoverCard({ children }: { children: React.ReactNode }) {
  const [h, setH] = useState(false);
  return (
    <View
      {...({ onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) } as object)}
      style={[
        styles.card,
        { padding: 26, minHeight: 210 },
        softShadow(h ? 1.7 : 1),
        h && { transform: [{ translateY: -4 }] },
        web({ transition: "all 400ms cubic-bezier(.2,.8,.2,1)" }),
      ]}
    >
      {children}
    </View>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export function Contact({ onResume }: { onResume: () => void }) {
  const { bp } = useLayout();
  const big = bp === "desktop" ? 52 : bp === "tablet" ? 40 : 30;
  const links = [
    { label: "LinkedIn", url: profile.linkedin },
    { label: "GitHub", url: profile.github },
    { label: "Résumé (PDF)", url: "", action: onResume },
  ];
  return (
    <Reveal>
      <View style={[styles.contact, softShadow(1.4)]}>
        <View style={[styles.contactGlow, web({ filter: "blur(60px)" })]} pointerEvents="none" />
        <Text style={styles.small}>Contact</Text>
        <Text style={[styles.contactTitle, { fontSize: big, lineHeight: big * 1.15 }]}>
          Have an opportunity{"\n"}
          <Text style={{ fontFamily: font.displayItalic, color: c.sage }}>or project in mind?</Text>
        </Text>
        <Text style={styles.contactSub}>
          I'd be happy to connect. I'm currently open to internship opportunities where I can learn, contribute, and gain experience in design, data, or software development.
        </Text>
        <View style={styles.contactRow}>
          <View style={styles.mail}>
            <Text style={styles.mailText}>{profile.email}</Text>
          </View>
        </View>
        <View style={styles.contactLinks}>
          {links.map((l) => (
            <Pressable key={l.label} onPress={() => (l.action ? l.action() : openUrl(l.url))} accessibilityRole="link">
              {(s) => (
                <Text style={[styles.contactLink, (s as InteractionState).hovered && { color: c.sage }]}>
                  {l.label} ↗
                </Text>
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </Reveal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: c.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: c.line,
  },
  sectionLede: {
    fontFamily: font.regular,
    fontSize: 16,
    lineHeight: 26,
    color: c.body,
    maxWidth: 620,
  },
  prose: {
    fontFamily: font.regular,
    fontSize: 17,
    lineHeight: 29,
    color: c.body,
    marginTop: 16,
  },
  proseLead: {
    fontFamily: font.display,
    fontSize: 23,
    lineHeight: 34,
    color: c.ink,
    marginTop: 0,
    letterSpacing: -0.3,
  },
  small: {
    fontFamily: font.semibold,
    fontSize: 12.5,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: c.muted,
    marginBottom: 6,
  },
  // Experience
  expRow: {
    flexDirection: "row",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: c.line,
    paddingTop: 20,
    marginTop: 20,
  },
  expDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: c.sage,
    marginTop: 5,
    flexShrink: 0,
  },
  rowTitle: { fontFamily: font.semibold, fontSize: 15.5, color: c.ink },
  rowSub: { fontFamily: font.medium, fontSize: 13.5, color: c.muted },
  rowMeta: { fontFamily: font.medium, fontSize: 13, color: c.muted, flexShrink: 0 },
  rowBody: {
    fontFamily: font.regular,
    fontSize: 14.5,
    lineHeight: 23,
    color: c.body,
    marginTop: 8,
  },
  line: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: c.line,
    paddingVertical: 16,
  },
  // Skills
  skillIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  skillTitle: {
    fontFamily: font.display,
    fontSize: 23,
    color: c.ink,
    marginTop: 16,
  },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  // Tools
  toolCard: {
    backgroundColor: c.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: c.line,
    padding: 16,
    alignItems: "center",
    gap: 10,
  },
  toolIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  toolName: {
    fontFamily: font.medium,
    fontSize: 12,
    color: c.body,
    textAlign: "center",
  },
  // Contact
  contact: {
    backgroundColor: c.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: c.line,
    padding: 36,
    overflow: "hidden",
  },
  contactGlow: {
    position: "absolute",
    right: -80,
    top: -120,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: c.sageSoft,
    opacity: 0.9,
  },
  contactTitle: {
    fontFamily: font.display,
    color: c.ink,
    letterSpacing: -1,
    marginTop: 8,
    maxWidth: 760,
  },
  contactSub: {
    fontFamily: font.regular,
    fontSize: 16.5,
    lineHeight: 27,
    color: c.body,
    marginTop: 18,
    maxWidth: 540,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 32,
  },
  mail: {
    backgroundColor: c.bgDeep,
    borderRadius: radius.md,
    paddingHorizontal: 22,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: c.line,
  },
  mailText: { fontFamily: font.semibold, fontSize: 15, color: c.ink },
  contactLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 26,
    marginTop: 28,
    borderTopWidth: 1,
    borderTopColor: c.line,
    paddingTop: 22,
  },
  contactLink: { fontFamily: font.semibold, fontSize: 15, color: c.ink },
});
