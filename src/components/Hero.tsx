import { useEffect, useRef } from "react";
import { Animated, Easing, Image, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { profile } from "../data/profile";
import { color, font, radius, useLayout, webOnly } from "../theme";
import { NAV_HEIGHT } from "./Nav";
import { useReduceMotion, useReveal } from "./Section";
import { Button, Glass } from "./ui";

type Props = { onWork: () => void; onResume: () => void; onContact: () => void };

export function Hero({ onWork, onResume, onContact }: Props) {
  const { gutter, contentWidth, bp } = useLayout();
  const insets = useSafeAreaInsets();
  const a = useReveal(true, 0);
  const b = useReveal(true, 150);
  const c = useReveal(true, 300);
  const desktop = bp === "desktop";
  const phone = bp === "phone";
  const nameSize = desktop ? 104 : bp === "tablet" ? 80 : 54;
  const photoW = desktop ? contentWidth * 0.36 : bp === "tablet" ? contentWidth * 0.42 : contentWidth;
  const photoH = phone ? photoW * 1.08 : photoW * 1.25;

  return (
    <View style={{ paddingTop: insets.top + NAV_HEIGHT + (desktop ? 80 : 40), paddingHorizontal: gutter, alignItems: "center" }}>
      <View style={{ width: contentWidth }}>
        <View style={[{ gap: desktop ? 56 : 36 }, !phone && { flexDirection: "row", alignItems: "center" }]}>
          <Animated.View style={[{ flex: phone ? undefined : 1 }, a]}>
            <StatusBadge />
            <Text style={[styles.name, { fontSize: nameSize, lineHeight: nameSize * 0.98, letterSpacing: -nameSize * 0.05, marginTop: 28 }]}>
              Marc Bradley{"\n"}
              <Text style={{ color: color.faint }}>Arboleda</Text>
              <Text style={{ color: color.accent }}>.</Text>
            </Text>
            <Text style={[styles.headline, { fontSize: desktop ? 21 : 18, lineHeight: desktop ? 32 : 28 }]}>
              Computer Science student working on <Text style={styles.hl}>data</Text>, <Text style={styles.hl}>quality assurance</Text> and{" "}
              <Text style={styles.hl}>machine learning</Text>, building systems people can rely on.
            </Text>
            <View style={styles.ctas}>
              <Button label="See my projects" icon="↓" variant="primary" onPress={onWork} />
              <Button label="Download résumé" onPress={onResume} />
              {!phone ? <Button label="Contact" onPress={onContact} /> : null}
            </View>
          </Animated.View>

          <Animated.View style={[{ width: photoW }, b]}>
            <View style={[styles.photo, { height: photoH }]}>
              <Image source={require("../../assets/images/profile/marc.jpg")} style={{ width: "100%", height: "100%" }} resizeMode="cover" accessibilityLabel="Portrait of Marc Arboleda" />
              <View style={[StyleSheet.absoluteFill, styles.photoShade]} pointerEvents="none" />
              <Glass style={styles.floatCard}>
                <Text style={styles.floatLabel}>Currently</Text>
                <Text style={styles.floatValue}>Statistics Officer · Musikalista</Text>
              </Glass>
            </View>
          </Animated.View>
        </View>

        <Animated.View style={[styles.stats, phone && { flexDirection: "column" }, c]}>
          {[
            { k: "Seeking", v: "Data, QA & data-management internships" },
            { k: "Studying", v: "BS Computer Science · De La Salle Lipa" },
            { k: "Based in", v: profile.location },
          ].map((s) => (
            <Glass key={s.k} style={styles.stat}>
              <Text style={styles.floatLabel}>{s.k}</Text>
              <Text style={styles.statValue}>{s.v}</Text>
            </Glass>
          ))}
        </Animated.View>
      </View>
      <Marquee />
    </View>
  );
}

function StatusBadge() {
  const reduce = useReduceMotion();
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce) return;
    const loop = Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: 1800, easing: Easing.out(Easing.quad), useNativeDriver: Platform.OS !== "web" }),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduce]);

  return (
    <View style={styles.badge}>
      <View style={{ width: 8, height: 8 }}>
        <Animated.View
          style={[
            styles.pulse,
            { opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }), transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] }) }] },
          ]}
        />
        <View style={styles.dot} />
      </View>
      <Text style={styles.badgeText}>Open to internships · 2026</Text>
    </View>
  );
}

const TOOLS = ["Google Sheets", "Excel", "Python", "R", "Jupyter", "Keras", "PyTorch", "C#", "Unity 6", "Supabase", "TypeScript", "React Native", "Git", "UiPath", "MEEGA+", "Data validation"];

function Marquee() {
  const { width } = useLayout();
  const reduce = useReduceMotion();
  const x = useRef(new Animated.Value(0)).current;
  const itemW = 170;
  const total = TOOLS.length * itemW;

  useEffect(() => {
    if (reduce) return;
    const loop = Animated.loop(Animated.timing(x, { toValue: -total, duration: TOOLS.length * 2200, easing: Easing.linear, useNativeDriver: Platform.OS !== "web" }));
    loop.start();
    return () => loop.stop();
  }, [x, total, reduce]);

  return (
    <View style={[styles.marquee, { width }]} accessibilityLabel={`Tools: ${TOOLS.join(", ")}`}>
      <Animated.View style={{ flexDirection: "row", transform: [{ translateX: x }] }}>
        {[...TOOLS, ...TOOLS, ...TOOLS].map((t, i) => (
          <View key={i} style={[styles.mItem, { width: itemW }]}>
            <Text style={styles.mStar}>✦</Text>
            <Text style={styles.mText} numberOfLines={1}>
              {t}
            </Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  name: { fontFamily: font.semibold, color: color.text },
  headline: { fontFamily: font.regular, color: color.muted, marginTop: 26, maxWidth: 580 },
  hl: { color: color.text, fontFamily: font.medium },
  ctas: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 36 },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(197,243,107,0.25)",
    backgroundColor: color.accentSoft,
  },
  dot: { position: "absolute", width: 8, height: 8, borderRadius: 4, backgroundColor: color.accent },
  pulse: { position: "absolute", width: 8, height: 8, borderRadius: 4, backgroundColor: color.accent },
  badgeText: { fontFamily: font.medium, fontSize: 13, color: color.accent },
  photo: { borderRadius: radius.xl, overflow: "hidden", borderWidth: 1, borderColor: color.border, backgroundColor: color.bgRaised },
  photoShade: { ...webOnly({ backgroundImage: "linear-gradient(180deg, rgba(6,6,8,0) 55%, rgba(6,6,8,0.85) 100%)" }) },
  floatCard: { position: "absolute", left: 14, right: 14, bottom: 14, padding: 16, borderRadius: radius.md, backgroundColor: "rgba(14,14,18,0.6)" },
  floatLabel: { fontFamily: font.mono, fontSize: 11, letterSpacing: 1, color: color.faint, textTransform: "uppercase" },
  floatValue: { fontFamily: font.medium, fontSize: 15, color: color.text, marginTop: 4 },
  stats: { flexDirection: "row", gap: 12, marginTop: 48 },
  stat: { flex: 1, padding: 20, borderRadius: radius.md },
  statValue: { fontFamily: font.medium, fontSize: 15, lineHeight: 22, color: color.text, marginTop: 6 },
  marquee: { marginTop: 72, overflow: "hidden", borderTopWidth: 1, borderBottomWidth: 1, borderColor: color.border, paddingVertical: 18 },
  mItem: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 10 },
  mStar: { color: color.accent, fontSize: 12 },
  mText: { fontFamily: font.medium, fontSize: 16, color: color.muted },
});
