import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasChapterSevenForm } from '@/components/AtlasProfileForm';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasWorkflowStages, generateChapterSevenExplanations } from '@/lib/atlas';
import { getAtlasData } from '@/lib/atlas-store';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';

export const metadata = { title: 'Chapter 7 Workflow | Atlas' };

export default async function ChapterSevenPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  const authorized = access.authorized;
  if (!authorized) redirectToAtlasLogin('/atlas/chapter-7');
  const atlasToken = access.emergencyToken;
  const data = authorized ? await getAtlasData() : null;
  const explanations = data ? generateChapterSevenExplanations(data) : null;
  return (
    <main className="site-shell">
      <AtlasHeader token={atlasToken} />
      {!authorized || !data || !explanations ? <AdminAccessForm title="Atlas Chapter 7 Access" /> : (
        <>
          <AtlasHero token={atlasToken} title="Chapter 7 Workflow" subtitle="Dedicated explanation, supporting-document, and founder-approval workflow for lender underwriting review." />
          <AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, atlasToken)} />
          <AtlasChapterSevenForm initialWorkflow={data.chapterSevenWorkflow} token={atlasToken} />
          <section className="review-card-grid">
            <article className="panel"><p className="eyebrow">Short explanation</p><p>{explanations.short}</p></article>
            <article className="panel"><p className="eyebrow">Standard explanation</p><p>{explanations.standard}</p></article>
            <article className="panel"><p className="eyebrow">Detailed lender letter</p><pre className="atlas-preview">{explanations.detailed}</pre></article>
          </section>
        </>
      )}
    </main>
  );
}
