import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasFounderHeader, AtlasFounderSettings } from '@/components/AtlasFounderExperience';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';

export const metadata = {
  title: 'Settings | Atlas',
};

export default async function AtlasSettingsPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/settings');
  const atlasToken = access.emergencyToken;

  return (
    <main className="founder-shell">
      <AtlasFounderHeader token={atlasToken} />
      {!authorized ? <AdminAccessForm title="Atlas Settings Access" /> : <AtlasFounderSettings token={atlasToken} />}
    </main>
  );
}
