'use client';

import { useState, useEffect } from 'react';
import { Calendar, GitBranch, Github, Home, BookOpen, BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function CommandCenter() {
  const [currentDate, setCurrentDate] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const date = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    setCurrentDate(date);
    setMounted(true);
  }, []);

  const products = [
    {
      name: 'Nieves AI Platform',
      status: 'Active Development',
      version: '0.1',
      lastUpdated: 'July 2026',
      nextMilestone: 'Build Command Center',
      statusColor: '#f59e0b',
    },
    {
      name: 'AnswerBrief AI',
      status: 'Operational',
      version: '1.0',
      lastUpdated: 'July 2026',
      nextMilestone: 'Final workflow polish',
      statusColor: '#10b981',
    },
    {
      name: 'Workflow Studio',
      status: 'Planning',
      version: 'Concept',
      lastUpdated: 'July 2026',
      nextMilestone: 'Design specifications',
      statusColor: '#06b6d4',
    },
    {
      name: 'Interview Coach',
      status: 'Planning',
      version: 'Concept',
      lastUpdated: 'July 2026',
      nextMilestone: 'Design specifications',
      statusColor: '#06b6d4',
    },
    {
      name: 'TaxAppealBuddy',
      status: 'Prototype',
      version: '0.1',
      lastUpdated: 'July 2026',
      nextMilestone: 'User validation phase',
      statusColor: '#a855f7',
    },
  ];

  const kanbanItems = {
    backlog: [
      { title: 'Workflow Studio', product: 'Workflow Studio' },
      { title: 'Interview Coach', product: 'Interview Coach' },
    ],
    inProgress: [
      { title: 'Nieves AI Platform', product: 'Nieves AI Platform' },
      { title: 'AnswerBrief AI Polish', product: 'AnswerBrief AI' },
    ],
    testing: [
      { title: 'TaxAppealBuddy Validation', product: 'TaxAppealBuddy' },
    ],
    production: [
      { title: 'AnswerBrief AI', product: 'AnswerBrief AI' },
    ],
  };

  const roadmapItems = {
    now: [
      'AnswerBrief AI final polish',
      'Nieves AI Platform core features',
    ],
    next: [
      'TaxAppealBuddy user validation',
      'Workflow Studio design phase',
    ],
    later: [
      'Interview Coach development',
      'Command Center full release',
    ],
  };

  const healthMetrics = [
    { label: 'Products', value: '6', icon: '📦', color: '#3b82f6' },
    { label: 'Repositories', value: '1', icon: '🏗️', color: '#a855f7' },
    { label: 'Deployments', value: '1', icon: '🚀', color: '#10b981' },
    { label: 'Documentation', value: '2', icon: '📚', color: '#f59e0b' },
  ];

  const quickActions = [
    { label: 'View Product Catalog', href: '/docs/PRODUCT_CATALOG.md', icon: BookOpen },
    { label: 'View Product Registry', href: '/docs/PRODUCT_REGISTRY.md', icon: BarChart3 },
    { label: 'Open GitHub', href: 'https://github.com/boritomas/nieves-labs', icon: Github, external: true },
    { label: 'View Homepage', href: '/', icon: Home },
  ];
  
  const documentationHub = [
    { title: 'Product Catalog', href: '#doc-product-catalog', summary: 'Public messaging rules and product positioning guidance.' },
    { title: 'Product Registry', href: '#doc-product-registry', summary: 'Canonical status, ownership, and milestone tracking for each product.' },
    { title: 'Roadmap', href: '#doc-roadmap', summary: 'Internal planning direction for now, next, and later priorities.' },
    { title: 'Changelog', href: '#doc-changelog', summary: 'Release-level record of meaningful platform and product changes.' },
    { title: 'Brand Guidelines', href: '#doc-brand-guidelines', summary: 'Design and voice guardrails for consistent Nieves Labs presentation.' },
    { title: 'Engineering Workflow', href: '#doc-engineering-workflow', summary: 'Build, review, and delivery process documentation for internal teams.' },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="cc-page">
      {/* HEADER */}
      <header className="cc-header">
        <div className="cc-header-content">
          <div className="cc-logo-section">
            <h1 className="cc-logo">Nieves Command Center</h1>
            <p className="cc-tagline">Internal Dashboard v0.1</p>
          </div>
          <div className="cc-header-info">
            <div className="cc-date-badge">
              <Calendar size={16} />
              <span>{currentDate}</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="cc-main">
        <div className="cc-container">
          <div className="cc-internal-notice">
            Internal operating dashboard for Nieves Labs. Not public marketing content.
          </div>

          {/* QUICK ACTIONS */}
          <section className="cc-section">
            <h2 className="cc-section-title">Quick Actions</h2>
            <div className="cc-actions-grid">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <a
                    key={idx}
                    href={action.href}
                    target={action.external ? '_blank' : undefined}
                    rel={action.external ? 'noopener noreferrer' : undefined}
                    className="cc-action-button"
                  >
                    <Icon size={20} />
                    <span>{action.label}</span>
                  </a>
                );
              })}
            </div>
          </section>

          {/* DOCUMENTATION HUB */}
          <section className="cc-section">
            <h2 className="cc-section-title">Documentation Hub</h2>
            <div className="cc-products-grid">
              {documentationHub.map((doc, idx) => (
                <a key={idx} href={doc.href} className="cc-product-card cc-doc-card" aria-label={doc.title}>
                  <span id={doc.href.replace('#', '')} className="cc-doc-anchor"></span>
                  <div className="cc-product-header">
                    <h3 className="cc-product-name">{doc.title}</h3>
                    <div className="cc-status-badge cc-status-badge-source">
                      Internal source of truth
                    </div>
                  </div>
                  <div className="cc-product-details">
                    <p className="cc-doc-summary">{doc.summary}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* PRODUCT PORTFOLIO */}
          <section className="cc-section">
            <h2 className="cc-section-title">Product Portfolio</h2>
            <div className="cc-products-grid">
              {products.map((product, idx) => (
                <div key={idx} className="cc-product-card">
                  <div className="cc-product-header">
                    <h3 className="cc-product-name">{product.name}</h3>
                    <div className="cc-status-badge" style={{ backgroundColor: `${product.statusColor}20`, borderColor: product.statusColor, color: product.statusColor }}>
                      {product.status}
                    </div>
                  </div>
                  <div className="cc-product-details">
                    <div className="cc-detail-row">
                      <span className="cc-detail-label">Version:</span>
                      <span className="cc-detail-value">{product.version}</span>
                    </div>
                    <div className="cc-detail-row">
                      <span className="cc-detail-label">Last Updated:</span>
                      <span className="cc-detail-value">{product.lastUpdated}</span>
                    </div>
                    <div className="cc-detail-row">
                      <span className="cc-detail-label">Next Milestone:</span>
                      <span className="cc-detail-value">{product.nextMilestone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* DEVELOPMENT QUEUE - KANBAN */}
          <section className="cc-section">
            <h2 className="cc-section-title">Development Queue</h2>
            <div className="cc-kanban-board">
              {/* Backlog */}
              <div className="cc-kanban-column">
                <div className="cc-kanban-header">
                  <h3>Backlog</h3>
                  <span className="cc-kanban-count">{kanbanItems.backlog.length}</span>
                </div>
                <div className="cc-kanban-items">
                  {kanbanItems.backlog.map((item, idx) => (
                    <div key={idx} className="cc-kanban-card">
                      <p className="cc-kanban-title">{item.title}</p>
                      <p className="cc-kanban-product">{item.product}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* In Progress */}
              <div className="cc-kanban-column">
                <div className="cc-kanban-header">
                  <h3>In Progress</h3>
                  <span className="cc-kanban-count">{kanbanItems.inProgress.length}</span>
                </div>
                <div className="cc-kanban-items">
                  {kanbanItems.inProgress.map((item, idx) => (
                    <div key={idx} className="cc-kanban-card">
                      <p className="cc-kanban-title">{item.title}</p>
                      <p className="cc-kanban-product">{item.product}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testing */}
              <div className="cc-kanban-column">
                <div className="cc-kanban-header">
                  <h3>Testing</h3>
                  <span className="cc-kanban-count">{kanbanItems.testing.length}</span>
                </div>
                <div className="cc-kanban-items">
                  {kanbanItems.testing.map((item, idx) => (
                    <div key={idx} className="cc-kanban-card">
                      <p className="cc-kanban-title">{item.title}</p>
                      <p className="cc-kanban-product">{item.product}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Production */}
              <div className="cc-kanban-column">
                <div className="cc-kanban-header">
                  <h3>Production</h3>
                  <span className="cc-kanban-count">{kanbanItems.production.length}</span>
                </div>
                <div className="cc-kanban-items">
                  {kanbanItems.production.map((item, idx) => (
                    <div key={idx} className="cc-kanban-card">
                      <p className="cc-kanban-title">{item.title}</p>
                      <p className="cc-kanban-product">{item.product}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ROADMAP SNAPSHOT */}
          <section className="cc-section">
            <h2 className="cc-section-title">Roadmap Snapshot</h2>
            <div className="cc-roadmap-grid">
              {/* Now */}
              <div className="cc-roadmap-column">
                <div className="cc-roadmap-header">
                  <Clock size={20} color="#10b981" />
                  <h3>Now</h3>
                </div>
                <ul className="cc-roadmap-list">
                  {roadmapItems.now.map((item, idx) => (
                    <li key={idx}>
                      <CheckCircle size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next */}
              <div className="cc-roadmap-column">
                <div className="cc-roadmap-header">
                  <AlertCircle size={20} color="#f59e0b" />
                  <h3>Next</h3>
                </div>
                <ul className="cc-roadmap-list">
                  {roadmapItems.next.map((item, idx) => (
                    <li key={idx}>
                      <AlertCircle size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Later */}
              <div className="cc-roadmap-column">
                <div className="cc-roadmap-header">
                  <Clock size={20} color="#3b82f6" />
                  <h3>Later</h3>
                </div>
                <ul className="cc-roadmap-list">
                  {roadmapItems.later.map((item, idx) => (
                    <li key={idx}>
                      <Clock size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* PLATFORM HEALTH */}
          <section className="cc-section">
            <h2 className="cc-section-title">Platform Health</h2>
            <div className="cc-health-grid">
              {healthMetrics.map((metric, idx) => (
                <div key={idx} className="cc-health-card">
                  <div className="cc-health-icon">{metric.icon}</div>
                  <div className="cc-health-content">
                    <p className="cc-health-label">{metric.label}</p>
                    <p className="cc-health-value">{metric.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="cc-footer">
        <p>Nieves Command Center • Internal Dashboard • v0.1</p>
        <p className="cc-footer-note">This is an internal dashboard. Data is mock only.</p>
      </footer>
    </div>
  );
}
