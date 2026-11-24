import { useEffect, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";

export const color = {
  bg: "#060608",
  bgRaised: "#0C0C10",
  glass: "rgba(255,255,255,0.035)",
  glassHi: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.08)",
  borderHi: "rgba(255,255,255,0.16)",
  text: "#F5F5F4",
  muted: "#A3A3A8",
  faint: "#6B6B73",
  accent: "#C5F36B",
  accentInk: "#0B1203",
  teal: "#38E2C7",
  accentSoft: "rgba(197,243,107,0.12)",
  warn: "#F5B85B",
} as const;

export const font = {
  regular: "Geist_400Regular",
  medium: "Geist_500Medium",
  semibold: "Geist_600SemiBold",
  bold: "Geist_700Bold",
  mono: "GeistMono_400Regular",
  monoMedium: "GeistMono_500Medium",
} as const;

export const MAX_WIDTH = 1200;
export const radius = { sm: 10, md: 16, lg: 24, xl: 32 } as const;

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
  const gutter = bp === "phone" ? 18 : bp === "tablet" ? 32 : 48;
  const contentWidth = Math.min(width, MAX_WIDTH + gutter * 2) - gutter * 2;
  return { hydrated, width, height, bp, gutter, contentWidth, isPhone: bp === "phone", isDesktop: bp === "desktop" };
}

/** Pressable state on web also carries `hovered` / `focused`. */
export type InteractionState = { pressed: boolean; hovered?: boolean; focused?: boolean };

export const isWeb = Platform.OS === "web";

/** Web-only CSS that React Native style types don't describe. Ignored on native. */
export const webOnly = (style: Record<string, unknown>) => (isWeb ? (style as object) : {});
