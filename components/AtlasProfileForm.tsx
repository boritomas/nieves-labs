'use client';

import { useState } from 'react';
import type { AtlasChapterSevenWorkflow, AtlasCompanyProfile, AtlasPersonalFinancialProfile, AtlasUseOfFundsPlan } from '@/lib/atlas';

type Field = {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'checkbox';
};

export function AtlasCompanyProfileForm({ fields, initialProfile, token, title }: { fields: Field[]; initialProfile: AtlasCompanyProfile; token: string; title: string }) {
  const [profile, setProfile] = useState<Record<string, string | number | boolean | string[]>>({ ...initialProfile });
  const [message, setMessage] = useState('');

  async function save() {
    const patch = Object.fromEntries(fields.map((field) => [field.key, profile[field.key]]));
    const response = await fetch(`/api/atlas?token=${encodeURIComponent(token)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'company_profile', patch }),
    });
    setMessage(response.ok ? 'Saved to master profile.' : 'Unable to save profile.');
  }

  return (
    <section className="panel">
      <div className="review-card-top">
        <div>
          <p className="eyebrow">Master profile</p>
          <h2>{title}</h2>
        </div>
        {message && <span className="status-pill ready">{message}</span>}
      </div>
      <div className="atlas-form-grid">
        {fields.map((field) => (
          <label key={field.key}>
            {field.label}
            {field.type === 'textarea' ? (
              <textarea value={String(profile[field.key] || '')} onChange={(event) => setProfile({ ...profile, [field.key]: event.target.value })} />
            ) : (
              <input
                type={field.type === 'number' ? 'number' : 'text'}
                value={String(profile[field.key] || '')}
                onChange={(event) => setProfile({ ...profile, [field.key]: field.type === 'number' ? Number(event.target.value) : event.target.value })}
              />
            )}
          </label>
        ))}
      </div>
      <button className="button-primary" type="button" onClick={save}>Save profile</button>
    </section>
  );
}

export function AtlasPersonalFinancialForm({ initialProfile, token }: { initialProfile: AtlasPersonalFinancialProfile; token: string }) {
  const [profile, setProfile] = useState(initialProfile);
  const [message, setMessage] = useState('');
  const netWorth = profile.assets - profile.liabilities;
  const monthlyIncome = profile.annualIncome / 12;
  const dti = monthlyIncome > 0 ? Math.round(((profile.monthlyExpenses + profile.debtObligations) / monthlyIncome) * 100) : 0;

  async function save() {
    const response = await fetch(`/api/atlas?token=${encodeURIComponent(token)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'personal_financial_profile', patch: profile }),
    });
    setMessage(response.ok ? 'Personal financial profile saved.' : 'Unable to save profile.');
  }

  const fields: Array<[keyof AtlasPersonalFinancialProfile, string]> = [
    ['assets', 'Assets'],
    ['liabilities', 'Liabilities'],
    ['annualIncome', 'Annual income'],
    ['monthlyExpenses', 'Monthly expenses'],
    ['debtObligations', 'Monthly debt obligations'],
  ];

  return (
    <section className="panel">
      <div className="review-card-top">
        <div>
          <p className="eyebrow">Sensitive by default</p>
          <h2>Personal Financial Profile</h2>
        </div>
        {message && <span className="status-pill ready">{message}</span>}
      </div>
      <div className="metrics-grid compact">
        <Metric label="Total assets" value={profile.valuesHidden ? 'Hidden' : money(profile.assets)} />
        <Metric label="Total liabilities" value={profile.valuesHidden ? 'Hidden' : money(profile.liabilities)} />
        <Metric label="Net worth" value={profile.valuesHidden ? 'Hidden' : money(netWorth)} />
        <Metric label="Debt-to-income" value={profile.valuesHidden ? 'Hidden' : `${dti}%`} />
      </div>
      <label className="atlas-toggle">
        <input type="checkbox" checked={profile.valuesHidden} onChange={(event) => setProfile({ ...profile, valuesHidden: event.target.checked })} />
        Hide sensitive values in dashboard cards
      </label>
      <div className="atlas-form-grid">
        {fields.map(([key, label]) => (
          <label key={key}>
            {label}
            <input type="number" value={Number(profile[key]) || 0} onChange={(event) => setProfile({ ...profile, [key]: Number(event.target.value) })} />
          </label>
        ))}
      </div>
      <button className="button-primary" type="button" onClick={save}>Save financial profile</button>
    </section>
  );
}

