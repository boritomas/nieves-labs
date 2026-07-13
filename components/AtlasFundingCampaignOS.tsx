import Link from 'next/link';
import { atlasPath, buildAtlasFundingCampaignOS, type AtlasData, type AtlasLenderPlaybookEntry } from '@/lib/atlas';

export default function AtlasFundingCampaignOS({ data, token }: { data: AtlasData; token: string }) {
  const campaign = buildAtlasFundingCampaignOS(data);

  return (
    <>
      <section className="two-column">
        <div className="panel">
          <p className="eyebrow">Current campaign</p>
          <h2>{campaign.currentApplication.lender} application</h2>
          <p>{campaign.currentApplication.status}</p>
          <div className="status-list">
            <span className="status-pill ready">Requested {money(campaign.requestedAmount)}</span>
            <span className="status-pill ready">{campaign.currentApplication.program}</span>
            <span className="status-pill missing">Founder follow-up required</span>
          </div>
          <ul className="atlas-list">
            <li><strong>Application ID:</strong> {campaign.currentApplication.applicationId || 'Not recorded'}</li>
            <li><strong>Submitted:</strong> {campaign.currentApplication.submittedAt || 'Not recorded'}</li>
            <li><strong>Next follow-up:</strong> {campaign.currentApplication.nextFollowUp}</li>
            <li><strong>Evidence:</strong> {campaign.currentApplication.evidence}</li>
          </ul>
          <div className="hero-actions">
            <Link className="button-primary" href={atlasPath('/atlas/follow-up-tracker', token)}>Open follow-up tracker</Link>
            <Link className="button-secondary" href={atlasPath('/atlas/funding-tracker', token)}>Review lender records</Link>
          </div>
        </div>
        <div className="panel">
          <p className="eyebrow">What changed</p>
          <h2>From two days to five steps</h2>
          <p>Atlas now treats lender applications as a campaign operating system: one reusable packet, fast lender triage, safe portal automation, explicit founder checkpoints, and proof-based follow-up.</p>
          <div className="atlas-stack">
            {campaign.founderOnlyFields.slice(0, 4).map((field) => (
              <div className="capability-row" key={field}>
                <span className="atlas-mini-dot" />
                <div>
                  <strong>{field}</strong>
                  <span>Founder-only. Atlas tracks the requirement but does not store or certify it.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Five-step operating flow</p>
        <h2>{campaign.title}</h2>
        <div className="atlas-campaign-steps">
          {campaign.steps.map((step) => (
            <article className={`atlas-campaign-step ${step.status}`} key={step.id}>
              <span>{step.stepNumber}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.outcome}</p>
                <ul className="atlas-list">
                  {step.automation.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <p><strong>Founder checkpoint:</strong> {step.founderCheckpoint}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Campaign memory</p>
        <h2>Resume from the last clean checkpoint</h2>
        <div className="metrics-grid compact">
          <div className="metric-card">
            <span>Stage</span>
            <strong>{data.campaignState.currentStage}</strong>
            <p>{data.campaignState.lastSuccessfulCheckpoint}</p>
          </div>
          <div className="metric-card">
            <span>Founder time</span>
            <strong>{Math.round(data.campaignState.founderTimeMinutes / 60)} hrs</strong>
            <p>{data.campaignState.interruptions} interruptions captured so the next campaign does not repeat them.</p>
          </div>
          <div className="metric-card">
            <span>Reuse rate</span>
            <strong>{data.campaignState.reusableFieldsAutofilledPercent}%</strong>
            <p>{data.campaignState.fieldsCompleted} fields completed; {data.campaignState.fieldsMissing} still require review or lender confirmation.</p>
          </div>
          <div className="metric-card">
            <span>Next retry rule</span>
            <strong>{data.campaignState.decisionStatus.replaceAll('_', ' ')}</strong>
            <p>{data.campaignState.nextRetry}</p>
          </div>
        </div>
      </section>

      <section className="two-column">
        <div className="panel">
          <p className="eyebrow">Lender playbook</p>
          <h2>Reusable decisions</h2>
          <div className="atlas-stack">
            {campaign.lenderPlaybook.map((entry) => (
              <LenderEntry entry={entry} key={entry.lender} />
            ))}
          </div>
        </div>
        <div className="panel">
          <p className="eyebrow">Automation backlog</p>
          <h2>What Atlas should automate next</h2>
          <ul className="atlas-list">
            {campaign.automationBacklog.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="atlas-note">These are product requirements for future Atlas automation. They avoid spoofing, unsafe credential storage, or unauthorized final submission.</p>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Blocked paths preserved</p>
        <h2>Do not repeat these loops</h2>
        <div className="metrics-grid">
          {campaign.blockedPaths.map((entry) => (
            <div className="metric-card" key={entry.lender}>
              <span>{entry.result}</span>
              <strong>{entry.lender}</strong>
              <p>{entry.lesson}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function LenderEntry({ entry }: { entry: AtlasLenderPlaybookEntry }) {
  return (
    <article className="atlas-risk-card">
      <div className="review-card-top">
        <div>
          <strong>{entry.lender}</strong>
          <p>{entry.path}</p>
        </div>
        <span className={`status-pill ${entry.result === 'submitted' || entry.result === 'ready' ? 'ready' : 'missing'}`}>{entry.result}</span>
      </div>
      <p>{entry.lesson}</p>
      <p><strong>Automation rule:</strong> {entry.automationRule}</p>
    </article>
  );
}

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
