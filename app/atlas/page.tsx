import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasFounderHeader, AtlasFounderHome } from '@/components/AtlasFounderExperience';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'My Funding | Atlas Capital Office',
};

export default async function AtlasFounderHomePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="founder-shell">
      <AtlasFounderHeader token={atlasToken} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Funding Access" />
      ) : (
        <AtlasFounderHome data={data} token={atlasToken} />
      )}
    </main>
  );
}
