'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clipboard, Download, Trash2 } from 'lucide-react'

type Artifact = {
  id: string
  slug: string
  title: string
  format: 'structured' | 'markdown'
  output: string
  createdAt: string
  siteUrl?: string
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function ArtifactsPage() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('marketing_artifacts')
      if (raw) setArtifacts(JSON.parse(raw))
    } catch {}
  }, [])

  function persist(next: Artifact[]) {
    setArtifacts(next)
    localStorage.setItem('marketing_artifacts', JSON.stringify(next))
  }

  const features = useMemo(() => {
    return Array.from(new Set(artifacts.map(a => a.slug))).sort()
  }, [artifacts])

  const visible = filter === 'all' ? artifacts : artifacts.filter(a => a.slug === filter)

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 850, marginBottom: 6 }}>Artifacts</h1>
          <p style={{ color: 'var(--t1)', fontSize: 13 }}>Saved outputs from your marketing workflows.</p>
        </div>
        <Link href="/" className="btn btn-ghost btn-sm"><ArrowLeft size={13} /> Home</Link>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 18, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setFilter('all')}>All · {artifacts.length}</button>
        {features.map(slug => (
          <button key={slug} className={`btn ${filter === slug ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setFilter(slug)}>
            {slug}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--t1)' }}>
          No artifacts yet. Generate something from a feature page and it will appear here.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {visible.map(artifact => (
            <article key={artifact.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 750 }}>{artifact.title}</h2>
                    <span className="badge badge-accent">{artifact.format}</span>
                  </div>
                  <p style={{ color: 'var(--t2)', fontSize: 12 }}>
                    {new Date(artifact.createdAt).toLocaleString()}
                    {artifact.siteUrl ? ` · ${artifact.siteUrl}` : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigator.clipboard.writeText(artifact.output)} title="Copy"><Clipboard size={12} /></button>
                  <button className="btn btn-ghost btn-sm" onClick={() => downloadText(`${artifact.slug}-${artifact.id}.txt`, artifact.output)} title="Download"><Download size={12} /></button>
                  <button className="btn btn-ghost btn-sm" onClick={() => persist(artifacts.filter(a => a.id !== artifact.id))} title="Delete"><Trash2 size={12} /></button>
                </div>
              </div>
              <pre style={{
                maxHeight: 180,
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                background: 'var(--s2)',
                border: '1px solid var(--b0)',
                borderRadius: 10,
                padding: 12,
                color: 'var(--t1)',
                fontSize: 12,
                lineHeight: 1.6,
              }}>
                {artifact.output.slice(0, 3000)}
              </pre>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
