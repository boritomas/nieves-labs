import Link from 'next/link';
import AdminAccessForm from '@/components/AdminAccessForm';
import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { buildAtlasApplicationSections, calculateAtlasForecast } from '@/lib/atlas';
import { env } from '@/lib/env';
import { getAtlasData } from '@/lib/atlas-store';

export const metadata = {
  title: 'Founder Review | Atlas',
};

export default async function FounderReviewPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const authorized = Boolean(env.adminToken && token === env.adminToken);
  const data = authorized ? await getAtlasData() : null;
  const sections = data ? buildAtlasApplicationSections(data, token) : [];
  const forecast = data ? calculateAtlasForecast(data.financialAssumptions) : null;
  const selectedLender = data?.fundingOpportunities.find((opportunity) => ['preparing', 'submitted', 'follow_up', 'approved'].includes(opportunity.status)) || data?.fundingOpportunities[0];

  const checklist = data && forecast ? [
    ['Confirm funding amount', `${money(data.financialAssumptions.loanAmount)} modeled request within ${money(data.companyProfile.fundingTargetMin)}-${money(data.companyProfile.fundingTargetMax)} target range.`, data.financialAssumptions.loanAmount >= data.companyProfile.fundingTargetMin && data.financialAssumptions.loanAmount <= data.companyProfile.fundingTargetMax],
    ['Confirm use of funds', data.companyProfile.primaryUseOfFunds.join(', '), data.companyProfile.primaryUseOfFunds.length > 0],
    ['Confirm revenue assumptions', `${data.companyProfile.firstNinetyDayMrrEstimate} first 90 days; ${data.companyProfile.sixMonthMrrTarget} six-month target.`, data.financialAssumptions.startingMrr > 0],
    ['Confirm bankruptcy explanation', data.companyProfile.chapterSevenExplanation, data.companyProfile.chapterSevenExplanation.length > 60],
    ['Confirm documents attached', `${data.documents.filter((document) => document.completed).length}/${data.documents.length} documents marked complete.`, data.documents.every((document) => !document.required || document.completed)],
    ['Confirm lender selected', selectedLender ? `${selectedLender.lenderName || selectedLender.fundingSource} (${selectedLender.type})` : 'No lender selected.', Boolean(selectedLender)],
    ['Confirm repayment assumptions', `${money(forecast.monthlyLoanPayment)} estimated monthly payment; coverage indicator: ${forecast.repaymentCoverage}.`, forecast.repaymentCoverage !== 'weak'],
  ] : [];

  return (
    <main className="site-shell">
      <AtlasHeader token={token} />
      {!authorized || !data ? (
        <AdminAccessForm title="Atlas Founder Review Access" />
      ) : (
        <>
          <AtlasHero token={token} title="Founder Review" subtitle="Final founder-facing checklist before any SBA, CDFI, grant, or lender materials are submitted manually." />
          <section className="panel consultation-panel">
            <p className="eyebrow">Manual submission required</p>
            <h2>Atlas prepares materials. It does not submit applications.</h2>
            <p>Tomas Nieves must review, edit, approve, and submit any lender or grant application manually. No Atlas workflow should be treated as automatic lender submission or legal/financial advice.</p>
            <div className="hero-actions">
              <Link className="button-primary" href={`/atlas/application-builder?token=${encodeURIComponent(token)}`}>Review Application Builder</Link>
              <Link className="button-secondary" href={`/atlas/funding-tracker?token=${encodeURIComponent(token)}`}>Select Lender</Link>
            </div>
          </section>
          <section className="atlas-review-list">
            {checklist.map(([title, body, ready]) => (
              <article className={`panel atlas-founder-review-card ${ready ? 'complete' : ''}`} key={String(title)}>
                <span className={`status-pill ${ready ? 'ready' : 'missing'}`}>{ready ? 'ready for review' : 'needs review'}</span>
                <h2>{title}</h2>
                <p>{body}</p>
              </article>
            ))}
          </section>
          <section className="panel">
            <h2>Application section status</h2>
            <div className="atlas-checklist compact">
              {sections.map((section) => (
                <div className={`atlas-check-row ${section.completionStatus === 'complete' ? 'complete' : ''}`} key={section.id}>
                  <span>{section.completionStatus === 'complete' ? '✓' : ''}</span>
                  <div>
                    <strong>{section.title}</strong>
                    <p>{section.completionStatus.replaceAll('_', ' ')}{section.missingFields.length ? `: ${section.missingFields.join(', ')}` : ''}</p>
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

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

