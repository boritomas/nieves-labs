import type { AtlasWorkflowStage } from '@/lib/atlas';

export default function AtlasWorkflowProgress({ stages }: { stages: AtlasWorkflowStage[] }) {
  return (
    <section className="panel">
      <div className="review-card-top">
        <div>
          <p className="eyebrow">Release 1.0 workflow</p>
          <h2>Founder loan application progress</h2>
        </div>
        <span className="status-pill ready">{stages.filter((stage) => stage.status === 'complete').length}/{stages.length} complete</span>
      </div>
      <div className="atlas-workflow">
        {stages.map((stage, index) => (
          <a className={`atlas-workflow-step ${stage.status}`} href={stage.href} key={stage.id}>
            <span>{index + 1}</span>
            <div>
              <strong>{stage.title}</strong>
              <p>{stage.description}</p>
              <small>{stage.status.replaceAll('_', ' ')}</small>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
