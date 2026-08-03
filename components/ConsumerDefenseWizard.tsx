'use client';

import { useMemo, useState } from 'react';

const steps = [
  'Case profile',
  'Documents',
  'Bankruptcy audit',
  'Tradeline audit',
  'Recommended strategy',
  'Bureau letters',
  'Furnisher letters',
  'Verification follow-up',
  'CFPB escalation',
  'Tracking',
];

const card = 'rounded-2xl border border-slate-800 bg-slate-900/80 p-5';
const input = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white';

const profile = {
  name: 'Tomas Nieves',
  address: '7421 Willow Thorne Dr, Aubrey, TX 76227',
  reportReference: 'M71869293',
  court: 'U.S. Bankruptcy Court, Eastern District of Texas',
  location: 'Plano Division',
  caseNumber: '25-42914',
  chapter: 'Chapter 7',
  judge: 'Brenda T. Rhoades',
  filingDateClaimed: 'September 30, 2025',
  dischargeDate: 'January 7, 2026',
};

const targets = [
  ['Equifax bankruptcy record', 'Equifax', 'Reported filing date 09/01/2025; TU and Experian show 09/30/2025. Equifax also omits the 01/07/2026 closing/discharge date.', 'Confirm the true petition date from the petition or PACER docket, then correct or delete inaccurate or unverifiable fields.'],
  ['Bank of America credit card ending 6391', 'Equifax', '$10,849 balance and $10,849 past due after discharge; TU and Experian show $0.', 'Correct to $0 balance and $0 past due with accurate bankruptcy status, or delete if unverifiable.'],
  ['Bank of America auto loan ending 6839', 'Equifax', 'Open status, $49,826 balance, $3,341 past due, Late 90 Days; TU and Experian show $0.', 'Correct open, delinquency, balance, and past-due fields, subject to reaffirmation or collateral treatment.'],
  ['Citi authorized-user account ending 9166', 'TransUnion and Equifax', 'Charge-off or 120-day late treatment with balances and past-due amounts on an authorized-user tradeline.', 'Verify authorized-user status and liability; remove or correct derogatory treatment.'],
  ['JPMCB / Chase tradelines', 'Experian and Equifax', 'Collection/Chargeoff language and inconsistent bankruptcy coding.', 'Correct misleading charge-off or collection coding and inaccurate activity dates.'],
  ['FB&T / Mercury', 'Experian', 'Late 30 Days or charge-off style treatment despite bankruptcy coding.', 'Correct any inaccurate late or charge-off treatment.'],
  ['Pentagon FCU', 'Experian and Equifax', 'Sold, transferred, charge-off, current, and bankruptcy-coded fields are inconsistent.', 'Verify ownership, transfer history, balances, and payment-history coding.'],
  ['Texas Dow mortgage and line of credit', 'All bureaus', 'Current-looking or post-bankruptcy activity may depend on retained collateral, reaffirmation, or continued payment.', 'Do not dispute until treatment is confirmed.'],
];

const bureauAddresses: Record<string, string> = {
  Equifax: 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374-0256',
  Experian: 'Experian\nP.O. Box 4500\nAllen, TX 75013',
  TransUnion: 'TransUnion Consumer Solutions\nP.O. Box 2000\nChester, PA 19016-2000',
};

const furnisherAddresses: Record<string, string> = {
  'Bank of America': 'P.O. Box 982238, El Paso, TX 79998',
  'Bank of America Auto': 'P.O. Box 45144, Jacksonville, FL 32231',
  Citi: 'P.O. Box 6190, Sioux Falls, SD 57117',
  JPMCB: 'P.O. Box 15369, Wilmington, DE 19850',
  'Capital One': 'P.O. Box 31293, Salt Lake City, UT 84131',
  'FB&T / Mercury': 'P.O. Box 84064, Columbus, GA 31908',
  'Pentagon FCU': 'P.O. Box 1432, Alexandria, VA 22313',
  'Texas Dow CU': '2000 Post Oak Blvd Ste 2100, Houston, TX 77056',
};

