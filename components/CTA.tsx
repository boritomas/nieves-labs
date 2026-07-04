export default function CTA() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Building the next generation of practical AI tools.
        </h2>
        
        <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
          Nieves Labs is creating a connected ecosystem of AI products for productivity, automation, and small-business workflows.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
            Explore Products
          </button>
          <button className="px-8 py-4 border border-slate-500 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors">
            Follow the Roadmap
          </button>
        </div>
      </div>
    </section>
  );
}
