'use client';

import { useMemo, useState } from 'react';

type Complaint = {
  complaint_id?: string;
  date_received?: string;
  company?: string;
  product?: string;
  issue?: string;
  company_response?: string;
  timely?: string;
};

type CaseResult = {
  id?: number;
  caseName?: string;
  citation?: string[];
  dateFiled?: string;
  court?: string;
  absolute_url?: string;
  snippet?: string;
};

const fieldClass = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white';
const panelClass = 'rounded-2xl border border-slate-800 bg-slate-900/70 p-5';

export default function ConsumerDefenseLab() {
  const [active, setActive] = useState<'credit' | 'lawsuit'>('credit');
  const [company, setCompany] = useState('CITIBANK, N.A.');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [disputeDate, setDisputeDate] = useState('');
  const [pending, setPending] = useState(true);
  const [caseQuery, setCaseQuery] = useState('Citibank credit card arbitration debt collection Texas');
  const [cases, setCases] = useState<CaseResult[]>([]);
  const [caseLoading, setCaseLoading] = useState(false);

  const daysElapsed = useMemo(() => {
    if (!disputeDate) return 0;
    const start = new Date(`${disputeDate}T00:00:00`);
    return Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
  }, [disputeDate]);

  const cfpbEligible = Boolean(disputeDate && (!pending || daysElapsed >= 45));

  async function searchComplaints() {
    setComplaintLoading(true);
    try {
      const response = await fetch(`/api/founder/cfpb?company=${encodeURIComponent(company)}`);
      const data = await response.json();
      setComplaints(data.complaints || []);
    } finally {
      setComplaintLoading(false);
    }
  }

  async function searchCases() {
    setCaseLoading(true);
    try {
      const response = await fetch(`/api/founder/case-law?q=${encodeURIComponent(caseQuery)}`);
      const data = await response.json();
      setCases(data.results || []);
    } finally {
      setCaseLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl space-y-5 px-4 pb-16">
      <div className="flex gap-2 rounded-2xl border border-slate-800 bg-slate-950 p-2">
        <button className={`flex-1 rounded-xl px-4 py-3 font-semibold ${active === 'credit' ? 'bg-white text-slate-950' : 'text-slate-300'}`} onClick={() => setActive('credit')}>CFPB Dispute Flow</button>
        <button className={`flex-1 rounded-xl px-4 py-3 font-semibold ${active === 'lawsuit' ? 'bg-white text-slate-950' : 'text-slate-300'}`} onClick={() => setActive('lawsuit')}>Citibank Lawsuit Defense</button>
      </div>

      {active === 'credit' ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className={panelClass}>
            <p className="eyebrow">Workflow gate</p>
            <h2 className="text-2xl font-semibold text-white">Credit-report dispute tracker</h2>
            <div className="mt-4 space-y-3">
              <label className="block text-sm text-slate-300">Direct CRA dispute date<input type="date" className={fieldClass} value={disputeDate} onChange={(e) => setDisputeDate(e.target.value)} /></label>
              <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={pending} onChange={(e) => setPending(e.target.checked)} /> Dispute is still pending</label>
              <div className="rounded-xl bg-slate-950 p-4 text-sm text-slate-300">
                <p>Days elapsed: <strong className="text-white">{daysElapsed}</strong></p>
                <p>Status: <strong className={cfpbEligible ? 'text-emerald-400' : 'text-amber-400'}>{cfpbEligible ? 'Eligible for CFPB escalation review' : 'Not yet eligible'}</strong></p>
              </div>
              <ol className="space-y-2 text-sm text-slate-300">
                <li>1. Upload and classify the inaccurate tradeline evidence.</li>
                <li>2. Send a direct dispute to the credit reporting agency.</li>
                <li>3. Track the 30 to 45 day investigation period.</li>
                <li>4. Compare the bureau response to the evidence.</li>
                <li>5. Escalate only when the dispute is no longer pending or 45 days have elapsed.</li>
              </ol>
              <a className={`button-secondary inline-flex ${cfpbEligible ? '' : 'pointer-events-none opacity-50'}`} href="https://www.consumerfinance.gov/complaint/" target="_blank" rel="noreferrer">Open official CFPB filing</a>
            </div>
          </div>

          <div className={panelClass}>
            <p className="eyebrow">Public complaint intelligence</p>
            <h2 className="text-2xl font-semibold text-white">CFPB company pattern search</h2>
            <div className="mt-4 flex gap-2"><input className={fieldClass} value={company} onChange={(e) => setCompany(e.target.value)} /><button className="button-secondary" onClick={searchComplaints}>{complaintLoading ? 'Searching…' : 'Search'}</button></div>
            <div className="mt-4 space-y-3">
              {complaints.map((item) => (
                <article key={item.complaint_id} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300">
                  <p className="font-semibold text-white">{item.issue || item.product}</p>
                  <p>{item.company} · {item.date_received}</p>
                  <p>Response: {item.company_response || 'Not listed'} · Timely: {item.timely || 'Unknown'}</p>
                </article>
              ))}
              {!complaints.length && <p className="text-sm text-slate-400">Search published complaints to identify recurring issues and response patterns. This does not submit a complaint.</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className={panelClass}>
            <p className="eyebrow">Case intake</p>
            <h2 className="text-2xl font-semibold text-white">Citibank defense checklist</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              {['Citation or summons and service date','Petition and every exhibit','Exact Citi card agreement and change-in-terms notices','Account statements, payments, credits, and dispute history','Court, county, cause number, answer deadline, and hearing dates'].map((item) => <label key={item} className="flex gap-2"><input type="checkbox" /> {item}</label>)}
              <div className="rounded-xl bg-slate-950 p-4">
                <p className="font-semibold text-white">Automated issue spotting</p>
                <p>Arbitration clause, limitations, service defects, standing, contract proof, business records, balance calculation, unauthorized charges, conditions precedent, and settlement posture.</p>
              </div>
              <p className="text-xs text-slate-500">Prototype only. It prepares research and draft work product; it does not file documents or provide a guaranteed legal outcome.</p>
            </div>
          </div>

          <div className={panelClass}>
            <p className="eyebrow">Case-law research</p>
            <h2 className="text-2xl font-semibold text-white">CourtListener search</h2>
            <div className="mt-4 flex gap-2"><input className={fieldClass} value={caseQuery} onChange={(e) => setCaseQuery(e.target.value)} /><button className="button-secondary" onClick={searchCases}>{caseLoading ? 'Searching…' : 'Search'}</button></div>
            <div className="mt-4 space-y-3">
              {cases.map((item) => (
                <article key={`${item.id}-${item.caseName}`} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300">
                  <a className="font-semibold text-white underline" href={item.absolute_url ? `https://www.courtlistener.com${item.absolute_url}` : '#'} target="_blank" rel="noreferrer">{item.caseName || 'Untitled opinion'}</a>
                  <p>{item.court} · {item.dateFiled}</p>
                  <p>{item.citation?.join(', ')}</p>
                </article>
              ))}
              {!cases.length && <p className="text-sm text-slate-400">Search opinions involving Citibank, arbitration, debt collection, Texas limitations, account stated, and proof of contract.</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
