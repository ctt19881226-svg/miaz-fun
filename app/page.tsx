"use client";

import Image from "next/image";
import { ArrowDown, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { projects } from "@/lib/content";
import { MiaLogo } from "@/components/site-chrome";

const reactions = ["Hi! 👋", "Yay! ✨", "Let's play!", "Good job! 👍"];
const keyboardIsland = {
  title: "Keyboard Island",
  type: "Experiment",
  description: "Explore four playful keyboard games, collect stars, and climb the island leaderboard.",
  art: "keyboard",
  href: "/lab/keyboard-island/",
} as const;
const categories = [
  { href: "/games", title: "Mia's Games", copy: "Games made by Mia + AI", image: "/cards/games.png", tone: "blue" },
  { href: "/comics", title: "Mia's Comics", copy: "Stories, comics & silly ideas", image: "/cards/comics.png", tone: "pink" },
  { href: "/lab", title: "Mia's Lab", copy: "Little experiments with AI", image: "/cards/lab.png", tone: "yellow" },
] as const;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reactionIndex, setReactionIndex] = useState(-1);
  return (
    <main id="top">
      <header className="site-header">
        <MiaLogo />
        <button className="menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">
          <a href="/games" onClick={() => setMenuOpen(false)}>Games</a><a href="/comics" onClick={() => setMenuOpen(false)}>Comics</a><a href="/lab" onClick={() => setMenuOpen(false)}>Mia&apos;s Lab</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-doodle hero-doodle-one">✦</div><div className="hero-doodle hero-doodle-two">♥</div><span className="scribble-arrow hero-arrow" aria-hidden="true">↝</span>
        <div className="hero-copy">
          <p className="eyebrow">Hello, friend!</p>
          <h1 id="hero-title">Hi, I&apos;m <span>Mia!</span></h1>
          <p className="hero-lede">Welcome to my little<br />creative world.</p>
          <p className="hero-tags">Games <b>·</b> Comics <b>·</b> AI <b>·</b> Fun</p>
          <a className="primary-button" href="#things">Explore <ArrowDown aria-hidden="true" /></a>
        </div>
        <div className="hero-art">
          <span className="blue-paper" aria-hidden="true" />
          <button className="mia-button" type="button" onClick={() => setReactionIndex((reactionIndex + 1) % reactions.length)} aria-label="Say hello to Mia">
            <Image src="/mia/mia-hero.png" alt="Mia smiling in a colorful party hat" width={1024} height={1024} priority />
          </button>
          {reactionIndex >= 0 && <output className="speech-bubble" aria-live="polite">{reactions[reactionIndex]}</output>}
          <span className="hand-note">Small ideas<br />big happiness ♡</span>
        </div>
      </section>

      <section className="things-section" id="things" aria-labelledby="things-title">
        <div className="pink-rip" aria-hidden="true" />
        <div className="section-inner">
          <span className="mia-sticker-decor sticker-yay" aria-hidden="true" />
          <span className="paper-tape tape-one" aria-hidden="true" /><span className="mini-doodle doodle-one" aria-hidden="true">♡</span><span className="mini-doodle doodle-two" aria-hidden="true">✦</span>
          <p className="section-kicker">pick a door</p><h2 id="things-title">Things I Made <span>✦</span></h2>
          <div className="category-grid">
            {categories.map(({ href, title, copy, image, tone }) => (
              <a className={`category-card ${tone}`} href={href} key={href}>
                <span className="category-art"><Image src={image} alt="" width={1536} height={1024} /></span>
                <span className="category-text"><strong>{title}</strong><small>{copy}</small></span>
                <span className="circle-arrow"><ArrowRight aria-hidden="true" /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="featured" aria-labelledby="featured-title">
        <div className="section-inner">
          <span className="mia-sticker-decor sticker-good" aria-hidden="true" />
          <span className="mini-doodle featured-star" aria-hidden="true">✷</span><p className="section-kicker">fresh from Mia&apos;s desk</p><h2 id="featured-title">Featured Creations <span>✦</span></h2>
          <div className="project-grid">
            {[keyboardIsland, ...projects].map((project, index) => (
              <a className="project-card" href={project.href ?? "/comics"} key={project.title} aria-label={project.href ? `Open ${project.title}` : `Visit ${project.title}`}>
                {index === 0 && <span className="good-sticker" aria-hidden="true">GOOD!</span>}
                <div className={`project-art ${project.art}`} aria-hidden="true">
                  {project.art === "penguin" && <div className="penguin-cover homepage-penguin"><span className="penguin-sun" /><span className="penguin-hero">🐧</span><span className="penguin-ice">❄︎</span><span className="penguin-fish">🐟</span></div>}
                  {project.art === "stars" && <><span>★</span><span>✦</span><span>★</span></>}
                  {project.art === "snake" && <><span className="snake">●●●●●</span><span className="fruit">🍎</span></>}
                  {project.art === "comic" && <><span className="comic-panel">MIA</span><span className="comic-panel">♡</span></>}
                  {project.art === "keyboard" && <><span className="keyboard-island">🌴</span><span className="keyboard-keys"><b>F</b><b>J</b><b>★</b></span></>}
                </div>
                <div className="project-body"><span className="project-type">{project.type}</span><h3>{project.title}</h3><p>{project.description}</p>{project.href ? <span className="project-action" aria-hidden="true"><ArrowRight /></span> : <span className="coming-soon">Coming soon</span>}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="final-footer" id="about"><span className="mia-sticker-decor sticker-love" aria-hidden="true" /><MiaLogo /><nav aria-label="Footer navigation"><a href="/games">Games</a><a href="/comics">Comics</a><a href="/lab">Mia&apos;s Lab</a><a href="#top">About</a></nav><p>Made with creativity and a little help from AI ✨</p></footer>
    </main>
  );
}
