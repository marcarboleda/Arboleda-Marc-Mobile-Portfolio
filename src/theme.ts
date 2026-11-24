import { useEffect, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";

/** Soft, warm palette. Accents are taken from the Tabula Rasa study artwork. */
export const c = {
  bg: "#F6F2EA",
  bgDeep: "#EEE8DC",
  surface: "#FFFDF8",
  ink: "#1E2230",
  body: "#4A4F5C",
  muted: "#7B808C",
  line: "rgba(30,34,48,0.08)",
  lineStrong: "rgba(30,34,48,0.16)",
  sage: "#2F6B55",
  sageSoft: "#E1ECE4",
  clay: "#C9684A",
  claySoft: "#F5E0D6",
  butter: "#E9B949",
  butterSoft: "#FAF0D2",
  lilac: "#8F86C9",
  lilacSoft: "#E9E6F6",
  white: "#FFFFFF",
} as const;

export const font = {
  display: "Fraunces_500Medium",
  displayItalic: "Fraunces_400Regular_Italic",
  displaySemi: "Fraunces_600SemiBold",
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
} as const;

export const radius = { sm: 12, md: 18, lg: 26, xl: 34 } as const;
export const MAX_WIDTH = 1180;

export type Breakpoint = "phone" | "tablet" | "desktop";

/** False during static rendering and the first web render, so hydration matches the server HTML. */
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
  const gutter = bp === "phone" ? 20 : bp === "tablet" ? 36 : 56;
  const contentWidth = Math.min(width - gutter * 2, MAX_WIDTH);
  return { hydrated, width, height, bp, gutter, contentWidth, isPhone: bp === "phone", isDesktop: bp === "desktop" };
}

export type InteractionState = { pressed: boolean; hovered?: boolean; focused?: boolean };
export const isWeb = Platform.OS === "web";
/** Web-only CSS (transitions, blur, shadows). Ignored on native. */
export const web = (style: Record<string, unknown>) => (isWeb ? (style as object) : {});

/** Soft layered shadow used on cards. */
export const softShadow = (strength = 1) =>
  web({ boxShadow: `0 1px 2px rgba(30,34,48,${0.04 * strength}), 0 12px 32px -12px rgba(30,34,48,${0.16 * strength})` });
