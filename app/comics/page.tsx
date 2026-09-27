import Image from "next/image";
import { ArrowLeft, PencilLine } from "lucide-react";
import { InnerFooter, InnerHeader } from "@/components/site-chrome";

export default function ComicsPage() {
  return (
    <main className="collection-page comics-page">
      <InnerHeader />
      <section className="collection-hero">
        <a className="back-link" href="/"><ArrowLeft aria-hidden="true" /> Back home</a>
        <div className="collection-heading"><div><p className="section-kicker">Stories in progress</p><h1>Mia&apos;s Comics <span>♡</span></h1><p>This is where Mia&apos;s stories, characters and silly ideas will live.</p></div><div className="hero-stamp pink-stamp" aria-hidden="true"><PencilLine /><span>DRAW!</span></div></div>
      </section>
      <section className="empty-workshop">
        <Image src="/cards/comics.png" alt="A hand-drawn comic book with hearts and stars" width={1536} height={1024} />
        <div><span className="paper-label">Behind the scenes</span><h2>The first comic is being drawn!</h2><p>Mia is still working on the pictures and story. Come back soon to read it here.</p><a className="secondary-button" href="/games">Play a game while you wait</a></div>
      </section>
      <InnerFooter />
    </main>
  );
}
