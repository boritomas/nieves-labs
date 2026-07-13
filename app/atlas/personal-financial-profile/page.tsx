import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasPersonalFinancialForm } from '@/components/AtlasProfileForm';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';

export const metadata = { title: 'Personal Financial Profile | Atlas' };

export default async function PersonalFinancialProfilePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/personal-financial-profile');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;
  return (
    <main className="site-shell">
      <AtlasHeader token={atlasToken} />
      {!authorized || !data ? <AdminAccessForm title="Atlas Personal Financial Access" /> : (
        <>
          <AtlasHero token={atlasToken} title="Personal Financial Profile" subtitle="Sensitive founder assets, liabilities, income, monthly expenses, and debt-to-income tracking hidden by default." />
          <AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, atlasToken)} />
          <AtlasPersonalFinancialForm initialProfile={data.personalFinancialProfile} token={atlasToken} />
        </>
      )}
    </main>
  );
}
