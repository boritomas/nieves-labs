import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasLenderResearch } from '@/components/AtlasLenderPages';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { env } from '@/lib/env';

export const metadata = { title: 'Lender Research | Atlas' };

export default async function LenderResearchPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;
  return <main className="site-shell"><AtlasHeader token={token} />{!authorized || !data ? <AdminAccessForm title="Atlas Lender Research Access" /> : <><AtlasHero token={token} title="Lender Research" subtitle="Research SBA Microloan intermediaries, CDFIs, grants, bank loans, investors, and accelerators." /><AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, token)} /><AtlasLenderResearch data={data} token={token} /></>}</main>;
}
