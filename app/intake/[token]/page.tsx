import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';

export default function IntakeDisabledPage() {
  return (
    <main className="site-shell compact">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Nieves Labs home"><BrandLogo size="sm" /></Link>
      </header>
      <section className="product-hero">
        <p className="eyebrow">Portfolio site</p>
        <h1>Product intake lives in the operational app.</h1>
        <p>Nieves Labs no longer collects product intake or uploads. Continue in the verified product application, or contact us for help finding the right product.</p>
        <div className="hero-actions">
          <a className="button-primary" href="https://www.answer-brief.com">Open AnswerBrief AI</a>
          <Link className="button-secondary" href="/contact">Contact Nieves Labs</Link>
        </div>
      </section>
    </main>
  );
}
