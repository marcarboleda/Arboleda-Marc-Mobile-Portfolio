import { type ReactNode } from "react";
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { color, font, radius, webOnly, type InteractionState } from "../theme";

export function openUrl(url: string) {
  if (Platform.OS === "web" && typeof window !== "undefined" && /^https?:|\.pdf$/.test(url)) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  Linking.openURL(url).catch(() => {});
}

export function Eyebrow({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.eyebrow, style]}>{children}</Text>;
}

export function Body({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

/** Frosted panel used for every card on the page. */
export function Glass({ children, style, hover }: { children: ReactNode; style?: StyleProp<ViewStyle>; hover?: boolean }) {
  return <View style={[styles.glass, hover && styles.glassHover, style]}>{children}</View>;
}

export function Pill({ label, tone = "default" }: { label: string; tone?: "default" | "accent" }) {
  return (
    <View style={[styles.pill, tone === "accent" && { backgroundColor: color.accentSoft, borderColor: "rgba(197,243,107,0.3)" }]}>
      <Text style={[styles.pillText, tone === "accent" && { color: color.accent }]}>{label}</Text>
    </View>
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  icon?: string;
  accessibilityLabel?: string;
};

export function Button({ label, onPress, variant = "secondary", icon, accessibilityLabel }: ButtonProps) {
  const primary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={(s) => {
        const { hovered, pressed } = s as InteractionState;
        return [
          styles.btn,
          primary ? styles.btnPrimary : styles.btnSecondary,
          hovered && (primary ? { backgroundColor: "#D4FA8A", transform: [{ translateY: -1 }] } : { borderColor: color.borderHi, backgroundColor: color.glassHi }),
          pressed && { transform: [{ scale: 0.98 }] },
          webOnly({ transitionDuration: "180ms" }),
        ];
      }}
    >
      <Text style={[styles.btnText, primary && { color: color.accentInk }]}>
        {label}
        {icon ? <Text style={{ opacity: 0.7 }}>{`  ${icon}`}</Text> : null}
      </Text>
    </Pressable>
  );
}

export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={(s) => [
        styles.chip,
        active && styles.chipActive,
        !active && (s as InteractionState).hovered && { borderColor: color.borderHi },
        webOnly({ transitionDuration: "150ms" }),
      ]}
    >
      <Text style={[styles.chipText, active && { color: color.accentInk }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontFamily: font.mono, fontSize: 12, letterSpacing: 1.2, color: color.muted, textTransform: "uppercase" },
  body: { fontFamily: font.regular, fontSize: 16, lineHeight: 26, color: color.muted },
  glass: {
    backgroundColor: color.glass,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.lg,
    ...webOnly({ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }),
  },
  glassHover: { borderColor: color.borderHi, backgroundColor: color.glassHi },
  pill: { borderWidth: 1, borderColor: color.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "rgba(255,255,255,0.02)" },
  pillText: { fontFamily: font.mono, fontSize: 12, color: color.muted },
  btn: { borderRadius: 999, paddingVertical: 14, paddingHorizontal: 22, borderWidth: 1 },
  btnPrimary: { backgroundColor: color.accent, borderColor: color.accent },
  btnSecondary: { backgroundColor: color.glass, borderColor: color.border },
  btnText: { fontFamily: font.medium, fontSize: 15, color: color.text },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: color.border, borderRadius: 999 },
  chipActive: { backgroundColor: color.accent, borderColor: color.accent },
  chipText: { fontFamily: font.medium, fontSize: 13, color: color.text },
});

export function Mono({ children, style, dim }: { children: ReactNode; style?: StyleProp<TextStyle>; dim?: boolean }) {
  return <Text style={[styles.eyebrow, { fontSize: 11 }, dim && { color: color.faint }, style]}>{children}</Text>;
}
