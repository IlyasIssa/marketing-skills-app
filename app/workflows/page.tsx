'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, GitBranch, Play } from 'lucide-react'
import { WORKFLOWS } from '@/lib/workflows'

type Artifact = {
  id: string
  slug: string
  title: string
  format: 'structured' | 'markdown'
  output: string
  createdAt: string
  siteUrl?: string
}

function latestFor(artifacts: Artifact[], slug: string): Artifact | undefined {
  return artifacts.find(a => a.slug === slug)
}

export default function WorkflowsPage() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('marketing_artifacts')
      if (raw) setArtifacts(JSON.parse(raw))
    } catch {}
  }, [])

  const bySlug = useMemo(() => {
    const map = new Map<string, Artifact>()
    for (const artifact of artifacts) {
      if (!map.has(artifact.slug)) map.set(artifact.slug, artifact)
    }
    return map
  }, [artifacts])

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 30 }}>
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
          <GitBranch size={20} style={{ color: 'var(--ac-l)' }} />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 850, marginBottom: 6 }}>Workflows</h1>
          <p style={{ color: 'var(--t1)', fontSize: 13, lineHeight: 1.6 }}>
            Chain features together. Each step can use the previous step&apos;s saved artifact as context.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 18 }}>
        {WORKFLOWS.map(workflow => {
          const completed = workflow.steps.filter(step => bySlug.has(step.slug)).length
          return (
            <section key={workflow.id} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 5 }}>{workflow.title}</h2>
                  <p style={{ color: 'var(--t1)', fontSize: 13, lineHeight: 1.6 }}>{workflow.description}</p>
                </div>
                <span className="badge badge-accent" style={{ height: 'fit-content' }}>{completed} / {workflow.steps.length}</span>
              </div>

              <div style={{ display: 'grid', gap: 10 }}>
                {workflow.steps.map((step, index) => {
                  const artifact = latestFor(artifacts, step.slug)
                  const previous = index > 0 ? latestFor(artifacts, workflow.steps[index - 1].slug) : undefined
                  const href = previous
                    ? `/features/${step.slug}?artifact=${encodeURIComponent(previous.id)}&workflow=${encodeURIComponent(workflow.id)}`
                    : `/features/${step.slug}?workflow=${encodeURIComponent(workflow.id)}`

                  return (
                    <div key={step.slug} style={{
                      display: 'grid',
                      gridTemplateColumns: '32px 1fr auto',
                      gap: 12,
                      alignItems: 'center',
                      padding: 12,
                      borderRadius: 'var(--r-lg)',
                      background: 'var(--s2)',
                      border: '1px solid var(--b0)',
                    }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: artifact ? 'rgba(16,185,129,0.14)' : 'var(--s1)',
                        border: `1px solid ${artifact ? 'rgba(16,185,129,0.25)' : 'var(--b1)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: artifact ? 'var(--green)' : 'var(--t2)',
                      }}>
                        {artifact ? <Check size={13} /> : index + 1}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                          <h3 style={{ fontSize: 13, fontWeight: 750 }}>{step.title}</h3>
                          {previous && <span className="badge" style={{ color: 'var(--ac-l)', background: 'rgba(124,58,237,0.08)', borderColor: 'rgba(124,58,237,0.18)' }}>uses previous artifact</span>}
                          {artifact && <span className="badge badge-green">done</span>}
                        </div>
                        <p style={{ color: 'var(--t1)', fontSize: 12, lineHeight: 1.55 }}>{step.goal}</p>
                        {artifact && (
                          <p style={{ color: 'var(--t2)', fontSize: 11, marginTop: 4 }}>
                            Latest: {new Date(artifact.createdAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <Link href={href} className={artifact ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}>
                        {artifact ? 'Run again' : index === 0 ? <><Play size={12} /> Start</> : 'Continue'}
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
