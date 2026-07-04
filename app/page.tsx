'use client';

import { useState } from 'react';
import { Check, Clock, Github, Mail, ArrowRight } from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const products = [
    {
      name: 'AnswerBrief AI',
      description: 'Transform meetings into actionable summaries, follow-ups, and executive briefs.',
      longDescription: 'Capture meeting intelligence automatically. Get smart summaries, follow-up tasks, and executive-ready updates—so you spend less time transcribing and more time working.',
      status: 'In progress',
      link: '#answerbrief',
      color: '#3b82f6',
      colorLight: '#93c5fd',
      icon: '🎙️',
    },
    {
      name: 'Nieves AI Platform',
      description: 'The operating system for building and managing AI products and workflows.',
      longDescription: 'Unified platform for AI product development, workflow automation, agent orchestration, and production deployment. Build faster, iterate smarter.',
      status: 'Foundation',
      link: '#platform',
      color: '#a855f7',
      colorLight: '#d8b4fe',
      icon: '⚙️',
    },
    {
      name: 'Workflow Studio',
      description: 'Connect your tools and automate repetitive work across docs, email, Slack, and more.',
      longDescription: 'Visual workflow builder that connects your entire toolkit. Automate repetitive tasks, sync data across platforms, and eliminate manual work.',
      status: 'Planned',
      link: '#workflow',
      color: '#06b6d4',
      colorLight: '#a5f3fc',
      icon: '🔄',
    },
    {
      name: 'Interview Coach',
      description: 'AI-powered interview preparation with personalized practice and feedback.',
      longDescription: 'Practice interviews with AI feedback. Get personalized coaching, industry-specific tips, and confidence-building exercises before the real thing.',
      status: 'Planned',
      link: '#interview',
      color: '#10b981',
      colorLight: '#86efac',
      icon: '💼',
    },
    {
      name: 'TaxAppealBuddy',
      description: 'Property tax appeal support with comps, packets, and hearing preparation.',
      longDescription: 'Streamline property tax appeals. Build comp packages, prepare hearing materials, and connect with professionals—all in one place.',
      status: 'Prototype',
      link: '#taxappeal',
      color: '#f59e0b',
      colorLight: '#fbbf24',
      icon: '📋',
    },
  ];

  const workflowSteps = ['Problem', 'Product Spec', 'AI Build', 'Review', 'Deploy', 'Learn'];

  const completed = [
    'Nieves Labs brand foundation',
    'Public homepage v1',
    'Practical AI product lab positioning',
  ];

  const inProgress = [
    'AnswerBrief AI',
    'Nieves AI Platform foundation',
    'Workflow automation experiments',
  ];

  const upcoming = [
    'Interview Coach',
    'Workflow Studio',
    'TaxAppealBuddy',
    'Product detail pages',
  ];

  return (
    <div className="nl-page">
      {/* HEADER */}
      <header className="nl-header">
        <div className="nl-header-content">
          <a href="#hero" className="nl-logo" onClick={() => handleNavClick('#hero')} aria-label="Nieves Labs home">
            <div className="nl-logo-icon"></div>
            <span>Nieves Labs</span>
          </a>

          <nav className={`nl-nav ${mobileMenuOpen ? 'active' : ''}`}>
            <a href="#products" onClick={() => handleNavClick('#products')}>Products</a>
            <a href="#workflow" onClick={() => handleNavClick('#workflow')}>Workflow</a>
            <a href="#roadmap" onClick={() => handleNavClick('#roadmap')}>Roadmap</a>
            <a href="#contact" onClick={() => handleNavClick('#contact')} className="nl-nav-button" role="button">Get Started</a>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="nl-menu-toggle"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="nl-mobile-menu active">
            <a href="#products" onClick={() => handleNavClick('#products')}>Products</a>
            <a href="#workflow" onClick={() => handleNavClick('#workflow')}>Workflow</a>
            <a href="#roadmap" onClick={() => handleNavClick('#roadmap')}>Roadmap</a>
            <a href="#contact" onClick={() => handleNavClick('#contact')} className="nl-nav-button" style={{ width: '100%' }}>Get Started</a>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="nl-hero" id="hero">
        <div className="nl-hero-content">
          <div className="nl-hero-text">
            <div className="nl-badge">
              <span className="nl-badge-icon">⚡</span>
              <span>Nieves Labs · Practical AI Product Lab</span>
            </div>

            <h1 className="nl-heading-hero">
              Practical AI products for real-world work.
            </h1>

            <p className="nl-paragraph">
              Nieves Labs builds AI-powered products, automation systems, and practical experiments that help professionals and small businesses move faster, reduce manual work, and turn ideas into usable tools.
            </p>

            <div className="nl-button-group">
              <a href="#products" onClick={(e) => { e.preventDefault(); handleNavClick('#products'); }} className="nl-button-primary">
                Explore Products →
              </a>
              <a href="#platform" onClick={(e) => { e.preventDefault(); handleNavClick('#platform'); }} className="nl-button-secondary">
                See the Platform
              </a>
            </div>
          </div>

          <div className="nl-hero-visual">
            <a href="#answerbrief" onClick={(e) => { e.preventDefault(); handleNavClick('#answerbrief'); }} className="nl-floating-card" style={{ background: 'rgba(59, 130, 246, 0.1)' }} aria-label="AnswerBrief AI product card">
              <div className="nl-card-title" style={{ color: '#93c5fd' }}>AnswerBrief AI</div>
              <div className="nl-card-desc">Meeting intelligence & summaries</div>
              <div className="nl-card-badge" style={{ background: 'rgba(59, 130, 246, 0.3)', borderColor: 'rgba(59, 130, 246, 0.5)', color: '#93c5fd' }}>
                In progress
              </div>
            </a>
            <a href="#platform" onClick={(e) => { e.preventDefault(); handleNavClick('#platform'); }} className="nl-floating-card" style={{ background: 'rgba(168, 85, 247, 0.1)' }} aria-label="Nieves AI Platform product card">
              <div className="nl-card-title" style={{ color: '#d8b4fe' }}>Nieves AI Platform</div>
              <div className="nl-card-desc">Operating system for AI products</div>
              <div className="nl-card-badge" style={{ background: 'rgba(168, 85, 247, 0.3)', borderColor: 'rgba(168, 85, 247, 0.5)', color: '#d8b4fe' }}>
                Foundation
              </div>
            </a>
            <a href="#interview" onClick={(e) => { e.preventDefault(); handleNavClick('#interview'); }} className="nl-floating-card" style={{ background: 'rgba(6, 182, 212, 0.1)' }} aria-label="Interview Coach product card">
              <div className="nl-card-title" style={{ color: '#a5f3fc' }}>Interview Coach</div>
              <div className="nl-card-desc">AI-powered interview prep</div>
              <div className="nl-card-badge" style={{ background: 'rgba(6, 182, 212, 0.3)', borderColor: 'rgba(6, 182, 212, 0.5)', color: '#a5f3fc' }}>
                Planned
              </div>
            </a>
            <a href="#workflow" onClick={(e) => { e.preventDefault(); handleNavClick('#workflow'); }} className="nl-floating-card" style={{ background: 'rgba(34, 197, 94, 0.1)' }} aria-label="Workflow Studio product card">
              <div className="nl-card-title" style={{ color: '#86efac' }}>Workflow Studio</div>
              <div className="nl-card-desc">Automation & integrations</div>
              <div className="nl-card-badge" style={{ background: 'rgba(34, 197, 94, 0.3)', borderColor: 'rgba(34, 197, 94, 0.5)', color: '#86efac' }}>
                Planned
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION - ENHANCED */}
      <section id="products" className="nl-products">
        <div className="nl-section-content">
          <div className="nl-section-header">
            <h2 className="nl-section-title">AI products in motion</h2>
            <p className="nl-section-subtitle">
              Practical tools and automation systems built around real customer problems.
            </p>
          </div>

          <div className="nl-product-grid-enhanced">
            {products.map((product, idx) => (
              <div key={idx} className="nl-product-card-enhanced" style={{ borderColor: `${product.color}40` }}>
                <div className="nl-product-card-header">
                  <div className="nl-product-card-icon" style={{ background: `${product.color}15` }}>
                    {product.icon}
                  </div>
                  <div className="nl-product-card-status" style={{ color: product.colorLight, background: `${product.color}20`, borderColor: `${product.color}40` }}>
                    {product.status}
                  </div>
                </div>

                <h3 className="nl-product-card-title">{product.name}</h3>
                <p className="nl-product-card-summary">{product.description}</p>
                <p className="nl-product-card-full">{product.longDescription}</p>

                <a
                  href={product.link}
                  onClick={(e) => { e.preventDefault(); handleNavClick(product.link); }}
                  className="nl-product-card-link"
                  style={{ color: product.colorLight }}
                  aria-label={`Learn more about ${product.name}`}
                >
                  <span>Learn more</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT ANCHOR SECTIONS */}
      <section id="answerbrief" style={{ display: 'none' }}></section>
      <section id="interview" style={{ display: 'none' }}></section>
      <section id="taxappeal" style={{ display: 'none' }}></section>

      {/* WORKFLOW SECTION */}
      <section id="workflow" className="nl-workflow">
        <div className="nl-section-content">
          <div className="nl-section-header">
            <h2 className="nl-section-title">Our Workflow</h2>
            <p className="nl-section-subtitle">
              How we build practical AI products
            </p>
          </div>

          <div className="nl-workflow-steps">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="nl-workflow-step">
                <div className="nl-workflow-step-inner">{step}</div>
              </div>
            ))}
          </div>

          <div className="nl-workflow-cards">
            {[
              { title: 'Identify', desc: 'Start with a real problem that professionals face in their daily work.' },
              { title: 'Specify', desc: 'Create detailed product specifications and technical architecture.' },
              { title: 'Execute', desc: 'Build and iterate using AI, automation, and agile methodology.' },
              { title: 'Validate', desc: 'Review functionality and gather feedback from real users.' },
              { title: 'Ship', desc: 'Deploy to production and make tools available to users.' },
              { title: 'Improve', desc: 'Monitor, iterate, and continuously enhance based on usage.' },
            ].map((item, idx) => (
              <div key={idx} className="nl-workflow-card">
                <h3 className="nl-workflow-card-title">{item.title}</h3>
                <p className="nl-workflow-card-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP SECTION */}
      <section id="roadmap" className="nl-roadmap">
        <div className="nl-section-content">
          <div className="nl-section-header">
            <h2 className="nl-section-title">Public Roadmap</h2>
            <p className="nl-section-subtitle">
              See what we are building and what's coming next
            </p>
          </div>

          <div className="nl-roadmap-grid">
            <div className="nl-roadmap-column">
              <div className="nl-roadmap-header">
                <div className="nl-roadmap-icon">
                  <Check size={20} color="#22c55e" />
                </div>
                <h3 className="nl-roadmap-title">Completed</h3>
              </div>
              <div className="nl-roadmap-items">
                {completed.map((item, idx) => (
                  <div key={idx} className="nl-roadmap-item">
                    <span className="nl-roadmap-item-icon">✓</span>
                    <span className="nl-roadmap-item-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="nl-roadmap-column">
              <div className="nl-roadmap-header">
                <div className="nl-roadmap-icon inprogress">
                  <Clock size={20} color="#f59e0b" />
                </div>
                <h3 className="nl-roadmap-title">In Progress</h3>
              </div>
              <div className="nl-roadmap-items">
                {inProgress.map((item, idx) => (
                  <div key={idx} className="nl-roadmap-item inprogress">
                    <div className="nl-roadmap-item-icon"></div>
                    <span className="nl-roadmap-item-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="nl-roadmap-column">
              <div className="nl-roadmap-header">
                <div className="nl-roadmap-icon upcoming">
                  <Clock size={20} color="#3b82f6" />
                </div>
                <h3 className="nl-roadmap-title">Coming Soon</h3>
              </div>
              <div className="nl-roadmap-items">
                {upcoming.map((item, idx) => (
                  <div key={idx} className="nl-roadmap-item upcoming">
                    <div className="nl-roadmap-item-icon"></div>
                    <span className="nl-roadmap-item-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM SECTION (hidden anchor) */}
      <section id="platform" style={{ display: 'none' }}></section>

      {/* CTA SECTION */}
      <section className="nl-cta">
        <div className="nl-cta-card">
          <h2 className="nl-cta-title">
            Building the next generation of practical AI tools
          </h2>
          <p className="nl-cta-text">
            Nieves Labs is creating a connected ecosystem of AI products for productivity, automation, and small-business workflows.
          </p>
          <div className="nl-button-group">
            <a href="#products" onClick={(e) => { e.preventDefault(); handleNavClick('#products'); }} className="nl-button-primary">
              Explore Products →
            </a>
            <a href="#roadmap" onClick={(e) => { e.preventDefault(); handleNavClick('#roadmap'); }} className="nl-button-secondary">
              Follow the Roadmap
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="nl-footer">
        <div className="nl-footer-content">
          <div className="nl-footer-grid">
            <div>
              <a href="#hero" onClick={() => handleNavClick('#hero')} className="nl-footer-brand" aria-label="Nieves Labs">
                <div className="nl-footer-brand-icon"></div>
                <span className="nl-footer-brand-text">Nieves Labs</span>
              </a>
              <p className="nl-footer-desc">
                Practical AI products for real-world work
              </p>
            </div>

            <div>
              <h4 className="nl-footer-section-title">Products</h4>
              <div className="nl-footer-links">
                <a href="#answerbrief" onClick={() => handleNavClick('#answerbrief')} className="nl-footer-link">AnswerBrief AI</a>
                <a href="#platform" onClick={() => handleNavClick('#platform')} className="nl-footer-link">AI Platform</a>
                <a href="#interview" onClick={() => handleNavClick('#interview')} className="nl-footer-link">Interview Coach</a>
                <a href="#workflow" onClick={() => handleNavClick('#workflow')} className="nl-footer-link">Workflow Studio</a>
              </div>
            </div>

            <div>
              <h4 className="nl-footer-section-title">Resources</h4>
              <div className="nl-footer-links">
                <a href="#roadmap" onClick={() => handleNavClick('#roadmap')} className="nl-footer-link">Roadmap</a>
                <a href="#contact" onClick={() => handleNavClick('#contact')} className="nl-footer-link">Documentation</a>
                <a href="#contact" onClick={() => handleNavClick('#contact')} className="nl-footer-link">Blog</a>
                <a href="#contact" onClick={() => handleNavClick('#contact')} className="nl-footer-link">Contact</a>
              </div>
            </div>

            <div>
              <h4 className="nl-footer-section-title">Connect</h4>
              <div className="nl-footer-social">
                <a 
                  href="https://github.com/boritomas/nieves-labs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="nl-footer-social-button"
                  aria-label="Visit GitHub repository"
                >
                  <Github size={20} />
                </a>
                <a
                  href="mailto:hello@nieves-labs.com"
                  className="nl-footer-social-button"
                  aria-label="Send email"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="nl-footer-bottom">
            <p className="nl-footer-copyright">
              &copy; {new Date().getFullYear()} Nieves Labs. All rights reserved.
            </p>
            <div className="nl-footer-bottom-links">
              <a href="#contact" onClick={() => handleNavClick('#contact')} className="nl-footer-bottom-link">Privacy</a>
              <a href="#contact" onClick={() => handleNavClick('#contact')} className="nl-footer-bottom-link">Terms</a>
              <a href="#contact" onClick={() => handleNavClick('#contact')} className="nl-footer-bottom-link">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* CONTACT SECTION (hidden anchor) */}
      <section id="contact" style={{ display: 'none' }}></section>
    </div>
  );
}
