export function MiaLogo() {
  return (
    <a className="brand" href="/" aria-label="Miaz.fun home">
      <span className="brand-name">Mia</span>
      <span className="brand-domain">miaz.fun</span>
    </a>
  );
}

export function InnerHeader() {
  return (
    <header className="site-header inner-header">
      <MiaLogo />
      <nav className="inner-nav" aria-label="Main navigation">
        <a href="/games">Games</a>
        <a href="/comics">Comics</a>
        <a href="/lab">Mia&apos;s Lab</a>
        <a href="/#about">About</a>
      </nav>
    </header>
  );
}

export function InnerFooter() {
  return (
    <footer className="inner-footer">
      <MiaLogo />
      <p>Made by Mia + a little help from AI ✨</p>
    </footer>
  );
}
