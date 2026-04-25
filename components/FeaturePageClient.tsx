'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Loader2, Copy, Check, Trash2, ChevronDown, Sparkles, Square, ArrowRight, AlertCircle, KeyRound, Globe2, Search } from 'lucide-react'
import type { Feature } from '@/lib/types'
import { getFeatureBySlug } from '@/lib/features'
import { supportsStructuredOutput, withStructuredOutputInstructions } from '@/lib/structuredOutputs'
import { CATEGORY_COLORS } from '@/components/FeatureCard'
import StructuredFeatureOutput, { parseStructuredObject } from '@/components/StructuredFeatureOutput'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

type SiteQuestion = {
  id: string
  question: string
  why?: string
}

type SiteAnalysis = {
  url: string
  summary: string
  profile?: SiteProfile
  suggestedValues?: Record<string, string>
  questions?: SiteQuestion[]
}

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

type Artifact = {
  id: string
  slug: string
  title: string
  format: 'structured' | 'markdown'
  output: string
  createdAt: string
  siteUrl?: string
}

type ResearchData = {
  type: 'serp' | 'trends'
  query: string
  count: number
  items: unknown[]
  createdAt: string
}

function useLS<T>(key: string, init: T) {
  const [val, setVal] = useState<T>(init)
  useEffect(() => {
    try { const s = localStorage.getItem(key); if (s) setVal(JSON.parse(s)) } catch {}
  }, [key])
  const set = useCallback((v: T) => {
    setVal(v)
    try { localStorage.setItem(key, JSON.stringify(v)) } catch {}
  }, [key])
  return [val, set] as const
}

