'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { Feature } from '@/lib/types'

export const CATEGORY_COLORS: Record<string, string> = {
  content:     '#7c3aed',
  seo:         '#059669',
  cro:         '#ea580c',
  growth:      '#2563eb',
  strategy:    '#db2777',
  research:    '#d97706',
  ads:         '#dc2626',
  sales:       '#0891b2',
  measurement: '#0d9488',
  other:       '#475569',
}

export default function FeatureCard({ feature }: { feature: Feature }) {
  const [hovered, setHovered] = useState(false)
  const color = CATEGORY_COLORS[feature.category] ?? '#7c3aed'

  return (
    <Link
      href={`/features/${feature.slug}`}
      className="block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <article
        className="card card-hover relative flex flex-col gap-3 overflow-hidden"
        style={{
          padding: '16px',
          borderColor: hovered ? `${color}44` : 'var(--b0)',
          boxShadow: hovered ? `0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px ${color}22` : 'none',
        }}
      >
        {/* Top accent bar */}
        <div
          className="absolute top-0 inset-x-0 h-[2px] rounded-t-xl transition-opacity"
          style={{
            background: `linear-gradient(90deg, ${color}, transparent)`,
            opacity: hovered ? 1 : 0,
            transition: 'opacity var(--ease-md)',
          }}
        />

        {/* Icon row */}
        <div className="flex items-start justify-between">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{
              background: `${color}14`,
              border: `1px solid ${color}28`,
            }}
          >
            {feature.icon}
          </div>
          <ArrowUpRight
            size={14}
            style={{
              color,
              opacity: hovered ? 0.7 : 0,
              transform: hovered ? 'translate(0,0)' : 'translate(-3px,3px)',
              transition: 'all var(--ease-md)',
              flexShrink: 0,
              marginTop: 2,
            }}
          />
        </div>

        {/* Text */}
        <div>
          <h3
            className="font-semibold leading-snug mb-1"
            style={{ fontSize: 13, color: hovered ? '#fff' : 'var(--t0)' }}
          >
            {feature.title}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--t1)', lineHeight: 1.55 }}>
            {feature.tagline}
          </p>
        </div>
      </article>
    </Link>
  )
}
