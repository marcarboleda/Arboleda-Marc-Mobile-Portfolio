import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { profile } from "../data/profile";
import { color, font, useLayout } from "../theme";
import { NAV_HEIGHT } from "./Nav";
import { useReveal } from "./Section";
import { Body, Button, Mono, Rule } from "./ui";

type Props = { onWork: () => void; onResume: () => void; onContact: () => void };

const META = [
  { k: "Currently", v: "Statistics Officer, Musikalista" },
  { k: "Seeking", v: profile.seeking },
  { k: "Based in", v: profile.location },
];

export function Hero({ onWork, onResume, onContact }: Props) {
  const { gutter, contentWidth, bp, height } = useLayout();
  const insets = useSafeAreaInsets();
  const reveal = useReveal(true);
  const desktop = bp === "desktop";
  const nameSize = desktop ? 116 : bp === "tablet" ? 88 : 58;
  const photoW = desktop ? contentWidth * 0.34 : bp === "tablet" ? contentWidth * 0.42 : contentWidth;
  const photoH = bp === "phone" ? Math.min(photoW * 1.05, height * 0.48) : photoW * (4 / 3);

  const photo = (
    <View style={{ width: photoW }}>
      <View style={[styles.photoFrame, { height: photoH }]}>
        <Image
          source={require("../../assets/images/profile/marc.jpg")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          accessibilityLabel="Portrait of Marc Arboleda"
        />
      </View>
      <View style={styles.caption}>
        <Mono dim>Fig. 01</Mono>
        <Mono dim>Portrait</Mono>
      </View>
    </View>
  );

  return (
    <View style={{ paddingTop: insets.top + NAV_HEIGHT + (desktop ? 72 : 36), paddingHorizontal: gutter, alignItems: "center" }}>
      <Animated.View style={[{ width: contentWidth }, reveal]}>
        <View style={[{ gap: desktop ? 64 : 32 }, bp !== "phone" && { flexDirection: "row", alignItems: "flex-end" }]}>
          <View style={{ flex: bp !== "phone" ? 1 : undefined }}>
            <Mono>
              <Text style={{ color: color.accent }}>●</Text> Portfolio · 2026 · Open to internships
            </Mono>
            <Text style={[styles.name, { fontSize: nameSize, lineHeight: nameSize * 0.95, marginTop: desktop ? 36 : 24 }]}>
              Marc Bradley{"\n"}
              <Text style={{ fontFamily: font.displayItalic, color: color.muted }}>Arboleda</Text>
            </Text>
            <Text style={[styles.headline, { fontSize: desktop ? 22 : 18, lineHeight: desktop ? 32 : 27 }]}>{profile.headline}</Text>
            <View style={styles.ctas}>
              <Button label="View work" icon="↓" variant="solid" onPress={onWork} />
              <Button label="Résumé" icon="PDF" onPress={onResume} accessibilityLabel="Download résumé as PDF" />
              {bp !== "phone" ? <Button label="Contact" onPress={onContact} /> : null}
            </View>
          </View>
          {bp === "phone" ? null : photo}
        </View>
        {bp === "phone" ? <View style={{ marginTop: 36 }}>{photo}</View> : null}

        <View style={{ marginTop: desktop ? 72 : 44 }}>
          <Rule />
          <View style={[styles.metaRow, bp !== "phone" && { flexDirection: "row" }]}>
            {META.map((m, i) => (
              <View
                key={m.k}
                style={[
                  styles.metaCell,
                  bp !== "phone" && { flex: i === 1 ? 1.6 : 1 },
                  bp !== "phone" && i > 0 && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: color.line, paddingLeft: 20 },
                  bp === "phone" && i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.line },
                ]}
              >
                <Mono dim>{m.k}</Mono>
                <Body style={{ color: color.text, marginTop: 6, fontSize: 15, lineHeight: 22 }}>{m.v}</Body>
              </View>
            ))}
          </View>
          <Rule />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  name: { fontFamily: font.display, color: color.text, letterSpacing: -1.5 },
  headline: { fontFamily: font.sans, color: color.text, marginTop: 28, maxWidth: 560, opacity: 0.92 },
  ctas: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 36 },
  photoFrame: { overflow: "hidden", backgroundColor: color.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: color.lineHi },
  caption: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  metaRow: { paddingVertical: 4 },
  metaCell: { paddingVertical: 18, paddingRight: 16 },
});
