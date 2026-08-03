'use client';

import { useMemo, useState } from 'react';

type Target = {
  creditor: string;
  account: string;
  bureau: string;
  priority: 'Tier 1' | 'Tier 2' | 'Review';
  issue: string;
  requested: string;
  address?: string;
};

const targets: Target[] = [
  { creditor: 'Bank of America credit card', account: 'ending 6391', bureau: 'Equifax', priority: 'Tier 1', issue: '$10,849 balance, $10,849 past due, Collection/Chargeoff after Chapter 7 discharge; TU and EX show $0.', requested: 'Correct to $0 balance and $0 past due with accurate bankruptcy status, or delete if unverifiable.', address: 'P.O. Box 982238, El Paso, TX 79998' },
  { creditor: 'Bank of America auto loan', account: 'ending 6839', bureau: 'Equifax', priority: 'Tier 1', issue: 'Open status, $49,826 balance, $3,341 past due, Late 90 Days; TU and EX show $0.', requested: 'Correct open/delinquent fields and balances to accurate post-bankruptcy treatment, or delete if unverifiable.', address: 'P.O. Box 45144, Jacksonville, FL 32231' },
  { creditor: 'Citi authorized user', account: 'ending 9166', bureau: 'TransUnion / Equifax', priority: 'Tier 1', issue: 'Authorized-user tradeline reports charge-off or 120-day late with balances and past-due amounts.', requested: 'Verify authorized-user liability and accuracy; remove or correct derogatory treatment and balances.', address: 'P.O. Box 6190, Sioux Falls, SD 57117' },
  { creditor: 'JPMCB / Chase', account: 'multiple tradelines', bureau: 'Experian / Equifax', priority: 'Tier 2', issue: 'Collection/Chargeoff language and inconsistent bankruptcy coding across bureaus.', requested: 'Correct misleading charge-off or collection coding and align with verified bankruptcy treatment.', address: 'P.O. Box 15369, Wilmington, DE 19850' },
  { creditor: 'FB&T / Mercury', account: 'ending 001525', bureau: 'Experian', priority: 'Tier 2', issue: 'Late 30 Days / charge-off style treatment despite bankruptcy coding.', requested: 'Correct inaccurate late or charge-off treatment after bankruptcy inclusion.', address: 'P.O. Box 84064, Columbus, GA 31908' },
  { creditor: 'Pentagon FCU', account: 'multiple tradelines', bureau: 'Experian / Equifax', priority: 'Tier 2', issue: 'Sold/transfer, charge-off, current and bankruptcy-coded fields are inconsistent.', requested: 'Verify ownership, transfer history, balance, and payment-history coding; correct or delete inaccuracies.', address: 'P.O. Box 1432, Alexandria, VA 22313' },
  { creditor: 'Texas Dow CU', account: 'mortgage / line of credit', bureau: 'All bureaus', priority: 'Review', issue: 'Post-bankruptcy activity and current-looking fields require comparison with reaffirmation, retained collateral, and actual payments.', requested: 'Dispute only fields contradicted by court records or payment history.', address: '2000 Post Oak Blvd Ste 2100, Houston, TX 77056' },
  { creditor: 'Capital One', account: 'multiple revolving tradelines', bureau: 'Experian / Equifax', priority: 'Tier 2', issue: 'Charge-off or unknown treatment with bankruptcy comments and zero balances.', requested: 'Correct any misleading derogatory coding, status, or activity dates.', address: 'P.O. Box 31293, Salt Lake City, UT 84131' },
];

const fieldClass = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white';
const panelClass = 'rounded-2xl border border-slate-800 bg-slate-900/70 p-5';

export default function BankruptcyTradelineMatrix() {
  const [bureau, setBureau] = useState('All');
  const [priority, setPriority] = useState('All');
  const [selected, setSelected] = useState<Target | null>(targets[0]);

  const filtered = useMemo(() => targets.filter((item) => {
    const bureauMatch = bureau === 'All' || item.bureau.includes(bureau);
    const priorityMatch = priority === 'All' || item.priority === priority;
    return bureauMatch && priorityMatch;
  }), [bureau, priority]);

  const letter = selected ? `Tomas Nieves\n7421 Willow Thorne Dr\nAubrey, TX 76227\n\nDate: ${new Date().toLocaleDateString()}\n\n${selected.creditor}\n${selected.address || '[Dispute address]'}\n\nRe: Direct dispute regarding ${selected.account}\n\nTo Whom It May Concern:\n\nI am disputing inaccurate or misleading reporting concerning the above account. I filed Chapter 7 bankruptcy on September 30, 2025 and received a discharge on January 7, 2026.\n\nSpecific issue: ${selected.issue}\n\nRequested resolution: ${selected.requested}\n\nPlease conduct a reasonable investigation, review the bankruptcy discharge and supporting credit-report pages, and notify each consumer reporting agency of every correction. Please provide written confirmation of the investigation and the changes made.\n\nAttachments: identification, proof of address, discharge order, creditor matrix or schedule if applicable, and highlighted report pages.\n\nSincerely,\nTomas Nieves` : '';

  return (
    <section className="mx-auto max-w-6xl space-y-5 px-4 pb-16">
      <div className={panelClass}>
        <p className="eyebrow">Three-bureau tradeline audit</p>
        <h2 className="text-3xl font-semibold text-white">Account-by-Account Dispute Matrix</h2>
        <p className="mt-2 text-sm text-slate-300">Prioritizes factual post-bankruptcy reporting issues rather than generic requests to delete accurate bankruptcy information.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div className={panelClass}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-slate-300">Bureau<select className={fieldClass} value={bureau} onChange={(e) => setBureau(e.target.value)}><option>All</option><option>Equifax</option><option>Experian</option><option>TransUnion</option></select></label>
            <label className="text-sm text-slate-300">Priority<select className={fieldClass} value={priority} onChange={(e) => setPriority(e.target.value)}><option>All</option><option>Tier 1</option><option>Tier 2</option><option>Review</option></select></label>
          </div>
          <div className="mt-4 space-y-3">
            {filtered.map((item) => (
              <button key={`${item.creditor}-${item.account}-${item.bureau}`} onClick={() => setSelected(item)} className={`w-full rounded-xl border p-4 text-left ${selected === item ? 'border-white bg-slate-800' : 'border-slate-800 bg-slate-950'}`}>
                <div className="flex items-start justify-between gap-3"><strong className="text-white">{item.creditor}</strong><span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">{item.priority}</span></div>
                <p className="mt-1 text-xs text-slate-400">{item.account} · {item.bureau}</p>
                <p className="mt-2 text-sm text-slate-300">{item.issue}</p>
              </button>
            ))}
          </div>
        </div>

        <div className={panelClass}>
          <h3 className="text-xl font-semibold text-white">Prefilled direct furnisher dispute</h3>
          <textarea className={`${fieldClass} mt-4 font-mono`} rows={24} readOnly value={letter} />
          <button className="button-secondary mt-3" onClick={() => navigator.clipboard.writeText(letter)}>Copy dispute</button>
          <div className="mt-5 rounded-xl bg-slate-950 p-4 text-sm text-slate-300">
            <strong className="text-white">Exhibit checklist</strong>
            <ul className="mt-2 space-y-1">
              <li>• Driver’s license or other government ID</li>
              <li>• Proof of current address</li>
              <li>• January 7, 2026 discharge order</li>
              <li>• Bankruptcy creditor matrix or schedule</li>
              <li>• Only the highlighted report pages for this tradeline</li>
              <li>• Certified-mail receipt and tracking record</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
