import Link from 'next/link';
import { ArrowRight, Briefcase, CalendarCheck, CheckCircle2, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { products } from '@/lib/products';
import { env } from '@/lib/env';

const serviceHighlights = [
  {
    title: 'AI product packages',
    body: 'Focused, fixed-scope products for interview preparation, tax organization, property appeals, and business planning.',
  },
  {
    title: 'Automation consulting',
    body: 'Practical workflow design for teams that want to reduce manual work without adding unnecessary complexity.',
  },
  {
    title: 'Decision-ready deliverables',
    body: 'Clear briefs, reports, checklists, and plans that help customers take the next step with confidence.',
  },
];

const processSteps = ['Choose a product', 'Complete secure intake', 'Receive a prepared deliverable'];

export default function Home() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Nieves Labs home">
          <span className="brand-mark">NL</span>
          <span>Nieves Labs</span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="#products">Products</Link>
          <Link href="#services">Services</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#about">About</Link>
          <a href={`mailto:${env.supportEmail}`}>Contact</a>
          <a className="nav-cta" href={`mailto:${env.supportEmail}?subject=Consultation%20Request`}>Book a Consultation</a>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">AI products and automation services</p>
          <h1>Practical AI tools for people who need clearer work, faster.</h1>
          <p className="hero-subtitle">
            Nieves Labs builds focused AI products and automation workflows that help professionals save time, prepare better, and run smarter operations.
          </p>
          <div className="hero-actions">
            <Link className="button-primary" href="#products">Explore Products <ArrowRight size={18} /></Link>
            <a className="button-secondary" href={`mailto:${env.supportEmail}?subject=Consultation%20Request`}>Book a Consultation</a>
          </div>
        </div>
        <div className="operations-panel" aria-label="Nieves Labs services">
          {[
            ['Career preparation', 'Role-specific briefs, practice plans, and interview-ready talking points'],
            ['Tax organization', 'Document packets, appeal prep, checklists, and next-step summaries'],
            ['Workforce insight', 'Practical process studies and automation opportunity maps'],
            ['AI platform planning', 'Product, workflow, and implementation roadmaps for teams'],
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
          <p className="eyebrow">Products</p>
          <h2>Focused packages for real customer needs.</h2>
          <p>Each product is designed around a clear outcome, straightforward intake, and a practical deliverable.</p>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.key}>
              <div>
                <p className="card-kicker">Available</p>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
              </div>
              <div>
                <strong>Who it helps</strong>
                <p>{product.idealCustomer}</p>
              </div>
              <div className="price-row">
                <span>Starting at</span>
                <strong>${Math.min(...product.packages.map((item) => item.price))}</strong>
              </div>
              <div className="card-actions">
                {product.key === 'mixpilot_ai' ? (
                  <>
                    <a className="button-primary" href={env.mixpilotAppUrl}>Build a Mix</a>
                    <Link className="button-secondary" href="/products/mixpilot-ai">Learn More</Link>
                  </>
                ) : (
                  <>
                    <Link className="button-primary" href={`/products/${product.slug}`}>View product</Link>
                    <Link className="button-secondary" href={`/products/${product.slug}#pricing`}>See pricing</Link>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="services" className="section split-section">
        <div>
          <p className="eyebrow">Services</p>
          <h2>AI support that stays practical.</h2>
          <p>
            Nieves Labs focuses on useful products, clear scopes, and workflows that fit the way professionals and small teams actually work.
          </p>
        </div>
        <div className="workflow-list">
          {serviceHighlights.map((item) => (
            <div className="workflow-item" key={item.title}>
              <Sparkles size={20} />
              <div>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="section trust-grid">
        <div className="trust-item"><Briefcase size={24} /><strong>Fixed packages</strong><span>Clear product pricing is shown before checkout.</span></div>
        <div className="trust-item"><ShieldCheck size={24} /><strong>Private intake</strong><span>Customers submit only the details needed to prepare their package.</span></div>
        <div className="trust-item"><CalendarCheck size={24} /><strong>Clear next steps</strong><span>Each package explains what happens after purchase.</span></div>
        <div className="trust-item"><Mail size={24} /><strong>Support included</strong><span>Questions and custom consulting requests go directly to Nieves Labs.</span></div>
      </section>

      <section id="about" className="section split-section">
        <div>
          <p className="eyebrow">About</p>
          <h2>Built for useful outcomes, not AI theater.</h2>
          <p>
            Nieves Labs creates focused products and automation services for professionals who want practical help with preparation, organization, and operational clarity.
          </p>
        </div>
        <div className="workflow-list">
          {processSteps.map((item, index) => (
            <div className="workflow-item" key={item}>
              <span>{index + 1}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="section panel consultation-panel">
        <p className="eyebrow">Contact</p>
        <h2>Have a workflow or product idea to discuss?</h2>
        <p>Book a consultation to scope the right product, automation workflow, or custom package for your situation.</p>
        <a className="button-primary" href={`mailto:${env.supportEmail}?subject=Consultation%20Request`}>Book a Consultation</a>
      </section>

      <footer className="footer">
        <span>Nieves Labs</span>
        <div>
          <Link href="#products">Products</Link>
          <Link href="#services">Services</Link>
          <a href={`mailto:${env.supportEmail}`}>Contact</a>
        </div>
      </footer>
    </main>
  );
}
