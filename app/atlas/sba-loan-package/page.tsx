import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { env } from '@/lib/env';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'SBA Loan Package | Atlas',
};

export default async function SbaLoanPackagePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;

  const sections = data ? [
    ['Business summary', data.companyProfile.businessSummary],
    ['Funding request', data.companyProfile.fundingRequest],
    ['Use of funds', data.companyProfile.useOfFunds],
    ['Revenue assumptions', data.companyProfile.revenueAssumptions],
    ['Repayment strategy', data.companyProfile.repaymentStrategy],
    ['Founder background', data.companyProfile.founderBackground],
    ['Risk mitigation', data.companyProfile.riskMitigation],
    ['Chapter 7 explanation section', data.companyProfile.chapterSevenExplanation],
  ] : [];

  return (
    <main className="site-shell">
      <AtlasHeader token={token} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas SBA Loan Package Access" />
      ) : (
        <>
          <AtlasHero token={token} title="SBA Loan Package" subtitle="Lender-ready narrative workspace for the Nieves Labs SBA Microloan / CDFI capital package." />
          <section className="review-card-grid">
            {sections.map(([title, body]) => (
              <article className="panel" key={title}>
                <p className="eyebrow">{title}</p>
                <h2>{title}</h2>
                <p>{body}</p>
              </article>
            ))}
          </section>
          <section className="panel">
            <h2>Supporting documents checklist</h2>
            <div className="atlas-checklist compact">
              {data.documents.map((document) => (
                <div className={`atlas-check-row ${document.completed ? 'complete' : ''}`} key={document.id}>
                  <span>{document.completed ? '✓' : ''}</span>
                  <div>
                    <strong>{document.name}</strong>
                    <p>{document.completed ? 'Ready for packet review.' : 'Missing or pending final upload.'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
