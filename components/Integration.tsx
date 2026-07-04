export default function Integration() {
  const codeExample = `import { NievesClient } from '@nieves-labs/client';

const client = new NievesClient({
  apiKey: process.env.NIEVES_API_KEY,
});

const response = await client.complete({
  model: 'gpt-4',
  messages: [
    { role: 'user', content: 'Hello!' },
  ],
});

console.log(response.content);`;

  return (
    <section id="integration" className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="container-max">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="heading-h2 mb-4 text-primary-dark">Integrate in Minutes</h2>
          <p className="text-body-lg text-neutral-dark max-w-2xl mx-auto">
            Here\'s how simple it is to get started with Nieves Labs
          </p>
        </div>

        {/* Code Block */}
        <div className="max-w-2xl mx-auto mb-8 animate-slide-up">
          <div className="bg-primary-dark rounded-lg overflow-hidden shadow-lg border border-neutral-medium/20">
            {/* Header */}
            <div className="bg-black/30 px-6 py-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-sm font-mono text-white/60">example.ts</span>
              <button
                className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded transition-colors duration-150"
                onClick={() => {
                  navigator.clipboard.writeText(codeExample);
                }}
              >
                Copy
              </button>
            </div>

            {/* Code */}
            <pre className="p-6 overflow-x-auto">
              <code className="font-mono text-sm text-white/90 leading-relaxed">
                {codeExample}
              </code>
            </pre>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
          <button className="button-primary inline-block">
            See Full Documentation →
          </button>
        </div>
      </div>
    </section>
  );
}
