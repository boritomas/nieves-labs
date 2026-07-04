import { CheckCircle2, Circle } from 'lucide-react';

const completed = [
  { label: 'GitHub + Vercel pipeline', detail: 'Automated deployment on every push to main.' },
  { label: 'Foundation documentation', detail: 'Brand guidelines, design system, engineering workflow.' },
  { label: 'Roadmap and planning', detail: 'Structured product and milestone roadmap published.' },
  { label: 'Brand messaging', detail: 'Practical AI Product Lab positioning established.' },
  { label: 'Premium homepage v1', detail: 'Visual SaaS landing page with glassmorphism and animations.' },
];

const next = [
  { label: 'Product detail pages', detail: 'Individual pages for each AI product with full feature specs.' },
  { label: 'Command Center', detail: 'Unified dashboard for managing all Nieves Labs products.' },
  { label: 'Component library', detail: 'Shared design system components published as an npm package.' },
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950" />
      <div className="absolute inset-0 bg-grid opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <span className="text-xs font-semibold text-indigo-300 tracking-wide">Roadmap</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Our Direction
          </h2>
          <p className="text-lg text-slate-400">
            Building Nieves Labs step by step, with transparency and focus.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Completed */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Completed</h3>
            </div>

            <div className="space-y-3">
              {completed.map((item, idx) => (
                <div
                  key={idx}
                  className="glass-card p-4 flex items-start gap-4 group hover:bg-white/[0.10] transition-all duration-200"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">{item.label}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Circle className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Next</h3>
            </div>

            <div className="space-y-3">
              {next.map((item, idx) => (
                <div
                  key={idx}
                  className="glass-card p-4 flex items-start gap-4 group hover:bg-white/[0.10] transition-all duration-200"
                >
                  <div className="flex-shrink-0 mt-0.5 flex flex-col items-center gap-1">
                    <div className="w-5 h-5 rounded-full border-2 border-indigo-500/40 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/60" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <span className="text-xs text-indigo-400/70 font-mono">Q3 2026</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.detail}</p>
                    {/* Progress bar */}
                    <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full"
                        style={{ width: idx === 0 ? '15%' : idx === 1 ? '5%' : '0%' }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Q4 placeholder */}
              <div className="glass p-4 rounded-xl flex items-center gap-3 opacity-50">
                <div className="w-5 h-5 rounded-full border border-dashed border-slate-600 flex-shrink-0" />
                <p className="text-sm text-slate-500">API documentation + SDKs · Q4 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
