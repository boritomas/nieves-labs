export type ProductKey =
  | 'answerbrief_ai'
  | 'tax_buddy'
  | 'tax_appeal_buddy'
  | 'interview_coach'
  | 'workforce_study'
  | 'mixpilot_ai'
  | 'automix_pro'
  | 'nieves_ai_platform';

export type ProductPackage = {
  id: string;
  name: string;
  price: number;
  stripePriceIdEnv: string;
  turnaround: string;
  description: string;
  includes: string[];
};

export type IntakeQuestion = {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
};

export type ProductWorkflowKey =
  | 'answerbrief_fulfillment'
  | 'tax_buddy_organizer'
  | 'tax_appeal_packet'
  | 'interview_coach_plan'
  | 'workforce_study_report'
  | 'mixpilot_set_plan'
  | 'platform_consultation';

export type ProductWorkflowStep = {
  id: string;
  label: string;
  required: boolean;
};

export type ProductWorkflowDefinition = {
  key: ProductWorkflowKey;
  version: string;
  engine: 'naip_shared_workflow';
  requiresPayment: boolean;
  durableStorageRequired: boolean;
  steps: ProductWorkflowStep[];
};

export type ProductIntakeSchema = {
  requiredFiles: string[];
  questions: IntakeQuestion[];
};

export type Product = {
  key: ProductKey;
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  idealCustomer: string;
  problem: string;
  solution: string;
  features: string[];
  deliverables: string[];
  requiredFiles: string[];
  requiredQuestions: IntakeQuestion[];
  intakeSchema: ProductIntakeSchema;
  workflow: ProductWorkflowDefinition;
  lifecycleStage: 'live' | 'beta' | 'internal';
  publicAvailability: 'available' | 'waitlist' | 'internal';
  packages: ProductPackage[];
  faq: Array<{ question: string; answer: string }>;
  disclaimer: string;
};

type ProductDefinition = Omit<Product, 'intakeSchema' | 'workflow' | 'lifecycleStage' | 'publicAvailability'> & Partial<Pick<Product, 'intakeSchema' | 'workflow' | 'lifecycleStage' | 'publicAvailability'>>;

