import type { ImageSourcePropType } from "react-native";

export type Media =
  | { kind: "video"; source: number; poster: ImageSourcePropType; aspect: number; label: string }
  | { kind: "gif"; source: ImageSourcePropType; poster: ImageSourcePropType; aspect: number; label: string }
  | { kind: "screens"; screens: { label: string; source: ImageSourcePropType }[]; aspect: number };

export interface Work {
  id: string;
  index: string;
  title: string;
  client: string;
  category: string;
  year: string;
  role: string;
  team: string;
  tint: "sage" | "clay" | "lilac";
  tagline: string;
  myRole: string;
  did: string[];
  metrics: { value: string; label: string }[];
  tags: string[];
  media: Media;
  credit?: string;
}

export const WORK: Work[] = [
  {
    id: "tabula-rasa",
    index: "01",
    title: "Tabula Rasa",
    client: "Undergraduate thesis · De La Salle Lipa",
    category: "Game UI · Research data",
    year: "2026",
    role: "Design & data analysis",
    team: "Team of 3",
    tint: "sage",
    tagline: "A game that teaches reinforcement learning. Players shape the rewards, watch a creature learn to walk, then send it out to steal eggs.",
    myRole:
      "I focused on the design and on the research data: the look and feel of the game and its study materials, gathering data from participants, and analyzing the results.",
    did: [
      "Designed the interface and visual style so a technical topic feels playful and approachable.",
      "Handled data gathering for the evaluation: pretest, posttest and a 31-item user-acceptance questionnaire adapted from MEEGA+.",
      "Analyzed the results. Mean scores rose from 15.49 to 18.84 out of 25 (n = 37), a significant gain: paired t(36) = 5.83, p < .001, dz = 0.96.",
    ],
    metrics: [
      { value: "+3.35", label: "mean score gain" },
      { value: "61.9 → 75.4%", label: "pretest to posttest" },
      { value: "p < .001", label: "paired t-test" },
      { value: "0.96", label: "effect size (large)" },
    ],
    tags: ["UI design", "Visual design", "Data gathering", "Statistical analysis", "Unity"],
    media: {
      kind: "video",
      source: require("../../assets/media/tabula-story.mp4"),
      poster: require("../../assets/media/tabula-poster.jpg"),
      aspect: 9 / 16,
      label: "Study recruitment story",
    },
  },
  {
    id: "dairy-farm",
    index: "02",
    title: "Dairy Farm Management System",
    client: "D.H. Magpantay Dairy Farm · proposed system",
    category: "UI design · Dashboard",
    year: "2025",
    role: "UI designer",
    team: "With a developer friend",
    tint: "clay",
    tagline: "One place for a dairy farm to track its herd, calving, milk production, and animal and medicine stock.",
    myRole:
      "I designed the UI for the company's proposed inventory system. My friend handled all of the development; my part was the interface.",
    did: [
      "Designed five core screens: Dashboard, Animal Inventory, Medicine Inventory, Calving Records and Milk Production.",
      "Kept every screen on one system: forest-green navigation, a shared table style, and search, filter and add actions in the same place.",
      "Brought what staff must act on to the surface: reminders, expiry and low-stock alerts, upcoming calving and herd status.",
    ],
    metrics: [
      { value: "5", label: "core screens" },
      { value: "2", label: "modules: Records, Inventory" },
      { value: "2", label: "alert types: expiry, stock" },
    ],
    tags: ["UI design", "Dashboard design", "Design system", "Data tables"],
    credit: "Development by a friend. UI design by me.",
    media: {
      kind: "screens",
      aspect: 1440 / 1024,
      screens: [
        { label: "Dashboard", source: require("../../assets/media/inv-dashboard.jpg") },
        { label: "Animal Inventory", source: require("../../assets/media/inv-animal.jpg") },
        { label: "Medicine Inventory", source: require("../../assets/media/inv-medicine.jpg") },
        { label: "Calving Records", source: require("../../assets/media/inv-calving.jpg") },
        { label: "Milk Production", source: require("../../assets/media/inv-milk.jpg") },
      ],
    },
  },
  {
    id: "membership",
    index: "03",
    title: "Membership Database",
    client: "Musikalista · Statistics Officer",
    category: "Data visualization · Google Sheets",
    year: "2026",
    role: "Database designer",
    team: "Solo",
    tint: "lilac",
    tagline: "The org's member list, rebuilt so anyone can read the membership at a glance.",
    myRole:
      "I developed a more visual version of our membership database so officers can see the whole membership at a glance instead of scrolling through rows.",
    did: [
      "Added a dashboard with live charts for department, year level, music roles and genres.",
      "Kept entries clean with dropdowns and date checks on the member sheet.",
      "Built a search that finds members by any field, including birth month for birthday greetings.",
      "Shown with 50 fictional members. Real member data stays private.",
    ],
    metrics: [
      { value: "4", label: "live charts" },
      { value: "4", label: "sheets" },
      { value: "1", label: "formula behind search" },
    ],
    tags: ["Google Sheets", "Data visualization", "Data validation", "Dynamic formulas"],
    media: {
      kind: "gif",
      source: require("../../assets/media/membership-walkthrough.gif"),
      poster: require("../../assets/media/membership-poster.jpg"),
      aspect: 1456 / 835,
      label: "Walkthrough",
    },
  },
];
