import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AccessibilityInfo, Animated, Easing, Platform, View, type StyleProp, type ViewStyle } from "react-native";

const native = Platform.OS !== "web";

export function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce).catch(() => {});
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduce);
    return () => sub.remove();
  }, []);
  return reduce;
}

/** Bumped on scroll; every pending Reveal re-checks whether it is on screen. */
export const ScrollContext = createContext<{ tick: number; vh: number }>({ tick: 0, vh: 800 });

/**
 * Fades and lifts its children once they scroll into view.
 * Position is measured against the page so it works at any nesting depth.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 22,
  style,
  immediate,
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
  immediate?: boolean;
}) {
  const { tick, vh } = useContext(ScrollContext);
  const ref = useRef<View>(null);
  const [shown, setShown] = useState(false);
  const reduce = useReduceMotion();
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shown) return;
    if (immediate) return setShown(true);
    ref.current?.measureInWindow?.((_x, y, _w, h) => {
      if (h > 0 && y < vh * 0.9) setShown(true);
    });
  }, [tick, vh, shown, immediate]);

  useEffect(() => {
    if (!shown) return;
    if (reduce) return v.setValue(1);
    Animated.timing(v, { toValue: 1, duration: 850, delay, easing: Easing.bezier(0.16, 1, 0.3, 1), useNativeDriver: native }).start();
  }, [shown, reduce, v, delay]);

  return (
    <View
      ref={ref}
      collapsable={false}
      style={style}
    >
      <Animated.View
        style={{
          opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.001, 1] }),
          transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }],
        }}
      >
        {children}
      </Animated.View>
    </View>
  );
}

/** Gentle endless up-and-down drift for decorative elements. */
export function Float({ children, amount = 8, duration = 4200, delay = 0, style }: { children: ReactNode; amount?: number; duration?: number; delay?: number; style?: StyleProp<ViewStyle> }) {
  const reduce = useReduceMotion();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration, delay, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
        Animated.timing(v, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v, duration, delay, reduce]);
  return <Animated.View style={[style, { transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -amount] }) }] }]}>{children}</Animated.View>;
}
