import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasDocumentVault from '@/components/AtlasDocumentVault';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { env } from '@/lib/env';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Document Vault | Atlas',
};

export default async function DocumentVaultPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="site-shell">
      <AtlasHeader token={token} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Document Vault Access" />
      ) : (
        <>
          <AtlasHero token={token} title="Document Vault" subtitle="Checklist and upload placeholder workspace for the lender-ready capital package." />
          <AtlasDocumentVault initialDocuments={data.documents} token={token} />
        </>
      )}
    </main>
  );
}
