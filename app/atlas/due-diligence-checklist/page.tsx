import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasTaskChecklist from '@/components/AtlasTaskChecklist';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Due Diligence Checklist | Atlas',
};

export default async function DueDiligenceChecklistPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/due-diligence-checklist');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="site-shell">
      <AtlasHeader token={atlasToken} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Due Diligence Access" />
      ) : (
        <>
          <AtlasHero token={atlasToken} title="Due Diligence Checklist" subtitle="Tasks and underwriting workstreams needed before approaching SBA Microloan and CDFI lenders." />
          <section className="two-column">
            <AtlasTaskChecklist initialTasks={data.tasks} token={atlasToken} />
            <section className="panel">
              <h2>Underwriting risks</h2>
              <div className="atlas-stack">
                {data.risks.map((risk) => (
                  <article className="atlas-risk-card" key={risk.id}>
                    <strong>{risk.title}</strong>
                    <p>{risk.mitigation}</p>
                    <span className={`status-pill ${risk.severity === 'high' ? 'missing' : 'ready'}`}>{risk.status.replaceAll('_', ' ')}</span>
                  </article>
                ))}
              </div>
            </section>
          </section>
        </>
      )}
    </main>
  );
}
