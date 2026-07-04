import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
                <span className="text-white font-bold text-xs">NL</span>
              </div>
              <span className="font-semibold text-gray-900">Nieves Labs</span>
            </div>
            <p className="text-sm text-gray-600">Practical AI Product Lab</p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-3">Products</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-gray-900 transition-colors">AnswerBrief</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition-colors">Interview Coach</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition-colors">Workflow Studio</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition-colors">TaxAppeal</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#platform" className="hover:text-gray-900 transition-colors">Nieves AI</Link></li>
              <li><Link href="#roadmap" className="hover:text-gray-900 transition-colors">Roadmap</Link></li>
              <li><Link href="https://github.com/boritomas/nieves-labs" className="hover:text-gray-900 transition-colors">GitHub</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-gray-900 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-600 text-center">
            © {currentYear} Nieves Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
