const products = [
  {
    name: 'AnswerBrief AI',
    description: 'Meeting intelligence, summaries, follow-ups, and executive-ready updates.',
    status: 'In progress',
    statusColor: 'bg-amber-100 text-amber-800',
  },
  {
    name: 'Nieves AI Platform',
    description: 'The operating system for managing products, workflows, AI agents, and deployments.',
    status: 'Foundation',
    statusColor: 'bg-blue-100 text-blue-800',
  },
  {
    name: 'Interview Coach',
    description: 'AI-powered interview preparation, practice, and personalized feedback.',
    status: 'Planned',
    statusColor: 'bg-slate-100 text-slate-800',
  },
  {
    name: 'Workflow Studio',
    description: 'Automation systems that connect docs, email, Slack, Jira, and reporting.',
    status: 'Planned',
    statusColor: 'bg-slate-100 text-slate-800',
  },
  {
    name: 'TaxAppealBuddy',
    description: 'Property tax appeal support using comps, packets, and hearing preparation.',
    status: 'Prototype',
    statusColor: 'bg-green-100 text-green-800',
  },
];

export default function ProductShowcase() {
  return (
    <section id="products" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">AI Products in Motion</h2>
          <p className="text-lg text-gray-600 max-w-2xl">From concept to production, our products solve real problems for professionals and small businesses.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex-1">{product.name}</h3>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-2 ${product.statusColor}`}>
                  {product.status}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
