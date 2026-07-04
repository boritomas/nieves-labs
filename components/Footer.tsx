import Link from 'next/link';
import { Zap } from 'lucide-react';

const links = {
  Products: [
    { label: 'AnswerBrief AI', href: '#products' },
    { label: 'Interview Coach', href: '#products' },
    { label: 'Workflow Studio', href: '#products' },
    { label: 'TaxAppealBuddy', href: '#products' },
  ],
  Platform: [
    { label: 'Nieves AI', href: '#platform' },
    { label: 'Roadmap', href: '#roadmap' },
    { label: 'GitHub', href: 'https://github.com/boritomas/nieves-labs' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-950 border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white tracking-tight">Nieves Labs</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Practical AI Product Lab.<br />Building AI tools for real work.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-500 hover:text-white transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.07] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            © {currentYear} Nieves Labs. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-slate-600">Systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
