import { useEffect, useRef } from "react";
import { Animated, Easing, Image, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { c, font, radius, softShadow, useLayout, web } from "../theme";
import { Float, Reveal, useReduceMotion } from "./motion";
import { Button, Tag } from "./ui";

/** Slow-drifting soft color fields behind the hero. */
function Blobs() {
  const { width, bp } = useLayout();
  const reduce = useReduceMotion();
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(a, { toValue: 1, duration: 9000, easing: Easing.inOut(Easing.sin), useNativeDriver: Platform.OS !== "web" }),
        Animated.timing(a, { toValue: 0, duration: 9000, easing: Easing.inOut(Easing.sin), useNativeDriver: Platform.OS !== "web" }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [a, reduce]);
  const s = bp === "phone" ? 0.6 : 1;
  const blob = (color: string, size: number, left: number, top: number, dx: number, dy: number) => (
    <Animated.View
      style={[
        { position: "absolute", width: size * s, height: size * s, borderRadius: size, backgroundColor: color, left, top },
        web({ filter: "blur(70px)" }),
        { opacity: Platform.OS === "web" ? 0.7 : 0.35 },
        { transform: [{ translateX: a.interpolate({ inputRange: [0, 1], outputRange: [0, dx] }) }, { translateY: a.interpolate({ inputRange: [0, 1], outputRange: [0, dy] }) }] },
      ]}
    />
  );
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: "hidden" }]}>
      {blob(c.sageSoft, 520, width * 0.55, -80, -60, 40)}
      {blob(c.claySoft, 420, width * 0.72, 260, 40, -50)}
      {blob(c.lilacSoft, 460, -140, 340, 70, -30)}
      {blob(c.butterSoft, 300, width * 0.3, 40, 50, 60)}
    </View>
  );
}

export function Hero({ onWork, onResume }: { onWork: () => void; onResume: () => void }) {
  const { gutter, contentWidth, bp, height } = useLayout();
  const insets = useSafeAreaInsets();
  const desktop = bp === "desktop";
  const phone = bp === "phone";
  const size = desktop ? 76 : bp === "tablet" ? 60 : 42;
  const photoW = desktop ? 380 : bp === "tablet" ? 300 : Math.min(contentWidth, 340);

  return (
    <View style={{ minHeight: desktop ? Math.max(height, 760) : undefined, paddingTop: insets.top + (desktop ? 150 : 120), paddingBottom: 70, paddingHorizontal: gutter, alignItems: "center" }}>
      <Blobs />
      <View style={[{ width: contentWidth, gap: desktop ? 72 : 48 }, !phone && { flexDirection: "row", alignItems: "center" }]}>
        <View style={{ flex: phone ? undefined : 1 }}>
          <Reveal immediate>
            <View style={styles.badge}>
              <View style={styles.live} />
              <Text style={styles.badgeText}>Open to internships · 2026</Text>
            </View>
          </Reveal>
          <Reveal immediate delay={120}>
            <Text style={[styles.headline, { fontSize: size, lineHeight: size * 1.06, letterSpacing: -size * 0.03 }]}>
              Designing calm interfaces and <Text style={styles.italic}>data people can read.</Text>
            </Text>
          </Reveal>
          <Reveal immediate delay={240}>
            <Text style={[styles.sub, { fontSize: desktop ? 19 : 17 }]}>
              I’m Marc, a fourth-year Computer Science student at De La Salle Lipa. I design UI and turn raw records into something a team can understand at a glance.
            </Text>
          </Reveal>
          <Reveal immediate delay={360}>
            <View style={styles.ctas}>
              <Button label="See selected work" icon="↓" variant="solid" onPress={onWork} />
              <Button label="Download résumé" onPress={onResume} />
            </View>
          </Reveal>
        </View>

        <Reveal immediate delay={300} style={{ alignItems: "center" }}>
          <Float amount={10} duration={5200}>
            <View style={[styles.photo, { width: photoW, height: photoW * 1.18 }, softShadow(1.6)]}>
              <Image source={require("../../assets/images/profile/marc.jpg")} style={{ width: "100%", height: "100%" }} resizeMode="cover" accessibilityLabel="Portrait of Marc Arboleda" />
            </View>
          </Float>
          <Float amount={7} duration={3800} delay={600} style={[styles.chip, { left: phone ? 0 : -48, top: photoW * 0.18 }]}>
            <View style={[styles.chipInner, softShadow(1.2)]}>
              <Text style={styles.chipEmoji}>✦</Text>
              <View>
                <Text style={styles.chipLabel}>Focus</Text>
                <Text style={styles.chipValue}>UI design · Data</Text>
              </View>
            </View>
          </Float>
          <Float amount={8} duration={4600} delay={1200} style={[styles.chip, { right: phone ? 0 : -36, bottom: photoW * 0.16 }]}>
            <View style={[styles.chipInner, softShadow(1.2)]}>
              <Text style={[styles.chipEmoji, { color: c.clay }]}>●</Text>
              <View>
                <Text style={styles.chipLabel}>Based in</Text>
                <Text style={styles.chipValue}>Laguna, Philippines</Text>
              </View>
            </View>
          </Float>
        </Reveal>
      </View>

      <Reveal immediate delay={520} style={{ width: contentWidth, marginTop: desktop ? 80 : 56 }}>
        <View style={styles.strip}>
          <Text style={styles.stripLabel}>Tools I use</Text>
          <View style={styles.stripTags}>
            {["UI design", "Google Sheets", "Python", "R", "Unity", "React Native", "Supabase"].map((t) => (
              <Tag key={t} label={t} />
            ))}
          </View>
        </View>
      </Reveal>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  live: { width: 8, height: 8, borderRadius: 4, backgroundColor: c.sage, ...web({ boxShadow: `0 0 0 4px ${c.sageSoft}` }) },
  badgeText: { fontFamily: font.semibold, fontSize: 13, color: c.ink },
  headline: { fontFamily: font.display, color: c.ink, marginTop: 26 },
  italic: { fontFamily: font.displayItalic, color: c.sage },
  sub: { fontFamily: font.regular, lineHeight: 30, color: c.body, marginTop: 24, maxWidth: 560 },
  ctas: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 34 },
  photo: { borderRadius: radius.xl, overflow: "hidden", borderWidth: 6, borderColor: c.surface, backgroundColor: c.bgDeep },
  chip: { position: "absolute" },
  chipInner: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: c.surface, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: c.line },
  chipEmoji: { fontSize: 16, color: c.sage },
  chipLabel: { fontFamily: font.medium, fontSize: 11, color: c.muted },
  chipValue: { fontFamily: font.semibold, fontSize: 13.5, color: c.ink },
  strip: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 16, borderTopWidth: 1, borderTopColor: c.line, paddingTop: 24 },
  stripLabel: { fontFamily: font.semibold, fontSize: 12.5, letterSpacing: 1.4, textTransform: "uppercase", color: c.muted },
  stripTags: { flexDirection: "row", flexWrap: "wrap", gap: 8, flex: 1 },
});
