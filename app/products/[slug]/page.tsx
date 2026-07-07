import Link from 'next/link';
import { notFound } from 'next/navigation';
import CheckoutForm from '@/components/CheckoutForm';
import { getProductBySlug, products } from '@/lib/products';
import { env } from '@/lib/env';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
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
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand"><span className="brand-mark">NL</span><span>Nieves Labs</span></Link>
        <nav className="nav-links">
          <Link href="/#products">Products</Link>
          <Link href="#pricing">Pricing</Link>
          <a href={`mailto:${env.supportEmail}`}>Support</a>
        </nav>
      </header>

      <section className="product-hero">
        <p className="eyebrow">{product.idealCustomer}</p>
        <h1>{product.title}</h1>
        <p>{product.tagline}</p>
        <div className="hero-actions">
          <Link className="button-primary" href="#pricing">Purchase package</Link>
          <Link className="button-secondary" href="#intake">Review intake</Link>
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
          <h2>Checkout, intake, automation, delivery.</h2>
          <p>After purchase, the platform creates an order, sends intake instructions, collects files, runs the product workflow, and exposes status in the admin console.</p>
        </div>
        <ol className="steps">
          <li>Select package</li>
          <li>Pay through Stripe Checkout</li>
          <li>Submit product intake and files</li>
          <li>Workflow creates folders, logs, emails, and deliverables</li>
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
        <div className="section-heading"><p className="eyebrow">Pricing</p><h2>Choose a package</h2></div>
        <div className="pricing-grid">
          {product.packages.map((item) => (
            <article className="pricing-card" key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <strong>${item.price}</strong>
              <span>{item.turnaround}</span>
              <ul>{item.includes.map((include) => <li key={include}>{include}</li>)}</ul>
              <CheckoutForm product={product} selectedPackage={item} />
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
          <p>Files are stored for order processing and automation. Configure production storage and retention policies before accepting sensitive customer data at scale.</p>
          <p>{product.disclaimer}</p>
          <p>Support: <a href={`mailto:${env.supportEmail}`}>{env.supportEmail}</a></p>
        </article>
      </section>
    </main>
  );
}
