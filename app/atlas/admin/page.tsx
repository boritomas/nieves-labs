import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasAdvancedDashboard from '@/components/AtlasAdvancedDashboard';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { env } from '@/lib/env';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Advanced Atlas Dashboard | Nieves Labs',
};

export default async function AtlasAdminDashboardPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="site-shell">
      <AtlasHeader token={token} />
      {!authorized || !data ? (
        <AdminAccessForm title="Advanced Atlas Dashboard Access" />
      ) : (
        <>
          <AtlasHero token={token} title="Advanced Atlas Dashboard" subtitle="Internal detail view for readiness scores, workflow stages, source imports, risks, lender data, and package status." />
          <AtlasAdvancedDashboard data={data} token={token} />
        </>
      )}
    </main>
  );
}
