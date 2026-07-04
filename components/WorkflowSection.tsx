const steps = [
  { label: 'Problem', number: '01', description: 'Define the real-world problem worth solving.' },
  { label: 'Product Spec', number: '02', description: 'Specify the product scope and target outcomes.' },
  { label: 'AI Build', number: '03', description: 'Develop with AI-assisted engineering workflows.' },
  { label: 'Review', number: '04', description: 'Quality check, test, and iterate on the solution.' },
  { label: 'Deploy', number: '05', description: 'Ship to production via automated pipelines.' },
  { label: 'Learn', number: '06', description: 'Measure results and feed insights back in.' },
];

export default function WorkflowSection() {
  return (
    <section id="workflow" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-slate-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900 to-slate-950/80" />
      <div className="absolute inset-0 bg-grid opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <span className="text-xs font-semibold text-indigo-300 tracking-wide">Process</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            How We Build
          </h2>
          <p className="text-lg text-slate-400">
            A lean, focused process for turning problems into production systems.
          </p>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="sm:hidden space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-indigo-400 font-mono">{step.number}</span>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-indigo-500/10 blur-sm" />
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-px h-12 mt-2 bg-gradient-to-b from-indigo-500/40 to-transparent" />
                )}
              </div>
              <div className="flex-1 pt-2 pb-4">
                <p className="font-bold text-white mb-1">{step.label}</p>
                <p className="text-sm text-slate-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: horizontal flow */}
        <div className="hidden sm:block">
          {/* Connecting line */}
          <div className="relative mb-8">
            <div className="absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

            <div className="grid grid-cols-6 gap-2">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center relative">
                  {/* Node */}
                  <div className="relative z-10 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-indigo-500/30 flex items-center justify-center backdrop-blur-sm shadow-lg shadow-indigo-500/10">
                      <span className="text-xs font-bold text-indigo-400 font-mono">{step.number}</span>
                    </div>
                    {/* Arrow between steps */}
                    {idx < steps.length - 1 && (
                      <div className="absolute top-1/2 -right-[calc(50%+8px)] -translate-y-1/2 w-4 h-px bg-indigo-500/30 pointer-events-none" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step cards */}
          <div className="grid grid-cols-6 gap-3">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="glass-card p-4 hover:bg-white/[0.10] transition-all duration-300 group"
              >
                <p className="font-bold text-white text-sm mb-2 group-hover:text-indigo-300 transition-colors">
                  {step.label}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
