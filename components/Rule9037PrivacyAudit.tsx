'use client';

import { useState } from 'react';

const items = [
  ['Social Security number', 'Only the last four digits should appear in public filings.'],
  ['Taxpayer ID number', 'Only the last four digits should appear in public filings.'],
  ['Date of birth', 'Only the year should appear in public filings.'],
  ['Minor children', 'Only initials should appear for non-debtor minors.'],
  ['Financial account numbers', 'Only the last four digits should appear in public filings.'],
];

export default function Rule9037PrivacyAudit() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const anyIssue = Object.values(checked).some(Boolean);

  const motionText = `United States Bankruptcy Court\nEastern District of Texas\nPlano Division\n\nIn re: Tomas Nieves\nCase No. 25-42914\n\nMOTION TO REDACT OR RESTRICT ACCESS TO PERSONAL IDENTIFIERS\n\nTomas Nieves respectfully requests relief under Federal Rule of Bankruptcy Procedure 9037. One or more publicly accessible filings appear to contain personal identifiers beyond the limits permitted by Rule 9037. The affected filing(s), docket number(s), and specific identifiers should be listed in an attached schedule.\n\nRequested relief:\n1. Temporarily restrict public access to the affected filing(s).\n2. Permit or require filing of properly redacted replacement documents.\n3. Preserve an unredacted copy under seal only as the Court directs.\n4. Grant any additional protective relief the Court finds appropriate.\n\nThis request concerns privacy protection for court filings. It does not ask the Court to order deletion of accurate credit-report information.\n\nRespectfully submitted,\nTomas Nieves`;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <p className="eyebrow">Video claim reviewed</p>
        <h2 className="text-2xl font-semibold text-white">Rule 9037 Privacy Audit</h2>
        <p className="mt-2 text-sm text-slate-300">
          Rule 9037 can support redaction or restricted access when a court filing exposes protected personal identifiers. It does not automatically require Equifax, Experian, or TransUnion to delete an accurate bankruptcy.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {items.map(([name, rule]) => (
            <label key={name} className="flex gap-3 rounded-xl bg-slate-950 p-4 text-sm text-slate-300">
              <input type="checkbox" checked={Boolean(checked[name])} onChange={(event) => setChecked((current) => ({ ...current, [name]: event.target.checked }))} />
              <span><strong className="text-white">{name}</strong><br />{rule}</span>
            </label>
          ))}
        </div>

        <div className={`mt-4 rounded-xl p-4 text-sm ${anyIssue ? 'bg-emerald-950 text-emerald-200' : 'bg-slate-950 text-slate-300'}`}>
          {anyIssue
            ? 'Potential Rule 9037 issue identified. Record the exact docket number, page, and exposed identifier before preparing a motion to redact or restrict access.'
            : 'No Rule 9037 issue selected. The rule should not be used as a stand-alone bankruptcy deletion argument.'}
        </div>

        <div className="mt-4 rounded-xl bg-amber-950 p-4 text-sm text-amber-200">
          <strong>How this can help a credit dispute:</strong> a confirmed privacy violation may produce a court redaction order and stronger documentation about how identifiers were exposed or matched. It becomes relevant to a bureau dispute only when it supports a specific inaccuracy, mixed-file problem, identity mismatch, or unreliable verification process.
        </div>

        <textarea className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-white" rows={18} readOnly value={motionText} />
        <div className="mt-3 flex flex-wrap gap-3">
          <button className="button-secondary" onClick={() => navigator.clipboard.writeText(motionText)}>Copy motion outline</button>
          <a className="button-secondary" href="https://www.law.cornell.edu/rules/frbp/rule_9037" target="_blank" rel="noreferrer">Read Rule 9037</a>
        </div>
      </div>
    </section>
  );
}
