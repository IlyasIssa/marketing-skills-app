export type WorkflowStep = {
  slug: string
  title: string
  goal: string
  research?: {
    type: 'serp' | 'trends'
    queryHint: string
    purpose: string
  }
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
      {
        slug: 'seo-auditor',
        title: 'SEO Auditor',
        goal: 'Find technical, content, and quick-win SEO issues.',
        research: { type: 'serp', queryHint: 'primary product category + best / alternatives / software', purpose: 'See competing pages, SERP intent, snippets, and ranking patterns.' },
      },
      { slug: 'schema-generator', title: 'Schema Generator', goal: 'Create JSON-LD from audit findings and page context.' },
      {
        slug: 'site-architecture-planner',
        title: 'Site Architecture Planner',
        goal: 'Turn findings into a stronger page hierarchy.',
        research: { type: 'serp', queryHint: 'category keywords, jobs-to-be-done queries, competitor alternatives', purpose: 'Map pages to real search intent and SERP clusters.' },
      },
      {
        slug: 'programmatic-seo-planner',
        title: 'Programmatic SEO Planner',
        goal: 'Design scalable page templates and indexation strategy.',
        research: { type: 'trends', queryHint: 'main category terms and use-case terms', purpose: 'Prioritize page templates by demand direction and seasonality.' },
      },
    ],
  },
  {
    id: 'cro-experiment-loop',
    title: 'CRO Experiment Loop',
    description: 'Analyze conversion problems, rewrite the page, then design a statistically sound test.',
    steps: [
      {
        slug: 'page-cro-analyzer',
        title: 'Page CRO Analyzer',
        goal: 'Identify friction, quick wins, and conversion hypotheses.',
        research: { type: 'serp', queryHint: 'target landing page offer + alternatives / competitors', purpose: 'Compare promise, proof, CTA, and objection handling against SERP competitors.' },
      },
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
      {
        slug: 'competitor-profiler',
        title: 'Competitor Profiler',
        goal: 'Build positioning, pricing, and battlecard intelligence.',
        research: { type: 'serp', queryHint: 'competitor name pricing reviews alternatives', purpose: 'Collect public positioning, review pages, pricing intent, and comparison SERPs.' },
      },
      {
        slug: 'competitor-page-builder',
        title: 'Competitor Page Builder',
        goal: 'Create an SEO comparison or alternative page.',
        research: { type: 'serp', queryHint: 'competitor alternative, competitor vs your category', purpose: 'Match comparison page structure to real SERP intent.' },
      },
      {
        slug: 'paid-ads-strategist',
        title: 'Paid Ads Strategist',
        goal: 'Turn comparison positioning into paid campaign structure.',
        research: { type: 'trends', queryHint: 'competitor name, category, alternatives', purpose: 'Estimate demand direction for competitor and category terms.' },
      },
      { slug: 'sales-deck-creator', title: 'Sales Deck Creator', goal: 'Create sales enablement from the same positioning.' },
    ],
  },
  {
    id: 'launch-system',
    title: 'Launch System',
    description: 'Plan launch motion, create content, generate emails, and prepare distribution.',
    steps: [
      {
        slug: 'launch-planner',
        title: 'Launch Planner',
        goal: 'Build the launch timeline and channel plan.',
        research: { type: 'trends', queryHint: 'category, problem, use case, competitor terms', purpose: 'Find trend direction and timing for launch angles.' },
      },
      {
        slug: 'social-post-creator',
        title: 'Social Post Creator',
        goal: 'Create platform-native launch posts.',
        research: { type: 'trends', queryHint: 'problem keywords and category conversations', purpose: 'Choose timely angles and hooks.' },
      },
      { slug: 'email-campaign-builder', title: 'Email Campaign Builder', goal: 'Create launch or nurture email sequence.' },
      {
        slug: 'directory-submissions',
        title: 'Directory Submission Planner',
        goal: 'Prepare listing copy and directory targets.',
        research: { type: 'serp', queryHint: 'best directories for product category, submit startup, AI tools directory', purpose: 'Find directory opportunities and SERP-visible listing sites.' },
      },
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
      {
        slug: 'content-strategy-planner',
        title: 'Content Strategy Planner',
        goal: 'Create a 90-day content plan from positioning.',
        research: { type: 'serp', queryHint: 'audience problems, how to queries, category keywords', purpose: 'Build content pillars from real search demand.' },
      },
    ],
  },
  {
    id: 'search-demand-research',
    title: 'Search Demand Research',
    description: 'Use Google SERP and Trends data to decide what to build, write, and prioritize.',
    steps: [
      {
        slug: 'ai-search-optimizer',
        title: 'AI Search Optimizer',
        goal: 'Audit citation readiness and AI search visibility.',
        research: { type: 'serp', queryHint: 'best tool for problem, how to solve problem, category alternatives', purpose: 'See which pages and answer formats search engines already trust.' },
      },
      {
        slug: 'free-tool-planner',
        title: 'Free Tool Planner',
        goal: 'Plan free tools that can attract qualified search demand.',
        research: { type: 'trends', queryHint: 'calculator, generator, template, checker terms in your category', purpose: 'Find rising demand for tool-led acquisition ideas.' },
      },
      {
        slug: 'programmatic-seo-planner',
        title: 'Programmatic SEO Planner',
        goal: 'Turn demand patterns into scalable page templates.',
        research: { type: 'serp', queryHint: 'near me, alternatives, templates, integrations, use-case keyword patterns', purpose: 'Validate repeatable SERP patterns for pSEO.' },
      },
      {
        slug: 'content-strategy-planner',
        title: 'Content Strategy Planner',
        goal: 'Prioritize content calendar based on demand and trend direction.',
        research: { type: 'trends', queryHint: 'main category terms, problem terms, competitor terms', purpose: 'Use demand direction to prioritize the 90-day calendar.' },
      },
    ],
  },
]
