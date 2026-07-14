'use client';

import { useMemo, useState } from 'react';
import {
  atlasPath,
  atlasFounderApprovalKeys,
  atlasPackageStatuses,
  generateAtlasPackage,
  getAtlasActiveFundingAmount,
  getLatestAtlasPackage,
  type AtlasData,
  type AtlasPackageStatus,
  type AtlasPackageVersion,
} from '@/lib/atlas';

export default function AtlasPackageGenerator({ initialData, token }: { initialData: AtlasData; token: string }) {
  const generated = useMemo(() => generateAtlasPackage(initialData), [initialData]);
  const latest = getLatestAtlasPackage(initialData);
  const [draft, setDraft] = useState<Partial<AtlasPackageVersion>>(latest || {
    packageName: `${initialData.companyProfile.companyName} SBA/CDFI Capital Package`,
    targetLender: initialData.fundingOpportunities[0]?.lenderName || 'Target lender TBD',
    fundingType: initialData.fundingOpportunities[0]?.type || 'SBA Microloan',
    fundingAmount: getAtlasActiveFundingAmount(initialData),
    status: 'Draft',
    notes: '',
    founderApprovals: {},
  });
  const [message, setMessage] = useState('');
  const approvals = draft.founderApprovals || {};
  const allApproved = atlasFounderApprovalKeys.every((key) => approvals[key]);
  const statusBlocked = ['Ready', 'Submitted'].includes(String(draft.status)) && !allApproved;

  async function save() {
    const response = await fetch(atlasPath('/api/atlas', token), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'package_version', patch: draft }),
    });
    const body = await response.json();
    if (response.ok) {
      setDraft(body.packageVersion);
      setMessage(body.packageVersion.status !== draft.status ? 'Saved. Status moved to Founder Review until all founder approvals are checked.' : 'Package version saved.');
    } else {
      setMessage(body.error || 'Unable to save package.');
    }
  }

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    setMessage('Copied to clipboard.');
  }

  function download(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="atlas-stack">
      <section className="panel">
        <div className="review-card-top">
          <div>
            <p className="eyebrow">Package versioning</p>
            <h2>{draft.packageName}</h2>
          </div>
          <span className={`status-pill ${statusBlocked ? 'missing' : 'ready'}`}>{draft.status || 'Draft'}</span>
        </div>
        {message && <p>{message}</p>}
        <div className="atlas-form-grid">
          <label>Package name<input value={draft.packageName || ''} onChange={(event) => setDraft({ ...draft, packageName: event.target.value })} /></label>
          <label>Target lender<input value={draft.targetLender || ''} onChange={(event) => setDraft({ ...draft, targetLender: event.target.value })} /></label>
          <label>Funding type<input value={draft.fundingType || ''} onChange={(event) => setDraft({ ...draft, fundingType: event.target.value })} /></label>
          <label>Funding amount<input type="number" value={draft.fundingAmount || 0} onChange={(event) => setDraft({ ...draft, fundingAmount: Number(event.target.value) })} /></label>
          <label>Status<select value={draft.status || 'Draft'} onChange={(event) => setDraft({ ...draft, status: event.target.value as AtlasPackageStatus })}>{atlasPackageStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label>Notes<textarea value={draft.notes || ''} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} /></label>
        </div>
        <div className="atlas-checklist compact">
          {atlasFounderApprovalKeys.map((key) => (
            <label className={`atlas-check-row ${approvals[key] ? 'complete' : ''}`} key={key}>
              <span>{approvals[key] ? '✓' : ''}</span>
              <div>
                <strong>{key}</strong>
                <input type="checkbox" checked={Boolean(approvals[key])} onChange={(event) => setDraft({ ...draft, founderApprovals: { ...approvals, [key]: event.target.checked } })} />
              </div>
            </label>
          ))}
        </div>
        {statusBlocked && <p className="negative">Ready/Submitted is blocked until every founder approval is checked.</p>}
        <div className="hero-actions">
          <button className="button-primary" type="button" onClick={save}>Save package version</button>
          <button className="button-secondary" type="button" onClick={() => copy(generated.markdown)}>Copy entire package</button>
          <button className="button-secondary" type="button" onClick={() => download('nieves-labs-capital-package.md', generated.markdown, 'text/markdown')}>Download Markdown</button>
          <button className="button-secondary" type="button" onClick={() => download('nieves-labs-capital-package.html', generated.html, 'text/html')}>Download HTML</button>
        </div>
      </section>
      <section className="atlas-application-grid">
        {generated.sections.map(([title, body]) => (
          <article className="atlas-application-card" key={title}>
            <div className="review-card-top">
              <h2>{title}</h2>
              <button className="button-secondary" type="button" onClick={() => copy(`## ${title}\n\n${body}`)}>Copy Section</button>
            </div>
            <p>{body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
