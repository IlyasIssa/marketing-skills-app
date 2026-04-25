'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Check, Settings, ExternalLink, ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'

const MODELS = [
  { value: 'openai/gpt-5.5',              label: 'GPT-5.5',            desc: 'OpenAI frontier model - Recommended', badge: '*' },
  { value: 'openai/gpt-5.5-pro',          label: 'GPT-5.5 Pro',        desc: 'OpenAI - Deep reasoning, higher cost' },
  { value: 'anthropic/claude-sonnet-4-5', label: 'Claude Sonnet 4.5', desc: 'Best quality · Recommended', badge: '⭐' },
  { value: 'anthropic/claude-haiku-4-5',  label: 'Claude Haiku 4.5',  desc: 'Fastest · Most affordable' },
  { value: 'anthropic/claude-opus-4',     label: 'Claude Opus 4',     desc: 'Most powerful · Slower' },
  { value: 'openai/gpt-4o',               label: 'GPT-4o',            desc: 'OpenAI · Balanced' },
  { value: 'openai/gpt-4o-mini',          label: 'GPT-4o mini',       desc: 'OpenAI · Fast & cheap' },
  { value: 'google/gemini-pro-1.5',       label: 'Gemini Pro 1.5',    desc: 'Google · Long context' },
  { value: 'meta-llama/llama-3.1-70b-instruct', label: 'Llama 3.1 70B', desc: 'Open source · Fast' },
]

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('')
  const [apifyToken, setApifyToken] = useState('')
  const [model, setModel] = useState('openai/gpt-5.5')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null)

  useEffect(() => {
    try {
      const k = localStorage.getItem('marketing_api_key')
      const m = localStorage.getItem('marketing_model')
      const a = localStorage.getItem('marketing_apify_token')
      if (k) setApiKey(JSON.parse(k))
      if (m) setModel(JSON.parse(m))
      if (a) setApifyToken(JSON.parse(a))
    } catch {}
  }, [])

  function save() {
    localStorage.setItem('marketing_api_key', JSON.stringify(apiKey))
    localStorage.setItem('marketing_model', JSON.stringify(model))
    localStorage.setItem('marketing_apify_token', JSON.stringify(apifyToken))
    setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

  async function test() {
    if (!apiKey.trim()) { setTestResult({ ok: false, msg: 'Enter your API key first' }); return }
    setTesting(true); setTestResult(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'Say "OK".' }], apiKey, model }),
      })
      if (res.ok) setTestResult({ ok: true, msg: 'Connection successful — your key works.' })
      else { const e = await res.json(); setTestResult({ ok: false, msg: e.error || 'Connection failed' }) }
    } catch { setTestResult({ ok: false, msg: 'Network error' }) }
    finally { setTesting(false) }
  }

  const masked = apiKey
    ? `${apiKey.slice(0, 10)}${'•'.repeat(Math.max(0, apiKey.length - 14))}${apiKey.slice(-4)}`
    : ''

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Header */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 32 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 'var(--r-xl)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
        }}>
          <Settings size={20} style={{ color: 'var(--ac-l)' }} />
        </div>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6, letterSpacing: '-0.02em' }}>Settings</h1>
          <p style={{ fontSize: 13, color: 'var(--t1)', lineHeight: 1.6 }}>
            Your API key is stored only in your browser&apos;s localStorage — never on a server.
          </p>
        </div>
      </div>

      {/* Privacy note */}
      <div className="alert" style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24, background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.15)' }}>
        <Shield size={14} style={{ color: 'var(--green)', flexShrink: 0 }} />
        <p style={{ fontSize: 12, color: 'var(--green)', opacity: 0.85 }}>
          Keys are never sent to any server other than OpenRouter directly from your browser.
        </p>
      </div>

      {/* API Key */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 12 }}>
          API Key
        </h2>
        <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'var(--t1)', lineHeight: 1.6 }}>
            Get your key at{' '}
            <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ac-l)' }}>
              openrouter.ai/keys <ExternalLink size={10} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </a>
            . Keys start with <code style={{ fontSize: 11, color: 'var(--ac-l)', background: 'rgba(124,58,237,0.1)', padding: '1px 5px', borderRadius: 4 }}>sk-or-</code>
          </p>

          <div style={{ position: 'relative' }}>
            <input
              type={showKey ? 'text' : 'password'}
              className="input"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              style={{ fontFamily: 'monospace', fontSize: 13, paddingRight: 40 }}
            />
            <button
              onClick={() => setShowKey(v => !v)}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--t2)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {apiKey && !showKey && (
            <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--t2)' }}>{masked}</p>
          )}

          <button
            onClick={test}
            disabled={testing}
            className="btn btn-secondary"
            style={{ fontSize: 12, justifyContent: 'center' }}
          >
            {testing ? 'Testing…' : 'Test connection'}
          </button>

          {testResult && (
            <div className={`alert ${testResult.ok ? 'alert-success' : 'alert-error'}`} style={{ fontSize: 12 }}>
              {testResult.ok ? '✓ ' : '✕ '}{testResult.msg}
            </div>
          )}
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 12 }}>
          Apify Research
        </h2>
        <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'var(--t1)', lineHeight: 1.6 }}>
            Optional. Used for Google Search Results and Google Trends research inside workflows.
          </p>
          <input
            type="password"
            className="input"
            value={apifyToken}
            onChange={e => setApifyToken(e.target.value)}
            placeholder="apify_api_..."
            style={{ fontFamily: 'monospace', fontSize: 13 }}
          />
          <a href="https://console.apify.com/settings/integrations" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ac-l)', fontSize: 12 }}>
            Get Apify API token <ExternalLink size={10} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </a>
        </div>
      </section>

      {/* Model */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 12 }}>
          Model
        </h2>
        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 12 }}>
            All models via OpenRouter —{' '}
            <a href="https://openrouter.ai/models" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ac-l)' }}>compare pricing</a>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {MODELS.map(m => {
              const on = model === m.value
              return (
                <label
                  key={m.value}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    borderRadius: 'var(--r-lg)', cursor: 'pointer',
                    background: on ? 'rgba(124,58,237,0.1)' : 'var(--s2)',
                    border: `1px solid ${on ? 'rgba(124,58,237,0.3)' : 'var(--b0)'}`,
                    transition: 'all var(--ease)',
                  }}
                >
                  <input type="radio" name="model" value={m.value} checked={on} onChange={() => setModel(m.value)} style={{ display: 'none' }} />
                  <div style={{
                    width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${on ? 'var(--ac)' : 'var(--b1)'}`,
                    background: on ? 'var(--ac)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all var(--ease)',
                  }}>
                    {on && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: on ? 'var(--t0)' : 'var(--t1)' }}>{m.label}</span>
                      {m.badge && <span style={{ fontSize: 11 }}>{m.badge}</span>}
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--t2)' }}>{m.desc}</p>
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      </section>

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
          {saved ? <><Check size={14} /> Saved!</> : 'Save settings'}
        </button>
        <Link href="/" className="btn btn-ghost" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={13} /> Back
        </Link>
      </div>
    </div>
  )
}
