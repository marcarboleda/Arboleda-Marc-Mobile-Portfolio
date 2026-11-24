import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { certifications, education, experience, profile, skillGroups } from "../data/profile";
import { c, font, radius, softShadow, useLayout, web, type InteractionState } from "../theme";
import { Reveal } from "./motion";
import { openUrl, Tag, TINT } from "./ui";

// ─── SVG icons via dangerouslySetInnerHTML on web ───────────────────────────

function SvgIcon({ path, size = 24, color = "currentColor" }: { path: string; size?: number; color?: string }) {
  return (
    <View
      style={{ width: size, height: size }}
      // @ts-ignore – web only
      {...({
        dangerouslySetInnerHTML: {
          __html: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`,
        },
      } as object)}
    />
  );
}

// Skill category icons (filled SVG paths)
const SKILL_ICONS: Record<string, string> = {
  Design:
    '<circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" fill-opacity=".15"/><path d="M8 12h8M12 8v8"/>',
  Data: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  Build: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
};

// Tool SVG paths (Feather/Lucide style, 24×24 viewBox)
const TOOL_SVG: Record<string, { path: string; color: string; fillColor?: string }> = {
  "Google Sheets": {
    color: "#0F9D58",
    path: '<rect x="4" y="2" width="16" height="20" rx="2" fill="#0F9D58" fill-opacity=".12" stroke="#0F9D58" stroke-width="1.5"/><line x1="4" y1="8" x2="20" y2="8" stroke="#0F9D58" stroke-width="1.5"/><line x1="4" y1="13" x2="20" y2="13" stroke="#0F9D58" stroke-width="1.5"/><line x1="9" y1="8" x2="9" y2="22" stroke="#0F9D58" stroke-width="1.5"/>',
  },
  Excel: {
    color: "#217346",
    path: '<rect x="4" y="2" width="16" height="20" rx="2" fill="#217346" fill-opacity=".12" stroke="#217346" stroke-width="1.5"/><path d="M8 7l8 10M16 7l-8 10" stroke="#217346" stroke-width="2" stroke-linecap="round"/>',
  },
  Python: {
    color: "#3572A5",
    path: '<path d="M12 2C8.5 2 7 3.5 7 5.5V8h5v1H5.5C3.5 9 2 10.5 2 13s1.5 4 3.5 4H7v-2.5c0-2 1.5-3.5 5-3.5s5 1.5 5 3.5V17h1.5c2 0 3.5-1.5 3.5-4s-1.5-4-3.5-4H17V8h-5V7h5V5.5C17 3.5 15.5 2 12 2z" fill="#3572A5" fill-opacity=".15" stroke="#3572A5" stroke-width="1.5"/><circle cx="9" cy="5.5" r="1" fill="#3572A5"/><circle cx="15" cy="18.5" r="1" fill="#3572A5"/>',
  },
  R: {
    color: "#276DC3",
    path: '<rect x="3" y="3" width="18" height="18" rx="3" fill="#276DC3" fill-opacity=".12" stroke="#276DC3" stroke-width="1.5"/><path d="M8 7h4a3 3 0 0 1 0 6H8V7z" stroke="#276DC3" stroke-width="1.5" fill="none" stroke-linejoin="round"/><path d="M11 13l4 4" stroke="#276DC3" stroke-width="1.5" stroke-linecap="round"/>',
  },
  Unity: {
    color: "#1E2230",
    path: '<path d="M12 2l9 5v10l-9 5-9-5V7z" fill="#1E2230" fill-opacity=".1" stroke="#1E2230" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 7l5 2.8v5.4L12 18l-5-2.8V9.8z" stroke="#1E2230" stroke-width="1.5" fill="none"/>',
  },
  "React / React Native": {
    color: "#61DAFB",
    path: '<ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" stroke-width="1.5" fill="none"/><ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" stroke-width="1.5" fill="none" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" stroke-width="1.5" fill="none" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="2" fill="#61DAFB"/>',
  },
  TypeScript: {
    color: "#3178C6",
    path: '<rect x="2" y="2" width="20" height="20" rx="3" fill="#3178C6" fill-opacity=".12" stroke="#3178C6" stroke-width="1.5"/><path d="M8 10h8M12 10v8" stroke="#3178C6" stroke-width="2" stroke-linecap="round"/><path d="M6 7h4" stroke="#3178C6" stroke-width="2" stroke-linecap="round"/>',
  },
  Supabase: {
    color: "#3ECF8E",
    path: '<path d="M4 20V8l8-6 8 6v12H4z" fill="#3ECF8E" fill-opacity=".12" stroke="#3ECF8E" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 20v-8h6v8" stroke="#3ECF8E" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 7v5l3-3" stroke="#3ECF8E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  Git: {
    color: "#F05032",
    path: '<circle cx="6" cy="6" r="2.5" stroke="#F05032" stroke-width="1.5" fill="none"/><circle cx="18" cy="6" r="2.5" stroke="#F05032" stroke-width="1.5" fill="none"/><circle cx="6" cy="18" r="2.5" stroke="#F05032" stroke-width="1.5" fill="none"/><path d="M6 8.5V15.5M8.5 6h7M6 18" stroke="#F05032" stroke-width="1.5" stroke-linecap="round"/><path d="M15.5 6C15.5 10 8.5 11 8.5 15.5" stroke="#F05032" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
  },
  GitHub: {
    color: "#24292F",
    path: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="#24292F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
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
          return (
            <Reveal key={g.title} delay={i * 100} style={{ width: `${100 / cols}%`, padding: 10 }}>
              <HoverCard>
                <View style={[styles.skillIconWrap, { backgroundColor: t.bg }]}>
                  <SvgIcon path={SKILL_ICONS[g.title] ?? ""} size={22} color={t.fg} />
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
          const icon = TOOL_SVG[name];
          if (!icon) return null;
          return (
            <Reveal key={name} delay={i * 55} style={{ width: `${100 / cols}%`, padding: 8 }}>
              <View style={[styles.toolCard, softShadow()]}>
                <View style={[styles.toolIconWrap, { backgroundColor: icon.color + "15" }]}>
                  <View
                    style={{ width: 28, height: 28 }}
                    // @ts-ignore – web only
                    {...({
                      dangerouslySetInnerHTML: {
                        __html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">${icon.path}</svg>`,
                      },
                    } as object)}
                  />
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
