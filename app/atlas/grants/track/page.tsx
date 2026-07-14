import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasFounderHeader, AtlasFounderHero } from '@/components/AtlasFounderExperience';
import { AtlasGrantTracking } from '@/components/AtlasGrantOperator';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = { title: 'Grant Tracking | Atlas' };

export default async function AtlasGrantTrackPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  if (!access.authorized) redirectToAtlasLogin('/atlas/grants/track');
  const atlasToken = access.emergencyToken;
  const data = await getAtlasData();
  return <main className="founder-shell"><AtlasFounderHeader token={atlasToken} />{!data ? <AdminAccessForm title="Atlas Grant Tracking Access" /> : <><AtlasFounderHero kicker="Grant tracking" title="Track application state and learning records." subtitle="Atlas records founder effort, application state, follow-up timing, competitor findings, and what the next application should reuse." /><AtlasGrantTracking data={data} /></>}</main>;
}
