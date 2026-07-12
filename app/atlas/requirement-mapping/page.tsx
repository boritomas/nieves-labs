import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasRequirementMapping } from '@/components/AtlasLenderPages';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { env } from '@/lib/env';

export const metadata = { title: 'Requirement Mapping | Atlas' };

export default async function RequirementMappingPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;
  return <main className="site-shell"><AtlasHeader token={token} />{!authorized || !data ? <AdminAccessForm title="Atlas Requirement Mapping Access" /> : <><AtlasHero token={token} title="Requirement Mapping" subtitle="Map lender requirements against the document vault before founder submission." /><AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, token)} /><AtlasRequirementMapping data={data} /></>}</main>;
}
