'use client';

import { useState } from 'react';

const panelClass = 'rounded-2xl border border-slate-800 bg-slate-900/70 p-5';
const fieldClass = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white';

const equifaxLetter = `Re: Equifax bankruptcy public-record dispute\n\nConsumer: Tomas Nieves\nBankruptcy court: United States Bankruptcy Court, Eastern District of Texas\nCase number: 25-42914\nChapter: Chapter 7\nJudge: Brenda T. Rhoades\nDischarge entered: January 7, 2026\n\nI dispute the accuracy and completeness of the bankruptcy public record appearing on my Equifax credit report. Equifax reports a filing date of September 1, 2025, while TransUnion and Experian report September 30, 2025 for the same bankruptcy case. Equifax also omits the January 7, 2026 discharge or closing date shown by the other bureaus and supported by the court discharge order.\n\nPlease conduct a reasonable reinvestigation using the official court record for case 25-42914, identify the exact source and vendor used for each reported field, and correct or delete every inaccurate or unverifiable field. Please send me an updated credit report and the written results of your investigation.\n\nImportant: the discharge order confirms the case number and discharge date, but the exact petition filing date must be confirmed from the petition or PACER docket before asserting which bureau date is correct.\n\nAttachments should include the discharge order, the IdentityIQ public-record page showing the bureau discrepancies, the petition or PACER docket confirming the filing date, identification, and proof of address.`;

const boaLetter = `Re: Bank of America account reporting after Chapter 7 discharge\n\nMy Chapter 7 bankruptcy in the Eastern District of Texas, case 25-42914, was discharged on January 7, 2026. The Equifax account entry for Bank of America reportedly shows a balance of $10,849, a past-due amount of $10,849, a Collection/Chargeoff status, and a last-reported date of February 1, 2026.\n\nIf this account was included in and discharged through the bankruptcy, reporting an outstanding balance and past-due amount after discharge is inaccurate and materially misleading. Please investigate and update the account to reflect a $0 balance, $0 past due, and an accurate bankruptcy status, or delete the tradeline if the information cannot be verified. Please also confirm that no post-petition delinquency or re-aging is being reported.`;

const verificationLetter = `Pursuant to 15 U.S.C. § 1681i(a)(6)(B)(iii) and § 1681i(a)(7), please provide a description of the procedure used to determine the accuracy and completeness of the disputed bankruptcy information. Identify the business name, address, and telephone number of every public-record vendor, court-record source, furnisher, or database contacted; the date of verification; the fields verified; and the method used to match the bankruptcy record to my consumer file. Please also identify whether LexisNexis, PACER, or another vendor or electronic court-record source was used.\n\nThis request seeks the procedure and sources used after the reinvestigation; it is not a demand for an original signed contract.`;

const cfpbNarrative = `I disputed inaccurate and incomplete bankruptcy reporting with Equifax concerning Chapter 7 case 25-42914 in the Eastern District of Texas. The official discharge order, signed by Judge Brenda T. Rhoades, shows a discharge entered January 7, 2026. Equifax reports a filing date of September 1, 2025, while TransUnion and Experian report September 30, 2025 for the same case. Equifax also omits the discharge or closing date reported by the other bureaus. I supplied supporting court records and requested a reasonable reinvestigation.\n\nI also disputed post-discharge reporting by Bank of America because Equifax reportedly shows a $10,849 balance and $10,849 past-due amount with a February 1, 2026 reporting date, after the January 7, 2026 discharge. If the account was included in the bankruptcy, those amounts are inaccurate and misleading.\n\nAdditional account-level review identified Pentagon Federal Credit Union payment-history charge-off coding after bankruptcy inclusion as an item requiring verification, and Citi tradelines requiring a date-of-first-delinquency and re-aging audit even though the reported balances are $0.\n\nI request correction or deletion of every inaccurate or unverifiable bankruptcy field, correction of all included accounts to $0 balance and $0 past due where applicable, an updated credit report, and a complete description of the verification procedure and sources used.`;

const sourceFiles = [
  'Creditors_Full_Matrix_v5.xlsx',
  'Creditors_Full_Matrix_v7_COMBINED_FINAL.xlsx',
  'Creditors_Full_Matrix_MASTER_COMBINED.xlsx',
  '15267739_106977027_docimage_actual.pdf',
  'Credit Report - IdentityIQ.pdf',
  '12 - Order Discharging Debtor 01.07.26.pdf',
];

