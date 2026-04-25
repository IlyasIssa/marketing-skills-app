'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Globe2, Layers3, Search, Settings, Workflow } from 'lucide-react'
import { FEATURES, CATEGORIES } from '@/lib/features'
import FeatureCard, { CATEGORY_COLORS } from '@/components/FeatureCard'

type SiteProfile = {
  companyName?: string
  oneLiner?: string
  category?: string
  targetAudience?: string
  primaryOffer?: string
  url?: string
  updatedAt?: string
}

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [site, setSite] = useState<SiteProfile | null>(null)
  const [hasKey, setHasKey] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('marketing_site_profile')
      const key = localStorage.getItem('marketing_api_key')
      if (raw) setSite(JSON.parse(raw))
      if (key) setHasKey(Boolean(JSON.parse(key)?.trim()))
    } catch {}
  }, [])

  const q = search.toLowerCase()
  const filtered = FEATURES.filter(f =>
    (!q || f.title.toLowerCase().includes(q) || f.tagline.toLowerCase().includes(q)) &&
    (!activeCategory || f.category === activeCategory)
  )
  const grouped = CATEGORIES
    .map(cat => ({ ...cat, features: filtered.filter(f => f.category === cat.slug) }))
    .filter(g => g.features.length > 0)

  const activeCategoryLabel = useMemo(() => {
    if (!activeCategory) return 'All tools'
    return CATEGORIES.find(c => c.slug === activeCategory)?.label || 'Tools'
  }, [activeCategory])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <main style={{ maxWidth: 1320, margin: '0 auto', padding: '28px 22px 72px' }}>
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 14, marginBottom: 18 }}>
          <div className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
              <div>
                <div className="badge badge-accent" style={{ marginBottom: 12 }}>
                  <span className={`dot ${site ? 'dot-green' : 'dot-muted'}`} />
                  {site ? 'Active site connected' : 'No active site'}
                </div>
                <h1 style={{ fontSize: 30, lineHeight: 1.12, fontWeight: 850, letterSpacing: '-0.025em', marginBottom: 10 }}>
                  {site?.companyName || 'Build a marketing system around one website'}
                </h1>
                <p style={{ color: 'var(--t1)', fontSize: 14, lineHeight: 1.7, maxWidth: 720 }}>
                  {site?.oneLiner || 'Analyze a site once, then use its profile across SEO, CRO, copy, ads, research, launch, and sales workflows.'}
                </p>
              </div>
              <Link href="/site" className="btn btn-primary" style={{ flexShrink: 0 }}>
                <Globe2 size={14} />
                {site ? 'Manage site' : 'Analyze site'}
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
              <Metric label="Tools" value={FEATURES.length.toString()} />
              <Metric label="Categories" value={CATEGORIES.length.toString()} />
              <Metric label="Model" value="GPT-5.5" />
            </div>
          </div>

          <aside className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontSize: 13, fontWeight: 800, color: 'var(--t0)' }}>Project Status</h2>
            <StatusRow done={hasKey} label="OpenRouter key" href="/settings" />
            <StatusRow done={Boolean(site)} label="Active site profile" href="/site" />
            <StatusRow done={Boolean(site?.targetAudience)} label="Audience detected" href="/site" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingTop: 6 }}>
              <Link href="/workflows" className="btn btn-secondary btn-sm"><Workflow size={12} /> Workflows</Link>
              <Link href="/artifacts" className="btn btn-secondary btn-sm"><Layers3 size={12} /> Artifacts</Link>
            </div>
          </aside>
        </section>

        {site && (
          <section className="card" style={{ padding: 16, marginBottom: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              <Info label="URL" value={site.url} />
              <Info label="Category" value={site.category} />
              <Info label="Audience" value={site.targetAudience} />
              <Info label="Offer" value={site.primaryOffer} />
            </div>
          </section>
        )}

        <section className="card" style={{ padding: 14, marginBottom: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 12, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--t2)', pointerEvents: 'none' }} />
              <input
                type="text"
                className="input"
                placeholder="Search tools, workflows, outputs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 38 }}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end' }}>
              <Pill active={!activeCategory} color="var(--ac)" onClick={() => setActiveCategory(null)}>
                All
              </Pill>
              {CATEGORIES.map(cat => (
                <Pill
                  key={cat.slug}
                  active={activeCategory === cat.slug}
                  color={CATEGORY_COLORS[cat.slug]}
                  onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)}
                >
                  {cat.label}
                </Pill>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800 }}>{activeCategoryLabel}</h2>
              <p style={{ color: 'var(--t2)', fontSize: 12 }}>{filtered.length} available tools</p>
            </div>
            <Link href="/settings" className="btn btn-ghost btn-sm"><Settings size={12} /> Settings</Link>
          </div>

          {grouped.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <p style={{ color: 'var(--t1)', marginBottom: 10 }}>No tools match "{search}".</p>
              <button className="btn btn-secondary btn-sm" onClick={() => setSearch('')}>Clear search</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {grouped.map(group => (
                <section key={group.slug}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: CATEGORY_COLORS[group.slug] }} />
                    <h3 style={{ fontWeight: 750, fontSize: 13, color: 'var(--t1)' }}>{group.label}</h3>
                    <span className="badge" style={{ color: 'var(--t2)', borderColor: 'var(--b0)', background: 'var(--s1)' }}>{group.features.length}</span>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: 10,
                  }}>
                    {group.features.map(f => <FeatureCard key={f.slug} feature={f} />)}
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'var(--s2)', border: '1px solid var(--b0)', borderRadius: 8, padding: 12 }}>
      <p style={{ color: 'var(--t2)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>{label}</p>
      <p style={{ color: 'var(--t0)', fontSize: 18, fontWeight: 850 }}>{value}</p>
    </div>
  )
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p style={{ color: 'var(--t2)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>{label}</p>
      <p style={{ color: value ? 'var(--t0)' : 'var(--t2)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || 'Not set'}</p>
    </div>
  )
}

function StatusRow({ done, label, href }: { done: boolean; label: string; href: string }) {
  return (
    <Link href={href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderTop: '1px solid var(--b0)' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: done ? 'var(--t0)' : 'var(--t1)', fontSize: 13 }}>
        <span className={`dot ${done ? 'dot-green' : 'dot-muted'}`} />
        {label}
      </span>
      <ArrowRight size={13} style={{ color: 'var(--t2)' }} />
    </Link>
  )
}

function Pill({ active, color, onClick, children }: {
  active: boolean; color: string; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="badge"
      style={{
        background: active ? `${color}18` : 'transparent',
        borderColor: active ? `${color}55` : 'var(--b0)',
        color: active ? color : 'var(--t1)',
        cursor: 'pointer',
        transition: 'all var(--ease)',
        fontWeight: 650,
        fontSize: 11,
      }}
    >
      {children}
    </button>
  )
}
