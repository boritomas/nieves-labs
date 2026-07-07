import Link from 'next/link';
import { ArrowRight, CheckCircle2, Lock, Mail, ShieldCheck, Workflow } from 'lucide-react';
import { products } from '@/lib/products';
import { env } from '@/lib/env';

const workflow = ['Select package', 'Secure checkout', 'Complete intake', 'Upload files', 'Automation runs', 'Deliverable ready'];

export default function Home() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Nieves Labs home">
          <span className="brand-mark">NL</span>
          <span>Nieves Labs</span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link href="#products">Products</Link>
          <Link href="#workflow">Workflow</Link>
          <Link href="/admin">Admin</Link>
          <a href={`mailto:${env.supportEmail}`}>Support</a>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Practical AI product lab</p>
          <h1>Nieves Labs is the product hub for operational AI services.</h1>
          <p className="hero-subtitle">
            Buy a package, complete secure intake, upload files, and trigger structured backend workflows for career, tax, workforce, and AI platform products.
          </p>
          <div className="hero-actions">
            <Link className="button-primary" href="#products">Explore products <ArrowRight size={18} /></Link>
            <Link className="button-secondary" href="/admin">Open admin console</Link>
          </div>
        </div>
        <div className="operations-panel" aria-label="Platform capabilities">
          {[
            ['Checkout', 'Stripe-ready payment sessions and webhook validation'],
            ['Intake', 'Tokenized forms, uploads, and product-specific questions'],
            ['Automation', 'Drive, Gmail, Apps Script, deliverables, and logs'],
            ['Visibility', 'Admin order tracking, status, errors, and review queue'],
          ].map(([title, body]) => (
            <div key={title} className="capability-row">
              <CheckCircle2 size={20} />
              <div>
                <strong>{title}</strong>
                <span>{body}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="section">
        <div className="section-heading">
          <p className="eyebrow">Product catalog</p>
          <h2>Every Nieves Labs product has a real customer path.</h2>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.key}>
              <div>
                <p className="card-kicker">{product.idealCustomer}</p>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
              </div>
              <ul>
                {product.features.slice(0, 4).map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <div className="price-row">
                <span>From</span>
                <strong>${Math.min(...product.packages.map((item) => item.price))}</strong>
              </div>
              <div className="card-actions">
                <Link className="button-primary" href={`/products/${product.slug}`}>View product</Link>
                <Link className="button-secondary" href={`/products/${product.slug}#pricing`}>Buy now</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className="section split-section">
        <div>
          <p className="eyebrow">Workflow engine</p>
          <h2>One operational pipeline for every product.</h2>
          <p>
            Each product defines required files, intake questions, automation steps, deliverable templates, Drive folder creation, Gmail notifications, and admin-visible status.
          </p>
        </div>
        <div className="workflow-list">
          {workflow.map((item, index) => (
            <div className="workflow-item" key={item}>
              <span>{index + 1}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section trust-grid">
        <div className="trust-item"><ShieldCheck size={24} /><strong>Webhook validation</strong><span>Stripe signatures are verified before payment state changes.</span></div>
        <div className="trust-item"><Lock size={24} /><strong>Secure intake tokens</strong><span>Orders receive unique intake URLs for file and answer submission.</span></div>
        <div className="trust-item"><Workflow size={24} /><strong>Automated deliverables</strong><span>Structured templates are generated even when AI keys are unavailable.</span></div>
        <div className="trust-item"><Mail size={24} /><strong>Email automation</strong><span>Gmail-backed notifications are ready once OAuth credentials are configured.</span></div>
      </section>

      <footer className="footer">
        <span>Nieves Labs</span>
        <div>
          <Link href="/docs/operations">Operations docs</Link>
          <a href={`mailto:${env.supportEmail}`}>Support</a>
          <Link href="/admin">Admin</Link>
        </div>
      </footer>
    </main>
  );
}
