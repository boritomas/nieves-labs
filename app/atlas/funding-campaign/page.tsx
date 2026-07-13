import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasFundingCampaignOS from '@/components/AtlasFundingCampaignOS';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { env } from '@/lib/env';

export const metadata = { title: 'Funding Campaign OS | Atlas' };

export default async function FundingCampaignPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="site-shell">
      <AtlasHeader token={token} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Funding Campaign Access" />
      ) : (
        <>
          <AtlasHero
            token={token}
            title="Funding Campaign OS"
            subtitle="Five steps to prepare, route, submit, prove, and follow up on a lender application without repeating manual portal loops."
          />
          <AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, token)} />
          <AtlasFundingCampaignOS data={data} token={token} />
        </>
      )}
    </main>
  );
}
