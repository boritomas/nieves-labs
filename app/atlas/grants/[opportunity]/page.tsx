import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasFounderHeader, AtlasFounderHero } from '@/components/AtlasFounderExperience';
import { AtlasGrantOpportunityDetail } from '@/components/AtlasGrantOperator';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = { title: 'Grant Opportunity | Atlas' };

export default async function AtlasGrantOpportunityPage({ params, searchParams }: { params: Promise<{ opportunity: string }>; searchParams: Promise<{ token?: string }> }) {
  const [{ opportunity }, { token = '' }] = await Promise.all([params, searchParams]);
  const access = await getAtlasPageAccess(token);
  if (!access.authorized) redirectToAtlasLogin(`/atlas/grants/${opportunity}`);
  const atlasToken = access.emergencyToken;
  const data = await getAtlasData();
  return <main className="founder-shell"><AtlasFounderHeader token={atlasToken} />{!data ? <AdminAccessForm title="Atlas Grant Opportunity Access" /> : <><AtlasFounderHero kicker="Solicitation analysis" title="Analyze official opportunity requirements." subtitle="Atlas extracts eligibility, registrations, documents, budget, compliance, and founder-only gates from official-source records." /><AtlasGrantOpportunityDetail data={data} opportunityId={opportunity} token={atlasToken} /></>}</main>;
}
