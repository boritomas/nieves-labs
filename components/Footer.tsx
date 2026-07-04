import Link from 'next/link';

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const footerColumns: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Security', href: '#security' },
      { label: 'Roadmap', href: '#roadmap' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Documentation', href: '#docs' },
      { label: 'API Reference', href: '#api' },
      { label: 'GitHub', href: '#github' },
      { label: 'Examples', href: '#examples' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Discord', href: '#discord' },
      { label: 'Twitter / X', href: '#twitter' },
      { label: 'Blog', href: '#blog' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookies', href: '#cookies' },
      { label: 'Compliance', href: '#compliance' },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white py-16 sm:py-20 lg:py-24">
      <div className="container-max">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo & Branding */}
          <div className="col-span-2 md:col-span-1 mb-8 md:mb-0">
            <div className="flex items-center gap-2 mb-4 font-bold text-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">NL</span>
              </div>
              <span>Nieves Labs</span>
            </div>
            <p className="text-sm text-white/60">
              Building the future of AI integration, one developer at a time.
            </p>
          </div>

          {/* Footer Links */}
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="font-semibold text-base mb-4 text-white">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/60 text-center sm:text-left">
              © {currentYear} Nieves Labs. All rights reserved.
            </p>
            <p className="text-sm text-white/60 text-center">
              Made with ❤️ by the Nieves Labs team.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
