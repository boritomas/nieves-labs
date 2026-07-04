'use client';

import { ArrowRight } from 'lucide-react';

const steps = [
  { label: 'Problem', color: 'from-red-500 to-orange-500' },
  { label: 'Product Spec', color: 'from-orange-500 to-amber-500' },
  { label: 'AI Build', color: 'from-amber-500 to-yellow-500' },
  { label: 'Review', color: 'from-yellow-500 to-green-500' },
  { label: 'Deploy', color: 'from-green-500 to-emerald-500' },
  { label: 'Learn', color: 'from-emerald-500 to-cyan-500' },
];

export default function WorkflowSection() {
  return (
    <section id="workflow" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-5"></div>

      <div className="relative z-10 container-max">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="heading-h2 mb-4">Our Workflow</h2>
          <p className="text-xl text-slate-400">
            How we build practical AI products
          </p>
        </div>

        <div className="hidden md:flex items-center justify-center gap-4 lg:gap-6 mb-12 overflow-x-auto pb-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
              <div className={`flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br ${step.color} p-0.5 group`}>
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center group-hover:bg-opacity-70 transition-all">
                  <span className="text-white font-bold text-sm text-center px-2">
                    {step.label}
                  </span>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight size={24} className="text-slate-600 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="md:hidden space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${step.color} p-0.5`}>
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <span className="text-white font-bold text-xs text-center px-2">
                    {step.label}
                  </span>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gradient-to-r from-slate-700 to-transparent"></div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          <div className="glassmorphism p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-white mb-2">Identify</h3>
            <p className="text-slate-400">Start with a real problem that professionals face in their daily work.</p>
          </div>
          <div className="glassmorphism p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h3 className="text-lg font-semibold text-white mb-2">Specify</h3>
            <p className="text-slate-400">Create detailed product specifications and technical architecture.</p>
          </div>
          <div className="glassmorphism p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-semibold text-white mb-2">Execute</h3>
            <p className="text-slate-400">Build and iterate using AI, automation, and agile methodology.</p>
          </div>
          <div className="glassmorphism p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h3 className="text-lg font-semibold text-white mb-2">Validate</h3>
            <p className="text-slate-400">Review functionality and gather feedback from real users.</p>
          </div>
          <div className="glassmorphism p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <h3 className="text-lg font-semibold text-white mb-2">Ship</h3>
            <p className="text-slate-400">Deploy to production and make tools available to users.</p>
          </div>
          <div className="glassmorphism p-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
            <h3 className="text-lg font-semibold text-white mb-2">Improve</h3>
            <p className="text-slate-400">Monitor, iterate, and continuously enhance based on usage.</p>
          </div>
        </div>
      </div>
    </section>
  );
}