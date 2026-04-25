export type WorkflowStep = {
  slug: string
  title: string
  goal: string
}

export type Workflow = {
  id: string
  title: string
  description: string
  steps: WorkflowStep[]
}

export const WORKFLOWS: Workflow[] = [
  {
    id: 'seo-growth-engine',
    title: 'SEO Growth Engine',
    description: 'Audit the site, fix technical gaps, then turn findings into scalable SEO pages.',
    steps: [
      { slug: 'seo-auditor', title: 'SEO Auditor', goal: 'Find technical, content, and quick-win SEO issues.' },
      { slug: 'schema-generator', title: 'Schema Generator', goal: 'Create JSON-LD from audit findings and page context.' },
      { slug: 'site-architecture-planner', title: 'Site Architecture Planner', goal: 'Turn findings into a stronger page hierarchy.' },
      { slug: 'programmatic-seo-planner', title: 'Programmatic SEO Planner', goal: 'Design scalable page templates and indexation strategy.' },
    ],
  },
  {
    id: 'cro-experiment-loop',
    title: 'CRO Experiment Loop',
    description: 'Analyze conversion problems, rewrite the page, then design a statistically sound test.',
    steps: [
      { slug: 'page-cro-analyzer', title: 'Page CRO Analyzer', goal: 'Identify friction, quick wins, and conversion hypotheses.' },
      { slug: 'copy-generator', title: 'Copy Generator', goal: 'Generate improved landing page sections and CTA variants.' },
      { slug: 'ab-test-designer', title: 'A/B Test Designer', goal: 'Turn the chosen change into an experiment plan.' },
      { slug: 'analytics-audit', title: 'Analytics Audit', goal: 'Define events and dashboards to measure the experiment.' },
    ],
  },
  {
    id: 'competitor-campaign',
    title: 'Competitor Campaign',
    description: 'Research a competitor, build a comparison page, then launch paid and sales assets.',
    steps: [
      { slug: 'competitor-profiler', title: 'Competitor Profiler', goal: 'Build positioning, pricing, and battlecard intelligence.' },
      { slug: 'competitor-page-builder', title: 'Competitor Page Builder', goal: 'Create an SEO comparison or alternative page.' },
      { slug: 'paid-ads-strategist', title: 'Paid Ads Strategist', goal: 'Turn comparison positioning into paid campaign structure.' },
      { slug: 'sales-deck-creator', title: 'Sales Deck Creator', goal: 'Create sales enablement from the same positioning.' },
    ],
  },
  {
    id: 'launch-system',
    title: 'Launch System',
    description: 'Plan launch motion, create content, generate emails, and prepare distribution.',
    steps: [
      { slug: 'launch-planner', title: 'Launch Planner', goal: 'Build the launch timeline and channel plan.' },
      { slug: 'social-post-creator', title: 'Social Post Creator', goal: 'Create platform-native launch posts.' },
      { slug: 'email-campaign-builder', title: 'Email Campaign Builder', goal: 'Create launch or nurture email sequence.' },
      { slug: 'directory-submissions', title: 'Directory Submission Planner', goal: 'Prepare listing copy and directory targets.' },
    ],
  },
  {
    id: 'research-to-positioning',
    title: 'Research to Positioning',
    description: 'Turn raw customer insight into positioning, copy, and a content plan.',
    steps: [
      { slug: 'customer-research-synthesizer', title: 'Customer Research Synthesizer', goal: 'Extract jobs, pains, quotes, and personas.' },
      { slug: 'psychology-optimizer', title: 'Behavioral Marketing Optimizer', goal: 'Apply behavioral principles to messaging.' },
      { slug: 'copy-generator', title: 'Copy Generator', goal: 'Create page copy from research-backed positioning.' },
      { slug: 'content-strategy-planner', title: 'Content Strategy Planner', goal: 'Create a 90-day content plan from positioning.' },
    ],
  },
]
