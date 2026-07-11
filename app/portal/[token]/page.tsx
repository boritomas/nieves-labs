import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';

export default function PortalDisabledPage() {
  return (
    <main className="site-shell compact">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Nieves Labs home"><BrandLogo size="sm" /></Link>
      </header>
      <section className="product-hero">
        <p className="eyebrow">Portfolio site</p>
        <h1>Customer portals live in each product app.</h1>
        <p>Nieves Labs does not store operational product orders or deliverables. Use the customer portal in the product application where your order was placed.</p>
        <div className="hero-actions">
          <a className="button-primary" href="https://www.answer-brief.com">Open AnswerBrief AI</a>
          <Link className="button-secondary" href="/contact">Contact Nieves Labs</Link>
        </div>
      </section>
    </main>
  );
}
