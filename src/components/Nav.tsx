import React from "react";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { font, softShadow, useColors, useLayout, useTheme, web, type InteractionState } from "../theme";

export type NavItem = { id: string; label: string };

function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  const c = useColors();
  const moon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${isDark ? "#EEEAE0" : "#1E2230"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const sun = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${isDark ? "#EEEAE0" : "#1E2230"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const icon = isDark ? sun : moon;
  const uri = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(icon)))}`;
  return (
    <Pressable
      onPress={toggle}
      accessibilityRole="button"
      accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={(s) => [
        {
          width: 38, height: 38, borderRadius: 19,
          alignItems: "center", justifyContent: "center",
          backgroundColor: c.surface,
          borderWidth: 1, borderColor: c.line,
        },
        (s as InteractionState).hovered && { backgroundColor: c.bgDeep },
        web({ transition: "background-color 200ms ease", cursor: "pointer" }),
      ]}
    >
      {React.createElement("img", { src: uri, width: 16, height: 16, style: { display: "block" } })}
    </Pressable>
  );
}

export function Nav({ items, active, scrolled, onNavigate, onResume }: { items: NavItem[]; active: string | null; scrolled: boolean; onNavigate: (id: string) => void; onResume: () => void }) {
  const { gutter, contentWidth, bp } = useLayout();
  const insets = useSafeAreaInsets();
  const c = useColors();
  const [open, setOpen] = useState(false);
  const wide = bp !== "phone";
  const go = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  const barOnBg = c.surface === "#1C1C22"
    ? "rgba(28,28,34,0.82)"   // dark
    : "rgba(255,253,248,0.78)"; // light

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingTop: insets.top + 14, paddingHorizontal: gutter }]}>
      <View
        style={[
          styles.bar,
          { width: contentWidth },
          scrolled && { backgroundColor: barOnBg, borderColor: c.line },
          scrolled && softShadow(0.8),
          web({ transition: "all 350ms ease", backdropFilter: scrolled ? "blur(16px) saturate(140%)" : "none" }),
        ]}
      >
        <Pressable onPress={() => go("top")} accessibilityRole="button" accessibilityLabel="Back to top" style={styles.brand}>
          <View style={[styles.mark, { backgroundColor: c.ink }]}>
            <Text style={[styles.markText, { color: c.bg }]}>m</Text>
          </View>
          <Text style={[styles.brandText, { color: c.ink }]}>Marc Arboleda</Text>
        </Pressable>

        {wide ? (
          <View style={styles.links}>
            {items.map((it) => {
              const on = active === it.id;
              return (
                <Pressable key={it.id} onPress={() => go(it.id)} accessibilityRole="link" style={(s) => [styles.link, (on || (s as InteractionState).hovered) && { backgroundColor: c.bgDeep }, web({ transition: "background-color 200ms ease" })]}>
                  <Text style={[styles.linkText, { color: c.body }, on && { color: c.ink }]}>{it.label}</Text>
                </Pressable>
              );
            })}
            <ThemeToggle />
            <Pressable onPress={onResume} accessibilityRole="link" style={(s) => [styles.resume, { backgroundColor: c.ink }, (s as InteractionState).hovered && { backgroundColor: c.sage }, web({ transition: "background-color 200ms ease" })]}>
              <Text style={[styles.resumeText, { color: c.bg }]}>Résumé</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <ThemeToggle />
            <Pressable onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel="Open menu" style={[styles.menu, { backgroundColor: c.surface, borderColor: c.line }]} hitSlop={8}>
              <View style={[styles.burger, { backgroundColor: c.ink }]} />
              <View style={[styles.burger, { width: 12, backgroundColor: c.ink }]} />
            </Pressable>
          </View>
        )}
      </View>

      <Modal visible={open} animationType="fade" transparent onRequestClose={() => setOpen(false)} statusBarTranslucent>
        <View style={[styles.sheet, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24, paddingHorizontal: gutter, backgroundColor: c.bg }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={[styles.brandText, { color: c.ink }]}>Marc Arboleda</Text>
            <Pressable onPress={() => setOpen(false)} accessibilityRole="button" accessibilityLabel="Close menu" style={[styles.menu, { backgroundColor: c.surface, borderColor: c.line }]}>
              <Text style={{ fontSize: 17, color: c.ink }}>✕</Text>
            </Pressable>
          </View>
          <View style={{ marginTop: 44, gap: 4 }}>
            {items.map((it) => (
              <Pressable key={it.id} onPress={() => go(it.id)} accessibilityRole="link" style={{ paddingVertical: 10 }}>
                <Text style={[styles.sheetLink, { color: c.ink }]}>{it.label}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={() => {
              setOpen(false);
              onResume();
            }}
            style={[styles.resume, { marginTop: "auto", alignItems: "center", paddingVertical: 16, backgroundColor: c.ink }]}
            accessibilityRole="link"
          >
            <Text style={[styles.resumeText, { color: c.bg }]}>Download résumé</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, alignItems: "center" },
  bar: { height: 58, borderRadius: 999, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "transparent" },
  brand: { flexDirection: "row", alignItems: "center", gap: 10, paddingRight: 8 },
  mark: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  markText: { fontFamily: font.displayItalic, fontSize: 21, marginTop: -3 },
  brandText: { fontFamily: font.semibold, fontSize: 15 },
  links: { flexDirection: "row", alignItems: "center", gap: 4 },
  link: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999 },
  linkText: { fontFamily: font.medium, fontSize: 14 },
  resume: { borderRadius: 999, paddingHorizontal: 18, paddingVertical: 10, marginLeft: 6 },
  resumeText: { fontFamily: font.semibold, fontSize: 14 },
  menu: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", gap: 5, borderWidth: 1 },
  burger: { width: 18, height: 1.6, borderRadius: 1 },
  sheet: { flex: 1 },
  sheetLink: { fontFamily: font.display, fontSize: 40, letterSpacing: -1 },
});
