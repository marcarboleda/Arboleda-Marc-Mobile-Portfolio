import { type ReactNode } from "react";
import { Linking, Platform, Pressable, StyleSheet, Text, type StyleProp, type TextStyle } from "react-native";
import { color, font, webOnly, type InteractionState } from "../theme";

export function openUrl(url: string) {
  if (Platform.OS === "web" && typeof window !== "undefined" && /^https?:|\.pdf$/.test(url)) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  Linking.openURL(url).catch(() => {});
}

/** Small uppercase monospace label used inside the embedded demo screens. */
export function Mono({ children, style, dim }: { children: ReactNode; style?: StyleProp<TextStyle>; dim?: boolean }) {
  return <Text style={[styles.mono, dim && { color: color.faint }, style]}>{children}</Text>;
}

/** Toggle chip used inside the embedded demo screens. */
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
  mono: { fontFamily: font.mono, fontSize: 11, letterSpacing: 1.2, color: color.muted, textTransform: "uppercase" },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: color.border, borderRadius: 999 },
  chipActive: { backgroundColor: color.accent, borderColor: color.accent },
  chipText: { fontFamily: font.medium, fontSize: 13, color: color.text },
});
