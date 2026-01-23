import React from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Project } from "../constants/ProjectData";

const { width } = Dimensions.get("window");

export const ProjectCard = ({
  item,
  onPress,
  theme,
}: {
  item: Project;
  onPress: () => void;
  theme: any;
}) => (
  <TouchableOpacity
    activeOpacity={0.9}
    style={[styles.card, { backgroundColor: theme.card }]}
    onPress={onPress}
  >
    <Image source={item.img} style={styles.cardImg} />
    <View style={styles.cardInfo}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>
        {item.title}
      </Text>
      <Text
        style={{
          color: theme.tint,
          fontSize: 11,
          fontWeight: "800",
          marginTop: 12,
        }}
      >
        LEARN MORE →
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: width * 0.85,
    borderRadius: 35,
    marginRight: 15,
    overflow: "hidden",
  },
  cardImg: { width: "100%", height: 220 }, // Exact height from previous version
  cardInfo: { padding: 25 },
  cardTitle: { fontWeight: "bold", fontSize: 18 },
});
