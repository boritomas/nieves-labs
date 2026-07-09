import Link from 'next/link';
import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasReadinessBreakdown from '@/components/AtlasReadinessBreakdown';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { env } from '@/lib/env';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Atlas Capital Office | Nieves Labs',
};

export default async function AtlasDashboardPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="site-shell">
      <AtlasHeader token={token} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Capital Office Access" />
      ) : (
        <>
          <AtlasHero token={token} title="Atlas Capital Office" subtitle="Internal executive and funding workspace for Nieves Labs capital readiness, lender preparation, and due diligence." />
          <section className="metrics-grid">
            <Metric label="Capital readiness" value={`${data.readinessScores.capitalReadiness}%`} />
            <Metric label="Product readiness" value={`${data.readinessScores.productReadiness}%`} />
            <Metric label="Documentation readiness" value={`${data.readinessScores.documentationReadiness}%`} />
            <Metric label="Application readiness" value={`${data.readinessScores.applicationReadiness}%`} />
            <Metric label="Overall readiness" value={`${data.readinessScores.overallReadiness}%`} />
            <Metric label="Funding target" value={`${money(data.companyProfile.fundingTargetMin)}-${money(data.companyProfile.fundingTargetMax)}`} />
          </section>

          <AtlasReadinessBreakdown scores={data.readinessScores} />

          <section className="two-column">
            <div className="panel">
              <p className="eyebrow">Current stage</p>
              <h2>{data.companyProfile.currentStage}</h2>
              <p>{data.companyProfile.nextAction}</p>
              <div className="hero-actions">
                <Link className="button-primary" href={`/atlas/sba-loan-package?token=${encodeURIComponent(token)}`}>Open SBA Package</Link>
                <Link className="button-secondary" href={`/atlas/document-vault?token=${encodeURIComponent(token)}`}>Review Documents</Link>
                <Link className="button-secondary" href={`/atlas/application-builder?token=${encodeURIComponent(token)}`}>Build Application</Link>
              </div>
            </div>
            <div className="panel">
              <p className="eyebrow">Required documents</p>
              <h2>{data.documents.filter((item) => item.completed).length} completed / {data.documents.length} total</h2>
              <div className="status-list">
                {data.documents.filter((item) => !item.completed).slice(0, 6).map((item) => (
                  <span className="status-pill missing" key={item.id}>{item.name}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="two-column">
            <div className="panel">
              <p className="eyebrow">Open risks</p>
              <div className="atlas-stack">
                {data.risks.map((risk) => (
                  <article className="atlas-risk-card" key={risk.id}>
                    <strong>{risk.title}</strong>
                    <p>{risk.mitigation}</p>
                    <span className={`status-pill ${risk.severity === 'high' ? 'missing' : 'ready'}`}>{risk.severity}</span>
                  </article>
                ))}
              </div>
            </div>
            <div className="panel">
              <p className="eyebrow">Funding status</p>
              <h2>{data.companyProfile.preferredFundingTypes.join(' / ')}</h2>
              <div className="atlas-stack">
                {data.fundingOpportunities.map((opportunity) => (
                  <div className="capability-row" key={opportunity.id}>
                    <span className="atlas-mini-dot" />
                    <div>
                      <strong>{opportunity.fundingSource}</strong>
                      <span>{money(opportunity.targetAmount)} • fit {opportunity.fitScore}/100 • {opportunity.status.replaceAll('_', ' ')} • Next: {opportunity.nextAction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
