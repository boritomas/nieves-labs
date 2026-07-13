'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  atlasPath,
  atlasGeneratedDocumentLabels,
  generateAtlasApplicationPreview,
  type AtlasApplicationBuilderSection,
  type AtlasData,
  type AtlasGeneratedDocumentType,
} from '@/lib/atlas';

const generatedTypes = Object.keys(atlasGeneratedDocumentLabels) as AtlasGeneratedDocumentType[];

export default function AtlasApplicationBuilder({
  initialData,
  initialSections,
  token,
}: {
  initialData: AtlasData;
  initialSections: AtlasApplicationBuilderSection[];
  token: string;
}) {
  const [sections, setSections] = useState(initialSections);
  const [documentType, setDocumentType] = useState<AtlasGeneratedDocumentType>('executive_summary');
  const [savingId, setSavingId] = useState('');
  const preview = useMemo(() => generateAtlasApplicationPreview(initialData, documentType), [documentType, initialData]);

  async function toggleReviewed(section: AtlasApplicationBuilderSection) {
    setSavingId(section.id);
    const reviewed = !section.reviewed;
    setSections((items) => items.map((item) => item.id === section.id ? {
      ...item,
      reviewed,
      completionStatus: item.missingFields.length ? 'missing_fields' : reviewed ? 'complete' : 'needs_review',
    } : item));

    const response = await fetch(atlasPath('/api/atlas/application-sections', token), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: section.id, patch: { reviewed } }),
    });

    if (!response.ok) {
      setSections((items) => items.map((item) => item.id === section.id ? section : item));
    }
    setSavingId('');
  }

  return (
    <div className="atlas-stack">
      <section className="panel">
        <div className="review-card-top">
          <div>
            <p className="eyebrow">Lender application workspace</p>
            <h2>Application sections</h2>
          </div>
          <span className="status-pill ready">{sections.filter((section) => section.completionStatus === 'complete').length}/{sections.length} complete</span>
        </div>
        <div className="atlas-application-grid">
          {sections.map((section) => (
            <article className="atlas-application-card" key={section.id}>
              <div className="review-card-top">
                <div>
                  <span className={`status-pill ${section.completionStatus === 'complete' ? 'ready' : 'missing'}`}>{section.completionStatus.replaceAll('_', ' ')}</span>
                  <h3>{section.title}</h3>
                </div>
              </div>
              <p>{section.previewText}</p>
              {section.missingFields.length > 0 && (
                <div>
                  <strong>Missing fields</strong>
                  <ul>
                    {section.missingFields.map((field) => <li key={field}>{field}</li>)}
                  </ul>
                </div>
              )}
              <div className="hero-actions">
                <Link className="button-secondary" href={section.editHref}>Edit</Link>
                <button className="button-primary" type="button" onClick={() => toggleReviewed(section)} disabled={section.missingFields.length > 0}>
                  {savingId === section.id ? 'Saving...' : section.reviewed ? 'Mark not reviewed' : 'Mark reviewed'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="review-card-top">
          <div>
            <p className="eyebrow">Generated preview</p>
            <h2>{atlasGeneratedDocumentLabels[documentType]}</h2>
          </div>
          <label className="atlas-select-label">
            Generate
            <select value={documentType} onChange={(event) => setDocumentType(event.target.value as AtlasGeneratedDocumentType)}>
              {generatedTypes.map((type) => <option key={type} value={type}>{atlasGeneratedDocumentLabels[type]}</option>)}
            </select>
          </label>
        </div>
        <pre className="atlas-preview">{preview}</pre>
      </section>
    </div>
  );
}
