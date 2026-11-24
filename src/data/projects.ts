import type { ImageSourcePropType } from "react-native";

export type Track = "Data" | "QA" | "ML / AI" | "Software" | "Games";

export const TRACKS: Track[] = ["Data", "QA", "ML / AI", "Software", "Games"];

export interface Project {
  id: string;
  title: string;
  year?: string;
  context: string;
  tracks: Track[];
  role: string;
  summary: string;
  points: string[];
  stack: string[];
  link?: { label: string; url: string };
  image?: ImageSourcePropType;
  /** Anchor to an in-page demo. */
  demo?: boolean;
}

const gh = (repo: string) => ({ label: "Repository", url: `https://github.com/marcarboleda/${repo}` });

export const FEATURED: Project[] = [
  {
    id: "registry",
    title: "Musikalista Membership Registry",
    year: "2026",
    context: "Student organization · Statistics Officer",
    tracks: ["Data"],
    role: "Designer & maintainer",
    summary:
      "A Google Sheets registry for the org's members and bands. Validation stops bad entries at the source, and a search sheet answers questions like \"who plays drums?\" or \"whose birthday is in March?\" without filtering by hand.",
    points: [
      "Dropdown validation for college department and member role; custom formulas reject non-numeric year levels and non-date birthdates.",
      "Search built on one LET + XMATCH + FILTER formula: choose any column, type a term, and matching rows appear. Birthdate searches match by month.",
      "Zebra banding through conditional formatting, a live COUNTA member total and a separate band-roster sheet with reps and lineups.",
    ],
    stack: ["Google Sheets", "Data validation", "LET / XMATCH / FILTER", "Conditional formatting"],
    demo: true,
  },
  {
    id: "helmet",
    title: "Helmet Compliance Detection",
    year: "2026",
    context: "Data Science 2 capstone · Team of 7",
    tracks: ["ML / AI", "Data"],
    role: "Co-developer",
    summary:
      "A convolutional neural network that classifies motorcycle riders as helmeted or not and reports a confidence score. It is meant as decision support for traffic offices and campus gate security, with a human making the final call.",
    points: [
      "Combined public Kaggle helmet datasets with photos the team took at campus entry points and nearby roads.",
      "Used transfer learning on MobileNetV2 and ResNet backbones, with augmentation to cover lighting and angle variation.",
      "Logged each training trial in a Jupyter notebook (epochs, batch size, layers, optimizer) and interpreted every run in the paper.",
    ],
    stack: ["Python", "Jupyter", "CNN", "Transfer learning", "Data augmentation"],
  },
  {
    id: "tabula-rasa",
    title: "Tabula Rasa",
    year: "2026",
    context: "Undergraduate thesis · Team of 3",
    tracks: ["ML / AI", "QA", "Games"],
    role: "Co-author & developer",
    summary:
      "A gamified simulation for teaching reinforcement learning. Players tune reward parameters, watch agents learn through an on-device PPO implementation, then enter them in tournaments.",
    points: [
      "Custom PPO trainer written in C# that runs on the device. It needs no cloud service, Python or ML-Agents.",
      "Supabase server functions with anonymous sign-in support multiplayer modes and a study website for the tests.",
      "Evaluated with a one-group pretest–posttest design (paired t-test) and a 31-item user-acceptance instrument adapted from MEEGA+.",
    ],
    stack: ["Unity 6", "C#", "PPO", "Supabase", "iOS / macOS", "MEEGA+"],
  },
  {
    id: "achroma",
    title: "Achroma",
    year: "2025",
    context: "Web Development finals · Team project",
    tracks: ["QA", "Games"],
    role: "UI & quality assurance",
    summary:
      "A first-person psychological horror game that runs in the browser. I designed the atmospheric interface and tested responsiveness and tension pacing across desktop and touch controls.",
    points: [
      "Real-time 3D in Next.js with React Three Fiber, plus dedicated mobile controls and a pointer-lock flow for desktop.",
      "Built-in color-vision modes (protanopia, deuteranopia, tritanopia) applied as a shader pass.",
      "Narrated radio sequences with subtitle overlays and debug overlays used during testing.",
    ],
    stack: ["Next.js", "React Three Fiber", "TypeScript", "GLSL"],
    link: gh("webdev-finals-achroma"),
    image: require("../../assets/images/work/achroma.jpg"),
  },
  {
    id: "traffic-guardian",
    title: "Traffic Guardian",
    context: "AI road-safety system · Collaborative project",
    tracks: ["QA", "ML / AI"],
    role: "UI/UX consultant & lead QA tester",
    summary:
      "A CCTV dashboard that flags traffic violations with AI so enforcers can review them. My work focused on how enforcers read and act on alerts.",
    points: [
      "Refined the alert hierarchy and visual feedback to reduce notification fatigue.",
      "Led testing of the violation-log and analytics views that summarize top violation types and daily averages.",
    ],
    stack: ["UI/UX", "QA testing", "Computer vision"],
    image: require("../../assets/images/work/traffic-guardian.jpg"),
  },
  {
    id: "forty31",
    title: "Forty31 Cafe POS",
    context: "Point-of-sale & inventory · Local cafe",
    tracks: ["Data", "Software"],
    role: "UI/UX designer",
    summary:
      "An internal point-of-sale system for a local cafe, with daily sales tracking and inventory alerts that give management a clear view of the business.",
    points: [
      "Order flow designed so baristas can take dine-in and take-out orders quickly.",
      "Sales and inventory views planned around the numbers the owners check every day.",
    ],
    stack: ["UI/UX", "Dashboard design"],
    image: require("../../assets/images/work/forty31.jpg"),
  },
];

