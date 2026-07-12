import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasFinancialModel from '@/components/AtlasFinancialModel';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { env } from '@/lib/env';

export const metadata = { title: 'Business Financial Profile | Atlas' };

export default async function BusinessFinancialProfilePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="site-shell">
      <AtlasHeader token={token} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Business Financial Profile Access" />
      ) : (
        <>
          <AtlasHero token={token} title="Business Financial Profile" subtitle="Business assumptions, 12-month MRR forecast, expense model, cash-flow outlook, and repayment coverage." />
          <AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, token)} />
          <AtlasFinancialModel initialAssumptions={data.financialAssumptions} token={token} />
        </>
      )}
    </main>
  );
}
