import Image from "next/image";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { InnerFooter, InnerHeader } from "@/components/site-chrome";

export default function LabPage() {
  return (
    <main className="collection-page lab-page">
      <InnerHeader />
      <section className="collection-hero">
        <a className="back-link" href="/"><ArrowLeft aria-hidden="true" /> Back home</a>
        <div className="collection-heading"><div><p className="section-kicker">Try · Make · Discover</p><h1>Mia&apos;s Lab <span>✦</span></h1><p>A little shelf for Mia&apos;s AI experiments, curious questions and new inventions.</p></div><div className="hero-stamp yellow-stamp" aria-hidden="true"><FlaskConical /><span>WOW!</span></div></div>
      </section>
      <section className="empty-workshop lab-workshop">
        <Image src="/cards/lab.png" alt="A cheerful hand-drawn science lab" width={1536} height={1024} />
        <div><span className="paper-label">Experiment in progress</span><h2>Something curious is bubbling…</h2><p>The lab doors are open, but Mia&apos;s first experiment needs a little more time.</p><a className="secondary-button" href="/games">Explore Mia&apos;s games</a></div>
      </section>
      <InnerFooter />
    </main>
  );
}
