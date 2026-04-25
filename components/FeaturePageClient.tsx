'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Loader2, Copy, Check, Trash2, ChevronDown, Sparkles, Square, ArrowRight, AlertCircle, KeyRound } from 'lucide-react'
import type { Feature } from '@/lib/types'
import { getFeatureBySlug } from '@/lib/features'
import { CATEGORY_COLORS } from '@/components/FeatureCard'
import Link from 'next/link'

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
  const feature = getFeatureBySlug(slug) as Feature
  if (!feature) return null

  const [vals, setVals] = useState<Record<string, string>>({})
  const [output, setOutput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [apiKey] = useLS<string>('marketing_api_key', '')
  const [model] = useLS<string>('marketing_model', 'anthropic/claude-sonnet-4-5')
  const [ctx] = useLS<string>('marketing_product_context', '')
  const outRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const color = CATEGORY_COLORS[feature.category] ?? '#7c3aed'
  const hasKey = Boolean(apiKey?.trim())
  const hasCtx = Boolean(ctx?.trim())

  function set(id: string, v: string) { setVals(p => ({ ...p, [id]: v })) }

  function toggle(id: string, v: string) {
    const cur = (vals[id] || '').split(',').map(s => s.trim()).filter(Boolean)
    const next = cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]
    set(id, next.join(', '))
  }

  async function generate() {
    if (!apiKey) { setError('Add your OpenRouter API key in Settings first.'); return }
    const missing = feature.fields.filter(f => f.required && !vals[f.id]?.trim()).map(f => f.label)
    if (missing.length) { setError(`Fill in: ${missing.join(', ')}`); return }
    setError(''); setOutput(''); setStreaming(true)
    abortRef.current = new AbortController()
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: feature.systemPrompt },
            { role: 'user', content: feature.buildPrompt(vals, ctx || '') },
          ],
          apiKey, model,
        }),
        signal: abortRef.current.signal,
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed') }
      const reader = res.body!.getReader()
      const dec = new TextDecoder()
      let buf = ''
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
            if (delta) { setOutput(p => p + delta); if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight }
          } catch {}
        }
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== 'AbortError') setError(e.message || 'Something went wrong')
    } finally { setStreaming(false) }
  }

  async function copy() {
    await navigator.clipboard.writeText(output)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const filled = feature.fields.filter(f => f.required).every(f => vals[f.id]?.trim())

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 57px)', overflow: 'hidden' }}>

      {/* ─── LEFT: FORM ─── */}
      <aside
        style={{
          width: 400, flexShrink: 0, display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--b0)', background: 'var(--s0)', overflow: 'hidden',
        }}
      >
        {/* Feature header */}
        <header style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--b0)', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--r-xl)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
              background: `${color}14`, border: `1px solid ${color}28`,
            }}>
              {feature.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontWeight: 700, fontSize: 15, marginBottom: 3, color: 'var(--t0)' }}>{feature.title}</h1>
              <p style={{ fontSize: 12, color: 'var(--t1)', lineHeight: 1.5 }}>{feature.tagline}</p>
            </div>
          </div>
        </header>

        {/* Scrollable fields */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

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
                          background: on ? 'rgba(124,58,237,0.1)' : 'var(--s2)',
                          border: `1px solid ${on ? 'rgba(124,58,237,0.3)' : 'var(--b0)'}`,
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
                          background: on ? 'rgba(124,58,237,0.15)' : 'var(--s2)',
                          borderColor: on ? 'rgba(124,58,237,0.35)' : 'var(--b0)',
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
        <footer style={{ padding: '12px 20px 16px', borderTop: '1px solid var(--b0)', flexShrink: 0 }}>
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
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>

        {/* Toolbar */}
        {(output || streaming) && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 20px', borderBottom: '1px solid var(--b0)', background: 'var(--s0)', flexShrink: 0,
          }}>
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
            <div style={{ display: 'flex', gap: 6 }}>
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
            </div>
          </div>
        )}

        {/* Content */}
        <div ref={outRef} style={{ flex: 1, overflowY: 'auto' }}>

          {/* Empty state */}
          {!output && !streaming && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 32, textAlign: 'center' }}>
              {/* Icon with glow */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 20, fontSize: 36,
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

              <div style={{ maxWidth: 280 }}>
                <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{feature.title}</p>
                <p style={{ fontSize: 13, color: 'var(--t1)', lineHeight: 1.6 }}>
                  Fill in the form and click{' '}
                  <span style={{ color: 'var(--ac-l)', fontWeight: 500 }}>Generate</span>{' '}
                  to get your output
                </p>
              </div>

              {/* Status indicators */}
              <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--t2)' }}>
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
          )}

          {/* Markdown output */}
          {(output || streaming) && (
            <div className="anim-in" style={{ padding: '28px 32px', maxWidth: 800 }}>
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
