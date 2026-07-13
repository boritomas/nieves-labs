import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasFounderDocuments, AtlasFounderHeader } from '@/components/AtlasFounderExperience';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Documents | Atlas',
};

export default async function AtlasDocumentsPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/documents');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="founder-shell">
      <AtlasFounderHeader token={atlasToken} />
      {!authorized || !data ? <AdminAccessForm title="Atlas Documents Access" /> : <AtlasFounderDocuments data={data} token={atlasToken} />}
    </main>
  );
}
