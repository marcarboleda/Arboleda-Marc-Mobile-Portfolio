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
import { color, font, type InteractionState } from "../theme";

export function openUrl(url: string) {
  if (Platform.OS === "web" && typeof window !== "undefined" && /^https?:/.test(url)) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  Linking.openURL(url).catch(() => {});
}

export function Mono({ children, style, dim }: { children: ReactNode; style?: StyleProp<TextStyle>; dim?: boolean }) {
  return <Text style={[styles.mono, dim && { color: color.faint }, style]}>{children}</Text>;
}

export function Body({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

export function Rule({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.rule, style]} />;
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "solid" | "ghost";
  icon?: string;
  accessibilityLabel?: string;
};

export function Button({ label, onPress, variant = "ghost", icon, accessibilityLabel }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={(s) => {
        const { hovered, pressed } = s as InteractionState;
        return [
          styles.btn,
          variant === "solid" ? styles.btnSolid : styles.btnGhost,
          hovered && (variant === "solid" ? { backgroundColor: color.text } : { borderColor: color.text }),
          pressed && { opacity: 0.75 },
        ];
      }}
    >
      <Text style={[styles.btnText, variant === "solid" && { color: color.bg }]}>
        {label}
        {icon ? `  ${icon}` : ""}
      </Text>
    </Pressable>
  );
}

export function Chip({ label, active, onPress, count }: { label: string; active: boolean; onPress: () => void; count?: number }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={(s) => {
        const { hovered } = s as InteractionState;
        return [styles.chip, active && styles.chipActive, !active && hovered && { borderColor: color.muted }];
      }}
    >
      <Text style={[styles.chipText, active && { color: color.bg }]}>
        {label}
        {count !== undefined ? <Text style={{ opacity: 0.6 }}>{`  ${count}`}</Text> : null}
      </Text>
    </Pressable>
  );
}

export function TextLink({ label, url, style }: { label: string; url: string; style?: StyleProp<TextStyle> }) {
  return (
    <Pressable onPress={() => openUrl(url)} accessibilityRole="link">
      {(s) => {
        const { hovered } = s as InteractionState;
        return <Text style={[styles.link, hovered && { color: color.accent }, style]}>{label}</Text>;
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mono: { fontFamily: font.mono, fontSize: 11, letterSpacing: 1.4, color: color.muted, textTransform: "uppercase" },
  body: { fontFamily: font.sans, fontSize: 16, lineHeight: 26, color: color.muted },
  rule: { height: StyleSheet.hairlineWidth, backgroundColor: color.line, alignSelf: "stretch" },
  btn: { paddingVertical: 13, paddingHorizontal: 20, borderWidth: 1, borderRadius: 2 },
  btnSolid: { backgroundColor: color.accent, borderColor: color.accent },
  btnGhost: { backgroundColor: "transparent", borderColor: color.lineHi },
  btnText: { fontFamily: font.monoMedium, fontSize: 12, letterSpacing: 1.2, color: color.text, textTransform: "uppercase" },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: color.line, borderRadius: 999 },
  chipActive: { backgroundColor: color.text, borderColor: color.text },
  chipText: { fontFamily: font.mono, fontSize: 12, letterSpacing: 0.6, color: color.text },
  link: { fontFamily: font.sans, fontSize: 15, color: color.text, textDecorationLine: "underline", textDecorationColor: color.lineHi },
});
