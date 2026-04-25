import type { Feature, Category } from './types'

export const CATEGORIES: Category[] = [
  { slug: 'content', label: 'Content & Copy', color: 'violet', icon: '✍️' },
  { slug: 'seo', label: 'SEO Toolkit', color: 'emerald', icon: '🔍' },
  { slug: 'cro', label: 'Conversion (CRO)', color: 'orange', icon: '📈' },
  { slug: 'growth', label: 'Growth Playbooks', color: 'blue', icon: '🚀' },
  { slug: 'strategy', label: 'Strategy', color: 'pink', icon: '🎯' },
  { slug: 'research', label: 'Research & Intel', color: 'yellow', icon: '🔎' },
  { slug: 'ads', label: 'Paid & Ads', color: 'red', icon: '📣' },
  { slug: 'sales', label: 'Sales', color: 'cyan', icon: '💼' },
  { slug: 'measurement', label: 'Measurement', color: 'teal', icon: '📊' },
  { slug: 'other', label: 'Community & More', color: 'slate', icon: '🌐' },
]

export const FEATURES: Feature[] = [
  // ─── CONTENT & COPY ───────────────────────────────────────────────
  {
    slug: 'copy-generator',
    title: 'Copy Generator',
    tagline: 'Generate homepage, landing page, and feature copy',
    category: 'content',
    icon: '✍️',
    fields: [
      {
        id: 'pageType',
        label: 'Page Type',
        type: 'select',
        required: true,
        options: [
          { value: 'homepage', label: 'Homepage' },
          { value: 'landing page', label: 'Landing Page' },
          { value: 'pricing page', label: 'Pricing Page' },
          { value: 'feature page', label: 'Feature Page' },
          { value: 'about page', label: 'About Page' },
        ],
      },
      {
        id: 'audience',
        label: 'Target Audience',
        type: 'text',
        placeholder: 'e.g. B2B SaaS founders, 10-50 employee companies',
        required: true,
      },
      {
        id: 'keyBenefits',
        label: 'Key Benefits / Value Props',
        type: 'textarea',
        placeholder: 'List 3-5 key benefits or outcomes your product delivers',
        required: true,
        rows: 3,
      },
      {
        id: 'tone',
        label: 'Tone',
        type: 'select',
        options: [
          { value: 'professional and trustworthy', label: 'Professional & Trustworthy' },
          { value: 'friendly and conversational', label: 'Friendly & Conversational' },
          { value: 'bold and direct', label: 'Bold & Direct' },
          { value: 'technical and precise', label: 'Technical & Precise' },
          { value: 'witty and playful', label: 'Witty & Playful' },
        ],
      },
      {
        id: 'existingCopy',
        label: 'Existing Copy to Improve (optional)',
        type: 'textarea',
        placeholder: 'Paste current copy if you want a rewrite rather than fresh copy',
        rows: 4,
      },
    ],
    systemPrompt: `You are an expert marketing copywriter specializing in SaaS and B2B web copy. You prioritize clarity over cleverness, benefits over features, specificity over vagueness, and simple language over jargon.

Your output is always structured by page section: headline, subheadline, value proposition, key benefit sections, social proof placeholder, and CTA. For each key element, provide 2-3 alternative options with a brief note on why each works.

You write copy that converts — every word earns its place.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Write high-converting copy for a **${v.pageType}**.

Target audience: ${v.audience}
Key benefits/value props: ${v.keyBenefits}
Tone: ${v.tone || 'professional and trustworthy'}
${v.existingCopy ? `\nExisting copy to rewrite:\n${v.existingCopy}` : ''}

Deliver:
1. Headline (3 options with rationale)
2. Subheadline (2 options)
3. Hero value proposition paragraph
4. 3-4 benefit sections (each with heading + 2-3 sentences)
5. CTA button copy (3 options)
6. Brief annotation on strategic choices made`,
  },

  {
    slug: 'copy-improver',
    title: 'Copy Improver',
    tagline: 'Paste existing copy and get a polished, high-converting rewrite',
    category: 'content',
    icon: '✏️',
    fields: [
      {
        id: 'copy',
        label: 'Existing Copy',
        type: 'textarea',
        placeholder: 'Paste the copy you want improved...',
        required: true,
        rows: 8,
      },
      {
        id: 'context',
        label: 'What is this copy for?',
        type: 'text',
        placeholder: 'e.g. SaaS homepage hero, email subject line, pricing page',
        required: true,
      },
      {
        id: 'focusArea',
        label: 'Focus Area',
        type: 'select',
        options: [
          { value: 'all sweeps', label: 'Full improvement (all sweeps)' },
          { value: 'clarity and simplicity', label: 'Clarity & Simplicity' },
          { value: 'stronger benefits and outcomes', label: 'Benefits & Outcomes' },
          { value: 'specificity and proof', label: 'Specificity & Proof' },
          { value: 'tone and voice', label: 'Tone & Voice' },
          { value: 'reducing friction and objections', label: 'Reduce Friction' },
        ],
      },
    ],
    systemPrompt: `You are an expert copy editor applying the Seven Sweeps framework: (1) Clarity, (2) Voice & Tone, (3) "So What" (benefits), (4) Prove It (evidence), (5) Specificity, (6) Emotion, (7) Zero Risk (remove objections).

Show the improved copy, then annotate what changed and why. Good copy editing enhances — it doesn't rewrite the soul of the original.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Improve the following copy for: **${v.context}**
Focus area: ${v.focusArea || 'all sweeps'}

---
${v.copy}
---

Deliver:
1. **Improved version** (full rewrite)
2. **Change log** — for each major change, note which sweep it addresses and why it improves the copy
3. **3 micro-suggestions** for further polish`,
  },

  {
    slug: 'cold-email-sequence',
    title: 'Cold Email Sequence',
    tagline: 'Write B2B outreach sequences that get replies',
    category: 'content',
    icon: '📧',
    fields: [
      {
        id: 'prospectRole',
        label: 'Prospect Role / Title',
        type: 'text',
        placeholder: 'e.g. Head of Marketing at SaaS companies',
        required: true,
      },
      {
        id: 'offer',
        label: 'Your Offer / Value Prop',
        type: 'textarea',
        placeholder: 'What problem do you solve? What outcome do you deliver?',
        required: true,
        rows: 3,
      },
      {
        id: 'desiredAction',
        label: 'Desired Action (CTA)',
        type: 'text',
        placeholder: 'e.g. 15-min call, free audit, demo signup',
        required: true,
      },
      {
        id: 'personalizationSignal',
        label: 'Personalization Signal',
        type: 'text',
        placeholder: 'e.g. they recently posted about X, just raised Series A, use competitor Y',
      },
      {
        id: 'emailCount',
        label: 'Sequence Length',
        type: 'select',
        options: [
          { value: '3', label: '3 emails' },
          { value: '5', label: '5 emails' },
        ],
      },
    ],
    systemPrompt: `You are an expert B2B cold email writer. Your emails sound like they came from a sharp, thoughtful human — not a sales machine. You apply peer-level communication: contractions, short sentences, reader-focused language.

Framework: Observation → Problem → Proof → Ask. Subject lines are 2-4 words, lowercase, internal-looking. Follow-ups introduce new angles — never "just checking in".`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Write a ${v.emailCount || '3'}-email cold outreach sequence.

Prospect: ${v.prospectRole}
Offer: ${v.offer}
Desired CTA: ${v.desiredAction}
${v.personalizationSignal ? `Personalization signal: ${v.personalizationSignal}` : ''}

For each email deliver:
- Email number + timing (e.g. Day 1, Day 3, Day 7)
- Subject line (2-4 words, lowercase)
- Full email body
- Brief note on the angle used

Keep emails under 150 words each. No jargon, no feature dumps, no "I hope this finds you well".`,
  },

  {
    slug: 'email-campaign-builder',
    title: 'Email Campaign Builder',
    tagline: 'Build full automated email drip sequences',
    category: 'content',
    icon: '📬',
    fields: [
      {
        id: 'sequenceType',
        label: 'Sequence Type',
        type: 'select',
        required: true,
        options: [
          { value: 'welcome', label: 'Welcome Sequence' },
          { value: 'lead nurture', label: 'Lead Nurture' },
          { value: 're-engagement', label: 'Re-engagement' },
          { value: 'onboarding', label: 'Product Onboarding' },
          { value: 'post-trial', label: 'Post-Trial Conversion' },
        ],
      },
      {
        id: 'audience',
        label: 'Audience Segment',
        type: 'text',
        placeholder: 'e.g. free trial users, newsletter subscribers, churned customers',
        required: true,
      },
      {
        id: 'goal',
        label: 'Sequence Goal',
        type: 'text',
        placeholder: 'e.g. convert to paid, activate key feature, re-subscribe',
        required: true,
      },
      {
        id: 'emailCount',
        label: 'Number of Emails',
        type: 'select',
        options: [
          { value: '3', label: '3 emails' },
          { value: '5', label: '5 emails' },
          { value: '7', label: '7 emails' },
        ],
      },
    ],
    systemPrompt: `You are an expert email marketer. You build sequences using "One Email, One Job" — each email has a single purpose. You follow "Value Before Ask" and use the Hook → Context → Value → CTA structure.

Subject lines are 40-60 characters. Timing follows best practices: welcome immediately, nurture every 2-4 days, re-engagement with increasing urgency.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Build a ${v.emailCount || '5'}-email **${v.sequenceType}** sequence.

Audience: ${v.audience}
Goal: ${v.goal}

For each email deliver:
- Email # + Send timing (Day X)
- Subject line
- Preview text (40 chars)
- Full email body (Hook → Value → CTA structure)
- CTA text and link placeholder

After the sequence, add a brief **Strategy Notes** section explaining the logic of the sequence arc.`,
  },

  {
    slug: 'social-post-creator',
    title: 'Social Post Creator',
    tagline: 'Create platform-native posts or repurpose existing content',
    category: 'content',
    icon: '📱',
    fields: [
      {
        id: 'contentInput',
        label: 'Topic or Content to Repurpose',
        type: 'textarea',
        placeholder: 'Describe a topic, OR paste a blog post/article to repurpose into posts',
        required: true,
        rows: 5,
      },
      {
        id: 'platforms',
        label: 'Target Platforms',
        type: 'multiselect',
        required: true,
        options: [
          { value: 'LinkedIn', label: 'LinkedIn' },
          { value: 'Twitter/X', label: 'Twitter / X' },
          { value: 'Instagram', label: 'Instagram' },
          { value: 'TikTok', label: 'TikTok (script)' },
        ],
      },
      {
        id: 'goal',
        label: 'Content Goal',
        type: 'select',
        options: [
          { value: 'grow audience', label: 'Grow Audience' },
          { value: 'drive traffic', label: 'Drive Traffic' },
          { value: 'generate leads', label: 'Generate Leads' },
          { value: 'build brand authority', label: 'Build Authority' },
        ],
      },
      {
        id: 'postsPerPlatform',
        label: 'Posts per Platform',
        type: 'select',
        options: [
          { value: '1', label: '1 post' },
          { value: '3', label: '3 posts' },
        ],
      },
    ],
    systemPrompt: `You are a social media content expert. You write platform-native content — LinkedIn thought leadership, Twitter/X threads, Instagram captions, TikTok scripts. Each platform has its own format, tone, and hook style.

You optimize for engagement: strong hooks, clear value, native formatting (line breaks, emojis where appropriate), and platform-specific CTAs.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Create ${v.postsPerPlatform || '1'} post(s) for each of these platforms: **${v.platforms}**

Content goal: ${v.goal || 'grow audience'}

Source content / topic:
${v.contentInput}

For each platform, deliver posts that feel native to that platform's format and culture. Include hashtag suggestions for Instagram. For TikTok, provide a script with visual direction notes.`,
  },

  // ─── SEO TOOLKIT ──────────────────────────────────────────────────
  {
    slug: 'seo-auditor',
    title: 'SEO Auditor',
    tagline: 'Get a prioritized SEO audit with actionable fixes',
    category: 'seo',
    icon: '🔍',
    fields: [
      {
        id: 'siteDescription',
        label: 'Site Description',
        type: 'textarea',
        placeholder: 'Describe your site: URL, type (SaaS/blog/e-commerce), tech stack, approximate pages',
        required: true,
        rows: 3,
      },
      {
        id: 'currentIssues',
        label: 'Known Issues or Symptoms',
        type: 'textarea',
        placeholder: 'e.g. traffic dropped 40% last month, pages not indexing, low Core Web Vitals scores',
        rows: 3,
      },
      {
        id: 'siteType',
        label: 'Site Type',
        type: 'select',
        options: [
          { value: 'SaaS marketing site', label: 'SaaS Marketing Site' },
          { value: 'content/blog', label: 'Content / Blog' },
          { value: 'e-commerce', label: 'E-commerce' },
          { value: 'documentation site', label: 'Documentation' },
          { value: 'local business', label: 'Local Business' },
        ],
      },
      {
        id: 'pageContent',
        label: 'Sample Page HTML / Content (optional)',
        type: 'textarea',
        placeholder: 'Paste HTML or text content from a key page for on-page analysis',
        rows: 5,
      },
    ],
    systemPrompt: `You are an SEO expert auditing websites. You prioritize issues in this order: (1) Crawlability & Indexation, (2) Technical Foundations (Core Web Vitals, mobile), (3) On-Page Optimization, (4) Content Quality & E-E-A-T, (5) Authority & Links.

You deliver findings grouped by severity: Critical (fix immediately), High Priority (fix this sprint), Quick Wins (low effort, high impact), Improvements (longer term). Each finding includes the issue, its SEO impact, and a specific fix.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Conduct a comprehensive SEO audit.

Site: ${v.siteDescription}
Site type: ${v.siteType || 'SaaS marketing site'}
${v.currentIssues ? `Known issues: ${v.currentIssues}` : ''}
${v.pageContent ? `\nSample page content to analyze:\n${v.pageContent}` : ''}

Deliver:
1. **Executive Summary** (3-5 bullet priority findings)
2. **Critical Issues** (blocking indexation or rankings)
3. **Technical Findings** (Core Web Vitals, mobile, schema, speed)
4. **On-Page Findings** (titles, meta, headings, content structure)
5. **Quick Wins** (easy fixes with outsized impact)
6. **30-Day Action Plan** (prioritized by effort/impact)`,
  },

  {
    slug: 'ai-search-optimizer',
    title: 'AI Search Optimizer',
    tagline: 'Get cited by ChatGPT, Perplexity, and Google AI Overviews',
    category: 'seo',
    icon: '🤖',
    fields: [
      {
        id: 'contentDescription',
        label: 'Content / Product Description',
        type: 'textarea',
        placeholder: 'Describe your product, content, or page you want AI search engines to cite',
        required: true,
        rows: 4,
      },
      {
        id: 'targetQueries',
        label: 'Target Queries',
        type: 'textarea',
        placeholder: 'What questions do you want AI to cite you for? e.g. "best tool for X", "how to do Y"',
        rows: 3,
      },
      {
        id: 'currentContent',
        label: 'Current Page Content (optional)',
        type: 'textarea',
        placeholder: 'Paste current content to audit for AI citation readiness',
        rows: 5,
      },
    ],
    systemPrompt: `You are an AI SEO specialist. Traditional SEO gets you ranked; AI SEO gets you cited. You optimize content to be extractable, authoritative, and citation-worthy for AI systems like ChatGPT, Perplexity, Claude, and Google AI Overviews.

Key levers: adding citations (+40% visibility), statistics (+37%), expert quotations (+30%), clear structure, machine-readable formats, and ensuring AI bots are not blocked. You deliver specific, actionable recommendations.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Optimize for AI search citation.

Content/product: ${v.contentDescription}
${v.targetQueries ? `Target queries: ${v.targetQueries}` : ''}
${v.currentContent ? `\nCurrent content to audit:\n${v.currentContent}` : ''}

Deliver:
1. **Citation Readiness Score** (1-10) with explanation
2. **Critical Fixes** (blocking AI citation)
3. **Content Structure Improvements** (headings, formatting, extractability)
4. **Authority Signals to Add** (citations, statistics, expert quotes)
5. **Technical Checklist** (robots.txt bot access, schema, pricing.md, etc.)
6. **Rewritten content sample** showing optimized version of key section`,
  },

  {
    slug: 'competitor-page-builder',
    title: 'Competitor Page Builder',
    tagline: 'Create SEO-optimized comparison and alternative pages',
    category: 'seo',
    icon: '⚔️',
    fields: [
      {
        id: 'competitor',
        label: 'Competitor Name',
        type: 'text',
        placeholder: 'e.g. Notion, Salesforce, HubSpot',
        required: true,
      },
      {
        id: 'pageType',
        label: 'Page Type',
        type: 'select',
        required: true,
        options: [
          { value: '[Competitor] Alternative', label: '[Competitor] Alternative (users switching)' },
          { value: '[Competitor] Alternatives', label: '[Competitor] Alternatives (research phase)' },
          { value: 'You vs [Competitor]', label: 'Us vs [Competitor] (direct comparison)' },
        ],
      },
      {
        id: 'yourProduct',
        label: 'Your Product Name',
        type: 'text',
        required: true,
      },
      {
        id: 'differentiators',
        label: 'Your Key Differentiators',
        type: 'textarea',
        placeholder: 'List 3-5 ways you beat the competitor (be specific and honest)',
        required: true,
        rows: 3,
      },
      {
        id: 'competitorWeakness',
        label: 'Competitor Weaknesses',
        type: 'textarea',
        placeholder: 'What do customers complain about this competitor? (check G2, Capterra reviews)',
        rows: 3,
      },
    ],
    systemPrompt: `You are an SEO and conversion copywriter specializing in competitor comparison pages. You write honest, credible pages — you acknowledge competitor strengths and are specific about weaknesses. Vague claims kill credibility.

You produce SEO-optimized content with proper heading hierarchy, comparison tables, migration sections, FAQ schema markup, and high-intent CTAs targeting users who are actively evaluating alternatives.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Create a **"${v.pageType.replace('[Competitor]', v.competitor)}"** page.

Your product: ${v.yourProduct}
Competitor: ${v.competitor}
Your differentiators: ${v.differentiators}
${v.competitorWeakness ? `Competitor weaknesses: ${v.competitorWeakness}` : ''}

Deliver:
1. **SEO Title & Meta Description** (targeting high-intent keywords)
2. **Hero Section** (headline + subheadline positioning your product)
3. **Feature Comparison Table** (markdown table, honest ratings)
4. **Why People Switch Section** (3-4 common pain points with your solution)
5. **Migration Section** ("How to switch in X minutes")
6. **FAQ Section** (5 questions with schema-ready answers)
7. **CTA Section** with urgency copy
8. **Internal linking suggestions** for related comparison pages`,
  },

  {
    slug: 'site-architecture-planner',
    title: 'Site Architecture Planner',
    tagline: 'Plan your site hierarchy, URLs, and navigation for SEO and UX',
    category: 'seo',
    icon: '🗺️',
    fields: [
      {
        id: 'siteType',
        label: 'Site Type',
        type: 'select',
        required: true,
        options: [
          { value: 'SaaS marketing site', label: 'SaaS Marketing Site' },
          { value: 'content/blog hub', label: 'Content / Blog Hub' },
          { value: 'e-commerce', label: 'E-commerce' },
          { value: 'documentation', label: 'Documentation Site' },
          { value: 'hybrid SaaS + blog', label: 'Hybrid (SaaS + Blog)' },
        ],
      },
      {
        id: 'goals',
        label: 'Top 3 Site Goals',
        type: 'textarea',
        placeholder: 'e.g. drive free trial signups, rank for category keywords, convert enterprise leads',
        required: true,
        rows: 2,
      },
      {
        id: 'existingPages',
        label: 'Existing Key Pages (optional)',
        type: 'textarea',
        placeholder: 'List current pages or describe current structure — especially any URLs that must be preserved',
        rows: 3,
      },
      {
        id: 'targetKeywords',
        label: 'Target Keyword Themes',
        type: 'textarea',
        placeholder: 'e.g. project management software, team collaboration tools, monday.com alternative',
        rows: 2,
      },
    ],
    systemPrompt: `You are a site architecture and information architecture expert. You design structures that serve both users (intuitive navigation) and search engines (crawlability, topical authority, internal linking).

You deliver complete hierarchies with URL slugs, navigation specs, and internal linking strategies. You use hub-and-spoke models for content clusters and follow clean URL conventions.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Plan a complete site architecture for a **${v.siteType}**.

Goals: ${v.goals}
${v.existingPages ? `Existing structure: ${v.existingPages}` : ''}
${v.targetKeywords ? `Target keyword themes: ${v.targetKeywords}` : ''}

Deliver:
1. **Full Page Hierarchy** (with URL slugs, indented tree structure)
2. **Navigation Spec** (primary nav, footer nav, any utility nav)
3. **URL Structure Guidelines** (naming conventions, patterns)
4. **Content Cluster Map** (hub pages + supporting spoke pages)
5. **Internal Linking Strategy** (key linking relationships)
6. **SEO Rationale** (why this structure serves your keyword goals)`,
  },

  {
    slug: 'schema-generator',
    title: 'Schema Generator',
    tagline: 'Generate JSON-LD structured data for rich search results',
    category: 'seo',
    icon: '</>',
    fields: [
      {
        id: 'pageType',
        label: 'Page Type',
        type: 'select',
        required: true,
        options: [
          { value: 'FAQ', label: 'FAQ Page' },
          { value: 'Article', label: 'Article / Blog Post' },
          { value: 'Product', label: 'Product / Software' },
          { value: 'HowTo', label: 'How-To Guide' },
          { value: 'Organization', label: 'Organization / Company' },
          { value: 'LocalBusiness', label: 'Local Business' },
          { value: 'BreadcrumbList', label: 'Breadcrumbs' },
          { value: 'SoftwareApplication', label: 'Software Application' },
        ],
      },
      {
        id: 'contentDetails',
        label: 'Page Content Details',
        type: 'textarea',
        placeholder: 'Describe the page content, or paste the page text so I can extract schema data',
        required: true,
        rows: 6,
      },
      {
        id: 'techStack',
        label: 'Tech Stack / CMS',
        type: 'text',
        placeholder: 'e.g. Next.js, WordPress, Webflow, Shopify',
      },
    ],
    systemPrompt: `You are a structured data and schema.org expert. You generate accurate, valid JSON-LD markup that passes Google's Rich Results Test. You combine multiple schema types using @graph when appropriate and explain how to implement it in the user's tech stack.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Generate JSON-LD schema markup for a **${v.pageType}** page.

Page content / details:
${v.contentDetails}
${v.techStack ? `\nTech stack: ${v.techStack}` : ''}

Deliver:
1. **Complete JSON-LD block** (ready to copy-paste into <head>)
2. **Implementation instructions** for ${v.techStack || 'the given tech stack'}
3. **Validation steps** (how to test with Google Rich Results Test)
4. **Additional schema types** that could be combined for richer results`,
  },

  {
    slug: 'programmatic-seo-planner',
    title: 'Programmatic SEO Planner',
    tagline: 'Generate SEO pages at scale with templates and data',
    category: 'seo',
    icon: '⚡',
    fields: [
      {
        id: 'product',
        label: 'Your Product',
        type: 'text',
        placeholder: 'e.g. project management tool for agencies',
        required: true,
      },
      {
        id: 'keywordPattern',
        label: 'Target Keyword Pattern',
        type: 'select',
        required: true,
        options: [
          { value: '[service] in [location]', label: '[service] in [location] (local)' },
          { value: '[product] vs [product]', label: '[product] vs [product] (comparisons)' },
          { value: '[product] alternative', label: '[product] alternative (alternatives)' },
          { value: '[tool] integration', label: '[tool] integration (integrations)' },
          { value: '[industry] [tool type]', label: '[industry] [tool type] (verticals)' },
          { value: 'best [tool] for [use case]', label: 'best [tool] for [use case]' },
          { value: 'custom pattern', label: 'Custom pattern (describe below)' },
        ],
      },
      {
        id: 'customPattern',
        label: 'Custom Pattern (if selected above)',
        type: 'text',
        placeholder: 'Describe your keyword pattern',
      },
      {
        id: 'dataSource',
        label: 'Available Data Source',
        type: 'text',
        placeholder: 'e.g. list of 500 cities, list of 200 software tools, industry database',
      },
      {
        id: 'pageCount',
        label: 'Estimated Page Count',
        type: 'select',
        options: [
          { value: '10-50', label: '10-50 pages (pilot)' },
          { value: '50-500', label: '50-500 pages (medium)' },
          { value: '500+', label: '500+ pages (at scale)' },
        ],
      },
    ],
    systemPrompt: `You are a programmatic SEO strategist. You design scalable page generation systems that provide unique value — not thin content with swapped variables. Every page must earn its existence with specific, useful content.

You follow the hub-and-spoke model, use subfolders over subdomains, and validate keyword patterns against search demand before recommending build-out.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Design a programmatic SEO strategy for **${v.product}**.

Keyword pattern: ${v.keywordPattern}${v.customPattern ? ` — ${v.customPattern}` : ''}
Data source: ${v.dataSource || 'to be determined'}
Target scale: ${v.pageCount || '50-500'} pages

Deliver:
1. **Pattern Validation** (search demand assessment, is this worth building?)
2. **Page Template Design** (exact structure, sections, unique value per page)
3. **URL Structure** (folder hierarchy, slug patterns)
4. **Data Requirements** (what fields you need per page, data quality rules)
5. **Sample Pages** (write out 3 example pages showing unique content strategy)
6. **Internal Linking Architecture** (hub page + spoke relationships)
7. **Indexation Strategy** (sitemap, crawl budget, launch sequence)
8. **Common Pitfalls** to avoid for this pattern`,
  },

  // ─── CONVERSION (CRO) ─────────────────────────────────────────────
  {
    slug: 'page-cro-analyzer',
    title: 'Page CRO Analyzer',
    tagline: 'Get prioritized conversion improvements for any marketing page',
    category: 'cro',
    icon: '📈',
    fields: [
      {
        id: 'pageContent',
        label: 'Page Content / HTML',
        type: 'textarea',
        placeholder: 'Paste the page copy, HTML, or a detailed description of the page layout',
        required: true,
        rows: 8,
      },
      {
        id: 'pageType',
        label: 'Page Type',
        type: 'select',
        options: [
          { value: 'homepage', label: 'Homepage' },
          { value: 'landing page', label: 'Landing Page' },
          { value: 'pricing page', label: 'Pricing Page' },
          { value: 'feature page', label: 'Feature Page' },
          { value: 'blog post', label: 'Blog Post' },
        ],
      },
      {
        id: 'conversionGoal',
        label: 'Conversion Goal',
        type: 'text',
        placeholder: 'e.g. free trial signup, book a demo, purchase',
        required: true,
      },
      {
        id: 'trafficSource',
        label: 'Primary Traffic Source',
        type: 'select',
        options: [
          { value: 'organic search', label: 'Organic Search' },
          { value: 'paid ads', label: 'Paid Ads' },
          { value: 'email', label: 'Email' },
          { value: 'social media', label: 'Social Media' },
          { value: 'direct/referral', label: 'Direct / Referral' },
        ],
      },
      {
        id: 'currentCVR',
        label: 'Current Conversion Rate (optional)',
        type: 'text',
        placeholder: 'e.g. 2.3%',
      },
    ],
    systemPrompt: `You are a CRO expert. You analyze pages across: (1) Value proposition clarity, (2) Headline effectiveness, (3) CTA placement and copy, (4) Visual hierarchy, (5) Trust signals, (6) Objection handling, (7) Friction points.

Your output is always actionable and prioritized: Quick Wins (implement now, easy), High-Impact Changes (prioritize, bigger effort), Test Ideas (A/B hypotheses), and Copy Alternatives for key elements.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Analyze this **${v.pageType || 'marketing page'}** for CRO improvements.

Conversion goal: ${v.conversionGoal}
Traffic source: ${v.trafficSource || 'mixed'}
${v.currentCVR ? `Current CVR: ${v.currentCVR}` : ''}

Page content:
${v.pageContent}

Deliver:
1. **Overall Assessment** (2-3 sentence diagnosis of biggest opportunity)
2. **Quick Wins** (5+ changes implementable today, ranked by impact)
3. **High-Impact Changes** (3-5 bigger improvements with rationale)
4. **A/B Test Hypotheses** (3 test ideas with hypothesis format: "If we change X, CVR will increase because Y")
5. **Copy Alternatives** for headline, subheadline, and primary CTA (3 options each)
6. **Trust Signal Gaps** (what's missing to handle objections)`,
  },

  {
    slug: 'signup-flow-optimizer',
    title: 'Signup Flow Optimizer',
    tagline: 'Reduce friction and increase completion in registration flows',
    category: 'cro',
    icon: '🔐',
    fields: [
      {
        id: 'signupType',
        label: 'Signup Type',
        type: 'select',
        required: true,
        options: [
          { value: 'free trial', label: 'Free Trial' },
          { value: 'freemium', label: 'Freemium' },
          { value: 'paid account', label: 'Paid Account' },
          { value: 'waitlist', label: 'Waitlist' },
          { value: 'demo request', label: 'Demo Request' },
        ],
      },
      {
        id: 'flowSteps',
        label: 'Current Flow Steps',
        type: 'textarea',
        placeholder: 'Describe each step: e.g. Step 1: Email + password form → Step 2: Verify email → Step 3: Enter company name + role → Step 4: Dashboard',
        required: true,
        rows: 4,
      },
      {
        id: 'completionRate',
        label: 'Current Completion Rate',
        type: 'text',
        placeholder: 'e.g. 60% (or "unknown")',
      },
      {
        id: 'dropoffPoint',
        label: 'Known Drop-off Point',
        type: 'text',
        placeholder: 'e.g. email verification step, company info form',
      },
      {
        id: 'requiredFields',
        label: 'Fields You Collect',
        type: 'textarea',
        placeholder: 'List all fields you currently ask for during signup',
        rows: 3,
      },
    ],
    systemPrompt: `You are a signup flow CRO expert. You know that every additional step and field reduces completion rates by measurable amounts. You help teams identify what's essential vs deferrable, reduce friction, and set users up for fast activation.

You analyze flows for: unnecessary fields, premature data collection, email verification timing, error handling, mobile friction, and post-signup momentum.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Optimize this **${v.signupType}** signup flow.

Current flow:
${v.flowSteps}

Fields collected: ${v.requiredFields || 'not specified'}
${v.completionRate ? `Current completion rate: ${v.completionRate}` : ''}
${v.dropoffPoint ? `Known drop-off: ${v.dropoffPoint}` : ''}

Deliver:
1. **Friction Audit** — rate each step (high/medium/low friction) with explanation
2. **Fields to Remove or Defer** — with rationale for each
3. **Optimized Flow Design** — redesigned step-by-step flow
4. **Quick Wins** — changes implementable this week
5. **Post-Signup Momentum** — first action to get users to activation
6. **Estimated Impact** — expected completion rate improvement`,
  },

  {
    slug: 'form-optimizer',
    title: 'Form Optimizer',
    tagline: 'Optimize lead capture and contact forms for higher conversion',
    category: 'cro',
    icon: '📋',
    fields: [
      {
        id: 'formPurpose',
        label: 'Form Purpose',
        type: 'select',
        required: true,
        options: [
          { value: 'lead capture / newsletter', label: 'Lead Capture / Newsletter' },
          { value: 'contact / support', label: 'Contact / Support' },
          { value: 'demo request', label: 'Demo Request' },
          { value: 'download / gated content', label: 'Download / Gated Content' },
          { value: 'quote request', label: 'Quote Request' },
        ],
      },
      {
        id: 'currentFields',
        label: 'Current Form Fields',
        type: 'textarea',
        placeholder: 'List all current fields: e.g. First name, Last name, Email, Company, Phone, Job title, Message...',
        required: true,
        rows: 3,
      },
      {
        id: 'conversionRate',
        label: 'Current Conversion Rate (optional)',
        type: 'text',
        placeholder: 'e.g. 8%',
      },
      {
        id: 'formLocation',
        label: 'Where the Form Lives',
        type: 'text',
        placeholder: 'e.g. homepage hero, dedicated landing page, blog sidebar',
      },
    ],
    systemPrompt: `You are a form optimization expert. Every additional form field reduces conversion by 5-10%. You help teams identify the minimum viable information needed and design forms that maximize submission rates through field reduction, smart sequencing, compelling CTAs, and trust signals.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Optimize this **${v.formPurpose}** form.

Current fields: ${v.currentFields}
${v.conversionRate ? `Current CVR: ${v.conversionRate}` : ''}
${v.formLocation ? `Location: ${v.formLocation}` : ''}

Deliver:
1. **Field Audit** — keep / remove / defer for each field with rationale
2. **Optimized Form Design** — minimum fields, ideal order, field types
3. **CTA Copy** — 5 options for the submit button (no "Submit")
4. **Trust Signals** — what to add near the form to increase trust
5. **Progressive Profiling Plan** — how to collect deferred data over time
6. **Error Handling Copy** — friendly error messages for key validation states`,
  },

  {
    slug: 'popup-banner-creator',
    title: 'Popup & Banner Creator',
    tagline: 'Design high-converting modals, overlays, and sticky banners',
    category: 'cro',
    icon: '💬',
    fields: [
      {
        id: 'goal',
        label: 'Popup Goal',
        type: 'select',
        required: true,
        options: [
          { value: 'email capture', label: 'Email Capture' },
          { value: 'promote offer or discount', label: 'Promote Offer / Discount' },
          { value: 'announce feature or launch', label: 'Announce Feature / Launch' },
          { value: 'exit intent retention', label: 'Exit Intent Retention' },
          { value: 'upsell or upgrade', label: 'Upsell / Upgrade' },
          { value: 'collect feedback', label: 'Collect Feedback' },
        ],
      },
      {
        id: 'trigger',
        label: 'Trigger Condition',
        type: 'select',
        options: [
          { value: 'time on page (30 seconds)', label: 'Time on page (30s)' },
          { value: 'scroll depth (50%)', label: 'Scroll depth (50%)' },
          { value: 'exit intent', label: 'Exit intent' },
          { value: 'after X page views', label: 'After X page views' },
          { value: 'on specific page', label: 'Specific page entry' },
        ],
      },
      {
        id: 'offer',
        label: 'Offer / Incentive',
        type: 'text',
        placeholder: 'e.g. free ebook, 20% discount, early access, weekly newsletter',
        required: true,
      },
      {
        id: 'audience',
        label: 'Target Audience Segment',
        type: 'text',
        placeholder: 'e.g. first-time visitors, returning users who haven\'t converted',
      },
    ],
    systemPrompt: `You are a popup and conversion overlay expert. You know that poorly timed or irrelevant popups destroy UX, while well-crafted ones convert 3-10%+ of visitors. You design popups with compelling headlines, clear value exchange, minimal friction, and smart dismiss options.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Design a **${v.goal}** popup.

Trigger: ${v.trigger || 'time on page'}
Offer/incentive: ${v.offer}
${v.audience ? `Target segment: ${v.audience}` : ''}

Deliver:
1. **3 Headline Options** (with rationale for each angle)
2. **Body Copy** (1-2 sentences maximum)
3. **CTA Button Copy** (3 options)
4. **Dismiss Text** ("No thanks, I don't want X" — complete the sentence)
5. **Design Specs** (recommended size, overlay opacity, animation)
6. **Trigger & Timing Recommendations**
7. **A/B Test Plan** (what to test first)
8. **Mobile Variant** copy adjustments`,
  },

  {
    slug: 'onboarding-optimizer',
    title: 'Onboarding Optimizer',
    tagline: 'Reduce time-to-value and increase activation rates',
    category: 'cro',
    icon: '🎯',
    fields: [
      {
        id: 'currentSteps',
        label: 'Current Onboarding Steps',
        type: 'textarea',
        placeholder: 'Describe your onboarding flow step by step from signup to first value',
        required: true,
        rows: 5,
      },
      {
        id: 'keyAction',
        label: '"Aha Moment" / Key Activation Action',
        type: 'text',
        placeholder: 'e.g. user creates first project, connects first integration, sends first message',
        required: true,
      },
      {
        id: 'activationRate',
        label: 'Current Activation Rate (optional)',
        type: 'text',
        placeholder: 'e.g. 30% reach the aha moment within 7 days',
      },
      {
        id: 'dropoffPoint',
        label: 'Biggest Drop-off Point',
        type: 'text',
        placeholder: 'Where do most new users abandon?',
      },
    ],
    systemPrompt: `You are an onboarding CRO specialist. You know that the window to activate a new user is short — typically 7 days — and every unnecessary step delays reaching the "aha moment". You optimize for time-to-value, reduce cognitive load, and design progressive disclosure of features.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Optimize this onboarding flow. Target aha moment: **${v.keyAction}**

Current flow:
${v.currentSteps}

${v.activationRate ? `Current activation rate: ${v.activationRate}` : ''}
${v.dropoffPoint ? `Main drop-off: ${v.dropoffPoint}` : ''}

Deliver:
1. **Flow Audit** — rate each step (necessary / deferrable / remove)
2. **Optimized Flow** — redesigned step sequence focused on aha moment
3. **Empty State Copy** — for each blank canvas a new user encounters
4. **Progress Indicators** — how to show users their next step
5. **Quick Wins** (3-5 changes to implement this week)
6. **Email/In-app Triggers** — nudges to send users who haven't activated`,
  },

  {
    slug: 'paywall-designer',
    title: 'Paywall & Upgrade Designer',
    tagline: 'Create in-app upgrade prompts that convert free users to paid',
    category: 'cro',
    icon: '💳',
    fields: [
      {
        id: 'triggerContext',
        label: 'Upgrade Trigger',
        type: 'select',
        required: true,
        options: [
          { value: 'feature gate (user hits a premium feature)', label: 'Feature Gate' },
          { value: 'usage limit (user hits plan limit)', label: 'Usage Limit Hit' },
          { value: 'trial expiration', label: 'Trial Expiration' },
          { value: 'contextual upsell (power user moment)', label: 'Contextual Upsell' },
        ],
      },
      {
        id: 'blockedFeature',
        label: 'Blocked Feature / Limit Hit',
        type: 'text',
        placeholder: 'e.g. team collaboration, 10-project limit reached, API access',
        required: true,
      },
      {
        id: 'pricingPlans',
        label: 'Plan Names & Prices',
        type: 'text',
        placeholder: 'e.g. Free → Pro ($29/mo) → Team ($99/mo)',
      },
      {
        id: 'keyUpgradeFeatures',
        label: 'Key Features in Paid Plan',
        type: 'textarea',
        placeholder: 'List the most compelling features unlocked with upgrade',
        rows: 3,
      },
    ],
    systemPrompt: `You are an in-app monetization and paywall expert. You design upgrade moments that feel helpful rather than annoying — showing clear value rather than just blocking access. You write copy that focuses on what the user gains, not what they're missing.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Design a **${v.triggerContext}** paywall for: **${v.blockedFeature}**

${v.pricingPlans ? `Plans: ${v.pricingPlans}` : ''}
${v.keyUpgradeFeatures ? `Key upgrade features: ${v.keyUpgradeFeatures}` : ''}

Deliver:
1. **Paywall Headline** (3 options — benefit-focused, not "Upgrade to Pro")
2. **Value Statement** (1-2 sentences on what they unlock)
3. **Feature List** (3-5 bullet points for the paid plan)
4. **CTA Copy** (primary + secondary options)
5. **Objection Handling** (2-3 lines addressing price hesitation)
6. **Dismiss Option** (how to handle "not now" without losing the user)
7. **Social Proof Element** suggestion (testimonial or usage stat)`,
  },

  // ─── GROWTH PLAYBOOKS ─────────────────────────────────────────────
  {
    slug: 'lead-magnet-creator',
    title: 'Lead Magnet Creator',
    tagline: 'Design high-converting lead magnets with full landing page copy',
    category: 'growth',
    icon: '🧲',
    fields: [
      {
        id: 'audiencePainPoint',
        label: 'Audience Pain Point',
        type: 'text',
        placeholder: 'The specific problem your audience struggles with',
        required: true,
      },
      {
        id: 'buyerStage',
        label: 'Buyer Stage',
        type: 'select',
        required: true,
        options: [
          { value: 'awareness — educating about the problem', label: 'Awareness (they just discovered the problem)' },
          { value: 'consideration — evaluating solutions', label: 'Consideration (comparing options)' },
          { value: 'decision — ready to buy', label: 'Decision (almost ready to buy)' },
        ],
      },
      {
        id: 'preferredFormat',
        label: 'Format Preference',
        type: 'select',
        options: [
          { value: 'recommend best format', label: 'Recommend the best format' },
          { value: 'checklist', label: 'Checklist' },
          { value: 'template', label: 'Template' },
          { value: 'ebook / guide', label: 'Ebook / Guide' },
          { value: 'quiz', label: 'Quiz' },
          { value: 'webinar', label: 'Webinar' },
          { value: 'free tool / calculator', label: 'Free Tool / Calculator' },
        ],
      },
      {
        id: 'productConnection',
        label: 'How Your Product Connects',
        type: 'text',
        placeholder: 'How does your product solve what the lead magnet starts to address?',
      },
    ],
    systemPrompt: `You are a lead generation expert. A great lead magnet solves one specific problem, is consumable in under 30 minutes, has high perceived value, and naturally leads to your product. You recommend formats based on buyer stage and build complete assets including landing page copy and delivery email.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Create a lead magnet for audience pain point: **${v.audiencePainPoint}**

Buyer stage: ${v.buyerStage}
Format: ${v.preferredFormat || 'recommend best format'}
${v.productConnection ? `Product connection: ${v.productConnection}` : ''}

Deliver:
1. **Format Recommendation** with rationale (if "recommend" selected)
2. **Lead Magnet Title** (3 options — specific, benefit-driven)
3. **Content Outline** (complete structure of the lead magnet itself)
4. **Landing Page Copy** (headline, bullets, form CTA)
5. **Thank-You / Delivery Email** (subject + body)
6. **Follow-up Email** sent 2 days later connecting magnet to product
7. **Promotion Copy** (1 LinkedIn post + 1 Twitter/X post)`,
  },

  {
    slug: 'referral-program-designer',
    title: 'Referral Program Designer',
    tagline: 'Build a referral or affiliate program that drives real growth',
    category: 'growth',
    icon: '🔄',
    fields: [
      {
        id: 'businessModel',
        label: 'Business Type',
        type: 'radio',
        required: true,
        options: [
          { value: 'B2B SaaS', label: 'B2B SaaS' },
          { value: 'B2C SaaS', label: 'B2C SaaS' },
          { value: 'e-commerce', label: 'E-commerce' },
          { value: 'marketplace', label: 'Marketplace' },
        ],
      },
      {
        id: 'ltv',
        label: 'Avg Customer LTV',
        type: 'text',
        placeholder: 'e.g. $500, $2,000/yr, $50',
        required: true,
      },
      {
        id: 'shareability',
        label: 'Product Shareability',
        type: 'select',
        options: [
          { value: 'highly shareable — built into the product workflow', label: 'Highly shareable (built into workflow)' },
          { value: 'moderately shareable — customers talk about it', label: 'Moderate (customers discuss it)' },
          { value: 'low shareability — niche or private use case', label: 'Low (niche or private)' },
        ],
      },
      {
        id: 'existingTools',
        label: 'Tools / Stack',
        type: 'text',
        placeholder: 'e.g. Stripe, Paddle, any existing referral tools',
      },
    ],
    systemPrompt: `You are a referral and affiliate program expert. You design programs based on unit economics — the reward must cost less than CAC saved. You cover single vs double-sided rewards, tiered structures, incentive types (cash vs credit vs gift), in-app touchpoints, and launch strategy.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Design a referral program for a **${v.businessModel}** business.

Customer LTV: ${v.ltv}
Shareability: ${v.shareability || 'moderate'}
${v.existingTools ? `Tools/stack: ${v.existingTools}` : ''}

Deliver:
1. **Program Structure** (single vs double-sided, reward type, reward amount with LTV math)
2. **Reward Mechanics** (what triggers a reward, timing, caps)
3. **In-App Touchpoints** (where to prompt referrals — 5 specific moments)
4. **Launch Email** to existing customers announcing the program
5. **Referral Invite Copy** (what the referrer sends to friends)
6. **Landing Page for Referred Users** (headline + copy)
7. **Tool Recommendations** (Rewardful, Tolt, or custom based on stack)
8. **KPIs to track** (referral rate benchmark, viral coefficient goal)`,
  },

  {
    slug: 'free-tool-planner',
    title: 'Free Tool Planner',
    tagline: 'Plan an engineering-as-marketing tool for SEO and lead gen',
    category: 'growth',
    icon: '🛠️',
    fields: [
      {
        id: 'productCategory',
        label: 'Your Product Category',
        type: 'text',
        placeholder: 'e.g. email marketing platform, project management tool, CRM',
        required: true,
      },
      {
        id: 'audiencePainPoints',
        label: 'Audience Pain Points',
        type: 'textarea',
        placeholder: 'What tedious manual tasks does your audience do? What do they calculate, check, or generate repeatedly?',
        required: true,
        rows: 3,
      },
      {
        id: 'devResources',
        label: 'Build Resources',
        type: 'select',
        options: [
          { value: 'full dev team available', label: 'Full dev team available' },
          { value: 'limited dev time (1-2 weeks)', label: 'Limited dev time (1-2 weeks)' },
          { value: 'no-code only', label: 'No-code only' },
        ],
      },
      {
        id: 'leadGoal',
        label: 'Primary Goal',
        type: 'select',
        options: [
          { value: 'SEO traffic + leads', label: 'SEO traffic + leads' },
          { value: 'direct lead capture', label: 'Direct lead capture' },
          { value: 'brand awareness', label: 'Brand awareness' },
        ],
      },
    ],
    systemPrompt: `You are an engineering-as-marketing strategist. You identify free tool concepts that solve genuine audience problems, generate search traffic, capture leads, and naturally connect to the core product. Tools must justify their build and maintenance cost with clear ROI.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Plan free marketing tools for a **${v.productCategory}** company.

Audience pain points: ${v.audiencePainPoints}
Build resources: ${v.devResources || 'limited dev time'}
Goal: ${v.leadGoal || 'SEO traffic + leads'}

Deliver:
1. **3-5 Tool Concepts** — for each:
   - Tool name and description
   - Target keyword(s) and search volume estimate
   - How it works (core functionality)
   - Unique value vs existing free alternatives
   - Lead capture mechanism
   - Connection to your product
   - Build complexity (1-5) and recommended stack
2. **Prioritized Recommendation** (which to build first and why)
3. **MVP Scope** for the top pick (what to include in v1)
4. **Launch Strategy** (SEO, distribution, outreach)`,
  },

  {
    slug: 'churn-fighter',
    title: 'Churn Fighter',
    tagline: 'Reduce cancellations and recover failed payments',
    category: 'growth',
    icon: '🛡️',
    fields: [
      {
        id: 'mode',
        label: 'What to Optimize',
        type: 'radio',
        required: true,
        options: [
          { value: 'cancel flow', label: 'Cancel Flow (reduce voluntary churn)' },
          { value: 'payment recovery', label: 'Payment Recovery (dunning for failed payments)' },
          { value: 'proactive retention', label: 'Proactive Retention (identify at-risk users)' },
        ],
      },
      {
        id: 'currentFlow',
        label: 'Current Cancel / Payment Flow',
        type: 'textarea',
        placeholder: 'Describe what currently happens when a user tries to cancel or when a payment fails',
        required: true,
        rows: 4,
      },
      {
        id: 'churnRate',
        label: 'Current Monthly Churn Rate',
        type: 'text',
        placeholder: 'e.g. 5% monthly, or "unknown"',
      },
      {
        id: 'topCancelReasons',
        label: 'Top Cancel Reasons (if known)',
        type: 'textarea',
        placeholder: 'e.g. too expensive, not using it enough, missing feature X',
        rows: 2,
      },
    ],
    systemPrompt: `You are a churn prevention expert. For cancel flows: the sequence is Trigger → Survey → Dynamic Offer → Confirmation → Post-Cancel. The offer must match the reason — a discount won't save disengaged users. Target 25-35% save rate. For dunning: 50-60% of failed payments can be recovered with smart retry logic.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Design a **${v.mode}** strategy.

Current flow: ${v.currentFlow}
${v.churnRate ? `Monthly churn rate: ${v.churnRate}` : ''}
${v.topCancelReasons ? `Top cancel reasons: ${v.topCancelReasons}` : ''}

Deliver:
${v.mode === 'cancel flow' ? `1. **Exit Survey Design** (4-5 reasons to choose from)
2. **Dynamic Offer Logic** (match offer to reason — table format)
3. **Retention Offer Copy** for each major cancel reason
4. **Confirmation Page** copy (for users who still cancel)
5. **Post-Cancel Win-Back Email** sequence (3 emails, 30/60/90 day)
6. **Expected Save Rate** benchmark for this model` : ''}
${v.mode === 'payment recovery' ? `1. **Dunning Sequence** (email sequence with timing and copy for each)
2. **Smart Retry Logic** (when to retry, how many times)
3. **In-App Notification** copy when card fails
4. **SMS/Push Copy** (if applicable)
5. **Recovery Rate Benchmarks** and tool recommendations (Stripe, Chargebee)` : ''}
${v.mode === 'proactive retention' ? `1. **At-Risk Signals** (behavioral triggers to monitor)
2. **Health Score Framework** (how to calculate user health)
3. **Intervention Playbook** (action per risk level)
4. **Re-engagement Email Sequence** for disengaged users
5. **In-App Intervention** copy and timing` : ''}`,
  },

  // ─── STRATEGY ─────────────────────────────────────────────────────
  {
    slug: 'marketing-ideas-generator',
    title: 'Marketing Ideas Generator',
    tagline: 'Get prioritized, tailored marketing strategy recommendations',
    category: 'strategy',
    icon: '💡',
    fields: [
      {
        id: 'stage',
        label: 'Company Stage',
        type: 'select',
        required: true,
        options: [
          { value: 'pre-launch', label: 'Pre-launch' },
          { value: 'early-stage (0-$10K MRR)', label: 'Early Stage (0-$10K MRR)' },
          { value: 'growth ($10K-$100K MRR)', label: 'Growth ($10K-$100K MRR)' },
          { value: 'scaling ($100K+ MRR)', label: 'Scaling ($100K+ MRR)' },
        ],
      },
      {
        id: 'goal',
        label: 'Primary Marketing Goal',
        type: 'text',
        placeholder: 'e.g. get first 100 customers, reduce CAC, break into enterprise',
        required: true,
      },
      {
        id: 'budget',
        label: 'Monthly Marketing Budget',
        type: 'select',
        options: [
          { value: '$0 (sweat equity only)', label: '$0 (sweat equity)' },
          { value: 'under $1K/month', label: 'Under $1K/month' },
          { value: '$1K-$5K/month', label: '$1K-$5K/month' },
          { value: '$5K-$20K/month', label: '$5K-$20K/month' },
          { value: '$20K+/month', label: '$20K+/month' },
        ],
      },
      {
        id: 'triedBefore',
        label: "What You've Already Tried",
        type: 'textarea',
        placeholder: 'What marketing approaches have you tested? What worked or failed?',
        rows: 3,
      },
    ],
    systemPrompt: `You are a strategic marketing advisor with deep knowledge of 139 proven marketing tactics across 16 categories. You recommend 5-7 targeted strategies based on stage, budget, and goals — not generic advice. Each recommendation includes specific implementation steps.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Recommend the best marketing strategies for this situation.

Stage: ${v.stage}
Goal: ${v.goal}
Budget: ${v.budget || 'unknown'}
Already tried: ${v.triedBefore || 'nothing specified'}

Deliver:
1. **Strategic Assessment** (2-3 sentence diagnosis of where to focus)
2. **Top 5-7 Recommended Strategies** — for each:
   - Strategy name and one-line description
   - Why it fits this specific situation
   - Effort level (Low/Med/High) and time to results
   - Specific first 3 steps to implement
   - Expected outcome/metric
3. **What to Avoid** (2-3 approaches that look tempting but won't work at this stage)
4. **30-Day Quick Start Plan** (the one thing to do first)`,
  },

  {
    slug: 'launch-planner',
    title: 'Launch Planner',
    tagline: 'Plan a product launch with ORB strategy: Owned, Rented, Borrowed',
    category: 'strategy',
    icon: '🚀',
    fields: [
      {
        id: 'launchSubject',
        label: "What You're Launching",
        type: 'text',
        placeholder: 'e.g. new product, major feature, redesign, pricing change',
        required: true,
      },
      {
        id: 'targetDate',
        label: 'Target Launch Date',
        type: 'text',
        placeholder: 'e.g. in 4 weeks, May 15',
      },
      {
        id: 'audienceSize',
        label: 'Current Audience',
        type: 'textarea',
        placeholder: 'Email subscribers, social followers, existing users — include rough numbers',
        rows: 2,
      },
      {
        id: 'channels',
        label: 'Available Channels',
        type: 'textarea',
        placeholder: 'e.g. email list (2K), LinkedIn (500 followers), Product Hunt, 3 partner newsletters',
        rows: 3,
      },
      {
        id: 'productHunt',
        label: 'Considering Product Hunt?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'maybe', label: 'Maybe' },
        ],
      },
    ],
    systemPrompt: `You are a product launch strategist using the ORB Framework: Owned channels (email, blog, community), Rented platforms (social, marketplaces), Borrowed audiences (guest posts, influencers, partners). You also know the 5-phase launch approach: internal → alpha → beta → early access → full launch.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Plan a launch for: **${v.launchSubject}**

Timeline: ${v.targetDate || 'not specified'}
Current audience: ${v.audienceSize || 'not specified'}
Available channels: ${v.channels || 'not specified'}
Product Hunt: ${v.productHunt || 'no'}

Deliver:
1. **Launch Strategy Overview** (ORB framework applied to this situation)
2. **Pre-Launch Phase** (2-4 weeks before — list building, teaser, waitlist)
3. **Launch Day Playbook** (hour-by-hour if small, day-by-day if large)
4. **Post-Launch Momentum** (week 1-4 tactics)
5. **Channel-by-Channel Plan** (specific action + copy for each channel)
${v.productHunt === 'yes' ? '6. **Product Hunt Strategy** (listing optimization, hunter outreach, day-of tactics)' : ''}
7. **Success Metrics** (what to measure and by when)
8. **Launch Email** (ready-to-send to existing list)`,
  },

  {
    slug: 'pricing-strategist',
    title: 'Pricing Strategist',
    tagline: 'Design value-based pricing, tiers, and packaging',
    category: 'strategy',
    icon: '💰',
    fields: [
      {
        id: 'productType',
        label: 'Product Type',
        type: 'text',
        placeholder: 'e.g. B2B SaaS, consumer app, API, marketplace',
        required: true,
      },
      {
        id: 'currentPricing',
        label: 'Current Pricing (if exists)',
        type: 'text',
        placeholder: 'e.g. $49/mo flat, free + $29/$99 tiers, usage-based at $0.01/call',
      },
      {
        id: 'targetMarket',
        label: 'Target Market Segments',
        type: 'textarea',
        placeholder: 'Who are your 2-3 buyer segments? What do they value most?',
        rows: 3,
      },
      {
        id: 'competitors',
        label: 'Competitor Pricing',
        type: 'textarea',
        placeholder: 'List key competitors and their pricing if known',
        rows: 3,
      },
      {
        id: 'pricingChallenge',
        label: 'Specific Challenge',
        type: 'select',
        options: [
          { value: 'design pricing from scratch', label: 'Design from scratch' },
          { value: 'increase prices', label: 'Raise prices' },
          { value: 'reduce churn by fixing plan structure', label: 'Fix plan structure / reduce churn' },
          { value: 'add enterprise tier', label: 'Add enterprise tier' },
          { value: 'move to usage-based pricing', label: 'Move to usage-based' },
        ],
      },
    ],
    systemPrompt: `You are a pricing strategy expert using value-based pricing principles. You cover packaging, value metrics, tier structure, psychological pricing, Van Westendorp analysis, and pricing page best practices. Good pricing aligns incentives — customers pay more when they get more value.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Develop a pricing strategy for **${v.productType}**.

Challenge: ${v.pricingChallenge || 'design from scratch'}
Current pricing: ${v.currentPricing || 'none'}
Target segments: ${v.targetMarket || 'not specified'}
Competitor pricing: ${v.competitors || 'not specified'}

Deliver:
1. **Pricing Model Recommendation** (flat/seat/usage/hybrid) with rationale
2. **Value Metric** (what to charge on — why this aligns with customer value)
3. **Tier Structure** (plan names, prices, key differentiating features per tier)
4. **Recommended Price Points** with supporting logic
5. **Pricing Page Design** (layout, what to emphasize, recommended plan highlighting)
6. **Psychological Pricing Tactics** to apply
7. **How to Raise Prices** (if increasing) — grandfather strategy, messaging
8. **FAQ for Sales** (answers to the 5 most common pricing objections)`,
  },

  {
    slug: 'psychology-optimizer',
    title: 'Behavioral Marketing Optimizer',
    tagline: 'Apply behavioral science and psychology to your marketing',
    category: 'strategy',
    icon: '🧠',
    fields: [
      {
        id: 'marketingAsset',
        label: 'Marketing Asset to Optimize',
        type: 'select',
        required: true,
        options: [
          { value: 'landing page', label: 'Landing Page' },
          { value: 'pricing page', label: 'Pricing Page' },
          { value: 'email campaign', label: 'Email Campaign' },
          { value: 'onboarding flow', label: 'Onboarding Flow' },
          { value: 'checkout / upgrade flow', label: 'Checkout / Upgrade Flow' },
          { value: 'ad copy', label: 'Ad Copy' },
        ],
      },
      {
        id: 'desiredAction',
        label: 'Desired User Action',
        type: 'text',
        placeholder: 'e.g. start free trial, upgrade to paid, complete onboarding',
        required: true,
      },
      {
        id: 'currentCopy',
        label: 'Current Copy / Description',
        type: 'textarea',
        placeholder: 'Paste current copy or describe what the asset currently looks/reads like',
        required: true,
        rows: 5,
      },
    ],
    systemPrompt: `You are a behavioral marketing expert applying psychological principles: loss aversion, social proof, reciprocity, scarcity, anchoring, framing, the endowment effect, commitment & consistency, and cognitive ease. You identify where these principles are missing or could be strengthened and deliver rewritten copy that applies them ethically.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Apply behavioral science to this **${v.marketingAsset}** to drive: **${v.desiredAction}**

Current copy/description:
${v.currentCopy}

Deliver:
1. **Behavioral Audit** — which principles are present, missing, or misapplied
2. **Top 3 Highest-Impact Principles** to apply for this specific action
3. **Rewritten Copy** applying those principles (full rewrite)
4. **Annotation** — for each change, name the principle and explain the psychological mechanism
5. **Additional Tactics** (urgency, social proof placement, anchoring, etc.)
6. **What NOT to do** — manipulative tactics to avoid`,
  },

  {
    slug: 'content-strategy-planner',
    title: 'Content Strategy Planner',
    tagline: 'Build a content strategy with pillar topics and content calendar',
    category: 'strategy',
    icon: '📅',
    fields: [
      {
        id: 'goals',
        label: 'Content Goals',
        type: 'textarea',
        placeholder: 'e.g. rank for category keywords, build thought leadership, generate leads via content',
        required: true,
        rows: 2,
      },
      {
        id: 'audience',
        label: 'Target Audience',
        type: 'text',
        placeholder: 'Who is your primary content audience?',
        required: true,
      },
      {
        id: 'resources',
        label: 'Content Resources',
        type: 'select',
        options: [
          { value: 'founder writing 2-4 hrs/week', label: 'Founder (2-4 hrs/week)' },
          { value: '1 content marketer full-time', label: '1 content marketer (full-time)' },
          { value: 'content team (2-4 people)', label: 'Content team (2-4 people)' },
          { value: 'outsourcing to freelancers', label: 'Outsourcing to freelancers' },
        ],
      },
      {
        id: 'existingContent',
        label: 'Existing Content (optional)',
        type: 'textarea',
        placeholder: 'Describe what content you already have — blog posts, videos, newsletters, etc.',
        rows: 2,
      },
    ],
    systemPrompt: `You are a content strategy expert. You build hub-and-spoke topic clusters, select content formats based on audience and resources, create editorial calendars, and optimize for both SEO and audience engagement. Good content strategy turns content into a compounding asset.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Build a content strategy.

Goals: ${v.goals}
Audience: ${v.audience}
Resources: ${v.resources || 'founder writing'}
${v.existingContent ? `Existing content: ${v.existingContent}` : ''}

Deliver:
1. **Content Mission Statement** (1-2 sentences defining content's role)
2. **3-5 Pillar Topics** (with target keyword clusters per pillar)
3. **Content Formats** (recommended mix based on resources and goals)
4. **90-Day Editorial Calendar** (topics, format, publish frequency)
5. **Distribution Plan** (where and how to promote each content type)
6. **Content Repurposing Framework** (1 piece → multiple formats)
7. **KPIs and Milestones** (what to measure at 30/60/90 days)`,
  },

  // ─── RESEARCH & INTELLIGENCE ──────────────────────────────────────
  {
    slug: 'competitor-profiler',
    title: 'Competitor Profiler',
    tagline: 'Build a detailed competitive intelligence profile',
    category: 'research',
    icon: '🕵️',
    fields: [
      {
        id: 'competitor',
        label: 'Competitor Name',
        type: 'text',
        placeholder: 'e.g. Notion, Monday.com, HubSpot',
        required: true,
      },
      {
        id: 'focusAreas',
        label: 'Focus Areas',
        type: 'multiselect',
        options: [
          { value: 'pricing and packaging', label: 'Pricing & Packaging' },
          { value: 'messaging and positioning', label: 'Messaging & Positioning' },
          { value: 'marketing channels', label: 'Marketing Channels' },
          { value: 'product strengths and weaknesses', label: 'Product Strengths/Weaknesses' },
          { value: 'customer sentiment (reviews)', label: 'Customer Sentiment' },
          { value: 'content and SEO strategy', label: 'Content & SEO' },
        ],
      },
      {
        id: 'context',
        label: 'Why You\'re Researching This Competitor',
        type: 'text',
        placeholder: 'e.g. they\'re our #1 competitor, we keep losing deals to them, entering their market',
      },
      {
        id: 'knownInfo',
        label: 'What You Already Know',
        type: 'textarea',
        placeholder: 'Any known info about this competitor — saves time and makes the output more relevant',
        rows: 3,
      },
    ],
    systemPrompt: `You are a competitive intelligence analyst. You build structured competitor profiles covering positioning, pricing, messaging, marketing channels, customer sentiment (from review sites), product strengths/weaknesses, and strategic implications. You focus on actionable insights, not just descriptions.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Build a competitive intelligence profile for **${v.competitor}**.

Focus areas: ${v.focusAreas || 'all areas'}
Context: ${v.context || 'general competitive research'}
${v.knownInfo ? `Known info: ${v.knownInfo}` : ''}

Deliver:
1. **Positioning & Messaging** (their core value prop, tagline, target customer)
2. **Pricing & Packaging** (plans, prices, free tier details, enterprise approach)
3. **Marketing Channel Analysis** (estimated traffic sources, content strategy, paid spend signals)
4. **Product Strengths** (what they do genuinely well)
5. **Product Weaknesses & Gaps** (common complaints, G2/Capterra patterns)
6. **Customer Language** (how their customers describe them — useful for positioning against them)
7. **Strategic Implications** (what this means for your positioning and sales)
8. **Battle Card** (quick-reference: when you win vs them, when you lose, objection handling)`,
  },

  {
    slug: 'customer-research-synthesizer',
    title: 'Customer Research Synthesizer',
    tagline: 'Turn raw research into clear insights, personas, and messaging',
    category: 'research',
    icon: '📊',
    fields: [
      {
        id: 'researchData',
        label: 'Raw Research Data',
        type: 'textarea',
        placeholder: 'Paste interview notes, survey responses, support tickets, reviews, NPS comments — anything raw',
        required: true,
        rows: 10,
      },
      {
        id: 'researchGoal',
        label: 'Research Goal',
        type: 'select',
        options: [
          { value: 'understand why customers buy', label: 'Understand why customers buy' },
          { value: 'identify churn reasons', label: 'Identify churn reasons' },
          { value: 'find messaging language', label: 'Find messaging language' },
          { value: 'validate a new feature', label: 'Validate a new feature' },
          { value: 'build personas', label: 'Build personas' },
        ],
      },
    ],
    systemPrompt: `You are a customer research analyst. You synthesize qualitative data into actionable insights using Jobs-to-be-Done framework, identify language patterns (exact phrases customers use that belong in copy), and extract persona-defining characteristics. Your synthesis reveals what customers actually mean, not just what they say.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Synthesize this customer research. Goal: **${v.researchGoal || 'understand why customers buy'}**

Raw research data:
${v.researchData}

Deliver:
1. **Key Themes** (5-7 major patterns found across the data)
2. **Jobs to be Done** (functional + emotional + social jobs customers are hiring the product for)
3. **Verbatim Gold** (10-15 exact customer quotes perfect for use in copy)
4. **Customer Language Map** (words/phrases to use, words to avoid, how they describe the problem)
5. **Persona Profiles** (2-3 distinct segments with their unique motivations)
6. **Messaging Implications** (how these insights should change your positioning)
7. **Open Questions** (what the research doesn't answer — gaps to fill)`,
  },

  // ─── PAID & ADS ───────────────────────────────────────────────────
  {
    slug: 'paid-ads-strategist',
    title: 'Paid Ads Strategist',
    tagline: 'Build a paid acquisition strategy for Google, Meta, or LinkedIn',
    category: 'ads',
    icon: '💸',
    fields: [
      {
        id: 'platform',
        label: 'Ad Platform',
        type: 'select',
        required: true,
        options: [
          { value: 'Google Ads', label: 'Google Ads' },
          { value: 'Meta (Facebook/Instagram)', label: 'Meta (Facebook/Instagram)' },
          { value: 'LinkedIn Ads', label: 'LinkedIn Ads' },
          { value: 'Twitter/X Ads', label: 'Twitter/X Ads' },
          { value: 'multi-platform strategy', label: 'Multi-platform strategy' },
        ],
      },
      {
        id: 'goal',
        label: 'Campaign Goal',
        type: 'select',
        options: [
          { value: 'trial signups', label: 'Trial Signups' },
          { value: 'demo bookings', label: 'Demo Bookings' },
          { value: 'lead capture', label: 'Lead Capture' },
          { value: 'direct purchase', label: 'Direct Purchase' },
          { value: 'brand awareness', label: 'Brand Awareness' },
        ],
      },
      {
        id: 'budget',
        label: 'Monthly Budget',
        type: 'text',
        placeholder: 'e.g. $2,000/mo, $500/mo',
        required: true,
      },
      {
        id: 'audience',
        label: 'Target Audience',
        type: 'textarea',
        placeholder: 'Describe your ideal customer for ads (industry, job title, interests, company size)',
        rows: 3,
      },
      {
        id: 'currentSetup',
        label: 'Current Ads Setup',
        type: 'text',
        placeholder: 'e.g. no ads yet, running Google but losing money, existing Meta campaigns',
      },
    ],
    systemPrompt: `You are a paid acquisition expert for SaaS and digital products. You build campaigns using proven frameworks: PAS (Problem-Agitation-Solution), BAB (Before-After-Bridge), and social proof. You focus on the full funnel: awareness → consideration → conversion, with proper retargeting and tracking.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Build a **${v.platform}** paid ads strategy.

Goal: ${v.goal || 'trial signups'}
Monthly budget: ${v.budget}
Target audience: ${v.audience || 'not specified'}
Current setup: ${v.currentSetup || 'starting from scratch'}

Deliver:
1. **Campaign Structure** (campaigns → ad sets → ads architecture)
2. **Audience Targeting** (detailed targeting, custom audiences, lookalikes)
3. **Bid Strategy** (recommended bid type, starting budgets per campaign)
4. **Ad Copy** (3 complete ads: headline + body + CTA, one per angle: pain/outcome/social proof)
5. **Landing Page Recommendations** (what the ad should link to and why)
6. **Retargeting Strategy** (audiences + specific messages for each)
7. **Tracking Setup** (events to fire, UTM structure, conversion setup)
8. **Week 1 Action Plan** and optimization schedule`,
  },

  {
    slug: 'ad-creative-generator',
    title: 'Ad Creative Generator',
    tagline: 'Generate ready-to-upload ad copy at scale for any platform',
    category: 'ads',
    icon: '🎨',
    fields: [
      {
        id: 'platform',
        label: 'Ad Platform',
        type: 'select',
        required: true,
        options: [
          { value: 'Google Ads (RSA)', label: 'Google Ads (Responsive Search)' },
          { value: 'Meta', label: 'Meta (Facebook/Instagram)' },
          { value: 'LinkedIn', label: 'LinkedIn' },
          { value: 'TikTok', label: 'TikTok' },
          { value: 'Twitter/X', label: 'Twitter/X' },
        ],
      },
      {
        id: 'objective',
        label: 'Ad Objective',
        type: 'text',
        placeholder: 'e.g. drive trial signups, generate demo requests, promote a feature',
        required: true,
      },
      {
        id: 'angles',
        label: 'Creative Angles to Cover',
        type: 'multiselect',
        options: [
          { value: 'pain point / problem', label: 'Pain Point / Problem' },
          { value: 'outcome / transformation', label: 'Outcome / Transformation' },
          { value: 'social proof / testimonial', label: 'Social Proof' },
          { value: 'curiosity / question', label: 'Curiosity / Question' },
          { value: 'direct offer / discount', label: 'Direct Offer' },
        ],
      },
      {
        id: 'count',
        label: 'Variations per Angle',
        type: 'select',
        options: [
          { value: '2', label: '2 variations' },
          { value: '3', label: '3 variations' },
        ],
      },
    ],
    systemPrompt: `You are an ad creative specialist. You know platform character limits precisely: Google RSA headlines (30 chars, up to 15), descriptions (90 chars), Meta primary text (125 chars visible), LinkedIn intro (150 chars), TikTok (80 chars). You write specific, active-voice copy with numbers when possible. No jargon.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Generate **${v.platform}** ad creative for: **${v.objective}**

Angles to cover: ${v.angles || 'pain point, outcome, social proof'}
Variations per angle: ${v.count || '2'}

For each variation, strictly follow ${v.platform} character limits. Deliver:
1. **Ad Variations** organized by angle — for each: complete ad copy (all fields for the platform)
2. **Character count** for each element (flag any that exceed limits)
3. **Performance Prediction** — rank which angle is most likely to perform first and why
4. **Visual Direction Notes** — what image/video to pair with each angle
5. **A/B Test Priority** — which 2 ads to test first`,
  },

  // ─── SALES ────────────────────────────────────────────────────────
  {
    slug: 'sales-deck-creator',
    title: 'Sales Deck Creator',
    tagline: 'Build pitch decks, one-pagers, and demo scripts',
    category: 'sales',
    icon: '📊',
    fields: [
      {
        id: 'asset',
        label: 'Asset Type',
        type: 'select',
        required: true,
        options: [
          { value: 'sales deck (full pitch)', label: 'Sales Deck (full pitch)' },
          { value: 'one-pager', label: 'One-Pager (1 page leave-behind)' },
          { value: 'demo script', label: 'Demo Script' },
          { value: 'email follow-up sequence', label: 'Post-Demo Follow-up Emails' },
        ],
      },
      {
        id: 'audience',
        label: 'Prospect Profile',
        type: 'text',
        placeholder: 'e.g. VP of Engineering at Series B SaaS, 50-200 employees',
        required: true,
      },
      {
        id: 'dealType',
        label: 'Deal Type',
        type: 'select',
        options: [
          { value: 'SMB self-serve', label: 'SMB / Self-serve' },
          { value: 'mid-market', label: 'Mid-market' },
          { value: 'enterprise', label: 'Enterprise' },
        ],
      },
      {
        id: 'topObjections',
        label: 'Top Sales Objections',
        type: 'textarea',
        placeholder: 'What do prospects most often push back on?',
        rows: 3,
      },
    ],
    systemPrompt: `You are a B2B sales enablement expert. You build materials that move deals forward — not corporate fluff, but specific, buyer-focused content that addresses objections, builds urgency, and makes the next step obvious. You use the SPIN framework and challenger sale principles.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Create a **${v.asset}** for: **${v.audience}**

Deal type: ${v.dealType || 'mid-market'}
Top objections: ${v.topObjections || 'not specified'}

${v.asset === 'sales deck (full pitch)' ? `Deliver a complete slide-by-slide outline:
1. Title slide
2. Problem slide (their world, their pain)
3. Status quo cost slide (what inaction costs)
4. Solution overview
5. Key features → benefits (3 slides)
6. Social proof / case study
7. How it works (implementation)
8. Pricing overview
9. Objection handling
10. Next steps / CTA

For each slide: title, key message, talking points, visual suggestion` : ''}
${v.asset === 'one-pager' ? `Deliver a complete one-pager:
1. Headline
2. Problem statement
3. Solution (3 bullet benefits)
4. How it works (3 simple steps)
5. Social proof quote + customer logo suggestion
6. Pricing/CTA
7. Contact info block` : ''}
${v.asset === 'demo script' ? `Deliver:
1. Pre-demo prep questions to ask
2. Opening (establish pain in their words)
3. Demo flow (screen by screen with talking points)
4. Objection handling inserts
5. Closing and next step ask` : ''}
${v.asset === 'email follow-up sequence' ? `Deliver 4 follow-up emails:
- Same day: recap + next step
- Day 3: value add (relevant resource)
- Day 7: case study / social proof
- Day 14: breakup email` : ''}`,
  },

  {
    slug: 'revops-advisor',
    title: 'RevOps Advisor',
    tagline: 'Optimize your revenue operations and lead lifecycle',
    category: 'sales',
    icon: '⚙️',
    fields: [
      {
        id: 'currentProcess',
        label: 'Current Sales/Revenue Process',
        type: 'textarea',
        placeholder: 'Describe your current lead flow: from acquisition → MQL → SQL → deal → close → onboarding',
        required: true,
        rows: 5,
      },
      {
        id: 'crm',
        label: 'CRM / Tools',
        type: 'text',
        placeholder: 'e.g. HubSpot, Salesforce, Pipedrive, Notion',
      },
      {
        id: 'bottleneck',
        label: 'Biggest Bottleneck',
        type: 'select',
        options: [
          { value: 'lead qualification is unclear', label: 'Lead qualification' },
          { value: 'slow lead response time', label: 'Lead response time' },
          { value: 'poor conversion from MQL to SQL', label: 'MQL → SQL conversion' },
          { value: 'deals stalling in pipeline', label: 'Deals stalling' },
          { value: 'forecasting is inaccurate', label: 'Forecasting' },
          { value: 'poor handoff from sales to CS', label: 'Sales → CS handoff' },
        ],
      },
      {
        id: 'teamSize',
        label: 'Sales Team Size',
        type: 'text',
        placeholder: 'e.g. 2 AEs + 1 SDR, founder-led sales',
      },
    ],
    systemPrompt: `You are a revenue operations expert. You optimize the full lead lifecycle: lead scoring, routing, SLA definitions, pipeline management, forecasting, and sales-to-CS handoffs. You recommend specific playbooks, automation, and CRM configurations that reduce friction and improve velocity.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Advise on revenue operations.

Current process: ${v.currentProcess}
Bottleneck: ${v.bottleneck || 'unclear'}
CRM/tools: ${v.crm || 'not specified'}
Team size: ${v.teamSize || 'not specified'}

Deliver:
1. **Process Audit** — where the biggest revenue leaks are
2. **Lead Scoring Framework** (criteria and weights for MQL/SQL definitions)
3. **Lead Routing Rules** (how leads should be assigned)
4. **SLA Definitions** (response times by lead tier)
5. **Pipeline Stage Definitions** (clear criteria for each stage with exit criteria)
6. **Bottleneck Fix** — specific playbook for the main issue identified
7. **Automation Recommendations** (what to automate in ${v.crm || 'your CRM'})
8. **90-Day RevOps Roadmap**`,
  },

  // ─── MEASUREMENT ──────────────────────────────────────────────────
  {
    slug: 'analytics-audit',
    title: 'Analytics Audit & Setup',
    tagline: 'Build a measurement plan and fix your analytics tracking',
    category: 'measurement',
    icon: '📡',
    fields: [
      {
        id: 'tools',
        label: 'Analytics Tools',
        type: 'text',
        placeholder: 'e.g. GA4, Mixpanel, Segment, Amplitude, GTM',
        required: true,
      },
      {
        id: 'businessGoals',
        label: 'Business Goals to Measure',
        type: 'textarea',
        placeholder: 'e.g. track free-to-paid conversion, measure feature adoption, attribute revenue to channels',
        required: true,
        rows: 3,
      },
      {
        id: 'currentSetup',
        label: 'Current Tracking Setup',
        type: 'textarea',
        placeholder: 'What events/goals are you currently tracking? What\'s broken or missing?',
        rows: 4,
      },
      {
        id: 'implementation',
        label: 'Who Handles Implementation',
        type: 'select',
        options: [
          { value: 'marketing via GTM (no-code)', label: 'Marketing via GTM (no-code)' },
          { value: 'developer', label: 'Developer' },
          { value: 'mixed (marketing + dev)', label: 'Mixed' },
        ],
      },
    ],
    systemPrompt: `You are an analytics implementation expert. You follow "track for decisions, not data" — every event should answer a specific business question. You use object-action naming (signup_completed, feature_used), proper UTM structure, and privacy-compliant setups. You deliver measurement plans that actually get implemented.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Audit and improve analytics tracking.

Tools: ${v.tools}
Business goals: ${v.businessGoals}
Current setup: ${v.currentSetup || 'starting from scratch'}
Implementation: ${v.implementation || 'developer'}

Deliver:
1. **Current Setup Gaps** (what's missing or broken)
2. **Event Taxonomy** (complete list of events to track with object-action names, properties for each)
3. **Conversion Funnel Definition** (key funnel stages and the events that define them)
4. **UTM Structure** (naming conventions for all campaigns)
5. **Implementation Checklist** (step-by-step for ${v.implementation || 'dev'})
6. **Dashboard Recommendations** (5 key reports to build first)
7. **Data Validation Steps** (how to verify tracking is working correctly)`,
  },

  {
    slug: 'ab-test-designer',
    title: 'A/B Test Designer',
    tagline: 'Design statistically sound A/B tests with clear hypotheses',
    category: 'measurement',
    icon: '🧪',
    fields: [
      {
        id: 'hypothesis',
        label: 'Test Hypothesis',
        type: 'textarea',
        placeholder: 'e.g. "Changing the CTA from Sign Up to Start Free Trial will increase CTR because it communicates more value"',
        required: true,
        rows: 3,
      },
      {
        id: 'page',
        label: 'What You\'re Testing',
        type: 'text',
        placeholder: 'e.g. homepage hero CTA, pricing page layout, onboarding step 2',
        required: true,
      },
      {
        id: 'primaryMetric',
        label: 'Primary Success Metric',
        type: 'text',
        placeholder: 'e.g. free trial signup rate, click-through rate, form completion rate',
        required: true,
      },
      {
        id: 'trafficVolume',
        label: 'Monthly Traffic to Page',
        type: 'text',
        placeholder: 'e.g. 5,000 visitors/month',
      },
      {
        id: 'currentRate',
        label: 'Current Conversion Rate',
        type: 'text',
        placeholder: 'e.g. 3.2%',
      },
    ],
    systemPrompt: `You are an A/B testing and experimentation expert. You design tests with proper statistical rigor: correct sample size calculation, test duration estimation, primary/secondary/guardrail metrics, and clear stopping rules. You use the ICE scoring framework and help teams avoid common pitfalls like peeking, multi-armed bandit traps, and novelty effects.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Design an A/B test.

Hypothesis: ${v.hypothesis}
Testing: ${v.page}
Primary metric: ${v.primaryMetric}
${v.trafficVolume ? `Monthly traffic: ${v.trafficVolume}` : ''}
${v.currentRate ? `Current conversion rate: ${v.currentRate}` : ''}

Deliver:
1. **Hypothesis Refinement** (rewrite in proper "If X, then Y, because Z" format)
2. **Test Design** (Control vs Variant — exactly what changes)
3. **Sample Size Calculation** (visitors needed per variant for 95% confidence)
4. **Test Duration Estimate** (weeks needed based on traffic)
5. **Metrics Plan**:
   - Primary metric (with minimum detectable effect)
   - Secondary metrics
   - Guardrail metrics (what to watch to avoid regressions)
6. **Implementation Notes** (where to set up, what tool to use)
7. **Analysis Plan** (how to read results, when to call it)
8. **ICE Score** (Impact/Confidence/Effort rating)`,
  },

  // ─── COMMUNITY & MORE ─────────────────────────────────────────────
  {
    slug: 'community-strategy',
    title: 'Community Strategy',
    tagline: 'Build a community that drives growth and brand loyalty',
    category: 'other',
    icon: '🌐',
    fields: [
      {
        id: 'communityGoal',
        label: 'Community Goal',
        type: 'select',
        required: true,
        options: [
          { value: 'drive product growth and referrals', label: 'Drive product growth & referrals' },
          { value: 'reduce support burden', label: 'Reduce support burden' },
          { value: 'build thought leadership', label: 'Build thought leadership' },
          { value: 'gather product feedback', label: 'Gather product feedback' },
          { value: 'create content from community', label: 'Create content from community' },
        ],
      },
      {
        id: 'platform',
        label: 'Community Platform',
        type: 'select',
        options: [
          { value: 'recommend best platform', label: 'Recommend the best platform' },
          { value: 'Slack', label: 'Slack' },
          { value: 'Discord', label: 'Discord' },
          { value: 'Circle', label: 'Circle' },
          { value: 'LinkedIn group', label: 'LinkedIn Group' },
          { value: 'Reddit / subreddit', label: 'Reddit / Subreddit' },
        ],
      },
      {
        id: 'audience',
        label: 'Target Community Members',
        type: 'text',
        placeholder: 'e.g. B2B founders, UX designers, devops engineers',
        required: true,
      },
      {
        id: 'resources',
        label: 'Resources Available',
        type: 'select',
        options: [
          { value: 'founder part-time', label: 'Founder (part-time)' },
          { value: '1 community manager', label: '1 community manager' },
          { value: 'no dedicated resource', label: 'No dedicated resource' },
        ],
      },
    ],
    systemPrompt: `You are a community building expert. You design communities that provide genuine value to members — not just brand promotion. You focus on the Community Flywheel: members join → get value → contribute → attract more members. You understand platform selection, content cadence, moderation, and turning community into a growth channel.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Design a community strategy.

Goal: ${v.communityGoal}
Platform: ${v.platform || 'recommend best'}
Audience: ${v.audience}
Resources: ${v.resources || 'founder part-time'}

Deliver:
1. **Platform Recommendation** with rationale (if "recommend" selected)
2. **Community Mission Statement** (why this community exists for members)
3. **Value Framework** (3-5 things members gain — career, knowledge, network, tools)
4. **Channel/Category Structure** (recommended channels/spaces)
5. **Launch Strategy** (first 100 members plan)
6. **Content Calendar** (weekly rhythm of posts, events, discussions)
7. **Moderation Guidelines**
8. **Community → Product Flywheel** (how community activity drives business outcomes)
9. **KPIs** (monthly active members, contribution rate, business impact)`,
  },

  {
    slug: 'directory-submissions',
    title: 'Directory Submission Planner',
    tagline: 'Get listed in startup, SaaS, and AI directories for backlinks and traffic',
    category: 'other',
    icon: '📁',
    fields: [
      {
        id: 'productCategory',
        label: 'Product Category',
        type: 'text',
        placeholder: 'e.g. project management SaaS, AI writing tool, developer tools',
        required: true,
      },
      {
        id: 'stage',
        label: 'Product Stage',
        type: 'select',
        options: [
          { value: 'pre-launch / waitlist', label: 'Pre-launch / Waitlist' },
          { value: 'launched, early traction', label: 'Launched, early traction' },
          { value: 'growth stage', label: 'Growth stage' },
        ],
      },
      {
        id: 'goals',
        label: 'Primary Goal',
        type: 'select',
        options: [
          { value: 'SEO backlinks', label: 'SEO Backlinks' },
          { value: 'targeted traffic', label: 'Targeted Traffic' },
          { value: 'both backlinks and traffic', label: 'Both' },
        ],
      },
    ],
    systemPrompt: `You are a startup distribution expert. You know the most impactful directories for SaaS, AI, dev tools, and B2B products — ranked by DA, traffic, and submission effort. You create submission-ready copy (tagline, description variants) and a prioritized submission plan.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Plan directory submissions for: **${v.productCategory}**

Stage: ${v.stage || 'launched'}
Goal: ${v.goals || 'both backlinks and traffic'}

Deliver:
1. **Top 20 Directories** (ranked by priority for this category) with:
   - Directory name + URL category
   - DA/traffic estimate
   - Free vs paid
   - Submission notes
2. **Tier 1 Quick Wins** (5 highest-impact to submit to first)
3. **Submission Copy Pack**:
   - Tagline (60 chars max)
   - Short description (150 chars)
   - Long description (300 chars)
   - Category tags to use
4. **Submission Workflow** (how to track submissions, follow-up plan)`,
  },

  {
    slug: 'aso-optimizer',
    title: 'App Store Optimizer',
    tagline: 'Improve App Store and Google Play listings for discovery and installs',
    category: 'other',
    icon: '📱',
    fields: [
      {
        id: 'appName',
        label: 'App Name',
        type: 'text',
        placeholder: 'Your app name',
        required: true,
      },
      {
        id: 'platform',
        label: 'Platform',
        type: 'radio',
        options: [
          { value: 'App Store (iOS)', label: 'App Store (iOS)' },
          { value: 'Google Play (Android)', label: 'Google Play (Android)' },
          { value: 'both platforms', label: 'Both' },
        ],
      },
      {
        id: 'category',
        label: 'App Category',
        type: 'text',
        placeholder: 'e.g. Productivity, Social, Health & Fitness',
        required: true,
      },
      {
        id: 'currentDescription',
        label: 'Current App Store Description',
        type: 'textarea',
        placeholder: 'Paste your current listing description (title + subtitle + description)',
        rows: 6,
      },
      {
        id: 'targetKeywords',
        label: 'Target Keywords',
        type: 'text',
        placeholder: 'Primary keywords you want to rank for in the app store',
      },
    ],
    systemPrompt: `You are an App Store Optimization (ASO) expert. You optimize for both discoverability (keyword ranking) and conversion (compelling listing copy). You know iOS and Android differences: iOS keyword field (100 chars), subtitle (30 chars); Google Play description indexing. You write listings that convert browsers to installers.`,
    buildPrompt: (v, ctx) =>
      `${ctx ? `Product context:\n${ctx}\n\n` : ''}Optimize the **${v.platform || 'App Store'}** listing for **${v.appName}** in ${v.category}.

${v.currentDescription ? `Current listing:\n${v.currentDescription}` : ''}
${v.targetKeywords ? `Target keywords: ${v.targetKeywords}` : ''}

Deliver:
1. **Keyword Strategy** (primary + secondary + long-tail keywords with rationale)
2. **Optimized Title** (30 chars max, keyword-rich)
3. **Optimized Subtitle/Short Description** (30 chars for iOS, 80 chars for Android)
4. **Full Description Rewrite** (keyword-rich, benefit-focused, first 255 chars are critical)
5. **Keyword Field** (iOS only: 100 chars, comma-separated, no spaces after commas)
6. **Screenshot Caption Copy** (text for first 3 screenshots)
7. **Rating/Review Strategy** (when and how to prompt for reviews)
8. **Competitive Gap Analysis** (keywords competitors rank for that you should target)`,
  },
]

export function getFeatureBySlug(slug: string): Feature | undefined {
  return FEATURES.find(f => f.slug === slug)
}

export function getFeaturesByCategory(categorySlug: string): Feature[] {
  return FEATURES.filter(f => f.category === categorySlug)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug)
}
