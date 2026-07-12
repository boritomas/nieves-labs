import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages, calculateAtlasReadinessAssessment } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { env } from '@/lib/env';

export const metadata = { title: 'Readiness Assessment | Atlas' };

export default async function ReadinessAssessmentPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;
  const assessment = data ? calculateAtlasReadinessAssessment(data) : null;

  return (
    <main className="site-shell">
      <AtlasHeader token={token} />
      {!authorized || !data || !assessment ? <AdminAccessForm title="Atlas Readiness Access" /> : (
        <>
          <AtlasHero token={token} title="Readiness Assessment" subtitle="SBA and CDFI readiness scoring for the Nieves Labs $25,000-$50,000 capital package." />
          <AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, token)} />
          <section className="metrics-grid">
            <Metric label="Overall" value={`${assessment.overallReadiness}%`} />
            <Metric label="SBA readiness" value={`${assessment.sbaReadiness}%`} />
            <Metric label="CDFI readiness" value={`${assessment.cdfiReadiness}%`} />
            <Metric label="Documentation" value={`${assessment.documentationScore}%`} />
            <Metric label="Financial" value={`${assessment.financialScore}%`} />
            <Metric label="Risk" value={`${assessment.riskScore}%`} />
          </section>
          <section className="two-column">
            <div className="panel">
              <p className="eyebrow">Recommendations</p>
              <h2>Next best actions</h2>
              <ul className="atlas-list">{assessment.recommendations.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="panel">
              <p className="eyebrow">Missing items</p>
              <h2>{assessment.missingItems.length} items to resolve</h2>
              <div className="status-list">{assessment.missingItems.slice(0, 12).map((item) => <span className="status-pill missing" key={item}>{item}</span>)}</div>
              <p>No approval is guaranteed. Atlas prepares founder-reviewed materials for manual lender submission.</p>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="metric-card"><span>{label}</span><strong>{value}</strong></div>;
}
