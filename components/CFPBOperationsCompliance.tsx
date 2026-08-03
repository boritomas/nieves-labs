const cards = [
  {
    title: 'Consumer complaint workflow',
    body: 'Use the CFPB consumer complaint process for individual credit-reporting, debt-collection, mortgage, banking, and related consumer issues. Companies generally respond within 15 calendar days; a final response may take up to 60 days when the initial response is not final.',
    href: 'https://www.consumerfinance.gov/complaint/',
    cta: 'Open consumer complaint portal',
  },
  {
    title: 'Company Portal eligibility',
    body: 'Register only when Nieves Labs itself provides a consumer financial product or service and the CFPB may route complaints about that product or service to the company. The Company Portal is not required merely because the app helps consumers prepare complaints.',
    href: 'https://www.consumerfinance.gov/company-signup/',
    cta: 'Review company signup',
  },
  {
    title: 'Compliance resources',
    body: 'Use the CFPB compliance hub for FCRA, FDCPA, ECOA, mortgage, consumer lending, consumer cards, deposit-account, supervisory, and registration guidance.',
    href: 'https://www.consumerfinance.gov/compliance/',
    cta: 'Open compliance hub',
  },
  {
    title: 'Complaint data and API',
    body: 'Use the public Consumer Complaint Database and data API for research, trend analysis, benchmarking, and product-quality insights. Do not treat public complaint data as legal proof for an individual dispute.',
    href: 'https://www.consumerfinance.gov/data-research/consumer-complaints/',
    cta: 'Explore complaint data',
  },
];

export default function CFPBOperationsCompliance() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <p className="eyebrow">CFPB operations and compliance</p>
        <h2 className="text-2xl font-semibold text-white">Use the right CFPB channel</h2>
        <p className="mt-2 text-sm text-slate-300">
          The consumer complaint portal, Company Portal, compliance hub, and data programs serve different purposes. This section keeps them separate so the workflow does not send a consumer to a company-only process or treat Nieves Labs as a regulated financial institution without a factual basis.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {cards.map((item) => (
            <a key={item.title} className="rounded-xl border border-slate-700 bg-slate-950 p-4 transition hover:border-white" href={item.href} target="_blank" rel="noreferrer">
              <strong className="text-white">{item.title}</strong>
              <p className="mt-2 text-sm text-slate-300">{item.body}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-emerald-300">{item.cta}</span>
            </a>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-amber-950 p-4 text-sm text-amber-200">
          <strong>Current Nieves Labs position:</strong> Consumer Defense Lab appears to be a consumer-support and document-preparation workflow, not a bank, lender, credit bureau, debt collector, mortgage servicer, or data-reporting institution. CFPB Company Portal registration should therefore remain optional and fact-dependent, not a default onboarding requirement.
        </div>
      </div>
    </section>
  );
}
