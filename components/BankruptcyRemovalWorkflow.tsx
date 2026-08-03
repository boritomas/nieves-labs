'use client';

import { useMemo, useState } from 'react';

type BankruptcyCase = {
  consumerName: string;
  bureau: string;
  court: string;
  caseNumber: string;
  chapter: string;
  filingDate: string;
  dischargeDate: string;
  dismissalDate: string;
  reportStatus: string;
  reportChapter: string;
  reportFilingDate: string;
  reportDischargeDate: string;
  reportRemovalDate: string;
  sourceNamedByBureau: string;
  errorType: string;
  facts: string;
  requestedResolution: string;
};

const initialState: BankruptcyCase = {
  consumerName: '',
  bureau: 'Experian',
  court: '',
  caseNumber: '',
  chapter: 'Chapter 7',
  filingDate: '',
  dischargeDate: '',
  dismissalDate: '',
  reportStatus: '',
  reportChapter: '',
  reportFilingDate: '',
  reportDischargeDate: '',
  reportRemovalDate: '',
  sourceNamedByBureau: '',
  errorType: 'Incorrect status',
  facts: '',
  requestedResolution: 'Correct or delete every inaccurate or unverifiable bankruptcy field and send me an updated credit report.',
};

const fieldClass = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white';
const panelClass = 'rounded-2xl border border-slate-800 bg-slate-900/70 p-5';

function yearsAfter(date: string, years: number) {
  if (!date) return '';
  const value = new Date(`${date}T12:00:00`);
  value.setFullYear(value.getFullYear() + years);
  return value.toISOString().slice(0, 10);
}

