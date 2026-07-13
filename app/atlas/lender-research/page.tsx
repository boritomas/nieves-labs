import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasLenderResearch } from '@/components/AtlasLenderPages';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';

export const metadata = { title: 'Lender Research | Atlas' };

export default async function LenderResearchPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/lender-research');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;
  return <main className="site-shell"><AtlasHeader token={atlasToken} />{!authorized || !data ? <AdminAccessForm title="Atlas Lender Research Access" /> : <><AtlasHero token={atlasToken} title="Lender Research" subtitle="Research SBA Microloan intermediaries, CDFIs, grants, bank loans, investors, and accelerators." /><AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, atlasToken)} /><AtlasLenderResearch data={data} token={atlasToken} /></>}</main>;
}
