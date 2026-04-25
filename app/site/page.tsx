'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Globe2, Loader2, RefreshCw, Trash2 } from 'lucide-react'

type SiteProfile = {
  companyName?: string
  oneLiner?: string
  category?: string
  targetAudience?: string
  primaryOffer?: string
  keyBenefits?: string[]
  positioning?: string
  tone?: string
  currentCtas?: string[]
  importantPages?: { label: string; url: string }[]
  contentGaps?: string[]
  url?: string
  updatedAt?: string
}

export default function SitePage() {
  const [url, setUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('openai/gpt-5.5')
  const [profile, setProfile] = useState<SiteProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('marketing_site_profile')
      const savedKey = localStorage.getItem('marketing_api_key')
      const savedModel = localStorage.getItem('marketing_model')
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile)
        setProfile(parsed)
        setUrl(parsed.url || '')
      }
      if (savedKey) setApiKey(JSON.parse(savedKey))
      if (savedModel) setModel(JSON.parse(savedModel))
    } catch {}
  }, [])

  async function analyzeSite() {
    if (!apiKey) { setError('Add your OpenRouter API key in Settings first.'); return }
    if (!url.trim()) { setError('Enter a website URL.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/analyze-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          apiKey,
          model,
          featureTitle: 'Site Project Profile',
          featureTagline: 'Build reusable context for all marketing workflows',
          fields: [],
          productContext: localStorage.getItem('marketing_product_context') || '',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to analyze site')
      const next = { ...data.profile, url: data.url, updatedAt: new Date().toISOString() }
      setProfile(next)
      localStorage.setItem('marketing_site_profile', JSON.stringify(next))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to analyze site')
    } finally {
      setLoading(false)
    }
  }

  function clearSite() {
    setProfile(null)
    setUrl('')
    localStorage.removeItem('marketing_site_profile')
  }

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 30 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--r-xl)',
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Globe2 size={20} style={{ color: 'var(--ac-l)' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 850, marginBottom: 6 }}>Active Site</h1>
            <p style={{ color: 'var(--t1)', fontSize: 13, lineHeight: 1.6 }}>
              One website powers every feature, workflow, artifact, and research step.
            </p>
          </div>
        </div>
        <Link href="/" className="btn btn-ghost btn-sm"><ArrowLeft size={13} /> Home</Link>
      </div>

      <section className="card" style={{ padding: 20, marginBottom: 24 }}>
        <h2 style={{ fontSize: 13, fontWeight: 750, marginBottom: 12 }}>Website URL</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
          <input
            className="input"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            style={{ fontSize: 13 }}
          />
          <button className="btn btn-primary" onClick={analyzeSite} disabled={loading}>
            {loading ? <><Loader2 size={14} className="anim-spin" /> Analyzing</> : <><RefreshCw size={14} /> Analyze site</>}
          </button>
        </div>
        {error && <div className="alert alert-error" style={{ marginTop: 12 }}>{error}</div>}
        {!apiKey && (
          <Link href="/settings" className="alert alert-warning" style={{ marginTop: 12, display: 'block' }}>
            Add your OpenRouter key in Settings before analyzing a site.
          </Link>
        )}
      </section>

      {profile ? (
        <section className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 850, marginBottom: 6 }}>{profile.companyName || 'Website profile'}</h2>
              {profile.url && (
                <a href={profile.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ac-l)', fontSize: 12 }}>
                  {profile.url} <ExternalLink size={10} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </a>
              )}
            </div>
            <button className="btn btn-danger btn-sm" onClick={clearSite}><Trash2 size={12} /> Clear</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
            <Info label="One-liner" value={profile.oneLiner} />
            <Info label="Category" value={profile.category} />
            <Info label="Audience" value={profile.targetAudience} />
            <Info label="Offer" value={profile.primaryOffer} />
            <Info label="Positioning" value={profile.positioning} />
            <Info label="Tone" value={profile.tone} />
          </div>

          <Block title="Key Benefits" items={profile.keyBenefits} />
          <Block title="Current CTAs" items={profile.currentCtas} />
          <Block title="Content Gaps" items={profile.contentGaps} />

          {profile.importantPages?.length ? (
            <div style={{ marginTop: 18 }}>
              <h3 style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Important Pages</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {profile.importantPages.map((page, i) => (
                  <a key={i} href={page.url} target="_blank" rel="noopener noreferrer" className="badge badge-accent">
                    {page.label || page.url}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : (
        <section className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--t1)' }}>
          No active site yet. Add your website URL and analyze it once.
        </section>
      )}
    </div>
  )
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div style={{ background: 'var(--s2)', border: '1px solid var(--b0)', borderRadius: 10, padding: 12 }}>
      <p style={{ color: 'var(--t2)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</p>
      <p style={{ color: value ? 'var(--t0)' : 'var(--t2)', fontSize: 13, lineHeight: 1.6 }}>{value || 'Not detected'}</p>
    </div>
  )
}

function Block({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null
  return (
    <div style={{ marginTop: 18 }}>
      <h3 style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{title}</h3>
      <ul style={{ display: 'grid', gap: 8 }}>
        {items.map((item, i) => (
          <li key={i} style={{ background: 'var(--s2)', border: '1px solid var(--b0)', borderRadius: 10, padding: 10, color: 'var(--t1)', fontSize: 13 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
