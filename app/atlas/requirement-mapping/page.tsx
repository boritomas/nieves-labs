import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasRequirementMapping } from '@/components/AtlasLenderPages';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';

export const metadata = { title: 'Requirement Mapping | Atlas' };

export default async function RequirementMappingPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/requirement-mapping');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;
  return <main className="site-shell"><AtlasHeader token={atlasToken} />{!authorized || !data ? <AdminAccessForm title="Atlas Requirement Mapping Access" /> : <><AtlasHero token={atlasToken} title="Requirement Mapping" subtitle="Map lender requirements against the document vault before founder submission." /><AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, atlasToken)} /><AtlasRequirementMapping data={data} /></>}</main>;
}
