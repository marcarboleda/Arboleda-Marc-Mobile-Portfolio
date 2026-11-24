import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { c, font } from "../src/theme";

export default function NotFound() {
  return (
    <View style={styles.wrap}>
      <Stack.Screen options={{ title: "Not found" }} />
      <Text style={styles.code}>404</Text>
      <Text style={styles.title}>This page doesn&apos;t exist.</Text>
      <Link href="/" style={styles.link}>
        Back to the portfolio →
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: c.bg, alignItems: "center", justifyContent: "center", padding: 24 },
  code: { fontFamily: font.semibold, color: c.sage, letterSpacing: 3, marginBottom: 12 },
  title: { fontFamily: font.display, color: c.ink, fontSize: 40, textAlign: "center" },
  link: { fontFamily: font.medium, color: c.ink, marginTop: 24, textDecorationLine: "underline" },
});
