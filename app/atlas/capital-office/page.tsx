import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { env } from '@/lib/env';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Capital Office | Atlas',
};

export default async function CapitalOfficePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
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
          <AtlasHero token={token} title="Capital Office" subtitle="Executive funding command center for readiness, target capital, lender packaging, and operating discipline." />
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
