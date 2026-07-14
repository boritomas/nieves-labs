import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasFounderHeader, AtlasFounderHero } from '@/components/AtlasFounderExperience';
import { AtlasGrantApplication } from '@/components/AtlasGrantOperator';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = { title: 'Grant Application Package | Atlas' };

export default async function AtlasGrantApplicationPage({ params, searchParams }: { params: Promise<{ opportunity: string }>; searchParams: Promise<{ token?: string }> }) {
  const [{ opportunity }, { token = '' }] = await Promise.all([params, searchParams]);
  const access = await getAtlasPageAccess(token);
  if (!access.authorized) redirectToAtlasLogin(`/atlas/grants/${opportunity}/application`);
  const atlasToken = access.emergencyToken;
  const data = await getAtlasData();
  return <main className="founder-shell"><AtlasFounderHeader token={atlasToken} />{!data ? <AdminAccessForm title="Atlas Grant Application Access" /> : <><AtlasFounderHero kicker="Step 3" title="Review the founder-ready application package." subtitle="Atlas prepares the package and stops at the exact founder-only registration, certification, budget, and final submission gate." /><AtlasGrantApplication data={data} opportunityId={opportunity} /></>}</main>;
}
