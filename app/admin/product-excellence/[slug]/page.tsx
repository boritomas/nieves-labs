import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminAccessForm from '@/components/AdminAccessForm';
import ProductExcellenceReviewEditor from '@/components/ProductExcellenceReviewEditor';
import { env } from '@/lib/env';
import { getProductExcellenceReview, productExcellenceReviews } from '@/lib/product-excellence';

export const metadata = {
  title: 'Product Excellence Review | Nieves Labs Admin',
};

export function generateStaticParams() {
  return productExcellenceReviews.map((review) => ({ slug: review.slug }));
}

export default async function ProductExcellenceReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ slug }, { token = '' }] = await Promise.all([params, searchParams]);
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const review = getProductExcellenceReview(slug);

  if (!review) notFound();

  return (
    <main className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand"><span className="brand-mark">NL</span><span>Nieves Labs</span></Link>
        <nav className="nav-links">
          <Link href="/">Home</Link>
          <Link href={`/admin?token=${encodeURIComponent(token)}`}>Admin</Link>
          <Link href={`/admin/product-excellence?token=${encodeURIComponent(token)}`}>Product Excellence</Link>
        </nav>
      </header>
      {!authorized ? (
        <AdminAccessForm title="Product Excellence Review Access" />
      ) : (
        <>
          <section className="product-hero">
            <p className="eyebrow">{review.stage}</p>
            <h1>{review.product} Launch Review</h1>
            <p>{review.recommendation}</p>
            <div className="hero-actions">
              <a className="button-primary" href={review.productionDomain}>Production domain</a>
              <a className="button-secondary" href={review.fallbackUrl}>Fallback URL</a>
              <a className="button-secondary" href={`https://github.com/${review.repository}`}>Repository</a>
            </div>
          </section>
          <ProductExcellenceReviewEditor review={review} />
        </>
      )}
    </main>
  );
}
