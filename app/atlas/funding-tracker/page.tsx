import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasFundingTracker from '@/components/AtlasFundingTracker';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { env } from '@/lib/env';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Funding Tracker | Atlas',
};

export default async function FundingTrackerPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="site-shell">
      <AtlasHeader token={token} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Funding Tracker Access" />
      ) : (
        <>
          <AtlasHero token={token} title="Funding Tracker" subtitle="Pipeline for SBA microloan, CDFI, grant, bank, investor, and accelerator funding conversations." />
          <AtlasFundingTracker initialOpportunities={data.fundingOpportunities} token={token} />
        </>
      )}
    </main>
  );
}
