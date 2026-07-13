import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasDocumentVault from '@/components/AtlasDocumentVault';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Document Vault | Atlas',
};

export default async function DocumentVaultPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/document-vault');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="site-shell">
      <AtlasHeader token={atlasToken} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Document Vault Access" />
      ) : (
        <>
          <AtlasHero token={atlasToken} title="Document Vault" subtitle="Checklist and upload placeholder workspace for the lender-ready capital package." />
          <AtlasDocumentVault initialDocuments={data.documents} token={atlasToken} />
        </>
      )}
    </main>
  );
}
