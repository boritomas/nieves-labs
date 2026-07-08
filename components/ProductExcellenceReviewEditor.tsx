'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ProductExcellenceReview } from '@/lib/product-excellence';

type EditableReview = Omit<ProductExcellenceReview, 'competitorResearch' | 'productConstitution' | 'scorecard'> & {
  competitorResearch: string;
  always: string;
  never: string;
  scorecard: string;
};

function lines(items: string[]) {
  return items.join('\n');
}

function fromSeed(review: ProductExcellenceReview): EditableReview {
  return {
    ...review,
    completedWork: [...review.completedWork],
    externalFeedback: [...review.externalFeedback],
    aiReviewFindings: [...review.aiReviewFindings],
    mustFix: [...review.mustFix],
    shouldFix: [...review.shouldFix],
    successMetrics: [...review.successMetrics],
    launchCriteria: [...review.launchCriteria],
    competitorResearch: review.competitorResearch.map((item) => `${item.name}: Strength: ${item.strength}; Lesson: ${item.lesson}; Differentiation: ${item.differentiation}`).join('\n'),
    always: lines(review.productConstitution.always),
    never: lines(review.productConstitution.never),
    scorecard: review.scorecard.map((item) => `${item.category}: ${item.score}`).join('\n'),
  };
}

export default function ProductExcellenceReviewEditor({ review }: { review: ProductExcellenceReview }) {
  const storageKey = `nieves-labs:product-excellence:${review.slug}`;
  const seeded = useMemo(() => fromSeed(review), [review]);
  const [draft, setDraft] = useState<EditableReview>(seeded);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      setDraft(JSON.parse(raw) as EditableReview);
    } catch {
      setDraft(seeded);
    }
  }, [seeded, storageKey]);

  function update<K extends keyof EditableReview>(key: K, value: EditableReview[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateList(key: keyof Pick<EditableReview, 'completedWork' | 'externalFeedback' | 'aiReviewFindings' | 'mustFix' | 'shouldFix' | 'successMetrics' | 'launchCriteria'>, value: string) {
    update(key, value.split('\n').map((item) => item.trim()).filter(Boolean) as EditableReview[typeof key]);
  }

  function saveReview() {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
    setSavedMessage('Saved in this browser.');
    window.setTimeout(() => setSavedMessage(''), 2200);
  }

  function resetReview() {
    window.localStorage.removeItem(storageKey);
    setDraft(seeded);
    setSavedMessage('Reset to seeded review.');
    window.setTimeout(() => setSavedMessage(''), 2200);
  }

  return (
    <div className="review-detail">
      <section className="review-summary panel">
        <div>
          <p className="eyebrow">Seeded editable review</p>
          <h2>{draft.product}</h2>
          <p>{draft.mission}</p>
        </div>
        <div className="score-orb">
          <strong>{draft.score}</strong>
          <span>/100</span>
        </div>
      </section>

      <section className="section review-edit-grid">
        <label>
          Stage
          <input value={draft.stage} onChange={(event) => update('stage', event.target.value)} />
        </label>
        <label>
          Score
          <input type="number" value={draft.score} onChange={(event) => update('score', Number(event.target.value))} />
        </label>
        <label>
          Status
          <input value={draft.status} onChange={(event) => update('status', event.target.value)} />
        </label>
        <label>
          Production domain
          <input value={draft.productionDomain} onChange={(event) => update('productionDomain', event.target.value)} />
        </label>
        <label>
          Fallback URL
          <input value={draft.fallbackUrl} onChange={(event) => update('fallbackUrl', event.target.value)} />
        </label>
        <label>
          Repository
          <input value={draft.repository} onChange={(event) => update('repository', event.target.value)} />
        </label>
      </section>

      <section className="section two-column">
        <TextPanel title="Mission" value={draft.mission} onChange={(value) => update('mission', value)} />
        <TextPanel title="Core Positioning" value={draft.positioning} onChange={(value) => update('positioning', value)} />
        <TextPanel title="Primary Customer" value={draft.primaryCustomer} onChange={(value) => update('primaryCustomer', value)} />
        <TextPanel title="Problem" value={draft.problem} onChange={(value) => update('problem', value)} />
        <TextPanel title="Transformation" value={draft.transformation} onChange={(value) => update('transformation', value)} />
        <TextPanel title="Recommendation" value={draft.recommendation} onChange={(value) => update('recommendation', value)} />
      </section>

      <section className="section two-column">
        <ListPanel title="Completed Work" items={draft.completedWork} onChange={(value) => updateList('completedWork', value)} />
        <ListPanel title="External Feedback" items={draft.externalFeedback} onChange={(value) => updateList('externalFeedback', value)} />
        <ListPanel title="AI Review Board Findings" items={draft.aiReviewFindings} onChange={(value) => updateList('aiReviewFindings', value)} />
        <ListPanel title="Must Fix" items={draft.mustFix} onChange={(value) => updateList('mustFix', value)} />
        <ListPanel title="Should Fix" items={draft.shouldFix} onChange={(value) => updateList('shouldFix', value)} />
        <ListPanel title="Launch Criteria" items={draft.launchCriteria} onChange={(value) => updateList('launchCriteria', value)} />
      </section>

      <section className="section two-column">
        <TextPanel title="Competitor Research" value={draft.competitorResearch} onChange={(value) => update('competitorResearch', value)} />
        <TextPanel title="Scorecard" value={draft.scorecard} onChange={(value) => update('scorecard', value)} />
        <TextPanel title="Always" value={draft.always} onChange={(value) => update('always', value)} />
        <TextPanel title="Never" value={draft.never} onChange={(value) => update('never', value)} />
        <ListPanel title="Success Metrics" items={draft.successMetrics} onChange={(value) => updateList('successMetrics', value)} />
        <TextPanel title="Next Action" value={draft.nextAction} onChange={(value) => update('nextAction', value)} />
      </section>

      <section className="review-actions panel">
        <div>
          <h2>Editable Review Controls</h2>
          <p>Edits are saved in this browser so the seeded review remains reusable and recoverable.</p>
          {savedMessage ? <p className="form-success">{savedMessage}</p> : null}
        </div>
        <div className="hero-actions">
          <button className="button-primary" type="button" onClick={saveReview}>Save edits</button>
          <button className="button-secondary" type="button" onClick={resetReview}>Reset seed</button>
        </div>
      </section>
    </div>
  );
}

function TextPanel({ title, value, onChange }: { title: string; value: string; onChange: (value: string) => void }) {
  return (
    <article className="panel editable-panel">
      <h2>{title}</h2>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </article>
  );
}

function ListPanel({ title, items, onChange }: { title: string; items: string[]; onChange: (value: string) => void }) {
  return (
    <article className="panel editable-panel">
      <h2>{title}</h2>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
      <textarea value={lines(items)} onChange={(event) => onChange(event.target.value)} />
    </article>
  );
}
