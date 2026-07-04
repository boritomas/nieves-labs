'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
      <div className="container-max flex items-center justify-between h-16">
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
          <button className="button-primary">
            Get Started
          </button>
        </nav>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <div className="container-max py-4 space-y-4">
            <a href="#products" className="block text-slate-300 hover:text-white py-2">
              Products
            </a>
            <a href="#workflow" className="block text-slate-300 hover:text-white py-2">
              Workflow
            </a>
            <a href="#roadmap" className="block text-slate-300 hover:text-white py-2">
              Roadmap
            </a>
            <button className="button-primary w-full">
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
