# Changelog

All notable changes to Nieves Labs are documented in this file.

## [1.0.0] - 2026-07-04

### Added
- **Premium Visual Homepage v1** - Full visual SaaS landing page replacing the text-based homepage
  - Full-screen animated hero with dark gradient background and subtle grid overlay
  - Right-side floating visual panel with product cards, connecting lines, and status pills
  - Glassmorphism effects throughout (backdrop-blur, transparent backgrounds, glass-card utility)
  - CSS animation keyframes: float, floatSlow, fadeIn, slideUp, slideInRight, pulse-glow
  - Background grid pattern utilities (bg-grid, bg-grid-light)
  - Sticky navigation with lucide-react icons and mobile-responsive menu
  - 5 product cards with glassmorphism styling, hover effects, and status pills
  - 6-step workflow diagram with animated connecting line and mobile-responsive layout
  - Visual roadmap section with completed checkmarks and progress indicators
  - Full-width CTA section with dark gradient and glow orbs
  - Professional footer with logo, links, and dynamic copyright year
- **lucide-react** dependency added for icon components
- **CHANGELOG.md** - Release history tracking
- Next.js 14+ compatibility with proper viewport configuration
- Tailwind CSS dark-theme styling with glassmorphism SaaS aesthetic
- Accessibility features (semantic HTML, ARIA labels, keyboard navigation)

### Changed
- Replaced text-based homepage with full visual premium SaaS design
- Updated globals.css with animation keyframes and glassmorphism utilities
- Body background updated to slate-950 for dark theme consistency
- Removed WhyNievesLabs section from page layout
- Header updated with lucide-react Menu/X icons and gradient-effect logo
- All components now use dark-theme Tailwind classes and glass-card utilities

### Technical Details
- SSR-safe implementation (no browser-only APIs during server render)
- Zero build blockers for Vercel deployment
- Mobile-first responsive design (sm, md, lg breakpoints)
- CSS keyframe animations for floating, fade, and slide effects
- Vercel deployment compatible

## [0.1.0] - 2026-07-04

### Added
- GitHub repository initialization
- Vercel deployment pipeline
- Foundation documentation
  - Brand Guidelines
  - Design System
  - Component Library
  - Homepage Specification
  - Engineering Workflow
- Product manifest configuration
- Project roadmap
