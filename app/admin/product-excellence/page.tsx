import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import AdminAccessForm from '@/components/AdminAccessForm';
import { env } from '@/lib/env';
import { productExcellenceReviews } from '@/lib/product-excellence';

export const metadata = {
  title: 'Product Excellence | Nieves Labs Admin',
};

export default async function ProductExcellencePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);

  return (
    <main className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Nieves Labs home"><BrandLogo size="sm" /></Link>
        <nav className="nav-links"><Link href="/">Home</Link><Link href={`/admin?token=${encodeURIComponent(token)}`}>Admin</Link></nav>
      </header>
      {!authorized ? (
        <AdminAccessForm title="Product Excellence Access" />
      ) : (
        <>
          <section className="product-hero">
            <p className="eyebrow">Internal framework</p>
            <h1>Product Excellence</h1>
            <p>Seeded launch reviews, scorecards, feedback, competitive research, launch criteria, and next actions.</p>
          </section>
          <section className="section">
            <div className="review-card-grid">
              {productExcellenceReviews.map((review) => (
                <article className="product-card review-card" key={review.slug}>
                  <div className="review-card-top">
                    <div>
                      <p className="eyebrow">{review.stage}</p>
                      <h2>{review.product}</h2>
                    </div>
                    <div className="score-orb small">
                      <strong>{review.score}</strong>
                      <span>/100</span>
                    </div>
                  </div>
                  <p>{review.positioning}</p>
                  <div className="status-list">
                    <span className="status-pill ready">{review.status}</span>
                    <span className="status-pill ready">Seeded review</span>
                  </div>
                  <div className="card-actions">
                    <Link className="button-primary" href={`/admin/product-excellence/${review.slug}?token=${encodeURIComponent(token)}`}>Open review</Link>
                    <a className="button-secondary" href={review.productionDomain}>Production domain</a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
