import Link from 'next/link';
import { ArrowRight, Cpu, MessageSquare, GitBranch, Users, FileText } from 'lucide-react';

const heroProducts = [
  { name: 'AnswerBrief AI', status: 'In Progress', statusColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: MessageSquare, delay: '' },
  { name: 'Nieves AI Platform', status: 'Foundation', statusColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: Cpu, delay: 'animate-float-delayed' },
  { name: 'Interview Coach', status: 'Planned', statusColor: 'text-slate-400 bg-slate-400/10 border-slate-400/20', icon: Users, delay: 'animate-float-delayed-2' },
  { name: 'Workflow Studio', status: 'Planned', statusColor: 'text-slate-400 bg-slate-400/10 border-slate-400/20', icon: GitBranch, delay: 'animate-float-delayed' },
  { name: 'TaxAppealBuddy', status: 'Prototype', statusColor: 'text-green-400 bg-green-400/10 border-green-400/20', icon: FileText, delay: '' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950 pt-16">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-900" />

      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-100" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Text Content */}
          <div className="animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-300 tracking-wide">
                Nieves Labs · Practical AI Product Lab
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6">
              Practical AI products for{' '}
              <span className="gradient-text">real-world</span>{' '}
              work.
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl">
              Nieves Labs builds AI-powered products, automation systems, and practical experiments that help professionals and small businesses move faster, reduce manual work, and turn ideas into usable tools.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#products"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                Explore Products
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#platform"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5"
              >
                See the Platform
              </Link>
            </div>

            {/* Social proof stats */}
            <div className="mt-12 flex flex-wrap items-center gap-8">
              {[
                { value: '5', label: 'AI Products' },
                { value: '6-step', label: 'Build Process' },
                { value: '1', label: 'Platform' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual Mockup Panel */}
          <div className="relative lg:block animate-slide-in-right">
            {/* Main glass panel */}
            <div className="relative glass-card p-4 rounded-2xl overflow-hidden">
              {/* Inner grid */}
              <div className="absolute inset-0 bg-grid-light opacity-30" />

              {/* Panel header */}
              <div className="relative z-10 flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-500">nieves-labs / products</span>
                <div className="w-16" />
              </div>

              {/* SVG connecting lines layer */}
              <div className="relative z-10">
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 400 480"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Line from AnswerBrief to Platform */}
                  <line x1="200" y1="72" x2="200" y2="156" stroke="rgba(99,102,241,0.3)" strokeWidth="1.5" strokeDasharray="4,4" />
                  {/* Line from Platform to Interview Coach */}
                  <line x1="200" y1="228" x2="95" y2="316" stroke="rgba(99,102,241,0.2)" strokeWidth="1.5" strokeDasharray="4,4" />
                  {/* Line from Platform to Workflow Studio */}
                  <line x1="200" y1="228" x2="305" y2="316" stroke="rgba(99,102,241,0.2)" strokeWidth="1.5" strokeDasharray="4,4" />
                  {/* Node circles */}
                  <circle cx="200" cy="114" r="4" fill="rgba(99,102,241,0.6)" />
                  <circle cx="95" cy="360" r="4" fill="rgba(99,102,241,0.4)" />
                  <circle cx="305" cy="360" r="4" fill="rgba(99,102,241,0.4)" />
                </svg>

                {/* Product cards */}
                <div className="space-y-3 px-2">

                  {/* Card 1: AnswerBrief AI */}
                  <div className="animate-float">
                    <div className="bg-white/[0.07] border border-white/[0.12] rounded-xl p-4 hover:bg-white/[0.10] transition-colors duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-amber-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">AnswerBrief AI</p>
                            <p className="text-xs text-slate-500">Meeting intelligence</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400">
                          In Progress
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Nieves AI Platform */}
                  <div className="animate-float-delayed">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 hover:bg-indigo-500/15 transition-colors duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                            <Cpu className="w-4 h-4 text-indigo-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">Nieves AI Platform</p>
                            <p className="text-xs text-slate-400">Operating system for AI</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-400/10 border border-blue-400/20 text-blue-400">
                          Foundation
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cards row: Interview Coach + Workflow Studio */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="animate-float-delayed-2">
                      <div className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-3 hover:bg-white/[0.08] transition-colors duration-300">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-lg bg-slate-500/20 flex items-center justify-center">
                            <Users className="w-3 h-3 text-slate-400" />
                          </div>
                          <span className="text-xs font-semibold text-white">Interview Coach</span>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400">
                          Planned
                        </span>
                      </div>
                    </div>
                    <div className="animate-float-delayed">
                      <div className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-3 hover:bg-white/[0.08] transition-colors duration-300">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-lg bg-slate-500/20 flex items-center justify-center">
                            <GitBranch className="w-3 h-3 text-slate-400" />
                          </div>
                          <span className="text-xs font-semibold text-white">Workflow Studio</span>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400">
                          Planned
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 5: TaxAppealBuddy */}
                  <div className="animate-float">
                    <div className="bg-white/[0.07] border border-white/[0.12] rounded-xl p-4 hover:bg-white/[0.10] transition-colors duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">TaxAppealBuddy</p>
                            <p className="text-xs text-slate-500">Property tax appeals</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-400/10 border border-green-400/20 text-green-400">
                          Prototype
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Floating accent cards */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-600/20 rounded-2xl border border-indigo-500/20 backdrop-blur-sm animate-float-slow hidden lg:flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-300">5</div>
                <div className="text-[10px] text-indigo-400/80 leading-tight">Products</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 w-28 h-16 bg-slate-900/90 rounded-xl border border-white/10 backdrop-blur-sm animate-float-delayed hidden lg:flex items-center justify-center gap-2 px-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-slate-300">Platform Active</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}
