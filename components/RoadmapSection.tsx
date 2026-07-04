'use client';

import { Check, Clock } from 'lucide-react';

const completed = [
  'GitHub repository setup',
  'Vercel deployment pipeline',
  'Foundation documentation',
  'Brand messaging',
  'Premium homepage v1',
];

const upcoming = [
  'Product detail pages',
  'Command Center interface',
  'Component library',
  'API documentation',
  'User authentication',
  'Analytics dashboard',
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-5"></div>

      <div className="relative z-10 container-max">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="heading-h2 mb-4">Public Roadmap</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            See what we are building and what's coming next
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-400/50 flex items-center justify-center">
                <Check size={20} className="text-green-400" />
              </div>
              <h3 className="heading-h3 text-white">Completed</h3>
            </div>

            <div className="space-y-3">
              {completed.map((item, idx) => (
                <div key={idx} className="glassmorphism p-4 flex items-start space-x-4 group hover:border-green-400/50 transition-all">
                  <Check size={20} className="text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300 group-hover:text-white transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center">
                <Clock size={20} className="text-blue-400" />
              </div>
              <h3 className="heading-h3 text-white">Coming Soon</h3>
            </div>

            <div className="space-y-3">
              {upcoming.map((item, idx) => (
                <div key={idx} className="glassmorphism p-4 flex items-start space-x-4 group hover:border-blue-400/50 transition-all">
                  <div className="w-6 h-6 rounded-full border-2 border-blue-400/50 mt-1 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-400/50 group-hover:bg-blue-400 transition-colors"></div>
                  </div>
                  <span className="text-slate-300 group-hover:text-white transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}