export default function FeaturePageClient({ slug }: { slug: string }) {
  const searchParams = useSearchParams()
  const feature = getFeatureBySlug(slug) as Feature
  if (!feature) return null

  const [vals, setVals] = useState<Record<string, string>>({})
  const [output, setOutput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [siteUrl, setSiteUrl] = useState('')
  const [siteAnalysis, setSiteAnalysis] = useState<SiteAnalysis | null>(null)
  const [siteProfile, setSiteProfile] = useLS<SiteProfile | null>('marketing_site_profile', null)
  const [siteAnswers, setSiteAnswers] = useState<Record<string, string>>({})
  const [siteAnalyzing, setSiteAnalyzing] = useState(false)
  const [workflowArtifact, setWorkflowArtifact] = useState<Artifact | null>(null)
  const [apiKey] = useLS<string>('marketing_api_key', '')
  const [apifyToken] = useLS<string>('marketing_apify_token', '')
  const [researchType, setResearchType] = useState<'serp' | 'trends'>('serp')
  const [researchQuery, setResearchQuery] = useState('')
  const [generatedResearchQueries, setGeneratedResearchQueries] = useState<string[]>([])
  const [researchReasoning, setResearchReasoning] = useState('')
  const [researchData, setResearchData] = useState<ResearchData | null>(null)
  const [researching, setResearching] = useState(false)
  const [model] = useLS<string>('marketing_model', 'openai/gpt-5.5')
  const [ctx] = useLS<string>('marketing_product_context', '')
  const outRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const color = CATEGORY_COLORS[feature.category] ?? '#7c3aed'
  const hasKey = Boolean(apiKey?.trim())
  const hasCtx = Boolean(ctx?.trim())

  useEffect(() => {
    const artifactId = searchParams.get('artifact')
    if (!artifactId) {
      setWorkflowArtifact(null)
      return
    }
    try {
      const raw = localStorage.getItem('marketing_artifacts')
      const artifacts = raw ? JSON.parse(raw) as Artifact[] : []
      setWorkflowArtifact(artifacts.find(a => a.id === artifactId) || null)
    } catch {
      setWorkflowArtifact(null)
    }
  }, [searchParams])

  useEffect(() => {
    if (siteProfile?.url && !siteUrl) setSiteUrl(siteProfile.url)
  }, [siteProfile, siteUrl])

  useEffect(() => {
    const nextType = searchParams.get('researchType')
    const nextQuery = searchParams.get('researchQuery')
    if (nextType === 'serp' || nextType === 'trends') setResearchType(nextType)
    if (nextQuery && !researchQuery) setResearchQuery(nextQuery)
  }, [searchParams, researchQuery])

  function set(id: string, v: string) { setVals(p => ({ ...p, [id]: v })) }

  function toggle(id: string, v: string) {
    const cur = (vals[id] || '').split(',').map(s => s.trim()).filter(Boolean)
    const next = cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]
    set(id, next.join(', '))
  }

  async function analyzeSite() {
    if (!apiKey) { setError('Add your OpenRouter API key in Settings first.'); return }
    if (!siteUrl.trim()) { setError('Enter a website URL first.'); return }
    setError('')
    setSiteAnalyzing(true)
    setSiteAnalysis(null)
    setSiteAnswers({})
    try {
      const res = await fetch('/api/analyze-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: siteUrl,
          apiKey,
          model,
          featureTitle: feature.title,
          featureTagline: feature.tagline,
          fields: feature.fields,
          productContext: ctx || '',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to analyze site')
      setSiteAnalysis(data)
      if (data.profile) {
        setSiteProfile({ ...data.profile, url: data.url, updatedAt: new Date().toISOString() })
      }
      setVals(prev => {
        const next = { ...prev }
        for (const [key, value] of Object.entries(data.suggestedValues || {})) {
          if (!next[key]?.trim() && typeof value === 'string') next[key] = value
        }
        return next
      })
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message)
      else setError('Failed to analyze site')
    } finally {
      setSiteAnalyzing(false)
    }
  }

  async function runResearch() {
    if (!apifyToken) { setError('Add your Apify API token in Settings first.'); return }
    if (!researchQuery.trim()) { setError('Enter a SERP or Trends query first.'); return }
    if (!apiKey) { setError('Add your OpenRouter API key in Settings first.'); return }
    setError('')
    setResearching(true)
    setResearchData(null)
    try {
      const queryRes = await fetch('/api/research-queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          model,
          researchType,
          queryHint: researchQuery,
          featureTitle: feature.title,
          featureGoal: feature.tagline,
          siteProfile,
        }),
      })
      const queryData = await queryRes.json()
      if (!queryRes.ok) throw new Error(queryData.error || 'Failed to generate relevant research queries')
      const concreteQueries = Array.isArray(queryData.queries) ? queryData.queries.filter(Boolean).slice(0, 5) : []
      if (!concreteQueries.length) throw new Error('No relevant research queries were generated')
      setGeneratedResearchQueries(concreteQueries)
      setResearchReasoning(queryData.reasoning || '')

      const res = await fetch('/api/apify-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: researchType,
          query: concreteQueries.join('\n'),
          token: apifyToken,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to run Apify research')
      setResearchData(data)
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message)
      else setError('Failed to run Apify research')
    } finally {
      setResearching(false)
    }
  }

  function formatSiteProfile(profile: SiteProfile | null): string {
    if (!profile) return ''
    return [
      profile.url ? `Website: ${profile.url}` : '',
      profile.companyName ? `Company: ${profile.companyName}` : '',
      profile.oneLiner ? `One-liner: ${profile.oneLiner}` : '',
      profile.category ? `Category: ${profile.category}` : '',
      profile.targetAudience ? `Target audience: ${profile.targetAudience}` : '',
      profile.primaryOffer ? `Primary offer: ${profile.primaryOffer}` : '',
      profile.keyBenefits?.length ? `Key benefits: ${profile.keyBenefits.join('; ')}` : '',
      profile.positioning ? `Positioning: ${profile.positioning}` : '',
      profile.tone ? `Tone: ${profile.tone}` : '',
      profile.currentCtas?.length ? `Current CTAs: ${profile.currentCtas.join(', ')}` : '',
      profile.contentGaps?.length ? `Content gaps: ${profile.contentGaps.join('; ')}` : '',
    ].filter(Boolean).join('\n')
  }

  function saveArtifact(finalOutput = output) {
    if (!finalOutput.trim()) return
    const artifact: Artifact = {
      id: crypto.randomUUID(),
      slug: feature.slug,
      title: feature.title,
      format: supportsStructuredOutput(feature.slug) && Boolean(parseStructuredObject(finalOutput)) ? 'structured' : 'markdown',
      output: finalOutput,
      createdAt: new Date().toISOString(),
      siteUrl: siteAnalysis?.url || siteProfile?.url,
    }
    try {
      const raw = localStorage.getItem('marketing_artifacts')
      const existing = raw ? JSON.parse(raw) as Artifact[] : []
      localStorage.setItem('marketing_artifacts', JSON.stringify([artifact, ...existing].slice(0, 50)))
    } catch {}
  }

  async function generate() {
    if (!apiKey) { setError('Add your OpenRouter API key in Settings first.'); return }
    const missing = feature.fields.filter(f => f.required && !vals[f.id]?.trim()).map(f => f.label)
    if (missing.length) { setError(`Fill in: ${missing.join(', ')}`); return }
    setError(''); setOutput(''); setStreaming(true)
    abortRef.current = new AbortController()
    try {
      const siteContext = siteAnalysis ? [
        `Analyzed website: ${siteAnalysis.url}`,
        `Website summary: ${siteAnalysis.summary}`,
        Object.entries(siteAnswers)
          .filter(([, answer]) => answer.trim())
          .map(([id, answer]) => {
            const question = siteAnalysis.questions?.find(q => q.id === id)?.question || id
            return `Clarification - ${question}: ${answer}`
          })
          .join('\n'),
      ].filter(Boolean).join('\n') : ''
      const profileContext = formatSiteProfile(siteProfile)
      const combinedContext = [ctx || '', profileContext ? `Saved site profile:\n${profileContext}` : '', siteContext].filter(Boolean).join('\n\n')
      const artifactContext = workflowArtifact ? `Workflow input artifact from ${workflowArtifact.title}:\n${workflowArtifact.output}` : ''
      const researchContext = researchData ? `External research from Apify (${researchData.type}) for query "${researchData.query}":\n${JSON.stringify(researchData.items, null, 2)}` : ''
      const fullContext = [combinedContext, artifactContext, researchContext].filter(Boolean).join('\n\n')
      const userPrompt = withStructuredOutputInstructions(feature.slug, feature.buildPrompt(vals, fullContext))
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: feature.systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          apiKey, model,
        }),
        signal: abortRef.current.signal,
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed') }
      const reader = res.body!.getReader()
      const dec = new TextDecoder()
      let buf = ''
      let fullOutput = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const lines = buf.split('\n'); buf = lines.pop() || ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const d = line.slice(6).trim()
          if (d === '[DONE]') continue
          try {
            const delta = JSON.parse(d)?.choices?.[0]?.delta?.content
            if (delta) {
              fullOutput += delta
              setOutput(p => p + delta)
              if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight
            }
          } catch {}
        }
      }
      saveArtifact(fullOutput)
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== 'AbortError') setError(e.message || 'Something went wrong')
    } finally { setStreaming(false) }
  }

  async function copy() {
    await navigator.clipboard.writeText(output)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const filled = feature.fields.filter(f => f.required).every(f => vals[f.id]?.trim())
  const showStructuredOutput = supportsStructuredOutput(feature.slug) && Boolean(output) && !streaming && Boolean(parseStructuredObject(output))

  return (
    <div className="feature-shell">

      {/* ─── LEFT: FORM ─── */}
      <aside className="feature-sidebar">
        {/* Feature header */}
        <header className="feature-sidebar-header">
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 42, height: 42, borderRadius: 8, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
              background: `${color}14`, border: `1px solid ${color}28`,
            }}>
              {feature.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontWeight: 800, fontSize: 15, marginBottom: 3, color: 'var(--t0)', letterSpacing: '-0.01em' }}>{feature.title}</h1>
              <p style={{ fontSize: 12, color: 'var(--t1)', lineHeight: 1.5 }}>{feature.tagline}</p>
            </div>
          </div>
        </header>

        {/* Scrollable fields */}
        <div className="feature-sidebar-scroll">

          {/* Banners */}
          {!hasKey && (
            <Link href="/settings">
              <div className="alert alert-warning" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                <KeyRound size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p style={{ fontWeight: 600, marginBottom: 2 }}>API key required</p>
                  <p style={{ opacity: 0.8 }}>Go to Settings → add your OpenRouter key</p>
                </div>
                <ArrowRight size={13} style={{ flexShrink: 0, marginLeft: 'auto', marginTop: 1 }} />
              </div>
            </Link>
          )}

          {!hasCtx && (
            <Link href="/setup">
              <div className="alert alert-info" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p style={{ fontWeight: 600, marginBottom: 2 }}>No product context</p>
                  <p style={{ opacity: 0.8 }}>Set it once — used by all features</p>
                </div>
                <ArrowRight size={13} style={{ flexShrink: 0, marginLeft: 'auto', marginTop: 1 }} />
              </div>
            </Link>
          )}

          <div className="feature-tool-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe2 size={14} style={{ color: 'var(--ac-l)' }} />
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--t0)' }}>Analyze website</p>
                <p style={{ fontSize: 11, color: 'var(--t2)' }}>Your active site powers this feature. Re-analyze if needed.</p>
              </div>
            </div>
            <input
              className="input"
              value={siteUrl}
              onChange={e => setSiteUrl(e.target.value)}
              placeholder={siteProfile?.url || 'https://example.com'}
              style={{ fontSize: 13 }}
            />
            <button
              className="btn btn-secondary btn-sm"
              onClick={analyzeSite}
              disabled={siteAnalyzing || !siteUrl.trim()}
              style={{ justifyContent: 'center' }}
            >
              {siteAnalyzing ? <><Loader2 size={12} className="anim-spin" /> Analyzing...</> : <><Sparkles size={12} /> Analyze and fill fields</>}
            </button>

            {siteAnalysis && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--b0)', paddingTop: 10 }}>
                <div className="alert alert-success">
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>Site context ready</p>
                  <p>{siteAnalysis.summary}</p>
                </div>
                {siteAnalysis.questions?.map(q => (
                  <div key={q.id}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t0)', marginBottom: 5 }}>
                      {q.question}
                    </label>
                    {q.why && <p style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 6 }}>{q.why}</p>}
                    <textarea
                      className="input"
                      rows={2}
                      value={siteAnswers[q.id] || ''}
                      onChange={e => setSiteAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder="Answer if relevant..."
                      style={{ fontSize: 13 }}
                    />
                  </div>
                ))}
              </div>
            )}

            {siteProfile && !siteAnalysis && (
              <div className="alert alert-info">
                <p style={{ fontWeight: 700, marginBottom: 4 }}>Saved site profile active</p>
                <p>{siteProfile.companyName || siteProfile.url}</p>
                {siteProfile.oneLiner && <p style={{ marginTop: 4, opacity: 0.85 }}>{siteProfile.oneLiner}</p>}
              </div>
            )}

          {siteProfile && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setSiteProfile(null)}
                style={{ justifyContent: 'center', color: 'var(--t2)' }}
              >
                Clear saved site profile
              </button>
            )}
          </div>

          {workflowArtifact && (
            <div className="feature-tool-card" style={{ gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--t0)' }}>Workflow input</p>
                  <p style={{ fontSize: 11, color: 'var(--t2)' }}>{workflowArtifact.title} · {new Date(workflowArtifact.createdAt).toLocaleDateString()}</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setWorkflowArtifact(null)}>Remove</button>
              </div>
              <pre style={{
                maxHeight: 110,
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                background: 'var(--s2)',
                border: '1px solid var(--b0)',
                borderRadius: 8,
                padding: 10,
                color: 'var(--t1)',
                fontSize: 11,
                lineHeight: 1.5,
              }}>
                {workflowArtifact.output.slice(0, 1200)}
              </pre>
            </div>
          )}

          <div className="feature-tool-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Search size={14} style={{ color: 'var(--ac-l)' }} />
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--t0)' }}>Apify research</p>
                <p style={{ fontSize: 11, color: 'var(--t2)' }}>
                  {searchParams.get('researchQuery') ? 'Recommended by this workflow. Run it before generating.' : 'Pull Google SERP or Trends data into this generation.'}
                </p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <button
                type="button"
                className={researchType === 'serp' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                onClick={() => setResearchType('serp')}
              >
                SERP
              </button>
              <button
                type="button"
                className={researchType === 'trends' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                onClick={() => setResearchType('trends')}
              >
                Trends
              </button>
            </div>
            <textarea
              className="input"
              value={researchQuery}
              onChange={e => setResearchQuery(e.target.value)}
              placeholder={researchType === 'serp' ? 'best crm for startups\ncrm alternatives' : 'crm software\nsales automation'}
              rows={2}
              style={{ fontSize: 13 }}
            />
            <button
              className="btn btn-secondary btn-sm"
              onClick={runResearch}
              disabled={researching || !researchQuery.trim()}
              style={{ justifyContent: 'center' }}
            >
              {researching ? <><Loader2 size={12} className="anim-spin" /> Building queries...</> : <><Search size={12} /> Generate relevant queries + research</>}
            </button>
            {!apifyToken && (
              <Link href="/settings" className="alert alert-warning" style={{ display: 'block', cursor: 'pointer' }}>
                Add Apify token in Settings to enable SERP and Trends research.
              </Link>
            )}
            {researchData && (
              <div className="alert alert-success">
                <p style={{ fontWeight: 700, marginBottom: 4 }}>{researchData.type.toUpperCase()} research ready · {researchData.count} items</p>
                <p style={{ opacity: 0.85 }}>{researchData.query}</p>
              </div>
            )}
            {generatedResearchQueries.length > 0 && (
              <div style={{ background: 'var(--s2)', border: '1px solid var(--b0)', borderRadius: 8, padding: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t0)', marginBottom: 6 }}>Generated site-relevant queries</p>
                <ul style={{ display: 'grid', gap: 5 }}>
                  {generatedResearchQueries.map((query, i) => (
                    <li key={i} style={{ color: 'var(--t1)', fontSize: 11, lineHeight: 1.4 }}>{query}</li>
                  ))}
                </ul>
                {researchReasoning && <p style={{ color: 'var(--t2)', fontSize: 11, lineHeight: 1.45, marginTop: 8 }}>{researchReasoning}</p>}
              </div>
            )}
          </div>

          {/* Form fields */}
          {feature.fields.map(f => (
            <div key={f.id}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t0)' }}>{f.label}</span>
                {f.required && (
                  <span className="badge" style={{ fontSize: 10, padding: '2px 6px', background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}>
                    required
                  </span>
                )}
              </label>
              {f.hint && <p style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 6 }}>{f.hint}</p>}

              {f.type === 'text' && (
                <input className="input" value={vals[f.id] || ''} onChange={e => set(f.id, e.target.value)} placeholder={f.placeholder} style={{ fontSize: 13 }} />
              )}

              {f.type === 'textarea' && (
                <textarea className="input" value={vals[f.id] || ''} onChange={e => set(f.id, e.target.value)} placeholder={f.placeholder} rows={f.rows || 3} style={{ fontSize: 13 }} />
              )}

              {f.type === 'select' && (
                <div style={{ position: 'relative' }}>
                  <select
                    className="input"
                    value={vals[f.id] || ''}
                    onChange={e => set(f.id, e.target.value)}
                    style={{ paddingRight: 32, cursor: 'pointer', fontSize: 13, color: vals[f.id] ? 'var(--t0)' : 'var(--t2)' }}
                  >
                    <option value="" style={{ background: 'var(--s2)', color: 'var(--t1)' }}>Select…</option>
                    {f.options?.map(o => (
                      <option key={o.value} value={o.value} style={{ background: 'var(--s2)', color: 'var(--t0)' }}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--t2)', pointerEvents: 'none' }} />
                </div>
              )}

              {f.type === 'radio' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {f.options?.map(o => {
                    const on = vals[f.id] === o.value
                    return (
                      <label
                        key={o.value}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '9px 12px', borderRadius: 'var(--r-lg)', cursor: 'pointer',
                          background: on ? 'rgba(79,140,255,0.12)' : 'var(--s2)',
                          border: `1px solid ${on ? 'rgba(79,140,255,0.32)' : 'var(--b0)'}`,
                          transition: 'all var(--ease)',
                        }}
                      >
                        <input type="radio" name={f.id} value={o.value} checked={on} onChange={() => set(f.id, o.value)} style={{ display: 'none' }} />
                        <div style={{
                          width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                          border: `2px solid ${on ? 'var(--ac)' : 'var(--b1)'}`,
                          background: on ? 'var(--ac)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all var(--ease)',
                        }}>
                          {on && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                        </div>
                        <span style={{ fontSize: 13, color: on ? 'var(--t0)' : 'var(--t1)' }}>{o.label}</span>
                      </label>
                    )
                  })}
                </div>
              )}

              {f.type === 'multiselect' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {f.options?.map(o => {
                    const on = (vals[f.id] || '').includes(o.value)
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => toggle(f.id, o.value)}
                        className="badge"
                        style={{
                          cursor: 'pointer',
                          background: on ? 'rgba(79,140,255,0.14)' : 'var(--s2)',
                          borderColor: on ? 'rgba(79,140,255,0.34)' : 'var(--b0)',
                          color: on ? 'var(--ac-l)' : 'var(--t1)',
                          transition: 'all var(--ease)',
                          fontSize: 12,
                        }}
                      >
                        {on && '✓ '}{o.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}

          {error && (
            <div className="alert alert-error" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <AlertCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}
        </div>

        {/* Generate button — pinned */}
        <footer style={{ padding: '12px 18px 16px', borderTop: '1px solid var(--b0)', flexShrink: 0, background: 'var(--s0)' }}>
          <button
            onClick={streaming ? () => { abortRef.current?.abort(); setStreaming(false) } : generate}
            disabled={!streaming && !filled}
            className={streaming ? 'btn btn-danger' : filled ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ width: '100%', fontSize: 13, padding: '11px 16px' }}
          >
            {streaming
              ? <><Square size={13} /> Stop generating</>
              : <><Sparkles size={14} /> Generate</>
            }
          </button>
        </footer>
      </aside>

      {/* ─── RIGHT: OUTPUT ─── */}
      <main className="feature-output">

        {/* Toolbar */}
        {(output || streaming) && (
          <div className="feature-output-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {streaming ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ac-l)' }}>
                  <Loader2 size={12} className="anim-spin" /> Generating…
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--green)' }}>
                  <span className="dot dot-green" />Done
                </span>
              )}
            </div>
            <div className="feature-output-toolbar-actions">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setOutput(''); setError('') }}
                style={{ display: 'flex', alignItems: 'center', gap: 5 }}
              >
                <Trash2 size={12} /> Clear
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={copy}
                style={{ display: 'flex', alignItems: 'center', gap: 5, color: copied ? 'var(--green)' : 'var(--t1)' }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              {!streaming && output && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => saveArtifact(output)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                >
                  <Check size={12} /> Save artifact
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div ref={outRef} className="feature-output-body">

          {/* Empty state */}
          {!output && !streaming && (
            <div className="feature-empty">
              <div className="feature-empty-card">
              {/* Icon with glow */}
              <div className="feature-empty-icon">
                <div style={{
                  width: 68, height: 68, borderRadius: 12, fontSize: 34,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--s1)', border: '1px solid var(--b0)',
                }}>
                  {feature.icon}
                </div>
                <div style={{
                  position: 'absolute', inset: -16, borderRadius: 36, zIndex: -1,
                  background: `radial-gradient(ellipse, ${color}12 0%, transparent 70%)`,
                  filter: 'blur(8px)',
                }} />
              </div>

              <div style={{ maxWidth: 320, margin: '20px auto 0' }}>
                <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{feature.title}</p>
                <p style={{ fontSize: 13, color: 'var(--t1)', lineHeight: 1.6 }}>
                  Fill in the form and click{' '}
                  <span style={{ color: 'var(--ac-l)', fontWeight: 500 }}>Generate</span>{' '}
                  to get your output
                </p>
              </div>

              {/* Status indicators */}
              <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--t2)', justifyContent: 'center', marginTop: 18, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span className={`dot ${hasKey ? 'dot-green' : 'dot-muted'}`} />
                  {hasKey ? 'API key ready' : 'No API key'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span className={`dot ${hasCtx ? 'dot-green' : 'dot-muted'}`} />
                  {hasCtx ? 'Context loaded' : 'No context'}
                </span>
              </div>
              </div>
            </div>
          )}

          {/* Markdown output */}
          {showStructuredOutput && (
            <StructuredFeatureOutput slug={feature.slug} output={output} />
          )}

          {(output || streaming) && !showStructuredOutput && (
            <div className="anim-in feature-document">
              <div className="prose">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ className, children, ...props }) {
                      const block = className?.includes('language-')
                      if (block) return (
                        <pre style={{ background: '#06060f', border: '1px solid var(--b0)', borderRadius: 10, padding: 16, overflowX: 'auto', margin: '16px 0' }}>
                          <code style={{ color: '#c8d3f5', fontFamily: 'monospace', fontSize: 13 }} {...props}>{children}</code>
                        </pre>
                      )
                      return (
                        <code style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 5, padding: '1px 6px', fontSize: '0.85em', color: 'var(--ac-l)', fontFamily: 'monospace' }} {...props}>
                          {children}
                        </code>
                      )
                    },
                  }}
                >
                  {output}
                </ReactMarkdown>
                {streaming && <span className="cursor" />}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
