import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { color, font, useLayout, webOnly, type InteractionState } from "../theme";

export type NavItem = { id: string; label: string };

type Props = {
  items: NavItem[];
  active: string | null;
  scrolled: boolean;
  onNavigate: (id: string) => void;
  onResume: () => void;
};

export const NAV_HEIGHT = 76;

export function Nav({ items, active, scrolled, onNavigate, onResume }: Props) {
  const { gutter, contentWidth, isDesktop } = useLayout();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const go = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingTop: insets.top + 12, paddingHorizontal: gutter }]}>
      <View style={[styles.bar, { width: contentWidth }, scrolled && styles.barScrolled]}>
        <Pressable onPress={() => go("top")} accessibilityRole="button" accessibilityLabel="Back to top" style={styles.brand}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>MA</Text>
          </View>
          {isDesktop ? <Text style={styles.brandText}>Marc Arboleda</Text> : null}
        </Pressable>

        {isDesktop ? (
          <View style={styles.links}>
            {items.map((it) => {
              const on = active === it.id;
              return (
                <Pressable
                  key={it.id}
                  onPress={() => go(it.id)}
                  accessibilityRole="link"
                  style={(s) => [styles.link, on && styles.linkOn, (s as InteractionState).hovered && !on && { backgroundColor: color.glass }, webOnly({ transitionDuration: "150ms" })]}
                >
                  <Text style={[styles.linkText, on && { color: color.text }]}>{it.label}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {isDesktop ? (
          <Pressable
            onPress={onResume}
            accessibilityRole="link"
            style={(s) => [styles.cta, (s as InteractionState).hovered && { backgroundColor: "#D4FA8A" }, webOnly({ transitionDuration: "150ms" })]}
          >
            <Text style={styles.ctaText}>Résumé ↓</Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel="Open menu" style={styles.menuBtn} hitSlop={8}>
            <View style={styles.burger} />
            <View style={[styles.burger, { width: 12 }]} />
          </Pressable>
        )}
      </View>

      <Modal visible={open} animationType="fade" transparent onRequestClose={() => setOpen(false)} statusBarTranslucent>
        <View style={[styles.sheet, { paddingTop: insets.top + 22, paddingBottom: insets.bottom + 24, paddingHorizontal: gutter }]}>
          <View style={styles.sheetHead}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>MA</Text>
            </View>
            <Pressable onPress={() => setOpen(false)} accessibilityRole="button" accessibilityLabel="Close menu" hitSlop={12} style={styles.close}>
              <Text style={{ color: color.text, fontSize: 18 }}>✕</Text>
            </Pressable>
          </View>
          <View style={{ marginTop: 40, gap: 6 }}>
            {items.map((it, i) => (
              <Pressable key={it.id} onPress={() => go(it.id)} accessibilityRole="link" style={styles.sheetRow}>
                <Text style={styles.sheetNum}>{String(i + 1).padStart(2, "0")}</Text>
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
            <Text style={styles.ctaText}>Download résumé ↓</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, alignItems: "center" },
  bar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "transparent",
  },
  barScrolled: {
    backgroundColor: "rgba(14,14,18,0.72)",
    borderColor: color.border,
    ...webOnly({ backdropFilter: "blur(18px) saturate(140%)", WebkitBackdropFilter: "blur(18px) saturate(140%)" }),
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 36, height: 36, borderRadius: 18, backgroundColor: color.text, alignItems: "center", justifyContent: "center" },
  logoText: { fontFamily: font.bold, fontSize: 13, color: color.bg, letterSpacing: -0.3 },
  brandText: { fontFamily: font.medium, fontSize: 15, color: color.text },
  links: { flexDirection: "row", alignItems: "center", gap: 2 },
  link: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  linkOn: { backgroundColor: color.glassHi },
  linkText: { fontFamily: font.medium, fontSize: 14, color: color.muted },
  cta: { backgroundColor: color.accent, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10 },
  ctaText: { fontFamily: font.semibold, fontSize: 14, color: color.accentInk },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "rgba(14,14,18,0.7)",
    borderWidth: 1,
    borderColor: color.border,
  },
  burger: { width: 18, height: 1.5, backgroundColor: color.text, borderRadius: 1 },
  sheet: { flex: 1, backgroundColor: color.bg },
  sheetHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  close: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: color.border, alignItems: "center", justifyContent: "center" },
  sheetRow: { flexDirection: "row", alignItems: "baseline", gap: 16, paddingVertical: 12 },
  sheetNum: { fontFamily: font.mono, fontSize: 13, color: color.accent, width: 24 },
  sheetLink: { fontFamily: font.semibold, fontSize: 38, color: color.text, letterSpacing: -1.2 },
  sheetResume: { marginTop: "auto", backgroundColor: color.accent, paddingVertical: 17, alignItems: "center", borderRadius: 999 },
});
