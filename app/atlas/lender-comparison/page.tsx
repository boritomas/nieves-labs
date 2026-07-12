import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasLenderComparison } from '@/components/AtlasLenderPages';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { env } from '@/lib/env';

export const metadata = { title: 'Lender Comparison | Atlas' };

export default async function LenderComparisonPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;
  return <main className="site-shell"><AtlasHeader token={token} />{!authorized || !data ? <AdminAccessForm title="Atlas Lender Comparison Access" /> : <><AtlasHero token={token} title="Lender Comparison" subtitle="Compare lender fit, target amount, status, requirements, and next actions." /><AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, token)} /><AtlasLenderComparison data={data} /></>}</main>;
}
