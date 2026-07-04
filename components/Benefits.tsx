'use client';

import { useState } from 'react';

interface Benefit {
  id: string;
  title: string;
  description: string;
  visual: string;
  alignment: 'left' | 'right';
}

const benefits: Benefit[] = [
  {
    id: 'unified-api',
    title: 'Unified API for Multiple Models',
    description: 'Access GPT-4, Claude, Llama, and more through a single, consistent API. Switch models without rewriting code. Perfect for optimization and experimentation across different AI providers.',
    visual: 'code-snippet',
    alignment: 'left',
  },
  {
    id: 'monitoring',
    title: 'Built-in Monitoring & Analytics',
    description: 'Understand how your AI features perform. Track latency, costs, error rates, and usage patterns. Make data-driven decisions to optimize your implementation and reduce expenses.',
    visual: 'dashboard-mockup',
    alignment: 'right',
  },
  {
    id: 'community',
    title: 'Active Community Support',
    description: 'Join hundreds of developers building with Nieves Labs. Share solutions, ask questions, and contribute to our open-source ecosystem. Community-driven innovation at scale.',
    visual: 'community-illustration',
    alignment: 'left',
  },
];

export default function Benefits() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="benefits" className="py-16 sm:py-24 lg:py-32 bg-neutral-light">
      <div className="container-max">
        <div className="mb-16 text-center">
          <h2 className="heading-h2 mb-4 text-primary-dark">Why Choose Nieves Labs</h2>
          <p className="text-body-lg text-neutral-dark max-w-2xl mx-auto">
            Everything you need to integrate AI into production applications with confidence and ease.
          </p>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:grid gap-16">
          {benefits.map((benefit, index) => {
            const isLeftAligned = benefit.alignment === 'left';
            return (
              <div key={benefit.id} className="grid grid-cols-2 gap-12 items-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                {isLeftAligned ? (
                  <>
                    <div className="bg-primary-dark rounded-lg p-8 flex items-center justify-center min-h-[300px]">
                      <div className="text-center text-white">
                        <div className="text-6xl mb-4">📊</div>
                        <p className="text-sm text-white/70">Visual Representation</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="heading-h2 mb-4 text-primary-dark">{benefit.title}</h3>
                      <p className="text-base text-neutral-dark leading-relaxed">{benefit.description}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="heading-h2 mb-4 text-primary-dark">{benefit.title}</h3>
                      <p className="text-base text-neutral-dark leading-relaxed">{benefit.description}</p>
                    </div>
                    <div className="bg-primary-dark rounded-lg p-8 flex items-center justify-center min-h-[300px]">
                      <div className="text-center text-white">
                        <div className="text-6xl mb-4">📈</div>
                        <p className="text-sm text-white/70">Visual Representation</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile View - Tabs */}
        <div className="lg:hidden">
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {benefits.map((benefit, index) => (
              <button
                key={benefit.id}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === index
                    ? 'bg-primary text-white'
                    : 'bg-white text-primary-dark border border-neutral-medium hover:bg-neutral-light'
                }`}
              >
                {benefit.title.split(' ')[0]}
              </button>
            ))}
          </div>

          {benefits.map((benefit, index) => (
            activeTab === index && (
              <div key={benefit.id} className="animate-fade-in">
                <div className="bg-primary-dark rounded-lg p-8 flex items-center justify-center min-h-[250px] mb-6">
                  <div className="text-center text-white">
                    <div className="text-5xl mb-4">📊</div>
                    <p className="text-sm text-white/70">Visual Representation</p>
                  </div>
                </div>
                <div>
                  <h3 className="heading-h3 mb-3 text-primary-dark">{benefit.title}</h3>
                  <p className="text-base text-neutral-dark leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
}
