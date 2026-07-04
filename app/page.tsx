'use client'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">Nieves Labs</h1>
            <nav className="hidden sm:flex gap-8">
              <a href="https://nieveslabs.com" className="text-sm text-gray-600 hover:text-black transition-colors">
                Visit Site
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full border border-gray-300 text-sm font-medium text-gray-700">
              Nieves Labs · Practical AI Product Lab
            </span>
          </div>

          {/* Headline */}
          <div className="max-w-4xl mx-auto text-center mb-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
              AI products, automation systems, and practical experiments that solve real problems.
            </h2>
          </div>

          {/* Supporting Paragraph */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Nieves Labs is a product lab focused on building AI-powered tools and automation that solve real customer problems, from interview preparation to workflow automation and future small-business tools.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 border-t border-gray-200">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-lg">⚡</span>
              </div>
              <h3 className="text-lg font-semibold">Practical Experiments</h3>
              <p className="text-gray-600 text-sm">Test and validate ideas through hands-on implementation.</p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-lg">🎯</span>
              </div>
              <h3 className="text-lg font-semibold">Real-World Solutions</h3>
              <p className="text-gray-600 text-sm">Build tools that address actual customer pain points.</p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <h3 className="text-lg font-semibold">AI-Powered Products</h3>
              <p className="text-gray-600 text-sm">Leverage AI to create smarter automation and tools.</p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-lg">🚀</span>
              </div>
              <h3 className="text-lg font-semibold">Founder-Driven</h3>
              <p className="text-gray-600 text-sm">Direct involvement in product development and strategy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">© 2024 Nieves Labs. All rights reserved.</p>
            <a href="https://nieveslabs.com" className="text-sm text-gray-600 hover:text-black transition-colors">
              nieveslabs.com
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
