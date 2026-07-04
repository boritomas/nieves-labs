const reasons = [
  {
    title: 'Practical over theoretical',
    description: 'Every product solves a real problem. We build what works, not what sounds good.',
  },
  {
    title: 'Built around real problems',
    description: 'Started from actual workflows and pain points. Designed with customers, not for them.',
  },
  {
    title: 'Designed to ship fast',
    description: 'Lean processes, focused scope, and fast iteration. Get value in weeks, not months.',
  },
];

export default function WhyNievesLabs() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Why Nieves Labs</h2>
          <p className="text-lg text-gray-600 max-w-2xl">Our approach to building AI products is different.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, idx) => (
            <div key={idx} className="">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{reason.title}</h3>
              <p className="text-gray-600 leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
