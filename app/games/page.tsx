import { ArrowLeft, ArrowRight, Gamepad2, Sparkles } from "lucide-react";
import { games } from "@/lib/content";
import { InnerFooter, InnerHeader } from "@/components/site-chrome";

export default function GamesPage() {
  return (
    <main className="collection-page games-page">
      <InnerHeader />
      <section className="collection-hero">
        <a className="back-link" href="/"><ArrowLeft aria-hidden="true" /> Back home</a>
        <div className="collection-heading">
          <div>
            <p className="section-kicker">Choose your adventure</p>
            <h1>Mia&apos;s Games <span>★</span></h1>
            <p>Pick a game, type your nickname, and see how high you can climb!</p>
          </div>
          <div className="hero-stamp blue-stamp" aria-hidden="true"><Gamepad2 /><span>PLAY!</span></div>
        </div>
      </section>

      <section className="collection-grid" aria-label="Games">
        {games.map((game, index) => (
          <article className={`creation-tile ${index % 2 ? "tilt-right" : "tilt-left"}`} key={game.slug}>
            <a className="creation-cover" href={game.href!} aria-label={`Play ${game.title}`}>
              {game.art === "stars" ? <div className="star-cover" aria-hidden="true"><span className="star-big">★</span><span className="star-small star-one">✦</span><span className="star-small star-two">★</span><span className="star-small star-three">✦</span><span className="star-trail">· · · · ·</span></div> : game.art === "racer" ? <div className="racer-cover" aria-hidden="true"><span className="racer-moon">◉</span><span className="racer-car">🏎️</span><span className="racer-road">╱ ╲</span><span className="racer-glow">NEON</span></div> : <div className="snake-cover" aria-hidden="true"><span className="pixel-snake">●●●●●</span><span className="big-fruit">🍎</span><span className="dots">•••</span></div>}
              <span className="play-badge">Play now <ArrowRight aria-hidden="true" /></span>
            </a>
            <div className="creation-copy"><span>Game {String(index + 1).padStart(2, "0")}</span><h2>{game.title}</h2><p>{game.description}</p><a href={game.href!}>Start game <ArrowRight aria-hidden="true" /></a></div>
          </article>
        ))}
        <article className="creation-tile coming-tile">
          <div className="coming-art"><Sparkles aria-hidden="true" /><span>?</span></div>
          <div className="creation-copy"><span>Next up</span><h2>A new game</h2><p>Mia is dreaming up the next tiny adventure.</p><strong>Coming soon</strong></div>
        </article>
      </section>
      <InnerFooter />
    </main>
  );
}
