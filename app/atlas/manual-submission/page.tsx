import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasManualSubmission } from '@/components/AtlasLenderPages';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { env } from '@/lib/env';

export const metadata = { title: 'Manual Submission | Atlas' };

export default async function ManualSubmissionPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;
  return <main className="site-shell"><AtlasHeader token={token} />{!authorized || !data ? <AdminAccessForm title="Atlas Manual Submission Access" /> : <><AtlasHero token={token} title="Manual Submission" subtitle="Founder-controlled final submission checklist. Atlas prepares materials only." /><AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, token)} /><AtlasManualSubmission data={data} /></>}</main>;
}
