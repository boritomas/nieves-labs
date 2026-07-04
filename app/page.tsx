'use client'

import { useState } from 'react'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <main>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">NL</span>
              </div>
              <span className="hidden sm:inline text-lg font-bold tracking-tight">Nieves Labs</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-black transition-colors">
                Features
              </a>
              <a href="#building" className="text-sm text-gray-600 hover:text-black transition-colors">
                What we're building
              </a>
              <a href="https://nieveslabs.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-black transition-colors">
                Visit Site
              </a>
            </nav>

            {/* Theme toggle placeholder + Mobile menu button */}
            <div className="flex items-center gap-4">
              <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors" aria-label="Theme toggle">
                <span className="text-lg">🌙</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex w-8 h-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                <span className="text-2xl">☰</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden border-t border-gray-100 mt-4 pt-4 flex flex-col gap-3">
              <a href="#features" className="text-sm text-gray-600 hover:text-black transition-colors py-2">
                Features
              </a>
              <a href="#building" className="text-sm text-gray-600 hover:text-black transition-colors py-2">
                What we're building
              </a>
              <a href="https://nieveslabs.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-black transition-colors py-2">
                Visit Site
              </a>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-32">
        <div className="container">
          {/* Badge */}
          <div className="flex justify-center mb-12 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white/50 backdrop-blur-sm text-sm font-medium text-gray-800">
              <span className="inline-block w-2 h-2 rounded-full bg-slate-900"></span>
              Nieves Labs · Practical AI Product Lab
            </span>
          </div>

          {/* Headline */}
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-black mb-6 animate-fade-in-up">
              AI products, automation systems, and practical experiments that solve real problems.
            </h1>
          </div>

          {/* Supporting Paragraph */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed animate-fade-in-up">
              Nieves Labs is a product lab focused on building AI-powered tools and automation that solve real customer problems, from interview preparation to workflow automation and future small-business tools.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 border-t border-gray-200">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {/* Feature 1 */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Practical Experiments</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Test and validate ideas through hands-on implementation and real-world testing.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Real-World Solutions</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Build tools that address actual customer pain points with direct market validation.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered Products</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Leverage AI to create smarter automation and tools that scale beyond manual work.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Founder-Driven</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Direct involvement in product development, strategy, and hands-on execution.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We're Building Section */}
      <section id="building" className="py-20 md:py-28 border-t border-gray-200">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What we're building</h2>
            <p className="text-lg text-gray-600 max-w-2xl">Projects and tools currently in active development at Nieves Labs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="flex flex-col gap-6 p-8 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all bg-white/50 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <span className="text-3xl">📚</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Interview Preparation</h3>
                <p className="text-gray-600 leading-relaxed">AI-powered tools designed to help professionals prepare for interviews with realistic simulations and personalized feedback.</p>
              </div>
            </div>

            {/* Project 2 */}
            <div className="flex flex-col gap-6 p-8 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all bg-white/50 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                <span className="text-3xl">⚙️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Workflow Automation</h3>
                <p className="text-gray-600 leading-relaxed">Systems that streamline repetitive tasks and connect tools across your workflow, powered by AI and automation.</p>
              </div>
            </div>

            {/* Project 3 */}
            <div className="flex flex-col gap-6 p-8 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all bg-white/50 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                <span className="text-3xl">🏢</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Small-Business AI Tools</h3>
                <p className="text-gray-600 leading-relaxed">Purpose-built AI solutions for small businesses and founders to increase efficiency and unlock growth opportunities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-black mb-4">Nieves Labs</h3>
              <p className="text-sm text-gray-600">Building practical AI products and automation that solve real problems.</p>
            </div>
            <div className="flex flex-col gap-3">
              <a href="https://nieveslabs.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-black transition-colors">
                Official Site
              </a>
              <a href="#features" className="text-sm text-gray-600 hover:text-black transition-colors">
                Features
              </a>
              <a href="#building" className="text-sm text-gray-600 hover:text-black transition-colors">
                What we're building
              </a>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© 2024 Nieves Labs. All rights reserved.</p>
            <p className="text-sm text-gray-500">Practical AI Product Lab</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
