import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasFounderHeader, AtlasFounderHero } from '@/components/AtlasFounderExperience';
import { AtlasGrantOpportunities } from '@/components/AtlasGrantOperator';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = { title: 'Grant Opportunities | Atlas' };

export default async function AtlasGrantOpportunitiesPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  if (!access.authorized) redirectToAtlasLogin('/atlas/grants/opportunities');
  const atlasToken = access.emergencyToken;
  const data = await getAtlasData();
  return <main className="founder-shell"><AtlasFounderHeader token={atlasToken} />{!data ? <AdminAccessForm title="Atlas Grant Opportunities Access" /> : <><AtlasFounderHero kicker="Step 2" title="Review the strongest official opportunities." subtitle="Atlas ranks current official-source opportunities and hides low-value matches by default." /><AtlasGrantOpportunities data={data} token={atlasToken} /></>}</main>;
}
