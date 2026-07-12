import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasFounderHeader, AtlasFounderReview } from '@/components/AtlasFounderExperience';
import { env } from '@/lib/env';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Review & Submit | Atlas',
};

export default async function AtlasReviewPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;

  return (
    <main className="founder-shell">
      <AtlasFounderHeader token={token} />
      {!authorized || !data ? <AdminAccessForm title="Atlas Final Review Access" /> : <AtlasFounderReview data={data} token={token} />}
    </main>
  );
}
