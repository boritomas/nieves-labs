import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasImportCenter from '@/components/AtlasImportCenter';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Atlas Import Center | Nieves Labs',
};

export default async function AtlasImportCenterPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/import-center');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="site-shell">
      <AtlasHeader token={atlasToken} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Import Center Access" />
      ) : (
        <>
          <AtlasHero
            token={atlasToken}
            title="Atlas Import Center"
            subtitle="Protected document ingestion, source traceability, and founder-reviewed profile population for lender package preparation."
          />
          <AtlasImportCenter initialData={data} token={atlasToken} />
        </>
      )}
    </main>
  );
}
