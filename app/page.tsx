'use client'

import { useState } from 'react'

// Simple SVG Icons
const LogoIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 12h6M12 9v6" />
  </svg>
)

const MenuIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
)

const ThemeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M1 12h6m6 0h6m-15.78 7.78l4.24-4.24m3.08-3.08l4.24-4.24" stroke="currentColor" fill="none" strokeWidth="2" />
  </svg>
)

const SparkIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z" />
  </svg>
)

const TargetIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const BrainIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2c1.1 0 2 .9 2 2v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1V4c0-1.1.9-2 2-2s2 .9 2 2v1c0 .55.45 1 1 1s1-.45 1-1V4c0-1.1.9-2 2-2M3 7c1.1 0 2 .9 2 2v5c0 1.1-.9 2-2 2s-2-.9-2-2V9c0-1.1.9-2 2-2Z" />
    <path d="M6 12c0 3.31 2.69 6 6 6s6-2.69 6-6" />
  </svg>
)

const RocketIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4.5 16.5c-1.5-1.5-2-4-2-6.5 0-3 2-5 5-5 2.5 0 5 .5 6.5 2M19.5 7.5c1.5 1.5 2 4 2 6.5 0 3-2 5-5 5-2.5 0-5-.5-6.5-2M7 7l10 10M12 2v20M2 12h20" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState('light')

  return (
    <main>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Wordmark */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center flex-shrink-0">
                <LogoIcon />
              </div>
              <span className="hidden sm:inline text-base font-bold tracking-tight">Nieves Labs</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-black transition-colors">
                Features
              </a>
              <a href="#building" className="text-sm text-gray-600 hover:text-black transition-colors">
                Building
              </a>
              <a href="#workflow" className="text-sm text-gray-600 hover:text-black transition-colors">
                How it works
              </a>
            </nav>

            {/* Right Side: Theme Toggle + Menu */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-700"
                aria-label="Toggle theme"
              >
                <ThemeIcon />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-700"
                aria-label="Toggle menu"
              >
                <MenuIcon />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="lg:hidden border-t border-gray-200/50 mt-4 pt-4 flex flex-col gap-3">
              <a href="#features" className="text-sm text-gray-600 hover:text-black transition-colors py-2">
                Features
              </a>
              <a href="#building" className="text-sm text-gray-600 hover:text-black transition-colors py-2">
                Building
              </a>
              <a href="#workflow" className="text-sm text-gray-600 hover:text-black transition-colors py-2">
                How it works
              </a>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-20">
        <div className="container">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300/50 bg-white/40 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
              <span className="text-xs sm:text-sm font-medium text-gray-800">Nieves Labs · Practical AI Product Lab</span>
            </div>
          </div>

          {/* Headline */}
          <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-black">
              AI products, automation systems, and practical experiments that solve real problems.
            </h1>
          </div>

          {/* Supporting Paragraph */}
          <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Nieves Labs is a product lab focused on building AI-powered tools and automation that solve real customer problems, from interview preparation to workflow automation and future small-business tools.
            </p>
          </div>

          {/* Abstract Hero Visualization */}
          <div className="max-w-3xl mx-auto">
            <div className="relative h-80 sm:h-96 rounded-2xl border border-gray-200/50 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden shadow-sm">
              {/* Floating elements */}
              <div className="absolute inset-0 flex items-center justify-center gap-4">
                {/* Left card */}
                <div className="absolute left-4 sm:left-8 top-1/4 w-20 sm:w-24 h-24 sm:h-28 rounded-lg border border-gray-300/30 bg-white shadow-lg -rotate-6 flex items-center justify-center">
                  <SparkIcon />
                </div>
                {/* Center card */}
                <div className="absolute w-24 sm:w-28 h-28 sm:h-32 rounded-lg border border-gray-300/30 bg-white shadow-xl flex items-center justify-center">
                  <BrainIcon />
                </div>
                {/* Right card */}
                <div className="absolute right-4 sm:right-8 top-1/4 w-20 sm:w-24 h-24 sm:h-28 rounded-lg border border-gray-300/30 bg-white shadow-lg rotate-6 flex items-center justify-center">
                  <RocketIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20 border-t border-gray-200/50">
        <div className="container">
          <div className="mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Core Features</h2>
            <p className="text-gray-600 text-sm sm:text-base">Built for practical product development and real-world impact.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-gray-200/50 hover:border-gray-300/70 hover:shadow-md transition-all bg-white/50 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center mb-4 text-amber-700">
                <SparkIcon />
              </div>
              <h3 className="font-semibold text-black mb-2">Practical Experiments</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Test and validate ideas through hands-on implementation and real-world testing.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-gray-200/50 hover:border-gray-300/70 hover:shadow-md transition-all bg-white/50 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-4 text-blue-700">
                <TargetIcon />
              </div>
              <h3 className="font-semibold text-black mb-2">Real-World Solutions</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Build tools that address actual customer pain points with direct market validation.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-gray-200/50 hover:border-gray-300/70 hover:shadow-md transition-all bg-white/50 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center mb-4 text-purple-700">
                <BrainIcon />
              </div>
              <h3 className="font-semibold text-black mb-2">AI-Powered Products</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Leverage AI to create smarter automation and tools that scale beyond manual work.</p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-gray-200/50 hover:border-gray-300/70 hover:shadow-md transition-all bg-white/50 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-4 text-emerald-700">
                <RocketIcon />
              </div>
              <h3 className="font-semibold text-black mb-2">Founder-Driven</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Direct involvement in product development, strategy, and hands-on execution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We're Building */}
      <section id="building" className="py-12 sm:py-16 md:py-20 border-t border-gray-200/50">
        <div className="container">
          <div className="mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">What we're building</h2>
            <p className="text-gray-600 text-sm sm:text-base">Projects in active development at Nieves Labs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project 1 */}
            <div className="p-6 sm:p-8 rounded-xl border border-gray-200/50 hover:border-gray-300/70 hover:shadow-lg transition-all bg-white/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-4 text-blue-700">
                <SparkIcon />
              </div>
              <h3 className="text-lg font-semibold text-black mb-3">Interview Prep</h3>
              <p className="text-sm text-gray-600 leading-relaxed">AI-powered tools to help professionals prepare for interviews with realistic simulations and personalized feedback.</p>
            </div>

            {/* Project 2 */}
            <div className="p-6 sm:p-8 rounded-xl border border-gray-200/50 hover:border-gray-300/70 hover:shadow-lg transition-all bg-white/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center mb-4 text-purple-700">
                <TargetIcon />
              </div>
              <h3 className="text-lg font-semibold text-black mb-3">Workflow Automation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Systems that streamline repetitive tasks and connect tools across your workflow, powered by AI.</p>
            </div>

            {/* Project 3 */}
            <div className="p-6 sm:p-8 rounded-xl border border-gray-200/50 hover:border-gray-300/70 hover:shadow-lg transition-all bg-white/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-4 text-emerald-700">
                <RocketIcon />
              </div>
              <h3 className="text-lg font-semibold text-black mb-3">Small-Business AI</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Purpose-built AI solutions for small businesses and founders to increase efficiency and unlock growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Lab Workflow */}
      <section id="workflow" className="py-12 sm:py-16 md:py-20 border-t border-gray-200/50">
        <div className="container">
          <div className="mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Our process</h2>
            <p className="text-gray-600 text-sm sm:text-base">How we build products at Nieves Labs.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Step 1 */}
            <div className="flex gap-4 sm:gap-6 mb-8 sm:mb-10">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white font-semibold text-sm">1</div>
              </div>
              <div className="flex-grow pt-0.5">
                <h3 className="font-semibold text-black mb-2">Identify Problems</h3>
                <p className="text-sm text-gray-600">Find real customer pain points through research and direct feedback from potential users.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 sm:gap-6 mb-8 sm:mb-10">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white font-semibold text-sm">2</div>
              </div>
              <div className="flex-grow pt-0.5">
                <h3 className="font-semibold text-black mb-2">Design & Prototype</h3>
                <p className="text-sm text-gray-600">Build quick prototypes and test ideas with real users to validate product-market fit.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 sm:gap-6 mb-8 sm:mb-10">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white font-semibold text-sm">3</div>
              </div>
              <div className="flex-grow pt-0.5">
                <h3 className="font-semibold text-black mb-2">Build with AI</h3>
                <p className="text-sm text-gray-600">Develop AI-powered solutions that leverage automation and intelligence for scale.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white font-semibold text-sm">4</div>
              </div>
              <div className="flex-grow pt-0.5">
                <h3 className="font-semibold text-black mb-2">Launch & Iterate</h3>
                <p className="text-sm text-gray-600">Release to market, gather feedback, and continuously improve based on real user behavior.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 py-8 sm:py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
                  <LogoIcon />
                </div>
                <span className="font-bold">Nieves Labs</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Building practical AI products and automation that solve real problems.</p>
            </div>
            <div>
              <h4 className="font-semibold text-black text-sm mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-xs sm:text-sm text-gray-600 hover:text-black transition-colors">Features</a></li>
                <li><a href="#building" className="text-xs sm:text-sm text-gray-600 hover:text-black transition-colors">What we're building</a></li>
                <li><a href="#workflow" className="text-xs sm:text-sm text-gray-600 hover:text-black transition-colors">How it works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-black text-sm mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="https://nieveslabs.com" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-gray-600 hover:text-black transition-colors">Official Site</a></li>
                <li><a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-gray-600 hover:text-black transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200/50 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-xs sm:text-sm text-gray-500">© 2024 Nieves Labs. All rights reserved.</p>
            <p className="text-xs sm:text-sm text-gray-500">Practical AI Product Lab</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
