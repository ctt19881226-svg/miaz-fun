"use client";

import Image from "next/image";
import { ArrowDown, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { projects } from "@/lib/content";

const reactions = ["Hi! 👋", "Yay! ✨", "Let's play!", "Good job! 👍"];
const categories = [
  { id: "games", title: "Mia's Games", copy: "Games made by Mia + AI", image: "/cards/games.png", tone: "blue" },
  { id: "comics", title: "Mia's Comics", copy: "Stories, comics & silly ideas", image: "/cards/comics.png", tone: "pink" },
  { id: "lab", title: "Mia's Lab", copy: "Little experiments with AI", image: "/cards/lab.png", tone: "yellow" },
] as const;
function MiaLogo() {
  return <a className="brand" href="#top" aria-label="Miaz.fun home"><span className="brand-name">Mia</span><span className="brand-domain">miaz.fun</span></a>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reactionIndex, setReactionIndex] = useState(-1);
  return (
    <main id="top">
      <header className="site-header">
        <MiaLogo />
        <button className="menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">
          {[["Games", "games"], ["Comics", "comics"], ["Mia's Lab", "lab"], ["About", "about"]].map(([label, id]) => <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>{label}</a>)}
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
          <span className="paper-tape tape-one" aria-hidden="true" /><span className="mini-doodle doodle-one" aria-hidden="true">♡</span><span className="mini-doodle doodle-two" aria-hidden="true">✦</span>
          <p className="section-kicker">pick a door</p><h2 id="things-title">Things I Made <span>✦</span></h2>
          <div className="category-grid">
            {categories.map(({ id, title, copy, image, tone }) => (
              <a className={`category-card ${tone}`} href={`#${id}`} id={id} key={id}>
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
          <span className="mini-doodle featured-star" aria-hidden="true">✷</span><p className="section-kicker">fresh from Mia&apos;s desk</p><h2 id="featured-title">Featured Creations <span>✦</span></h2>
          <div className="project-grid">
            {projects.map((project, index) => (
              <article className="project-card" key={project.title}>
                {index === 0 && <span className="good-sticker" aria-hidden="true">GOOD!</span>}
                <div className={`project-art ${project.art}`} aria-hidden="true">
                  {project.art === "stars" && <><span>★</span><span>✦</span><span>★</span></>}
                  {project.art === "snake" && <><span className="snake">●●●●●</span><span className="fruit">🍎</span></>}
                  {project.art === "comic" && <><span className="comic-panel">MIA</span><span className="comic-panel">♡</span></>}
                </div>
                <div className="project-body"><span className="project-type">{project.type}</span><h3>{project.title}</h3><p>{project.description}</p>{project.href ? <a className="project-action" href={project.href} aria-label={`Play ${project.title}`}><ArrowRight aria-hidden="true" /></a> : <span className="coming-soon">Coming soon</span>}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-strip" id="about" aria-label="About Miaz.fun">
        <Image src="/mia/mia-banner.png" alt="Mia's colorful hand-drawn world" width={1024} height={1024} />
        <div><span className="about-spark" aria-hidden="true">✦</span><p className="section-kicker">a tiny creative playground</p><h2>Made with creativity,<br />color &amp; a little AI.</h2></div>
      </section>
      <footer><MiaLogo /><nav aria-label="Footer navigation"><a href="#games">Games</a><a href="#comics">Comics</a><a href="#lab">Mia&apos;s Lab</a><a href="#about">About</a></nav><p>Made by Mia + a little help from AI ✨</p></footer>
    </main>
  );
}
