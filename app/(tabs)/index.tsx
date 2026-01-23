import React, { useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Linking,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ProjectCard } from "../../components/ProjectCard";
import { SectionHeader } from "../../components/SectionHeader";
import { Colors } from "../../constants/Colors";
import { PROJECTS, Project } from "../../constants/ProjectData";

const { width, height } = Dimensions.get("window");
const LANDING_HEIGHT = height - (Platform.OS === "ios" ? 80 : 50);

export default function PortfolioScreen() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Floating Header */}
      <View style={styles.nav}>
        <Text style={[styles.brand, { color: theme.tint }]}>MB</Text>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          thumbColor={theme.tint}
          trackColor={{ false: "#D1D1D6", true: theme.tint + "60" }}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        snapToOffsets={[0, LANDING_HEIGHT]}
        snapToAlignment="start"
        snapToEnd={false}
        decelerationRate="normal"
      >
        {/* LANDING SECTION */}
        <View style={[styles.hero, { height: LANDING_HEIGHT }]}>
          <View style={styles.heroContent}>
            <Image
              source={require("../../assets/images/profile/9885547f-d3d4-4cae-bbf1-87e2397c8a0f.jpg")}
              style={[styles.mainImage, { borderColor: theme.tint + "30" }]}
            />
            <View style={styles.heroInfo}>
              <Text style={[styles.name, { color: theme.text }]}>
                Marc Bradley{"\n"}Arboleda
              </Text>
              <Text style={[styles.role, { color: theme.tint }]}>
                3rd Year Computer Science Student
              </Text>
            </View>
          </View>
          <View style={styles.scrollHint}>
            <Text
              style={{ color: theme.tint, fontSize: 18, fontWeight: "bold" }}
            >
              ↓
            </Text>
            <Text
              style={{
                color: theme.text,
                opacity: 0.4,
                fontSize: 9,
                letterSpacing: 2,
                marginTop: 4,
              }}
            >
              SCROLL
            </Text>
          </View>
        </View>

        {/* CONTENT BODY */}
        <View style={styles.contentBody}>
          {/* ABOUT ME */}
          <View style={styles.section}>
            <SectionHeader title="About Me" theme={theme} />
            <View style={[styles.aboutCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.aboutText, { color: theme.text }]}>
                I am a student at{" "}
                <Text style={{ fontWeight: "700" }}>De La Salle Lipa</Text>{" "}
                currently exploring the intersection of design and software
                logic.
              </Text>
              <Text
                style={[styles.aboutText, { color: theme.text, marginTop: 15 }]}
              >
                I am an{" "}
                <Text style={{ color: theme.tint, fontWeight: "700" }}>
                  aspiring
                </Text>{" "}
                specialist in Web Dev, AI, and QA Engineering, dedicated to
                building software that is both highly functional and
                user-centric.
              </Text>
            </View>
          </View>

          {/* SKILLS */}
          <View style={styles.section}>
            <SectionHeader title="Skills" theme={theme} />
            <View style={styles.skillContainer}>
              {["Excel", "UI/UX Design", "QA Testing", "C++", "Java"].map(
                (skill) => (
                  <View
                    key={skill}
                    style={[
                      styles.skillTag,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.tint + "20",
                      },
                    ]}
                  >
                    <Text style={[styles.skillText, { color: theme.text }]}>
                      {skill}
                    </Text>
                  </View>
                ),
              )}
            </View>
          </View>

          {/* PROJECTS */}
          <View style={styles.section}>
            <SectionHeader title="Projects" theme={theme} />
            <FlatList
              data={PROJECTS}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={width * 0.85 + 15}
              decelerationRate="fast"
              contentContainerStyle={{ paddingLeft: 25, paddingRight: 20 }}
              renderItem={({ item }) => (
                <ProjectCard
                  item={item}
                  theme={theme}
                  onPress={() => setActiveProject(item)}
                />
              )}
            />
          </View>

          {/* CONTACT */}
          <View style={styles.section}>
            <SectionHeader title="Contact" theme={theme} />
            <View style={[styles.contactList, { backgroundColor: theme.card }]}>
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() =>
                  Linking.openURL("mailto:arboledamarcbradley1220@gmail.com")
                }
              >
                <Text
                  style={[
                    styles.contactLabel,
                    { color: theme.text, opacity: 0.5 },
                  ]}
                >
                  Email
                </Text>
                <Text style={[styles.contactValue, { color: theme.text }]}>
                  arboledamarcbradley1220@gmail.com
                </Text>
              </TouchableOpacity>

              <View
                style={[styles.divider, { backgroundColor: theme.text + "10" }]}
              />

              <TouchableOpacity
                style={styles.contactItem}
                onPress={() =>
                  Linking.openURL("https://github.com/marcarboleda")
                }
              >
                <Text
                  style={[
                    styles.contactLabel,
                    { color: theme.text, opacity: 0.5 },
                  ]}
                >
                  GitHub
                </Text>
                <Text style={[styles.contactValue, { color: theme.text }]}>
                  github.com/marcarboleda
                </Text>
              </TouchableOpacity>

              <View
                style={[styles.divider, { backgroundColor: theme.text + "10" }]}
              />

              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => Linking.openURL("tel:09691380174")}
              >
                <Text
                  style={[
                    styles.contactLabel,
                    { color: theme.text, opacity: 0.5 },
                  ]}
                >
                  Phone
                </Text>
                <Text style={[styles.contactValue, { color: theme.text }]}>
                  +63 969 138 0174
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Space */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={!!activeProject} transparent animationType="slide">
        <View style={styles.overlay}>
          <View
            style={[
              styles.modal,
              { backgroundColor: theme.card, maxHeight: height * 0.75 },
            ]}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ marginBottom: 15 }}
            >
              <Text style={[styles.modalTitle, { color: theme.tint }]}>
                {activeProject?.title}
              </Text>
              <Text style={[styles.modalDesc, { color: theme.text }]}>
                {activeProject?.desc}
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: theme.tint }]}
              onPress={() => setActiveProject(null)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  nav: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    zIndex: 100,
    alignItems: "center",
  },
  brand: { fontWeight: "900", letterSpacing: 4, fontSize: 22 },
  hero: { justifyContent: "center", alignItems: "center", paddingTop: 40 },
  heroContent: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
  },
  mainImage: {
    width: width * 0.75,
    height: height * 0.38,
    borderRadius: 40,
    borderWidth: 1.5,
    marginBottom: 25,
  },
  heroInfo: { alignItems: "center" },
  name: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 36,
    letterSpacing: -1,
    textAlign: "center",
  },
  role: { fontSize: 13, fontWeight: "600", marginTop: 10, opacity: 0.7 },
  scrollHint: { position: "absolute", bottom: 30, alignItems: "center" },
  contentBody: {
    paddingTop: 40, // Initial gap after landing
  },
  section: {
    marginTop: 100, // THE BIG GAP BETWEEN SECTIONS
  },
  aboutCard: { marginHorizontal: 25, padding: 30, borderRadius: 35 },
  aboutText: { fontSize: 16, lineHeight: 26, opacity: 0.8 },
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
  },
  skillTag: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
  },
  skillText: { fontSize: 14, fontWeight: "700" },
  contactList: { marginHorizontal: 25, borderRadius: 35, paddingVertical: 10 },
  contactItem: { padding: 25 },
  contactLabel: {
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  contactValue: { fontSize: 14, fontWeight: "600" },
  divider: { height: 1, marginHorizontal: 25 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    padding: 30,
  },
  modal: { padding: 35, borderRadius: 40 },
  modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  modalDesc: { lineHeight: 26, fontSize: 16, opacity: 0.8 },
  closeBtn: { padding: 18, borderRadius: 20, alignItems: "center" },
});
