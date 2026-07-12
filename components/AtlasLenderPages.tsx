import type { AtlasData, AtlasFundingOpportunity } from '@/lib/atlas';

export function AtlasLenderResearch({ data, token }: { data: AtlasData; token: string }) {
  return (
    <div className="atlas-stack">
      <section className="panel">
        <p className="eyebrow">Research pipeline</p>
        <h2>SBA Microloan, CDFI, grant, and lender candidates</h2>
        <p>Use this view to organize target lenders before deciding which application package to generate. Atlas does not submit applications automatically.</p>
      </section>
      <section className="feature-grid">
        {data.fundingOpportunities.map((opportunity) => <LenderCard key={opportunity.id} opportunity={opportunity} />)}
      </section>
      <a className="button-primary" href={`/atlas/funding-tracker?token=${encodeURIComponent(token)}`}>Edit funding tracker</a>
    </div>
  );
}

export function AtlasLenderComparison({ data }: { data: AtlasData }) {
  return (
    <section className="panel">
      <p className="eyebrow">Compare options</p>
      <h2>Lender comparison</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Lender</th><th>Type</th><th>Target</th><th>Fit</th><th>Status</th><th>Requirements</th><th>Next action</th></tr></thead>
          <tbody>
            {data.fundingOpportunities.map((opportunity) => (
              <tr key={opportunity.id}>
                <td><strong>{opportunity.lenderName || opportunity.fundingSource}</strong><p>{opportunity.website || 'Website TBD'}</p></td>
                <td>{opportunity.type}</td>
                <td>{money(opportunity.targetAmount)}</td>
                <td>{opportunity.fitScore}/100</td>
                <td>{opportunity.status.replaceAll('_', ' ')}</td>
                <td>{opportunity.requirements}</td>
                <td>{opportunity.nextAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function AtlasRequirementMapping({ data }: { data: AtlasData }) {
  const requiredDocuments = data.documents.filter((document) => document.required);
  return (
    <section className="panel">
      <p className="eyebrow">Requirement mapping</p>
      <h2>Lender requirements to document vault</h2>
      <div className="atlas-application-grid">
        {data.fundingOpportunities.filter((opportunity) => opportunity.status !== 'declined').map((opportunity) => (
          <article className="atlas-application-card" key={opportunity.id}>
            <h2>{opportunity.lenderName || opportunity.fundingSource}</h2>
            <p>{opportunity.requirements}</p>
            <div className="atlas-checklist">
              {requiredDocuments.map((document) => (
                <div className={`atlas-check-row ${document.completed ? 'complete' : ''}`} key={`${opportunity.id}-${document.id}`}>
                  <span>{document.completed ? '✓' : ''}</span>
                  <div>
                    <strong>{document.name}</strong>
                    <p>{document.completed ? 'Available for lender package.' : 'Still missing before submission.'}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AtlasManualSubmission({ data }: { data: AtlasData }) {
  const latest = [...data.packageVersions].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const ready = latest?.status === 'Ready' || latest?.status === 'Submitted';
  return (
    <section className="panel">
      <p className="eyebrow">Manual submission only</p>
      <h2>{ready ? 'Founder can proceed with manual submission' : 'Submission is not ready'}</h2>
      <p>Atlas prepares lender materials only. Tomas must review the package, confirm documents, select the lender, and submit through the lender’s official process manually.</p>
      <div className="atlas-checklist compact">
        {[
          ['Package ready', ready],
          ['Founder approvals complete', latest ? Object.values(latest.founderApprovals).every(Boolean) : false],
          ['Required documents complete', data.documents.filter((document) => document.required).every((document) => document.completed)],
          ['Lender selected', Boolean(latest?.targetLender)],
        ].map(([label, complete]) => (
          <div className={`atlas-check-row ${complete ? 'complete' : ''}`} key={String(label)}>
            <span>{complete ? '✓' : ''}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AtlasFollowUpTracker({ data }: { data: AtlasData }) {
  return (
    <section className="panel">
      <p className="eyebrow">Follow-up tracker</p>
      <h2>Lender follow-up plan</h2>
      <div className="atlas-task-list">
        {data.fundingOpportunities.map((opportunity) => (
          <div className="atlas-task-row" key={opportunity.id}>
            <div>
              <strong>{opportunity.lenderName || opportunity.fundingSource}</strong>
              <p>{opportunity.statusNotes || opportunity.notes}</p>
              <p>Last contacted: {opportunity.lastContactedDate || 'not contacted'} • Follow-up: {opportunity.nextFollowUpDate || 'TBD'}</p>
            </div>
            <span className="status-pill ready">{opportunity.status.replaceAll('_', ' ')}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function LenderCard({ opportunity }: { opportunity: AtlasFundingOpportunity }) {
  return (
    <article className="feature-card">
      <p className="eyebrow">{opportunity.type}</p>
      <h3>{opportunity.lenderName || opportunity.fundingSource}</h3>
      <p>{opportunity.statusNotes || opportunity.notes}</p>
      <p><strong>Target:</strong> {money(opportunity.targetAmount)} • <strong>Fit:</strong> {opportunity.fitScore}/100</p>
      <p><strong>Next:</strong> {opportunity.nextAction || 'Confirm lender requirements.'}</p>
    </article>
  );
}

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
