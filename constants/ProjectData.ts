export interface Project {
  id: string;
  title: string;
  short: string;
  desc: string;
  img: any;
}

export const PROJECTS: Project[] = [
  {
    id: "4",
    title: "Achroma",
    short: "Psychological Horror",
    desc: "A student-led game development project where I focused on creating an immersive user experience. I was responsible for designing the atmospheric UI elements and conducting rigorous Quality Assurance testing to ensure the game mechanics felt responsive and maintained a high-tension horror environment throughout the gameplay.",
    img: require("../assets/images/projects/Achroma.png"),
  },
  {
    id: "1",
    title: "Forty31 Cafe POS",
    short: "Inventory & Sales",
    desc: "Developed to solve real-world efficiency issues for a local cafe. This system features an intuitive dashboard for daily sales tracking and real-time inventory alerts. My goal was to create a frictionless experience for baristas while providing deep data insights for the cafe's management team.",
    img: require("../assets/images/projects/Dashboard.png"),
  },
  {
    id: "2",
    title: "FareMate",
    short: "Commuter Tool",
    desc: "A specialized utility app built for the Batangas commuting community. It leverages GPS data to provide real-time fare estimates based on official LTFRB regulations. I worked on simplifying the navigation to ensure users can access fare information accurately in just a few taps.",
    img: require("../assets/images/projects/faremate.png"),
  },
  {
    id: "3",
    title: "Traffic Guardian",
    short: "AI Monitoring",
    desc: "A collaborative AI project aimed at improving urban road safety. I served as a UI/UX consultant and lead QA tester, focusing on how traffic enforcers interact with AI-generated violation alerts. I worked to reduce notification fatigue by refining the alert hierarchy and visual feedback systems.",
    img: require("../assets/images/projects/TrafficGuardian_CCTV.png"),
  },
];
