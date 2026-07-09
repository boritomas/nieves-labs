import AdminAccessForm from '@/components/AdminAccessForm';
import AtlasApplicationBuilder from '@/components/AtlasApplicationBuilder';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasApplicationSections } from '@/lib/atlas';
import { env } from '@/lib/env';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Application Builder | Atlas',
};

export default async function ApplicationBuilderPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;
  const sections = data ? buildAtlasApplicationSections(data, token) : [];

  return (
    <main className="site-shell">
      <AtlasHeader token={token} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Application Builder Access" />
      ) : (
        <>
          <AtlasHero token={token} title="Application Builder" subtitle="Guided SBA/CDFI application workspace that turns Atlas data into lender-ready narrative previews for founder review." />
          <AtlasApplicationBuilder initialData={data} initialSections={sections} token={token} />
        </>
      )}
    </main>
  );
}

