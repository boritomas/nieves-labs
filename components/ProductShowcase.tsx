'use client';

import { BarChart3, Radio, Briefcase, Zap, FileText } from 'lucide-react';

const products = [
  {
    icon: Radio,
    name: 'AnswerBrief AI',
    description: 'Turn your resume and job posting into a role-specific interview brief.',
    status: 'In progress',
    statusColor: 'bg-blue-500/20 border-blue-400/50 text-blue-200',
    iconColor: 'text-blue-400',
  },
  {
    icon: Zap,
    name: 'Nieves AI Platform',
    description: 'The operating system for managing products, workflows, AI agents, and deployments.',
    status: 'Foundation',
    statusColor: 'bg-purple-500/20 border-purple-400/50 text-purple-200',
    iconColor: 'text-purple-400',
  },
  {
    icon: Briefcase,
    name: 'Interview Coach',
    description: 'AI-powered interview preparation, practice, and personalized feedback.',
    status: 'Planned',
    statusColor: 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200',
    iconColor: 'text-cyan-400',
  },
  {
    icon: BarChart3,
    name: 'Workflow Studio',
    description: 'Automation systems that connect docs, email, Slack, Jira, and reporting.',
    status: 'Planned',
    statusColor: 'bg-green-500/20 border-green-400/50 text-green-200',
    iconColor: 'text-green-400',
  },
  {
    icon: FileText,
    name: 'TaxAppealBuddy',
    description: 'Property tax appeal support using comps, packets, and hearing preparation.',
    status: 'Prototype',
    statusColor: 'bg-orange-500/20 border-orange-400/50 text-orange-200',
    iconColor: 'text-orange-400',
  },
];

export default function ProductShowcase() {
  return (
    <section id="products" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-5"></div>

      <div className="relative z-10 container-max">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="heading-h2">Our Products</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            A suite of AI-powered tools designed to solve real problems
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => {
            const Icon = product.icon;
            return (
              <div
                key={idx}
                className="card group animate-slide-up"
                style={{
                  animationDelay: `${idx * 100}ms`,
                }}
              >
                <div className={`w-12 h-12 rounded-lg bg-slate-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${product.iconColor}`}>
                  <Icon size={24} />
                </div>

                <h3 className="heading-h3 mb-3 text-white group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>

                <p className="text-slate-400 mb-6 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${product.statusColor}`}>
                    {product.status}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-blue-400 transition-colors"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}