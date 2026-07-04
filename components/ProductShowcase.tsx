import { MessageSquare, Cpu, Users, GitBranch, FileText } from 'lucide-react';

const products = [
  {
    name: 'AnswerBrief AI',
    description: 'Meeting intelligence, summaries, follow-ups, and executive-ready updates.',
    status: 'In Progress',
    statusColor: 'bg-amber-400/10 border-amber-400/20 text-amber-400',
    icon: MessageSquare,
    iconBg: 'bg-amber-500/20 border-amber-500/30',
    iconColor: 'text-amber-400',
    glow: 'hover:shadow-amber-500/10',
  },
  {
    name: 'Nieves AI Platform',
    description: 'The operating system for managing products, workflows, AI agents, and deployments.',
    status: 'Foundation',
    statusColor: 'bg-blue-400/10 border-blue-400/20 text-blue-400',
    icon: Cpu,
    iconBg: 'bg-blue-500/20 border-blue-500/30',
    iconColor: 'text-blue-400',
    glow: 'hover:shadow-blue-500/10',
  },
  {
    name: 'Interview Coach',
    description: 'AI-powered interview preparation, practice, and personalized feedback.',
    status: 'Planned',
    statusColor: 'bg-slate-400/10 border-slate-400/20 text-slate-400',
    icon: Users,
    iconBg: 'bg-slate-500/20 border-slate-500/30',
    iconColor: 'text-slate-400',
    glow: 'hover:shadow-slate-500/10',
  },
  {
    name: 'Workflow Studio',
    description: 'Automation systems that connect docs, email, Slack, Jira, and reporting.',
    status: 'Planned',
    statusColor: 'bg-slate-400/10 border-slate-400/20 text-slate-400',
    icon: GitBranch,
    iconBg: 'bg-slate-500/20 border-slate-500/30',
    iconColor: 'text-slate-400',
    glow: 'hover:shadow-slate-500/10',
  },
  {
    name: 'TaxAppealBuddy',
    description: 'Property tax appeal support using comps, packets, and hearing preparation.',
    status: 'Prototype',
    statusColor: 'bg-green-400/10 border-green-400/20 text-green-400',
    icon: FileText,
    iconBg: 'bg-green-500/20 border-green-500/30',
    iconColor: 'text-green-400',
    glow: 'hover:shadow-green-500/10',
  },
];

export default function ProductShowcase() {
  return (
    <section id="products" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <span className="text-xs font-semibold text-indigo-300 tracking-wide">Products</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            AI Products in Motion
          </h2>
          <p className="text-lg text-slate-400">
            From concept to production, our products solve real problems for professionals and small businesses.
          </p>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product, idx) => {
            const Icon = product.icon;
            return (
              <div
                key={idx}
                className={`group relative glass-card glass-card-hover p-6 cursor-default hover:shadow-xl ${product.glow} transition-all duration-300`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${product.iconBg}`}>
                    <Icon className={`w-5 h-5 ${product.iconColor}`} />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${product.statusColor}`}>
                    {product.status}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-200">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {product.description}
                </p>

                {/* Bottom accent line */}
                <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    product.status === 'In Progress' ? 'bg-amber-400 animate-pulse' :
                    product.status === 'Foundation' ? 'bg-blue-400 animate-pulse' :
                    product.status === 'Prototype' ? 'bg-green-400' :
                    'bg-slate-600'
                  }`} />
                  <span className="text-xs text-slate-500 font-medium">
                    {product.status === 'In Progress' ? 'Active development' :
                     product.status === 'Foundation' ? 'Foundation stage' :
                     product.status === 'Prototype' ? 'Prototype ready' :
                     'On the roadmap'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
