import type { AtlasReadinessScores } from '@/lib/atlas';

const labels: Array<[keyof AtlasReadinessScores['breakdown'], string]> = [
  ['requiredDocuments', 'Required documents'],
  ['financialAssumptions', 'Financial assumptions'],
  ['fundingTracker', 'Funding tracker'],
  ['dueDiligenceTasks', 'Due diligence tasks'],
  ['riskMitigation', 'Risk mitigation'],
  ['applicationSections', 'Application sections'],
];

export default function AtlasReadinessBreakdown({ scores }: { scores: AtlasReadinessScores }) {
  return (
    <section className="panel">
      <div className="review-card-top">
        <div>
          <p className="eyebrow">Readiness breakdown</p>
          <h2>Application engine score inputs</h2>
        </div>
        <span className="score-orb small"><strong>{scores.overallReadiness}</strong><span>/100</span></span>
      </div>
      <div className="atlas-score-bars">
        {labels.map(([key, label]) => (
          <div className="atlas-score-row" key={key}>
            <div>
              <strong>{label}</strong>
              <span>{scores.breakdown[key]}%</span>
            </div>
            <div className="atlas-score-track"><span style={{ width: `${scores.breakdown[key]}%` }} /></div>
          </div>
        ))}
      </div>
    </section>
  );
}

