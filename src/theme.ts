import { useEffect, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";

/** The portfolio's original palette (iOS system colors), with a dark and a light mode. */
export const Colors = {
  light: {
    text: "#1A1A1A",
    background: "#F2F2F7",
    tint: "#5856D6",
    card: "#FFFFFF",
    border: "rgba(0,0,0,0.08)",
    overlay: "rgba(242,242,247,0.86)",
  },
  dark: {
    text: "#FFFFFF",
    background: "#000000",
    tint: "#AF52DE",
    card: "#1C1C1E",
    border: "rgba(255,255,255,0.08)",
    overlay: "rgba(0,0,0,0.85)",
  },
};

export type Theme = (typeof Colors)["dark"];

/**
 * Fixed dark palette for "screens" shown inside the project views
 * (the registry demo and the charts), so they read as app screenshots in either mode.
 */
export const color = {
  bg: "#0B0B0F",
  bgRaised: "#141418",
  glass: "rgba(255,255,255,0.035)",
  glassHi: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.08)",
  borderHi: "rgba(255,255,255,0.16)",
  text: "#F5F5F7",
  muted: "#A1A1AA",
  faint: "#6B6B73",
  accent: "#C084FC",
  accentInk: "#1A0A26",
  teal: "#5AC8FA",
  accentSoft: "rgba(192,132,252,0.14)",
  warn: "#FF9F0A",
} as const;

export const font = {
  regular: "Geist_400Regular",
  medium: "Geist_500Medium",
  semibold: "Geist_600SemiBold",
  bold: "Geist_700Bold",
  mono: "GeistMono_400Regular",
  monoMedium: "GeistMono_500Medium",
} as const;

export const MAX_WIDTH = 1120;

export type Breakpoint = "phone" | "tablet" | "desktop";

/**
 * False during static rendering and the first client render on web, so the
 * hydrated markup matches the server HTML. Always true on native.
 */
export function useHydrated() {
  const [ready, setReady] = useState(Platform.OS !== "web");
  useEffect(() => setReady(true), []);
  return ready;
}

const SSR_SIZE = { width: 390, height: 844 };

export function useLayout() {
  const win = useWindowDimensions();
  const hydrated = useHydrated();
  const { width, height } = hydrated && win.width > 0 ? win : SSR_SIZE;
  const bp: Breakpoint = width >= 1024 ? "desktop" : width >= 720 ? "tablet" : "phone";
  const gutter = bp === "phone" ? 25 : bp === "tablet" ? 40 : 56;
  const contentWidth = Math.min(width - gutter * 2, MAX_WIDTH);
  return { hydrated, width, height, bp, gutter, contentWidth, isPhone: bp === "phone", isDesktop: bp === "desktop" };
}

/** Pressable state on web also carries `hovered` / `focused`. */
export type InteractionState = { pressed: boolean; hovered?: boolean; focused?: boolean };

export const isWeb = Platform.OS === "web";

/** Web-only CSS that React Native style types don't describe. Ignored on native. */
export const webOnly = (style: Record<string, unknown>) => (isWeb ? (style as object) : {});
