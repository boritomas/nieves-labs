import Link from 'next/link';
import AtlasNav from './AtlasNav';
import { BrandLogo } from './BrandLogo';
import AtlasSignOutButton from './AtlasSignOutButton';

export function AtlasHeader({ token }: { token: string }) {
  const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : '';
  return (
    <header className="topbar">
      <Link href="/" className="brand" aria-label="Nieves Labs home"><BrandLogo size="sm" /></Link>
      <nav className="nav-links">
        <Link href="/">Home</Link>
        <Link href={`/admin${tokenQuery}`}>Admin</Link>
        <Link href={`/atlas${tokenQuery}`}>Atlas</Link>
        {!token ? <AtlasSignOutButton /> : null}
      </nav>
    </header>
  );
}

export function AtlasHero({ token, title, subtitle }: { token: string; title: string; subtitle: string }) {
  return (
    <section className="product-hero atlas-hero">
      <p className="eyebrow">Internal capital workspace</p>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <AtlasNav token={token} />
    </section>
  );
}
