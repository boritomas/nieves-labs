import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasFounderHeader, AtlasFounderHero } from '@/components/AtlasFounderExperience';
import { AtlasNsfProjectPitchReview } from '@/components/AtlasGrantOperator';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = { title: 'NSF Project Pitch | Atlas' };

export default async function AtlasNsfProjectPitchPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  if (!access.authorized) redirectToAtlasLogin('/atlas/grants/project-pitch');
  const atlasToken = access.emergencyToken;
  const data = await getAtlasData();

  return (
    <main className="founder-shell">
      <AtlasFounderHeader token={atlasToken} />
      {!data ? <AdminAccessForm title="Atlas NSF Project Pitch Access" /> : (
        <>
          <AtlasFounderHero kicker="NSF Project Pitch" title="Prepare the required NSF pitch before any full proposal." subtitle="Atlas records the real submission status, evaluates eligible concepts, prepares founder-review text, and stops before legal approval or portal submission." />
          <AtlasNsfProjectPitchReview data={data} token={atlasToken} />
        </>
      )}
    </main>
  );
}
