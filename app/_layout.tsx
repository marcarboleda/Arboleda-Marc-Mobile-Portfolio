import { Geist_400Regular } from "@expo-google-fonts/geist/400Regular";
import { Geist_500Medium } from "@expo-google-fonts/geist/500Medium";
import { Geist_600SemiBold } from "@expo-google-fonts/geist/600SemiBold";
import { Geist_700Bold } from "@expo-google-fonts/geist/700Bold";
import { GeistMono_400Regular } from "@expo-google-fonts/geist-mono/400Regular";
import { GeistMono_500Medium } from "@expo-google-fonts/geist-mono/500Medium";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { color } from "../src/theme";

if (Platform.OS !== "web") {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    GeistMono_400Regular,
    GeistMono_500Medium,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);

  // On web the page renders immediately and fonts swap in, so static HTML is never blank.
  if (!loaded && !error && Platform.OS !== "web") return null;

  return (
    <SafeAreaProvider style={{ backgroundColor: color.bg }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.bg } }} />
    </SafeAreaProvider>
  );
}
