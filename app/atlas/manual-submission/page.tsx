import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasManualSubmission } from '@/components/AtlasLenderPages';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';

export const metadata = { title: 'Manual Submission | Atlas' };

export default async function ManualSubmissionPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/manual-submission');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;
  return <main className="site-shell"><AtlasHeader token={atlasToken} />{!authorized || !data ? <AdminAccessForm title="Atlas Manual Submission Access" /> : <><AtlasHero token={atlasToken} title="Manual Submission" subtitle="Founder-controlled final submission checklist. Atlas prepares materials only." /><AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, atlasToken)} /><AtlasManualSubmission data={data} /></>}</main>;
}
