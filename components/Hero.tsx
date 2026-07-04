export default function Hero() {
  return (
    <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full">
          <span className="text-xs font-semibold text-slate-600">Nieves Labs</span>
          <span className="text-xs text-slate-500">Practical AI Product Lab</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Practical AI products for real-world work.
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
          Nieves Labs builds AI-powered products, automation systems, and practical experiments that help professionals and small businesses move faster, reduce manual work, and turn ideas into usable tools.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors">
            Explore Products
          </button>
          <button className="px-6 py-3 border border-slate-300 text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
            See the Platform
          </button>
        </div>

        {/* Workflow Visualization */}
        <div className="relative mt-16 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Idea', icon: '💡' },
              { label: 'AI System', icon: '⚙️' },
              { label: 'Automation', icon: '🔄' },
              { label: 'Output', icon: '✓' },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg p-4 sm:p-6 border border-slate-200 mb-3">
                  <div className="text-3xl sm:text-4xl mb-2 flex justify-center h-10 items-center">
                    <span className="text-gray-400" aria-hidden="true">→</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{step.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
