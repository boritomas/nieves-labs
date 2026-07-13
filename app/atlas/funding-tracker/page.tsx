import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasFundingTracker from '@/components/AtlasFundingTracker';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Funding Tracker | Atlas',
};

export default async function FundingTrackerPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/funding-tracker');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="site-shell">
      <AtlasHeader token={atlasToken} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Funding Tracker Access" />
      ) : (
        <>
          <AtlasHero token={atlasToken} title="Funding Tracker" subtitle="Pipeline for SBA microloan, CDFI, grant, bank, investor, and accelerator funding conversations." />
          <AtlasFundingTracker initialOpportunities={data.fundingOpportunities} token={atlasToken} />
        </>
      )}
    </main>
  );
}