function bureauLetter(bureau: string) {
  const items = targets.filter((item) => item[1].includes(bureau));
  return `${profile.name}\n${profile.address}\n\nDate: ${new Date().toLocaleDateString()}\n\n${bureauAddresses[bureau]}\n\nRe: Direct dispute of inaccurate bankruptcy-related reporting\nCredit report reference: ${profile.reportReference}\n\nTo Whom It May Concern:\n\nI am disputing specific inaccurate or incomplete information on my ${bureau} credit report. I filed ${profile.chapter} in ${profile.court}, case ${profile.caseNumber}, and the court entered a discharge on ${profile.dischargeDate}.\n\nThe disputed items are:\n\n${items.map((item, index) => `${index + 1}. ${item[0]}\nReported problem: ${item[2]}\nRequested correction: ${item[3]}`).join('\n\n')}\n\nPlease conduct a reasonable reinvestigation, review all attached court and credit-report documents, and correct or delete each item that is inaccurate, incomplete, or cannot be verified. Please send me the written results and an updated credit report.\n\nAttachments: government ID, proof of address, discharge order, petition or PACER docket if available, creditor matrix or schedules, and highlighted report pages.\n\nSincerely,\n${profile.name}`;
}

function furnisherLetter(name: string) {
  const matching = targets.filter((item) => item[0].toLowerCase().includes(name.toLowerCase().split(' ')[0]));
  return `${profile.name}\n${profile.address}\n\nDate: ${new Date().toLocaleDateString()}\n\n${name}\n${furnisherAddresses[name] || '[Use dispute address shown on the report]'}\n\nRe: Direct furnisher dispute after Chapter 7 discharge\n\nTo Whom It May Concern:\n\nI dispute your reporting of the account or accounts identified in the attached credit-report pages. I filed ${profile.chapter} in ${profile.court}, case ${profile.caseNumber}, and received a discharge on ${profile.dischargeDate}.\n\n${matching.length ? matching.map((item) => `Reported problem: ${item[2]}\nRequested correction: ${item[3]}`).join('\n\n') : 'Please investigate every inaccurate balance, past-due amount, delinquency, charge-off status, open status, activity date, or bankruptcy notation identified in the attached pages.'}\n\nPlease investigate, review the discharge order and supporting documents, notify every consumer reporting agency of all corrections, and provide written confirmation of your findings.\n\nSincerely,\n${profile.name}`;
}

