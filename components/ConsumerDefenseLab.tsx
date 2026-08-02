'use client';

import { useEffect, useMemo, useState } from 'react';

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
};

type DisputeState = {
  consumerName: string;
  address: string;
  cityStateZip: string;
  reportNumber: string;
  bureau: string;
  furnisher: string;
  accountNumber: string;
  issueType: string;
  currentReporting: string;
  correctReporting: string;
  facts: string;
  requestedResolution: string;
  disputeDate: string;
  pending: boolean;
  evidence: string[];
};

const fieldClass = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white';
const panelClass = 'rounded-2xl border border-slate-800 bg-slate-900/70 p-5';
const initialDispute: DisputeState = {
  consumerName: '', address: '', cityStateZip: '', reportNumber: '', bureau: 'Experian', furnisher: 'Citibank, N.A.', accountNumber: '',
  issueType: 'Incorrect balance', currentReporting: '', correctReporting: '', facts: '', requestedResolution: 'Correct or delete the inaccurate information and send an updated report.',
  disputeDate: '', pending: true, evidence: [],
};

function addDays(date: string, days: number) {
  if (!date) return '';
  const value = new Date(`${date}T12:00:00`);
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
}

export default function ConsumerDefenseLab() {
  const [active, setActive] = useState<'credit' | 'lawsuit'>('credit');
  const [company, setCompany] = useState('CITIBANK, N.A.');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [caseQuery, setCaseQuery] = useState('Citibank credit card arbitration debt collection Texas');
  const [cases, setCases] = useState<CaseResult[]>([]);
  const [caseLoading, setCaseLoading] = useState(false);
  const [dispute, setDispute] = useState<DisputeState>(initialDispute);
  const [files, setFiles] = useState<string[]>([]);
  const [packageStatus, setPackageStatus] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem('consumer-defense-dispute');
    if (saved) setDispute(JSON.parse(saved));
  }, []);

  useEffect(() => {
    window.localStorage.setItem('consumer-defense-dispute', JSON.stringify(dispute));
  }, [dispute]);

  const daysElapsed = useMemo(() => {
    if (!dispute.disputeDate) return 0;
    return Math.max(0, Math.floor((Date.now() - new Date(`${dispute.disputeDate}T00:00:00`).getTime()) / 86400000));
  }, [dispute.disputeDate]);

  const cfpbEligible = Boolean(dispute.disputeDate && (!dispute.pending || daysElapsed >= 45));
  const deadline30 = addDays(dispute.disputeDate, 30);
  const deadline45 = addDays(dispute.disputeDate, 45);

  function update<K extends keyof DisputeState>(key: K, value: DisputeState[K]) {
    setDispute((current) => ({ ...current, [key]: value }));
  }

  function toggleEvidence(item: string) {
    update('evidence', dispute.evidence.includes(item) ? dispute.evidence.filter((value) => value !== item) : [...dispute.evidence, item]);
  }

  async function searchComplaints() {
    setComplaintLoading(true);
    try {
      const response = await fetch(`/api/founder/cfpb?company=${encodeURIComponent(company)}`);
      const data = await response.json();
      setComplaints(data.complaints || []);
    } finally { setComplaintLoading(false); }
  }

  async function searchCases() {
    setCaseLoading(true);
    try {
      const response = await fetch(`/api/founder/case-law?q=${encodeURIComponent(caseQuery)}`);
      const data = await response.json();
      setCases(data.results || []);
    } finally { setCaseLoading(false); }
  }

  async function generatePackage() {
    setPackageStatus('Generating package…');
    const response = await fetch('/api/founder/dispute-package', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...dispute, files, deadlines: { deadline30, deadline45 }, cfpbEligible }),
    });
    if (!response.ok) {
      setPackageStatus('Package generation failed. Complete the required fields and retry.');
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `credit-dispute-package-${Date.now()}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
    setPackageStatus('Package generated and downloaded. Review every statement before sending.');
  }

  const requiredReady = Boolean(dispute.consumerName && dispute.address && dispute.cityStateZip && dispute.bureau && dispute.furnisher && dispute.accountNumber && dispute.facts && dispute.currentReporting && dispute.correctReporting);

  return (
    <section className="mx-auto max-w-6xl space-y-5 px-4 pb-16">
      <div className="flex gap-2 rounded-2xl border border-slate-800 bg-slate-950 p-2">
        <button className={`flex-1 rounded-xl px-4 py-3 font-semibold ${active === 'credit' ? 'bg-white text-slate-950' : 'text-slate-300'}`} onClick={() => setActive('credit')}>CFPB Dispute Flow</button>
        <button className={`flex-1 rounded-xl px-4 py-3 font-semibold ${active === 'lawsuit' ? 'bg-white text-slate-950' : 'text-slate-300'}`} onClick={() => setActive('lawsuit')}>Citibank Lawsuit Defense</button>
      </div>

      {active === 'credit' ? (
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className={panelClass}>
              <p className="eyebrow">Step 1</p><h2 className="text-2xl font-semibold text-white">Consumer and tradeline intake</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-sm text-slate-300">Full legal name<input className={fieldClass} value={dispute.consumerName} onChange={(e) => update('consumerName', e.target.value)} /></label>
                <label className="text-sm text-slate-300">Credit report number<input className={fieldClass} value={dispute.reportNumber} onChange={(e) => update('reportNumber', e.target.value)} /></label>
                <label className="text-sm text-slate-300 sm:col-span-2">Street address<input className={fieldClass} value={dispute.address} onChange={(e) => update('address', e.target.value)} /></label>
                <label className="text-sm text-slate-300 sm:col-span-2">City, state, ZIP<input className={fieldClass} value={dispute.cityStateZip} onChange={(e) => update('cityStateZip', e.target.value)} /></label>
                <label className="text-sm text-slate-300">Credit bureau<select className={fieldClass} value={dispute.bureau} onChange={(e) => update('bureau', e.target.value)}><option>Experian</option><option>Equifax</option><option>TransUnion</option></select></label>
                <label className="text-sm text-slate-300">Furnisher<input className={fieldClass} value={dispute.furnisher} onChange={(e) => update('furnisher', e.target.value)} /></label>
                <label className="text-sm text-slate-300">Account number / last four<input className={fieldClass} value={dispute.accountNumber} onChange={(e) => update('accountNumber', e.target.value)} /></label>
                <label className="text-sm text-slate-300">Issue type<select className={fieldClass} value={dispute.issueType} onChange={(e) => update('issueType', e.target.value)}>{['Not my account','Incorrect balance','Incorrect payment history','Duplicate account','Incorrect dates','Paid or settled','Obsolete reporting','Reinserted information','Furnisher failed to update','Identity theft'].map((item) => <option key={item}>{item}</option>)}</select></label>
              </div>
            </div>

            <div className={panelClass}>
              <p className="eyebrow">Step 2</p><h2 className="text-2xl font-semibold text-white">Explain the inaccuracy</h2>
              <div className="mt-4 space-y-3">
                <label className="text-sm text-slate-300">What the report currently says<textarea className={fieldClass} rows={3} value={dispute.currentReporting} onChange={(e) => update('currentReporting', e.target.value)} /></label>
                <label className="text-sm text-slate-300">What the report should say<textarea className={fieldClass} rows={3} value={dispute.correctReporting} onChange={(e) => update('correctReporting', e.target.value)} /></label>
                <label className="text-sm text-slate-300">Factual explanation<textarea className={fieldClass} rows={5} value={dispute.facts} onChange={(e) => update('facts', e.target.value)} placeholder="State only facts you can support with records." /></label>
                <label className="text-sm text-slate-300">Requested resolution<textarea className={fieldClass} rows={2} value={dispute.requestedResolution} onChange={(e) => update('requestedResolution', e.target.value)} /></label>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className={panelClass}>
              <p className="eyebrow">Step 3</p><h2 className="text-2xl font-semibold text-white">Evidence package</h2>
              <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                {['Credit report page','Government ID','Proof of address','Account statements','Payment records','Settlement or payoff letter','Prior dispute letter','Bureau response','Furnisher correspondence','Identity theft report'].map((item) => <label key={item} className="flex gap-2"><input type="checkbox" checked={dispute.evidence.includes(item)} onChange={() => toggleEvidence(item)} />{item}</label>)}
              </div>
              <label className="mt-4 block text-sm text-slate-300">Select supporting files<input type="file" multiple className={fieldClass} onChange={(e) => setFiles(Array.from(e.target.files || []).map((file) => file.name))} /></label>
              {!!files.length && <ul className="mt-3 text-sm text-slate-400">{files.map((file) => <li key={file}>• {file}</li>)}</ul>}
              <p className="mt-3 text-xs text-slate-500">File names are included in the generated index. This prototype does not upload documents to a third-party service.</p>
            </div>

            <div className={panelClass}>
              <p className="eyebrow">Step 4</p><h2 className="text-2xl font-semibold text-white">Submission and deadlines</h2>
              <div className="mt-4 space-y-3">
                <label className="text-sm text-slate-300">Direct bureau dispute date<input type="date" className={fieldClass} value={dispute.disputeDate} onChange={(e) => update('disputeDate', e.target.value)} /></label>
                <label className="flex gap-2 text-sm text-slate-300"><input type="checkbox" checked={dispute.pending} onChange={(e) => update('pending', e.target.checked)} /> Dispute is still pending</label>
                <div className="rounded-xl bg-slate-950 p-4 text-sm text-slate-300">
                  <p>30-day target: <strong className="text-white">{deadline30 || 'Not calculated'}</strong></p>
                  <p>45-day outer gate: <strong className="text-white">{deadline45 || 'Not calculated'}</strong></p>
                  <p>Days elapsed: <strong className="text-white">{daysElapsed}</strong></p>
                  <p>CFPB status: <strong className={cfpbEligible ? 'text-emerald-400' : 'text-amber-400'}>{cfpbEligible ? 'Eligible for escalation review' : 'Not yet eligible'}</strong></p>
                </div>
                <button className="button-secondary w-full" disabled={!requiredReady} onClick={generatePackage}>Generate complete dispute package</button>
                <a className={`button-secondary flex justify-center ${cfpbEligible ? '' : 'pointer-events-none opacity-50'}`} href="https://www.consumerfinance.gov/complaint/" target="_blank" rel="noreferrer">Open official CFPB filing</a>
                <button className="text-sm text-slate-400 underline" onClick={() => { setDispute(initialDispute); setFiles([]); setPackageStatus('Workspace reset.'); }}>Reset workspace</button>
                {packageStatus && <p className="text-sm text-slate-300">{packageStatus}</p>}
              </div>
            </div>
          </div>

          <div className={panelClass}>
            <p className="eyebrow">Step 5</p><h2 className="text-2xl font-semibold text-white">CFPB complaint intelligence</h2>
            <div className="mt-4 flex gap-2"><input className={fieldClass} value={company} onChange={(e) => setCompany(e.target.value)} /><button className="button-secondary" onClick={searchComplaints}>{complaintLoading ? 'Searching…' : 'Search'}</button></div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {complaints.map((item) => <article key={item.complaint_id} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300"><p className="font-semibold text-white">{item.issue || item.product}</p><p>{item.company} · {item.date_received}</p><p>Response: {item.company_response || 'Not listed'} · Timely: {item.timely || 'Unknown'}</p></article>)}
              {!complaints.length && <p className="text-sm text-slate-400">Search published complaints to identify recurring issues and company response patterns.</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className={panelClass}><p className="eyebrow">Case intake</p><h2 className="text-2xl font-semibold text-white">Citibank defense checklist</h2><div className="mt-4 space-y-3 text-sm text-slate-300">{['Citation or summons and service date','Petition and every exhibit','Exact Citi card agreement and change-in-terms notices','Account statements, payments, credits, and dispute history','Court, county, cause number, answer deadline, and hearing dates'].map((item) => <label key={item} className="flex gap-2"><input type="checkbox" /> {item}</label>)}<div className="rounded-xl bg-slate-950 p-4"><p className="font-semibold text-white">Automated issue spotting</p><p>Arbitration clause, limitations, service defects, standing, contract proof, business records, balance calculation, unauthorized charges, conditions precedent, and settlement posture.</p></div></div></div>
          <div className={panelClass}><p className="eyebrow">Case-law research</p><h2 className="text-2xl font-semibold text-white">CourtListener search</h2><div className="mt-4 flex gap-2"><input className={fieldClass} value={caseQuery} onChange={(e) => setCaseQuery(e.target.value)} /><button className="button-secondary" onClick={searchCases}>{caseLoading ? 'Searching…' : 'Search'}</button></div><div className="mt-4 space-y-3">{cases.map((item) => <article key={`${item.id}-${item.caseName}`} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300"><a className="font-semibold text-white underline" href={item.absolute_url ? `https://www.courtlistener.com${item.absolute_url}` : '#'} target="_blank" rel="noreferrer">{item.caseName || 'Untitled opinion'}</a><p>{item.court} · {item.dateFiled}</p><p>{item.citation?.join(', ')}</p></article>)}{!cases.length && <p className="text-sm text-slate-400">Search opinions involving Citibank, arbitration, debt collection, Texas limitations, and proof of contract.</p>}</div></div>
        </div>
      )}
    </section>
  );
}