export const products: Product[] = defineProducts([
  {
    key: 'answerbrief_ai',
    slug: 'answerbrief-ai',
    title: 'AnswerBrief AI',
    shortTitle: 'AnswerBrief',
    tagline: 'Role-specific interview prep for serious career moves.',
    description: 'Turn a resume and job posting into a focused interview brief with tailored examples, storylines, and prep prompts.',
    idealCustomer: 'Job candidates, career changers, and professionals preparing for high-stakes interviews.',
    problem: 'Candidates often prepare from generic questions instead of connecting their actual experience to the role in front of them.',
    solution: 'AnswerBrief analyzes the resume, target role, and candidate context to produce a practical interview preparation package.',
    features: ['Resume and job-posting analysis', 'Experience-to-role mapping', 'Behavioral story prompts', 'Role-specific talking points', 'Follow-up preparation checklist'],
    deliverables: ['Interview Brief', 'STAR story bank', 'Role-fit talking points', 'Final prep checklist'],
    requiredFiles: ['Resume', 'Job posting or role description'],
    requiredQuestions: [
      { id: 'target_role', label: 'Target role and company', type: 'text', required: true },
      { id: 'interview_stage', label: 'Interview stage', type: 'select', required: true, options: ['Recruiter screen', 'Hiring manager', 'Panel', 'Final round', 'Other'] },
      { id: 'focus_areas', label: 'What should the brief emphasize?', type: 'textarea', required: false },
    ],
    packages: [
      { id: 'brief', name: 'Interview Brief', price: 49, stripePriceIdEnv: 'STRIPE_PRICE_ANSWERBRIEF_BRIEF', turnaround: '1 business day', description: 'A polished role-specific interview brief.', includes: ['Interview Brief', 'Story prompts', 'Prep checklist'] },
      { id: 'premium', name: 'Premium Prep', price: 129, stripePriceIdEnv: 'STRIPE_PRICE_ANSWERBRIEF_PREMIUM', turnaround: '2 business days', description: 'Deeper prep with coaching notes and follow-up strategy.', includes: ['Everything in Brief', 'Coaching plan', 'Follow-up email drafts'] },
    ],
    faq: [
      { question: 'Do you write answers for me?', answer: 'The package gives structure, story prompts, and role-specific guidance so your answers remain accurate and authentic.' },
      { question: 'Can I upload multiple resumes?', answer: 'Yes. Upload the most relevant resume first and include alternates as supporting files.' },
    ],
    disclaimer: 'Career guidance is informational and does not guarantee interview outcomes or employment offers.',
  },
  {
    key: 'tax_buddy',
    slug: 'tax-buddy',
    title: 'Tax Buddy',
    shortTitle: 'Tax Buddy',
    tagline: 'Organize tax documents into a cleaner preparation package.',
    description: 'A guided intake and document organization workflow for individuals preparing annual tax materials.',
    idealCustomer: 'Individuals, freelancers, and small business owners who need a clean tax document packet before working with a tax professional.',
    problem: 'Tax prep often starts with scattered PDFs, forms, receipts, and notes that delay review.',
    solution: 'Tax Buddy collects files, normalizes the intake, and creates a structured preparation package.',
    features: ['Secure document intake', 'Checklist-based review', 'Missing-item tracking', 'Receipt and form organization', 'Preparation summary'],
    deliverables: ['Tax Preparation Package', 'Document checklist', 'Missing information report', 'Preparation summary'],
    requiredFiles: ['Tax forms', 'Receipts or supporting documents'],
    requiredQuestions: [
      { id: 'filing_year', label: 'Tax year', type: 'text', required: true },
      { id: 'filing_type', label: 'Filing type', type: 'select', required: true, options: ['Individual', 'Joint', 'Freelance', 'Small business', 'Other'] },
      { id: 'notes', label: 'Anything unusual this year?', type: 'textarea', required: false },
    ],
    packages: [
      { id: 'organize', name: 'Organizer', price: 79, stripePriceIdEnv: 'STRIPE_PRICE_TAX_BUDDY_ORGANIZE', turnaround: '2 business days', description: 'Document organization and missing-item review.', includes: ['Foldered packet', 'Checklist', 'Summary'] },
    ],
    faq: [
      { question: 'Is this tax advice?', answer: 'No. This organizes materials for review and does not replace a licensed tax professional.' },
      { question: 'Can you handle business receipts?', answer: 'Yes. Upload receipts, statements, and notes; the workflow groups them for review.' },
    ],
    disclaimer: 'Tax Buddy provides document organization only and does not provide tax, legal, or accounting advice.',
  },
  {
    key: 'tax_appeal_buddy',
    slug: 'tax-appeal-buddy',
    title: 'Tax Appeal Buddy',
    shortTitle: 'Tax Appeal',
    tagline: 'Property tax appeal support with comps, packets, and hearing prep.',
    description: 'Build a clearer property tax appeal packet with evidence organization, comparable-property notes, and hearing preparation.',
    idealCustomer: 'Homeowners, property managers, and tax appeal professionals preparing assessment appeals.',
    problem: 'Appeals are hard to organize because property data, evidence, and deadlines live in different places.',
    solution: 'Tax Appeal Buddy collects property details and supporting files, then generates a structured appeal preparation package.',
    features: ['Property detail intake', 'Evidence checklist', 'Comparable property worksheet', 'Appeal packet outline', 'Hearing preparation notes'],
    deliverables: ['Appeal Preparation Package', 'Comps worksheet', 'Evidence checklist', 'Hearing prep notes'],
    requiredFiles: ['Assessment notice', 'Comparable property evidence or notes'],
    requiredQuestions: [
      { id: 'property_address', label: 'Property address', type: 'text', required: true },
      { id: 'assessment_year', label: 'Assessment year', type: 'text', required: true },
      { id: 'appeal_deadline', label: 'Appeal deadline if known', type: 'text', required: false },
    ],
    packages: [
      { id: 'appeal_packet', name: 'Appeal Packet', price: 99, stripePriceIdEnv: 'STRIPE_PRICE_TAX_APPEAL_PACKET', turnaround: '2 business days', description: 'A structured packet to prepare for an appeal.', includes: ['Appeal package', 'Comps worksheet', 'Hearing notes'] },
    ],
    faq: [
      { question: 'Do you file the appeal?', answer: 'No. The product helps prepare materials; customers remain responsible for filing.' },
      { question: 'Can I add photos and PDFs?', answer: 'Yes. PDFs, Word documents, images, and notes are supported through secure intake.' },
    ],
    disclaimer: 'Tax Appeal Buddy is preparation support and does not provide legal, appraisal, or tax advice.',
  },
  {
    key: 'interview_coach',
    slug: 'interview-coach',
    title: 'Interview Coach',
    shortTitle: 'Interview Coach',
    tagline: 'Personalized interview practice and coaching plans.',
    description: 'Create a coaching plan based on target role, interview stage, strengths, and risk areas.',
    idealCustomer: 'Candidates who want structured practice before interviews.',
    problem: 'Most practice is unfocused and does not produce a clear improvement plan.',
    solution: 'Interview Coach converts role context and self-assessment into a focused practice plan.',
    features: ['Interview stage diagnosis', 'Practice plan generation', 'Question bank', 'Response improvement notes', 'Confidence-building exercises'],
    deliverables: ['Coaching Plan', 'Practice question set', 'Improvement checklist', 'Mock interview script'],
    requiredFiles: ['Resume or career summary'],
    requiredQuestions: [
      { id: 'target_role', label: 'Target role', type: 'text', required: true },
      { id: 'confidence_level', label: 'Current confidence level', type: 'select', required: true, options: ['Low', 'Medium', 'High'] },
      { id: 'hardest_questions', label: 'Which questions feel hardest?', type: 'textarea', required: false },
    ],
    packages: [
      { id: 'plan', name: 'Coaching Plan', price: 69, stripePriceIdEnv: 'STRIPE_PRICE_INTERVIEW_COACH_PLAN', turnaround: '1 business day', description: 'A structured plan for practice and improvement.', includes: ['Coaching plan', 'Question bank', 'Improvement checklist'] },
    ],
    faq: [
      { question: 'Is this live coaching?', answer: 'This package is an asynchronous coaching plan unless a custom engagement is arranged.' },
      { question: 'Can I use it with AnswerBrief?', answer: 'Yes. Interview Coach pairs well with an AnswerBrief package.' },
    ],
    disclaimer: 'Interview coaching is educational and does not guarantee hiring outcomes.',
  },
  {
    key: 'workforce_study',
    slug: 'workforce-study',
    title: 'Workforce Study',
    shortTitle: 'Workforce Study',
    tagline: 'Operational workforce insights from structured intake and documents.',
    description: 'A lightweight study package for teams examining roles, processes, workload, and automation opportunities.',
    idealCustomer: 'Small businesses and operations teams looking for a practical workforce/process snapshot.',
    problem: 'Teams often know work is inefficient but lack a structured picture of roles, workload, and automation opportunities.',
    solution: 'Workforce Study gathers structured context and produces a concise study report with findings and next steps.',
    features: ['Team/process intake', 'Document review', 'Bottleneck mapping', 'Automation opportunity scan', 'Priority recommendations'],
    deliverables: ['Study Report', 'Workflow map', 'Opportunity backlog', 'Executive summary'],
    requiredFiles: ['Process notes or sample documents'],
    requiredQuestions: [
      { id: 'team_size', label: 'Team size', type: 'text', required: true },
      { id: 'primary_process', label: 'Primary process to study', type: 'textarea', required: true },
      { id: 'current_tools', label: 'Current tools', type: 'textarea', required: false },
    ],
    packages: [
      { id: 'study', name: 'Study Report', price: 299, stripePriceIdEnv: 'STRIPE_PRICE_WORKFORCE_STUDY_REPORT', turnaround: '5 business days', description: 'A focused study report with practical recommendations.', includes: ['Study report', 'Workflow map', 'Opportunity backlog'] },
    ],
    faq: [
      { question: 'Is this a consulting engagement?', answer: 'It is a fixed-scope study package. Larger implementation work can be scoped separately.' },
      { question: 'Do you need private employee data?', answer: 'No. Submit process context and anonymized examples whenever possible.' },
    ],
    disclaimer: 'Workforce Study provides operational recommendations and does not replace legal, HR, or compliance advice.',
  },
  {
    key: 'mixpilot_ai',
    slug: 'mixpilot-ai',
    title: 'MixPilot AI',
    shortTitle: 'MixPilot',
    tagline: 'Your AI DJ set planner.',
    description: 'AI-powered DJ set planning for parties, events, workouts, lounges, and creators.',
    idealCustomer: 'Party hosts, mobile DJs, fitness instructors, event planners, creators, and small venues.',
    problem: 'Playlists are easy to collect but hard to sequence into a set that opens well, builds energy, creates a peak, resets the room, and closes cleanly.',
    solution: 'MixPilot AI turns playlists into structured DJ-style set plans with energy flow, transition ideas, cue notes, and event-ready sequencing.',
    features: ['Event mode and audience intake', 'Song list sequencing', 'Opening, Build, Peak, Reset, and Finale sections', 'Energy curve guidance', 'Transition ideas and cue notes', 'Copy, markdown, and print-ready cue sheet'],
    deliverables: ['AI DJ Set Plan / Cue Sheet', 'Energy flow outline', 'Transition idea list', 'Clean-version reminders', 'Crowd and event notes'],
    requiredFiles: ['Optional playlist export, song list, or event notes'],
    requiredQuestions: [
      { id: 'mix_title', label: 'Mix title or event name', type: 'text', required: true },
      { id: 'event_type', label: 'Event type', type: 'select', required: true, options: ['Party', 'Wedding', 'Workout', 'Lounge', 'Creator set', 'Casual DJ', 'Corporate event', 'Other'] },
      { id: 'audience', label: 'Who is the audience?', type: 'text', required: true },
      { id: 'desired_length', label: 'Desired set length', type: 'select', required: true, options: ['30 minutes', '45 minutes', '1 hour', '2 hours', '3 hours', '4+ hours'] },
      { id: 'energy_style', label: 'Energy style', type: 'select', required: true, options: ['Chill start, big finish', 'Steady lounge flow', 'High energy', 'Workout push', 'Family friendly', 'Dance party'] },
      { id: 'clean_preference', label: 'Clean or explicit preference', type: 'select', required: true, options: ['Clean', 'Prefer clean', 'Explicit is okay'] },
      { id: 'song_list', label: 'Paste the song list', type: 'textarea', required: true },
      { id: 'notes', label: 'Event notes or must-play moments', type: 'textarea', required: false },
    ],
    packages: [
      { id: 'free_beta', name: 'Free Beta', price: 0, stripePriceIdEnv: 'STRIPE_PRICE_MIXPILOT_FREE_BETA', turnaround: 'Instant self-serve or manual-review fallback', description: 'Start a MixPilot AI set plan while checkout is in beta.', includes: ['AI DJ Set Plan / Cue Sheet', 'Energy flow', 'Transition ideas', 'Cue notes'] },
    ],
    faq: [
      { question: 'Does MixPilot AI mix or stream audio?', answer: 'No. MixPilot AI provides set planning and cue-sheet guidance. It does not stream, mix, download, or export audio.' },
      { question: 'Does it include music licensing?', answer: 'No. Customers are responsible for music licensing, streaming, public performance, and distribution rights.' },
    ],
    disclaimer: 'MixPilot AI provides music planning and cue-sheet guidance. It does not grant music licensing, streaming, public performance, or distribution rights.',
  },
  {
    key: 'nieves_ai_platform',
    slug: 'nieves-ai-platform',
    title: 'Nieves AI Platform',
    shortTitle: 'AI Platform',
    tagline: 'Plan, automate, and operate practical AI product workflows.',
    description: 'A platform consultation and implementation planning workflow for AI products and automation systems.',
    idealCustomer: 'Founders, operators, and teams planning AI-enabled products or workflow automation.',
    problem: 'AI ideas stall when they lack concrete product scope, automation architecture, and deployment planning.',
    solution: 'Nieves AI Platform packages convert product goals into a clear implementation plan and automation roadmap.',
    features: ['Product architecture review', 'Workflow design', 'Integration planning', 'Operational risk review', 'Implementation roadmap'],
    deliverables: ['Consultation Summary', 'Architecture outline', 'Automation roadmap', 'Next-step backlog'],
    requiredFiles: ['Existing notes, workflow samples, or product brief'],
    requiredQuestions: [
      { id: 'business_goal', label: 'Business goal', type: 'textarea', required: true },
      { id: 'current_stack', label: 'Current tools or stack', type: 'textarea', required: false },
      { id: 'timeline', label: 'Target timeline', type: 'text', required: false },
    ],
    packages: [
      { id: 'consultation', name: 'Platform Consultation', price: 499, stripePriceIdEnv: 'STRIPE_PRICE_PLATFORM_CONSULTATION', turnaround: '5 business days', description: 'A strategy and implementation planning package.', includes: ['Consultation summary', 'Architecture outline', 'Roadmap'] },
    ],
    faq: [
      { question: 'Does this include custom development?', answer: 'No. It creates the implementation plan; build work can be scoped afterward.' },
      { question: 'Can this include Google and email automations?', answer: 'Yes. The platform roadmap can include Drive, Docs, Sheets, Gmail, and Apps Script automation.' },
    ],
    disclaimer: 'Platform consultation is strategic and technical planning, not a guarantee of business outcomes.',
  },
]);

