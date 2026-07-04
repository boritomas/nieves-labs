'use client';

import { useState } from 'react';
import { Check, Clock, Github, Mail } from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const products = [
    {
      name: 'AnswerBrief AI',
      description: 'Meeting intelligence, summaries, follow-ups, and executive-ready updates.',
      status: 'In progress',
    },
    {
      name: 'Nieves AI Platform',
      description: 'The operating system for managing products, workflows, AI agents, and deployments.',
      status: 'Foundation',
    },
    {
      name: 'Interview Coach',
      description: 'AI-powered interview preparation, practice, and personalized feedback.',
      status: 'Planned',
    },
    {
      name: 'Workflow Studio',
      description: 'Automation systems that connect docs, email, Slack, Jira, and reporting.',
      status: 'Planned',
    },
    {
      name: 'TaxAppealBuddy',
      description: 'Property tax appeal support using comps, packets, and hearing preparation.',
      status: 'Prototype',
    },
  ];

  const workflowSteps = ['Problem', 'Product Spec', 'AI Build', 'Review', 'Deploy', 'Learn'];

  const completed = [
    'GitHub repository setup',
    'Vercel deployment pipeline',
    'Foundation documentation',
    'Brand messaging',
    'Premium homepage v1',
  ];

  const upcoming = [
    'Product detail pages',
    'Command Center interface',
    'Component library',
    'API documentation',
    'User authentication',
    'Analytics dashboard',
  ];

  return (
    <div className="nl-page">
      {/* HEADER */}
      <header className="nl-header">
        <div className="nl-header-content">
          <div className="nl-logo">
            <div className="nl-logo-icon"></div>
            <span>Nieves Labs</span>
          </div>

          <nav className={`nl-nav ${mobileMenuOpen ? 'active' : ''}`}>
            <a href="#products">Products</a>
            <a href="#workflow">Workflow</a>
            <a href="#roadmap">Roadmap</a>
            <button className="nl-nav-button">Get Started</button>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="nl-menu-toggle"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="nl-mobile-menu active">
            <a href="#products">Products</a>
            <a href="#workflow">Workflow</a>
            <a href="#roadmap">Roadmap</a>
            <button className="nl-nav-button" style={{ width: '100%' }}>Get Started</button>
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
              <button className="nl-button-primary">
                Explore Products →
              </button>
              <button className="nl-button-secondary">
                See the Platform
              </button>
            </div>
          </div>

          <div className="nl-hero-visual">
            <div className="nl-floating-card" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <div className="nl-card-title" style={{ color: '#93c5fd' }}>AnswerBrief AI</div>
              <div className="nl-card-desc">Meeting intelligence & summaries</div>
              <div className="nl-card-badge" style={{ background: 'rgba(59, 130, 246, 0.3)', borderColor: 'rgba(59, 130, 246, 0.5)', color: '#93c5fd' }}>
                In progress
              </div>
            </div>
            <div className="nl-floating-card" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
              <div className="nl-card-title" style={{ color: '#d8b4fe' }}>Nieves AI Platform</div>
              <div className="nl-card-desc">Operating system for AI products</div>
              <div className="nl-card-badge" style={{ background: 'rgba(168, 85, 247, 0.3)', borderColor: 'rgba(168, 85, 247, 0.5)', color: '#d8b4fe' }}>
                Foundation
              </div>
            </div>
            <div className="nl-floating-card" style={{ background: 'rgba(6, 182, 212, 0.1)' }}>
              <div className="nl-card-title" style={{ color: '#a5f3fc' }}>Interview Coach</div>
              <div className="nl-card-desc">AI-powered interview prep</div>
              <div className="nl-card-badge" style={{ background: 'rgba(6, 182, 212, 0.3)', borderColor: 'rgba(6, 182, 212, 0.5)', color: '#a5f3fc' }}>
                Planned
              </div>
            </div>
            <div className="nl-floating-card" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
              <div className="nl-card-title" style={{ color: '#86efac' }}>Workflow Studio</div>
              <div className="nl-card-desc">Automation & integrations</div>
              <div className="nl-card-badge" style={{ background: 'rgba(34, 197, 94, 0.3)', borderColor: 'rgba(34, 197, 94, 0.5)', color: '#86efac' }}>
                Planned
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section id="products" className="nl-products">
        <div className="nl-section-content">
          <div className="nl-section-header">
            <h2 className="nl-section-title">Our Products</h2>
            <p className="nl-section-subtitle">
              A suite of AI-powered tools designed to solve real problems
            </p>
          </div>

          <div className="nl-product-grid">
            {products.map((product, idx) => (
              <div key={idx} className="nl-product-card">
                <div className="nl-product-icon">💡</div>
                <h3 className="nl-product-name">{product.name}</h3>
                <p className="nl-product-desc">{product.description}</p>
                <div className="nl-product-footer">
                  <span className="nl-status-badge">{product.status}</span>
                  <div className="nl-product-dot"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            <button className="nl-button-primary">Explore Products →</button>
            <button className="nl-button-secondary">Follow the Roadmap</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="nl-footer">
        <div className="nl-footer-content">
          <div className="nl-footer-grid">
            <div>
              <div className="nl-footer-brand">
                <div className="nl-footer-brand-icon"></div>
                <span className="nl-footer-brand-text">Nieves Labs</span>
              </div>
              <p className="nl-footer-desc">
                Practical AI products for real-world work
              </p>
            </div>

            <div>
              <h4 className="nl-footer-section-title">Products</h4>
              <div className="nl-footer-links">
                <a href="#" className="nl-footer-link">AnswerBrief AI</a>
                <a href="#" className="nl-footer-link">AI Platform</a>
                <a href="#" className="nl-footer-link">Interview Coach</a>
                <a href="#" className="nl-footer-link">Workflow Studio</a>
              </div>
            </div>

            <div>
              <h4 className="nl-footer-section-title">Resources</h4>
              <div className="nl-footer-links">
                <a href="#" className="nl-footer-link">Roadmap</a>
                <a href="#" className="nl-footer-link">Documentation</a>
                <a href="#" className="nl-footer-link">Blog</a>
                <a href="#" className="nl-footer-link">Contact</a>
              </div>
            </div>

            <div>
              <h4 className="nl-footer-section-title">Connect</h4>
              <div className="nl-footer-social">
                <button className="nl-footer-social-button">
                  <Github size={20} />
                </button>
                <button className="nl-footer-social-button">
                  <Mail size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="nl-footer-bottom">
            <p className="nl-footer-copyright">
              &copy; {new Date().getFullYear()} Nieves Labs. All rights reserved.
            </p>
            <div className="nl-footer-bottom-links">
              <a href="#" className="nl-footer-bottom-link">Privacy</a>
              <a href="#" className="nl-footer-bottom-link">Terms</a>
              <a href="#" className="nl-footer-bottom-link">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
