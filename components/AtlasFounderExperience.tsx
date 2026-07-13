import Link from 'next/link';
import {
  atlasFounderApprovalKeys,
  calculateAtlasForecast,
  calculateAtlasReadinessAssessment,
  calculateUseOfFundsTotal,
  generateAtlasBusinessReadinessReport,
  generateAtlasPackage,
  getLatestAtlasPackage,
  type AtlasData,
  type AtlasWorkflowStageStatus,
} from '@/lib/atlas';
import { BrandLogo } from './BrandLogo';

export type FounderStepId = 'business' | 'funding' | 'documents' | 'review' | 'submit';

export type FounderStep = {
  id: FounderStepId;
  title: string;
  plainTitle: string;
  href: string;
  status: AtlasWorkflowStageStatus | 'needs_attention';
  shortStatus: string;
  detail: string;
};

export function AtlasFounderHeader({ token }: { token: string }) {
  return (
    <header className="founder-topbar">
      <Link href="/" className="brand" aria-label="Nieves Labs home"><BrandLogo size="sm" /></Link>
      <nav className="founder-nav" aria-label="Atlas founder navigation">
        <Link href={`/atlas?token=${encodeURIComponent(token)}`}>Home</Link>
        <Link href={`/atlas/funding-campaign?token=${encodeURIComponent(token)}`}>Funding OS</Link>
        <Link href={`/atlas/journey?token=${encodeURIComponent(token)}`}>My Application</Link>
        <Link href={`/atlas/founder-intake?token=${encodeURIComponent(token)}`}>Founder Intake</Link>
        <Link href={`/atlas/documents?token=${encodeURIComponent(token)}`}>Documents</Link>
        <Link href={`/atlas/opportunities?token=${encodeURIComponent(token)}`}>Funding Options</Link>
        <Link href={`/atlas/review?token=${encodeURIComponent(token)}`}>Review &amp; Submit</Link>
        <Link href={`/atlas/track?token=${encodeURIComponent(token)}`}>Track</Link>
        <Link href={`/atlas/settings?token=${encodeURIComponent(token)}`}>Settings</Link>
      </nav>
    </header>
  );
}

export function AtlasFounderHero({
  kicker = 'My Funding',
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="founder-hero">
      <p className="eyebrow">{kicker}</p>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </section>
  );
}

export function AtlasFounderStepNav({ data, token, active }: { data: AtlasData; token: string; active?: FounderStepId }) {
  return (
    <nav className="founder-step-nav" aria-label="Your funding journey">
      {buildFounderSteps(data, token).map((step, index) => (
        <Link className={active === step.id ? 'active' : ''} href={step.href} key={step.id}>
          <span>{index + 1}</span>
          <strong>{step.plainTitle}</strong>
          <small>{step.shortStatus}</small>
        </Link>
      ))}
    </nav>
  );
}

export function AtlasFounderHome({ data, token }: { data: AtlasData; token: string }) {
  const progress = getFounderProgress(data);
  const next = getNextBestAction(data, token);
  const insight = getAtlasInsight(data);
  const readiness = generateAtlasBusinessReadinessReport(data);
  return (
    <>
      <AtlasFounderHero
        title={`Welcome back, ${data.companyProfile.founderName.split(' ')[0] || 'Tomas'}.`}
        subtitle="Let’s continue getting your business funded. Atlas will keep the process focused and show one clear next step at a time."
      />
      <section className="founder-home-card" aria-labelledby="atlas-current-status">
        <div>
          <p className="eyebrow">Current status</p>
          <h2 id="atlas-current-status">Your application is {progress}% complete.</h2>
          <p>About {estimateTimeRemaining(data)} minutes remaining before your application draft is ready for final review.</p>
        </div>
        <div className="founder-next-action">
          <span>Next best action</span>
          <strong>{next.label}</strong>
          <p>{next.detail}</p>
          <Link className="button-primary" href={next.href}>Continue my application</Link>
        </div>
      </section>
      <section className="founder-simple-panel">
        <div className="review-card-top">
          <div>
            <p className="eyebrow">Your funding journey</p>
            <h2>Five guided steps</h2>
          </div>
          <Link className="button-secondary" href={`/atlas/admin?token=${encodeURIComponent(token)}`}>Advanced view</Link>
        </div>
        <div className="founder-journey-list">
          {buildFounderSteps(data, token).map((step, index) => (
            <Link href={step.href} className="founder-step-card" key={step.id}>
              <span className="founder-step-number">{index + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.detail}</p>
              </div>
              <em>{step.shortStatus}</em>
            </Link>
          ))}
        </div>
      </section>
      <section className="founder-insight">
        <p className="eyebrow">Atlas insight</p>
        <h2>{insight.title}</h2>
        <p>{insight.detail}</p>
      </section>
      <BusinessReadinessPanel data={data} />
      <FounderActionList completed={readiness.completed} actions={readiness.founderActions} />
    </>
  );
}

