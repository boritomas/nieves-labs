import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasFounderDocuments, AtlasFounderHeader } from '@/components/AtlasFounderExperience';
import { env } from '@/lib/env';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Documents | Atlas',
};

export default async function AtlasDocumentsPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="founder-shell">
      <AtlasFounderHeader token={token} />
      {!authorized || !data ? <AdminAccessForm title="Atlas Documents Access" /> : <AtlasFounderDocuments data={data} token={token} />}
    </main>
  );
}
