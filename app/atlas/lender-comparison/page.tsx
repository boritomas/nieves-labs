import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasLenderComparison } from '@/components/AtlasLenderPages';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';

export const metadata = { title: 'Lender Comparison | Atlas' };

export default async function LenderComparisonPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/lender-comparison');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;
  return <main className="site-shell"><AtlasHeader token={atlasToken} />{!authorized || !data ? <AdminAccessForm title="Atlas Lender Comparison Access" /> : <><AtlasHero token={atlasToken} title="Lender Comparison" subtitle="Compare lender fit, target amount, status, requirements, and next actions." /><AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, atlasToken)} /><AtlasLenderComparison data={data} /></>}</main>;
}