export function AtlasJourneyScreen({ data, token }: { data: AtlasData; token: string }) {
  return (
    <>
      <AtlasFounderHero
        title="About your business"
        subtitle="Start with the basic story lenders need to understand: who you are, what you are building, and where the business is today."
      />
      <AtlasFounderStepNav data={data} token={token} active="business" />
      <section className="founder-question-card">
        <p className="eyebrow">One thing to confirm</p>
        <h2>Is this company description accurate?</h2>
        <p className="founder-current-value">{data.companyProfile.businessSummary}</p>
        <SourceNote label="Source" value="Current Atlas profile, import-reviewed where available" />
        <div className="founder-decision-row">
          <Link className="button-secondary" href={`/atlas/company-profile?token=${encodeURIComponent(token)}`}>Edit details</Link>
          <Link className="button-primary" href={`/atlas/documents?token=${encodeURIComponent(token)}`}>Looks good. Continue</Link>
        </div>
      </section>
      <GuidedChecklist
        title="What this step covers"
        items={[
          ['Company information', Boolean(data.companyProfile.companyName)],
          ['Founder information', Boolean(data.companyProfile.founderBackground)],
          ['Product information', Boolean(data.companyProfile.productName)],
          ['Business stage', Boolean(data.companyProfile.businessStage)],
        ]}
      />
    </>
  );
}

export function AtlasFounderDocuments({ data, token }: { data: AtlasData; token: string }) {
  const missingDocs = data.documents.filter((document) => document.required && !document.completed);
  const readiness = generateAtlasBusinessReadinessReport(data);
  return (
    <>
      <AtlasFounderHero
        title="Documents"
        subtitle="Atlas can scan approved project documents, extract useful information, and show you only what needs review."
      />
      <AtlasFounderStepNav data={data} token={token} active="documents" />
      <section className="founder-home-card">
        <div>
          <p className="eyebrow">Step 3</p>
          <h2>Review what Atlas found.</h2>
          <p>Atlas has found {data.importState.sourceDocuments.length} source files, mapped {data.importState.importedFields.length} fields, and identified {data.importState.evidenceGaps.length} items that may still need attention.</p>
        </div>
        <div className="founder-next-action">
          <span>Next best action</span>
          <strong>{data.importState.importedFields.length ? 'Review imported information' : 'Scan existing documents'}</strong>
          <p>{missingDocs.length ? `${missingDocs.length} required documents still need evidence.` : 'Required documents are currently marked complete.'}</p>
          <Link className="button-primary" href={`/atlas/import-center?token=${encodeURIComponent(token)}`}>{data.importState.importedFields.length ? 'Review imported information' : 'Scan existing documents'}</Link>
        </div>
      </section>
      <section className="founder-simple-panel">
        <p className="eyebrow">What is still missing</p>
        <h2>{missingDocs.length ? `${missingDocs.length} required items need attention` : 'Required documents look ready'}</h2>
        <div className="founder-status-list">
          {data.documents.filter((document) => document.required).map((document) => (
            <div className="founder-status-row" key={document.id}>
              <span>{document.completed ? 'Ready' : 'Missing'}</span>
              <strong>{document.name}</strong>
              <p>{document.completed ? 'Available for the application package.' : 'Add or confirm this before lender submission.'}</p>
            </div>
          ))}
        </div>
        <details className="founder-details">
          <summary>Show automatic import details</summary>
          <div className="founder-status-list">
            {data.importState.founderReviewQueue.slice(0, 8).map((item) => (
              <div className="founder-status-row" key={item.id}>
                <span>{friendlyStatus(item.status)}</span>
                <strong>{item.label}</strong>
                <p>{item.importedValue} Source: {item.source}</p>
              </div>
            ))}
          </div>
        </details>
      </section>
      <FounderActionList completed={readiness.completed} actions={readiness.founderActions} />
    </>
  );
}

