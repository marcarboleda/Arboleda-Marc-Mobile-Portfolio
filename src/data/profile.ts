export const profile = {
  name: "Marc Bradley Arboleda",
  shortName: "Marc Arboleda",
  headline: "Computer Science student designing clear interfaces and making data easy to read.",
  location: "Laguna, Philippines",
  email: "marcarboleda1220@gmail.com",
  github: "https://github.com/marcarboleda",
  githubLabel: "github.com/marcarboleda",
  linkedin: "https://www.linkedin.com/in/marcarboleda",
  linkedinLabel: "linkedin.com/in/marcarboleda",
  seeking: "Internships in UI design, data analytics, QA and data management",
  intro: [
    "I'm a fourth-year BS Computer Science student at De La Salle Lipa. I care about the moment someone opens a screen or a spreadsheet and understands it right away.",
    "That shows up in two kinds of work: interfaces that stay calm and consistent, and data that is clean, checked and easy to read. My thesis, a farm management UI and my org's database all sit where those two meet.",
  ],
};

export const experience = [
  {
    role: "Statistics Officer",
    org: "Musikalista, De La Salle Lipa",
    period: "2026 – 2027",
    summary: "Designed and maintain the membership database: validation, search, band roster and the visual dashboard.",
  },
  {
    role: "Logistics Officer",
    org: "Musikalista, De La Salle Lipa",
    period: "2025 – 2026",
    summary: "Organized inventories, documents and event records, and coordinated logistics with committees.",
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
  { title: "Design", tint: "clay", items: ["UI design", "Dashboard layout", "Design systems", "Visual design", "Usability testing"] },
  { title: "Data", tint: "sage", items: ["Google Sheets & Excel", "Data validation", "Data visualization", "Statistical analysis", "Python", "R"] },
  { title: "Build", tint: "lilac", items: ["TypeScript & React", "React Native / Expo", "C# & Unity", "Supabase", "Git & GitHub"] },
] as const;
