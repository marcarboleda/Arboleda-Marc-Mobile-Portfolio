import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { color, font, useLayout, type InteractionState } from "../theme";
import { Mono } from "./ui";

export type NavItem = { id: string; label: string };

type Props = {
  items: NavItem[];
  active: string | null;
  scrolled: boolean;
  onNavigate: (id: string) => void;
  onResume: () => void;
};

export const NAV_HEIGHT = 64;

export function Nav({ items, active, scrolled, onNavigate, onResume }: Props) {
  const { gutter, contentWidth, isDesktop } = useLayout();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const go = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <View
      style={[
        styles.bar,
        { paddingTop: insets.top, paddingHorizontal: gutter },
        scrolled && styles.barScrolled,
      ]}
    >
      <View style={[styles.inner, { width: contentWidth }]}>
        <Pressable onPress={() => go("top")} accessibilityRole="button" accessibilityLabel="Back to top">
          <Text style={styles.mark}>
            M<Text style={{ fontFamily: font.displayItalic }}>a</Text>
            <Text style={{ color: color.accent }}>.</Text>
          </Text>
        </Pressable>

        {isDesktop ? (
          <View style={styles.links}>
            {items.map((it, i) => (
              <Pressable key={it.id} onPress={() => go(it.id)} accessibilityRole="link">
                {(s) => {
                  const { hovered } = s as InteractionState;
                  const on = active === it.id;
                  return (
                    <Text style={[styles.link, (on || hovered) && { color: color.text }]}>
                      <Text style={{ color: on ? color.accent : color.faint }}>{String(i + 1).padStart(2, "0")} </Text>
                      {it.label}
                    </Text>
                  );
                }}
              </Pressable>
            ))}
            <Pressable
              onPress={onResume}
              accessibilityRole="link"
              style={(s) => [styles.resume, (s as InteractionState).hovered && { backgroundColor: color.text, borderColor: color.text }]}
            >
              {(s) => <Text style={[styles.resumeText, (s as InteractionState).hovered && { color: color.bg }]}>Résumé ↓</Text>}
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel="Open menu" style={styles.menuBtn}>
            <Text style={styles.menuText}>Menu</Text>
            <View style={{ gap: 4 }}>
              <View style={styles.burger} />
              <View style={[styles.burger, { width: 12 }]} />
            </View>
          </Pressable>
        )}
      </View>

      <Modal visible={open} animationType="fade" transparent onRequestClose={() => setOpen(false)} statusBarTranslucent>
        <View style={[styles.sheet, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 24, paddingHorizontal: gutter }]}>
          <View style={styles.sheetHead}>
            <Mono>Navigate</Mono>
            <Pressable onPress={() => setOpen(false)} accessibilityRole="button" accessibilityLabel="Close menu" hitSlop={12}>
              <Text style={styles.menuText}>Close ✕</Text>
            </Pressable>
          </View>
          <View style={{ marginTop: 32 }}>
            {items.map((it, i) => (
              <Pressable key={it.id} onPress={() => go(it.id)} accessibilityRole="link" style={styles.sheetRow}>
                <Mono style={{ color: color.accent, width: 36 }}>{String(i + 1).padStart(2, "0")}</Mono>
                <Text style={styles.sheetLink}>{it.label}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={() => {
              setOpen(false);
              onResume();
            }}
            style={styles.sheetResume}
            accessibilityRole="link"
          >
            <Text style={[styles.resumeText, { color: color.bg }]}>Download résumé ↓</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "transparent",
  },
  barScrolled: { backgroundColor: "rgba(11,11,10,0.92)", borderBottomColor: color.line },
  inner: { height: NAV_HEIGHT, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  mark: { fontFamily: font.display, fontSize: 30, color: color.text, letterSpacing: -0.5 },
  links: { flexDirection: "row", alignItems: "center", gap: 28 },
  link: { fontFamily: font.mono, fontSize: 12, letterSpacing: 0.8, color: color.muted, textTransform: "uppercase" },
  resume: { borderWidth: 1, borderColor: color.lineHi, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 2 },
  resumeText: { fontFamily: font.monoMedium, fontSize: 12, letterSpacing: 1, color: color.text, textTransform: "uppercase" },
  menuBtn: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  menuText: { fontFamily: font.mono, fontSize: 12, letterSpacing: 1.2, color: color.text, textTransform: "uppercase" },
  burger: { width: 18, height: 1.5, backgroundColor: color.text, alignSelf: "flex-end" },
  sheet: { flex: 1, backgroundColor: color.bg },
  sheetHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 46 },
  sheetRow: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.line,
  },
  sheetLink: { fontFamily: font.display, fontSize: 40, color: color.text, lineHeight: 46 },
  sheetResume: { marginTop: "auto", backgroundColor: color.accent, paddingVertical: 16, alignItems: "center", borderRadius: 2 },
});
