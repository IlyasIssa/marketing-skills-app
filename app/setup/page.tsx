'use client'

import { useState, useEffect } from 'react'
import { Check, BookOpen, ArrowLeft } from 'lucide-react'
import type { ProductContext } from '@/lib/types'
import Link from 'next/link'

const EMPTY: ProductContext = {
  productName: '', oneLiner: '', category: '', businessModel: '',
  targetCompanies: '', decisionMakers: '', primaryUseCase: '', coreProblem: '',
  keyDifferentiators: '', directCompetitors: '', brandTone: '', keyMetrics: '',
}

function buildString(ctx: ProductContext): string {
  return (Object.entries(ctx) as [keyof ProductContext, string][])
    .filter(([, v]) => v?.trim())
    .map(([k, v]) => {
      const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
      return `${label}: ${v}`
    })
    .join('\n')
}

const FIELDS: { id: keyof ProductContext; label: string; type: 'text' | 'textarea'; placeholder: string; hint?: string; section?: string }[] = [
  { id: 'productName',        section: 'Product',     label: 'Product Name',       type: 'text',     placeholder: 'e.g. Acme Analytics' },
  { id: 'oneLiner',           section: 'Product',     label: 'One-liner',          type: 'text',     placeholder: 'What it does and for whom, in one sentence', hint: 'This appears in nearly every generated output' },
  { id: 'category',           section: 'Product',     label: 'Category',           type: 'text',     placeholder: 'e.g. B2B SaaS, analytics, developer tools' },
  { id: 'businessModel',      section: 'Product',     label: 'Business Model',     type: 'text',     placeholder: 'e.g. Subscription, $29/$99/$299/mo, free trial' },
  { id: 'targetCompanies',    section: 'Audience',    label: 'Target Companies',   type: 'text',     placeholder: 'e.g. SaaS companies, 10-200 employees, Series A-B' },
  { id: 'decisionMakers',     section: 'Audience',    label: 'Decision Makers',    type: 'text',     placeholder: 'e.g. Head of Product, VP Growth, Founders' },
  { id: 'primaryUseCase',     section: 'Audience',    label: 'Primary Use Case',   type: 'textarea', placeholder: 'How do customers actually use your product day-to-day?' },
  { id: 'coreProblem',        section: 'Positioning', label: 'Core Problem Solved', type: 'textarea', placeholder: 'What painful problem do you eliminate? Be specific.' },
  { id: 'keyDifferentiators', section: 'Positioning', label: 'Key Differentiators', type: 'textarea', placeholder: 'What makes you different — specific, not "easy to use"' },
  { id: 'directCompetitors',  section: 'Positioning', label: 'Direct Competitors', type: 'text',     placeholder: 'e.g. Mixpanel, Amplitude, PostHog' },
  { id: 'brandTone',          section: 'Voice',       label: 'Brand Tone',         type: 'text',     placeholder: 'e.g. Direct, no-fluff, like a smart engineer explaining to a peer' },
  { id: 'keyMetrics',         section: 'Voice',       label: 'Proof Points',       type: 'textarea', placeholder: 'e.g. 500+ customers, avg 23% churn reduction, G2 4.8/5' },
]

const SECTIONS = ['Product', 'Audience', 'Positioning', 'Voice']

export default function SetupPage() {
  const [ctx, setCtx] = useState<ProductContext>(EMPTY)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const s = localStorage.getItem('marketing_product_context_form')
      if (s) setCtx(JSON.parse(s))
    } catch {}
  }, [])

  function change(id: keyof ProductContext, v: string) { setCtx(p => ({ ...p, [id]: v })) }

  function save() {
    localStorage.setItem('marketing_product_context_form', JSON.stringify(ctx))
    localStorage.setItem('marketing_product_context', buildString(ctx))
    setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

  function clear() {
    setCtx(EMPTY)
    localStorage.removeItem('marketing_product_context_form')
    localStorage.removeItem('marketing_product_context')
  }

  const filled = Object.values(ctx).filter(v => v?.trim()).length

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Header */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 32 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 'var(--r-xl)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
        }}>
          <BookOpen size={20} style={{ color: 'var(--ac-l)' }} />
        </div>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6, letterSpacing: '-0.02em' }}>Product Context</h1>
          <p style={{ fontSize: 13, color: 'var(--t1)', lineHeight: 1.6 }}>
            Fill this in once. Every feature automatically uses it — so the AI writes specifically about your product, not generically.
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="card" style={{ padding: 20, marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>Completeness</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ac-l)' }}>{filled} / {FIELDS.length}</span>
        </div>
        <div style={{ height: 6, borderRadius: 'var(--r-full)', background: 'var(--s2)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 'var(--r-full)', transition: 'width 0.4s ease',
            width: `${(filled / FIELDS.length) * 100}%`,
            background: 'linear-gradient(90deg, var(--ac), var(--ac-l))',
            boxShadow: filled > 0 ? '0 0 8px rgba(167,139,250,0.4)' : 'none',
          }} />
        </div>
        <p style={{ fontSize: 11, color: 'var(--t2)', marginTop: 8 }}>
          {filled === 0 && 'Start with product name and one-liner'}
          {filled > 0 && filled < 6 && 'More context = better, more specific output'}
          {filled >= 6 && filled < FIELDS.length && 'Looking good — finish the remaining fields'}
          {filled === FIELDS.length && '✓ Context is complete'}
        </p>
      </div>

      {/* Sections */}
      {SECTIONS.map(section => {
        const sectionFields = FIELDS.filter(f => f.section === section)
        return (
          <div key={section} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 12 }}>
              {section}
            </h2>
            <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {sectionFields.map(f => (
                <div key={f.id}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t0)' }}>{f.label}</span>
                    {ctx[f.id]?.trim() && (
                      <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={9} style={{ color: 'var(--green)' }} />
                      </span>
                    )}
                  </label>
                  {f.hint && <p style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 6 }}>{f.hint}</p>}
                  {f.type === 'text'
                    ? <input className="input" value={ctx[f.id]} onChange={e => change(f.id, e.target.value)} placeholder={f.placeholder} style={{ fontSize: 13 }} />
                    : <textarea className="input" value={ctx[f.id]} onChange={e => change(f.id, e.target.value)} placeholder={f.placeholder} rows={3} style={{ fontSize: 13 }} />
                  }
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, paddingTop: 8, borderTop: '1px solid var(--b0)' }}>
        <button
          onClick={save}
          className="btn btn-primary"
          style={{
            flex: 1, fontSize: 13,
            ...(saved ? { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: 'var(--green)', boxShadow: 'none' } : {}),
          }}
        >
          {saved ? <><Check size={14} /> Saved!</> : 'Save context'}
        </button>
        <button className="btn btn-secondary" onClick={clear} style={{ fontSize: 13 }}>Clear</button>
        <Link href="/" className="btn btn-ghost" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={13} /> Back
        </Link>
      </div>
    </div>
  )
}
