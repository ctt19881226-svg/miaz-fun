export type Project = {
  title: string;
  type: "Game" | "Comic" | "Experiment";
  description: string;
  art: "stars" | "snake" | "comic";
  href?: string;
  status: "published" | "coming-soon";
};

export const projects: Project[] = [
  {
    title: "Star Garden",
    type: "Game",
    description: "Catch the stars, discover magical power-ups, and dodge the raindrops.",
    art: "stars",
    href: "/games/star-garden/index.html",
    status: "published",
  },
  {
    title: "Snake & Fruit",
    type: "Game",
    description: "Guide the little snake, collect fruit, and try for a new high score.",
    art: "snake",
    href: "/games/snake/index.html",
    status: "published",
  },
  {
    title: "Mia's Comics",
    type: "Comic",
    description: "New stories and silly ideas are being drawn now.",
    art: "comic",
    status: "coming-soon",
  },
];
