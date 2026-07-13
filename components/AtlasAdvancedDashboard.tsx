import Link from 'next/link';
import AtlasReadinessBreakdown from '@/components/AtlasReadinessBreakdown';
import AtlasWorkflowProgress from '@/components/AtlasWorkflowProgress';
import { buildAtlasWorkflowStages, getLatestAtlasPackage, atlasFounderApprovalKeys, type AtlasData } from '@/lib/atlas';

export default function AtlasAdvancedDashboard({ data, token }: { data: AtlasData; token: string }) {
  const latestPackage = getLatestAtlasPackage(data);

  return (
    <>
      <AtlasWorkflowProgress stages={buildAtlasWorkflowStages(data, token)} />
      <section className="metrics-grid">
        <Metric label="Capital readiness" value={`${data.readinessScores.capitalReadiness}%`} />
        <Metric label="Product readiness" value={`${data.readinessScores.productReadiness}%`} />
        <Metric label="Documentation readiness" value={`${data.readinessScores.documentationReadiness}%`} />
        <Metric label="Application readiness" value={`${data.readinessScores.applicationReadiness}%`} />
        <Metric label="Overall readiness" value={`${data.readinessScores.overallReadiness}%`} />
        <Metric label="Funding target" value={`${money(data.companyProfile.fundingTargetMin)}-${money(data.companyProfile.fundingTargetMax)}`} />
      </section>

      <AtlasReadinessBreakdown scores={data.readinessScores} />

      <section className="two-column">
        <div className="panel">
          <p className="eyebrow">Current stage</p>
          <h2>{data.companyProfile.currentStage}</h2>
          <p>{data.companyProfile.nextAction}</p>
          <div className="hero-actions">
            <Link className="button-primary" href={`/atlas/sba-loan-package?token=${encodeURIComponent(token)}`}>Open SBA Package</Link>
            <Link className="button-secondary" href={`/atlas/funding-campaign?token=${encodeURIComponent(token)}`}>Open Campaign OS</Link>
            <Link className="button-secondary" href={`/atlas/document-vault?token=${encodeURIComponent(token)}`}>Review Documents</Link>
            <Link className="button-secondary" href={`/atlas/application-builder?token=${encodeURIComponent(token)}`}>Build Application</Link>
            <Link className="button-secondary" href={`/atlas/package-generator?token=${encodeURIComponent(token)}`}>Generate Package</Link>
            <Link className="button-secondary" href={`/atlas/import-center?token=${encodeURIComponent(token)}`}>Open Import Center</Link>
          </div>
        </div>
        <div className="panel">
          <p className="eyebrow">Latest package</p>
          {latestPackage ? (
            <>
              <h2>{latestPackage.packageName}</h2>
              <p>Version {latestPackage.versionNumber} • {latestPackage.status} • Updated {new Date(latestPackage.updatedAt).toLocaleDateString()}</p>
              <div className="status-list">
                <span className="status-pill ready">Readiness {data.readinessScores.overallReadiness}%</span>
                <span className="status-pill missing">{atlasFounderApprovalKeys.filter((key) => !latestPackage.founderApprovals[key]).length} approvals missing</span>
              </div>
              <p><strong>Next recommended action:</strong> {latestPackage.status === 'Draft' ? 'Complete founder approvals and move to Founder Review.' : latestPackage.status === 'Founder Review' ? 'Confirm all approval boxes before marking Ready.' : 'Submit manually through the chosen lender portal.'}</p>
            </>
          ) : (
            <>
              <h2>No package version yet</h2>
              <p>Create the first lender package from the Package Generator.</p>
              <Link className="button-primary" href={`/atlas/package-generator?token=${encodeURIComponent(token)}`}>Open Package Generator</Link>
            </>
          )}
        </div>
      </section>

      <section className="two-column">
        <div className="panel">
          <p className="eyebrow">Document ingestion</p>
          <h2>{data.importState.sourceDocuments.length} source files tracked</h2>
          <p>Last scan: {data.importState.lastScanAt ? new Date(data.importState.lastScanAt).toLocaleString() : 'Not yet'}. Last import: {data.importState.lastImportAt ? new Date(data.importState.lastImportAt).toLocaleString() : 'Not yet'}.</p>
          <div className="status-list">
            <span className="status-pill ready">{data.importState.importedFields.length} fields mapped</span>
            <span className={`status-pill ${data.importState.fieldConflicts.length ? 'missing' : 'ready'}`}>{data.importState.fieldConflicts.length} conflicts</span>
            <span className={`status-pill ${data.importState.evidenceGaps.length ? 'missing' : 'ready'}`}>{data.importState.evidenceGaps.length} evidence gaps</span>
          </div>
          <Link className="button-secondary" href={`/atlas/import-center?token=${encodeURIComponent(token)}`}>Review Import Center</Link>
        </div>
        <div className="panel">
          <p className="eyebrow">Required documents</p>
          <h2>{data.documents.filter((item) => item.completed).length} completed / {data.documents.length} total</h2>
          <div className="status-list">
            {data.documents.filter((item) => !item.completed).slice(0, 6).map((item) => (
              <span className="status-pill missing" key={item.id}>{item.name}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="two-column">
        <div className="panel">
          <p className="eyebrow">Open risks</p>
          <div className="atlas-stack">
            {data.risks.map((risk) => (
              <article className="atlas-risk-card" key={risk.id}>
                <strong>{risk.title}</strong>
                <p>{risk.mitigation}</p>
                <span className={`status-pill ${risk.severity === 'high' ? 'missing' : 'ready'}`}>{risk.severity}</span>
              </article>
            ))}
          </div>
        </div>
        <div className="panel">
          <p className="eyebrow">Funding status</p>
          <h2>{data.companyProfile.preferredFundingTypes.join(' / ')}</h2>
          <div className="atlas-stack">
            {data.fundingOpportunities.map((opportunity) => (
              <div className="capability-row" key={opportunity.id}>
                <span className="atlas-mini-dot" />
                <div>
                  <strong>{opportunity.fundingSource}</strong>
                  <span>{money(opportunity.targetAmount)} • fit {opportunity.fitScore}/100 • {opportunity.status.replaceAll('_', ' ')} • Next: {opportunity.nextAction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
