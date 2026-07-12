import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasFounderHeader, AtlasFounderSettings } from '@/components/AtlasFounderExperience';
import { env } from '@/lib/env';

export const metadata = {
  title: 'Settings | Atlas',
};

export default async function AtlasSettingsPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);

  return (
    <main className="founder-shell">
      <AtlasFounderHeader token={token} />
      {!authorized ? <AdminAccessForm title="Atlas Settings Access" /> : <AtlasFounderSettings token={token} />}
    </main>
  );
}
