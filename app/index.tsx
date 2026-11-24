import Head from "expo-router/head";
import { useRef, useState } from "react";
import { Image, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProjectGrid } from "../src/components/ProjectGrid";
import { openUrl } from "../src/components/ui";
import { profile } from "../src/data/profile";
import { Colors, useLayout, webOnly, type InteractionState, type Theme } from "../src/theme";

const RESUME_FILE = "Marc-Arboleda-Resume.pdf";
const RESUME_URL =
  Platform.OS === "web" ? `/${RESUME_FILE}` : `https://raw.githubusercontent.com/marcarboleda/Arboleda-Marc-Mobile-Portfolio/master/public/${RESUME_FILE}`;

const SKILLS = [
  "Excel & Google Sheets",
  "Data Validation",
  "Data Cleaning",
  "Python",
  "R",
  "Jupyter / Colab",
  "QA & UAT Testing",
  "CNN / Transfer Learning",
  "Reinforcement Learning",
  "C#",
  "C++",
  "Java",
  "TypeScript",
  "Unity",
  "Supabase",
  "Git & GitHub",
];

export default function PortfolioScreen() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const { width, height, bp, contentWidth, hydrated } = useLayout();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const projectsY = useRef(0);
  const [scrolled, setScrolled] = useState(false);
  const desktop = bp === "desktop";
  const phone = bp === "phone";

  const landingHeight = Math.max(height, 620);
  const imageW = Math.min(width * 0.75, desktop ? 400 : 360);
  const imageH = Math.min(height * 0.42, desktop ? 480 : 420);

  return (
    <View style={[styles.container, { backgroundColor: theme.background, opacity: hydrated ? 1 : 0 }]}>
      <Head>
        <title>{`${profile.name} — Portfolio`}</title>
        <meta name="description" content={`${profile.headline} ${profile.seeking}.`} />
        <meta property="og:title" content={`${profile.name} — Portfolio`} />
        <meta property="og:description" content={profile.headline} />
      </Head>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        scrollEventThrottle={32}
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y > 40;
          if (y !== scrolled) setScrolled(y);
        }}
      >
        {/* LANDING */}
        <View style={[styles.hero, { height: landingHeight, paddingTop: insets.top + 40 }]}>
          <View style={styles.heroContent}>
            <Image
              source={require("../assets/images/profile/marc.jpg")}
              style={[styles.mainImage, { width: imageW, height: imageH, borderColor: theme.tint + "30" }]}
              accessibilityLabel="Portrait of Marc Arboleda"
            />
            <Text style={[styles.name, { color: theme.text, fontSize: desktop ? 46 : 32, lineHeight: desktop ? 50 : 36 }]}>
              Marc Bradley{"\n"}Arboleda
            </Text>
            <Text style={[styles.role, { color: theme.tint }]}>4th Year Computer Science Student</Text>
            <Text style={[styles.focus, { color: theme.text }]}>Data Analytics · Quality Assurance · Data Management</Text>
          </View>
          <Pressable
            style={styles.scrollHint}
            onPress={() => scrollRef.current?.scrollTo({ y: projectsY.current - 20, animated: true })}
            accessibilityRole="button"
            accessibilityLabel="Scroll to projects"
          >
            <Text style={{ color: theme.tint, fontSize: 18, fontWeight: "bold", textAlign: "center" }}>↓</Text>
            <Text style={[styles.scrollText, { color: theme.text }]}>SCROLL</Text>
          </Pressable>
        </View>

        {/* CONTENT */}
        <View style={{ alignItems: "center" }}>
          <View style={{ width: contentWidth }}>
            {/* ABOUT ME */}
            <View style={styles.section}>
              <SectionHeader title="About Me" theme={theme} />
              <View style={[{ gap: 18 }, !phone && { flexDirection: "row" }]}>
                <View style={[styles.aboutCard, { backgroundColor: theme.card }, !phone && { flex: 1.6 }]}>
                  <Text style={[styles.aboutText, { color: theme.text }]}>
                    I am a fourth-year Computer Science student at <Text style={{ fontWeight: "700" }}>De La Salle Lipa</Text> who cares about making
                    information trustworthy: validating data before it spreads, testing software before people depend on it, and turning results into
                    numbers a team can act on.
                  </Text>
                  <Text style={[styles.aboutText, { color: theme.text, marginTop: 15 }]}>
                    I am an <Text style={{ color: theme.tint, fontWeight: "700" }}>aspiring</Text> data analyst and QA engineer, currently serving as{" "}
                    <Text style={{ fontWeight: "700" }}>Statistics Officer</Text> of Musikalista, where I designed and maintain the membership database.
                  </Text>
                </View>
                <View style={[{ gap: 18 }, !phone && { flex: 1 }]}>
                  {[
                    { k: "Seeking", v: "Data analytics, QA and data management internships" },
                    { k: "Certifications", v: "PyTorch Bootcamp · Intermediate R · Introduction to R · Elements of AI" },
                    { k: "Based in", v: profile.location },
                  ].map((x) => (
                    <View key={x.k} style={[styles.infoCard, { backgroundColor: theme.card }]}>
                      <Text style={[styles.contactLabel, { color: theme.text, opacity: 0.5 }]}>{x.k}</Text>
                      <Text style={[styles.contactValue, { color: theme.text }]}>{x.v}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* SKILLS */}
            <View style={styles.section}>
              <SectionHeader title="Skills" theme={theme} />
              <View style={styles.skillContainer}>
                {SKILLS.map((skill) => (
                  <View key={skill} style={[styles.skillTag, { backgroundColor: theme.card, borderColor: theme.tint + "20" }]}>
                    <Text style={[styles.skillText, { color: theme.text }]}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* PROJECTS */}
            <View style={styles.section} onLayout={(e) => (projectsY.current = e.nativeEvent.layout.y + landingHeight)}>
              <SectionHeader title="Projects" theme={theme} />
              <Text style={[styles.sectionLede, { color: theme.text }]}>Tap a project to open the full case: screenshots, results and what I did.</Text>
              <ProjectGrid theme={theme} />
            </View>

            {/* CONTACT */}
            <View style={styles.section}>
              <SectionHeader title="Contact" theme={theme} />
              <View style={[styles.contactList, { backgroundColor: theme.card }]}>
                {[
                  { label: "Email", value: profile.email, url: `mailto:${profile.email}` },
                  { label: "LinkedIn", value: profile.linkedinLabel, url: profile.linkedin },
                  { label: "GitHub", value: profile.githubLabel, url: profile.github },
                  { label: "Phone", value: "+63 969 138 0174", url: "tel:+639691380174" },
                  { label: "Résumé", value: "Download PDF", url: RESUME_URL },
                ].map((c, i) => (
                  <View key={c.label}>
                    {i > 0 ? <View style={[styles.divider, { backgroundColor: theme.text + "10" }]} /> : null}
                    <ContactRow label={c.label} value={c.value} theme={theme} onPress={() => openUrl(c.url)} />
                  </View>
                ))}
              </View>
            </View>

            <Text style={[styles.footer, { color: theme.text }]}>© 2026 Marc Bradley Arboleda</Text>
            <View style={{ height: 60 }} />
          </View>
        </View>
      </ScrollView>

      {/* Floating header */}
      <View
        style={[
          styles.nav,
          { paddingTop: insets.top + (scrolled ? 10 : Platform.OS === "web" ? 20 : 8), paddingBottom: scrolled ? 10 : 0 },
          scrolled && { backgroundColor: theme.background + "D9", borderBottomWidth: 1, borderBottomColor: theme.border },
          webOnly({ transitionDuration: "200ms", backdropFilter: scrolled ? "blur(14px)" : "none" }),
        ]}
        pointerEvents="box-none"
      >
        <View style={[styles.navInner, { width: Math.min(width - 50, 1120) }]} pointerEvents="box-none">
          <Pressable onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })} accessibilityRole="button" accessibilityLabel="Back to top">
            <Text style={[styles.brand, { color: theme.tint }]}>MB</Text>
          </Pressable>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <Pressable
              onPress={() => openUrl(RESUME_URL)}
              accessibilityRole="link"
              style={(s) => [
                styles.resumeBtn,
                { borderColor: theme.tint + "60", backgroundColor: (s as InteractionState).hovered ? theme.tint : theme.background + "CC" },
              ]}
            >
              {(s) => <Text style={[styles.resumeText, { color: (s as InteractionState).hovered ? "#fff" : theme.tint }]}>Résumé ↓</Text>}
            </Pressable>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              thumbColor={theme.tint}
              trackColor={{ false: "#D1D1D6", true: theme.tint + "60" }}
              accessibilityLabel="Dark mode"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function SectionHeader({ title, theme }: { title: string; theme: Theme }) {
  return (
    <View style={styles.headerRow}>
      <Text style={[styles.label, { color: theme.text }]}>{title}</Text>
      <View style={[styles.titleLine, { backgroundColor: theme.tint }]} />
    </View>
  );
}

function ContactRow({ label, value, theme, onPress }: { label: string; value: string; theme: Theme; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link" style={(s) => [styles.contactItem, (s as InteractionState).hovered && { backgroundColor: theme.tint + "0D" }]}>
      {(s) => (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.contactLabel, { color: theme.text, opacity: 0.5 }]}>{label}</Text>
            <Text style={[styles.contactValue, { color: theme.text }]} numberOfLines={1}>
              {value}
            </Text>
          </View>
          <Text style={{ color: theme.tint, fontSize: 16, fontWeight: "800", opacity: (s as InteractionState).hovered ? 1 : 0.5 }}>↗</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  nav: { position: "absolute", top: 0, left: 0, right: 0, alignItems: "center", zIndex: 100 },
  navInner: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { fontWeight: "900", letterSpacing: 4, fontSize: 22 },
  resumeBtn: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7, ...webOnly({ backdropFilter: "blur(10px)", transitionDuration: "180ms" }) },
  resumeText: { fontSize: 12, fontWeight: "800", letterSpacing: 0.5 },
  hero: { justifyContent: "center", alignItems: "center" },
  heroContent: { alignItems: "center", justifyContent: "center", marginTop: -30, paddingHorizontal: 25 },
  mainImage: { borderRadius: 40, borderWidth: 1.5, marginBottom: 25 },
  name: { fontWeight: "800", letterSpacing: -1, textAlign: "center" },
  role: { fontSize: 13, fontWeight: "600", marginTop: 10, opacity: 0.7 },
  focus: { fontSize: 12, fontWeight: "600", marginTop: 8, opacity: 0.45, textAlign: "center" },
  scrollHint: { position: "absolute", bottom: 30, alignItems: "center", padding: 8 },
  scrollText: { opacity: 0.4, fontSize: 9, letterSpacing: 2, marginTop: 4 },
  section: { marginTop: 100 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  label: { fontSize: 32, fontWeight: "800", letterSpacing: -0.5 },
  titleLine: { height: 5, width: 45, marginLeft: 15, borderRadius: 3 },
  sectionLede: { fontSize: 15, opacity: 0.55, marginTop: -10, marginBottom: 25 },
  aboutCard: { padding: 30, borderRadius: 35 },
  aboutText: { fontSize: 16, lineHeight: 26, opacity: 0.8 },
  infoCard: { borderRadius: 28, paddingHorizontal: 25, paddingVertical: 20 },
  skillContainer: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -5 },
  skillTag: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 20, margin: 5, borderWidth: 1 },
  skillText: { fontSize: 14, fontWeight: "700" },
  contactList: { borderRadius: 35, paddingVertical: 10, overflow: "hidden" },
  contactItem: { paddingHorizontal: 25, paddingVertical: 22 },
  contactLabel: { fontSize: 10, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 5 },
  contactValue: { fontSize: 14, fontWeight: "600" },
  divider: { height: 1, marginHorizontal: 25 },
  footer: { textAlign: "center", fontSize: 11, opacity: 0.35, marginTop: 60, letterSpacing: 1 },
});
