# Marketing Skills App — Full Project Documentation

> Hand this file to a new Claude Code session to resume work with full context.
> Last updated: 2026-04-25

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Live URLs & Repositories](#2-live-urls--repositories)
3. [Tech Stack](#3-tech-stack)
4. [File Structure](#4-file-structure)
5. [Architecture & Data Flow](#5-architecture--data-flow)
6. [Design System](#6-design-system)
7. [All 37 Features](#7-all-37-features)
8. [Key Files Explained](#8-key-files-explained)
9. [Git & Deployment Workflow](#9-git--deployment-workflow)
10. [localStorage Schema](#10-localstorage-schema)
11. [OpenRouter Integration](#11-openrouter-integration)
12. [Known Constraints & Decisions](#12-known-constraints--decisions)
13. [What's Left / Ideas](#13-whats-left--ideas)

---

## 1. Project Overview

A **Next.js web app** that wraps the [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) GitHub repo — a collection of 40+ marketing skill definitions (SKILL.md files) — into **37 task-specific, form-driven AI features**.

Instead of a generic chat interface, each feature is a focused tool:
- A **structured form** with specific input fields relevant to that task
- A **streaming output panel** that renders the AI response as formatted markdown
- A **system prompt** derived from the skill's SKILL.md, injected automatically
- A **product context** (set once in /setup) injected into every prompt

The app uses **OpenRouter** as the LLM provider — users paste their own API key in Settings. No backend auth, no database, no server state. Everything is stored in `localStorage`.

---

## 2. Live URLs & Repositories

| Resource | URL |
|---|---|
| **Production** | https://marketing-skills-app.vercel.app |
| **Preview** | https://marketing-skills-5t9zd9jzj-ilyasissas-projects.vercel.app |
| **GitHub** | https://github.com/IlyasIssa/marketing-skills-app |
| **Vercel Dashboard** | https://vercel.com/ilyasissas-projects/marketing-skills-app |
| **Local dev** | http://localhost:3000 |

**Vercel project IDs** (in `.vercel/project.json`):
- `projectId`: `prj_g8Xj032UtxZgesLpNtPygpY5Zehg`
- `orgId`: `team_pXbyIBDkWDGfs19rQItrOtym`

**GitHub account**: `IlyasIssa`

---

## 3. Tech Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js App Router | 16.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS v4 + CSS custom properties | ^4 |
| UI Icons | lucide-react | ^1.11.0 |
| Markdown rendering | react-markdown + remark-gfm | ^10 / ^4 |
| LLM API | OpenRouter (OpenAI-compatible) | — |
| Deployment | Vercel | — |
| Runtime | Node.js / Edge (API route) | — |

**No** state management library, no ORM, no auth, no database.

---

## 4. File Structure

```
marketing-skills-app/
├── app/
│   ├── layout.tsx                  # Root layout — imports Navbar, globals.css
│   ├── page.tsx                    # Home page — feature grid with search + category filters
│   ├── globals.css                 # Full design system: CSS tokens, component classes, animations
│   ├── api/
│   │   └── generate/
│   │       └── route.ts            # POST /api/generate — proxies to OpenRouter with streaming
│   ├── features/
│   │   └── [slug]/
│   │       └── page.tsx            # Static server component — breadcrumb + renders FeaturePageClient
│   ├── settings/
│   │   └── page.tsx                # API key input + model selector (client component)
│   └── setup/
│       └── page.tsx                # Product marketing context form (client component)
│
├── components/
│   ├── Navbar.tsx                  # Top nav — logo, status dots for API key + context, nav links
│   ├── FeatureCard.tsx             # Card used in the home grid — hover accent line + arrow animation
│   └── FeaturePageClient.tsx       # Main feature UI — form panel (left) + streaming output (right)
│
├── lib/
│   ├── features.ts                 # All 37 feature definitions + CATEGORIES array
│   └── types.ts                    # TypeScript interfaces: Feature, Field, Category, ProductContext
│
├── .vercel/
│   └── project.json                # Vercel project + org IDs (auto-generated, do not delete)
│
└── PROJECT.md                      # This file
```

---

## 5. Architecture & Data Flow

### Page routing
- `/` — static home page (client component due to search/filter state)
- `/setup` — client component, reads/writes localStorage
- `/settings` — client component, reads/writes localStorage
- `/features/[slug]` — server component (breadcrumb + metadata) that renders `<FeaturePageClient slug={slug} />`

### Why slug-only is passed to FeaturePageClient
Next.js cannot serialize functions from server to client components. The `Feature` type includes a `buildPrompt(values, context) => string` function. Passing the full `Feature` object would fail at build time. Solution: pass only the `slug` string, and the client component calls `getFeatureBySlug(slug)` itself to get the full object including the function.

### Streaming flow
```
User fills form → clicks Generate
  → FeaturePageClient builds { systemPrompt, userPrompt } from feature definition
  → POST /api/generate  { messages, apiKey, model }
  → route.ts forwards to OpenRouter  https://openrouter.ai/api/v1/chat/completions  stream:true
  → Response body (SSE stream) passed straight through to browser
  → FeaturePageClient reads SSE chunks, parses delta content, appends to output state
  → ReactMarkdown renders output in real time
```

### Product context injection
`/setup` saves a plain text string to `localStorage['marketing_product_context']`. `FeaturePageClient` reads it via `useLS()` hook and passes it to `feature.buildPrompt(values, ctx)`. Each feature's `buildPrompt` prepends the context with `Product context:\n${ctx}\n\n` before the task-specific prompt.

---

## 6. Design System

All design tokens live in `app/globals.css` as CSS custom properties.

### Color tokens
```css
--bg          #080812     /* page background */
--s0          #0c0c1e     /* surface 0 — navbar, form panel */
--s1          #111128     /* surface 1 — cards */
--s2          #161632     /* surface 2 — inputs, hover states */
--s3          #1c1c3c     /* surface 3 — deepest surface */
--b0          #1a1a38     /* border default */
--b1          #252548     /* border hover */
--b2          #323268     /* border active/focus ring base */
--t0          #f0f0ff     /* text primary */
--t1          #9090b8     /* text secondary */
--t2          #505070     /* text tertiary / placeholders */
--ac          #7c3aed     /* accent purple */
--ac-h        #6d28d9     /* accent hover */
--ac-l        #a78bfa     /* accent light */
--ac-g        rgba(124,58,237,0.25)   /* accent glow */
--green       #10b981
--yellow      #f59e0b
--red         #ef4444
```

### Spacing (8px grid)
`--sp1: 4px` through `--sp16: 64px`

### Border radius
`--r-sm: 6px`, `--r-md: 8px`, `--r-lg: 12px`, `--r-xl: 16px`, `--r-2xl: 20px`, `--r-full: 9999px`

### Component CSS classes (defined in globals.css)
| Class | Purpose |
|---|---|
| `.btn` | Base button — use with modifier |
| `.btn-primary` | Gradient purple, glow shadow |
| `.btn-secondary` | Surface bg, muted text |
| `.btn-ghost` | Transparent, hover reveals bg |
| `.btn-danger` | Red tint |
| `.btn-sm` | Smaller padding/font |
| `.input` | Form input — focus glow ring |
| `.card` | Rounded surface with border |
| `.card-sm` | Smaller radius card |
| `.card-hover` | Adds hover lift + shadow |
| `.badge` | Pill label |
| `.badge-accent / green / yellow / red` | Semantic badge colors |
| `.alert` | Info box |
| `.alert-error / warning / info / success` | Semantic alerts |
| `.dot` | 7px status circle |
| `.dot-green / yellow / red / muted` | Colored status dots |
| `.glass` | Backdrop blur surface (navbar) |
| `.grad-text` | Gradient text (white→purple→indigo) |
| `.anim-up / in` | Fade-up / fade-in entrance animations |
| `.anim-spin` | Continuous rotation (loaders) |
| `.cursor` | Streaming text cursor (::after blink) |
| `.prose` | Markdown output styles |

### Category colors
```ts
content:     '#7c3aed'   // violet
seo:         '#059669'   // emerald
cro:         '#ea580c'   // orange
growth:      '#2563eb'   // blue
strategy:    '#db2777'   // pink
research:    '#d97706'   // amber
ads:         '#dc2626'   // red
sales:       '#0891b2'   // cyan
measurement: '#0d9488'   // teal
other:       '#475569'   // slate
```
Exported from `components/FeatureCard.tsx` as `CATEGORY_COLORS`.

---

## 7. All 37 Features

### Content & Copy (5)
| Slug | Title | Key Inputs | Key Output |
|---|---|---|---|
| `copy-generator` | Copy Generator | pageType, audience, keyBenefits, tone | Headline variants, body sections, CTAs with annotations |
| `copy-improver` | Copy Improver | existingCopy, context, focusArea | Side-by-side rewrite with Seven Sweeps change log |
| `cold-email-sequence` | Cold Email Sequence | prospectRole, offer, desiredAction, emailCount | 3-5 emails with subject lines, timing, angle notes |
| `email-campaign-builder` | Email Campaign Builder | sequenceType, audience, goal, emailCount | Full drip sequence with send timing and CTAs |
| `social-post-creator` | Social Post Creator | contentInput, platforms (multiselect), goal | Platform-native posts grouped by channel |

### SEO Toolkit (6)
| Slug | Title | Key Inputs | Key Output |
|---|---|---|---|
| `seo-auditor` | SEO Auditor | siteDescription, currentIssues, siteType, pageContent | Prioritized findings: Critical / High / Quick Win / Improvements |
| `ai-search-optimizer` | AI Search Optimizer | contentDescription, targetQueries, currentContent | Citation readiness score + actionable checklist |
| `competitor-page-builder` | Competitor Page Builder | competitor, pageType, yourProduct, differentiators | Full comparison page copy + SEO meta + FAQ schema |
| `site-architecture-planner` | Site Architecture Planner | siteType, goals, existingPages, targetKeywords | Page hierarchy with URLs, nav spec, content clusters |
| `schema-generator` | Schema Generator | pageType, contentDetails, techStack | Ready-to-paste JSON-LD + implementation instructions |
| `programmatic-seo-planner` | Programmatic SEO Planner | product, keywordPattern, dataSource, pageCount | Template design, sample pages, indexation strategy |

### Conversion (CRO) (6)
| Slug | Title | Key Inputs | Key Output |
|---|---|---|---|
| `page-cro-analyzer` | Page CRO Analyzer | pageContent, pageType, conversionGoal, trafficSource | Quick wins, high-impact changes, A/B hypotheses, copy alternatives |
| `signup-flow-optimizer` | Signup Flow Optimizer | signupType, flowSteps, completionRate, dropoffPoint | Friction audit, optimized flow, expected impact |
| `form-optimizer` | Form Optimizer | formPurpose, currentFields, conversionRate | Field audit (keep/remove/defer), CTA copy, trust signals |
| `popup-banner-creator` | Popup & Banner Creator | goal, trigger, offer, audience | 3 headline options, body copy, CTA, dismiss text, A/B plan |
| `onboarding-optimizer` | Onboarding Optimizer | currentSteps, keyAction, activationRate, dropoffPoint | Step audit, optimized flow, empty state copy, email triggers |
| `paywall-designer` | Paywall & Upgrade Designer | triggerContext, blockedFeature, pricingPlans, keyUpgradeFeatures | Headline variants, value statement, CTA, objection handling |

### Growth Playbooks (4)
| Slug | Title | Key Inputs | Key Output |
|---|---|---|---|
| `lead-magnet-creator` | Lead Magnet Creator | audiencePainPoint, buyerStage, preferredFormat | Format rec, title variants, content outline, landing page copy, delivery email |
| `referral-program-designer` | Referral Program Designer | businessModel, ltv, shareability, existingTools | Program structure with LTV math, in-app touchpoints, launch email |
| `free-tool-planner` | Free Tool Planner | productCategory, audiencePainPoints, devResources | 3-5 tool concepts with search demand rationale + MVP scope |
| `churn-fighter` | Churn Fighter | mode (radio: cancel/payment/proactive), currentFlow | Cancel flow + dynamic offer logic OR dunning sequence |

### Strategy (5)
| Slug | Title | Key Inputs | Key Output |
|---|---|---|---|
| `marketing-ideas-generator` | Marketing Ideas Generator | stage, goal, budget, triedBefore | 5-7 strategies with effort/impact + 30-day quick start |
| `launch-planner` | Launch Planner | launchSubject, targetDate, audienceSize, channels, productHunt | ORB framework plan, pre/launch/post phases, launch email |
| `pricing-strategist` | Pricing Strategist | productType, currentPricing, targetMarket, competitors | Pricing model rec, value metric, tier structure, pricing page design |
| `psychology-optimizer` | Behavioral Marketing Optimizer | marketingAsset, desiredAction, currentCopy | Behavioral audit + rewrite with principle annotations |
| `content-strategy-planner` | Content Strategy Planner | goals, audience, resources, existingContent | Pillar topics, 90-day calendar, distribution plan, repurposing framework |

### Research & Intelligence (2)
| Slug | Title | Key Inputs | Key Output |
|---|---|---|---|
| `competitor-profiler` | Competitor Profiler | competitor, focusAreas (multiselect), context, knownInfo | Full profile: positioning, pricing, channels, sentiment, battle card |
| `customer-research-synthesizer` | Customer Research Synthesizer | researchData (raw paste), researchGoal | JTBD framework, verbatim gold quotes, personas, messaging implications |

### Paid & Ads (2)
| Slug | Title | Key Inputs | Key Output |
|---|---|---|---|
| `paid-ads-strategist` | Paid Ads Strategist | platform, goal, budget, audience, currentSetup | Campaign structure, audience targeting, 3 complete ads, retargeting, week 1 plan |
| `ad-creative-generator` | Ad Creative Generator | platform, objective, angles (multiselect), count | Platform-spec ads per angle with char counts + visual direction notes |

### Sales (2)
| Slug | Title | Key Inputs | Key Output |
|---|---|---|---|
| `sales-deck-creator` | Sales Deck Creator | asset (sales deck/one-pager/demo script/follow-up), audience, dealType | Slide-by-slide outline OR one-pager OR demo script OR 4 follow-up emails |
| `revops-advisor` | RevOps Advisor | currentProcess, crm, bottleneck, teamSize | Process audit, lead scoring, SLA definitions, pipeline stages, 90-day roadmap |

### Measurement (2)
| Slug | Title | Key Inputs | Key Output |
|---|---|---|---|
| `analytics-audit` | Analytics Audit & Setup | tools, businessGoals, currentSetup, implementation | Event taxonomy, funnel definition, UTM structure, implementation checklist |
| `ab-test-designer` | A/B Test Designer | hypothesis, page, primaryMetric, trafficVolume, currentRate | Hypothesis refinement, sample size calc, test duration, metrics plan, ICE score |

### Community & More (3)
| Slug | Title | Key Inputs | Key Output |
|---|---|---|---|
| `community-strategy` | Community Strategy | communityGoal, platform, audience, resources | Platform rec, community mission, channel structure, launch strategy, KPIs |
| `directory-submissions` | Directory Submission Planner | productCategory, stage, goals | Top 20 directories ranked + submission copy pack (tagline, short/long desc) |
| `aso-optimizer` | App Store Optimizer | appName, platform, category, currentDescription, targetKeywords | Optimized title, subtitle, full description, keyword field, screenshot captions |

---

## 8. Key Files Explained

### `lib/features.ts`
The heart of the app. Exports:
- `CATEGORIES: Category[]` — 10 category definitions with slug, label, color, icon
- `FEATURES: Feature[]` — all 37 features, each with:
  - `slug` — URL identifier (`/features/[slug]`)
  - `title`, `tagline` — display strings
  - `category` — matches a `Category.slug`
  - `icon` — emoji
  - `fields: Field[]` — form field definitions (see `lib/types.ts`)
  - `systemPrompt: string` — the AI's role/persona, derived from SKILL.md content
  - `buildPrompt(values, productContext) => string` — assembles the user message from form values

Helper functions: `getFeatureBySlug(slug)`, `getFeaturesByCategory(slug)`, `getCategoryBySlug(slug)`

### `lib/types.ts`
```ts
FieldType = 'text' | 'textarea' | 'select' | 'multiselect' | 'radio'

Field { id, label, type, placeholder?, options?, required?, hint?, rows? }

Feature { slug, title, tagline, category, icon, fields, systemPrompt, buildPrompt }

Category { slug, label, color, icon }

ProductContext { productName, oneLiner, category, businessModel, targetCompanies,
                 decisionMakers, primaryUseCase, coreProblem, keyDifferentiators,
                 directCompetitors, brandTone, keyMetrics }
```

### `app/api/generate/route.ts`
Simple pass-through proxy to OpenRouter. Accepts `{ messages, apiKey, model }`, forwards to `https://openrouter.ai/api/v1/chat/completions` with `stream: true`, pipes the SSE response body straight back to the browser. Required headers for OpenRouter: `HTTP-Referer` and `X-Title`.

### `components/FeaturePageClient.tsx`
The main interactive component. Key implementation details:
- `useLS<T>(key, init)` — custom hook for localStorage with SSR safety (reads on mount, not render)
- AbortController stored in `abortRef` — allows stopping mid-stream
- SSE parsing: splits chunks by `\n`, finds `data: ` lines, parses JSON, extracts `choices[0].delta.content`
- Form layout: fixed-width left panel (400px) with scrollable fields, pinned Generate button at bottom
- Output layout: flex-1 right panel with toolbar when output exists, empty state when not

### `components/Navbar.tsx`
Reads `marketing_api_key` and `marketing_product_context` from localStorage on every route change (via `useEffect` with `pathname` dependency) to show live green/grey status dots.

---

## 9. Git & Deployment Workflow

### Branch strategy
```
master  →  Production  (https://marketing-skills-app.vercel.app)
preview →  Preview     (https://marketing-skills-5t9zd9jzj-ilyasissas-projects.vercel.app)
```

### Day-to-day workflow
```bash
# Always work on preview
git checkout preview

# Make changes, then:
git add -A
git commit -m "description of change"
git push origin preview
# → Vercel auto-builds preview URL

# When ready for production:
git checkout master
git merge preview
git push origin master
# → Vercel auto-builds production URL

git checkout preview   # switch back
```

### Tools installed
- **GitHub CLI**: `C:\Program Files\GitHub CLI\gh.exe` — authenticated as `IlyasIssa`
- **Vercel CLI**: installed globally via npm — authenticated to `ilyasissas-projects`

### Manual Vercel commands
```bash
vercel              # deploy to preview
vercel --prod       # deploy to production
vercel logs         # view deployment logs
```

---

## 10. localStorage Schema

| Key | Type | Set by | Used by |
|---|---|---|---|
| `marketing_api_key` | `JSON.stringify(string)` | `/settings` | `FeaturePageClient`, `Navbar` |
| `marketing_model` | `JSON.stringify(string)` | `/settings` | `FeaturePageClient` |
| `marketing_product_context` | plain string | `/setup` save button | `FeaturePageClient` (injected into every prompt) |
| `marketing_product_context_form` | `JSON.stringify(ProductContext)` | `/setup` | `/setup` (repopulates form on revisit) |

### Default model
`anthropic/claude-sonnet-4-5` (changeable in Settings to any OpenRouter model)

---

## 11. OpenRouter Integration

- Base URL: `https://openrouter.ai/api/v1/chat/completions`
- Auth: `Authorization: Bearer ${apiKey}`
- Required extra headers: `HTTP-Referer: https://marketingskills.app`, `X-Title: Marketing Skills App`
- Streaming: `stream: true` in request body
- API key format: starts with `sk-or-`
- Compatible with OpenAI SDK format (messages array, same response shape)

### Available models in Settings UI
```
anthropic/claude-sonnet-4-5   ← default
anthropic/claude-haiku-4-5
anthropic/claude-opus-4
openai/gpt-4o
openai/gpt-4o-mini
google/gemini-pro-1.5
meta-llama/llama-3.1-70b-instruct
```

---

## 12. Known Constraints & Decisions

### Functions can't be passed server → client
Next.js App Router serializes props when passing from server to client components. The `Feature` type has a `buildPrompt` function — passing the full object would throw at build time. **Solution**: server component passes only `slug` (a string), client component calls `getFeatureBySlug(slug)` directly. This means `lib/features.ts` is a client-side module.

### No API key on the server
The API key lives in the user's browser localStorage. The `/api/generate` route receives it in the POST body and uses it to call OpenRouter. This is intentional — no server-side key storage means zero backend infrastructure cost and zero key leakage risk.

### Tailwind v4 syntax
The project uses Tailwind v4 which uses `@import "tailwindcss"` instead of the v3 `@tailwind base/components/utilities` directives. PostCSS config is in `postcss.config.mjs`. Tailwind utility classes work normally but most styling is done via CSS custom properties + component classes in `globals.css` for consistency.

### `image` and `video` skills not implemented
The original repo has `image` and `video` skills. These require image generation APIs (DALL-E, Midjourney, etc.) beyond text generation. They are not included in the 37 features.

### Static generation for all feature pages
`generateStaticParams()` in `/features/[slug]/page.tsx` pre-renders all 37 feature pages at build time. This means adding a new feature requires a redeploy to create the new page. The API route `/api/generate` is always dynamic (server-rendered on demand).

---

## 13. What's Left / Ideas

### Quick improvements
- [ ] **Conversation history** — persist last output per feature in localStorage so it survives page refresh
- [ ] **Regenerate with variation** — "Try a different angle" button that keeps the form but re-runs with a variation instruction
- [ ] **Export to markdown** — download button for the full output as a `.md` file
- [ ] **Character counter** on textarea fields that have limits (ad copy)
- [ ] **Responsive mobile layout** — currently the split-pane feature page is desktop-only; on mobile it stacks

### Medium features
- [ ] **Output sections** — parse the output into named sections (e.g. "Headline Options", "Body Copy") and add individual copy buttons per section
- [ ] **Prompt refinement** — after generation, show a "Refine" textarea where users can ask follow-up questions in context
- [ ] **Favorites** — let users star/pin their most-used features
- [ ] **Recent features** — show last 3-5 used features on the home page
- [ ] **Related skills workflow** — after a feature completes, clicking a related skill pre-fills shared fields automatically

### Bigger features
- [ ] **Multi-step wizards** for complex features (launch planner, email sequence) that guide users step by step instead of one big form
- [ ] **Templates** — pre-filled form values for common scenarios (e.g. "B2B SaaS launch", "E-commerce CRO")
- [ ] **History/sessions** — full conversation history with ability to revisit past generations
- [ ] **Team sharing** — share a generated output via a link (would require a backend)
