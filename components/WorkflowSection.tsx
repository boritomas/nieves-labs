const steps = [
  { label: 'Problem', number: '01' },
  { label: 'Product Spec', number: '02' },
  { label: 'AI Build', number: '03' },
  { label: 'Review', number: '04' },
  { label: 'Deploy', number: '05' },
  { label: 'Learn', number: '06' },
];

export default function WorkflowSection() {
  return (
    <section id="workflow" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">How We Build</h2>
          <p className="text-lg text-gray-600 max-w-2xl">A lean, focused process for turning problems into production systems.</p>
        </div>

        <div className="relative">
          {/* Mobile vertical timeline */}
          <div className="sm:hidden space-y-6">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                  {idx < steps.length - 1 && <div className="w-0.5 h-12 bg-slate-200 my-2"></div>}
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-semibold text-gray-900">{step.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop horizontal timeline */}
          <div className="hidden sm:grid grid-cols-6 gap-4">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <p className="font-semibold text-gray-900">{step.label}</p>
              </div>
            ))}
          </div>

          {/* Horizontal connecting line */}
          <div className="hidden sm:block absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-slate-200 to-slate-200 -z-10"></div>
        </div>
      </div>
    </section>
  );
}
