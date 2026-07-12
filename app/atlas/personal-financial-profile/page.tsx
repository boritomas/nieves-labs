import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasPersonalFinancialForm } from '@/components/AtlasProfileForm';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { env } from '@/lib/env';

export const metadata = { title: 'Personal Financial Profile | Atlas' };

export default async function PersonalFinancialProfilePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;
  return (
    <main className="site-shell">
      <AtlasHeader token={token} />
      {!authorized || !data ? <AdminAccessForm title="Atlas Personal Financial Access" /> : (
        <>
          <AtlasHero token={token} title="Personal Financial Profile" subtitle="Sensitive founder assets, liabilities, income, monthly expenses, and debt-to-income tracking hidden by default." />
          <AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, token)} />
          <AtlasPersonalFinancialForm initialProfile={data.personalFinancialProfile} token={token} />
        </>
      )}
    </main>
  );
}