export function AtlasFounderIntake({ data, token }: { data: AtlasData; token: string }) {
  const readiness = generateAtlasBusinessReadinessReport(data);
  const useOfFundsReady = calculateUseOfFundsTotal(data.useOfFundsPlan) === data.useOfFundsPlan.selectedAmount;
  const verifiedDocuments = data.documents.filter((document) => document.completed);
  const missingDocuments = data.documents.filter((document) => document.required && !document.completed);
  const sections = [
    {
      title: 'Business identity',
      completed: [
        valueLine('Business name', data.companyProfile.legalBusinessName || data.companyProfile.companyName),
        valueLine('State', data.companyProfile.stateOfFormation || data.companyProfile.state),
        valueLine('Industry', data.companyProfile.industry),
        valueLine('Website', data.companyProfile.website),
        valueLine('EIN evidence', data.companyProfile.einVerificationStatus === 'verified_document_received' ? `Verified source received (${data.companyProfile.einMasked || 'masked'})` : ''),
      ],
      missing: [
        missingLine('Entity type', data.companyProfile.entityType && !/requires/i.test(data.companyProfile.entityType)),
        missingLine('Formation date', data.companyProfile.formationDate),
        missingLine('Business start date', data.companyProfile.businessStartDate),
        missingLine('Business phone', data.companyProfile.businessPhone),
        missingLine('NAICS code', data.companyProfile.naicsCode && !/requires/i.test(data.companyProfile.naicsCode)),
      ],
    },
    {
      title: 'Founder identity',
      completed: [
        valueLine('Founder', data.companyProfile.founderName),
        valueLine('Role', data.companyProfile.founderEmployment),
        valueLine('Founder background', data.companyProfile.founderBackground),
      ],
      missing: [
        'Founder-only identity fields: SSN, date of birth, driver license/state ID, and credit authorization must be entered only by Tomas on official lender screens.',
      ],
    },
    {
      title: 'Ownership',
      completed: [
        valueLine('Ownership percentage', `${data.companyProfile.ownershipPercent}%`),
      ],
      missing: [
        missingLine('Operating agreement evidence', data.documents.some((document) => document.id === 'operating-agreement' && document.completed)),
      ],
    },
    {
      title: 'Funding request',
      completed: [
        valueLine('Requested amount', money(data.financialAssumptions.loanAmount)),
        valueLine('Preferred funding', data.companyProfile.preferredFundingTypes.join(' / ')),
      ],
      missing: useOfFundsReady ? [] : ['Use-of-funds line items must total the requested amount exactly.'],
    },
    {
      title: 'Business financials',
      completed: [
        valueLine('Starting MRR assumption', money(data.financialAssumptions.startingMrr)),
        valueLine('Average subscription price', money(data.financialAssumptions.averageSubscriptionPrice)),
        valueLine('Loan term', `${data.financialAssumptions.loanTermMonths} months`),
      ],
      missing: [
        'Revenue projections remain planning assumptions until founder and lender review.',
        missingLine('Bank statements', data.documents.some((document) => document.id === 'bank-statements' && document.completed)),
      ],
    },
    {
      title: 'Personal financial statement',
      completed: data.personalFinancialProfile.assets || data.personalFinancialProfile.annualIncome
        ? ['Personal financial values are present and hidden by default.']
        : [],
      missing: [
        'Founder must confirm assets, liabilities, income, contingent liabilities, and debt obligations directly in Atlas before lender use.',
      ],
    },
    {
      title: 'Credit and legal disclosures',
      completed: [
        valueLine('Bankruptcy disclosure status', data.companyProfile.bankruptcyStatus),
      ],
      missing: [
        data.chapterSevenWorkflow.founderApproved ? '' : 'Founder approval is required for Chapter 7 explanation language.',
        'Credit authorization and personal guarantee language must be accepted only by Tomas on lender-controlled screens.',
      ].filter(Boolean),
    },
    {
      title: 'Documents',
      completed: verifiedDocuments.map((document) => `${document.name}: verified or marked available`),
      missing: missingDocuments.map((document) => `${document.name}: missing or awaiting founder upload`),
    },
    {
      title: 'Authorization',
      completed: [
        'Atlas may prepare packages, populate non-sensitive confirmed fields, save drafts, and track status.',
      ],
      missing: [
        'Atlas may not sign, certify, authorize credit, accept guarantees, bypass security, or submit without explicit final founder approval.',
      ],
    },
  ];

  return (
    <>
      <AtlasFounderHero
        title="Founder intake"
        subtitle="Atlas reuses approved information and shows only missing, sensitive, conflicting, or founder-only items before lender submission."
      />
      <AtlasFounderStepNav data={data} token={token} active="business" />
      <section className="founder-home-card">
        <div>
          <p className="eyebrow">Atlas already completed</p>
          <h2>{readiness.completed.length} readiness items are populated or verified.</h2>
          <p>Verified evidence is reused across the application package. Sensitive identity values stay founder-only and are never requested in chat.</p>
        </div>
        <div className="founder-next-action">
          <span>Next best action</span>
          <strong>{readiness.founderActions[0] || 'Review lender package'}</strong>
          <p>{missingDocuments.length ? `${missingDocuments.length} required document items still need attention.` : 'Required document checklist is currently clear.'}</p>
          <Link className="button-primary" href={`/atlas/documents?token=${encodeURIComponent(token)}`}>Review documents</Link>
        </div>
      </section>
      <section className="founder-simple-panel">
        <p className="eyebrow">Missing-only intake</p>
        <h2>One source of truth for lender applications</h2>
        <div className="founder-status-list">
          {sections.map((section) => {
            const missing = section.missing.filter(Boolean);
            const completed = section.completed.filter(Boolean);
            return (
              <div className="founder-status-row" key={section.title}>
                <span>{missing.length ? 'Needs review' : 'Ready'}</span>
                <strong>{section.title}</strong>
                <p>{completed.length ? `Completed: ${completed.slice(0, 3).join(' • ')}` : 'No completed values yet.'}</p>
                {missing.length > 0 && <small>Still needed: {missing.join(' • ')}</small>}
              </div>
            );
          })}
        </div>
      </section>
      <BusinessReadinessPanel data={data} />
      <FounderActionList completed={readiness.completed} actions={readiness.founderActions} />
    </>
  );
}

