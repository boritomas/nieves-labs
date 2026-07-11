import Link from 'next/link';
import type { CSSProperties } from 'react';
import { notFound, redirect } from 'next/navigation';
import { BrandLogo } from '@/components/BrandLogo';
import { ProductIcon, ProductIdentity } from '@/components/ProductIdentity';
import { productBrandByKey, type BrandProductKey } from '@/lib/brand';
import { getProductBySlug, products } from '@/lib/products';

export function generateStaticParams() {
  return [...products.map((product) => ({ slug: product.slug })), { slug: 'automix-pro' }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return {
    title: product ? `${product.title} | Nieves Labs` : 'Product | Nieves Labs',
    description: product?.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === 'automix-pro') {
    redirect('/products/mixpilot-ai');
  }

  const product = getProductBySlug(slug);
  if (!product) notFound();
  const externalCtas = product.externalApp?.ctas || [];
  const brand = productBrandByKey[product.key as BrandProductKey];

  return (
    <main
      className="site-shell"
      style={{
        '--product-accent': brand?.accent,
        '--product-soft': brand?.accentSoft,
      } as CSSProperties}
    >
      <header className="topbar">
        <Link href="/" className="brand"><BrandLogo size="sm" /></Link>
        <nav className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/#products">Products</Link>
          <Link href="/#services">Services</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>

      <section className="product-hero">
        <div className="product-hero-top">
          <ProductIcon productKey={product.key as BrandProductKey} />
          <p className="eyebrow">{brand?.category || product.idealCustomer}</p>
        </div>
        <h1>{product.title}</h1>
        <p>{product.tagline}</p>
        <ProductIdentity productKey={product.key as BrandProductKey} size="sm" />
        <div className="hero-actions">
          {externalCtas[0] ? (
            <a className="button-primary" href={externalCtas[0].url}>{externalCtas[0].label}</a>
          ) : (
            <Link className="button-primary" href="/contact">Join waitlist</Link>
          )}
          {externalCtas[1] ? (
            <a className="button-secondary" href={externalCtas[1].url}>{externalCtas[1].label}</a>
          ) : (
            <Link className="button-secondary" href="/contact">Ask about availability</Link>
          )}
        </div>
      </section>

      <section className="section two-column">
        <article className="panel"><h2>Problem</h2><p>{product.problem}</p></article>
        <article className="panel"><h2>Solution</h2><p>{product.solution}</p></article>
      </section>

      <section className="section">
        <div className="section-heading"><p className="eyebrow">Features</p><h2>What is included</h2></div>
        <div className="feature-grid">
          {product.features.map((feature) => <div className="feature-card" key={feature}>{feature}</div>)}
        </div>
      </section>

      <section className="section split-section">
        <div>
          <p className="eyebrow">How it works</p>
          <h2>{product.externalApp ? 'Open the verified product application to continue.' : 'Join the waitlist while the operational app is prepared.'}</h2>
          <p>{product.externalApp ? 'Commerce, customer data, intake, fulfillment, and delivery are handled by the dedicated operational application, not by the Nieves Labs portfolio site.' : 'This product is not accepting self-service purchases yet. Nieves Labs will announce availability once its independent customer journey is verified.'}</p>
        </div>
        <ol className="steps">
          <li>Review the product</li>
          <li>{product.externalApp ? 'Open the operational app' : 'Request access or join the waitlist'}</li>
          <li>{product.externalApp ? 'Complete the workflow in that app' : 'Wait for launch readiness'}</li>
          <li>{product.externalApp ? 'Receive updates from the product app' : 'No purchase is collected on this site'}</li>
        </ol>
      </section>

      <section className="section two-column" id="intake">
        <article className="panel">
          <h2>Required Files</h2>
          <ul>{product.requiredFiles.map((file) => <li key={file}>{file}</li>)}</ul>
        </article>
        <article className="panel">
          <h2>Deliverables</h2>
          <ul>{product.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}</ul>
        </article>
      </section>

      <section className="section" id="pricing">
        <div className="section-heading"><p className="eyebrow">{product.externalApp ? 'Operational app' : 'Availability'}</p><h2>{product.externalApp ? 'Continue in the product application' : 'Join the waitlist'}</h2></div>
        <div className="pricing-grid">
          {product.externalApp ? (
            <article className="pricing-card">
              <h3>{product.externalApp.label}</h3>
              <p>Verified routes: {product.externalApp.verifiedRoutes.join(', ')}</p>
              <strong>External app</strong>
              <span>Owns commerce, intake, fulfillment, delivery, and customer data.</span>
              <div className="card-actions">
                {externalCtas.map((cta) => (
                  <a key={cta.url} className={cta.kind === 'primary' ? 'button-primary' : 'button-secondary'} href={cta.url}>{cta.label}</a>
                ))}
              </div>
            </article>
          ) : product.packages.map((item) => (
            <article className="pricing-card" key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <strong>${item.price}</strong>
              <span>{item.turnaround}</span>
              <ul>{item.includes.map((include) => <li key={include}>{include}</li>)}</ul>
              <Link className="button-primary" href="/contact">Request access</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section two-column">
        <article className="panel">
          <h2>FAQ</h2>
          {product.faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </article>
        <article className="panel">
          <h2>Privacy and disclaimers</h2>
          <p>Your information is used to prepare the package you request. Avoid submitting unnecessary sensitive information.</p>
          <p>{product.disclaimer}</p>
          <p>Support: <Link href="/contact">Contact Nieves Labs</Link></p>
        </article>
      </section>
    </main>
  );
}
