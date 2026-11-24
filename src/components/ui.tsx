import { type ReactNode } from "react";
import { Linking, Platform, Pressable, Text, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { c as staticC, font, useColors, web, type InteractionState } from "../theme";
import { Reveal } from "./motion";

export function openUrl(url: string) {
  if (Platform.OS === "web" && typeof window !== "undefined" && /^https?:|\.pdf$/.test(url)) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  Linking.openURL(url).catch(() => {});
}

export const TINT = {
  sage: { fg: staticC.sage, bg: staticC.sageSoft },
  clay: { fg: staticC.clay, bg: staticC.claySoft },
  lilac: { fg: staticC.lilac, bg: staticC.lilacSoft },
  butter: { fg: "#9A7414", bg: staticC.butterSoft },
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
  const c = useColors();
  const solid = variant === "solid";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={(s) => {
        const { hovered, pressed } = s as InteractionState;
        return [
          { borderRadius: 999, borderWidth: 1, paddingVertical: 14, paddingHorizontal: 22 },
          solid ? { backgroundColor: c.ink, borderColor: c.ink } : { backgroundColor: c.surface, borderColor: c.lineStrong },
          hovered && (solid ? { backgroundColor: c.sage, borderColor: c.sage } : { borderColor: c.ink }),
          hovered && { transform: [{ translateY: -2 }] },
          pressed && { transform: [{ scale: 0.98 }] },
          web({ transitionDuration: "220ms", transitionTimingFunction: "cubic-bezier(.2,.8,.2,1)" }),
        ];
      }}
    >
      <Text style={{ fontFamily: font.semibold, fontSize: 15, color: solid ? c.white : c.ink }}>
        {label}
        {icon ? `  ${icon}` : ""}
      </Text>
    </Pressable>
  );
}

export function Tag({ label, tint }: { label: string; tint?: Tint }) {
  const c = useColors();
  const t = tint ? TINT[tint] : null;
  return (
    <View style={[{ borderWidth: 1, borderColor: c.line, backgroundColor: c.surface, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }, t ? { backgroundColor: t.bg, borderColor: "transparent" } : null]}>
      <Text style={[{ fontFamily: font.medium, fontSize: 12.5, color: c.body }, t ? { color: t.fg } : null]}>{label}</Text>
    </View>
  );
}

export function Eyebrow({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const c = useColors();
  return <Text style={[{ fontFamily: font.semibold, fontSize: 12.5, letterSpacing: 1.6, textTransform: "uppercase", color: c.muted }, style]}>{children}</Text>;
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
  const c = useColors();
  return (
    <Reveal style={style}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: c.clay }} />
        <Eyebrow>{eyebrow}</Eyebrow>
      </View>
      <Text style={[{ fontFamily: font.display, color: c.ink, maxWidth: 820 }, { fontSize: size, lineHeight: size * 1.12, letterSpacing: -size * 0.02 }]}>
        {title}
        {accent ? <Text style={{ fontFamily: font.displayItalic, color: c.sage }}>{` ${accent}`}</Text> : null}
      </Text>
      {lede ? <Text style={{ fontFamily: font.regular, fontSize: 17, lineHeight: 28, color: c.body, marginTop: 18, maxWidth: 620 }}>{lede}</Text> : null}
    </Reveal>
  );
}
