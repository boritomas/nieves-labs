import Link from 'next/link';
import AtlasNav from './AtlasNav';
import { BrandLogo } from './BrandLogo';

export function AtlasHeader({ token }: { token: string }) {
  return (
    <header className="topbar">
      <Link href="/" className="brand" aria-label="Nieves Labs home"><BrandLogo size="sm" /></Link>
      <nav className="nav-links">
        <Link href="/">Home</Link>
        <Link href={`/admin?token=${encodeURIComponent(token)}`}>Admin</Link>
        <Link href={`/atlas?token=${encodeURIComponent(token)}`}>Atlas</Link>
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
