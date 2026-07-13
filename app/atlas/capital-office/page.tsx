import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasReadinessBreakdown from '@/components/AtlasReadinessBreakdown';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Capital Office | Atlas',
};

export default async function CapitalOfficePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/capital-office');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="site-shell">
      <AtlasHeader token={atlasToken} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Capital Office Access" />
      ) : (
        <>
          <AtlasHero token={atlasToken} title="Capital Office" subtitle="Executive funding command center for readiness, target capital, lender packaging, and operating discipline." />
          <section className="metrics-grid">
            <Metric label="Capital readiness" value={`${data.readinessScores.capitalReadiness}%`} />
            <Metric label="Application readiness" value={`${data.readinessScores.applicationReadiness}%`} />
            <Metric label="Overall readiness" value={`${data.readinessScores.overallReadiness}%`} />
            <Metric label="Active funding sources" value={String(data.fundingOpportunities.filter((item) => item.status !== 'declined').length)} />
          </section>
          <AtlasReadinessBreakdown scores={data.readinessScores} />
          <section className="two-column">
            <div className="panel">
              <p className="eyebrow">Company</p>
              <h2>{data.companyProfile.companyName}</h2>
              <p>{data.companyProfile.businessSummary}</p>
            </div>
            <div className="panel">
              <p className="eyebrow">Funding thesis</p>
              <h2>{data.companyProfile.fundingRequest}</h2>
              <p>{data.companyProfile.useOfFunds}</p>
            </div>
          </section>
          <section className="feature-grid">
            {data.companyProfile.primaryUseOfFunds.map((item) => (
              <div className="feature-card" key={item}>
                <strong>{item}</strong>
                <p>Tracked as part of the lender-ready use-of-funds narrative.</p>
              </div>
            ))}
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