export const ARCHIVE: Project[] = [
  {
    id: "ocr-quiz",
    title: "Slide-to-Quiz OCR Pipeline",
    year: "2026",
    context: "IT Ethics coursework",
    tracks: ["Data", "Software"],
    role: "Solo",
    summary:
      "Pulled text from lecture slides, including text inside images, through LibreOffice → pdftoppm → Tesseract, then turned it into an interactive multiple-choice reviewer.",
    points: [],
    stack: ["Tesseract OCR", "Python", "React"],
  },
  {
    id: "leads-dataset",
    title: "Buyer-Leads Dataset Preparation",
    year: "2026",
    context: "Data practice",
    tracks: ["Data"],
    role: "Solo",
    summary:
      "Iteratively shaped a ~600-row leads dataset so it is realistically messy but still plausible, with controlled null rates, sensible age ranges and weighted categorical values.",
    points: [],
    stack: ["Excel", "Python"],
  },
  {
    id: "trackiq",
    title: "TrackIQ",
    year: "2026",
    context: "Personal project",
    tracks: ["Software", "Data"],
    role: "Solo",
    summary:
      "An expense tracker with AI receipt scanning, budgets, spending analytics and multi-currency support (PHP by default).",
    points: [],
    stack: ["React Native", "Expo", "TypeScript", "Zustand", "MMKV"],
  },
  {
    id: "faremate",
    title: "FareMate",
    context: "Commuter utility",
    tracks: ["Software"],
    role: "UI & navigation",
    summary:
      "Fare estimates for Batangas commuters based on GPS and LTFRB fare rules, designed so fares can be checked in a few taps.",
    points: [],
    stack: ["Mobile", "GPS", "UI/UX"],
    image: require("../../assets/images/work/faremate.jpg"),
  },
  {
    id: "booth-games",
    title: "Musikalista Booth Games",
    year: "2026",
    context: "Org event booths",
    tracks: ["Games", "Software"],
    role: "Developer",
    summary:
      "Browser games for org booths: Match the Pitch (single-note and three-note sequence modes) with Supabase leaderboards, a memory-match game and a tiered scratch-card raffle.",
    points: [],
    stack: ["JavaScript", "Web Audio", "Supabase"],
    link: gh("MusikalistaV2"),
  },
  {
    id: "travel-diary",
    title: "Travel Diary",
    year: "2026",
    context: "Mobile development · Device features",
    tracks: ["Software"],
    role: "Solo",
    summary:
      "A travel journal that uses the camera, geolocation and notifications, with persistent local storage and a theme switcher.",
    points: [],
    stack: ["React Native", "Expo", "AsyncStorage"],
    link: gh("device-features-react-native"),
  },
  {
    id: "job-finder",
    title: "Job Finder",
    year: "2026",
    context: "Mobile development midterm",
    tracks: ["Software"],
    role: "Solo",
    summary: "Fetches job listings from an API, with saved jobs, detail views and an application form built on shared context state.",
    points: [],
    stack: ["React Native", "TypeScript", "Axios"],
    link: gh("midterm-project-react-native"),
  },
  {
    id: "shopping-app",
    title: "Shopping App",
    year: "2026",
    context: "Mobile development",
    tracks: ["Software"],
    role: "Solo",
    summary: "A storefront with product listing, cart and checkout, using file-based routing.",
    points: [],
    stack: ["Expo Router", "TypeScript"],
    link: gh("ShoppingApp"),
  },
  {
    id: "solitaire",
    title: "Block Ten Solitaire Solver",
    year: "2026",
    context: "Game programming assignment",
    tracks: ["Games"],
    role: "Solo",
    summary:
      "A Unity simulation that always wins. A memoized depth-first search finds the solution off the main thread before the moves are played back.",
    points: [],
    stack: ["Unity", "C#", "DFS + memoization"],
  },
  {
    id: "codelearn",
    title: "CodeLearn",
    year: "2026",
    context: "Education platform prototype",
    tracks: ["Software"],
    role: "Solo",
    summary:
      "A programming course platform in the style of CodeChum and Canvas, with a custom recursive Python interpreter and per-user chat.",
    points: [],
    stack: ["HTML", "CSS", "JavaScript"],
  },
  {
    id: "san-gubat",
    title: "San Gubat",
    year: "2025",
    context: "Web development midterm",
    tracks: ["Games", "Software"],
    role: "Developer",
    summary:
      "A branching story based on Philippine folklore, driven by a JSON story graph, with an inventory, typewriter text and scene music.",
    points: [],
    stack: ["React", "Vite", "JSON"],
    link: gh("midterm-project"),
  },
  {
    id: "pokemon",
    title: "Pokémon Team Builder",
    year: "2025",
    context: "Web development",
    tracks: ["Software"],
    role: "Solo",
    summary: "Browse the first 151 Pokémon from PokéAPI and build a team.",
    points: [],
    stack: ["React", "Vite", "REST API"],
    link: gh("pokemon-team-builder"),
  },
  {
    id: "airline",
    title: "Airline Booking System",
    year: "2024",
    context: "Object-oriented programming finals",
    tracks: ["Software"],
    role: "Team",
    summary: "A console system for flights, seats and bookings, with class inheritance (User → Customer) and an in-memory flight database.",
    points: [],
    stack: ["C++", "OOP"],
    link: gh("final-project-7-ooprog"),
  },
  {
    id: "inventory",
    title: "Inventory Management System",
    year: "2024",
    context: "Object-oriented programming midterm",
    tracks: ["Data", "Software"],
    role: "Solo",
    summary: "Category-validated inventory records with add, update and search, plus capacity checks and input validation, built on abstract base classes.",
    points: [],
    stack: ["C++", "Abstraction", "Encapsulation"],
    link: gh("midterm-project-oop"),
  },
];