export function AtlasChapterSevenForm({ initialWorkflow, token }: { initialWorkflow: AtlasChapterSevenWorkflow; token: string }) {
  const [workflow, setWorkflow] = useState(initialWorkflow);
  const [message, setMessage] = useState('');

  async function save() {
    const response = await fetch(`/api/atlas?token=${encodeURIComponent(token)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'chapter_7_workflow', patch: workflow }),
    });
    setMessage(response.ok ? 'Chapter 7 workflow saved.' : 'Unable to save Chapter 7 workflow.');
  }

  return (
    <section className="panel">
      <div className="review-card-top">
        <div>
          <p className="eyebrow">Founder approval required</p>
          <h2>Chapter 7 Workflow</h2>
        </div>
        {message && <span className="status-pill ready">{message}</span>}
      </div>
      <div className="atlas-form-grid">
        <label>Filing date<input value={workflow.filingDate} onChange={(event) => setWorkflow({ ...workflow, filingDate: event.target.value })} /></label>
        <label>Discharge date<input value={workflow.dischargeDate} onChange={(event) => setWorkflow({ ...workflow, dischargeDate: event.target.value })} /></label>
        <label>Status<input value={workflow.status} onChange={(event) => setWorkflow({ ...workflow, status: event.target.value })} /></label>
        <label>
          Explanation
          <textarea value={workflow.explanation} onChange={(event) => setWorkflow({ ...workflow, explanation: event.target.value })} />
        </label>
        <label>
          Supporting documents
          <textarea value={workflow.supportingDocuments.join('\n')} onChange={(event) => setWorkflow({ ...workflow, supportingDocuments: event.target.value.split('\n').filter(Boolean) })} />
        </label>
      </div>
      <label className="atlas-toggle">
        <input type="checkbox" checked={workflow.founderApproved} onChange={(event) => setWorkflow({ ...workflow, founderApproved: event.target.checked })} />
        Founder reviewed and approved this explanation language
      </label>
      <button className="button-primary" type="button" onClick={save}>Save Chapter 7 workflow</button>
    </section>
  );
}

export function AtlasUseOfFundsForm({ initialPlan, token }: { initialPlan: AtlasUseOfFundsPlan; token: string }) {
  const [plan, setPlan] = useState(initialPlan);
  const [message, setMessage] = useState('');
  const total = plan.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const target = plan.selectedAmount === 0 ? plan.customAmount : plan.selectedAmount;

  async function save() {
    const response = await fetch(`/api/atlas?token=${encodeURIComponent(token)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'use_of_funds_plan', patch: { ...plan, selectedAmount: target } }),
    });
    setMessage(response.ok ? 'Use-of-funds plan saved.' : 'Unable to save plan.');
  }

  return (
    <section className="panel">
      <div className="review-card-top">
        <div>
          <p className="eyebrow">Validate totals</p>
          <h2>Use of Funds</h2>
        </div>
        <span className={`status-pill ${total === target ? 'ready' : 'missing'}`}>{money(total)} / {money(target)}</span>
      </div>
      {message && <p>{message}</p>}
      <div className="atlas-choice-row">
        {[25000, 35000, 50000].map((amount) => (
          <button className={target === amount ? 'button-primary' : 'button-secondary'} key={amount} type="button" onClick={() => setPlan({ ...plan, selectedAmount: amount, customAmount: amount })}>{money(amount)}</button>
        ))}
        <label>Custom<input type="number" value={plan.customAmount} onChange={(event) => setPlan({ ...plan, selectedAmount: 0, customAmount: Number(event.target.value) })} /></label>
      </div>
      <div className="atlas-stack">
        {plan.items.map((item) => (
          <div className="atlas-use-row" key={item.id}>
            <strong>{item.category}</strong>
            <input type="number" value={item.amount} onChange={(event) => setPlan({ ...plan, items: plan.items.map((entry) => entry.id === item.id ? { ...entry, amount: Number(event.target.value) } : entry) })} />
            <input value={item.notes} onChange={(event) => setPlan({ ...plan, items: plan.items.map((entry) => entry.id === item.id ? { ...entry, notes: event.target.value } : entry) })} />
          </div>
        ))}
      </div>
      <button className="button-primary" type="button" onClick={save}>Save use of funds</button>
    </section>
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
