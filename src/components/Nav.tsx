import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { c, font, softShadow, useLayout, web, type InteractionState } from "../theme";

export type NavItem = { id: string; label: string };

export function Nav({ items, active, scrolled, onNavigate, onResume }: { items: NavItem[]; active: string | null; scrolled: boolean; onNavigate: (id: string) => void; onResume: () => void }) {
  const { gutter, contentWidth, bp } = useLayout();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const wide = bp !== "phone";
  const go = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingTop: insets.top + 14, paddingHorizontal: gutter }]}>
      <View
        style={[
          styles.bar,
          { width: contentWidth },
          scrolled && styles.barOn,
          scrolled && softShadow(0.8),
          web({ transition: "all 350ms ease", backdropFilter: scrolled ? "blur(16px) saturate(140%)" : "none" }),
        ]}
      >
        <Pressable onPress={() => go("top")} accessibilityRole="button" accessibilityLabel="Back to top" style={styles.brand}>
          <View style={styles.mark}>
            <Text style={styles.markText}>m</Text>
          </View>
          <Text style={styles.brandText}>Marc Arboleda</Text>
        </Pressable>

        {wide ? (
          <View style={styles.links}>
            {items.map((it) => {
              const on = active === it.id;
              return (
                <Pressable key={it.id} onPress={() => go(it.id)} accessibilityRole="link" style={(s) => [styles.link, (on || (s as InteractionState).hovered) && { backgroundColor: c.bgDeep }, web({ transition: "background-color 200ms ease" })]}>
                  <Text style={[styles.linkText, on && { color: c.ink }]}>{it.label}</Text>
                </Pressable>
              );
            })}
            <Pressable onPress={onResume} accessibilityRole="link" style={(s) => [styles.resume, (s as InteractionState).hovered && { backgroundColor: c.sage }, web({ transition: "background-color 200ms ease" })]}>
              <Text style={styles.resumeText}>Résumé</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel="Open menu" style={styles.menu} hitSlop={8}>
            <View style={styles.burger} />
            <View style={[styles.burger, { width: 12 }]} />
          </Pressable>
        )}
      </View>

      <Modal visible={open} animationType="fade" transparent onRequestClose={() => setOpen(false)} statusBarTranslucent>
        <View style={[styles.sheet, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24, paddingHorizontal: gutter }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.brandText}>Marc Arboleda</Text>
            <Pressable onPress={() => setOpen(false)} accessibilityRole="button" accessibilityLabel="Close menu" style={styles.menu}>
              <Text style={{ fontSize: 17, color: c.ink }}>✕</Text>
            </Pressable>
          </View>
          <View style={{ marginTop: 44, gap: 4 }}>
            {items.map((it) => (
              <Pressable key={it.id} onPress={() => go(it.id)} accessibilityRole="link" style={{ paddingVertical: 10 }}>
                <Text style={styles.sheetLink}>{it.label}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={() => {
              setOpen(false);
              onResume();
            }}
            style={[styles.resume, { marginTop: "auto", alignItems: "center", paddingVertical: 16 }]}
            accessibilityRole="link"
          >
            <Text style={styles.resumeText}>Download résumé</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, alignItems: "center" },
  bar: { height: 58, borderRadius: 999, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "transparent" },
  barOn: { backgroundColor: "rgba(255,253,248,0.78)", borderColor: c.line },
  brand: { flexDirection: "row", alignItems: "center", gap: 10, paddingRight: 8 },
  mark: { width: 36, height: 36, borderRadius: 18, backgroundColor: c.ink, alignItems: "center", justifyContent: "center" },
  markText: { fontFamily: font.displayItalic, fontSize: 21, color: c.bg, marginTop: -3 },
  brandText: { fontFamily: font.semibold, fontSize: 15, color: c.ink },
  links: { flexDirection: "row", alignItems: "center", gap: 4 },
  link: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999 },
  linkText: { fontFamily: font.medium, fontSize: 14, color: c.body },
  resume: { backgroundColor: c.ink, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 10, marginLeft: 6 },
  resumeText: { fontFamily: font.semibold, fontSize: 14, color: c.white },
  menu: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", gap: 5, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line },
  burger: { width: 18, height: 1.6, backgroundColor: c.ink, borderRadius: 1 },
  sheet: { flex: 1, backgroundColor: c.bg },
  sheetLink: { fontFamily: font.display, fontSize: 40, color: c.ink, letterSpacing: -1 },
});
