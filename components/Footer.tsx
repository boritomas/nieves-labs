'use client';

import { Github, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12 relative">
      <div className="absolute inset-0 bg-grid opacity-5"></div>

      <div className="relative z-10 container-max">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg"></div>
              <span className="text-lg font-bold text-white">Nieves Labs</span>
            </div>
            <p className="text-sm text-slate-400">
              Practical AI products for real-world work
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white">Products</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">AnswerBrief AI</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Platform</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Interview Coach</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Workflow Studio</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

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

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-400">
          <p>&copy; {currentYear} Nieves Labs. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}