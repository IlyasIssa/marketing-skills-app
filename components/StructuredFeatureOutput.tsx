import { Check, Clipboard, Code2, Download, Eye, Mail, Target, TestTube2 } from 'lucide-react'

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }
type JsonObject = { [key: string]: JsonValue }

export function parseStructuredObject(output: string): JsonObject | null {
  try {
    return JSON.parse(output) as JsonObject
  } catch {
    const start = output.indexOf('{')
    const end = output.lastIndexOf('}')
    if (start === -1 || end === -1 || end <= start) return null
    try {
      return JSON.parse(output.slice(start, end + 1)) as JsonObject
    } catch {
      return null
    }
  }
}

function arr(value: JsonValue | undefined): JsonObject[] {
  return Array.isArray(value) ? value.filter(v => v && typeof v === 'object' && !Array.isArray(v)) as JsonObject[] : []
}

function strings(value: JsonValue | undefined): string[] {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : []
}

function text(value: JsonValue | undefined): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`
}

function downloadText(filename: string, content: string, type = 'text/plain') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function ActionButton({ icon, children, onClick }: { icon: React.ReactNode; children: React.ReactNode; onClick: () => void }) {
  return (
    <button className="btn btn-secondary btn-sm" onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {icon}
      {children}
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 12 }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function ItemCard({ children }: { children: React.ReactNode }) {
  return <div className="card" style={{ padding: 16 }}>{children}</div>
}

function CopyButton({ value }: { value: string }) {
  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={() => navigator.clipboard.writeText(value)}
      style={{ padding: 6, flexShrink: 0 }}
      title="Copy"
    >
      <Clipboard size={12} />
    </button>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--t1)', fontSize: 13, lineHeight: 1.6 }}>
      {items.map((item, i) => <li key={i} style={{ display: 'flex', gap: 8 }}><Check size={13} style={{ color: 'var(--green)', marginTop: 4, flexShrink: 0 }} />{item}</li>)}
    </ul>
  )
}

function CopyGenerator({ data }: { data: JsonObject }) {
  const headlines = arr(data.headlines)
  const benefits = arr(data.benefitSections)
  const primaryHeadline = text(headlines[0]?.text)
  const primaryCta = strings(data.ctas)[0] || 'Get started'
  const landingPageBrief = [
    `# ${primaryHeadline}`,
    '',
    text(data.heroParagraph),
    '',
    ...benefits.flatMap(b => [`## ${text(b.heading)}`, text(b.body), '']),
    `CTA: ${primaryCta}`,
  ].join('\n')
  return (
    <>
      <Section title="Artifacts">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <ActionButton icon={<Clipboard size={12} />} onClick={() => navigator.clipboard.writeText(landingPageBrief)}>Copy landing page brief</ActionButton>
          <ActionButton icon={<Download size={12} />} onClick={() => downloadText('landing-page-brief.md', landingPageBrief, 'text/markdown')}>Download brief</ActionButton>
        </div>
      </Section>

      <Section title="Landing Page Preview">
        <ItemCard>
          <div style={{ border: '1px solid var(--b0)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg)' }}>
            <div style={{ padding: 24, borderBottom: '1px solid var(--b0)' }}>
              <Eye size={16} style={{ color: 'var(--ac-l)', marginBottom: 12 }} />
              <h3 style={{ fontSize: 26, fontWeight: 850, lineHeight: 1.1, color: '#fff', maxWidth: 640 }}>{primaryHeadline}</h3>
              <p style={{ color: 'var(--t1)', marginTop: 12, lineHeight: 1.7, maxWidth: 640 }}>{text(data.heroParagraph)}</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 18 }}>{primaryCta}</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 1, background: 'var(--b0)' }}>
              {benefits.slice(0, 3).map((b, i) => (
                <div key={i} style={{ background: 'var(--s1)', padding: 18 }}>
                  <h4 style={{ color: 'var(--t0)', fontWeight: 750, marginBottom: 6 }}>{text(b.heading)}</h4>
                  <p style={{ color: 'var(--t1)', fontSize: 12, lineHeight: 1.6 }}>{text(b.body)}</p>
                </div>
              ))}
            </div>
          </div>
        </ItemCard>
      </Section>

      <Section title="Headline Options">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
          {headlines.map((h, i) => {
            const headline = text(h.text)
            return (
              <ItemCard key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 750, color: '#fff', lineHeight: 1.35 }}>{headline}</h3>
                  <CopyButton value={headline} />
                </div>
                <p style={{ color: 'var(--t1)', fontSize: 12, lineHeight: 1.6, marginTop: 10 }}>{text(h.rationale)}</p>
              </ItemCard>
            )
          })}
        </div>
      </Section>

      <Section title="Page Copy">
        <ItemCard>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--t0)', marginBottom: 16 }}>{text(data.heroParagraph)}</p>
          <div style={{ display: 'grid', gap: 12 }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ borderTop: '1px solid var(--b0)', paddingTop: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--ac-l)', marginBottom: 4 }}>{text(b.heading)}</h3>
                <p style={{ color: 'var(--t1)', fontSize: 13, lineHeight: 1.65 }}>{text(b.body)}</p>
              </div>
            ))}
          </div>
        </ItemCard>
      </Section>

      <Section title="CTAs">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {strings(data.ctas).map((cta, i) => (
            <button key={i} className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(cta)}>{cta}</button>
          ))}
        </div>
      </Section>
      <Section title="Strategy Notes"><BulletList items={strings(data.strategyNotes)} /></Section>
    </>
  )
}

