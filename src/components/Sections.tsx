import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { certifications, education, experience, profile, skillGroups } from "../data/profile";
import { c, font, radius, softShadow, useLayout, web, type InteractionState } from "../theme";
import { Reveal } from "./motion";
import { openUrl, Tag, TINT } from "./ui";

// ─── SVG icons as data URIs (works in Expo web static export, no font needed) ─

function svgUri(svg: string) {
  return { uri: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` };
}

function SvgImg({ svg, size }: { svg: string; size: number }) {
  return <Image source={svgUri(svg)} style={{ width: size, height: size }} />;
}

// Skill category icons
const SKILL_SVGS: Record<string, (color: string) => string> = {
  Design: (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l11 11"/><circle cx="11" cy="11" r="2"/></svg>`,
  Data:   (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  Build:  (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
};

// Tool icons — crisp single-color SVGs
const TOOL_SVGS: Record<string, { color: string; svg: string }> = {
  "Google Sheets": {
    color: "#0F9D58",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><rect x="4" y="2" width="16" height="20" rx="2" fill="#0F9D58" fill-opacity=".15" stroke="#0F9D58" stroke-width="1.5"/><line x1="4" y1="8" x2="20" y2="8" stroke="#0F9D58" stroke-width="1.5"/><line x1="4" y1="13" x2="20" y2="13" stroke="#0F9D58" stroke-width="1.5"/><line x1="9" y1="8" x2="9" y2="22" stroke="#0F9D58" stroke-width="1.5"/></svg>`,
  },
  "Excel": {
    color: "#217346",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><rect x="4" y="2" width="16" height="20" rx="2" fill="#217346" fill-opacity=".15" stroke="#217346" stroke-width="1.5"/><path d="M8 7l8 10M16 7l-8 10" stroke="#217346" stroke-width="2" stroke-linecap="round"/></svg>`,
  },
  "Python": {
    color: "#3572A5",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.5 2C8.46 2 7 3.46 7 5.5V8h4.5v1H5.5C3.57 9 2 10.57 2 13.5S3.57 18 5.5 18H7v-2.5C7 13.46 8.46 12 11.5 12s4.5 1.46 4.5 3.5V18h1.5c1.93 0 3.5-1.57 3.5-4.5S19.43 9 17.5 9H16V8h-4.5V7H17V5.5C17 3.46 15.54 2 11.5 2z" fill="#3572A5" fill-opacity=".2" stroke="#3572A5" stroke-width="1.2"/><circle cx="9.5" cy="5.5" r="1" fill="#3572A5"/><circle cx="14.5" cy="18.5" r="1" fill="#3572A5"/></svg>`,
  },
  "R": {
    color: "#276DC3",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" fill="#276DC3" fill-opacity=".12" stroke="#276DC3" stroke-width="1.5"/><path d="M8 7h4a3 3 0 0 1 0 6H8V7z" stroke="#276DC3" stroke-width="1.5" stroke-linejoin="round"/><path d="M11 13l4 4" stroke="#276DC3" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  },
  "Unity": {
    color: "#222",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M12 2l9 5.2v9.6L12 22l-9-5.2V7.2z" fill="#222" fill-opacity=".08" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 7.5l4.5 2.6v5.2L12 17.8l-4.5-2.6V10z" stroke="#222" stroke-width="1.3" fill="none"/></svg>`,
  },
  "React / React Native": {
    color: "#149ECA",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="12" rx="9.5" ry="3.5" stroke="#149ECA" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="9.5" ry="3.5" stroke="#149ECA" stroke-width="1.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="3.5" stroke="#149ECA" stroke-width="1.5" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="2" fill="#149ECA"/></svg>`,
  },
  "TypeScript": {
    color: "#3178C6",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#3178C6" fill-opacity=".12" stroke="#3178C6" stroke-width="1.5"/><path d="M7 9h10" stroke="#3178C6" stroke-width="2" stroke-linecap="round"/><path d="M12 9v9" stroke="#3178C6" stroke-width="2" stroke-linecap="round"/></svg>`,
  },
  "Supabase": {
    color: "#3ECF8E",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M13 3L4 14h9l-2 7 9-11h-9l2-7z" fill="#3ECF8E" fill-opacity=".15" stroke="#3ECF8E" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  },
  "Git": {
    color: "#F05032",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="6" r="2.5" stroke="#F05032" stroke-width="1.5"/><circle cx="18" cy="6" r="2.5" stroke="#F05032" stroke-width="1.5"/><circle cx="6" cy="18" r="2.5" stroke="#F05032" stroke-width="1.5"/><path d="M6 8.5v7" stroke="#F05032" stroke-width="1.5" stroke-linecap="round"/><path d="M8.5 6h7" stroke="#F05032" stroke-width="1.5" stroke-linecap="round"/><path d="M15.8 6C15.8 10.5 8.5 11 8.5 15.5" stroke="#F05032" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  },
  "GitHub": {
    color: "#24292F",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.7.115 2.5.337 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" fill="#24292F" fill-opacity=".1" stroke="#24292F" stroke-width="1"/></svg>`,
  },
};

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
          const svgFn = SKILL_SVGS[g.title];
          return (
            <Reveal key={g.title} delay={i * 100} style={{ width: `${100 / cols}%`, padding: 10 }}>
              <HoverCard>
                <View style={[styles.skillIconWrap, { backgroundColor: t.bg }]}>
                  {svgFn && <SvgImg svg={svgFn(t.fg)} size={22} />}
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
          const def = TOOL_SVGS[name];
          if (!def) return null;
          return (
            <Reveal key={name} delay={i * 55} style={{ width: `${100 / cols}%`, padding: 8 }}>
              <View style={styles.toolItem}>
                <SvgImg svg={def.svg} size={32} />
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
  // Tools — just icon + label, no box
  toolItem: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
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
