import Head from "expo-router/head";
import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { Platform, ScrollView, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Hero } from "../src/components/Hero";
import { ScrollContext } from "../src/components/motion";
import { Nav, type NavItem } from "../src/components/Nav";
import { About, Contact, Footer } from "../src/components/Sections";
import { openUrl, SectionHead } from "../src/components/ui";
import { WorkGrid } from "../src/components/Work";
import { profile } from "../src/data/profile";
import { c, useLayout } from "../src/theme";

const RESUME_FILE = "Marc-Arboleda-Resume.pdf";
const RESUME_URL = Platform.OS === "web" ? `/${RESUME_FILE}` : `https://raw.githubusercontent.com/marcarboleda/Arboleda-Marc-Mobile-Portfolio/master/public/${RESUME_FILE}`;

const NAV: NavItem[] = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Portfolio() {
  const scrollRef = useRef<ScrollView>(null);
  const offsets = useRef<Record<string, number>>({});
  const insets = useSafeAreaInsets();
  const { height, bp, gutter, contentWidth, hydrated } = useLayout();
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [tick, setTick] = useState(0);
  const lastTick = useRef(0);
  const titleSize = bp === "desktop" ? 54 : bp === "tablet" ? 44 : 34;

  const register = (id: string) => (e: LayoutChangeEvent) => {
    offsets.current[id] = e.nativeEvent.layout.y;
  };

  const navigate = useCallback(
    (id: string) => {
      const y = id === "top" ? 0 : (offsets.current[id] ?? 0) - insets.top - 90;
      scrollRef.current?.scrollTo({ y: Math.max(0, y), animated: true });
    },
    [insets.top],
  );

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const vh = e.nativeEvent.layoutMeasurement.height || height;
    if (y > 30 !== scrolled) setScrolled(y > 30);
    const now = Date.now();
    if (now - lastTick.current > 90) {
      lastTick.current = now;
      setTick((t) => t + 1);
    }
    let current: string | null = null;
    for (const item of NAV) {
      const top = offsets.current[item.id];
      if (top !== undefined && y + vh * 0.4 >= top) current = item.id;
    }
    if (current !== active) setActive(current);
  };

  const scrollValue = useMemo(() => ({ tick, vh: height }), [tick, height]);
  const resume = () => openUrl(RESUME_URL);
  const section = (id: string, children: ReactNode, pad = 120) => (
    <View onLayout={register(id)} style={{ paddingHorizontal: gutter, alignItems: "center", paddingTop: bp === "phone" ? pad * 0.7 : pad }}>
      <View style={{ width: contentWidth }}>{children}</View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, opacity: hydrated ? 1 : 0 }}>
      <Head>
        <title>{`${profile.name} — UI Design & Data Portfolio`}</title>
        <meta name="description" content={`${profile.headline} ${profile.seeking}.`} />
        <meta property="og:title" content={`${profile.name} — Portfolio`} />
        <meta property="og:description" content={profile.headline} />
      </Head>
      <ScrollContext.Provider value={scrollValue}>
        <ScrollView ref={scrollRef} onScroll={onScroll} scrollEventThrottle={32} onLayout={() => setTick((t) => t + 1)} contentContainerStyle={{ paddingBottom: insets.bottom }}>
          <Hero onWork={() => navigate("work")} onResume={resume} />

          {section(
            "work",
            <>
              <SectionHead
                eyebrow="Selected work"
                title="Three projects,"
                accent="one habit: make it clear."
                lede="A thesis game where I focused on design and data analysis, a farm management UI, and a membership database made visual. Open any project for the full case."
                size={titleSize}
                style={{ marginBottom: 44 }}
              />
              <WorkGrid />
            </>,
            40,
          )}

          {section(
            "about",
            <>
              <SectionHead eyebrow="About" title="A designer who" accent="checks the numbers." size={titleSize} style={{ marginBottom: 40 }} />
              <About />
            </>,
          )}

          {section("contact", <Contact onResume={resume} />)}
          <Footer />
        </ScrollView>
      </ScrollContext.Provider>
      <Nav items={NAV} active={active} scrolled={scrolled} onNavigate={navigate} onResume={resume} />
    </View>
  );
}
