import { ArrowLeft, ArrowRight, FlaskConical } from "lucide-react";
import { InnerFooter, InnerHeader } from "@/components/site-chrome";

export default function LabPage() {
  return (
    <main className="collection-page lab-page">
      <InnerHeader />
      <section className="collection-hero">
        <a className="back-link" href="/"><ArrowLeft aria-hidden="true" /> Back home</a>
        <div className="collection-heading"><div><p className="section-kicker">Try · Make · Discover</p><h1>Mia&apos;s Lab <span>✦</span></h1><p>A little shelf for Mia&apos;s AI experiments, curious questions and new inventions.</p></div><div className="hero-stamp yellow-stamp" aria-hidden="true"><FlaskConical /><span>WOW!</span></div></div>
      </section>
      <section className="lab-feature" aria-label="Keyboard Island experiment">
        <a className="lab-game-art" href="/lab/keyboard-island/" aria-label="Play Keyboard Island">
          <span className="lab-sun" /><span className="lab-cloud">☁</span><span className="lab-palm">🌴</span><span className="lab-boat">⛵</span>
          <span className="lab-keys"><b>F</b><b>J</b><b>★</b></span>
        </a>
        <div className="lab-game-copy"><span className="paper-label">New experiment</span><h2>Keyboard Island</h2><p>Explore a sunny island of keyboard games, collect stars, and climb the leaderboard with your buddy.</p><ul><li>Four playful island games</li><li>Stars for every adventure</li><li>A friendly local leaderboard</li></ul><a className="primary-button" href="/lab/keyboard-island/">Start adventure <ArrowRight aria-hidden="true" /></a></div>
      </section>
      <InnerFooter />
    </main>
  );
}
