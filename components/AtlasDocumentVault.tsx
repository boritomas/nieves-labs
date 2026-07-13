'use client';

import { useMemo, useState } from 'react';
import { atlasPath, type AtlasDocument } from '@/lib/atlas';

export default function AtlasDocumentVault({ initialDocuments, token }: { initialDocuments: AtlasDocument[]; token: string }) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [savingId, setSavingId] = useState('');

  const grouped = useMemo(() => {
    return documents.reduce<Record<string, AtlasDocument[]>>((acc, document) => {
      acc[document.category] = [...(acc[document.category] || []), document];
      return acc;
    }, {});
  }, [documents]);

  async function toggleDocument(document: AtlasDocument) {
    setSavingId(document.id);
    const nextCompleted = !document.completed;
    setDocuments((items) => items.map((item) => item.id === document.id ? { ...item, completed: nextCompleted } : item));
    const response = await fetch(atlasPath('/api/atlas/documents', token), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: document.id, patch: { completed: nextCompleted } }),
    });

    if (!response.ok) {
      setDocuments((items) => items.map((item) => item.id === document.id ? document : item));
    }
    setSavingId('');
  }

  return (
    <div className="atlas-stack">
      {Object.entries(grouped).map(([category, items]) => (
        <section className="panel" key={category}>
          <div className="review-card-top">
            <div>
              <p className="eyebrow">{category}</p>
              <h2>{categoryLabel(category)}</h2>
            </div>
            <span className="status-pill ready">{items.filter((item) => item.completed).length}/{items.length} complete</span>
          </div>
          <div className="atlas-checklist">
            {items.map((document) => (
              <button className={`atlas-check-row ${document.completed ? 'complete' : ''}`} key={document.id} onClick={() => toggleDocument(document)} type="button">
                <span>{document.completed ? '✓' : ''}</span>
                <div>
                  <strong>{document.name}</strong>
                  <p>{document.notes}</p>
                  <small>{savingId === document.id ? 'Saving...' : 'Upload placeholder: attach the final file in the lender packet folder when available.'}</small>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function categoryLabel(value: string) {
  return value.split('_').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}
