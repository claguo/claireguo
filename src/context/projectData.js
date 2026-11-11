const projectData = [
  // {
  //   id: 0,
  //   project: "mochi",
  //   path: "",
  //   title: "Mochi Health: Humanizing Telemedicine",
  //   categories: ["ui/ux design"],
  //   description:
  //     "Designing healthcare products for patients and doctors, rebranding the Mochi marketing website, and building Bento Design System. Coming soon!",
  //   alt: "Screenshot of joinmochi.com, which I designed.",
  //   category: "Product Design, UI/UX",
  //   team: "Mochi Design Team + me",
  //   duration: "Mar 2024 - Present",
  // },
  {
    id: 0,
    project: "mochi",
    path: "mochi-health",
    route: "/mochi-health",
    protected: true,
    title: "Mochi Health: Bento Design System",
    description:
      "Mochi Health's design system, which now supports a platform serving over 100,000 patients.",
    alt: "Preview of design system components",
    tags: ["2025", "Design systems", "shipped!"],
    team: "Stacia Seetoh + me",
    duration: "Dec 2024 - Mar 2025",
  },
  {
    id: 1,
    project: "blooms",
    title: "Blooms",
    tags: ["2024", "Web dev", "design research", "shipped!"],
    description:
      "An interactive web app that visualizes global data to highlight women's shared challenges and destigmatize abortion.",
    alt: "Screenshot of web app: a blue globe and statistics",
    path: "blooms",
    route: "/blooms",
    team: "Just me!",
    duration: "Oct 2024",
    tldr: "tldr",
  },
  {
    id: 2,
    project: "a11y",
    path: "a11y-buddy",
    route: "/archive/a11y-buddy",
    title: "A11y Buddy For VSCode",
    tags: ["2024", "Web dev", "product design", "shipped!"],
    description:
      "A VSCode extension pet care game designed to encourage web developers to proactively implement web accessibility.",
    alt: "A11y Buddy screenshot",
    team: "Anna Ohrt + me",
    duration: "Nov 2023 - May 2024",
  },

  {
    id: 3,
    project: "eto",
    title: "Eat the Ocean",
    tags: ["2023", "Product design"],
    description:
      "A bycatch seafood recipe app designed to reduce waste in the New England fishing industry through awareness and education.",
    alt: "Three screenshotted previews of Eat the Ocean app.",
    path: "eat-the-ocean",
    route: "/archive/eat-the-ocean",
    team: "Just me!",
    duration: "Feb - May 2023",
  },

  // archive-only projects: listed on /archive, not on the home or landing grids
  {
    id: 5,
    path: "astros",
    route: "/archive/astros",
    archiveOnly: true,
    title: "Internship: Astros",
    tags: ["2023", "UI/UX design", "web dev"],
    description:
      "Designing and building data analysis tools for the Houston Astros' scouts, analysts, performance scientists, and coaches.",
    team: "7 developers + me",
    duration: "Jun - Aug 2023",
  },
  {
    id: 6,
    path: "collab-risd",
    route: "/archive/collab-risd",
    archiveOnly: true,
    title: "Collab @ RISD",
    tags: ["2023", "Design strategy", "UX research", "graphic design"],
    description:
      "A campus-wide series of events and a digital archive to increase interdisciplinary collaboration at RISD and Brown University.",
    team: "Yi Kang Sun, Jimmy Zhong, Ke Xu, Jenny Du, + me",
    duration: "Feb - May 2023",
  },
  {
    id: 7,
    path: "p5js",
    route: "/archive/p5js",
    archiveOnly: true,
    title: "Experiments in p5.js",
    tags: ["2023", "Creative coding"],
    description:
      "My first time creative coding: meditative sketches playing with color, line, transparency, and mouse interactivity.",
    team: "Just me!",
    duration: "May 2023 (3 wks)",
  },
  {
    id: 8,
    path: "astrobunny",
    route: "/archive/astrobunny",
    archiveOnly: true,
    title: "AstroBunny",
    tags: ["2023", "Design strategy", "game dev"],
    description:
      'My research into the relationship between femininity, gender, and shame in video games. AstroBunny is a "feminine" endless shooter game I created in response to my research in order to test my theories with players.',
    team: "Just me!",
    duration: "Sep - Dec 2023",
  },
  {
    id: 9,
    path: "pair",
    route: "/archive/pair",
    archiveOnly: true,
    title: "Pair",
    tags: ["2023", "Design strategy", "graphic design"],
    description:
      "A pair of devices that aids people's medical adherence. Submitted to the Stanford Life Transition Design Challenge.",
    team: "Deelia Wang, Jasmine Lee, Riya Kesari, + me",
    duration: "Nov - Dec 2023",
  },
  {
    id: 10,
    path: "guo-sweets",
    route: "/archive/guo-sweets",
    archiveOnly: true,
    title: "Guo Sweets",
    tags: ["2022", "Graphic design", "illustration"],
    description:
      "Recipes for my favorite homemade desserts made by my mom compiled into a zine; a documentation of family memory and culture.",
    team: "Just me!",
    duration: "Dec 2022 - Jan 2023",
  },
];

export default projectData;
