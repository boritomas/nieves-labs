'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Integration', href: '#integration' },
  { label: 'Docs', href: '#docs' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-medium transition-shadow duration-200 hover:shadow-sm">
      <nav className="container-max flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <Link href="#" className="flex items-center gap-2 font-bold text-xl text-primary-dark hover:text-primary transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">NL</span>
          </div>
          <span className="hidden sm:inline">Nieves Labs</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-primary-dark hover:text-primary transition-colors duration-150"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="#cta"
          className="hidden sm:inline-block button-primary text-sm sm:text-base"
        >
          Get Started
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-primary-dark hover:bg-neutral-light rounded-md transition-colors"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-medium bg-white animate-slide-down">
          <div className="container-max py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-primary-dark hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#cta"
              className="button-primary text-sm text-center mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