function SeoAuditor({ data }: { data: JsonObject }) {
  const findings = arr(data.findings)
  const findingsCsv = [
    ['Severity', 'Issue', 'Impact', 'Fix'].map(csvCell).join(','),
    ...findings.map(f => [text(f.severity), text(f.issue), text(f.impact), text(f.fix)].map(csvCell).join(',')),
  ].join('\n')
  const colors: Record<string, string> = {
    Critical: 'var(--red)',
    'High Priority': 'var(--yellow)',
    'Quick Win': 'var(--green)',
    Improvement: 'var(--ac-l)',
  }
  return (
    <>
      <Section title="Artifacts">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <ActionButton icon={<Download size={12} />} onClick={() => downloadText('seo-audit-findings.csv', findingsCsv, 'text/csv')}>Download findings CSV</ActionButton>
          <ActionButton icon={<Clipboard size={12} />} onClick={() => navigator.clipboard.writeText(findingsCsv)}>Copy CSV</ActionButton>
        </div>
      </Section>
      <Section title="Executive Summary"><BulletList items={strings(data.executiveSummary)} /></Section>
      <Section title="Prioritized Findings">
        <div style={{ display: 'grid', gap: 10 }}>
          {findings.map((f, i) => {
            const severity = text(f.severity)
            return (
              <ItemCard key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span className="badge" style={{ color: colors[severity] || 'var(--t1)', borderColor: 'var(--b1)', background: 'var(--s2)' }}>{severity}</span>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{text(f.issue)}</h3>
                </div>
                <p style={{ color: 'var(--t1)', fontSize: 13, lineHeight: 1.6 }}><strong style={{ color: 'var(--t0)' }}>Impact:</strong> {text(f.impact)}</p>
                <p style={{ color: 'var(--t1)', fontSize: 13, lineHeight: 1.6 }}><strong style={{ color: 'var(--t0)' }}>Fix:</strong> {text(f.fix)}</p>
              </ItemCard>
            )
          })}
        </div>
      </Section>
      <Section title="30-Day Plan">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {arr(data.actionPlan30Days).map((w, i) => <ItemCard key={i}><h3 style={{ fontWeight: 700, marginBottom: 8 }}>{text(w.week)}</h3><BulletList items={strings(w.tasks)} /></ItemCard>)}
        </div>
      </Section>
    </>
  )
}

function EmailCampaign({ data }: { data: JsonObject }) {
  const emails = arr(data.emails)
  const emailCsv = [
    ['Day', 'Subject', 'Preview Text', 'CTA', 'Job', 'Body'].map(csvCell).join(','),
    ...emails.map(email => [
      text(email.day),
      text(email.subject),
      text(email.previewText),
      text(email.cta),
      text(email.job),
      text(email.body),
    ].map(csvCell).join(',')),
  ].join('\n')
  return (
    <>
      <Section title="Artifacts">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <ActionButton icon={<Download size={12} />} onClick={() => downloadText('email-sequence.csv', emailCsv, 'text/csv')}>Download sequence CSV</ActionButton>
          <ActionButton icon={<Clipboard size={12} />} onClick={() => navigator.clipboard.writeText(emailCsv)}>Copy CSV</ActionButton>
        </div>
      </Section>
      <Section title="Sequence Goal">
        <ItemCard><p style={{ color: 'var(--t0)', fontSize: 15 }}>{text(data.sequenceGoal)}</p></ItemCard>
      </Section>
      <Section title="Email Timeline">
        <div style={{ display: 'grid', gap: 12 }}>
          {emails.map((email, i) => {
            const body = text(email.body)
            return (
              <ItemCard key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Mail size={15} style={{ color: 'var(--ac-l)' }} />
                  <span className="badge badge-accent">{text(email.day) || `Email ${i + 1}`}</span>
                  <h3 style={{ fontSize: 14, fontWeight: 750, color: '#fff' }}>{text(email.subject)}</h3>
                  <CopyButton value={body} />
                </div>
                <p style={{ color: 'var(--t2)', fontSize: 12, marginBottom: 10 }}>{text(email.previewText)}</p>
                <pre style={{ whiteSpace: 'pre-wrap', color: 'var(--t1)', fontSize: 13, lineHeight: 1.65, fontFamily: 'inherit' }}>{body}</pre>
                <p style={{ color: 'var(--green)', fontSize: 12, marginTop: 10 }}>{text(email.cta)}</p>
              </ItemCard>
            )
          })}
        </div>
      </Section>
      <Section title="Strategy Notes"><BulletList items={strings(data.strategyNotes)} /></Section>
    </>
  )
}

