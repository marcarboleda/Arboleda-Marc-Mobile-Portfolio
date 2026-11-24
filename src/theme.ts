import { useEffect, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";

export const color = {
  bg: "#0B0B0A",
  surface: "#121211",
  surfaceHi: "#181816",
  line: "#262624",
  lineHi: "#3A3A36",
  text: "#ECEAE3",
  muted: "#9A988F",
  faint: "#67655E",
  // Accent taken from the header green of the Musikalista sheet, lifted for dark backgrounds.
  accent: "#A3C96F",
  accentDim: "#3D4A2A",
  warn: "#D9A55B",
} as const;

export const font = {
  display: "InstrumentSerif_400Regular",
  displayItalic: "InstrumentSerif_400Regular_Italic",
  sans: "IBMPlexSans_400Regular",
  sansMedium: "IBMPlexSans_500Medium",
  sansSemi: "IBMPlexSans_600SemiBold",
  mono: "IBMPlexMono_400Regular",
  monoMedium: "IBMPlexMono_500Medium",
} as const;

export const MAX_WIDTH = 1160;

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

// Layout used for the static HTML before real window size is known.
const SSR_SIZE = { width: 390, height: 844 };

export function useLayout() {
  const win = useWindowDimensions();
  const hydrated = useHydrated();
  const { width, height } = hydrated && win.width > 0 ? win : SSR_SIZE;
  const bp: Breakpoint = width >= 1024 ? "desktop" : width >= 700 ? "tablet" : "phone";
  const gutter = bp === "phone" ? 20 : bp === "tablet" ? 36 : 56;
  const contentWidth = Math.min(width, MAX_WIDTH + gutter * 2) - gutter * 2;
  return { hydrated, width, height, bp, gutter, contentWidth, isPhone: bp === "phone", isDesktop: bp === "desktop" };
}

/** Pressable state on web also carries `hovered` / `focused`. */
export type InteractionState = { pressed: boolean; hovered?: boolean; focused?: boolean };

export const isWeb = Platform.OS === "web";
