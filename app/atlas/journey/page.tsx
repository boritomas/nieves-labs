import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasFounderHeader, AtlasJourneyScreen, AtlasWorkingState } from '@/components/AtlasFounderExperience';
import { env } from '@/lib/env';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'My Application | Atlas',
};

export default async function AtlasJourneyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="founder-shell">
      <AtlasFounderHeader token={token} />
      {!authorized || !data ? <AdminAccessForm title="Atlas Application Access" /> : (
        <>
          <AtlasJourneyScreen data={data} token={token} />
          <AtlasWorkingState data={data} token={token} />
        </>
      )}
    </main>
  );
}
