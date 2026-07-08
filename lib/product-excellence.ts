export type ProductExcellenceReview = {
  slug: string;
  product: string;
  stage: string;
  score: number;
  status: string;
  productionDomain: string;
  fallbackUrl: string;
  repository: string;
  mission: string;
  positioning: string;
  primaryCustomer: string;
  problem: string;
  transformation: string;
  completedWork: string[];
  externalFeedback: string[];
  aiReviewFindings: string[];
  competitorResearch: Array<{
    name: string;
    strength: string;
    lesson: string;
    differentiation: string;
  }>;
  mustFix: string[];
  shouldFix: string[];
  productConstitution: {
    always: string[];
    never: string[];
  };
  successMetrics: string[];
  launchCriteria: string[];
  scorecard: Array<{
    category: string;
    score: number;
  }>;
  recommendation: string;
  nextAction: string;
};

export const productExcellenceReviews: ProductExcellenceReview[] = [
  {
    slug: 'answerbrief-ai-launch-review',
    product: 'AnswerBrief AI',
    stage: 'Launch Candidate',
    score: 90,
    status: 'Launch Candidate',
    productionDomain: 'https://answer-brief.com',
    fallbackUrl: 'https://answerbrief-ai-automation.vercel.app/',
    repository: 'boritomas/answerbrief-ai-automation',
    mission: 'Help candidates walk into interviews knowing what to say by turning a resume and job posting into a focused interview strategy.',
    positioning: 'The fastest way to turn your resume and a job posting into a focused interview preparation strategy delivered within 24 hours.',
    primaryCustomer: 'Job seekers, career changers, professionals preparing for leadership, technical, business, government, compliance, or internal promotion interviews.',
    problem: 'Interview preparation is stressful, scattered, time-consuming, and often generic. Candidates need role-specific preparation quickly without paying for long coaching programs or subscriptions.',
    transformation: 'The user goes from anxious and unorganized to prepared with likely questions, STAR story angles, strengths to emphasize, gaps to prepare for, opening pitch guidance, and a final prep checklist.',
    completedWork: [
      'Production landing page built',
      'Free Interview Fit Check added',
      'Fit Check results page added',
      'Pricing/package structure added',
      'Stripe live payment links connected',
      'Intake workflow added',
      'Gmail automation framework added',
      'Google Drive automation framework added',
      'Admin order dashboard added',
      'Sample Brief page added',
      'Backend automation framework added',
      'Production deployment validated',
      'GitHub release v1.0-beta created',
      'answer-brief.com purchased through Cloudflare',
    ],
    externalFeedback: [
      'Site looks serious and well structured',
      'Value proposition is clear',
      'Pricing is reasonable',
      'One-time brief model is a good differentiator versus subscription products',
      'Main trust gaps are founder credibility, privacy policy, testimonials, refund policy, and deeper sample brief',
      'Sample Brief should be more visible near the top of the homepage',
      'Stripe links should be verified as production/live',
      'Vercel domain reduces trust, custom domain should be used',
      'Need clearer "what happens after payment" section',
      'Add refund/delivery policy',
      'Add privacy/terms pages',
      'Avoid overpromising or implying guaranteed job outcomes',
    ],
    aiReviewFindings: [
      'Multiple AI reviews converged on trust, credibility, sample output visibility, privacy, and conversion clarity',
      'Consensus: product is useful and credible but needs stronger proof',
      'Consensus: do not add fake testimonials',
      'Consensus: show the deliverable earlier',
      'Consensus: emphasize confidence and interview strategy, not generic AI prep',
      'Consensus: keep product simple and focused',
    ],
    competitorResearch: [
      {
        name: 'Career.io',
        strength: 'Broad career platform',
        lesson: 'Professional polish, clear career journey, breadth of services',
        differentiation: 'Focused, faster, one-time interview strategy',
      },
      {
        name: 'InterviewBuddy',
        strength: 'Mock interviews, expert sessions, role-specific practice',
        lesson: 'Confidence-building and role-specific positioning',
        differentiation: 'No scheduling, no subscription, fast written preparation',
      },
      {
        name: 'PassMyInterview / Richard McMunn',
        strength: 'Authority, founder credibility, templates, practical answers',
        lesson: 'Show expertise, sample answers, structured preparation',
        differentiation: 'Personalized brief built from resume + job posting',
      },
      {
        name: 'Final Round AI',
        strength: 'Live interview copilot',
        lesson: 'Strong AI positioning',
        differentiation: 'Preparation before the interview, less risky, simpler',
      },
      {
        name: 'Yoodli / Big Interview',
        strength: 'Communication coaching and practice',
        lesson: 'Skill-building framing',
        differentiation: 'Focused deliverable, fast turnaround',
      },
    ],
    mustFix: [
      'Connect answer-brief.com to Vercel and make it primary',
      'Verify all Stripe links are live production links',
      'Add Privacy Policy',
      'Add Terms of Service',
      'Add Refund Policy',
      'Move Sample Brief preview above pricing',
      'Expand Sample Brief with STAR story, opening pitch, likely questions, strengths/gaps, checklist',
      'Add founder/credibility section',
      'Add "What happens after payment?" section',
      'Strengthen FAQ',
      'Add role-based use cases',
      'Add secure checkout / document privacy language',
      'Add support email/contact path',
    ],
    shouldFix: [
      'Add explainer video placeholder',
      'Add early-user feedback section without fake testimonials',
      'Rename packages to Interview Kickstart, Interview Advantage, and Executive Edge if safe',
      'Add coming soon roadmap: mock interview practice',
      'Add coming soon roadmap: resume review add-on',
      'Add coming soon roadmap: LinkedIn review',
      'Add coming soon roadmap: follow-up email package',
      'Add coming soon roadmap: salary negotiation prep',
    ],
    productConstitution: {
      always: [
        'Respect resume and job-posting privacy',
        'Be transparent about limitations',
        'Provide practical interview preparation',
        'Avoid fake testimonials',
        'Avoid guarantees',
        'Reduce interview anxiety',
        'Show the value before purchase',
        'Keep the product focused and simple',
      ],
      never: [
        'Guarantee job offers',
        'Guarantee interview outcomes',
        'Use fake social proof',
        'Misrepresent AI output',
        'Expose uploaded resume/job details',
        'Use private employer-specific examples',
        'Become a bloated career platform before proving the core product',
      ],
    },
    successMetrics: [
      'Homepage conversion rate',
      'Free Fit Check completion rate',
      'Fit Check to checkout conversion',
      'Stripe checkout conversion',
      'Paid brief purchases',
      'Intake completion rate',
      'Brief delivery completion rate',
      'Refund rate',
      'Customer satisfaction',
      'Testimonials collected',
      'Referral usage',
    ],
    launchCriteria: [
      'answer-brief.com connected and primary',
      'Stripe production links verified',
      'Privacy/Terms/Refund live',
      'Sample Brief visible above pricing',
      'What happens after payment section live',
      'Founder/credibility section live',
      'FAQ upgraded',
      'Use cases live',
      'Mobile QA complete',
      'End-to-end order/intake/delivery validated',
      'No fake testimonials',
      'No guaranteed job claims',
    ],
    scorecard: [
      { category: 'Product Vision', score: 10 },
      { category: 'Customer Problem', score: 10 },
      { category: 'UX/UI', score: 9 },
      { category: 'Accessibility', score: 9 },
      { category: 'Trust & Privacy', score: 8 },
      { category: 'Automation', score: 9 },
      { category: 'Performance', score: 10 },
      { category: 'Competitive Positioning', score: 9 },
      { category: 'Conversion', score: 8 },
      { category: 'Launch Readiness', score: 8 },
    ],
    recommendation: 'Launch Candidate, minor fixes required before public launch.',
    nextAction: 'Execute AnswerBrief AI v2.0 Launch Candidate implementation, connect answer-brief.com, verify Stripe production links, complete privacy/trust upgrades, and run final production QA.',
  },
];

export function getProductExcellenceReview(slug: string) {
  return productExcellenceReviews.find((review) => review.slug === slug);
}
