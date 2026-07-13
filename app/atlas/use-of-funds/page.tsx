import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasUseOfFundsForm } from '@/components/AtlasProfileForm';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';

export const metadata = { title: 'Use of Funds | Atlas' };

export default async function UseOfFundsPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/use-of-funds');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;
  return (
    <main className="site-shell">
      <AtlasHeader token={atlasToken} />
      {!authorized || !data ? <AdminAccessForm title="Atlas Use of Funds Access" /> : (
        <>
          <AtlasHero token={atlasToken} title="Use of Funds" subtitle="$25,000, $35,000, $50,000, or custom funding scenarios with category-level validation." />
          <AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, atlasToken)} />
          <AtlasUseOfFundsForm initialPlan={data.useOfFundsPlan} token={atlasToken} />
        </>
      )}
    </main>
  );
}
