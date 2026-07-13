import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasFinancialModel from '@/components/AtlasFinancialModel';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';

export const metadata = { title: 'Business Financial Profile | Atlas' };

export default async function BusinessFinancialProfilePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/business-financial-profile');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="site-shell">
      <AtlasHeader token={atlasToken} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Business Financial Profile Access" />
      ) : (
        <>
          <AtlasHero token={atlasToken} title="Business Financial Profile" subtitle="Business assumptions, 12-month MRR forecast, expense model, cash-flow outlook, and repayment coverage." />
          <AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, atlasToken)} />
          <AtlasFinancialModel initialAssumptions={data.financialAssumptions} token={atlasToken} />
        </>
      )}
    </main>
  );
}
