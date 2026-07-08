import Link from 'next/link';
import AdminAccessForm from '@/components/AdminAccessForm';
import { requiredCredentialStatus } from '@/lib/env';
import { env } from '@/lib/env';

const envVars = [
  'APP_BASE_URL',
  'SUPPORT_EMAIL',
  'ADMIN_TOKEN',
  'OPENAI_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_ANSWERBRIEF_BRIEF',
  'STRIPE_PRICE_ANSWERBRIEF_PREMIUM',
  'STRIPE_PRICE_TAX_BUDDY_ORGANIZE',
  'STRIPE_PRICE_TAX_APPEAL_PACKET',
  'STRIPE_PRICE_INTERVIEW_COACH_PLAN',
  'STRIPE_PRICE_WORKFORCE_STUDY_REPORT',
  'STRIPE_PRICE_PLATFORM_CONSULTATION',
  'PAYMENT_LINK_ANSWERBRIEF_QUICK_PREP',
  'PAYMENT_LINK_ANSWERBRIEF_FULL_BRIEF',
  'PAYMENT_LINK_ANSWERBRIEF_PREMIUM_PREP',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REFRESH_TOKEN',
  'GOOGLE_DRIVE_FOLDER_ROOT_ID',
  'GOOGLE_DRIVE_ROOT_FOLDER_ID',
  'GOOGLE_APPS_SCRIPT_URL',
  'GOOGLE_APPS_SCRIPT_WEBHOOK_URL',
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_PRIVATE_KEY',
  'GOOGLE_SHEETS_SPREADSHEET_ID',
  'GOOGLE_SHEETS_ORDERS_SHEET_NAME',
  'GOOGLE_SHEETS_INTAKE_SHEET_NAME',
  'GMAIL_CLIENT_ID',
  'GMAIL_CLIENT_SECRET',
  'GMAIL_REFRESH_TOKEN',
  'GMAIL_FROM_EMAIL',
  'DATABASE_URL',
  'POSTGRES_URL',
  'BLOB_READ_WRITE_TOKEN',
];

export const metadata = {
  title: 'Operations | Nieves Labs Admin',
};

export default async function AdminOperationsPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const credentials = requiredCredentialStatus();

  return (
    <main className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand"><span className="brand-mark">NL</span><span>Nieves Labs</span></Link>
        <nav className="nav-links"><Link href="/">Home</Link><Link href={`/admin?token=${encodeURIComponent(token)}`}>Admin</Link></nav>
      </header>
      {!authorized ? (
        <AdminAccessForm title="Operations Access" />
      ) : (
        <>
          <section className="product-hero">
            <p className="eyebrow">Internal</p>
            <h1>Operations Runbook</h1>
            <p>Production setup, integrations, workflow status, deployment notes, and troubleshooting.</p>
          </section>
          <section className="section two-column">
            <article className="panel">
              <h2>Credential Status</h2>
              <div className="status-list">
                {Object.entries(credentials).map(([key, ready]) => (
                  <span key={key} className={ready ? 'status-pill ready' : 'status-pill missing'}>{key}: {ready ? 'ready' : 'missing'}</span>
                ))}
              </div>
            </article>
            <article className="panel">
              <h2>Required Environment Variables</h2>
              <ul>{envVars.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </section>
          <section className="section two-column">
            <article className="panel">
              <h2>Workflow Notes</h2>
              <ol className="steps">
                <li>Checkout creates an order and payment session when payment credentials exist.</li>
                <li>Payment webhooks update order status after signature validation.</li>
                <li>Intake collects product answers and files.</li>
                <li>Fulfillment generates deliverables, saves artifacts, sends notifications, and logs outcomes.</li>
              </ol>
            </article>
            <article className="panel">
              <h2>Troubleshooting</h2>
              <p>If a workflow uses fallback behavior, confirm the related payment, Google, email, storage, or AI variable is configured in production.</p>
            </article>
          </section>
        </>
      )}
    </main>
  );
}
