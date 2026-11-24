import { type ReactNode } from "react";
import { Linking, Platform, Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { c, font, web, type InteractionState } from "../theme";
import { Reveal } from "./motion";

export function openUrl(url: string) {
  if (Platform.OS === "web" && typeof window !== "undefined" && /^https?:|\.pdf$/.test(url)) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  Linking.openURL(url).catch(() => {});
}

export const TINT = {
  sage: { fg: c.sage, bg: c.sageSoft },
  clay: { fg: c.clay, bg: c.claySoft },
  lilac: { fg: c.lilac, bg: c.lilacSoft },
  butter: { fg: "#9A7414", bg: c.butterSoft },
} as const;
export type Tint = keyof typeof TINT;

export function Button({
  label,
  onPress,
  variant = "ghost",
  icon,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  variant?: "solid" | "ghost";
  icon?: string;
  accessibilityLabel?: string;
}) {
  const solid = variant === "solid";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={(s) => {
        const { hovered, pressed } = s as InteractionState;
        return [
          styles.btn,
          solid ? { backgroundColor: c.ink, borderColor: c.ink } : { backgroundColor: c.surface, borderColor: c.lineStrong },
          hovered && (solid ? { backgroundColor: c.sage, borderColor: c.sage } : { borderColor: c.ink }),
          hovered && { transform: [{ translateY: -2 }] },
          pressed && { transform: [{ scale: 0.98 }] },
          web({ transitionDuration: "220ms", transitionTimingFunction: "cubic-bezier(.2,.8,.2,1)" }),
        ];
      }}
    >
      <Text style={[styles.btnText, { color: solid ? c.white : c.ink }]}>
        {label}
        {icon ? `  ${icon}` : ""}
      </Text>
    </Pressable>
  );
}

export function Tag({ label, tint }: { label: string; tint?: Tint }) {
  const t = tint ? TINT[tint] : null;
  return (
    <View style={[styles.tag, t ? { backgroundColor: t.bg, borderColor: "transparent" } : null]}>
      <Text style={[styles.tagText, t ? { color: t.fg } : null]}>{label}</Text>
    </View>
  );
}

export function Eyebrow({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.eyebrow, style]}>{children}</Text>;
}

/** Section heading: small eyebrow, large serif title with an italic accent, optional lede. */
export function SectionHead({
  eyebrow,
  title,
  accent,
  lede,
  size,
  style,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  lede?: string;
  size: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Reveal style={style}>
      <View style={styles.eyebrowRow}>
        <View style={styles.eyebrowDot} />
        <Eyebrow>{eyebrow}</Eyebrow>
      </View>
      <Text style={[styles.title, { fontSize: size, lineHeight: size * 1.12, letterSpacing: -size * 0.02 }]}>
        {title}
        {accent ? <Text style={styles.accent}>{` ${accent}`}</Text> : null}
      </Text>
      {lede ? <Text style={styles.lede}>{lede}</Text> : null}
    </Reveal>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: 999, borderWidth: 1, paddingVertical: 14, paddingHorizontal: 22 },
  btnText: { fontFamily: font.semibold, fontSize: 15 },
  tag: { borderWidth: 1, borderColor: c.line, backgroundColor: c.surface, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  tagText: { fontFamily: font.medium, fontSize: 12.5, color: c.body },
  eyebrowRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  eyebrowDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: c.clay },
  eyebrow: { fontFamily: font.semibold, fontSize: 12.5, letterSpacing: 1.6, textTransform: "uppercase", color: c.muted },
  title: { fontFamily: font.display, color: c.ink, maxWidth: 820 },
  accent: { fontFamily: font.displayItalic, color: c.sage },
  lede: { fontFamily: font.regular, fontSize: 17, lineHeight: 28, color: c.body, marginTop: 18, maxWidth: 620 },
});
