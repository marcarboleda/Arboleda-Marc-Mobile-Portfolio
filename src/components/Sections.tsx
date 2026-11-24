import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { certifications, education, experience, profile, skillGroups } from "../data/profile";
import { c, font, radius, softShadow, useLayout, web, type InteractionState } from "../theme";
import { Reveal } from "./motion";
import { openUrl, Tag, TINT } from "./ui";

// ─── Inline SVG via <img> tag (Expo web static export — data URIs work on <img>, not RN Image) ─

function SvgImg({ svg, size }: { svg: string; size: number }) {
  const uri = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  // React Native Web renders React.createElement('img') as a real <img> DOM element
  return React.createElement("img", {
    src: uri,
    width: size,
    height: size,
    style: { display: "block", width: size, height: size },
  });
}

// Skill category icons — Figma-style pen nib / bar chart / code brackets
const SKILL_SVGS: Record<string, (color: string) => string> = {
  // Pen tool / Figma-style nib
  Design: (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="${c}" fill-opacity=".18"/><path d="M2 17l10 5 10-5" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12l10 5 10-5" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  // Bar chart rising
  Data:   (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><rect x="3" y="12" width="4" height="9" rx="1" fill="${c}" fill-opacity=".2" stroke="${c}" stroke-width="1.8"/><rect x="10" y="7" width="4" height="14" rx="1" fill="${c}" fill-opacity=".2" stroke="${c}" stroke-width="1.8"/><rect x="17" y="3" width="4" height="18" rx="1" fill="${c}" fill-opacity=".2" stroke="${c}" stroke-width="1.8"/></svg>`,
  // Code brackets
  Build:  (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><polyline points="16 18 22 12 16 6" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="8 6 2 12 8 18" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><line x1="14" y1="4" x2="10" y2="20" stroke="${c}" stroke-width="1.6" stroke-linecap="round" opacity=".5"/></svg>`,
};

// Tool icons — accurate brand logos as SVG data URIs
const TOOL_SVGS: Record<string, { color: string; svg: string }> = {
  // Google Sheets: green document with grid lines
  "Google Sheets": {
    color: "#0F9D58",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M28 4H12C9.79 4 8 5.79 8 8v32c0 2.21 1.79 4 4 4h24c2.21 0 4-1.79 4-4V16L28 4z" fill="#E8F5E9"/><path d="M28 4v12h12L28 4z" fill="#A5D6A7"/><path d="M12 20h24v2H12v-2zm0 5h24v2H12v-2zm0 5h24v2H12v-2zm0 5h16v2H12v-2z" fill="#0F9D58" opacity=".6"/><path d="M28 4v12h12" fill="none" stroke="#4CAF50" stroke-width="1"/><path d="M20 20v17M28 20v17" stroke="#0F9D58" stroke-width="1" opacity=".4"/></svg>`,
  },
  // Microsoft Excel: green X on white document
  "Excel": {
    color: "#217346",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M28 4H12C9.79 4 8 5.79 8 8v32c0 2.21 1.79 4 4 4h24c2.21 0 4-1.79 4-4V16L28 4z" fill="#E8F5E9"/><path d="M28 4v12h12L28 4z" fill="#A5D6A7"/><path d="M15 22l6 10 6-10M15 32l6-10 6 10" stroke="#217346" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
  },
  // Python: snake logo — two intertwined arcs
  "Python": {
    color: "#3572A5",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M24 4c-5.5 0-9 2.5-9 6v4h9v2H11s-7 0-7 10 5 10 5 10h4v-5c0-4 2.5-6 6-6h10c3.5 0 6-2.5 6-6V10c0-3.5-3-6-11-6z" fill="#3572A5"/><path d="M24 44c5.5 0 9-2.5 9-6v-4h-9v-2h13s7 0 7-10-5-10-5-10h-4v5c0 4-2.5 6-6 6H19c-3.5 0-6 2.5-6 6v8c0 3.5 3 6 11 6z" fill="#FFD43B"/><circle cx="20" cy="11" r="2" fill="white"/><circle cx="28" cy="37" r="2" fill="#3572A5"/></svg>`,
  },
  // R logo: blue R letter
  "R": {
    color: "#276DC3",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#276DC3" fill-opacity=".1"/><text x="24" y="35" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="30" fill="#276DC3">R</text></svg>`,
  },
  // Unity: official Unity cube logo
  "Unity": {
    color: "#222222",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M24 4L6 14v20l18 10 18-10V14L24 4z" fill="#222" fill-opacity=".06" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/><path d="M24 14l9 5.2v10.6L24 35l-9-5.2V19.2L24 14z" fill="#222" fill-opacity=".12" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/><path d="M24 14v21M15 19.2l18 10.4M33 19.2L15 29.6" stroke="#222" stroke-width="1.2" stroke-linecap="round" opacity=".35"/></svg>`,
  },
  // React logo: electron orbit rings
  "React / React Native": {
    color: "#149ECA",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><ellipse cx="24" cy="24" rx="20" ry="7" fill="none" stroke="#149ECA" stroke-width="2"/><ellipse cx="24" cy="24" rx="20" ry="7" fill="none" stroke="#149ECA" stroke-width="2" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="20" ry="7" fill="none" stroke="#149ECA" stroke-width="2" transform="rotate(120 24 24)"/><circle cx="24" cy="24" r="3.5" fill="#149ECA"/></svg>`,
  },
  // TypeScript: official TS blue square with TS letters
  "TypeScript": {
    color: "#3178C6",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect x="4" y="4" width="40" height="40" rx="5" fill="#3178C6"/><path d="M24 20v16M18 20h12" stroke="white" stroke-width="3.5" stroke-linecap="round"/><path d="M30 24.5c-.5-1.5-2-2.5-4-2.5-2.5 0-4 1.5-4 3.5s1.5 3 4 3.5c2.5.5 4 2 4 4s-1.5 3.5-4.5 3.5c-2 0-3.5-1-4.5-2.5" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg>`,
  },
  // Supabase: official green lightning bolt
  "Supabase": {
    color: "#3ECF8E",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M26 6L8 28h16l-4 14L42 20H26L30 6z" fill="#3ECF8E" fill-opacity=".2" stroke="#3ECF8E" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
  },
  // Git: official orange branching diamond
  "Git": {
    color: "#F05032",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M44.5 21.5L26.5 3.5a3 3 0 0 0-4.24 0l-4.24 4.24 5.37 5.37A3.57 3.57 0 0 1 27.76 18l5.18 5.18a3.57 3.57 0 0 1 3.4 5.9 3.57 3.57 0 0 1-5.9-3.4l-4.83-4.83v12.7a3.57 3.57 0 1 1-2.93.08V20.57a3.57 3.57 0 0 1-1.94-4.69L15.4 10.6 3.5 22.5a3 3 0 0 0 0 4.24l18 18a3 3 0 0 0 4.24 0l18.76-18.76a3 3 0 0 0 0-4.48z" fill="#F05032" fill-opacity=".15" stroke="#F05032" stroke-width="1.5"/></svg>`,
  },
  // GitHub: official Octocat / cat silhouette
  "GitHub": {
    color: "#24292F",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M24 4C12.95 4 4 12.95 4 24c0 8.84 5.73 16.33 13.68 18.98 1 .18 1.37-.43 1.37-.96v-3.37c-5.56 1.21-6.73-2.68-6.73-2.68-.91-2.31-2.22-2.93-2.22-2.93-1.81-1.24.14-1.21.14-1.21 2 .14 3.06 2.06 3.06 2.06 1.78 3.05 4.67 2.17 5.81 1.66.18-1.29.7-2.17 1.27-2.67-4.43-.5-9.09-2.21-9.09-9.84 0-2.17.78-3.95 2.05-5.34-.21-.51-.89-2.53.19-5.27 0 0 1.67-.53 5.46 2.03A19.03 19.03 0 0 1 24 15.44c1.69.01 3.39.23 4.98.67 3.78-2.56 5.44-2.03 5.44-2.03 1.09 2.74.41 4.76.2 5.27 1.28 1.39 2.05 3.17 2.05 5.34 0 7.65-4.67 9.33-9.12 9.82.72.62 1.36 1.84 1.36 3.71v5.5c0 .54.36 1.15 1.38.96C38.28 40.32 44 32.84 44 24 44 12.95 35.05 4 24 4z" fill="#24292F" fill-opacity=".12" stroke="#24292F" stroke-width="1"/></svg>`,
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
                  {svgFn && <SvgImg svg={svgFn(t.fg)} size={28} />}
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
              <View style={[styles.toolCard, softShadow(0.6)]}>
                <View style={[styles.toolIconBox, { backgroundColor: def.color + "18" }]}>
                  <SvgImg svg={def.svg} size={44} />
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
    width: 56,
    height: 56,
    borderRadius: 16,
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
  // Tools — card with icon box + label
  toolCard: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 10,
  },
  toolIconBox: {
    width: 60,
    height: 60,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  toolName: {
    fontFamily: font.semibold,
    fontSize: 13,
    color: c.ink,
    textAlign: "center",
    lineHeight: 18,
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
