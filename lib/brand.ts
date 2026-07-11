export type BrandProductKey =
  | 'answerbrief_ai'
  | 'mixpilot_ai'
  | 'tax_buddy'
  | 'tax_appeal_buddy'
  | 'interview_coach'
  | 'workforce_study'
  | 'nieves_ai_platform';

export type BrandProduct = {
  key: BrandProductKey;
  name: string;
  shortName: string;
  category: string;
  accent: string;
  accentDark: string;
  accentSoft: string;
  icon: string;
  motif: string;
  promise: string;
  personality: string;
  targetCustomer: string;
  perception: string;
};

export const nievesBrand = {
  name: 'Nieves Labs',
  promise: 'AI solutions that empower people.',
  voice: ['clear', 'confident', 'human', 'helpful', 'practical', 'credible'],
  direction: 'Executive AI product ecosystem',
  typography: {
    primary: 'Inter',
    fallback: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  colors: {
    navy950: '#06111E',
    navy900: '#0D1B2A',
    navy800: '#13283D',
    gold500: '#D4AF37',
    gold400: '#F2C14E',
    slate400: '#94A3B8',
    slate200: '#E2E8F0',
    white: '#F8FAFC',
    black: '#020617',
  },
  positioningDirections: [
    {
      name: 'Human-Centered Automation',
      summary: 'Practical AI tools that reduce friction and help people move with confidence.',
      score: 9.2,
    },
    {
      name: 'Executive AI Product Studio',
      summary: 'A premium product ecosystem for focused, decision-ready AI workflows.',
      score: 8.7,
    },
    {
      name: 'Operational Clarity Lab',
      summary: 'AI systems that turn scattered work into clear deliverables and next steps.',
      score: 8.5,
    },
    {
      name: 'Personal AI Workbench',
      summary: 'Useful AI assistants for everyday professional preparation and organization.',
      score: 7.8,
    },
  ],
};

export const brandProducts: BrandProduct[] = [
  {
    key: 'answerbrief_ai',
    name: 'AnswerBrief AI',
    shortName: 'AnswerBrief',
    category: 'Interview preparation',
    accent: '#2563EB',
    accentDark: '#1D4ED8',
    accentSoft: '#DBEAFE',
    icon: 'message',
    motif: 'conversation bubbles and concise brief lines',
    promise: 'Walk into the interview knowing exactly what to say.',
    personality: 'focused, calm, strategic',
    targetCustomer: 'Candidates preparing for high-stakes interviews.',
    perception: 'trusted interview strategy partner',
  },
  {
    key: 'mixpilot_ai',
    name: 'MixPilot AI',
    shortName: 'MixPilot',
    category: 'Music planning',
    accent: '#A855F7',
    accentDark: '#7E22CE',
    accentSoft: '#F3E8FF',
    icon: 'flask',
    motif: 'waveforms, set sections, and energy arcs',
    promise: 'Turn playlists into DJ-style set plans.',
    personality: 'creative, energetic, approachable',
    targetCustomer: 'Creators, hosts, casual DJs, and event planners.',
    perception: 'easygoing AI set-planning companion',
  },
  {
    key: 'tax_buddy',
    name: 'Tax Buddy AI',
    shortName: 'Tax Buddy',
    category: 'Tax organization',
    accent: '#10B981',
    accentDark: '#047857',
    accentSoft: '#D1FAE5',
    icon: 'document',
    motif: 'organized forms, checkmarks, and clean packets',
    promise: 'Organize tax materials before professional review.',
    personality: 'steady, practical, reassuring',
    targetCustomer: 'Individuals, freelancers, and small business owners.',
    perception: 'organized tax-prep support',
  },
  {
    key: 'tax_appeal_buddy',
    name: 'Tax Appeal Buddy AI',
    shortName: 'Tax Appeal',
    category: 'Property appeal preparation',
    accent: '#06B6D4',
    accentDark: '#0891B2',
    accentSoft: '#CFFAFE',
    icon: 'columns',
    motif: 'evidence packets, civic columns, and comparison grids',
    promise: 'Prepare clearer property tax appeal materials.',
    personality: 'authoritative, structured, fair-minded',
    targetCustomer: 'Property owners and appeal preparers.',
    perception: 'credible appeal-packet organizer',
  },
  {
    key: 'interview_coach',
    name: 'Interview Coach AI',
    shortName: 'Interview Coach',
    category: 'Interview practice',
    accent: '#F97316',
    accentDark: '#C2410C',
    accentSoft: '#FFEDD5',
    icon: 'person',
    motif: 'practice loops, confidence markers, and coaching signals',
    promise: 'Practice smarter before the conversation matters.',
    personality: 'encouraging, direct, energizing',
    targetCustomer: 'Candidates who need structured interview practice.',
    perception: 'supportive interview practice guide',
  },
  {
    key: 'workforce_study',
    name: 'Workforce Study AI',
    shortName: 'Workforce Study',
    category: 'Workforce intelligence',
    accent: '#FBBF24',
    accentDark: '#B45309',
    accentSoft: '#FEF3C7',
    icon: 'chart',
    motif: 'insight bars, process maps, and trend lines',
    promise: 'Turn workforce context into smarter decisions.',
    personality: 'analytical, clear, decisive',
    targetCustomer: 'Small teams and operators evaluating work patterns.',
    perception: 'decision-ready workforce analysis',
  },
  {
    key: 'nieves_ai_platform',
    name: 'Nieves AI Platform',
    shortName: 'AI Platform',
    category: 'AI operating system',
    accent: '#6366F1',
    accentDark: '#4338CA',
    accentSoft: '#E0E7FF',
    icon: 'network',
    motif: 'connected nodes, reusable workflows, and platform foundations',
    promise: 'The foundation for practical AI product operations.',
    personality: 'intelligent, modular, dependable',
    targetCustomer: 'Founders and operators building practical AI workflows.',
    perception: 'trusted AI operations foundation',
  },
];

export const productBrandByKey = Object.fromEntries(
  brandProducts.map((product) => [product.key, product]),
) as Record<BrandProductKey, BrandProduct>;

export const logoConceptScorecard = [
  {
    concept: 'A. Precision Monogram',
    description: 'Geometric NL monogram inside a disciplined square frame with premium gold strokes.',
    scores: {
      brandFit: 9,
      originality: 8,
      memorability: 9,
      clarity: 9,
      trust: 9,
      scalability: 9,
      productFamilyCompatibility: 10,
      webPerformance: 10,
      mobilePerformance: 9,
      printPerformance: 9,
      implementationComplexity: 8,
    },
    selected: true,
  },
  {
    concept: 'B. Signal Network',
    description: 'NL monogram with node paths and AI-network symbolism.',
    scores: {
      brandFit: 8,
      originality: 7,
      memorability: 7,
      clarity: 7,
      trust: 8,
      scalability: 7,
      productFamilyCompatibility: 9,
      webPerformance: 8,
      mobilePerformance: 7,
      printPerformance: 7,
      implementationComplexity: 6,
    },
    selected: false,
  },
  {
    concept: 'C. Executive Wordmark',
    description: 'Minimal wordmark-led system with a small gold NL badge.',
    scores: {
      brandFit: 8,
      originality: 6,
      memorability: 6,
      clarity: 10,
      trust: 9,
      scalability: 8,
      productFamilyCompatibility: 7,
      webPerformance: 10,
      mobilePerformance: 7,
      printPerformance: 9,
      implementationComplexity: 9,
    },
    selected: false,
  },
];
