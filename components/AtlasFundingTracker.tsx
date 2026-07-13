'use client';

import { useState } from 'react';
import { atlasFundingStatuses, atlasFundingTypes, atlasPath, type AtlasFundingOpportunity, type AtlasFundingStatus, type AtlasFundingType } from '@/lib/atlas';

const blankOpportunity = {
  fundingSource: '',
  lenderName: '',
  type: 'CDFI' as AtlasFundingType,
  targetAmount: 25000,
  status: 'researching' as AtlasFundingStatus,
  deadline: '',
  contact: '',
  website: '',
  applicationUrl: '',
  contactName: '',
  contactEmail: '',
  phone: '',
  fitScore: 50,
  requirements: '',
  nextFollowUpDate: '',
  lastContactedDate: '',
  statusNotes: '',
  notes: '',
  nextAction: '',
};

export default function AtlasFundingTracker({ initialOpportunities, token }: { initialOpportunities: AtlasFundingOpportunity[]; token: string }) {
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [draft, setDraft] = useState<Partial<AtlasFundingOpportunity>>(blankOpportunity);
  const [message, setMessage] = useState('');

  function edit(opportunity: AtlasFundingOpportunity) {
    setDraft(opportunity);
  }

  async function save() {
    if (!draft.fundingSource || !draft.type || !draft.status) {
      setMessage('Funding source, type, and status are required.');
      return;
    }

    const response = await fetch(atlasPath('/api/atlas/funding', token), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    const body = await response.json();
    if (!response.ok) {
      setMessage(body.error || 'Unable to save funding source.');
      return;
    }

    setOpportunities((items) => {
      const index = items.findIndex((item) => item.id === body.opportunity.id);
      if (index === -1) return [...items, body.opportunity];
      return items.map((item) => item.id === body.opportunity.id ? body.opportunity : item);
    });
    setDraft(blankOpportunity);
    setMessage('Funding source saved.');
  }

  async function remove(id: string) {
    const response = await fetch(atlasPath(`/api/atlas/funding?id=${encodeURIComponent(id)}`, token), { method: 'DELETE' });
    if (response.ok) {
      setOpportunities((items) => items.filter((item) => item.id !== id));
      setMessage('Funding source removed.');
    }
  }

  return (
    <div className="atlas-stack">
      <section className="panel">
        <div className="review-card-top">
          <div>
            <p className="eyebrow">Funding pipeline</p>
            <h2>{draft.id ? 'Edit funding source' : 'Add funding source'}</h2>
          </div>
          {message && <span className="status-pill ready">{message}</span>}
        </div>
        <div className="atlas-form-grid">
          <label>
            Funding source
            <input value={draft.fundingSource || ''} onChange={(event) => setDraft({ ...draft, fundingSource: event.target.value })} />
          </label>
          <label>
            Lender/intermediary name
            <input value={draft.lenderName || ''} onChange={(event) => setDraft({ ...draft, lenderName: event.target.value })} />
          </label>
          <label>
            Type
            <select value={draft.type || 'CDFI'} onChange={(event) => setDraft({ ...draft, type: event.target.value as AtlasFundingType })}>
              {atlasFundingTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label>
            Target amount
            <input type="number" value={draft.targetAmount || 0} onChange={(event) => setDraft({ ...draft, targetAmount: Number(event.target.value) })} />
          </label>
          <label>
            Status
            <select value={draft.status || 'researching'} onChange={(event) => setDraft({ ...draft, status: event.target.value as AtlasFundingStatus })}>
              {atlasFundingStatuses.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
            </select>
          </label>
          <label>
            Deadline
            <input value={draft.deadline || ''} onChange={(event) => setDraft({ ...draft, deadline: event.target.value })} />
          </label>
          <label>
            Contact
            <input value={draft.contact || ''} onChange={(event) => setDraft({ ...draft, contact: event.target.value })} />
          </label>
          <label>
            Website
            <input value={draft.website || ''} onChange={(event) => setDraft({ ...draft, website: event.target.value })} />
          </label>
          <label>
            Application URL
            <input value={draft.applicationUrl || ''} onChange={(event) => setDraft({ ...draft, applicationUrl: event.target.value })} />
          </label>
          <label>
            Contact name
            <input value={draft.contactName || ''} onChange={(event) => setDraft({ ...draft, contactName: event.target.value })} />
          </label>
          <label>
            Contact email
            <input type="email" value={draft.contactEmail || ''} onChange={(event) => setDraft({ ...draft, contactEmail: event.target.value })} />
          </label>
          <label>
            Phone
            <input value={draft.phone || ''} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} />
          </label>
          <label>
            Fit score
            <input type="number" min="0" max="100" value={draft.fitScore || 0} onChange={(event) => setDraft({ ...draft, fitScore: Number(event.target.value) })} />
          </label>
          <label>
            Next follow-up date
            <input value={draft.nextFollowUpDate || ''} onChange={(event) => setDraft({ ...draft, nextFollowUpDate: event.target.value })} />
          </label>
          <label>
            Last contacted date
            <input value={draft.lastContactedDate || ''} onChange={(event) => setDraft({ ...draft, lastContactedDate: event.target.value })} />
          </label>
          <label>
            Requirements
            <textarea value={draft.requirements || ''} onChange={(event) => setDraft({ ...draft, requirements: event.target.value })} />
          </label>
          <label>
            Notes
            <textarea value={draft.notes || ''} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} />
          </label>
          <label>
            Status notes
            <textarea value={draft.statusNotes || ''} onChange={(event) => setDraft({ ...draft, statusNotes: event.target.value })} />
          </label>
          <label>
            Next action
            <textarea value={draft.nextAction || ''} onChange={(event) => setDraft({ ...draft, nextAction: event.target.value })} />
          </label>
        </div>
        <div className="hero-actions">
          <button className="button-primary" type="button" onClick={save}>Save source</button>
          <button className="button-secondary" type="button" onClick={() => setDraft(blankOpportunity)}>Clear form</button>
        </div>
      </section>

      <section className="panel">
        <h2>Funding tracker</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Funding source</th>
                <th>Lender</th>
                <th>Type</th>
                <th>Target</th>
                <th>Fit</th>
                <th>Status</th>
                <th>Contact</th>
                <th>Follow-up</th>
                <th>Next action</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opportunity) => (
                <tr key={opportunity.id}>
                  <td>{opportunity.fundingSource}</td>
                  <td>
                    <strong>{opportunity.lenderName || opportunity.fundingSource}</strong>
                    <p>{opportunity.website || 'Website TBD'}</p>
                    <p>{opportunity.applicationUrl || 'Application URL TBD'}</p>
                  </td>
                  <td>{opportunity.type}</td>
                  <td>{money(opportunity.targetAmount)}</td>
                  <td>{opportunity.fitScore}/100</td>
                  <td>{opportunity.status.replaceAll('_', ' ')}</td>
                  <td>
                    <strong>{opportunity.contactName || opportunity.contact || 'TBD'}</strong>
                    <p>{opportunity.contactEmail || 'Email TBD'}</p>
                    <p>{opportunity.phone || 'Phone TBD'}</p>
                  </td>
                  <td>
                    <strong>{opportunity.nextFollowUpDate || 'TBD'}</strong>
                    <p>Last: {opportunity.lastContactedDate || 'not contacted'}</p>
                    <p>Deadline: {opportunity.deadline || 'TBD'}</p>
                  </td>
                  <td>
                    <strong>{opportunity.nextAction}</strong>
                    <p>{opportunity.requirements}</p>
                    <p>{opportunity.statusNotes}</p>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="button-secondary" type="button" onClick={() => edit(opportunity)}>Edit</button>
                      <button className="button-secondary" type="button" onClick={() => remove(opportunity.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
