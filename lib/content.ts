export type Project = {
  slug: string;
  title: string;
  type: "Game" | "Comic" | "Experiment";
  description: string;
  art: "stars" | "snake" | "racer" | "comic";
  href?: string;
  status: "published" | "coming-soon";
};

export const projects: Project[] = [
  {
    slug: "star-garden",
    title: "Star Garden",
    type: "Game",
    description: "Catch the stars, discover magical power-ups, and dodge the raindrops.",
    art: "stars",
    href: "/games/star-garden/index.html",
    status: "published",
  },
  {
    slug: "snake-fruit",
    title: "Snake & Fruit",
    type: "Game",
    description: "Guide the little snake, collect fruit, and try for a new high score.",
    art: "snake",
    href: "/games/snake/index.html",
    status: "published",
  },
  {
    slug: "neon-rush",
    title: "Neon Rush",
    type: "Game",
    description: "Switch lanes, dodge the traffic, and collect coins in a neon night race.",
    art: "racer",
    href: "/games/neon-rush/index.html",
    status: "published",
  },
  {
    slug: "mias-comics",
    title: "Mia's Comics",
    type: "Comic",
    description: "New stories and silly ideas are being drawn now.",
    art: "comic",
    status: "coming-soon",
  },
];

export const games = projects.filter((project) => project.type === "Game");
