import { StyleSheet, View } from "react-native";
import Svg, { Defs, Line, LinearGradient, RadialGradient, Rect, Stop } from "react-native-svg";
import { color, useLayout } from "../theme";

/** Soft glows and a fading grid behind the hero. Purely decorative. */
export function Backdrop() {
  const { width, bp } = useLayout();
  const h = bp === "phone" ? 900 : 1100;
  const step = bp === "phone" ? 48 : 64;
  const cols = Math.ceil(width / step) + 1;
  const rows = Math.ceil(h / step) + 1;

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { height: h, overflow: "hidden" }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width={width} height={h}>
        <Defs>
          <RadialGradient id="g1" cx="78%" cy="18%" r="45%">
            <Stop offset="0" stopColor={color.accent} stopOpacity={0.22} />
            <Stop offset="1" stopColor={color.accent} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="g2" cx="12%" cy="62%" r="40%">
            <Stop offset="0" stopColor={color.teal} stopOpacity={0.14} />
            <Stop offset="1" stopColor={color.teal} stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color.bg} stopOpacity={0} />
            <Stop offset="0.75" stopColor={color.bg} stopOpacity={0.6} />
            <Stop offset="1" stopColor={color.bg} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        {Array.from({ length: cols }, (_, i) => (
          <Line key={`v${i}`} x1={i * step} y1={0} x2={i * step} y2={h} stroke="#FFFFFF" strokeOpacity={0.045} strokeWidth={1} />
        ))}
        {Array.from({ length: rows }, (_, i) => (
          <Line key={`h${i}`} x1={0} y1={i * step} x2={width} y2={i * step} stroke="#FFFFFF" strokeOpacity={0.045} strokeWidth={1} />
        ))}
        <Rect x={0} y={0} width={width} height={h} fill="url(#g1)" />
        <Rect x={0} y={0} width={width} height={h} fill="url(#g2)" />
        <Rect x={0} y={0} width={width} height={h} fill="url(#fade)" />
      </Svg>
    </View>
  );
}