export default function BankruptcyCaseStrategy() {
  const [active, setActive] = useState<'strategy' | 'sources' | 'equifax' | 'boa' | 'verification' | 'cfpb'>('strategy');
  const copy = (text: string) => navigator.clipboard.writeText(text);

  const drafts = {
    equifax: equifaxLetter,
    boa: boaLetter,
    verification: verificationLetter,
    cfpb: cfpbNarrative,
  } as const;

  return (
    <section className="mx-auto max-w-6xl space-y-5 px-4 pb-16">
      <div className={panelClass}>
        <p className="eyebrow">Imported from Bankruptcy_Dispute_Guide</p>
        <h2 className="text-3xl font-semibold text-white">Tomas Chapter 7 Two-Track Strategy</h2>
        <p className="mt-2 text-sm text-slate-300">Source-derived facts: Eastern District of Texas, case 25-42914, Judge Brenda T. Rhoades, discharge entered January 7, 2026; Equifax filing-date discrepancy; missing discharge or closing date; reported Bank of America post-discharge balance and past-due amounts; Pentagon FCU payment-history review; and Citi re-aging review.</p>
        <div className="mt-4 rounded-xl bg-amber-950 p-4 text-sm text-amber-200"><strong>Verification gate:</strong> the discharge order confirms the case number and discharge date, but it does not independently establish whether the actual petition filing date was September 1 or September 30, 2025. The portal requires the petition or PACER docket before asserting that Equifax’s date is wrong.</div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-950 p-2">
        {[
          ['strategy', 'Strategy'],
          ['sources', 'Source inventory'],
          ['equifax', 'Equifax bankruptcy dispute'],
          ['boa', 'Bank of America cleanup'],
          ['verification', 'Method of verification'],
          ['cfpb', 'CFPB escalation'],
        ].map(([value, label]) => <button key={value} onClick={() => setActive(value as typeof active)} className={`rounded-xl px-4 py-2 text-sm font-semibold ${active === value ? 'bg-white text-slate-950' : 'text-slate-300'}`}>{label}</button>)}
      </div>

      {active === 'strategy' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className={panelClass}>
            <h3 className="text-xl font-semibold text-white">Track 1: High-probability cleanup</h3>
            <ol className="mt-4 space-y-2 text-sm text-slate-300">
              <li>1. Confirm the true petition filing date from the petition or PACER docket.</li>
              <li>2. If September 30, 2025 is confirmed, dispute Equifax’s September 1, 2025 filing date.</li>
              <li>3. Dispute the missing January 7, 2026 discharge or closing date.</li>
              <li>4. Dispute Bank of America’s reported $10,849 balance and $10,849 past due after discharge, if the account was included.</li>
              <li>5. Audit Pentagon FCU for post-petition charge-off coding and Citi for date-of-first-delinquency movement or re-aging.</li>
              <li>6. Audit every included account for nonzero balances, post-petition delinquencies, charge-off coding, and re-aging.</li>
            </ol>
          </div>
          <div className={panelClass}>
            <h3 className="text-xl font-semibold text-white">Track 2: Public-record deletion attempt</h3>
            <ol className="mt-4 space-y-2 text-sm text-slate-300">
              <li>1. Complete the factual Equifax dispute first.</li>
              <li>2. If verified without correction, request the reinvestigation procedure and exact source or vendor.</li>
              <li>3. Compare the response with the petition, PACER docket, discharge order, and bureau discrepancies.</li>
              <li>4. Escalate unresolved inaccuracies to the CFPB with highlighted report pages and court records.</li>
              <li>5. Seek deletion only for inaccurate, incomplete, mixed-file, obsolete, or unverifiable reporting, not merely because the bankruptcy was discharged.</li>
            </ol>
          </div>
        </div>
      )}

      {active === 'sources' && (
        <div className={panelClass}>
          <h3 className="text-xl font-semibold text-white">Project source inventory</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">{sourceFiles.map((file) => <li key={file}>• {file}</li>)}</ul>
          <p className="mt-4 text-sm text-slate-400">The current portal content is grounded in the project extract supplied in chat. The underlying binary files are listed here but are not embedded in the repository.</p>
        </div>
      )}

      {active !== 'strategy' && active !== 'sources' && (
        <div className={panelClass}>
          <textarea className={`${fieldClass} font-mono`} rows={22} readOnly value={drafts[active]} />
          <div className="mt-3 flex flex-wrap gap-3">
            <button className="button-secondary" onClick={() => copy(drafts[active])}>Copy draft</button>
            {active === 'cfpb' && <a className="button-secondary" href="https://www.consumerfinance.gov/complaint/" target="_blank" rel="noreferrer">Open CFPB complaint</a>}
          </div>
        </div>
      )}
    </section>
  );
}
