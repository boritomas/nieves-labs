'use client';

import { ArrowRight, Zap, Radio, Briefcase, BarChart3, FileText, Check, Clock, Github, Mail, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const products = [
    {
      icon: Radio,
      name: 'AnswerBrief AI',
      description: 'Meeting intelligence, summaries, follow-ups, and executive-ready updates.',
      status: 'In progress',
      statusColor: 'bg-blue-500/20 border-blue-400/50 text-blue-200',
      iconColor: 'text-blue-400',
    },
    {
      icon: Zap,
      name: 'Nieves AI Platform',
      description: 'The operating system for managing products, workflows, AI agents, and deployments.',
      status: 'Foundation',
      statusColor: 'bg-purple-500/20 border-purple-400/50 text-purple-200',
      iconColor: 'text-purple-400',
    },
    {
      icon: Briefcase,
      name: 'Interview Coach',
      description: 'AI-powered interview preparation, practice, and personalized feedback.',
      status: 'Planned',
      statusColor: 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200',
      iconColor: 'text-cyan-400',
    },
    {
      icon: BarChart3,
      name: 'Workflow Studio',
      description: 'Automation systems that connect docs, email, Slack, Jira, and reporting.',
      status: 'Planned',
      statusColor: 'bg-green-500/20 border-green-400/50 text-green-200',
      iconColor: 'text-green-400',
    },
    {
      icon: FileText,
      name: 'TaxAppealBuddy',
      description: 'Property tax appeal support using comps, packets, and hearing preparation.',
      status: 'Prototype',
      statusColor: 'bg-orange-500/20 border-orange-400/50 text-orange-200',
      iconColor: 'text-orange-400',
    },
  ];

  const workflowSteps = [
    { label: 'Problem', color: 'from-red-500 to-orange-500' },
    { label: 'Product Spec', color: 'from-orange-500 to-amber-500' },
    { label: 'AI Build', color: 'from-amber-500 to-yellow-500' },
    { label: 'Review', color: 'from-yellow-500 to-green-500' },
    { label: 'Deploy', color: 'from-green-500 to-emerald-500' },
    { label: 'Learn', color: 'from-emerald-500 to-cyan-500' },
  ];

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

  return (
    <main className="min-h-screen bg-slate-950">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg"></div>
            <span className="text-xl font-bold text-white">Nieves Labs</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#products" className="text-slate-300 hover:text-white transition-colors">
              Products
            </a>
            <a href="#workflow" className="text-slate-300 hover:text-white transition-colors">
              Workflow
            </a>
            <a href="#roadmap" className="text-slate-300 hover:text-white transition-colors">
              Roadmap
            </a>
            <button className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all">
              Get Started
            </button>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
              <a href="#products" className="block text-slate-300 hover:text-white py-2">
                Products
              </a>
              <a href="#workflow" className="block text-slate-300 hover:text-white py-2">
                Workflow
              </a>
              <a href="#roadmap" className="block text-slate-300 hover:text-white py-2">
                Roadmap
              </a>
              <button className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all">
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-screen pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-slate-950 to-cyan-600/10"></div>
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full max-w-4xl rounded-full bg-gradient-to-b from-blue-500/20 to-transparent opacity-40 blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Hero Left */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full backdrop-blur-sm w-fit">
              <Zap size={16} className="text-yellow-400" />
              <span className="text-sm text-slate-300">Nieves Labs · Practical AI Product Lab</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white">
                Practical AI products for real-world work.
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed max-w-xl">
                Nieves Labs builds AI-powered products, automation systems, and practical experiments that help professionals and small businesses move faster, reduce manual work, and turn ideas into usable tools.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all group">
                Explore Products
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="inline-flex items-center justify-center px-6 py-3 border-2 border-slate-400 text-slate-200 font-medium rounded-lg hover:border-white hover:text-white transition-all">
                See the Platform
              </button>
            </div>
          </div>

          {/* Hero Right - Floating Cards */}
          <div className="relative h-full min-h-[400px] lg:min-h-[600px] hidden lg:flex items-center justify-center">
            <div className="relative w-full h-full max-w-md mx-auto">
              {/* Floating Card 1 */}
              <div className="absolute top-12 left-0 w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 animate-float">
                <div className="text-xs font-semibold text-blue-300 mb-2">AnswerBrief AI</div>
                <div className="text-xs text-slate-300">Meeting intelligence & summaries</div>
                <div className="mt-3 inline-block px-2 py-1 bg-blue-500/30 border border-blue-400/50 rounded text-xs text-blue-200">
                  In progress
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="absolute top-40 right-0 w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="text-xs font-semibold text-purple-300 mb-2">Nieves AI Platform</div>
                <div className="text-xs text-slate-300">Operating system for AI products</div>
                <div className="mt-3 inline-block px-2 py-1 bg-purple-500/30 border border-purple-400/50 rounded text-xs text-purple-200">
                  Foundation
                </div>
              </div>

              {/* Floating Card 3 */}
              <div className="absolute bottom-40 left-8 w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 animate-float" style={{ animationDelay: '2s' }}>
                <div className="text-xs font-semibold text-cyan-300 mb-2">Interview Coach</div>
                <div className="text-xs text-slate-300">AI-powered interview prep</div>
                <div className="mt-3 inline-block px-2 py-1 bg-cyan-500/30 border border-cyan-400/50 rounded text-xs text-cyan-200">
                  Planned
                </div>
              </div>

              {/* Floating Card 4 */}
              <div className="absolute bottom-20 right-4 w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 animate-float" style={{ animationDelay: '3s' }}>
                <div className="text-xs font-semibold text-green-300 mb-2">Workflow Studio</div>
                <div className="text-xs text-slate-300">Automation & integrations</div>
                <div className="mt-3 inline-block px-2 py-1 bg-green-500/30 border border-green-400/50 rounded text-xs text-green-200">
                  Planned
                </div>
              </div>

              {/* SVG Lines and Nodes */}
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

          {/* Mobile Floating Cards */}
          <div className="lg:hidden relative pb-12">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.slice(0, 4).map((product, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 animate-float" style={{ animationDelay: `${idx * 0.25}s` }}>
                    <div className={`text-xs font-semibold mb-2 ${product.iconColor}`}>
                      {product.name}
                    </div>
                    <div className="text-xs text-slate-300">{product.description.substring(0, 30)}...</div>
                    <div className={`mt-3 inline-block px-2 py-1 border rounded text-xs ${product.statusColor}`}>
                      {product.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section id="products" className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Our Products
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              A suite of AI-powered tools designed to solve real problems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, idx) => {
              const Icon = product.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-slate-600 group"
                >
                  <div className={`w-12 h-12 rounded-lg bg-slate-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${product.iconColor}`}>
                    <Icon size={24} />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-semibold leading-snug mb-3 text-white group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-slate-400 mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${product.statusColor}`}>
                      {product.status}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-blue-400 transition-colors"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WORKFLOW SECTION */}
      <section id="workflow" className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white">
              Our Workflow
            </h2>
            <p className="text-xl text-slate-400">
              How we build practical AI products
            </p>
          </div>

          {/* Desktop Workflow */}
          <div className="hidden md:flex items-center justify-center gap-4 lg:gap-6 mb-12 overflow-x-auto pb-4">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
                <div className={`flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br ${step.color} p-0.5 group`}>
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center group-hover:bg-opacity-70 transition-all">
                    <span className="text-white font-bold text-sm text-center px-2">
                      {step.label}
                    </span>
                  </div>
                </div>
                {idx < workflowSteps.length - 1 && (
                  <ArrowRight size={24} className="text-slate-600 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile Workflow */}
          <div className="md:hidden space-y-4 mb-12">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${step.color} p-0.5`}>
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                    <span className="text-white font-bold text-xs text-center px-2">
                      {step.label}
                    </span>
                  </div>
                </div>
                {idx < workflowSteps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-slate-700 to-transparent"></div>
                )}
              </div>
            ))}
          </div>

          {/* Workflow Description Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Identify', desc: 'Start with a real problem that professionals face in their daily work.' },
              { title: 'Specify', desc: 'Create detailed product specifications and technical architecture.' },
              { title: 'Execute', desc: 'Build and iterate using AI, automation, and agile methodology.' },
              { title: 'Validate', desc: 'Review functionality and gather feedback from real users.' },
              { title: 'Ship', desc: 'Deploy to production and make tools available to users.' },
              { title: 'Improve', desc: 'Monitor, iterate, and continuously enhance based on usage.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP SECTION */}
      <section id="roadmap" className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white">
              Public Roadmap
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              See what we are building and what's coming next
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Completed */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-400/50 flex items-center justify-center">
                  <Check size={20} className="text-green-400" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold leading-snug text-white">
                  Completed
                </h3>
              </div>

              <div className="space-y-3">
                {completed.map((item, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-start space-x-4 group hover:border-green-400/50 transition-all">
                    <Check size={20} className="text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-300 group-hover:text-white transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center">
                  <Clock size={20} className="text-blue-400" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold leading-snug text-white">
                  Coming Soon
                </h3>
              </div>

              <div className="space-y-3">
                {upcoming.map((item, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-start space-x-4 group hover:border-blue-400/50 transition-all">
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

      {/* CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-20"></div>
        <div className="absolute inset-0 bg-grid opacity-5"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 lg:p-16 text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Building the next generation of practical AI tools
            </h2>

            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Nieves Labs is creating a connected ecosystem of AI products for productivity, automation, and small-business workflows.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <button className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all group">
                Explore Products
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="inline-flex items-center justify-center px-6 py-3 border-2 border-slate-400 text-slate-200 font-medium rounded-lg hover:border-white hover:text-white transition-all">
                Follow the Roadmap
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 relative">
        <div className="absolute inset-0 bg-grid opacity-5"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg"></div>
                <span className="text-lg font-bold text-white">Nieves Labs</span>
              </div>
              <p className="text-sm text-slate-400">
                Practical AI products for real-world work
              </p>
            </div>

            {/* Products */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Products</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">AnswerBrief AI</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Platform</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Interview Coach</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Workflow Studio</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Social */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors">
                  <Github size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} Nieves Labs. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
