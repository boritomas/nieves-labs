export default function Hero() {
  return (
    <section className="relative pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-24 lg:pb-32 gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container-max relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm font-medium text-white">✨ Welcome to Innovation</span>
          </div>

          {/* Headline */}
          <h1 className="heading-display text-white mb-6 leading-tight">
            Build Intelligent Applications<br className="hidden sm:inline" /> With Confidence
          </h1>

          {/* Subheadline */}
          <p className="text-body-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Nieves Labs empowers developers with production-ready AI integration tools. Access cutting-edge models, SDKs, and community resources to bring AI into your apps.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="button-primary bg-white text-primary hover:bg-neutral-light w-full sm:w-auto">
              Start Building →
            </button>
            <button className="button-secondary border-white text-white hover:bg-white/10 w-full sm:w-auto">
              Explore Docs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
