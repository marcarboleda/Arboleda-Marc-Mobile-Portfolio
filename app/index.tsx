import Head from "expo-router/head";
import { useCallback, useRef, useState } from "react";
import { Platform, ScrollView, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { About, Contact, Experience, Footer, Skills } from "../src/components/Content";
import { Hero } from "../src/components/Hero";
import { Nav, NAV_HEIGHT, type NavItem } from "../src/components/Nav";
import { RegistryDemo, RegistryNotes } from "../src/components/RegistryDemo";
import { Section } from "../src/components/Section";
import { openUrl } from "../src/components/ui";
import { Work } from "../src/components/Work";
import { profile } from "../src/data/profile";
import { color, useLayout } from "../src/theme";

const RESUME_FILE = "Marc-Arboleda-Resume.pdf";
const RESUME_URL =
  Platform.OS === "web"
    ? `/${RESUME_FILE}`
    : `https://raw.githubusercontent.com/marcarboleda/Arboleda-Marc-Mobile-Portfolio/master/public/${RESUME_FILE}`;

const NAV: NavItem[] = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "registry", label: "Data demo" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function Portfolio() {
  const scrollRef = useRef<ScrollView>(null);
  const offsets = useRef<Record<string, number>>({});
  const insets = useSafeAreaInsets();
  const { height, bp, hydrated } = useLayout();
  const sectionPad = bp === "phone" ? 84 : 120;
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [seen, setSeen] = useState(0);

  const register = (id: string) => (e: LayoutChangeEvent) => {
    offsets.current[id] = e.nativeEvent.layout.y;
  };

  const navigate = useCallback(
    (id: string) => {
      const y = id === "top" ? 0 : (offsets.current[id] ?? 0) + sectionPad - NAV_HEIGHT - insets.top - 20;
      scrollRef.current?.scrollTo({ y: Math.max(0, y), animated: true });
    },
    [insets.top, sectionPad],
  );

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const vh = e.nativeEvent.layoutMeasurement.height || height;
    if (y > 24 !== scrolled) setScrolled(y > 24);
    const bottom = y + vh * 0.88;
    if (bottom > seen + 40) setSeen(bottom);
    let current: string | null = null;
    for (const item of NAV) {
      const top = offsets.current[item.id];
      if (top !== undefined && y + vh * 0.35 >= top) current = item.id;
    }
    if (current !== active) setActive(current);
  };

  const visible = (id: string) => {
    const top = offsets.current[id];
    return top === undefined ? false : seen >= top + 60;
  };

  const resume = () => openUrl(RESUME_URL);

  return (
    <View style={{ flex: 1, backgroundColor: color.bg, opacity: hydrated ? 1 : 0 }}>
      <Head>
        <title>{`${profile.name} — Data, QA & Software Portfolio`}</title>
        <meta name="description" content={`${profile.headline} ${profile.seeking}.`} />
        <meta property="og:title" content={`${profile.name} — Portfolio`} />
        <meta property="og:description" content={profile.headline} />
        <meta property="og:type" content="website" />
      </Head>

      <ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={32}
        onLayout={(e) => setSeen(e.nativeEvent.layout.height * 0.88)}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        style={{ flex: 1 }}
      >
        <Hero onWork={() => navigate("work")} onResume={resume} onContact={() => navigate("contact")} />

        <Section index="01" label="About" title="Background" visible={visible("about")} onLayout={register("about")}>
          <About />
        </Section>

        <Section
          index="02"
          label="Work"
          title="Selected work"
          lede="Projects grouped by the kind of role they relate to. Filter by track, then open a project for my role, the approach and the tools used."
          visible={visible("work")}
          onLayout={register("work")}
        >
          <Work onDemo={() => navigate("registry")} />
        </Section>

        <Section
          index="03"
          label="Data demo"
          title="The membership registry, rebuilt to explore."
          lede="An interactive copy of the spreadsheet I run as Statistics Officer. It has the same columns, validation rules and search formula, with fictional records in place of real members."
          visible={visible("registry")}
          onLayout={register("registry")}
        >
          <RegistryNotes />
          <RegistryDemo />
        </Section>

        <Section index="04" label="Skills" title="Tools I reach for" visible={visible("skills")} onLayout={register("skills")}>
          <Skills />
        </Section>

        <Section index="05" label="Experience" title="Experience & credentials" visible={visible("experience")} onLayout={register("experience")}>
          <Experience />
        </Section>

        <Section
          index="06"
          label="Contact"
          title="Hiring for a data or QA internship?"
          lede="Open to on-site, hybrid and remote internships. Email is the fastest way to reach me."
          visible={visible("contact")}
          onLayout={register("contact")}
        >
          <Contact onResume={resume} />
        </Section>

        <Footer />
      </ScrollView>

      <Nav items={NAV} active={active} scrolled={scrolled} onNavigate={navigate} onResume={resume} />
    </View>
  );
}
