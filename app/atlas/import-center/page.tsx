import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasImportCenter from '@/components/AtlasImportCenter';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { env } from '@/lib/env';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Atlas Import Center | Nieves Labs',
};

export default async function AtlasImportCenterPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="site-shell">
      <AtlasHeader token={token} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Import Center Access" />
      ) : (
        <>
          <AtlasHero
            token={token}
            title="Atlas Import Center"
            subtitle="Protected document ingestion, source traceability, and founder-reviewed profile population for lender package preparation."
          />
          <AtlasImportCenter initialData={data} token={token} />
        </>
      )}
    </main>
  );
}