export default function ConsumerDefenseWizard() {
  const [step, setStep] = useState(0);
  const [bureau, setBureau] = useState('Equifax');
  const [furnisher, setFurnisher] = useState('Bank of America');
  const [disputeDate, setDisputeDate] = useState('');
  const [status, setStatus] = useState('Not started');

  const daysElapsed = useMemo(() => {
    if (!disputeDate) return 0;
    return Math.max(0, Math.floor((Date.now() - new Date(`${disputeDate}T00:00:00`).getTime()) / 86400000));
  }, [disputeDate]);

  const cfpbReady = Boolean(disputeDate && (daysElapsed >= 45 || status === 'Completed'));
  const copy = (text: string) => navigator.clipboard.writeText(text);

  const verificationText = `Tomas Nieves\n7421 Willow Thorne Dr\nAubrey, TX 76227\n\nDate: ${new Date().toLocaleDateString()}\n\nRe: Request for description of reinvestigation procedure\n\nPursuant to 15 U.S.C. § 1681i(a)(6)(B)(iii) and § 1681i(a)(7), please provide a description of the procedure used to determine the accuracy and completeness of each disputed bankruptcy-related item, including the business name, address, and telephone number of every furnisher, public-record vendor, court-record source, database, or other source contacted; the date of verification; the fields verified; and the method used to match the information to my file. Please identify whether LexisNexis, PACER, or another electronic court-record source was used.`;

  const cfpbText = `I disputed inaccurate and incomplete bankruptcy-related reporting concerning my Chapter 7 case, ${profile.caseNumber}, in the Eastern District of Texas. The court entered a discharge on ${profile.dischargeDate}. My three-bureau report contains material inconsistencies, including an Equifax bankruptcy filing date of September 1, 2025 while TransUnion and Experian report September 30, 2025; Equifax also omits the January 7, 2026 discharge or closing date.\n\nThe report also contains account-level inconsistencies, including a Bank of America credit card showing $10,849 balance and $10,849 past due on Equifax while the other bureaus show $0, and a Bank of America auto loan showing open status, $49,826 balance, $3,341 past due, and 90-days-late treatment on Equifax while TransUnion and Experian show $0. Additional disputed items include a Citi authorized-user tradeline, JPMCB, FB&T/Mercury, Pentagon FCU, Capital One, and other bankruptcy-coded accounts with inconsistent balances, statuses, or payment-history treatment.\n\nI supplied supporting documents and requested a reasonable reinvestigation. I request correction or deletion of every inaccurate, incomplete, misleading, or unverifiable field, updated reports, and a complete explanation of the verification procedure and sources used.`;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <div className={`${card} mb-5`}>
        <p className="eyebrow">Guided founder workflow</p>
        <h1 className="text-3xl font-semibold text-white">Consumer Defense Lab</h1>
        <p className="mt-2 text-slate-300">Complete one step at a time. Your known information is already filled in.</p>
      </div>

      <div className="mb-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-2">
        <div className="flex min-w-max gap-2">
          {steps.map((label, index) => <button key={label} onClick={() => setStep(index)} className={`rounded-xl px-3 py-2 text-sm ${step === index ? 'bg-white font-semibold text-slate-950' : 'text-slate-300'}`}>{index + 1}. {label}</button>)}
        </div>
      </div>

      {step === 0 && <div className={card}><h2 className="text-2xl font-semibold text-white">Your case profile</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{Object.entries(profile).map(([key, value]) => <div key={key} className="rounded-xl bg-slate-950 p-3"><p className="text-xs uppercase text-slate-500">{key.replace(/([A-Z])/g, ' $1')}</p><p className="mt-1 text-sm text-white">{value}</p></div>)}</div><div className="mt-4 rounded-xl bg-amber-950 p-4 text-sm text-amber-200"><strong>Important:</strong> I found a discharge order, not a dismissal order. A dismissal and a discharge are different. The portal will not call the case dismissed unless you provide an actual dismissal order.</div></div>}

      {step === 1 && <div className={card}><h2 className="text-2xl font-semibold text-white">Source documents</h2><div className="mt-4 space-y-3 text-sm text-slate-300">{['12 - Order Discharging Debtor 01.07.26.pdf — confirmed source','Credit Report - IdentityIQ.pdf — confirmed source','Three Bureau Credit Report, reference M71869293 — confirmed source','Creditor matrix spreadsheets — referenced source','Petition or PACER docket showing exact filing date — missing','Dismissal order — not found; likely confused with discharge order','Reaffirmation agreements or surrender records for secured debts — missing'].map((item) => <div key={item} className="rounded-xl bg-slate-950 p-3">{item}</div>)}</div></div>}

      {step === 2 && <div className={card}><h2 className="text-2xl font-semibold text-white">Bankruptcy public-record audit</h2><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm text-slate-300"><thead><tr className="border-b border-slate-800"><th className="p-2">Field</th><th className="p-2">TransUnion</th><th className="p-2">Experian</th><th className="p-2">Equifax</th><th className="p-2">Assessment</th></tr></thead><tbody>{[['Status','Discharged','Discharged','Discharged','Consistent'],['Filed / reported','09/30/2025','09/30/2025','09/01/2025','Conflict; verify with petition or PACER'],['Closing date','01/07/2026','01/07/2026','Missing','Incomplete on Equifax'],['Reference','2542914','2542914BTR','2542914-DSP-01/26','Formatting differs; not automatically inaccurate'],['Court','U.S. Bankruptcy Court','US BKPT CT TX PLANO','Federal','Equifax is less specific']].map((row) => <tr key={row[0]} className="border-b border-slate-900">{row.map((cell) => <td key={cell} className="p-2">{cell}</td>)}</tr>)}</tbody></table></div></div>}

      {step === 3 && <div className={card}><h2 className="text-2xl font-semibold text-white">Account and tradeline audit</h2><div className="mt-4 space-y-3">{targets.map((item, index) => <div key={item[0]} className="rounded-xl bg-slate-950 p-4"><div className="flex items-start justify-between gap-3"><strong className="text-white">{index + 1}. {item[0]}</strong><span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">{item[1]}</span></div><p className="mt-2 text-sm text-slate-300">{item[2]}</p><p className="mt-2 text-sm text-emerald-300">Next action: {item[3]}</p></div>)}</div></div>}

      {step === 4 && <div className={card}><h2 className="text-2xl font-semibold text-white">Recommended order</h2><ol className="mt-4 space-y-3 text-sm text-slate-300">{['Confirm the exact petition filing date from the petition or PACER docket.','Confirm whether the Bank of America auto loan and Texas Dow secured accounts were reaffirmed, surrendered, retained, or paid voluntarily.','Send the targeted Equifax dispute first for the public-record conflict and strongest balance/status errors.','Send direct furnisher disputes to Bank of America, Citi, JPMCB, Capital One, FB&T/Mercury, Pentagon FCU, and Texas Dow where supported.','Send Experian and TransUnion disputes focused only on bureau-specific inaccurate fields.','After results, request the method of verification for unresolved items.','File the CFPB complaint only after the bureau dispute is completed or 45 days have elapsed.'].map((item, index) => <li key={item} className="rounded-xl bg-slate-950 p-3"><strong className="text-white">{index + 1}.</strong> {item}</li>)}</ol></div>}

      {step === 5 && <div className={card}><h2 className="text-2xl font-semibold text-white">Prefilled bureau letter</h2><label className="mt-4 block text-sm text-slate-300">Choose bureau<select className={input} value={bureau} onChange={(e) => setBureau(e.target.value)}><option>Equifax</option><option>Experian</option><option>TransUnion</option></select></label><textarea className={`${input} mt-4 font-mono`} rows={24} readOnly value={bureauLetter(bureau)} /><button className="button-secondary mt-3" onClick={() => copy(bureauLetter(bureau))}>Copy complete letter</button></div>}

      {step === 6 && <div className={card}><h2 className="text-2xl font-semibold text-white">Prefilled furnisher letter</h2><label className="mt-4 block text-sm text-slate-300">Choose company<select className={input} value={furnisher} onChange={(e) => setFurnisher(e.target.value)}>{Object.keys(furnisherAddresses).map((name) => <option key={name}>{name}</option>)}</select></label><textarea className={`${input} mt-4 font-mono`} rows={22} readOnly value={furnisherLetter(furnisher)} /><button className="button-secondary mt-3" onClick={() => copy(furnisherLetter(furnisher))}>Copy complete letter</button></div>}

      {step === 7 && <div className={card}><h2 className="text-2xl font-semibold text-white">Method-of-verification follow-up</h2><p className="mt-2 text-sm text-slate-300">Use this only after the bureau completes its reinvestigation and verifies an item you still dispute.</p><textarea className={`${input} mt-4 font-mono`} rows={15} readOnly value={verificationText} /><button className="button-secondary mt-3" onClick={() => copy(verificationText)}>Copy follow-up</button></div>}

      {step === 8 && <div className={card}><h2 className="text-2xl font-semibold text-white">CFPB escalation</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm text-slate-300">Date direct dispute was filed<input type="date" className={input} value={disputeDate} onChange={(e) => setDisputeDate(e.target.value)} /></label><label className="text-sm text-slate-300">Bureau dispute status<select className={input} value={status} onChange={(e) => setStatus(e.target.value)}><option>Not started</option><option>Pending</option><option>Completed</option></select></label></div><div className={`mt-4 rounded-xl p-4 text-sm ${cfpbReady ? 'bg-emerald-950 text-emerald-200' : 'bg-amber-950 text-amber-200'}`}>{cfpbReady ? 'Eligible for CFPB escalation review.' : `Not ready yet. Days elapsed: ${daysElapsed}. The dispute must be completed or 45 days old.`}</div><textarea className={`${input} mt-4 font-mono`} rows={20} readOnly value={cfpbText} /><div className="mt-3 flex flex-wrap gap-3"><button className="button-secondary" onClick={() => copy(cfpbText)}>Copy CFPB narrative</button><a className={`button-secondary ${cfpbReady ? '' : 'pointer-events-none opacity-50'}`} href="https://www.consumerfinance.gov/complaint/" target="_blank" rel="noreferrer">Open CFPB complaint</a></div></div>}

      {step === 9 && <div className={card}><h2 className="text-2xl font-semibold text-white">Tracking checklist</h2><div className="mt-4 space-y-3 text-sm text-slate-300">{['Record certified-mail tracking number','Record delivery date','Calculate 30-day investigation target','Calculate possible 45-day target','Save bureau confirmation number','Upload or note bureau response','Compare updated report against original fields','Request method of verification if needed','Escalate to CFPB only when eligible','Preserve all documents for attorney review'].map((item) => <label key={item} className="flex gap-3 rounded-xl bg-slate-950 p-3"><input type="checkbox" /> {item}</label>)}</div></div>}

      <div className="mt-5 flex justify-between"><button className="button-secondary" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>Back</button><button className="button-primary" disabled={step === steps.length - 1} onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}>Next</button></div>
    </section>
  );
}
