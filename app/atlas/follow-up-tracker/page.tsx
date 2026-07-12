import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasFollowUpTracker } from '@/components/AtlasLenderPages';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { env } from '@/lib/env';

export const metadata = { title: 'Follow-up Tracker | Atlas' };

export default async function FollowUpTrackerPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;
  return <main className="site-shell"><AtlasHeader token={token} />{!authorized || !data ? <AdminAccessForm title="Atlas Follow-up Tracker Access" /> : <><AtlasHero token={token} title="Follow-up Tracker" subtitle="Track lender touchpoints, follow-up dates, status notes, and next actions." /><AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, token)} /><AtlasFollowUpTracker data={data} /></>}</main>;
}
