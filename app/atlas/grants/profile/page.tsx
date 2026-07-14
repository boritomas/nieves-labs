import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasFounderHeader, AtlasFounderHero } from '@/components/AtlasFounderExperience';
import { AtlasGrantProfile } from '@/components/AtlasGrantOperator';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = { title: 'Grant Profile | Atlas' };

export default async function AtlasGrantProfilePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  if (!access.authorized) redirectToAtlasLogin('/atlas/grants/profile');
  const atlasToken = access.emergencyToken;
  const data = await getAtlasData();
  return <main className="founder-shell"><AtlasFounderHeader token={atlasToken} />{!data ? <AdminAccessForm title="Atlas Grant Profile Access" /> : <><AtlasFounderHero kicker="Step 1" title="Confirm the business once." subtitle="Atlas reuses verified company, founder, document, product, and financial records before asking Tomas anything." /><AtlasGrantProfile data={data} /></>}</main>;
}
