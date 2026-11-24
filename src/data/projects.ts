import type { ImageSourcePropType } from "react-native";

export type Visual =
  | { kind: "image"; label: string; source: ImageSourcePropType; aspect: number; frame?: "browser" | "plain"; url?: string }
  | { kind: "helmet-chart"; label: string }
  | { kind: "tabula-chart"; label: string };

export interface Metric {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  index: string;
  title: string;
  tagline: string;
  category: string;
  year: string;
  team: string;
  role: string;
  summary: string;
  did: string[];
  metrics: Metric[];
  stack: string[];
  visuals: Visual[];
  demo?: boolean;
}

/** Helmet-detection trial T04, transcribed from the Colab training log (25 epochs). */
export const HELMET_T04 = {
  epochs: {
    train: [0.6527, 0.6604, 0.6864, 0.7218, 0.7192, 0.7265, 0.7465, 0.7482, 0.7512, 0.7627, 0.7712, 0.7703, 0.784, 0.7921, 0.8117, 0.8057, 0.8219, 0.821, 0.8172, 0.8223, 0.8249, 0.8266, 0.827, 0.8338, 0.8432],
    val: [0.6327, 0.6327, 0.7585, 0.7245, 0.7704, 0.7177, 0.6871, 0.682, 0.6633, 0.784, 0.7313, 0.7653, 0.699, 0.801, 0.7653, 0.8044, 0.8435, 0.818, 0.7789, 0.8401, 0.8129, 0.8027, 0.8265, 0.8197, 0.8299],
    auc: [0.8045, 0.7949, 0.7972, 0.7683, 0.8134, 0.7979, 0.8232, 0.8118, 0.7029, 0.827, 0.8181, 0.8447, 0.845, 0.8432, 0.8492, 0.8628, 0.8824, 0.8726, 0.8656, 0.8923, 0.8888, 0.8867, 0.8965, 0.8916, 0.9129],
  },
  testAccuracy: 0.789,
  testMacroF1: 0.754,
  noHelmetRecall: 0.767,
};

/** Tabula Rasa evaluation results (from the thesis defense slides). */
export const TABULA_RESULTS = { pre: 15.49, post: 18.84, maxScore: 25, n: 37, t: 5.83, dz: 0.96 };

export const PROJECTS: Project[] = [
  {
    id: "tabula-rasa",
    index: "01",
    title: "Tabula Rasa",
    tagline: "A game that teaches reinforcement learning by letting players train their own agents.",
    category: "Undergraduate thesis · ML & research",
    year: "2026",
    team: "Team of 3",
    role: "Co-author & developer",
    summary:
      "Players shape reward parameters, watch an agent learn through an on-device PPO trainer, and enter their agent in tournaments. We tested whether playing it improves understanding of core RL concepts.",
    did: [
      "Co-developed the Unity 6 game, built around a custom Proximal Policy Optimization (PPO) trainer written in C# that runs on the device without cloud services.",
      "Co-wrote the thesis manuscript, including the operational and theoretical framework diagrams.",
      "Helped design the evaluation: a one-group pretest–posttest study analyzed with a paired t-test, plus a 31-item user-acceptance questionnaire adapted from MEEGA+.",
    ],
    metrics: [
      { value: "+3.35", label: "mean score gain (15.49 → 18.84)" },
      { value: "61.9% → 75.4%", label: "pretest to posttest" },
      { value: "p < .001", label: "paired t(36) = 5.83" },
      { value: "0.96", label: "effect size dz (large)" },
    ],
    stack: ["Unity 6", "C#", "PPO", "Supabase", "iOS · macOS", "Paired t-test", "MEEGA+"],
    visuals: [
      { kind: "image", label: "Study website", source: require("../../assets/images/work/tabula-landing.jpg"), aspect: 2102 / 1270, frame: "browser", url: "tabularasa · reinforcement learning simulation" },
      { kind: "tabula-chart", label: "Learning results" },
    ],
  },
  {
    id: "registry",
    index: "02",
    title: "Musikalista Membership Registry",
    tagline: "The organization's member database, designed so bad data can't get in and any record can be found in seconds.",
    category: "Data management · Statistics Officer",
    year: "2026",
    team: "Solo",
    role: "Designer & maintainer",
    summary:
      "A structured Google Sheets database for the organization's members and bands. It holds every member's department, program, contact details and music roles, and supports rosters, event planning and band coordination.",
    did: [
      "Designed the 11-field member schema, adding dropdown validation for department and member role and custom formulas that reject invalid year levels and birthdates.",
      "Wrote a single dynamic LET + XMATCH + FILTER formula that powers a search sheet: pick any column, type a term, and matching records appear. Birthdate searches match by month for birthday greetings.",
      "Added an automatic member count, zebra banding through conditional formatting, and a separate band-roster sheet with band reps and lineups.",
      "Keep the records accurate and confidential. The demo on this site uses fictional members only.",
    ],
    metrics: [
      { value: "11", label: "fields per member record" },
      { value: "6", label: "searchable fields" },
      { value: "4", label: "validation rules" },
      { value: "1", label: "formula behind the search" },
    ],
    stack: ["Google Sheets", "Data validation", "LET · XMATCH · FILTER", "Conditional formatting"],
    visuals: [
      { kind: "image", label: "Member sheet", source: require("../../assets/images/work/registry-sheet.jpg"), aspect: 1600 / 841, frame: "browser", url: "Members 26-27 · demo data" },
      { kind: "image", label: "Insights", source: require("../../assets/images/work/registry-insights.jpg"), aspect: 1.6, frame: "browser", url: "Insights · demo data" },
    ],
    demo: true,
  },
  {
    id: "helmet",
    index: "03",
    title: "Helmet Compliance Detection",
    tagline: "A CNN that flags motorcycle riders without helmets, as decision support for traffic and campus security.",
    category: "Data Science 2 capstone · Computer vision",
    year: "2026",
    team: "Team of 7",
    role: "Model training & documentation",
    summary:
      "The model classifies a rider image as helmet or no-helmet and reports its confidence, so a human reviewer can act on the uncertain cases. The dataset combines public Kaggle images with photos the team took at campus gates and nearby roads.",
    did: [
      "Ran and logged training trials T03 and T04 in Google Colab, comparing classifier-head designs on a transfer-learning backbone.",
      "Tracked accuracy, AUC, precision, recall and macro-F1 for every epoch, and the no-helmet recall that matters most for safety.",
      "Documented each trial's settings (epochs, batch size, layers, optimizer) and interpreted the results for the team's paper.",
    ],
    metrics: [
      { value: "78.9%", label: "test accuracy (trial T04)" },
      { value: "0.754", label: "test macro-F1" },
      { value: "0.767", label: "no-helmet recall" },
      { value: "0.913", label: "final validation AUC" },
    ],
    stack: ["Python", "Keras", "Google Colab", "Transfer learning", "MobileNetV2 / ResNet", "Data augmentation"],
    visuals: [
      { kind: "helmet-chart", label: "Training curve" },
      { kind: "image", label: "Colab training log", source: require("../../assets/images/work/helmet-training-log.jpg"), aspect: 1600 / 838, frame: "browser", url: "Marc_T03_T04_helmet_cnn.ipynb" },
    ],
  },
];
