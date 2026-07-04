interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    id: 'developer-first',
    icon: '💻',
    title: 'Developer First',
    description: 'Built by developers, for developers. Our SDKs and APIs are designed with your workflow in mind. Full TypeScript support, comprehensive examples, and excellent documentation included.',
  },
  {
    id: 'production-ready',
    icon: '🛡️',
    title: 'Production Ready',
    description: 'Enterprise-grade reliability meets developer convenience. Load balance across models, implement fallbacks, and monitor performance with built-in observability tools.',
  },
  {
    id: 'accessible-ai',
    icon: '✨',
    title: 'Accessible AI',
    description: 'Advanced AI capabilities shouldn\'t require a PhD. Our platform abstracts complexity while preserving power. Start simple, go sophisticated.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="container-max">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="card hover:shadow-md animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="heading-h3 mb-3 text-primary-dark">{feature.title}</h3>
              <p className="text-base text-neutral-dark leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
