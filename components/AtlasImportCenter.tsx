'use client';

import { useMemo, useState } from 'react';
import type { AtlasData, AtlasImportState } from '@/lib/atlas';

type ImportAction = 'scan' | 'preview' | 'import';

export default function AtlasImportCenter({ initialData, token }: { initialData: AtlasData; token: string }) {
  const [importState, setImportState] = useState<AtlasImportState>(initialData.importState);
  const [busy, setBusy] = useState<string>('');
  const [message, setMessage] = useState('');

  const metrics = useMemo(() => ({
    discovered: importState.sourceDocuments.length,
    imported: importState.sourceDocuments.filter((document) => document.status === 'imported').length,
    skipped: importState.sourceDocuments.filter((document) => document.status === 'skipped').length,
    duplicates: importState.sourceDocuments.filter((document) => document.status === 'duplicate').length,
    fields: importState.importedFields.length,
    conflicts: importState.fieldConflicts.length,
    gaps: importState.evidenceGaps.length,
    sensitive: importState.importedFields.filter((field) => field.sensitive || field.conflictStatus === 'sensitive_excluded').length,
  }), [importState]);

  async function run(action: ImportAction) {
    setBusy(action);
    setMessage('');
    try {
      const response = await fetch(`/api/atlas/import?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Import action failed');
      setImportState(payload.importState);
      setMessage(action === 'import'
        ? 'Approved source documents imported. A new founder-review package draft was created.'
        : `${capitalize(action)} completed. Review mapped fields before importing.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Import action failed');
    } finally {
      setBusy('');
    }
  }

  async function review(fieldId: string, action: 'approve-field' | 'reject-field' | 'defer-field' | 'mark-assumption') {
    setBusy(fieldId);
    try {
      const response = await fetch(`/api/atlas/import?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, fieldId }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Review action failed');
      setImportState(payload.importState);
      setMessage('Founder review queue updated.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Review action failed');
    } finally {
      setBusy('');
    }
  }

  return (
    <div className="atlas-stack">
      <section className="metrics-grid">
        <Metric label="Files discovered" value={metrics.discovered} />
        <Metric label="Files imported" value={metrics.imported} />
        <Metric label="Skipped" value={metrics.skipped} />
        <Metric label="Duplicates" value={metrics.duplicates} />
        <Metric label="Fields mapped" value={metrics.fields} />
        <Metric label="Conflicts" value={metrics.conflicts} />
        <Metric label="Evidence gaps" value={metrics.gaps} />
        <Metric label="Sensitive excluded" value={metrics.sensitive} />
      </section>

      <section className="panel">
        <p className="eyebrow">Protected source ingestion</p>
        <h2>Import Center</h2>
        <p>Atlas scans approved project folders, parses lender-relevant documents, maps non-sensitive fields into the capital workspace, and keeps source traceability for founder review. Original files are never modified.</p>
        <div className="hero-actions">
          <button className="button-secondary" type="button" onClick={() => run('scan')} disabled={Boolean(busy)}>{busy === 'scan' ? 'Scanning...' : 'Scan approved folders'}</button>
          <button className="button-secondary" type="button" onClick={() => run('preview')} disabled={Boolean(busy)}>{busy === 'preview' ? 'Building preview...' : 'Preview import'}</button>
          <button className="button-primary" type="button" onClick={() => run('import')} disabled={Boolean(busy)}>{busy === 'import' ? 'Importing...' : 'Import approved files'}</button>
        </div>
        {message ? <p className="form-note">{message}</p> : null}
        <div className="status-list">
          <span className="status-pill ready">Last scan: {formatDate(importState.lastScanAt)}</span>
          <span className="status-pill ready">Last import: {formatDate(importState.lastImportAt)}</span>
        </div>
      </section>

      <section className="two-column">
        <div className="panel">
          <p className="eyebrow">Review required</p>
          <h2>Founder review queue</h2>
          <div className="atlas-stack">
            {importState.founderReviewQueue.slice(0, 12).map((item) => (
              <article className="atlas-risk-card" key={item.id}>
                <div className="capability-row">
                  <span className={`status-pill ${item.riskLevel === 'high' ? 'missing' : 'ready'}`}>{item.riskLevel}</span>
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.classification} • confidence {item.confidence}% • {item.status.replaceAll('_', ' ')}</span>
                  </div>
                </div>
                <p>{item.importedValue}</p>
                <p><strong>Source:</strong> {item.source}</p>
                <p><strong>Recommendation:</strong> {item.recommendedAction}</p>
                <div className="hero-actions">
                  <button className="button-secondary" type="button" onClick={() => review(item.importedFieldId, 'approve-field')} disabled={busy === item.importedFieldId}>Approve</button>
                  <button className="button-secondary" type="button" onClick={() => review(item.importedFieldId, 'mark-assumption')} disabled={busy === item.importedFieldId}>Mark assumption</button>
                  <button className="button-secondary" type="button" onClick={() => review(item.importedFieldId, 'defer-field')} disabled={busy === item.importedFieldId}>Defer</button>
                  <button className="button-secondary" type="button" onClick={() => review(item.importedFieldId, 'reject-field')} disabled={busy === item.importedFieldId}>Reject</button>
                </div>
              </article>
            ))}
            {!importState.founderReviewQueue.length ? <p>No fields are waiting for founder review. Run preview to build the queue.</p> : null}
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">Evidence gaps</p>
          <h2>Missing, stale, or sensitive items</h2>
          <div className="atlas-stack">
            {importState.evidenceGaps.map((gap) => (
              <article className="atlas-risk-card" key={gap.id}>
                <span className={`status-pill ${gap.severity === 'high' ? 'missing' : 'ready'}`}>{gap.category}</span>
                <strong>{gap.label}</strong>
                <p>{gap.detail}</p>
              </article>
            ))}
            {importState.stalenessFlags.map((flag) => (
              <article className="atlas-risk-card" key={flag.id}>
                <span className="status-pill missing">{flag.status}</span>
                <strong>{flag.fieldPath}</strong>
                <p>{flag.reason}</p>
                <p><strong>Source:</strong> {flag.source}</p>
              </article>
            ))}
            {!importState.evidenceGaps.length && !importState.stalenessFlags.length ? <p>No evidence gaps have been detected yet.</p> : null}
          </div>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Mapped fields</p>
        <h2>Auto-population preview</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
                <th>Classification</th>
                <th>Confidence</th>
                <th>Source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {importState.importedFields.map((field) => (
                <tr key={field.id}>
                  <td>{field.label}</td>
                  <td>{field.sensitive ? 'Excluded sensitive value' : renderValue(field.normalizedValue)}</td>
                  <td>{field.classification}</td>
                  <td>{field.confidence}%</td>
                  <td>{field.sourceFilename}<br /><span className="muted">{field.sourceSection}</span></td>
                  <td>{field.conflictStatus.replaceAll('_', ' ')} / {field.verificationStatus.replaceAll('_', ' ')}</td>
                </tr>
              ))}
              {!importState.importedFields.length ? (
                <tr>
                  <td colSpan={6}>No mapped fields yet. Run Preview Import to parse supported source files.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Source inventory</p>
        <h2>Discovered files</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>File</th>
                <th>Type</th>
                <th>Classification</th>
                <th>Status</th>
                <th>Modified</th>
                <th>Hash</th>
              </tr>
            </thead>
            <tbody>
              {importState.sourceDocuments.map((document) => (
                <tr key={document.id}>
                  <td>{document.filename}<br /><span className="muted">{document.path}</span></td>
                  <td>{document.fileType}</td>
                  <td>{document.classification} / {document.relevanceScore}%</td>
                  <td>{document.status}{document.skipReason ? `: ${document.skipReason}` : ''}</td>
                  <td>{formatDate(document.modifiedAt)}</td>
                  <td>{document.contentHash.slice(0, 12)}</td>
                </tr>
              ))}
              {!importState.sourceDocuments.length ? (
                <tr>
                  <td colSpan={6}>No scan has run yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Import runs</p>
        <h2>Run history and errors</h2>
        <div className="status-list">
          {importState.importRuns.map((run) => (
            <span className="status-pill ready" key={run.id}>{run.mode}: {run.discoveredCount} files, {run.fieldsPopulated} fields, {run.conflictsFound} conflicts</span>
          ))}
        </div>
        {importState.importErrors.length ? (
          <div className="atlas-stack">
            {importState.importErrors.map((error) => (
              <p className="form-note" key={error.id}>{error.path}: {error.message}</p>
            ))}
          </div>
        ) : <p>No import errors recorded.</p>}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function renderValue(value: string | number | string[]) {
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

function formatDate(value: string) {
  if (!value) return 'Not yet';
  return new Date(value).toLocaleString();
}

function capitalize(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}
