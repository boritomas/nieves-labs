'use client';

import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-20"></div>
      <div className="absolute inset-0 bg-grid opacity-5"></div>

      <div className="relative z-10 container-max">
        <div className="glassmorphism p-12 lg:p-16 text-center space-y-8 animate-fade-in">
          <h2 className="heading-h2">
            Building the next generation of practical AI tools
          </h2>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Nieves Labs is creating a connected ecosystem of AI products for productivity, automation, and small-business workflows.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button className="button-primary group">
              Explore Products
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="button-secondary">
              Follow the Roadmap
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}