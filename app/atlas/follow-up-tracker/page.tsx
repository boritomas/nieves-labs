import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasFollowUpTracker } from '@/components/AtlasLenderPages';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';

export const metadata = { title: 'Follow-up Tracker | Atlas' };

export default async function FollowUpTrackerPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/follow-up-tracker');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;
  return <main className="site-shell"><AtlasHeader token={atlasToken} />{!authorized || !data ? <AdminAccessForm title="Atlas Follow-up Tracker Access" /> : <><AtlasHero token={atlasToken} title="Follow-up Tracker" subtitle="Track lender touchpoints, follow-up dates, status notes, and next actions." /><AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, atlasToken)} /><AtlasFollowUpTracker data={data} /></>}</main>;
}