export function AtlasFounderOpportunities({ data, token }: { data: AtlasData; token: string }) {
  const opportunities = [...data.fundingOpportunities].sort((a, b) => b.fitScore - a.fitScore);
  return (
    <>
      <AtlasFounderHero
        title="Funding options"
        subtitle="Atlas compares possible funding paths and keeps the recommended options easy to review."
      />
      <AtlasFounderStepNav data={data} token={token} active="review" />
      <section className="founder-simple-panel">
        <p className="eyebrow">Recommended options</p>
        <h2>Start with the strongest fit.</h2>
        <div className="founder-lender-list">
          {opportunities.slice(0, 3).map((opportunity) => (
            <article className="founder-lender-card" key={opportunity.id}>
              <span>{opportunity.type}</span>
              <h3>{opportunity.lenderName || opportunity.fundingSource}</h3>
              <p>{opportunity.statusNotes || opportunity.notes}</p>
              <strong>{opportunity.fitScore}/100 fit • {money(opportunity.targetAmount)}</strong>
              <small>Next: {opportunity.nextAction || 'Confirm lender requirements.'}</small>
            </article>
          ))}
        </div>
        <div className="founder-decision-row">
          <Link className="button-secondary" href={`/atlas/lender-comparison?token=${encodeURIComponent(token)}`}>See comparison details</Link>
          <Link className="button-primary" href={`/atlas/review?token=${encodeURIComponent(token)}`}>Review my application</Link>
        </div>
      </section>
    </>
  );
}