function defineProducts(definitions: ProductDefinition[]): Product[] {
  return definitions.map(createProduct);
}

function createProduct(definition: ProductDefinition): Product {
  return {
    ...definition,
    intakeSchema: definition.intakeSchema || {
      requiredFiles: definition.requiredFiles,
      questions: definition.requiredQuestions,
    },
    workflow: definition.workflow || defaultWorkflow(definition),
    lifecycleStage: definition.lifecycleStage || (definition.key === 'mixpilot_ai' ? 'beta' : 'live'),
    publicAvailability: definition.publicAvailability || 'available',
  };
}

function defaultWorkflow(product: ProductDefinition): ProductWorkflowDefinition {
  return {
    key: workflowKeyForProduct(product.key),
    version: '1.0.0',
    engine: 'naip_shared_workflow',
    requiresPayment: product.packages.some((item) => item.price > 0),
    durableStorageRequired: true,
    steps: [
      { id: 'checkout', label: 'Checkout or package start', required: product.packages.some((item) => item.price > 0) },
      { id: 'order', label: 'Durable order creation', required: true },
      { id: 'intake', label: 'Product-specific intake', required: true },
      { id: 'uploads', label: 'Customer file capture', required: product.requiredFiles.length > 0 },
      { id: 'generation', label: 'Configured deliverable generation', required: true },
      { id: 'qa', label: 'Automated quality checks', required: true },
      { id: 'delivery', label: 'Customer delivery and admin visibility', required: true },
    ],
  };
}

function workflowKeyForProduct(key: ProductKey): ProductWorkflowKey {
  const workflows: Record<ProductKey, ProductWorkflowKey> = {
    answerbrief_ai: 'answerbrief_fulfillment',
    tax_buddy: 'tax_buddy_organizer',
    tax_appeal_buddy: 'tax_appeal_packet',
    interview_coach: 'interview_coach_plan',
    workforce_study: 'workforce_study_report',
    mixpilot_ai: 'mixpilot_set_plan',
    automix_pro: 'mixpilot_set_plan',
    nieves_ai_platform: 'platform_consultation',
  };
  return workflows[key];
}

export function getProductBySlug(slug: string) {
  if (slug === 'automix-pro') {
    return products.find((product) => product.slug === 'mixpilot-ai');
  }

  return products.find((product) => product.slug === slug);
}

export function getProductByKey(key: string) {
  if (key === 'automix_pro') {
    return products.find((product) => product.key === 'mixpilot_ai');
  }

  return products.find((product) => product.key === key);
}

export function getPackage(product: Product, packageId: string) {
  return product.packages.find((item) => item.id === packageId);
}
