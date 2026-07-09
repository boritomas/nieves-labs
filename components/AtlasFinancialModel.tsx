'use client';

import { useMemo, useState } from 'react';
import { calculateAtlasForecast, type AtlasFinancialAssumptions } from '@/lib/atlas';

const fields: Array<[keyof AtlasFinancialAssumptions, string, string]> = [
  ['startingMrr', 'Starting MRR', '$'],
  ['monthlyCustomerGrowth', 'Monthly customer growth', 'customers'],
  ['averageSubscriptionPrice', 'Average subscription price', '$'],
  ['monthlyChurn', 'Monthly churn', '%'],
  ['cloudApiCosts', 'Cloud/API costs', '$'],
  ['marketingBudget', 'Marketing budget', '$'],
  ['contractorDevSupport', 'Contractor/dev support', '$'],
  ['legalAdminCosts', 'Legal/admin costs', '$'],
  ['loanAmount', 'Loan amount', '$'],
  ['loanTermMonths', 'Loan term', 'months'],
  ['estimatedInterestRate', 'Estimated interest rate', '%'],
  ['startingCashBalance', 'Starting cash balance', '$'],
];

export default function AtlasFinancialModel({ initialAssumptions, token }: { initialAssumptions: AtlasFinancialAssumptions; token: string }) {
  const [assumptions, setAssumptions] = useState(initialAssumptions);
  const [saveState, setSaveState] = useState('');
  const forecast = useMemo(() => calculateAtlasForecast(assumptions), [assumptions]);

  function updateField(field: keyof AtlasFinancialAssumptions, value: string) {
    setAssumptions((current) => ({ ...current, [field]: Number(value) }));
  }

  async function save() {
    setSaveState('Saving...');
    const response = await fetch(`/api/atlas?token=${encodeURIComponent(token)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'financial_assumptions', patch: assumptions }),
    });
    setSaveState(response.ok ? 'Saved' : 'Unable to save');
    setTimeout(() => setSaveState(''), 1800);
  }

  return (
    <div className="atlas-stack">
      <section className="panel">
        <div className="review-card-top">
          <div>
            <p className="eyebrow">Editable assumptions</p>
            <h2>Capital model inputs</h2>
          </div>
          <button className="button-primary" type="button" onClick={save}>{saveState || 'Save assumptions'}</button>
        </div>
        <div className="atlas-form-grid">
          {fields.map(([field, label, suffix]) => (
            <label key={field}>
              {label}
              <div className="atlas-input-wrap">
                <input type="number" step={field === 'estimatedInterestRate' || field === 'monthlyChurn' ? '0.1' : '1'} value={assumptions[field]} onChange={(event) => updateField(field, event.target.value)} />
                <span>{suffix}</span>
              </div>
            </label>
          ))}
        </div>
      </section>

      <section className="metrics-grid">
        <Metric label="Monthly expenses" value={money(forecast.monthlyExpenses)} />
        <Metric label="Estimated loan payment" value={money(forecast.monthlyLoanPayment)} />
        <Metric label="12-month MRR" value={money(forecast.months[11].mrr)} />
        <Metric label="Repayment coverage" value={forecast.repaymentCoverage.toUpperCase()} />
      </section>

      <section className="panel">
        <h2>12-month forecast</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>MRR</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th>Net cash flow</th>
                <th>Ending cash</th>
              </tr>
            </thead>
            <tbody>
              {forecast.months.map((month) => (
                <tr key={month.month}>
                  <td>{month.month}</td>
                  <td>{money(month.mrr)}</td>
                  <td>{money(month.revenue)}</td>
                  <td>{money(month.expenses)}</td>
                  <td className={month.netCashFlow >= 0 ? 'positive' : 'negative'}>{money(month.netCashFlow)}</td>
                  <td>{money(month.endingCashBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
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