export default function BankruptcyRemovalWorkflow() {
  const [data, setData] = useState<BankruptcyCase>(initialState);
  const [stage, setStage] = useState<'audit' | 'dispute' | 'verification' | 'cfpb'>('audit');

  const expectedRemoval = useMemo(() => yearsAfter(data.filingDate, data.chapter === 'Chapter 13' ? 7 : 10), [data.filingDate, data.chapter]);
  const mismatch = Boolean(
    (data.reportChapter && data.reportChapter !== data.chapter) ||
    (data.reportFilingDate && data.filingDate && data.reportFilingDate !== data.filingDate) ||
    (data.reportDischargeDate && data.dischargeDate && data.reportDischargeDate !== data.dischargeDate) ||
    (data.reportRemovalDate && expectedRemoval && data.reportRemovalDate !== expectedRemoval) ||
    (data.reportStatus && data.dismissalDate && !data.reportStatus.toLowerCase().includes('dismiss')) ||
    (data.reportStatus && data.dischargeDate && !data.reportStatus.toLowerCase().includes('discharg'))
  );

  function update<K extends keyof BankruptcyCase>(key: K, value: BankruptcyCase[K]) {
    setData((current) => ({ ...current, [key]: value }));
  }

  const disputeText = `Date: ${new Date().toLocaleDateString()}\n\nTo: ${data.bureau}\n\nRe: Bankruptcy public record dispute\nConsumer: ${data.consumerName || '[Consumer name]'}\nCourt: ${data.court || '[Court]'}\nCase number: ${data.caseNumber || '[Case number]'}\n\nI dispute the accuracy and completeness of the bankruptcy information appearing on my credit report. The court record reflects ${data.chapter || '[chapter]'} filed on ${data.filingDate || '[filing date]'}${data.dischargeDate ? ` and discharged on ${data.dischargeDate}` : ''}${data.dismissalDate ? ` and dismissed on ${data.dismissalDate}` : ''}. My credit report currently shows: ${data.reportStatus || '[reported status]'}, chapter ${data.reportChapter || '[reported chapter]'}, filing date ${data.reportFilingDate || '[reported filing date]'}, discharge date ${data.reportDischargeDate || '[reported discharge date]'}, and removal date ${data.reportRemovalDate || '[reported removal date]'}.\n\nSpecific error: ${data.errorType}. ${data.facts || '[State the specific factual conflict and supporting document.]'}\n\nPlease conduct a reasonable reinvestigation, review the attached court records and supporting documents, and ${data.requestedResolution}. Please identify the source relied upon for each disputed field and send the written results of your reinvestigation.\n\nSincerely,\n${data.consumerName || '[Consumer name]'}`;

  const methodText = `Pursuant to 15 U.S.C. § 1681i(a)(6)(B)(iii) and § 1681i(a)(7), please provide a description of the procedure used to determine the accuracy and completeness of the disputed bankruptcy information, including the business name, address, and telephone number of every furnisher, vendor, public-record source, or court-record source contacted. The source identified in your response was: ${data.sourceNamedByBureau || '[insert source named by bureau]'}.`;

  const cfpbText = `I previously disputed inaccurate bankruptcy information with ${data.bureau}. The bankruptcy court record for ${data.court || '[court]'}, case ${data.caseNumber || '[case number]'}, reflects ${data.chapter} filed on ${data.filingDate || '[date]'}${data.dischargeDate ? `, discharged on ${data.dischargeDate}` : ''}${data.dismissalDate ? `, dismissed on ${data.dismissalDate}` : ''}. The credit report continues to show conflicting information: ${data.reportStatus || '[status]'}, chapter ${data.reportChapter || '[chapter]'}, filing date ${data.reportFilingDate || '[date]'}, discharge date ${data.reportDischargeDate || '[date]'}, and removal date ${data.reportRemovalDate || '[date]'}. I supplied supporting court records and requested a reasonable reinvestigation. The bureau identified ${data.sourceNamedByBureau || '[source]'} as the source or verification path. The specific unresolved error is: ${data.errorType}. ${data.facts || '[facts]'}. I request correction or deletion of each inaccurate or unverifiable field, an updated report, and a complete explanation of the verification procedure used.`;

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <section className="mx-auto max-w-6xl space-y-5 px-4 pb-16">
      <div className={panelClass}>
        <p className="eyebrow">Bankruptcy credit-report workflow</p>
        <h2 className="text-3xl font-semibold text-white">Bankruptcy Accuracy & Removal Review</h2>
        <p className="mt-2 text-sm text-slate-300">Use this only for inaccurate, incomplete, mixed-file, obsolete, or unverifiable reporting. An accurate Chapter 7 filing is not automatically removable before the reporting period expires.</p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-950 p-2">
        {[
          ['audit', '1. Court vs. report audit'],
          ['dispute', '2. Initial dispute'],
          ['verification', '3. Method of verification'],
          ['cfpb', '4. CFPB escalation'],
        ].map(([value, label]) => (
          <button key={value} onClick={() => setStage(value as typeof stage)} className={`rounded-xl px-4 py-2 text-sm font-semibold ${stage === value ? 'bg-white text-slate-950' : 'text-slate-300'}`}>{label}</button>
        ))}
      </div>

      {stage === 'audit' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className={panelClass}>
            <h3 className="text-xl font-semibold text-white">Court record</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-slate-300">Consumer name<input className={fieldClass} value={data.consumerName} onChange={(e) => update('consumerName', e.target.value)} /></label>
              <label className="text-sm text-slate-300">Credit bureau<select className={fieldClass} value={data.bureau} onChange={(e) => update('bureau', e.target.value)}><option>Experian</option><option>Equifax</option><option>TransUnion</option></select></label>
              <label className="text-sm text-slate-300 sm:col-span-2">Bankruptcy court / district<input className={fieldClass} value={data.court} onChange={(e) => update('court', e.target.value)} /></label>
              <label className="text-sm text-slate-300">Case number<input className={fieldClass} value={data.caseNumber} onChange={(e) => update('caseNumber', e.target.value)} /></label>
              <label className="text-sm text-slate-300">Chapter<select className={fieldClass} value={data.chapter} onChange={(e) => update('chapter', e.target.value)}><option>Chapter 7</option><option>Chapter 13</option></select></label>
              <label className="text-sm text-slate-300">Filing date<input type="date" className={fieldClass} value={data.filingDate} onChange={(e) => update('filingDate', e.target.value)} /></label>
              <label className="text-sm text-slate-300">Discharge date<input type="date" className={fieldClass} value={data.dischargeDate} onChange={(e) => update('dischargeDate', e.target.value)} /></label>
              <label className="text-sm text-slate-300">Dismissal date<input type="date" className={fieldClass} value={data.dismissalDate} onChange={(e) => update('dismissalDate', e.target.value)} /></label>
              <div className="rounded-xl bg-slate-950 p-3 text-sm text-slate-300"><span>Expected removal date:</span><strong className="ml-2 text-white">{expectedRemoval || 'Enter filing date'}</strong></div>
            </div>
          </div>

          <div className={panelClass}>
            <h3 className="text-xl font-semibold text-white">Credit-report values</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-slate-300">Reported status<input className={fieldClass} value={data.reportStatus} onChange={(e) => update('reportStatus', e.target.value)} /></label>
              <label className="text-sm text-slate-300">Reported chapter<input className={fieldClass} value={data.reportChapter} onChange={(e) => update('reportChapter', e.target.value)} /></label>
              <label className="text-sm text-slate-300">Reported filing date<input type="date" className={fieldClass} value={data.reportFilingDate} onChange={(e) => update('reportFilingDate', e.target.value)} /></label>
              <label className="text-sm text-slate-300">Reported discharge date<input type="date" className={fieldClass} value={data.reportDischargeDate} onChange={(e) => update('reportDischargeDate', e.target.value)} /></label>
              <label className="text-sm text-slate-300">Reported removal date<input type="date" className={fieldClass} value={data.reportRemovalDate} onChange={(e) => update('reportRemovalDate', e.target.value)} /></label>
              <label className="text-sm text-slate-300">Error type<select className={fieldClass} value={data.errorType} onChange={(e) => update('errorType', e.target.value)}>{['Incorrect status','Wrong chapter','Wrong filing date','Wrong discharge or dismissal date','Wrong scheduled removal date','Mixed file / not my bankruptcy','Duplicate bankruptcy','Obsolete reporting','Unverifiable source'].map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="text-sm text-slate-300 sm:col-span-2">Supporting facts<textarea className={fieldClass} rows={4} value={data.facts} onChange={(e) => update('facts', e.target.value)} /></label>
            </div>
            <div className={`mt-4 rounded-xl p-4 text-sm ${mismatch ? 'bg-emerald-950 text-emerald-200' : 'bg-amber-950 text-amber-200'}`}>{mismatch ? 'Potential factual mismatch detected. Review the court documents and proceed only with supported errors.' : 'No clear mismatch detected yet. Accurate bankruptcy reporting should not be disputed as inaccurate.'}</div>
          </div>
        </div>
      )}

      {stage === 'dispute' && <div className={panelClass}><h3 className="text-xl font-semibold text-white">Auto-generated initial dispute</h3><textarea className={`${fieldClass} mt-4 font-mono`} rows={18} readOnly value={disputeText} /><button className="button-secondary mt-3" onClick={() => copy(disputeText)}>Copy dispute letter</button></div>}

      {stage === 'verification' && <div className={panelClass}><h3 className="text-xl font-semibold text-white">Method-of-verification request</h3><label className="mt-4 block text-sm text-slate-300">Source named by the bureau<input className={fieldClass} value={data.sourceNamedByBureau} onChange={(e) => update('sourceNamedByBureau', e.target.value)} placeholder="LexisNexis, PACER, court record vendor, or other source" /></label><textarea className={`${fieldClass} mt-4 font-mono`} rows={10} readOnly value={methodText} /><button className="button-secondary mt-3" onClick={() => copy(methodText)}>Copy verification request</button></div>}

      {stage === 'cfpb' && <div className={panelClass}><h3 className="text-xl font-semibold text-white">CFPB complaint narrative</h3><textarea className={`${fieldClass} mt-4 font-mono`} rows={16} readOnly value={cfpbText} /><div className="mt-3 flex flex-wrap gap-3"><button className="button-secondary" onClick={() => copy(cfpbText)}>Copy CFPB narrative</button><a className="button-secondary" href="https://www.consumerfinance.gov/complaint/" target="_blank" rel="noreferrer">Open official CFPB complaint</a></div></div>}
    </section>
  );
}
