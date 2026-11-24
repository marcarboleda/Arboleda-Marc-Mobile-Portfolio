import { useEffect, useRef, useState, type ReactNode } from "react";
import { AccessibilityInfo, Animated, Platform, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import { color, font, useLayout } from "../theme";
import { Mono, Rule } from "./ui";

type Props = {
  index: string;
  label: string;
  title?: string;
  lede?: string;
  visible: boolean;
  onLayout?: (e: LayoutChangeEvent) => void;
  children: ReactNode;
  nativeID?: string;
};

/** Numbered, ruled section that fades in once scrolled into view. */
export function Section({ index, label, title, lede, visible, onLayout, children, nativeID }: Props) {
  const { gutter, contentWidth, bp } = useLayout();
  const reveal = useReveal(visible);
  const wide = bp !== "phone";

  return (
    <View onLayout={onLayout} nativeID={nativeID} style={{ paddingHorizontal: gutter, alignItems: "center" }}>
      <Animated.View style={[{ width: contentWidth, paddingTop: wide ? 120 : 84 }, reveal]}>
        <Rule />
        <View style={[styles.head, wide && { flexDirection: "row", gap: 32 }]}>
          <View style={[styles.labelCol, wide && { width: contentWidth * 0.28 }]}>
            <Mono>
              <Text style={{ color: color.accent }}>{index}</Text>
              {"  /  "}
              {label}
            </Mono>
          </View>
          {title ? (
            <View style={{ flex: wide ? 1 : undefined }}>
              <Text style={[styles.title, { fontSize: bp === "desktop" ? 56 : bp === "tablet" ? 46 : 38, lineHeight: bp === "desktop" ? 60 : bp === "tablet" ? 50 : 42 }]}>
                {title}
              </Text>
              {lede ? <Text style={styles.lede}>{lede}</Text> : null}
            </View>
          ) : null}
        </View>
        {children}
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

export function useReveal(visible: boolean) {
  const reduce = useReduceMotion();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!visible) return;
    if (reduce) {
      v.setValue(1);
      return;
    }
    Animated.timing(v, { toValue: 1, duration: 700, useNativeDriver: Platform.OS !== "web" }).start();
  }, [visible, reduce, v]);
  return {
    opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.001, 1] }),
    transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
  };
}

const styles = StyleSheet.create({
  head: { paddingTop: 20, paddingBottom: 40, gap: 16 },
  labelCol: { paddingTop: 10 },
  title: { fontFamily: font.display, color: color.text, letterSpacing: -0.5 },
  lede: { fontFamily: font.sans, color: color.muted, fontSize: 16, lineHeight: 26, marginTop: 16, maxWidth: 620 },
});
