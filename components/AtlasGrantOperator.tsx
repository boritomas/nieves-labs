import Link from 'next/link';
import {
  atlasPath,
  generateAtlasGrantApplicationMarkdown,
  generateAtlasNsfProjectPitchMarkdown,
  getAtlasGrantProfileSummary,
  reconcileAtlasDocuments,
  type AtlasData,
  type AtlasGrantOpportunity,
} from '@/lib/atlas';

export function AtlasGrantHome({ data, token }: { data: AtlasData; token: string }) {
  const grant = data.grantOperator;
  const summary = getAtlasGrantProfileSummary(data);
  const reconciliation = reconcileAtlasDocuments(data, token);
  return (
    <div className="atlas-stack">
      <section className="founder-home-card">
        <div>
          <p className="eyebrow">Federal Grant Operator</p>
          <h2>Three steps to a founder-ready grant package.</h2>
          <p>Atlas reuses the company profile, founder profile, document vault, financial model, product portfolio, and funding-package memory before asking Tomas anything.</p>
        </div>
        <div className="founder-next-action">
          <span>Next founder action</span>
          <strong>{summary.nextFounderAction}</strong>
          <p>{summary.exactFounderGate}</p>
          <Link className="button-primary" href={atlasPath('/atlas/grants/project-pitch', token)}>Review NSF pitch</Link>
        </div>
      </section>

      <section className="founder-step-nav" aria-label="Atlas grant flow">
        {[
          ['1', 'Confirm business', grant.grantProfileStatus],
          ['2', 'Pick opportunity', `${grant.opportunities.length} official-source records ranked`],
          ['3', 'Approve Project Pitch', grant.nsfProjectPitch.status.replaceAll('_', ' ')],
        ].map(([step, title, detail]) => (
          <Link key={step} href={atlasPath(step === '2' ? '/atlas/grants/opportunities' : step === '3' ? '/atlas/grants/project-pitch' : '/atlas/grants/profile', token)}>
            <span>{step}</span>
            <strong>{title}</strong>
            <small>{detail}</small>
          </Link>
        ))}
      </section>

      <section className="metrics-grid">
        <Metric label="Federal grant applications submitted" value={String(grant.federalGrantApplicationsSubmitted)} />
        <Metric label="Submission evidence" value={grant.submissionEvidence.length ? `${grant.submissionEvidence.length} record(s)` : 'None'} />
        <Metric label="NSF gate" value={grant.nsfProjectPitch.projectPitchRequired ? 'Project Pitch required' : 'Verify'} />
        <Metric label="Full Phase I proposal" value={grant.nsfProjectPitch.fullProposalInvitationRequired ? 'Invitation required' : 'Verify'} />
      </section>

      <section className="two-column">
        <div className="panel">
          <p className="eyebrow">Atlas already knows</p>
          <h2>Company profile is reusable</h2>
          <div className="atlas-checklist compact">
            {[
              ['Company', data.companyProfile.companyName],
              ['Founder', data.companyProfile.founderName],
              ['EIN evidence', data.companyProfile.einVerificationStatus === 'verified_document_received' ? 'Verified metadata present' : 'Needs verification'],
              ['Documents', `${reconciliation.documentsCompleteCount}/${reconciliation.documentsTotalCount} reconciled`],
              ['Product portfolio', data.companyProfile.productName],
              ['Funding package memory', `${data.packageVersions.length} package version(s)`],
            ].map(([label, value]) => (
              <div className="atlas-check-row complete" key={label}>
                <span>✓</span>
                <div><strong>{label}</strong><p>{value}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <p className="eyebrow">Still needs founder/account-holder action</p>
          <h2>{grant.registrations.filter((item) => item.status !== 'verified' && item.status !== 'not_applicable').length} registration gates</h2>
          <div className="atlas-stack">
            {grant.registrations.slice(0, 5).map((item) => (
              <div className="capability-row" key={item.id}>
                <span className="atlas-mini-dot" />
                <div>
                  <strong>{item.name}: {item.status.replaceAll('_', ' ')}</strong>
                  <span>{item.missingAction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Top recommendation</p>
        <OpportunitySummary opportunity={summary.selected} token={token} />
        <div className="hero-actions">
          <Link className="button-primary" href={atlasPath('/atlas/grants/project-pitch', token)}>Open Project Pitch</Link>
          <Link className="button-secondary" href={atlasPath('/atlas/grants/track', token)}>Submission tracking</Link>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Operator activity</p>
        <h2>Real grant actions completed</h2>
        <div className="atlas-stack">
          {grant.activityFeed.map((activity) => (
            <div className="capability-row" key={activity.id}>
              <span className="atlas-mini-dot" />
              <div>
                <strong>{activity.status}: {activity.label}</strong>
                <span>{activity.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AtlasNsfProjectPitchReview({ data, token }: { data: AtlasData; token: string }) {
  const grant = data.grantOperator;
  const pitch = grant.nsfProjectPitch;
  const markdown = generateAtlasNsfProjectPitchMarkdown(data);
  const selectedConcept = pitch.conceptScores.find((item) => item.id === pitch.selectedConceptId) || pitch.conceptScores[0];
  return (
    <div className="atlas-stack">
      <section className="founder-home-card">
        <div>
          <p className="eyebrow">NSF Project Pitch</p>
          <h2>{pitch.projectTitle}</h2>
          <p>Atlas prepared the truthful Project Pitch package, but no federal grant application has been submitted. NSF requires founder approval, portal access, and an invitation before any full Phase I proposal.</p>
        </div>
        <div className="founder-next-action">
          <span>Current evidence status</span>
          <strong>{grant.federalGrantApplicationsSubmitted} federal grant applications submitted</strong>
          <p>{grant.submissionEvidence.length ? `${grant.submissionEvidence.length} evidence record(s) captured.` : 'Submission evidence: none.'}</p>
          <a className="button-primary" href="https://seedfund.nsf.gov/apply/project-pitch/" target="_blank" rel="noreferrer">Official NSF pitch portal</a>
        </div>
      </section>

      <section className="metrics-grid">
        <Metric label="Project Pitch required" value={pitch.projectPitchRequired ? 'YES' : 'VERIFY'} />
        <Metric label="Full proposal invitation" value={pitch.fullProposalInvitationRequired ? 'REQUIRED' : 'VERIFY'} />
        <Metric label="Pitch status" value={pitch.status.replaceAll('_', ' ')} />
        <Metric label="Selected concept score" value={`${selectedConcept.totalScore}/160`} />
      </section>

      <section className="panel">
        <p className="eyebrow">Official process</p>
        <h2>Verified NSF route</h2>
        <p><strong>Program:</strong> {pitch.applicableProgram}</p>
        <p><strong>Submission route:</strong> {pitch.submissionRoute}</p>
        <p><strong>Last verified:</strong> {pitch.lastVerifiedDate}</p>
        <ul>{pitch.officialSources.map((source) => <li key={source}><a href={source} target="_blank" rel="noreferrer">{source}</a></li>)}</ul>
      </section>

      <section className="panel">
        <p className="eyebrow">Registration preflight</p>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Item</th><th>Status</th><th>Evidence</th><th>Founder-only action</th></tr></thead>
            <tbody>
              {grant.registrations.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.status.replaceAll('_', ' ')}</td>
                  <td>{item.verificationStatus}</td>
                  <td>{item.founderOnlyStep || item.missingAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Concept selection</p>
        <h2>Selected: {selectedConcept.concept}</h2>
        <p>{selectedConcept.rationale}</p>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Concept</th><th>Score</th><th>Recommendation</th><th>Rationale</th></tr></thead>
            <tbody>
              {pitch.conceptScores.map((concept) => (
                <tr key={concept.id}>
                  <td><strong>{concept.concept}</strong></td>
                  <td>{concept.totalScore}/160</td>
                  <td>{concept.recommendation}</td>
                  <td>{concept.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Founder approval gate</p>
        <h2>Atlas must stop before submission</h2>
        <p>Required approval phrase: <strong>{pitch.requiredFounderApprovalPhrase}</strong></p>
        <p>{pitch.finalSubmissionAction}</p>
        <div className="status-list">
          <span className="status-pill missing">Do not submit without founder approval</span>
          <span className="status-pill missing">No confirmation number yet</span>
          <span className="status-pill ready">Pitch text prepared</span>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Exact text for portal review</p>
        <pre className="atlas-preview">{markdown}</pre>
      </section>

      <section className="hero-actions">
        <Link className="button-secondary" href={atlasPath(`/atlas/grants/${grant.selectedOpportunityId}/application`, token)}>View package record</Link>
        <Link className="button-secondary" href={atlasPath('/atlas/grants/track', token)}>Track submission evidence</Link>
      </section>
    </div>
  );
}

export function AtlasGrantProfile({ data }: { data: AtlasData }) {
  const grant = data.grantOperator;
  return (
    <div className="atlas-stack">
      <section className="panel">
        <p className="eyebrow">Step 1</p>
        <h2>Confirm what Atlas already knows</h2>
        <p>{grant.grantProfileStatus}</p>
      </section>
      <section className="metrics-grid">
        <Metric label="Registrations known" value={`${grant.registrations.filter((item) => item.status === 'verified' || item.status === 'requires_founder').length}/${grant.registrations.length}`} />
        <Metric label="Reuse percentage" value={`${grant.reusePercentage}%`} />
        <Metric label="Duplicate questions" value={String(grant.duplicateQuestionCount)} />
        <Metric label="Founder time budget" value={`${grant.founderTimeMinutes} min`} />
      </section>
      <section className="panel">
        <p className="eyebrow">Registration manager</p>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Registration</th><th>Status</th><th>Founder-only step</th><th>Time</th></tr></thead>
            <tbody>
              {grant.registrations.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.name}</strong><p>{item.source}</p></td>
                  <td>{item.status.replaceAll('_', ' ')}</td>
                  <td>{item.founderOnlyStep || item.missingAction}</td>
                  <td>{item.estimatedCompletionMinutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function AtlasGrantOpportunities({ data, token }: { data: AtlasData; token: string }) {
  const grant = data.grantOperator;
  const pursue = grant.opportunities.filter((item) => item.pursueRecommendation === 'Pursue now');
  const monitor = grant.opportunities.filter((item) => item.pursueRecommendation === 'Monitor');
  const excluded = grant.opportunities.filter((item) => item.pursueRecommendation === 'Do not pursue');
  return (
    <div className="atlas-stack">
      <section className="panel">
        <p className="eyebrow">Step 2</p>
        <h2>Atlas found {grant.opportunitiesFound} official-source matches and shortlisted {grant.opportunities.length}.</h2>
        <p>{grant.opportunitiesExcluded} low-fit or unrelated records were hidden by default. Sources searched: {grant.officialSourcesSearched.join(', ')}.</p>
      </section>
      <OpportunityGroup title="Pursue now" opportunities={pursue} token={token} />
      <OpportunityGroup title="Monitor" opportunities={monitor} token={token} />
      <OpportunityGroup title="Not recommended" opportunities={excluded} token={token} />
    </div>
  );
}

export function AtlasGrantOpportunityDetail({ data, opportunityId, token }: { data: AtlasData; opportunityId: string; token: string }) {
  const opportunity = data.grantOperator.opportunities.find((item) => item.id === opportunityId) || data.grantOperator.opportunities[0];
  return (
    <div className="atlas-stack">
      <section className="panel">
        <p className="eyebrow">Official opportunity</p>
        <OpportunitySummary opportunity={opportunity} token={token} />
      </section>
      <section className="two-column">
        <div className="panel">
          <p className="eyebrow">Why it fits</p>
          <h2>{opportunity.fitOutcome} • {opportunity.fitScore}/100</h2>
          <p>{opportunity.fitRationale}</p>
          <h3>Evidence</h3>
          <p>{opportunity.topicFit}</p>
        </div>
        <div className="panel">
          <p className="eyebrow">Risks and missing evidence</p>
          <ul>{opportunity.concerns.map((item) => <li key={item}>{item}</li>)}</ul>
          <ul>{opportunity.missingEvidence.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>
      <section className="panel">
        <p className="eyebrow">Solicitation extraction</p>
        <div className="table-wrap">
          <table>
            <tbody>
              {[
                ['Eligibility', opportunity.eligibility],
                ['Required registrations', opportunity.requiredRegistrations.join(', ')],
                ['Required forms', opportunity.requiredForms.join(', ')],
                ['Required attachments', opportunity.requiredAttachments.join(', ')],
                ['Page limits', opportunity.pageLimits],
                ['Formatting', opportunity.formattingRules],
                ['Evaluation criteria', opportunity.evaluationCriteria.join(', ')],
                ['Portal', opportunity.submissionPortal],
              ].map(([label, value]) => <tr key={label}><th>{label}</th><td>{value}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function AtlasGrantApplication({ data, opportunityId }: { data: AtlasData; opportunityId: string }) {
  const grant = data.grantOperator;
  const opportunity = grant.opportunities.find((item) => item.id === opportunityId) || grant.opportunities[0];
  const pkg = grant.selectedPackage;
  const markdown = generateAtlasGrantApplicationMarkdown(data);
  const total = pkg.budget.reduce((sum, item) => sum + item.amount, 0);
  return (
    <div className="atlas-stack">
      <section className="panel">
        <p className="eyebrow">Step 3</p>
        <h2>{pkg.packageName}</h2>
        <p>{pkg.furthestSafePoint}</p>
        <div className="status-list">
          <span className="status-pill ready">Readiness {pkg.readinessScore}%</span>
          <span className="status-pill missing">{pkg.founderOnlyGaps.length} founder gates</span>
          <span className="status-pill ready">Budget draft {money(total)}</span>
        </div>
      </section>
      <section className="two-column">
        <div className="panel">
          <p className="eyebrow">Selected opportunity</p>
          <h2>{opportunity.opportunityNumber}</h2>
          <p>{opportunity.title}</p>
          <p><strong>Deadline:</strong> {opportunity.deadline} {opportunity.deadlineTimeZone}</p>
          <p><strong>Portal:</strong> {pkg.applicationPortal}</p>
        </div>
        <div className="panel">
          <p className="eyebrow">Founder-only gaps</p>
          <ul>{pkg.founderOnlyGaps.map((gap) => <li key={gap}>{gap}</li>)}</ul>
        </div>
      </section>
      <section className="panel">
        <p className="eyebrow">Compliance checklist</p>
        <div className="atlas-checklist">
          {pkg.complianceChecklist.map((item) => (
            <div className={`atlas-check-row ${item.status === 'complete' || item.status === 'can_generate' ? 'complete' : ''}`} key={item.id}>
              <span>{item.status === 'complete' || item.status === 'can_generate' ? '✓' : ''}</span>
              <div>
                <strong>{item.requirement}</strong>
                <p>{item.atlasResolution}</p>
                {item.founderAction && <p><strong>Founder:</strong> {item.founderAction}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="panel">
        <p className="eyebrow">Draft application package</p>
        <pre className="atlas-preview">{markdown}</pre>
      </section>
    </div>
  );
}

export function AtlasGrantTracking({ data }: { data: AtlasData }) {
  const grant = data.grantOperator;
  return (
    <div className="atlas-stack">
      <section className="panel">
        <p className="eyebrow">Grant tracking</p>
        <h2>{grant.selectedPackage.submissionStatus}</h2>
        <p>Confirmation number: {grant.selectedPackage.confirmationNumber || 'Not applicable until founder-approved submission.'}</p>
        <p>Federal grant applications submitted: {grant.federalGrantApplicationsSubmitted}</p>
        <p>Submission evidence: {grant.submissionEvidence.length ? `${grant.submissionEvidence.length} record(s)` : 'None'}</p>
        <p>Follow-up date: {grant.selectedPackage.followUpDate}</p>
      </section>
      <section className="panel">
        <p className="eyebrow">Learning loop</p>
        <ul>{grant.selectedPackage.learningRecords.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
      <section className="panel">
        <p className="eyebrow">Competitor and differentiation findings</p>
        <div className="feature-grid">
          {grant.competitors.map((item) => (
            <article className="feature-card" key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.category} • {item.targetCustomer}</p>
              <p><strong>Strength:</strong> {item.strengths}</p>
              <p><strong>Gap:</strong> {item.differentiationOpportunity}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function OpportunityGroup({ title, opportunities, token }: { title: string; opportunities: AtlasGrantOpportunity[]; token: string }) {
  if (!opportunities.length) return null;
  return (
    <section className="panel">
      <p className="eyebrow">{title}</p>
      <div className="feature-grid">
        {opportunities.map((opportunity) => <OpportunitySummary key={opportunity.id} opportunity={opportunity} token={token} />)}
      </div>
    </section>
  );
}

function OpportunitySummary({ opportunity, token }: { opportunity: AtlasGrantOpportunity; token: string }) {
  return (
    <article className="feature-card">
      <p className="eyebrow">{opportunity.agency}</p>
      <h3>{opportunity.program}</h3>
      <p>{opportunity.title}</p>
      <p><strong>Opportunity:</strong> {opportunity.opportunityNumber} • <strong>Deadline:</strong> {opportunity.deadline || 'Rolling/verify'} {opportunity.deadlineTimeZone}</p>
      <p><strong>Award:</strong> {opportunity.awardMaximum ? `Up to ${money(opportunity.awardMaximum)}` : 'Amount requires verification'}</p>
      <p><strong>Fit:</strong> {opportunity.fitOutcome} ({opportunity.fitScore}/100)</p>
      <p>{opportunity.recommendedAction}</p>
      <div className="hero-actions">
        <Link className="button-primary" href={atlasPath(`/atlas/grants/${opportunity.id}`, token)}>Analyze</Link>
        <a className="button-secondary" href={opportunity.officialUrl} target="_blank" rel="noreferrer">Official source</a>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="metric-card"><span>{label}</span><strong>{value}</strong></div>;
}

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
