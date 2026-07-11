import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import ContactActions from '@/components/ContactActions';
import { env } from '@/lib/env';

function getEmailParts(email: string) {
  const [user = 'hello', domain = 'nieves-labs.com'] = email.split('@');
  return { domain, user };
}

export const metadata = {
  title: 'Contact | Nieves Labs',
  description: 'Contact Nieves Labs for AI products, automation services, and consultation requests.',
};

export default function ContactPage() {
  const { domain, user } = getEmailParts(env.supportEmail);

  return (
    <main className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Nieves Labs home">
          <BrandLogo size="sm" />
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/#products">Products</Link>
          <Link href="/#services">Services</Link>
          <Link href="/#pricing">Pricing</Link>
        </nav>
      </header>

      <section className="hero-section contact-hero">
        <div className="hero-copy">
          <p className="eyebrow">Contact</p>
          <h1>Book a consultation or ask a product question.</h1>
          <p className="hero-subtitle">
            Tell Nieves Labs what you are trying to prepare, automate, or launch. We will help route you to the right product package or custom workflow.
          </p>
          <ContactActions domain={domain} subject="Consultation Request" user={user} />
        </div>
        <div className="operations-panel" aria-label="Contact options">
          {[
            ['Product package questions', 'Ask which AnswerBrief, tax, appeal, workforce, or platform package fits your situation.'],
            ['Automation consulting', 'Scope a workflow, integration, or operational AI implementation.'],
            ['Existing order support', 'Include your order email and product name so support can find the right record.'],
          ].map(([title, body]) => (
            <div key={title} className="capability-row">
              <div>
                <strong>{title}</strong>
                <span>{body}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
