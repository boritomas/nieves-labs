import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasFounderHeader, AtlasJourneyScreen, AtlasWorkingState } from '@/components/AtlasFounderExperience';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'My Application | Atlas',
};

export default async function AtlasJourneyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/journey');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="founder-shell">
      <AtlasFounderHeader token={atlasToken} />
      {!authorized || !data ? <AdminAccessForm title="Atlas Application Access" /> : (
        <>
          <AtlasJourneyScreen data={data} token={atlasToken} />
          <AtlasWorkingState data={data} token={atlasToken} />
        </>
      )}
    </main>
  );
}
