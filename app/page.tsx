'use client'

import { useState } from 'react'

// Inline SVG Icons
const Logo = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-white">
    <rect x="2" y="2" width="16" height="16" rx="2" fill="currentColor"/>
    <rect x="6" y="8" width="3" height="4" fill="white" opacity="0.9"/>
    <rect x="11" y="6" width="3" height="6" fill="white" opacity="0.9"/>
  </svg>
)

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-700">
    <path d="M3 6h14M3 10h14M3 14h14" />
  </svg>
)

const ThemeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gray-700">
    <circle cx="10" cy="10" r="4" opacity="0.9"/>
    <circle cx="10" cy="2" r="1.5"/>
    <circle cx="10" cy="18" r="1.5"/>
    <circle cx="2" cy="10" r="1.5"/>
    <circle cx="18" cy="10" r="1.5"/>
  </svg>
)

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-white group-hover:translate-x-0.5 transition-transform">
    <path d="M2 8h12M10 4l4 4-4 4" />
  </svg>
)

const SparkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-current">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z" />
  </svg>
)

const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-current">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const BrainIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-current">
    <path d="M12 2c1 0 2 .5 2 1.5V5c0 .5.4 1 1 1h1c.5 0 1-.5 1-1V3.5c0-1 .9-1.5 2-1.5s2 .5 2 1.5V5c0 .5.4 1 1 1s1-.5 1-1V3.5c0-1 .9-1.5 2-1.5M3 8c1 0 1.5.5 1.5 1.5v4c0 1-.5 1.5-1.5 1.5S1.5 14.5 1.5 13.5v-4C1.5 8.5 2 8 3 8Z" />
    <path d="M6 12c0 2.5 2 4.5 4.5 4.5S15 14.5 15 12" />
  </svg>
)

const RocketIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-current">
    <path d="M4.5 16.5c-1.5-1.5-2-4-2-6.5 0-3 2-5 5-5 2.5 0 5 .5 6.5 2M19.5 7.5c1.5 1.5 2 4 2 6.5 0 3-2 5-5 5-2.5 0-5-.5-6.5-2M7 7l10 10M12 2v20" />
  </svg>
)

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
    <polyline points="17 6 8 15 3 10" />
  </svg>
)

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <polyline points="2 5 8 11 14 5" />
  </svg>
)

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <main className="bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/30">
        <div className="container h-16 flex items-center justify-between">
          {/* Left: Logo + Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center flex-shrink-0">
              <Logo />
            </div>
            <span className="font-bold text-sm md:text-base tracking-tight">Nieves Labs</span>
          </div>

          {/* Desktop Nav - Hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-black">
              Features
            </a>
            <a href="#building" className="text-sm text-gray-600 hover:text-black">
              Building
            </a>
            <a href="#workflow" className="text-sm text-gray-600 hover:text-black">
              Workflow
            </a>
          </nav>

          {/* Right: Icon buttons only */}
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors" aria-label="Toggle theme">
              <ThemeIcon />
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors" aria-label="Toggle menu">
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/30 bg-white/95">
            <nav className="container py-4 flex flex-col gap-3">
              <a href="#features" className="text-sm text-gray-600 hover:text-black py-2" onClick={() => setMobileMenuOpen(false)}>
                Features
              </a>
              <a href="#building" className="text-sm text-gray-600 hover:text-black py-2" onClick={() => setMobileMenuOpen(false)}>
                Building
              </a>
              <a href="#workflow" className="text-sm text-gray-600 hover:text-black py-2" onClick={() => setMobileMenuOpen(false)}>
                Workflow
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-20 md:pt-28 pb-12 md:pb-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-gray-300/50 bg-gray-50 mb-6 md:mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                <span className="text-xs md:text-sm font-medium text-gray-800">Nieves Labs · Practical AI Product Lab</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6">
                AI products, automation systems, and practical experiments that solve real problems.
              </h1>

              {/* Paragraph */}
              <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8 leading-relaxed">
                Nieves Labs is a product lab focused on building AI-powered tools and automation that solve real customer problems, from interview preparation to workflow automation and future small-business tools.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button className="group px-6 md:px-8 py-3 md:py-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm md:text-base flex items-center justify-center gap-2 transition-all">
                  Explore Projects
                  <ArrowRight />
                </button>
                <button className="px-6 md:px-8 py-3 md:py-4 rounded-lg border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-900 font-medium text-sm md:text-base transition-all">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right: Visual Product Lab Panel */}
            <div className="hidden lg:block">
              <div className="relative h-96 rounded-2xl border border-gray-300/30 bg-gradient-to-br from-slate-50 via-white to-gray-50 p-8 overflow-hidden shadow-xl">
                {/* Grid background inside */}
                <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

                {/* Floating cards/nodes */}
                <div className="relative h-full flex items-center justify-center">
                  {/* Center node */}
                  <div className="absolute w-16 h-16 rounded-xl border border-gray-300/40 bg-white shadow-lg flex items-center justify-center text-slate-700">
                    <BrainIcon />
                  </div>

                  {/* Top-left node */}
                  <div className="absolute top-12 left-8 w-14 h-14 rounded-lg border border-gray-300/40 bg-white shadow-md flex items-center justify-center text-amber-600 -rotate-12">
                    <SparkIcon />
                  </div>

                  {/* Top-right node */}
                  <div className="absolute top-8 right-8 w-14 h-14 rounded-lg border border-gray-300/40 bg-white shadow-md flex items-center justify-center text-purple-600 rotate-12">
                    <TargetIcon />
                  </div>

                  {/* Bottom-right node */}
                  <div className="absolute bottom-12 right-6 w-12 h-12 rounded-lg border border-gray-300/40 bg-white shadow-md flex items-center justify-center text-emerald-600 rotate-6">
                    <RocketIcon />
                  </div>

                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                    <line x1="96" y1="96" x2="60" y2="60" stroke="#d1d5db" strokeWidth="1" opacity="0.5" />
                    <line x1="96" y1="96" x2="220" y2="50" stroke="#d1d5db" strokeWidth="1" opacity="0.5" />
                    <line x1="96" y1="96" x2="300" y2="240" stroke="#d1d5db" strokeWidth="1" opacity="0.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 border-t border-gray-200/30">
        <div className="container">
          <div className="mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-3">Core Features</h2>
            <p className="text-gray-600 text-sm md:text-base">Built for impact, designed for real-world product development.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-gray-200/50 hover:border-gray-300/70 hover:shadow-md transition-all bg-white/50">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-4 text-amber-700">
                <SparkIcon />
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-2">Practical Experiments</h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">Test and validate ideas through hands-on implementation.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-gray-200/50 hover:border-gray-300/70 hover:shadow-md transition-all bg-white/50">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-700">
                <TargetIcon />
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-2">Real-World Solutions</h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">Build tools that address actual customer pain points.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-gray-200/50 hover:border-gray-300/70 hover:shadow-md transition-all bg-white/50">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4 text-purple-700">
                <BrainIcon />
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-2">AI-Powered Products</h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">Leverage AI for smarter automation at scale.</p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-gray-200/50 hover:border-gray-300/70 hover:shadow-md transition-all bg-white/50">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-4 text-emerald-700">
                <RocketIcon />
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-2">Founder-Driven</h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">Direct involvement in strategy and execution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We're Building */}
      <section id="building" className="py-12 md:py-20 border-t border-gray-200/30">
        <div className="container">
          <div className="mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-3">What we're building</h2>
            <p className="text-gray-600 text-sm md:text-base">Active projects at Nieves Labs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project 1 */}
            <div className="p-6 md:p-8 rounded-xl border border-gray-200/50 hover:border-gray-300/70 hover:shadow-lg transition-all bg-white/50 group">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-700 group-hover:scale-110 transition-transform">
                <SparkIcon />
              </div>
              <h3 className="font-semibold text-base md:text-lg mb-3">Interview Preparation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">AI-powered tools to help professionals prepare for interviews with realistic simulations and personalized feedback.</p>
            </div>

            {/* Project 2 */}
            <div className="p-6 md:p-8 rounded-xl border border-gray-200/50 hover:border-gray-300/70 hover:shadow-lg transition-all bg-white/50 group">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 text-purple-700 group-hover:scale-110 transition-transform">
                <TargetIcon />
              </div>
              <h3 className="font-semibold text-base md:text-lg mb-3">Workflow Automation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Systems that streamline repetitive tasks and connect tools across your workflow, powered by AI.</p>
            </div>

            {/* Project 3 */}
            <div className="p-6 md:p-8 rounded-xl border border-gray-200/50 hover:border-gray-300/70 hover:shadow-lg transition-all bg-white/50 group">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4 text-emerald-700 group-hover:scale-110 transition-transform">
                <RocketIcon />
              </div>
              <h3 className="font-semibold text-base md:text-lg mb-3">Small-Business AI</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Purpose-built AI solutions for small businesses and founders to increase efficiency and unlock growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Lab Workflow */}
      <section id="workflow" className="py-12 md:py-20 border-t border-gray-200/30">
        <div className="container">
          <div className="mb-10 md:mb-16 max-w-2xl">
            <h2 className="text-2xl md:text-4xl font-bold mb-3">How we build</h2>
            <p className="text-gray-600 text-sm md:text-base">Our proven product lab workflow.</p>
          </div>

          <div className="max-w-2xl">
            {/* Step 1 */}
            <div className="flex gap-6 mb-8 md:mb-12">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center font-semibold text-sm md:text-base text-gray-900">1</div>
                <div className="w-0.5 h-16 md:h-20 bg-gray-200 mt-2"></div>
              </div>
              <div className="pt-1 pb-8 md:pb-12">
                <h3 className="font-semibold text-sm md:text-base mb-2">Identify Real Problems</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">Find customer pain points through research, feedback, and direct market validation.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 mb-8 md:mb-12">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center font-semibold text-sm md:text-base text-gray-900">2</div>
                <div className="w-0.5 h-16 md:h-20 bg-gray-200 mt-2"></div>
              </div>
              <div className="pt-1 pb-8 md:pb-12">
                <h3 className="font-semibold text-sm md:text-base mb-2">Design & Prototype</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">Build prototypes and test with real users to validate product-market fit.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 mb-8 md:mb-12">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center font-semibold text-sm md:text-base text-gray-900">3</div>
                <div className="w-0.5 h-16 md:h-20 bg-gray-200 mt-2"></div>
              </div>
              <div className="pt-1 pb-8 md:pb-12">
                <h3 className="font-semibold text-sm md:text-base mb-2">Build with AI</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">Develop AI-powered solutions that leverage automation and intelligence for scale.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-900 flex items-center justify-center font-semibold text-sm md:text-base text-white">4</div>
              </div>
              <div className="pt-1">
                <h3 className="font-semibold text-sm md:text-base mb-2">Launch & Iterate</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">Release to market, gather feedback, and continuously improve based on real user behavior.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/30 py-10 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center flex-shrink-0">
                  <Logo />
                </div>
                <span className="font-bold text-sm">Nieves Labs</span>
              </div>
              <p className="text-xs md:text-sm text-gray-600">Building practical AI products and automation that solve real problems.</p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-xs md:text-sm text-black mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-xs md:text-sm text-gray-600 hover:text-black transition-colors">Features</a></li>
                <li><a href="#building" className="text-xs md:text-sm text-gray-600 hover:text-black transition-colors">What we're building</a></li>
                <li><a href="#workflow" className="text-xs md:text-sm text-gray-600 hover:text-black transition-colors">How it works</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-semibold text-xs md:text-sm text-black mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="https://nieveslabs.com" target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm text-gray-600 hover:text-black transition-colors">Official Site</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200/30 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-xs md:text-sm text-gray-500">© 2024 Nieves Labs. All rights reserved.</p>
            <p className="text-xs md:text-sm text-gray-500">Practical AI Product Lab</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
