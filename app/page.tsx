import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowRight, Briefcase, CalendarCheck, CheckCircle2, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { ProductEcosystemStrip, ProductIdentity } from '@/components/ProductIdentity';
import { productBrandByKey, type BrandProductKey } from '@/lib/brand';
import { products } from '@/lib/products';

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

const processSteps = ['Explore a product', 'Open the operational app or join waitlist', 'Complete the product workflow in its dedicated application'];

export default function Home() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Nieves Labs home">
          <BrandLogo size="sm" />
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="#products">Products</Link>
          <Link href="#services">Services</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link className="nav-cta" href="/contact">Book a Consultation</Link>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Nieves Labs product ecosystem</p>
          <h1>AI solutions that empower people.</h1>
          <p className="hero-subtitle">
            Premium AI products and automation workflows that simplify complex preparation, save time, and help people move with confidence.
          </p>
          <div className="hero-actions">
            <Link className="button-primary" href="#products">Explore Products <ArrowRight size={18} /></Link>
            <Link className="button-secondary" href="/contact">Book a Consultation</Link>
          </div>
          <ProductEcosystemStrip />
        </div>
        <div className="brand-showcase" aria-label="Nieves Labs brand system preview">
          <BrandLogo size="lg" showWordmark={false} />
          <div>
            <p className="eyebrow">Brand promise</p>
            <h2>Clear. Confident. Human.</h2>
            <p>Nieves Labs designs useful AI systems around trust, simplicity, measurable results, and practical customer outcomes.</p>
          </div>
        </div>
      </section>

      <section className="section trust-grid">
        {[
          ['Innovation', 'Useful AI tools built for practical customer outcomes'],
          ['Trust', 'Clear statuses, privacy-aware intake, and dedicated operational apps'],
          ['Automation', 'Workflow systems that reduce routine manual work'],
          ['Results', 'Briefs, plans, packets, and reports customers can act on'],
        ].map(([title, body]) => (
          <div key={title} className="trust-item brand-principle">
            <CheckCircle2 size={24} />
            <strong>{title}</strong>
            <span>{body}</span>
          </div>
        ))}
      </section>

      <section className="section split-section">
        <div>
          <p className="eyebrow">What we build</p>
          <h2>A connected product family with distinct customer jobs.</h2>
          <p>
            Nieves Labs is the parent company. Each operational product has its own application, workflow, and customer journey while sharing a consistent brand language.
          </p>
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
          <h2>The Nieves AI product ecosystem.</h2>
          <p>Every product has its own role, accent color, icon, and operating model while staying visibly connected to the Nieves Labs parent brand.</p>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article
              className="product-card"
              key={product.key}
              style={{
                '--product-accent': productBrandByKey[product.key as BrandProductKey]?.accent,
                '--product-soft': productBrandByKey[product.key as BrandProductKey]?.accentSoft,
              } as CSSProperties}
            >
              <div>
                <p className="card-kicker">{product.externalApp ? 'Operational app' : product.publicAvailability === 'coming_soon' ? 'Coming soon' : 'Waitlist'}</p>
                <h3 className="product-card-title">
                  <ProductIdentity productKey={product.key as BrandProductKey} />
                </h3>
                <p>{product.description}</p>
              </div>
              <div>
                <strong>Who it helps</strong>
                <p>{product.idealCustomer}</p>
              </div>
              <div className="price-row">
                <span>{product.externalApp ? 'Opens in' : 'Status'}</span>
                <strong>{product.externalApp ? product.externalApp.label.replace(' operational app', '') : 'Waitlist'}</strong>
              </div>
              <div className="card-actions">
                {product.externalApp ? (
                  <>
                    <a className="button-primary" href={product.externalApp.ctas[0].url}>{product.externalApp.ctas[0].label}</a>
                    <Link className="button-secondary" href={`/products/${product.slug}`}>Learn More</Link>
                  </>
                ) : (
                  <>
                    <Link className="button-primary" href="/contact">Join waitlist</Link>
                    <Link className="button-secondary" href={`/products/${product.slug}`}>Learn More</Link>
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
        <div className="trust-item"><Briefcase size={24} /><strong>Dedicated product apps</strong><span>Operational products run commerce, intake, and fulfillment in their own verified applications.</span></div>
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
        <Link className="button-primary" href="/contact">Book a Consultation</Link>
      </section>

      <footer className="footer">
        <span>Nieves Labs</span>
        <div>
          <Link href="#products">Products</Link>
          <Link href="#services">Services</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </footer>
    </main>
  );
}
