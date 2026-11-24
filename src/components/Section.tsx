import { useEffect, useRef, useState, type ReactNode } from "react";
import { AccessibilityInfo, Animated, Easing, Platform, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import { color, font, useLayout } from "../theme";

type Props = {
  index: string;
  label: string;
  title?: string;
  lede?: string;
  visible: boolean;
  onLayout?: (e: LayoutChangeEvent) => void;
  children: ReactNode;
};

/** Section with an eyebrow, a large title and a fade-up reveal once scrolled into view. */
export function Section({ index, label, title, lede, visible, onLayout, children }: Props) {
  const { gutter, contentWidth, bp } = useLayout();
  const reveal = useReveal(visible);
  const size = bp === "desktop" ? 56 : bp === "tablet" ? 46 : 36;

  return (
    <View onLayout={onLayout} style={{ paddingHorizontal: gutter, alignItems: "center" }}>
      <Animated.View style={[{ width: contentWidth, paddingTop: bp === "phone" ? 96 : 140 }, reveal]}>
        <View style={styles.eyebrowRow}>
          <View style={styles.dot} />
          <Text style={styles.eyebrow}>
            {index} <Text style={{ color: color.faint }}>/</Text> {label}
          </Text>
        </View>
        {title ? <Text style={[styles.title, { fontSize: size, lineHeight: size * 1.08, letterSpacing: -size * 0.035 }]}>{title}</Text> : null}
        {lede ? <Text style={styles.lede}>{lede}</Text> : null}
        <View style={{ marginTop: bp === "phone" ? 36 : 52 }}>{children}</View>
      </Animated.View>
    </View>
  );
}

export function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduce)
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduce);
    return () => sub.remove();
  }, []);
  return reduce;
}

export function useReveal(visible: boolean, delay = 0) {
  const reduce = useReduceMotion();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!visible) return;
    if (reduce) {
      v.setValue(1);
      return;
    }
    Animated.timing(v, {
      toValue: 1,
      duration: 900,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [visible, reduce, v, delay]);
  return {
    opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.001, 1] }),
    transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [32, 0] }) }],
  };
}

const styles = StyleSheet.create({
  eyebrowRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: color.accent },
  eyebrow: { fontFamily: font.mono, fontSize: 12, letterSpacing: 1.4, color: color.muted, textTransform: "uppercase" },
  title: { fontFamily: font.semibold, color: color.text, maxWidth: 860 },
  lede: { fontFamily: font.regular, fontSize: 17, lineHeight: 28, color: color.muted, marginTop: 18, maxWidth: 640 },
});