export function AtlasFounderReview({ data, token }: { data: AtlasData; token: string }) {
  const latest = getLatestAtlasPackage(data);
  const generated = generateAtlasPackage(data);
  const missingDocs = data.documents.filter((document) => document.required && !document.completed);
  const approvalsMissing = latest ? atlasFounderApprovalKeys.filter((key) => !latest.founderApprovals[key]) : atlasFounderApprovalKeys;
  const readiness = generateAtlasBusinessReadinessReport(data);
  return (
    <>
      <AtlasFounderHero
        title="Review and submit"
        subtitle="Review the application draft, fix missing information, and submit manually through the lender’s official process when ready."
      />
      <AtlasFounderStepNav data={data} token={token} active="submit" />
      <section className="founder-review-summary">
        <SummaryItem label="Funding amount" value={money(data.financialAssumptions.loanAmount)} status="Needs review" />
        <SummaryItem label="Use of funds" value={`${data.companyProfile.primaryUseOfFunds.length} categories`} status={calculateUseOfFundsTotal(data.useOfFundsPlan) === data.useOfFundsPlan.selectedAmount ? 'Ready' : 'Needs review'} />
        <SummaryItem label="Missing documents" value={String(missingDocs.length)} status={missingDocs.length ? 'Missing' : 'Ready'} />
        <SummaryItem label="Founder approvals" value={`${approvalsMissing.length} remaining`} status={approvalsMissing.length ? 'Needs review' : 'Ready'} />
      </section>
      <section className="founder-question-card">
        <p className="eyebrow">Final review</p>
        <h2>Your application draft is ready for founder review.</h2>
        <p>{generated.sections[1]?.[1]}</p>
        <details className="founder-details">
          <summary>Preview package sections</summary>
          <div className="founder-status-list">
            {generated.sections.slice(0, 8).map(([title, body]) => (
              <div className="founder-status-row" key={title}>
                <span>Draft</span>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </details>
        <div className="founder-decision-row">
          <Link className="button-secondary" href={`/atlas/package-generator?token=${encodeURIComponent(token)}`}>Edit application draft</Link>
          <Link className="button-primary" href={`/atlas/track?token=${encodeURIComponent(token)}`}>Continue to tracking</Link>
        </div>
      </section>
      <BusinessReadinessPanel data={data} />
      <section className="founder-simple-panel">
        <p className="eyebrow">Lender rules</p>
        <h2>Requirements that still need confirmation</h2>
        <div className="founder-status-list">
          {readiness.lenderRequirements.map((item) => (
            <div className="founder-status-row" key={`${item.lender}-${item.requirement}`}>
              <span>{item.status}</span>
              <strong>{item.lender}</strong>
              <p>{item.requirement}. Source: {item.source}</p>
            </div>
          ))}
        </div>
      </section>
      <FounderActionList completed={readiness.completed} actions={readiness.founderActions} />
    </>
  );
}

function BusinessReadinessPanel({ data }: { data: AtlasData }) {
  const readiness = generateAtlasBusinessReadinessReport(data);
  const items = [
    ['Business identity', readiness.entityStatus],
    ['EIN confirmation', readiness.einStatus],
    ['Banking readiness', readiness.bankingStatus],
    ['Document consistency', readiness.consistencyStatus],
  ];

  return (
    <section className="founder-simple-panel">
      <p className="eyebrow">Automated checks</p>
      <h2>Business readiness verification</h2>
      <p>Atlas checks approved documents and application data, but it never assumes lender acceptance or official state status without a verified source.</p>
      <section className="founder-review-summary">
        {items.map(([label, status]) => (
          <SummaryItem key={label} label={label} value={status} status={status} />
        ))}
      </section>
      {readiness.conflicts.length > 0 && (
        <div className="founder-status-list">
          {readiness.conflicts.slice(0, 4).map((conflict) => (
            <div className="founder-status-row" key={conflict.id}>
              <span>{conflict.severity}</span>
              <strong>{conflict.label}</strong>
              <p>{conflict.detail}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function FounderActionList({ completed, actions }: { completed: string[]; actions: string[] }) {
  return (
    <section className="founder-simple-panel">
      <p className="eyebrow">Plain-language action list</p>
      <h2>What Atlas found, and what Tomas still needs to do</h2>
      <div className="founder-two-column">
        <div>
          <h3>Atlas completed</h3>
          <ul className="atlas-list">
            {(completed.length ? completed : ['Prepared the funding workspace and reviewed available Atlas records.']).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h3>Tomas still needs to</h3>
          <ol className="atlas-list">
            {(actions.length ? actions : ['Review the final application package before any lender submission.']).map((item) => <li key={item}>{item}</li>)}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function AtlasFounderTrack({ data, token }: { data: AtlasData; token: string }) {
  const latest = getLatestAtlasPackage(data);
  const submitted = latest?.status === 'Submitted';
  const topLender = data.fundingOpportunities.find((opportunity) => opportunity.status !== 'declined');
  return (
    <>
      <AtlasFounderHero
        title={submitted ? 'Track your lender follow-up' : 'Submit to lender when ready'}
        subtitle={submitted ? 'Now Atlas helps you track lender status, follow-up dates, and requested documents.' : 'Atlas prepares your package, but you stay in control of the actual lender submission.'}
      />
      <section className="founder-home-card">
        <div>
          <p className="eyebrow">{submitted ? 'Submitted application' : 'Before submission'}</p>
          <h2>{submitted ? latest.packageName : 'Founder review is still required.'}</h2>
          <p>{submitted ? `Current status: ${latest.status}.` : 'Complete final approvals, confirm documents, and submit through the selected lender’s official process.'}</p>
        </div>
        <div className="founder-next-action">
          <span>Next action</span>
          <strong>{topLender?.nextAction || 'Choose a lender and confirm requirements'}</strong>
          <p>Follow-up: {topLender?.nextFollowUpDate || 'TBD'} • Contact: {topLender?.contactName || topLender?.contact || 'TBD'}</p>
          <Link className="button-primary" href={`/atlas/manual-submission?token=${encodeURIComponent(token)}`}>{submitted ? 'Update tracking' : 'Review submission checklist'}</Link>
        </div>
      </section>
    </>
  );
}

export function AtlasFounderSettings({ token }: { token: string }) {
  return (
    <>
      <AtlasFounderHero
        title="Settings"
        subtitle="Use this area for advanced Atlas views, source details, and internal funding tools when you need them."
      />
      <section className="founder-simple-panel">
        <p className="eyebrow">Advanced tools</p>
        <h2>Internal views remain available.</h2>
        <p>These tools are preserved for admin review, debugging, and detailed lender preparation. The guided experience remains the default.</p>
        <div className="founder-settings-grid">
          <Link href={`/atlas/admin?token=${encodeURIComponent(token)}`}>Advanced Atlas dashboard</Link>
          <Link href={`/atlas/import-center?token=${encodeURIComponent(token)}`}>Document import details</Link>
          <Link href={`/atlas/financial-model?token=${encodeURIComponent(token)}`}>Financial model</Link>
          <Link href={`/atlas/funding-tracker?token=${encodeURIComponent(token)}`}>Funding tracker</Link>
          <Link href={`/atlas/package-generator?token=${encodeURIComponent(token)}`}>Application draft editor</Link>
          <Link href={`/atlas/founder-review?token=${encodeURIComponent(token)}`}>Founder approval checklist</Link>
        </div>
      </section>
    </>
  );
}

export function AtlasWorkingState({ data, token }: { data: AtlasData; token: string }) {
  return (
    <section className="founder-working-state">
      <p className="eyebrow">Atlas Review</p>
      <h2>Atlas is preparing your application.</h2>
      <div className="founder-progress-tasks">
        {[
          ['Reviewing company information', Boolean(data.companyProfile.companyName)],
          ['Checking financial assumptions', data.financialAssumptions.loanAmount > 0],
          ['Comparing lender requirements', data.fundingOpportunities.length > 0],
          ['Building your package', data.packageVersions.length > 0],
        ].map(([label, complete]) => (
          <div className={complete ? 'complete' : ''} key={String(label)}>
            <span>{complete ? 'Done' : 'Working'}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </div>
      <Link className="button-primary" href={`/atlas/review?token=${encodeURIComponent(token)}`}>Review application</Link>
    </section>
  );
}

export function buildFounderSteps(data: AtlasData, token: string): FounderStep[] {
  const applicationAssessment = calculateAtlasReadinessAssessment(data);
  const requiredDocs = data.documents.filter((document) => document.required);
  const missingDocs = requiredDocs.filter((document) => !document.completed);
  const latestPackage = getLatestAtlasPackage(data);
  const approvalsMissing = latestPackage ? atlasFounderApprovalKeys.filter((key) => !latestPackage.founderApprovals[key]).length : atlasFounderApprovalKeys.length;
  return [
    {
      id: 'business',
      title: 'About Your Business',
      plainTitle: 'About',
      href: `/atlas/journey?token=${encodeURIComponent(token)}`,
      status: data.companyProfile.companyName && data.companyProfile.businessSummary ? 'complete' : 'in_progress',
      shortStatus: data.companyProfile.businessSummary ? 'Complete' : 'In progress',
      detail: 'Confirm company, founder, product, and business-stage basics.',
    },
    {
      id: 'funding',
      title: 'Your Funding Request',
      plainTitle: 'Funding',
      href: `/atlas/journey?token=${encodeURIComponent(token)}#funding-request`,
      status: data.financialAssumptions.loanAmount > 0 && data.companyProfile.primaryUseOfFunds.length ? 'complete' : 'needs_attention',
      shortStatus: data.financialAssumptions.loanAmount > 0 ? 'In progress' : 'Needs attention',
      detail: `Review ${money(data.financialAssumptions.loanAmount)} request, use of funds, assumptions, and repayment plan.`,
    },
    {
      id: 'documents',
      title: 'Your Documents',
      plainTitle: 'Documents',
      href: `/atlas/documents?token=${encodeURIComponent(token)}`,
      status: missingDocs.length ? 'needs_attention' : 'complete',
      shortStatus: missingDocs.length ? `${missingDocs.length} missing` : 'Complete',
      detail: 'Let Atlas scan, import, and show only missing or conflicting information.',
    },
    {
      id: 'review',
      title: 'Atlas Review',
      plainTitle: 'Review',
      href: `/atlas/opportunities?token=${encodeURIComponent(token)}`,
      status: applicationAssessment.overallReadiness >= 75 ? 'complete' : 'in_progress',
      shortStatus: applicationAssessment.overallReadiness >= 75 ? 'Ready' : 'In progress',
      detail: 'Atlas checks readiness, evidence gaps, lender fit, and application draft consistency.',
    },
    {
      id: 'submit',
      title: 'Review and Submit',
      plainTitle: 'Submit',
      href: `/atlas/review?token=${encodeURIComponent(token)}`,
      status: approvalsMissing ? 'needs_attention' : 'complete',
      shortStatus: approvalsMissing ? `${approvalsMissing} approvals` : 'Ready',
      detail: 'Review the package, download or copy materials, and submit manually through the lender.',
    },
  ];
}

export function getFounderProgress(data: AtlasData) {
  const steps = buildFounderSteps(data, '');
  const values: number[] = steps.map((step) => step.status === 'complete' ? 100 : step.status === 'in_progress' ? 55 : step.status === 'needs_attention' ? 35 : 0);
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function getNextBestAction(data: AtlasData, token: string) {
  const missingDocs = data.documents.filter((document) => document.required && !document.completed);
  const latest = getLatestAtlasPackage(data);
  if (!data.companyProfile.businessSummary) {
    return { label: 'Confirm your business story', detail: 'Start by reviewing the company description lenders will see.', href: `/atlas/journey?token=${encodeURIComponent(token)}` };
  }
  if (data.financialAssumptions.loanAmount <= 0 || !data.companyProfile.primaryUseOfFunds.length) {
    return { label: 'Complete your funding request', detail: 'Confirm the amount, use of funds, and repayment assumptions.', href: `/atlas/journey?token=${encodeURIComponent(token)}#funding-request` };
  }
  if (missingDocs.length || data.importState.founderReviewQueue.some((item) => item.status === 'pending_review')) {
    return { label: 'Review your documents', detail: 'Atlas found document items that need confirmation.', href: `/atlas/documents?token=${encodeURIComponent(token)}` };
  }
  if (!latest) {
    return { label: 'Prepare your application', detail: 'Atlas can generate an application draft for founder review.', href: `/atlas/review?token=${encodeURIComponent(token)}` };
  }
  return { label: 'Review and submit manually', detail: 'Confirm approvals before submitting through a lender’s official process.', href: `/atlas/review?token=${encodeURIComponent(token)}` };
}

function estimateTimeRemaining(data: AtlasData) {
  const progress = getFounderProgress(data);
  return Math.max(6, Math.round((100 - progress) * 0.42));
}

function getAtlasInsight(data: AtlasData) {
  const conflicts = data.importState.fieldConflicts.length;
  const gaps = data.importState.evidenceGaps.length;
  if (conflicts) return { title: `Atlas found ${conflicts} value that needs your confirmation.`, detail: 'Resolve conflicting information before it appears in lender-facing material.' };
  if (gaps) return { title: `Atlas found ${gaps} missing items.`, detail: 'Focus on the missing items first. The rest of the workflow can stay in the background.' };
  return { title: 'Great progress. Atlas has the core application structure ready.', detail: 'Your next step is to review the draft and confirm the founder approval items.' };
}

function GuidedChecklist({ title, items }: { title: string; items: Array<[string, boolean]> }) {
  return (
    <section className="founder-simple-panel">
      <p className="eyebrow">{title}</p>
      <div className="founder-status-list">
        {items.map(([label, complete]) => (
          <div className="founder-status-row" key={label}>
            <span>{complete ? 'Ready' : 'Missing'}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function SourceNote({ label, value }: { label: string; value: string }) {
  return (
    <p className="founder-source-note"><strong>{label}:</strong> {value}</p>
  );
}

function SummaryItem({ label, value, status }: { label: string; value: string; status: string }) {
  return (
    <article>
      <span>{status}</span>
      <strong>{value}</strong>
      <p>{label}</p>
    </article>
  );
}

function friendlyStatus(status: string) {
  return status.replaceAll('_', ' ');
}

function valueLine(label: string, value: string | number | boolean) {
  const rendered = String(value || '').trim();
  return rendered ? `${label}: ${rendered}` : '';
}

function missingLine(label: string, value: string | number | boolean) {
  return value && String(value).trim() ? '' : `${label} requires founder or source verification.`;
}

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
