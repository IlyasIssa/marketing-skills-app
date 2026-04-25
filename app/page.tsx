'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Settings, BookOpen, ChevronRight } from 'lucide-react'
import { FEATURES, CATEGORIES } from '@/lib/features'
import FeatureCard, { CATEGORY_COLORS } from '@/components/FeatureCard'

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const q = search.toLowerCase()
  const filtered = FEATURES.filter(f =>
    (!q || f.title.toLowerCase().includes(q) || f.tagline.toLowerCase().includes(q)) &&
    (!activeCategory || f.category === activeCategory)
  )
  const grouped = CATEGORIES
    .map(cat => ({ ...cat, features: filtered.filter(f => f.category === cat.slug) }))
    .filter(g => g.features.length > 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ══════════ HERO ══════════ */}
      <section className="relative overflow-hidden" style={{ padding: '64px 24px 48px' }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124,58,237,0.1) 0%, transparent 70%)',
        }} />

        <div className="relative text-center" style={{ maxWidth: 560, margin: '0 auto' }}>
          {/* Badge */}
          <div className="badge badge-accent anim-up" style={{ marginBottom: 20, display: 'inline-flex' }}>
            <span className="dot dot-green" style={{ animationName: 'pulse-glow', animationDuration: '2s', animationIterationCount: 'infinite' }} />
            37 AI-powered marketing features
          </div>

          {/* Heading */}
          <h1
            className="grad-text anim-up"
            style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.1, marginBottom: 16, animationDelay: '40ms' }}
          >
            AI Marketing Toolkit
          </h1>

          <p
            className="anim-up"
            style={{ fontSize: 15, color: 'var(--t1)', lineHeight: 1.7, marginBottom: 32, animationDelay: '80ms' }}
          >
            37 task-specific tools for copy, SEO, CRO, growth and strategy.
            <br />Each one is a focused form — not a blank chat.
          </p>

          {/* Setup CTA row */}
          <div className="anim-up" style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36, animationDelay: '120ms' }}>
            <Link href="/setup" className="btn btn-primary" style={{ fontSize: 13 }}>
              <BookOpen size={14} />
              Set up product context
              <ChevronRight size={14} />
            </Link>
            <Link href="/settings" className="btn btn-secondary" style={{ fontSize: 13 }}>
              <Settings size={14} />
              Add API key
            </Link>
          </div>

          {/* Search */}
          <div className="anim-up" style={{ position: 'relative', animationDelay: '160ms' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--t2)', pointerEvents: 'none' }} />
            <input
              type="text"
              className="input"
              placeholder="Search features…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
        </div>
      </section>

      {/* ══════════ CATEGORY PILLS ══════════ */}
      <div style={{ padding: '0 24px 32px', display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
        <Pill active={!activeCategory} color="#6366f1" onClick={() => setActiveCategory(null)}>
          All · {FEATURES.length}
        </Pill>
        {CATEGORIES.map(cat => {
          const cnt = FEATURES.filter(f => f.category === cat.slug).length
          return (
            <Pill
              key={cat.slug}
              active={activeCategory === cat.slug}
              color={CATEGORY_COLORS[cat.slug]}
              onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)}
            >
              {cat.icon} {cat.label} · {cnt}
            </Pill>
          )
        })}
      </div>

      {/* ══════════ FEATURE GRID ══════════ */}
      <main style={{ padding: '0 24px 80px', maxWidth: 1400, margin: '0 auto' }}>
        {grouped.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>🔍</p>
            <p style={{ color: 'var(--t1)', marginBottom: 8 }}>No features match &ldquo;{search}&rdquo;</p>
            <button className="btn btn-ghost btn-sm" onClick={() => setSearch('')}>Clear search</button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {grouped.map((group, i) => (
            <section key={group.slug} className="anim-up" style={{ animationDelay: `${i * 30}ms` }}>
              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div
                  style={{
                    width: 30, height: 30, borderRadius: 'var(--r-lg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, flexShrink: 0,
                    background: `${CATEGORY_COLORS[group.slug]}14`,
                    border: `1px solid ${CATEGORY_COLORS[group.slug]}28`,
                  }}
                >
                  {group.icon}
                </div>
                <h2 style={{ fontWeight: 700, fontSize: 14, color: 'var(--t0)' }}>{group.label}</h2>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${CATEGORY_COLORS[group.slug]}30, transparent)` }} />
                <span
                  className="badge"
                  style={{
                    background: `${CATEGORY_COLORS[group.slug]}14`,
                    borderColor: `${CATEGORY_COLORS[group.slug]}28`,
                    color: CATEGORY_COLORS[group.slug],
                    fontSize: 11,
                  }}
                >
                  {group.features.length}
                </span>
              </div>

              {/* Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
                gap: 10,
              }}>
                {group.features.map(f => <FeatureCard key={f.slug} feature={f} />)}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
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
        background: active ? `${color}18` : 'var(--s1)',
        borderColor: active ? `${color}44` : 'var(--b0)',
        color: active ? color : 'var(--t1)',
        boxShadow: active ? `0 0 10px ${color}20` : 'none',
        cursor: 'pointer',
        transition: 'all var(--ease)',
        fontWeight: 500,
        fontSize: 12,
      }}
    >
      {children}
    </button>
  )
}
