'use client';

import { ArrowRight, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-screen pt-20 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-animated opacity-40"></div>
      <div className="absolute inset-0 bg-grid opacity-10"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full max-w-4xl rounded-full bg-gradient-to-b from-blue-500/20 to-transparent opacity-40 blur-3xl"></div>

      <div className="relative z-10 container-max grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
        <div className="space-y-8 animate-fade-in">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full backdrop-blur-sm w-fit">
            <Zap size={16} className="text-yellow-400" />
            <span className="text-sm text-slate-300">Nieves Labs · Practical AI Product Lab</span>
          </div>

          <div className="space-y-4">
            <h1 className="heading-display text-white leading-tight">
              Practical AI products for real-world work.
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-xl">
              Nieves Labs builds AI-powered products, automation systems, and practical experiments that help professionals and small businesses move faster, reduce manual work, and turn ideas into usable tools.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <button className="button-primary group">
              Explore Products
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="button-secondary">
              See the Platform
            </button>
          </div>
        </div>

        <div className="relative h-full min-h-[400px] lg:min-h-[600px] hidden lg:flex items-center justify-center">
          <div className="relative w-full h-full max-w-md mx-auto">
            <div className="absolute top-12 left-0 w-48 glassmorphism p-4 animate-float">
              <div className="text-xs font-semibold text-blue-300 mb-2">AnswerBrief AI</div>
              <div className="text-xs text-slate-300">Meeting intelligence & summaries</div>
              <div className="mt-3 inline-block px-2 py-1 bg-blue-500/30 border border-blue-400/50 rounded text-xs text-blue-200">
                In progress
              </div>
            </div>

            <div className="absolute top-40 right-0 w-48 glassmorphism p-4 animate-float animate-float-delay-1">
              <div className="text-xs font-semibold text-purple-300 mb-2">Nieves AI Platform</div>
              <div className="text-xs text-slate-300">Operating system for AI products</div>
              <div className="mt-3 inline-block px-2 py-1 bg-purple-500/30 border border-purple-400/50 rounded text-xs text-purple-200">
                Foundation
              </div>
            </div>

            <div className="absolute bottom-40 left-8 w-48 glassmorphism p-4 animate-float animate-float-delay-2">
              <div className="text-xs font-semibold text-cyan-300 mb-2">Interview Coach</div>
              <div className="text-xs text-slate-300">AI-powered interview prep</div>
              <div className="mt-3 inline-block px-2 py-1 bg-cyan-500/30 border border-cyan-400/50 rounded text-xs text-cyan-200">
                Planned
              </div>
            </div>

            <div className="absolute bottom-20 right-4 w-48 glassmorphism p-4 animate-float animate-float-delay-3">
              <div className="text-xs font-semibold text-green-300 mb-2">Workflow Studio</div>
              <div className="text-xs text-slate-300">Automation & integrations</div>
              <div className="mt-3 inline-block px-2 py-1 bg-green-500/30 border border-green-400/50 rounded text-xs text-green-200">
                Planned
              </div>
            </div>

            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              <line x1="30%" y1="15%" x2="70%" y2="40%" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="70%" y1="40%" x2="20%" y2="65%" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="20%" y1="65%" x2="75%" y2="75%" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" strokeDasharray="5,5" />
              <circle cx="30%" cy="15%" r="6" fill="#3b82f6" opacity="0.6" />
              <circle cx="70%" cy="40%" r="6" fill="#a855f7" opacity="0.6" />
              <circle cx="20%" cy="65%" r="6" fill="#06b6d4" opacity="0.6" />
              <circle cx="75%" cy="75%" r="6" fill="#10b981" opacity="0.6" />
            </svg>
          </div>
        </div>
      </div>

      <div className="lg:hidden relative pb-12">
        <div className="container-max space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glassmorphism p-4 animate-float">
              <div className="text-xs font-semibold text-blue-300 mb-2">AnswerBrief AI</div>
              <div className="text-xs text-slate-300">Meeting intelligence</div>
              <div className="mt-3 inline-block px-2 py-1 bg-blue-500/30 border border-blue-400/50 rounded text-xs text-blue-200">
                In progress
              </div>
            </div>

            <div className="glassmorphism p-4 animate-float animate-float-delay-1">
              <div className="text-xs font-semibold text-purple-300 mb-2">AI Platform</div>
              <div className="text-xs text-slate-300">Operating system</div>
              <div className="mt-3 inline-block px-2 py-1 bg-purple-500/30 border border-purple-400/50 rounded text-xs text-purple-200">
                Foundation
              </div>
            </div>

            <div className="glassmorphism p-4 animate-float animate-float-delay-2">
              <div className="text-xs font-semibold text-cyan-300 mb-2">Interview Coach</div>
              <div className="text-xs text-slate-300">Interview prep</div>
              <div className="mt-3 inline-block px-2 py-1 bg-cyan-500/30 border border-cyan-400/50 rounded text-xs text-cyan-200">
                Planned
              </div>
            </div>

            <div className="glassmorphism p-4 animate-float animate-float-delay-3">
              <div className="text-xs font-semibold text-green-300 mb-2">Workflow Studio</div>
              <div className="text-xs text-slate-300">Automation</div>
              <div className="mt-3 inline-block px-2 py-1 bg-green-500/30 border border-green-400/50 rounded text-xs text-green-200">
                Planned
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}