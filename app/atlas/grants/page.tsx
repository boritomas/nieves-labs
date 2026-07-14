import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasFounderHeader, AtlasFounderHero } from '@/components/AtlasFounderExperience';
import { AtlasGrantHome } from '@/components/AtlasGrantOperator';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = { title: 'Federal Grants | Atlas' };

export default async function AtlasGrantsPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  if (!access.authorized) redirectToAtlasLogin('/atlas/grants');
  const atlasToken = access.emergencyToken;
  const data = await getAtlasData();

  return (
    <main className="founder-shell">
      <AtlasFounderHeader token={atlasToken} />
      {!data ? <AdminAccessForm title="Atlas Grant Access" /> : (
        <>
          <AtlasFounderHero kicker="Federal Grants" title="Atlas finds and prepares grant applications." subtitle="A three-step founder experience for official-source opportunity discovery, solicitation analysis, package generation, and founder-only approval gates." />
          <AtlasGrantHome data={data} token={atlasToken} />
        </>
      )}
    </main>
  );
}
