interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    quote: 'Nieves Labs transformed how we integrate AI features. The unified API saved us weeks of development time and thousands in infrastructure costs.',
    author: 'Sarah Chen',
    role: 'CTO',
    company: 'TechVenture Inc',
    rating: 5,
  },
  {
    id: 'testimonial-2',
    quote: 'The documentation is exceptional and the community support is unmatched. We went from zero to production in just two weeks.',
    author: 'Marcus Rodriguez',
    role: 'Lead Engineer',
    company: 'DataFlow Systems',
    rating: 5,
  },
  {
    id: 'testimonial-3',
    quote: 'Enterprise-grade reliability with a developer-friendly interface. Nieves Labs is the gold standard for AI integration platforms.',
    author: 'Priya Patel',
    role: 'Product Manager',
    company: 'InnovateTech',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-neutral-light">
      <div className="container-max">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="heading-h2 mb-4 text-primary-dark">Loved by Developers</h2>
          <p className="text-body-lg text-neutral-dark max-w-2xl mx-auto">
            Join the growing community of builders creating the future with Nieves Labs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="card bg-white border-l-4 border-accent animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-lg">⭐</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-base text-neutral-dark leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div>
                <p className="font-semibold text-primary-dark">{testimonial.author}</p>
                <p className="text-sm text-neutral-dark">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
