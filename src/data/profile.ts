export const profile = {
  name: "Marc Bradley Arboleda",
  shortName: "Marc Arboleda",
  headline: "CS student at De La Salle Lipa — UI/UX design, data analysis, and software development.",
  location: "Laguna, Philippines",
  email: "marcarboleda1220@gmail.com",
  github: "https://github.com/marcarboleda",
  githubLabel: "github.com/marcarboleda",
  linkedin: "https://www.linkedin.com/in/marcarboleda",
  linkedinLabel: "linkedin.com/in/marcarboleda",
  seeking: "Internships in UI design, data analytics, QA and data management",
  heroDesc:
    "I'm a fourth-year Computer Science student at De La Salle Lipa with an interest in UI/UX design, data analysis, and software development. I enjoy creating practical solutions, making information easier to understand, and building things that people can actually use.",
  intro: [
    "I'm a Computer Science student who enjoys working on projects that combine design, technology, and data. I like figuring out how things work, finding ways to improve them, and making systems easier for people to use.",
    "Through academic projects and my experience in student organizations, I've worked on application interfaces, data management, visualization, and software development. I'm always looking to learn new things and improve how I approach problems.",
  ],
};

export const experience = [
  {
    role: "Statistics Officer",
    org: "Musikalista, De La Salle Lipa",
    period: "2026 – 2027",
    summary:
      "Manage the organization's membership database, keeping member records organized and updated. I also handle data validation, band assignments, searching, and visual summaries to make membership information easier to access.",
  },
  {
    role: "Logistics Officer",
    org: "Musikalista, De La Salle Lipa",
    period: "2025 – 2026",
    summary:
      "Helped organize event inventories, documents, and records while coordinating logistics requirements with different committees.",
  },
];

export const education = [
  { school: "De La Salle Lipa", detail: "BS Computer Science", period: "2023 – Present" },
  { school: "National University – Laguna", detail: "Senior High School, STEM", period: "Graduated 2023" },
];

export const certifications = [
  { title: "PyTorch Bootcamp", issuer: "OpenCV University", date: "Oct 2026" },
  { title: "Intermediate R", issuer: "DataCamp", date: "Apr 2026" },
  { title: "Introduction to R", issuer: "DataCamp", date: "Mar 2026" },
  { title: "Elements of AI", issuer: "University of Helsinki", date: "Nov 2025" },
];

export const skillGroups = [
  {
    title: "Design",
    tint: "clay",
    items: ["UI Design", "Dashboard Layout", "Design Systems", "Visual Design", "Usability Testing"],
  },
  {
    title: "Data",
    tint: "sage",
    items: ["Google Sheets & Excel", "Data Validation", "Data Visualization", "Statistical Analysis", "Python", "R"],
  },
  {
    title: "Build",
    tint: "lilac",
    items: ["TypeScript", "React", "React Native / Expo", "C#", "Unity", "Supabase", "Git & GitHub"],
  },
] as const;
