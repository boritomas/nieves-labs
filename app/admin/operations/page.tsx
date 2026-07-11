import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import AdminAccessForm from '@/components/AdminAccessForm';
import { env } from '@/lib/env';

const envVars = [
  'APP_BASE_URL',
  'ADMIN_TOKEN',
  'NEXT_PUBLIC_APP_BASE_URL',
];

export const metadata = {
  title: 'Operations | Nieves Labs Admin',
};

export default async function AdminOperationsPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);

  return (
    <main className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Nieves Labs home"><BrandLogo size="sm" /></Link>
        <nav className="nav-links"><Link href="/">Home</Link><Link href={`/admin?token=${encodeURIComponent(token)}`}>Admin</Link></nav>
      </header>
      {!authorized ? (
        <AdminAccessForm title="Operations Access" />
      ) : (
        <>
          <section className="product-hero">
            <p className="eyebrow">Internal</p>
            <h1>Portfolio Operations</h1>
            <p>Nieves Labs routes visitors to verified operational product applications. It does not duplicate product commerce, intake, fulfillment, or delivery backends.</p>
          </section>
          <section className="section two-column">
            <article className="panel">
              <h2>Architecture Status</h2>
              <div className="status-list">
                <span className="status-pill ready">portfolio: ready</span>
                <span className="status-pill ready">AnswerBrief: external app</span>
                <span className="status-pill ready">MixPilot: external app</span>
                <span className="status-pill">unfinished products: waitlist</span>
                <span className="status-pill ready">duplicated checkout: disabled</span>
              </div>
            </article>
            <article className="panel">
              <h2>Portfolio Environment Variables</h2>
              <ul>{envVars.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </section>
          <section className="section two-column">
            <article className="panel">
              <h2>Workflow Notes</h2>
              <ol className="steps">
                <li>AnswerBrief AI commerce, intake, fulfillment, and delivery run at answer-brief.com.</li>
                <li>MixPilot AI runs in its own operational application.</li>
                <li>Tax Buddy, Tax Appeal Buddy, Interview Coach, Workforce Study, and Nieves AI Platform remain waitlisted until independent operational journeys exist.</li>
                <li>Nieves Labs checkout, intake, webhook, and workflow endpoints intentionally return 410.</li>
              </ol>
            </article>
            <article className="panel">
              <h2>Troubleshooting</h2>
              <p>If a product CTA fails, verify the external operational application route or keep the product waitlisted. Do not copy operational product secrets into the Nieves Labs portfolio project.</p>
            </article>
          </section>
        </>
      )}
    </main>
  );
}
