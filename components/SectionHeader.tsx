import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const SectionHeader = ({
  title,
  theme,
}: {
  title: string;
  theme: any;
}) => (
  <View style={styles.headerRow}>
    <Text style={[styles.label, { color: theme.text }]}>{title}</Text>
    <View style={[styles.titleLine, { backgroundColor: theme.tint }]} />
  </View>
);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    marginBottom: 25,
  },
  label: { fontSize: 32, fontWeight: "800", letterSpacing: -0.5 },
  titleLine: { height: 5, width: 45, marginLeft: 15, borderRadius: 3 },
});
