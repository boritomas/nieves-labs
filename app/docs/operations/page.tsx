import Link from 'next/link';
import { requiredCredentialStatus } from '@/lib/env';

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
  'NEXT_PUBLIC_STRIPE_QUICK_PREP_LINK',
  'NEXT_PUBLIC_STRIPE_FULL_INTERVIEW_BRIEF_LINK',
  'NEXT_PUBLIC_STRIPE_PREMIUM_PREP_LINK',
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

export default function OperationsDocsPage() {
  const credentials = requiredCredentialStatus();

  return (
    <main className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand"><span className="brand-mark">NL</span><span>Nieves Labs</span></Link>
        <nav className="nav-links"><Link href="/">Home</Link><Link href="/admin">Admin</Link></nav>
      </header>
      <section className="product-hero">
        <p className="eyebrow">Documentation</p>
        <h1>Operations Runbook</h1>
        <p>Production setup, integrations, workflows, and missing credential visibility for NievesLabs.com.</p>
      </section>
      <section className="section two-column">
        <article className="panel">
          <h2>Architecture</h2>
          <p>Next.js App Router serves product pages, checkout APIs, tokenized intake, workflow execution, and the admin console.</p>
          <p>Orders, customers, uploads, deliverables, logs, and workflow status are normalized in the platform store. Local JSON is used for development. Production can mirror normalized entities to Google Sheets when the approved service-account and spreadsheet variables are configured.</p>
        </article>
        <article className="panel">
          <h2>Credential Status</h2>
          <div className="status-list">
            {Object.entries(credentials).map(([key, ready]) => (
              <span key={key} className={ready ? 'status-pill ready' : 'status-pill missing'}>{key}: {ready ? 'ready' : 'missing'}</span>
            ))}
          </div>
        </article>
      </section>
      <section className="section two-column">
        <article className="panel">
          <h2>Workflow</h2>
          <ol className="steps">
            <li>Customer selects a package on a product page.</li>
            <li>Checkout API creates an order and Stripe Checkout session when credentials exist.</li>
            <li>Webhook validates Stripe signature and marks payment paid.</li>
            <li>Customer completes secure intake and uploads files.</li>
            <li>Workflow creates Drive folder, triggers Apps Script, generates deliverable template, sends Gmail messages, and logs outcomes.</li>
          </ol>
        </article>
        <article className="panel">
          <h2>Required Environment Variables</h2>
          <ul>{envVars.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
      </section>
      <section className="section panel">
        <h2>Troubleshooting</h2>
        <p>If checkout redirects directly to intake, Stripe credentials and approved payment links are missing. If Drive or Gmail steps are skipped, configure Google OAuth or service-account variables. Production admin APIs fail closed until ADMIN_TOKEN is configured.</p>
      </section>
    </main>
  );
}
