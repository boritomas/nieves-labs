import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasPackageGenerator from '@/components/AtlasPackageGenerator';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { env } from '@/lib/env';

export const metadata = { title: 'Package Generator | Atlas' };

export default async function PackageGeneratorPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;
  return (
    <main className="site-shell">
      <AtlasHeader token={token} />
      {!authorized || !data ? <AdminAccessForm title="Atlas Package Generator Access" /> : (
        <>
          <AtlasHero token={token} title="Package Generator" subtitle="Generate copyable and downloadable lender-ready package sections from existing Atlas data." />
          <AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, token)} />
          <AtlasPackageGenerator initialData={data} token={token} />
        </>
      )}
    </main>
  );
}
