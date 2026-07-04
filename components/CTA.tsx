export default function CTA() {
  return (
    <section id="cta" className="py-16 sm:py-24 lg:py-32 bg-primary-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-max relative z-10 text-center animate-fade-in">
        <h2 className="heading-h2 text-white mb-4">Ready to Get Started?</h2>
        <p className="text-body-lg text-white/80 mb-8 max-w-2xl mx-auto">
          Join the developer community building the future of AI-powered applications. Nieves Labs provides everything you need to ship faster.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="button-primary bg-white text-primary hover:bg-neutral-light w-full sm:w-auto">
            Start Free →
          </button>
          <button className="button-ghost text-white hover:bg-white/10 w-full sm:w-auto">
            Schedule a Demo
          </button>
        </div>

        <p className="text-sm text-white/60 mt-8">
          No credit card required. Get access to our free tier instantly.
        </p>
      </div>
    </section>
  );
}
