import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasUseOfFundsForm } from '@/components/AtlasProfileForm';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { env } from '@/lib/env';

export const metadata = { title: 'Use of Funds | Atlas' };

export default async function UseOfFundsPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;
  return (
    <main className="site-shell">
      <AtlasHeader token={token} />
      {!authorized || !data ? <AdminAccessForm title="Atlas Use of Funds Access" /> : (
        <>
          <AtlasHero token={token} title="Use of Funds" subtitle="$25,000, $35,000, $50,000, or custom funding scenarios with category-level validation." />
          <AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, token)} />
          <AtlasUseOfFundsForm initialPlan={data.useOfFundsPlan} token={token} />
        </>
      )}
    </main>
  );
}
