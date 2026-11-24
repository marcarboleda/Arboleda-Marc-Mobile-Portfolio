export const profile = {
  name: "Marc Bradley Arboleda",
  shortName: "Marc Arboleda",
  headline: "Computer Science student working where data, quality and software meet.",
  location: "Laguna, Philippines",
  email: "marcarboleda1220@gmail.com",
  github: "https://github.com/marcarboleda",
  githubLabel: "github.com/marcarboleda",
  linkedin: "https://www.linkedin.com/in/marcarboleda",
  linkedinLabel: "linkedin.com/in/marcarboleda",
  seeking: "Internships in Data Analytics, Quality Assurance and Data Management",
  intro: [
    "I'm a fourth-year BS Computer Science student at De La Salle Lipa. Most of my work comes down to making information trustworthy: validating data before it spreads, testing software before people depend on it, and turning results into numbers a team can act on.",
    "I designed and maintain my organization's membership database, helped build and evaluate a reinforcement-learning game for my thesis, and trained computer-vision models for my capstone.",
  ],
};


export const experience = [
  {
    role: "Statistics Officer",
    org: "Musikalista, De La Salle Lipa",
    period: "A.Y. 2026–2027",
    points: [
      "Designed the organization's membership registry in Google Sheets, with dropdown validation for departments and member roles, date and numeric checks, and an automatic member count.",
      "Built a search sheet with a single dynamic formula (LET, XMATCH, FILTER) that queries any field and supports birth-month lookups for event planning.",
      "Maintain the official band roster and keep member records accurate and confidential, sharing them only with consent.",
    ],
  },
  {
    role: "Logistics Officer",
    org: "Musikalista, De La Salle Lipa",
    period: "A.Y. 2025–2026",
    points: [
      "Organized inventories, documents and event records for organization activities.",
      "Coordinated with committees so that administrative and logistical tasks were completed on schedule.",
      "Kept documentation in order and tracked event requirements and resources.",
    ],
  },
];

export const education = [
  {
    school: "De La Salle Lipa",
    detail: "Bachelor of Science in Computer Science",
    period: "2023 – Present",
    place: "Lipa City, Batangas",
  },
  {
    school: "National University – Laguna",
    detail: "Senior High School, STEM Strand",
    period: "Graduated 2023",
    place: "Calamba City, Laguna",
  },
];

export const certifications = [
  { title: "PyTorch Bootcamp", issuer: "OpenCV University", date: "Oct 2026" },
  { title: "Intermediate R", issuer: "DataCamp", date: "Apr 2026" },
  { title: "Introduction to R", issuer: "DataCamp", date: "Mar 2026" },
  { title: "Elements of AI", issuer: "MinnaLearn & University of Helsinki", date: "Nov 2025", note: "Score: 89%" },
];

export const skillGroups = [
  {
    title: "Data",
    items: [
      "Excel & Google Sheets: LET, XMATCH, FILTER, lookups",
      "Data validation & conditional formatting",
      "Data cleaning & quality checks",
      "Python · Jupyter",
      "R (DataCamp, Intermediate)",
      "OCR extraction (Tesseract)",
    ],
  },
  {
    title: "Quality Assurance",
    items: [
      "Functional & usability testing",
      "User-acceptance testing (MEEGA+ instrument)",
      "Test-case writing & bug reporting",
      "Accessibility checks (color-vision modes)",
      "Unit tests for data logic",
    ],
  },
  {
    title: "Machine Learning",
    items: [
      "CNN transfer learning (MobileNetV2, ResNet)",
      "Data augmentation & experiment logging",
      "Reinforcement learning (PPO)",
      "PyTorch fundamentals",
    ],
  },
  {
    title: "Engineering",
    items: [
      "TypeScript · JavaScript · React",
      "React Native / Expo · Next.js",
      "C++ (OOP) · C# / Unity · Java",
      "Supabase · Git & GitHub",
      "UiPath RPA fundamentals",
    ],
  },
];
