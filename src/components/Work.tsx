import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, Modal, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WORK, type Work } from "../data/work";
import { font, radius, softShadow, useColors, useLayout, web, type InteractionState } from "../theme";
import { BrowserFrame, MediaFor, PhoneFrame, Thumbs } from "./Media";
import { Reveal, useReduceMotion } from "./motion";
import { Tag, TINT } from "./ui";

type Rect = { x: number; y: number; w: number; h: number };

export function WorkGrid() {
  const { bp, contentWidth } = useLayout();
  const desktop = bp === "desktop";
  const gap = bp === "phone" ? 16 : 20;
  const refs = useRef<Record<string, View | null>>({});
  const [open, setOpen] = useState<{ work: Work; origin: Rect } | null>(null);

  const openWork = (w: Work) => {
    const node = refs.current[w.id];
    const fallback = { x: 0, y: 0, w: contentWidth, h: 400 };
    if (!node) return setOpen({ work: w, origin: fallback });
    node.measureInWindow((x, y, ww, hh) => setOpen({ work: w, origin: ww ? { x, y, w: ww, h: hh } : fallback }));
  };

  const card = (w: Work, layout: "tall" | "wide" | "stack", delay: number, style?: object) => (
    <Reveal key={w.id} delay={delay} style={style}>
      <View ref={(r) => { refs.current[w.id] = r; }} collapsable={false} style={{ flex: 1 }}>
        <WorkCard work={w} layout={layout} hidden={open?.work.id === w.id} onOpen={() => openWork(w)} />
      </View>
    </Reveal>
  );

  const [tabula, farm, members] = WORK;
  return (
    <View>
      {desktop ? (
        <View style={{ flexDirection: "row", gap }}>
          {card(tabula, "tall", 0, { width: contentWidth * 0.36 })}
          <View style={{ flex: 1, gap }}>
            {card(farm, "wide", 120)}
            {card(members, "wide", 240)}
          </View>
        </View>
      ) : (
        <View style={{ gap }}>
          {card(tabula, bp === "tablet" ? "wide" : "stack", 0)}
          {card(farm, bp === "tablet" ? "wide" : "stack", 80)}
          {card(members, bp === "tablet" ? "wide" : "stack", 160)}
        </View>
      )}
      {open ? <CaseStudy work={open.work} origin={open.origin} onClosed={() => setOpen(null)} /> : null}
    </View>
  );
}

/* ------------------------------------------------------------------ card */

