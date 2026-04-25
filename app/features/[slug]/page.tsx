import { notFound } from 'next/navigation'
import { getFeatureBySlug, FEATURES, getFeaturesByCategory, getCategoryBySlug } from '@/lib/features'
import FeaturePageClient from '@/components/FeaturePageClient'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export function generateStaticParams() {
  return FEATURES.map(f => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const feature = getFeatureBySlug(slug)
  if (!feature) return {}
  return {
    title: `${feature.title} — Marketing Skills`,
    description: feature.tagline,
  }
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const feature = getFeatureBySlug(slug)
  if (!feature) notFound()

  const category = getCategoryBySlug(feature.category)
  const related = getFeaturesByCategory(feature.category)
    .filter(f => f.slug !== slug)
    .slice(0, 4)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 57px)' }}>
      {/* Breadcrumb */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 20px', flexShrink: 0,
          borderBottom: '1px solid var(--b0)', background: 'var(--s0)',
          fontSize: 12, color: 'var(--t2)',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--t2)' }}>
          <ChevronLeft size={11} />
          Home
        </Link>
        <span>/</span>
        <span>{category?.label}</span>
        <span>/</span>
        <span style={{ color: 'var(--t1)' }}>{feature.title}</span>

        {related.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
            <span>Related:</span>
            {related.map(r => (
              <Link
                key={r.slug}
                href={`/features/${r.slug}`}
                style={{
                  padding: '2px 8px', borderRadius: 6, fontSize: 11,
                  background: 'var(--s2)', border: '1px solid var(--b0)', color: 'var(--t2)',
                }}
              >
                {r.icon} {r.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      <FeaturePageClient slug={slug} />
    </div>
  )
}
