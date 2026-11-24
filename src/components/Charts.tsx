import { useState } from "react";
import { StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import Svg, { Circle, Defs, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from "react-native-svg";
import { HELMET_T04, TABULA_RESULTS } from "../data/projects";
import { color, font } from "../theme";

function useWidth(initial = 320) {
  const [w, setW] = useState(initial);
  const onLayout = (e: LayoutChangeEvent) => setW(Math.max(200, e.nativeEvent.layout.width));
  return { w, onLayout };
}

/** Training vs validation accuracy and validation AUC for helmet-detection trial T04 (values from the Colab training log). */
export function HelmetCurve({ height = 300, compact = false }: { height?: number; compact?: boolean }) {
  const { w, onLayout } = useWidth();
  const h = height;
  const pad = { l: 40, r: 16, t: 20, b: 34 };
  const { train, val, auc } = HELMET_T04.epochs;
  const n = train.length;
  const yMin = 0.6;
  const yMax = 0.95;
  const x = (i: number) => pad.l + (i / (n - 1)) * (w - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - yMin) / (yMax - yMin)) * (h - pad.t - pad.b);
  const path = (arr: number[]) => arr.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = (arr: number[]) => `${path(arr)} L${x(n - 1)},${h - pad.b} L${x(0)},${h - pad.b} Z`;

  return (
    <View onLayout={onLayout} style={styles.panel}>
      {compact ? null : (
        <View style={styles.legend}>
          <Legend c={color.accent} label="Validation accuracy" />
          <Legend c={color.teal} label="Validation AUC" />
          <Legend c={color.faint} label="Training accuracy" dashed />
        </View>
      )}
      <Svg width={w} height={h}>
        <Defs>
          <LinearGradient id="hc" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color.accent} stopOpacity={0.28} />
            <Stop offset="1" stopColor={color.accent} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        {[0.6, 0.7, 0.8, 0.9].map((t) => (
          <Line key={t} x1={pad.l} x2={w - pad.r} y1={y(t)} y2={y(t)} stroke="#FFFFFF" strokeOpacity={0.07} />
        ))}
        {[0.6, 0.7, 0.8, 0.9].map((t) => (
          <SvgText key={`l${t}`} x={pad.l - 8} y={y(t) + 4} fill={color.faint} fontSize={10} textAnchor="end" fontFamily={font.mono}>
            {t.toFixed(1)}
          </SvgText>
        ))}
        {[1, 5, 10, 15, 20, 25].map((e) => (
          <SvgText key={`e${e}`} x={x(e - 1)} y={h - 12} fill={color.faint} fontSize={10} textAnchor="middle" fontFamily={font.mono}>
            {e}
          </SvgText>
        ))}
        <Path d={area(val)} fill="url(#hc)" />
        <Path d={path(train)} stroke={color.faint} strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
        <Path d={path(auc)} stroke={color.teal} strokeWidth={2} fill="none" />
        <Path d={path(val)} stroke={color.accent} strokeWidth={2.5} fill="none" />
        <Circle cx={x(n - 1)} cy={y(val[n - 1])} r={4.5} fill={color.accent} />
        <Circle cx={x(n - 1)} cy={y(auc[n - 1])} r={4.5} fill={color.teal} />
      </Svg>
      {compact ? null : <Text style={styles.caption}>Epoch · Trial T04 (GAP + Dense-128 head), 25 epochs</Text>}
    </View>
  );
}

/** Pretest vs posttest mean score for the Tabula Rasa evaluation (n = 37). */
export function TabulaResultsChart({ height = 260, compact = false }: { height?: number; compact?: boolean }) {
  const { w, onLayout } = useWidth();
  const r = TABULA_RESULTS;
  const h = height;
  const barW = Math.min(120, (w - 80) / 3);
  const base = h - 40;
  const scale = (base - 30) / r.maxScore;
  const xs = [w * 0.3 - barW / 2, w * 0.7 - barW / 2];
  const vals = [r.pre, r.post];

  return (
    <View onLayout={onLayout} style={styles.panel}>
      <Svg width={w} height={h}>
        <Defs>
          <LinearGradient id="tb" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color.accent} stopOpacity={1} />
            <Stop offset="1" stopColor={color.accent} stopOpacity={0.35} />
          </LinearGradient>
        </Defs>
        <Line x1={20} x2={w - 20} y1={base} y2={base} stroke="#FFFFFF" strokeOpacity={0.12} />
        <Line x1={20} x2={w - 20} y1={base - r.maxScore * scale} y2={base - r.maxScore * scale} stroke="#FFFFFF" strokeOpacity={0.07} strokeDasharray="3 5" />
        <SvgText x={w - 22} y={base - r.maxScore * scale - 6} fill={color.faint} fontSize={10} textAnchor="end" fontFamily={font.mono}>
          max {r.maxScore}
        </SvgText>
        {vals.map((v, i) => (
          <Rect key={i} x={xs[i]} y={base - v * scale} width={barW} height={v * scale} rx={10} fill={i === 1 ? "url(#tb)" : "rgba(255,255,255,0.12)"} />
        ))}
        {vals.map((v, i) => (
          <SvgText key={`v${i}`} x={xs[i] + barW / 2} y={base - v * scale - 10} fill={i === 1 ? color.accent : color.text} fontSize={20} fontWeight="600" textAnchor="middle" fontFamily={font.semibold}>
            {v.toFixed(2)}
          </SvgText>
        ))}
        {["Pretest", "Posttest"].map((l, i) => (
          <SvgText key={l} x={xs[i] + barW / 2} y={base + 22} fill={color.muted} fontSize={12} textAnchor="middle" fontFamily={font.mono}>
            {l}
          </SvgText>
        ))}
      </Svg>
      {compact ? null : <Text style={styles.caption}>Mean score out of {r.maxScore}, one-group pretest–posttest, n = {r.n}</Text>}
    </View>
  );
}

function Legend({ c, label, dashed }: { c: string; label: string; dashed?: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <View style={{ width: 16, height: 0, borderTopWidth: 2, borderColor: c, borderStyle: dashed ? "dashed" : "solid" }} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { width: "100%" },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: 16, marginBottom: 10 },
  legendText: { fontFamily: font.mono, fontSize: 11, color: color.muted },
  caption: { fontFamily: font.mono, fontSize: 11, color: color.faint, marginTop: 6 },
});
