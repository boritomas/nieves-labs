import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasApplicationBuilder from '@/components/AtlasApplicationBuilder';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasApplicationSections } from '@/lib/atlas';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Application Builder | Atlas',
};

export default async function ApplicationBuilderPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/application-builder');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;
  const sections = data ? buildAtlasApplicationSections(data, atlasToken) : [];

  return (
    <main className="site-shell">
      <AtlasHeader token={atlasToken} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Application Builder Access" />
      ) : (
        <>
          <AtlasHero token={atlasToken} title="Application Builder" subtitle="Guided SBA/CDFI application workspace that turns Atlas data into lender-ready narrative previews for founder review." />
          <AtlasApplicationBuilder initialData={data} initialSections={sections} token={atlasToken} />
        </>
      )}
    </main>
  );
}
