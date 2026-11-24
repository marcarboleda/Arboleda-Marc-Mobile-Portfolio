import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from "react-native";
import type { Media } from "../data/work";
import { c, font, useHydrated, web, type InteractionState } from "../theme";
import { useReduceMotion } from "./motion";

/** Muted looping video. Shows the poster during static rendering and before playback starts. */
export function LoopVideo({ source, poster, controls = false, style }: { source: number; poster: ImageSourcePropType; controls?: boolean; style?: StyleProp<ViewStyle> }) {
  const hydrated = useHydrated();
  return (
    <View style={[styles.fill, style]}>
      <Image source={poster} style={COVER} resizeMode="cover" accessibilityLabel="Video poster" />
      {hydrated ? <VideoInner source={source} controls={controls} /> : null}
    </View>
  );
}

function VideoInner({ source, controls }: { source: number; controls: boolean }) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });
  return <VideoView player={player} style={COVER} contentFit="cover" nativeControls={controls} allowsFullscreen={controls} />;
}

/** Shows a still poster until `active`, then swaps in the (heavy) animated GIF. */
export function LazyGif({ source, poster, active, label }: { source: ImageSourcePropType; poster: ImageSourcePropType; active: boolean; label: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <View style={styles.fill}>
      <Image source={poster} style={COVER} resizeMode="cover" accessibilityLabel={label} />
      {active ? (
        <Image
          source={source}
          onLoad={() => setLoaded(true)}
          style={[COVER, { opacity: loaded ? 1 : 0 }, web({ transition: "opacity 400ms ease" })]}
          resizeMode="cover"
          accessibilityLabel={label}
        />
      ) : null}
    </View>
  );
}

/** Cross-fading slideshow of app screens. */
export function ScreenCarousel({
  screens,
  index,
  onIndex,
  auto = true,
  interval = 3200,
}: {
  screens: { label: string; source: ImageSourcePropType }[];
  index?: number;
  onIndex?: (i: number) => void;
  auto?: boolean;
  interval?: number;
}) {
  const reduce = useReduceMotion();
  const [inner, setInner] = useState(0);
  const i = index ?? inner;
  const setI = onIndex ?? setInner;
  const fades = useRef(screens.map((_, k) => new Animated.Value(k === 0 ? 1 : 0))).current;

  useEffect(() => {
    fades.forEach((f, k) => Animated.timing(f, { toValue: k === i ? 1 : 0, duration: reduce ? 0 : 700, useNativeDriver: false }).start());
  }, [i, fades, reduce]);

  useEffect(() => {
    if (!auto || reduce) return;
    const t = setInterval(() => setI((i + 1) % screens.length), interval);
    return () => clearInterval(t);
  }, [auto, reduce, i, interval, screens.length, setI]);

  return (
    <View style={styles.fill}>
      {screens.map((s, k) => (
        <Animated.View key={s.label} style={[StyleSheet.absoluteFillObject, { opacity: fades[k] }]} pointerEvents="none">
          <Image source={s.source} style={{ width: "100%", height: "100%" }} resizeMode="cover" accessibilityLabel={`${s.label} screen`} />
        </Animated.View>
      ))}
    </View>
  );
}

/** Minimal browser window chrome around a screenshot or recording. */
export function BrowserFrame({ children, label, aspect }: { children: ReactNode; label?: string; aspect: number }) {
  return (
    <View style={styles.browser}>
      <View style={styles.browserBar}>
        <View style={{ flexDirection: "row", gap: 6 }}>
          {["#E8A598", "#E9CB8A", "#A9CDB5"].map((col) => (
            <View key={col} style={[styles.dot, { backgroundColor: col }]} />
          ))}
        </View>
        {label ? (
          <View style={styles.url}>
            <Text style={styles.urlText} numberOfLines={1}>
              {label}
            </Text>
          </View>
        ) : null}
        <View style={{ width: 42 }} />
      </View>
      <View style={{ width: "100%", aspectRatio: aspect, backgroundColor: c.bgDeep }}>{children}</View>
    </View>
  );
}

/** Rounded phone frame for vertical video. */
export function PhoneFrame({ children, width }: { children: ReactNode; width: number }) {
  return (
    <View style={[styles.phone, { width, height: (width - 16) * (16 / 9) + 16 }]}>
      <View style={styles.phoneScreen}>{children}</View>
      <View style={styles.notch} />
    </View>
  );
}

export function MediaFor({ media, active, screenIndex, onScreenIndex, controls }: { media: Media; active: boolean; screenIndex?: number; onScreenIndex?: (i: number) => void; controls?: boolean }) {
  if (media.kind === "video") return <LoopVideo source={media.source} poster={media.poster} controls={controls} />;
  if (media.kind === "gif") return <LazyGif source={media.source} poster={media.poster} active={active} label={media.label} />;
  return <ScreenCarousel screens={media.screens} index={screenIndex} onIndex={onScreenIndex} />;
}

export function Thumbs({ screens, index, onIndex }: { screens: { label: string; source: ImageSourcePropType }[]; index: number; onIndex: (i: number) => void }) {
  return (
    <View style={styles.thumbs}>
      {screens.map((s, k) => {
        const on = k === index;
        return (
          <Pressable
            key={s.label}
            onPress={() => onIndex(k)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={s.label}
            style={(st) => [
              styles.thumb,
              { borderColor: on ? c.ink : "transparent", opacity: on ? 1 : (st as InteractionState).hovered ? 0.9 : 0.6 },
              web({ transition: "all 200ms ease" }),
            ]}
          >
            <View style={styles.thumbImg}>
              <Image source={s.source} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
            </View>
            <Text style={[styles.thumbLabel, on && { color: c.ink }]} numberOfLines={1}>
              {s.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const COVER = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" } as const;

const styles = StyleSheet.create({
  fill: { width: "100%", height: "100%", overflow: "hidden" },
  browser: { borderRadius: 16, overflow: "hidden", backgroundColor: c.surface, borderWidth: 1, borderColor: c.line },
  browserBar: { height: 34, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: c.line },
  dot: { width: 9, height: 9, borderRadius: 5 },
  url: { flex: 1, maxWidth: 320, height: 20, borderRadius: 6, backgroundColor: c.bg, justifyContent: "center", paddingHorizontal: 10 },
  urlText: { fontFamily: font.medium, fontSize: 10.5, color: c.muted, textAlign: "center" },
  phone: { borderRadius: 34, backgroundColor: c.ink, padding: 8, alignSelf: "center" },
  phoneScreen: { flex: 1, borderRadius: 27, overflow: "hidden", backgroundColor: c.bgDeep },
  notch: { position: "absolute", top: 14, alignSelf: "center", width: 70, height: 18, borderRadius: 9, backgroundColor: c.ink },
  thumbs: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 16 },
  thumb: { width: 118, borderWidth: 1.5, borderRadius: 11, padding: 3 },
  thumbImg: { width: 108, height: 77, borderRadius: 8, overflow: "hidden", backgroundColor: c.bgDeep },
  thumbLabel: { fontFamily: font.medium, fontSize: 11, color: c.muted, marginTop: 5, marginLeft: 3 },
});