function WorkCard({ work: w, layout, hidden, onOpen }: { work: Work; layout: "tall" | "wide" | "stack"; hidden: boolean; onOpen: () => void }) {
  const t = TINT[w.tint];
  const c = useColors();
  const [hover, setHover] = useState(false);
  const [ready, setReady] = useState(false);
  const { bp } = useLayout();
  // Load the heavy walkthrough GIF a moment after the page settles, not during first paint.
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(id);
  }, []);
  const tall = layout === "tall";
  const wide = layout === "wide";

  const media =
    w.media.kind === "video" ? (
      <View style={[{ alignItems: "center", justifyContent: "center", overflow: "hidden" }, { backgroundColor: t.bg }, tall ? { flex: 1, minHeight: 420 } : { width: wide ? "42%" : "100%", minHeight: wide ? 0 : 380, paddingVertical: 26 }]}>
        <View style={[{ transform: [] }, hover && { transform: [{ scale: 1.03 }] }, web({ transition: "transform 700ms cubic-bezier(.2,.8,.2,1)" })]}>
          <PhoneFrame width={tall ? 210 : 180}>
            <MediaFor media={w.media} active />
          </PhoneFrame>
        </View>
      </View>
    ) : (
      <View style={[{ alignItems: "center", justifyContent: "center", overflow: "hidden" }, { backgroundColor: t.bg, padding: bp === "phone" ? 16 : 22 }, wide ? { width: "56%", justifyContent: "center" } : null]}>
        <View style={[{ width: "100%" }, hover && { transform: [{ scale: 1.03 }] }, web({ transition: "transform 700ms cubic-bezier(.2,.8,.2,1)" }), softShadow(1.4)]}>
          <BrowserFrame aspect={w.media.aspect} label={w.media.kind === "gif" ? "Musikalista-Members-26-27 · Google Sheets" : "Dairy farm management system"}>
            <MediaFor media={w.media} active={ready || hover} />
          </BrowserFrame>
        </View>
      </View>
    );

  const text = (
    <View style={[{ padding: 26, gap: 2 }, wide && { flex: 1, justifyContent: "center" }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <View style={[{ borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }, { backgroundColor: t.bg }]}>
          <Text style={{ fontFamily: font.bold, fontSize: 12, color: t.fg }}>{w.index}</Text>
        </View>
        <Text style={{ fontFamily: font.semibold, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", color: c.muted, flexShrink: 1 }}>{w.category}</Text>
      </View>
      <Text style={[{ fontFamily: font.display, color: c.ink, letterSpacing: -0.6 }, { fontSize: bp === "phone" ? 27 : 31, lineHeight: bp === "phone" ? 32 : 36 }]}>{w.title}</Text>
      <Text style={{ fontFamily: font.medium, fontSize: 13.5, color: c.muted, marginTop: 6 }}>{w.client}</Text>
      <Text style={{ fontFamily: font.regular, fontSize: 15.5, lineHeight: 24, color: c.body, marginTop: 12 }} numberOfLines={tall ? undefined : 3}>
        {w.tagline}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
        <Tag label={w.role} tint={w.tint} />
        <View style={[{ borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9, backgroundColor: c.bg }, hover && { backgroundColor: c.ink }, web({ transition: "all 250ms ease" })]}>
          <Text style={[{ fontFamily: font.semibold, fontSize: 13.5, color: c.ink }, hover && { color: c.white }]}>View case  →</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Pressable
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={`${w.title}. Open case study`}
      {...({ onHoverIn: () => setHover(true), onHoverOut: () => setHover(false) } as object)}
      style={[
        { flex: 1, backgroundColor: c.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: c.line, overflow: "hidden" },
        { opacity: hidden ? 0 : 1 },
        wide && { flexDirection: w.media.kind === "video" ? "row-reverse" : "row", minHeight: 300 },
        hover && { transform: [{ translateY: -6 }], borderColor: c.lineStrong },
        softShadow(hover ? 1.8 : 1),
        web({ transition: "transform 450ms cubic-bezier(.2,.8,.2,1), box-shadow 450ms ease, border-color 300ms ease" }),
      ]}
    >
      {tall ? (
        <>
          {text}
          {media}
        </>
      ) : wide ? (
        <>
          {text}
          {media}
        </>
      ) : (
        <>
          {media}
          {text}
        </>
      )}
    </Pressable>
  );
}

/* ------------------------------------------------------------ case study */

function CaseStudy({ work: w, origin, onClosed }: { work: Work; origin: Rect; onClosed: () => void }) {
  const { width, height, bp } = useLayout();
  const c = useColors();
  const insets = useSafeAreaInsets();
  const reduce = useReduceMotion();
  const t = useRef(new Animated.Value(0)).current;
  const closing = useRef(false);
  const phone = bp === "phone";
  const [screen, setScreen] = useState(0);
  const tint = TINT[w.tint];

  const tw = Math.min(1120, width - 64);
  const target: Rect = phone ? { x: 0, y: 0, w: width, h: height } : { x: (width - tw) / 2, y: 28, w: tw, h: height - 56 };

  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: reduce ? 0 : 560, easing: Easing.bezier(0.2, 0.8, 0.2, 1), useNativeDriver: false }).start();
  }, [t, reduce]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    Animated.timing(t, { toValue: 0, duration: reduce ? 0 : 400, easing: Easing.bezier(0.4, 0, 0.2, 1), useNativeDriver: false }).start(() => onClosed());
  }, [t, reduce, onClosed]);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const lerp = (a: number, b: number) => t.interpolate({ inputRange: [0, 1], outputRange: [a, b] });
  const fade = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });
  const rise = t.interpolate({ inputRange: [0, 1], outputRange: [28, 0] });
  const desktop = bp === "desktop";

  const media =
    w.media.kind === "video" ? (
      <View style={[{ borderRadius: radius.lg, alignItems: "center", overflow: "hidden" }, { backgroundColor: tint.bg, paddingVertical: 36 }]}>
        <PhoneFrame width={phone ? 230 : 280}>
          <MediaFor media={w.media} active controls />
        </PhoneFrame>
        <Text style={{ fontFamily: font.medium, fontSize: 12.5, color: c.muted, marginTop: 14, textAlign: "center" }}>{w.media.label}</Text>
      </View>
    ) : (
      <View style={[{ borderRadius: radius.lg, alignItems: "center", overflow: "hidden" }, { backgroundColor: tint.bg, padding: phone ? 14 : 28 }]}>
        <View style={[{ width: "100%" }, softShadow(1.6)]}>
          <BrowserFrame aspect={w.media.aspect} label={w.media.kind === "screens" ? w.media.screens[screen].label : "Musikalista-Members-26-27 · Google Sheets"}>
            <MediaFor media={w.media} active screenIndex={screen} onScreenIndex={setScreen} />
          </BrowserFrame>
        </View>
        {w.media.kind === "screens" ? <Thumbs screens={w.media.screens} index={screen} onIndex={setScreen} /> : <Text style={{ fontFamily: font.medium, fontSize: 12.5, color: c.muted, marginTop: 14, textAlign: "center" }}>{w.media.label} · sample data</Text>}
      </View>
    );

  return (
    <Modal visible transparent animationType="none" onRequestClose={close} statusBarTranslucent>
      <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }, { backgroundColor: "rgba(246,242,234,0.78)", opacity: t }, web({ backdropFilter: "blur(10px)" })]}>
        <Pressable style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} onPress={close} accessibilityLabel="Close case study" />
      </Animated.View>
      <Animated.View
        accessibilityViewIsModal
        style={[
          { position: "absolute", overflow: "hidden", backgroundColor: c.surface, borderWidth: 1, borderColor: c.line },
          softShadow(2.2),
          { left: lerp(origin.x, target.x), top: lerp(origin.y, target.y), width: lerp(origin.w, target.w), height: lerp(origin.h, target.h), borderRadius: lerp(radius.xl, phone ? 0 : radius.xl) },
        ]}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 56 }} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fade, transform: [{ translateY: rise }], paddingHorizontal: phone ? 20 : 44, paddingTop: phone ? insets.top + 76 : 44 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <View style={[{ borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }, { backgroundColor: tint.bg }]}>
                <Text style={{ fontFamily: font.bold, fontSize: 12, color: tint.fg }}>{w.index}</Text>
              </View>
              <Text style={{ fontFamily: font.semibold, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", color: c.muted, flexShrink: 1 }}>
                {w.category} · {w.year}
              </Text>
            </View>
            <Text style={[{ fontFamily: font.display, color: c.ink, letterSpacing: -1.2 }, { fontSize: phone ? 36 : 54, lineHeight: phone ? 40 : 58 }]}>{w.title}</Text>
            <Text style={{ fontFamily: font.medium, fontSize: 13.5, color: c.muted, marginTop: 6 }}>{w.client}</Text>
            <Text style={[{ fontFamily: font.regular, color: c.body, marginTop: 14, maxWidth: 760 }, { fontSize: phone ? 17 : 20, lineHeight: phone ? 27 : 31 }]}>{w.tagline}</Text>

            <View style={[{ marginTop: 32, gap: 28 }, desktop && w.media.kind === "video" && { flexDirection: "row", alignItems: "flex-start" }]}>
              <View style={desktop && w.media.kind === "video" ? { width: "42%" } : undefined}>{media}</View>

              <View style={desktop && w.media.kind === "video" ? { flex: 1 } : undefined}>
                <View style={[{ borderRadius: radius.lg, padding: 24 }, { backgroundColor: tint.bg }]}>
                  <Text style={{ fontFamily: font.bold, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", color: tint.fg }}>My role · {w.role}</Text>
                  <Text style={{ fontFamily: font.displayItalic, fontSize: 21, lineHeight: 31, color: c.ink, marginTop: 10 }}>{w.myRole}</Text>
                  <Text style={{ fontFamily: font.semibold, fontSize: 13, marginTop: 14, color: tint.fg }}>{w.credit ?? w.team}</Text>
                </View>

                <Text style={{ fontFamily: font.bold, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", color: c.muted, marginTop: 30, marginBottom: 16 }}>What I did</Text>
                <View style={{ gap: 14 }}>
                  {w.did.map((d, i) => (
                    <View key={d} style={{ flexDirection: "row", gap: 14 }}>
                      <View style={{ width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, alignItems: "center", justifyContent: "center", borderColor: tint.fg }}>
                        <Text style={{ fontFamily: font.bold, fontSize: 12, color: tint.fg }}>{i + 1}</Text>
                      </View>
                      <Text style={{ flex: 1, fontFamily: font.regular, fontSize: 15.5, lineHeight: 25, color: c.body }}>{d}</Text>
                    </View>
                  ))}
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 30 }}>
                  {w.metrics.map((m) => (
                    <View key={m.label} style={{ flexGrow: 1, flexBasis: "40%", backgroundColor: c.bg, borderRadius: radius.md, padding: 18 }}>
                      <Text style={[{ fontFamily: font.display, color: c.ink, letterSpacing: -0.5 }, { fontSize: phone ? 24 : 28 }]}>{m.value}</Text>
                      <Text style={{ fontFamily: font.medium, fontSize: 12.5, color: c.muted, marginTop: 4 }}>{m.label}</Text>
                    </View>
                  ))}
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 24 }}>
                  {w.tags.map((tg) => (
                    <Tag key={tg} label={tg} />
                  ))}
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        <Pressable
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={10}
          style={(s) => [{ position: "absolute", right: 20, width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: c.bg, borderWidth: 1, borderColor: c.line }, { top: phone ? insets.top + 16 : 20 }, (s as InteractionState).hovered && { backgroundColor: c.ink }, web({ transition: "all 200ms ease" })]}
        >
          {(s) => <Text style={{ color: (s as InteractionState).hovered ? c.white : c.ink, fontSize: 17 }}>✕</Text>}
        </Pressable>
      </Animated.View>
    </Modal>
  );
}
