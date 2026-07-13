import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasFundingCampaignOS from '@/components/AtlasFundingCampaignOS';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';

export const metadata = { title: 'Funding Campaign OS | Atlas' };

export default async function FundingCampaignPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/funding-campaign');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="site-shell">
      <AtlasHeader token={atlasToken} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Funding Campaign Access" />
      ) : (
        <>
          <AtlasHero
            token={atlasToken}
            title="Funding Campaign OS"
            subtitle="Five steps to prepare, route, submit, prove, and follow up on a lender application without repeating manual portal loops."
          />
          <AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, atlasToken)} />
          <AtlasFundingCampaignOS data={data} token={atlasToken} />
        </>
      )}
    </main>
  );
}