function AbTest({ data }: { data: JsonObject }) {
  const sampleSize = data.sampleSize && typeof data.sampleSize === 'object' && !Array.isArray(data.sampleSize) ? data.sampleSize as JsonObject : {}
  const ice = data.iceScore && typeof data.iceScore === 'object' && !Array.isArray(data.iceScore) ? data.iceScore as JsonObject : {}
  const testPlan = JSON.stringify(data, null, 2)
  return (
    <>
      <Section title="Artifacts">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <ActionButton icon={<Download size={12} />} onClick={() => downloadText('ab-test-plan.json', testPlan, 'application/json')}>Download test plan</ActionButton>
          <ActionButton icon={<Clipboard size={12} />} onClick={() => navigator.clipboard.writeText(testPlan)}>Copy JSON</ActionButton>
        </div>
      </Section>
      <Section title="Hypothesis">
        <ItemCard><Target size={16} style={{ color: 'var(--ac-l)', marginBottom: 8 }} /><p style={{ fontSize: 15, lineHeight: 1.7 }}>{text(data.hypothesis)}</p></ItemCard>
      </Section>
      <Section title="Test Design">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
          <ItemCard><h3 style={{ fontWeight: 700, marginBottom: 8 }}>Control</h3><p style={{ color: 'var(--t1)', lineHeight: 1.6 }}>{text(data.control)}</p></ItemCard>
          <ItemCard><h3 style={{ fontWeight: 700, marginBottom: 8 }}>Variant</h3><p style={{ color: 'var(--t1)', lineHeight: 1.6 }}>{text(data.variant)}</p></ItemCard>
        </div>
      </Section>
      <Section title="Sizing">
        <ItemCard>
          <TestTube2 size={16} style={{ color: 'var(--green)', marginBottom: 8 }} />
          <p style={{ fontSize: 18, fontWeight: 800 }}>{text(sampleSize.perVariant)}</p>
          <p style={{ color: 'var(--t1)', fontSize: 13, lineHeight: 1.6 }}>{text(sampleSize.assumptions)}</p>
          <p style={{ color: 'var(--ac-l)', fontSize: 13, marginTop: 8 }}>{text(data.durationEstimate)}</p>
        </ItemCard>
      </Section>
      <Section title="Metrics">
        <div style={{ display: 'grid', gap: 8 }}>
          {arr(data.metrics).map((m, i) => <ItemCard key={i}><span className="badge badge-accent">{text(m.type)}</span><h3 style={{ fontWeight: 700, margin: '8px 0 4px' }}>{text(m.name)}</h3><p style={{ color: 'var(--t1)' }}>{text(m.notes)}</p></ItemCard>)}
        </div>
      </Section>
      <Section title="ICE Score">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {['impact', 'confidence', 'effort', 'total'].map(k => <ItemCard key={k}><p style={{ color: 'var(--t2)', fontSize: 11, textTransform: 'uppercase' }}>{k}</p><p style={{ fontWeight: 800, fontSize: 18 }}>{text(ice[k])}</p></ItemCard>)}
        </div>
      </Section>
    </>
  )
}

function SchemaGenerator({ data }: { data: JsonObject }) {
  const jsonLd = JSON.stringify(data.jsonLd || {}, null, 2)
  const scriptTag = `<script type="application/ld+json">\n${jsonLd}\n</script>`
  return (
    <>
      <Section title="Artifacts">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <ActionButton icon={<Clipboard size={12} />} onClick={() => navigator.clipboard.writeText(scriptTag)}>Copy script tag</ActionButton>
          <ActionButton icon={<Download size={12} />} onClick={() => downloadText('schema.jsonld', jsonLd, 'application/ld+json')}>Download JSON-LD</ActionButton>
        </div>
      </Section>
      <Section title="Schema">
        <ItemCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Code2 size={15} style={{ color: 'var(--ac-l)' }} />
            <h3 style={{ fontSize: 14, fontWeight: 750 }}>{text(data.schemaType)}</h3>
            <CopyButton value={scriptTag} />
          </div>
          <pre style={{ background: '#06060f', border: '1px solid var(--b0)', borderRadius: 10, padding: 16, overflowX: 'auto', color: '#c8d3f5', fontSize: 12 }}>{jsonLd}</pre>
        </ItemCard>
      </Section>
      <Section title="Implementation"><BulletList items={strings(data.implementationSteps)} /></Section>
      <Section title="Validation"><BulletList items={strings(data.validationChecklist)} /></Section>
      <Section title="Notes"><BulletList items={strings(data.notes)} /></Section>
    </>
  )
}

export default function StructuredFeatureOutput({ slug, output }: { slug: string; output: string }) {
  const data = parseStructuredObject(output)
  if (!data) return null

  return (
    <div className="anim-in" style={{ padding: '28px 32px', maxWidth: 980 }}>
      {slug === 'copy-generator' && <CopyGenerator data={data} />}
      {slug === 'seo-auditor' && <SeoAuditor data={data} />}
      {slug === 'email-campaign-builder' && <EmailCampaign data={data} />}
      {slug === 'ab-test-designer' && <AbTest data={data} />}
      {slug === 'schema-generator' && <SchemaGenerator data={data} />}
    </div>
  )
}
