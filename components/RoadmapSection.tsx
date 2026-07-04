export default function RoadmapSection() {
  return (
    <section id="roadmap" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Our Direction</h2>
          <p className="text-lg text-gray-600 max-w-2xl">Building Nieves Labs step by step, with transparency and focus.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Completed */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Completed</h3>
            <ul className="space-y-3">
              {[
                'GitHub + Vercel pipeline',
                'Foundation documentation',
                'Roadmap and planning',
                'Brand-focused messaging',
                'Premium homepage v1',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Next */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Next</h3>
            <ul className="space-y-3">
              {[
                'Product detail pages',
                'Command Center (unified dashboard)',
                'Shared component library',
                'API documentation',
                'Community platform',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm3.707-8.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
