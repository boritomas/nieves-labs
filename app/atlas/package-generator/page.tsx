import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasPackageGenerator from '@/components/AtlasPackageGenerator';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';

export const metadata = { title: 'Package Generator | Atlas' };

export default async function PackageGeneratorPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/package-generator');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;
  return (
    <main className="site-shell">
      <AtlasHeader token={atlasToken} />
      {!authorized || !data ? <AdminAccessForm title="Atlas Package Generator Access" /> : (
        <>
          <AtlasHero token={atlasToken} title="Package Generator" subtitle="Generate copyable and downloadable lender-ready package sections from existing Atlas data." />
          <AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, atlasToken)} />
          <AtlasPackageGenerator initialData={data} token={atlasToken} />
        </>
      )}
    </main>
  );
}
