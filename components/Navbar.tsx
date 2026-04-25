'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Archive, GitBranch, Globe2, Settings, BookOpen, Zap, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [hasKey, setHasKey] = useState(false)
  const [hasCtx, setHasCtx] = useState(false)
  const [hasSite, setHasSite] = useState(false)

  useEffect(() => {
    try {
      const k = localStorage.getItem('marketing_api_key')
      const c = localStorage.getItem('marketing_product_context')
      const s = localStorage.getItem('marketing_site_profile')
      setHasKey(Boolean(k && JSON.parse(k)?.trim()))
      setHasCtx(Boolean(c?.trim()))
      setHasSite(Boolean(s))
    } catch {}
  }, [pathname])

  return (
    <nav
      className="glass sticky top-0 z-50 flex items-center justify-between"
      style={{ height: 58, padding: '0 18px', borderBottom: '1px solid var(--b0)' }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group" style={{ minWidth: 176 }}>
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: 'var(--ac)',
            boxShadow: 'var(--shadow-ac)',
          }}
        >
          <Zap size={13} fill="white" stroke="white" />
        </div>
        <span className="font-bold text-sm" style={{ color: 'var(--t0)', letterSpacing: '-0.01em' }}>
          Marketing<span style={{ color: 'var(--ac-l)' }}>Skills</span>
        </span>
      </Link>

      {/* Center — setup CTA if missing key or context */}
      {(!hasKey || !hasSite) && pathname === '/' && (
        <div className="hidden md:flex items-center gap-1.5 text-xs" style={{ color: 'var(--t2)' }}>
          <SetupStep done={hasKey} label="API key" href="/settings" />
          <ChevronRight size={12} style={{ color: 'var(--t2)' }} />
          <SetupStep done={hasSite} label="Active site" href="/site" />
        </div>
      )}

      {/* Right nav */}
      <div className="flex items-center gap-1" style={{ overflowX: 'auto' }}>
        <NavItem href="/site" active={pathname === '/site'} icon={<Globe2 size={13} />} done={hasSite}>
          Site
        </NavItem>
        <NavItem href="/setup" active={pathname === '/setup'} icon={<BookOpen size={13} />} done={hasCtx}>
          Context
        </NavItem>
        <NavItem href="/artifacts" active={pathname === '/artifacts'} icon={<Archive size={13} />}>
          Artifacts
        </NavItem>
        <NavItem href="/workflows" active={pathname === '/workflows'} icon={<GitBranch size={13} />}>
          Workflows
        </NavItem>
        <NavItem href="/settings" active={pathname === '/settings'} icon={<Settings size={13} />} done={hasKey}>
          Settings
        </NavItem>
      </div>
    </nav>
  )
}

function SetupStep({ done, label, href }: { done: boolean; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors hover:bg-[var(--s1)]"
    >
      <span className={`dot ${done ? 'dot-green' : 'dot-muted'}`} style={{ width: 6, height: 6 }} />
      <span style={{ color: done ? 'var(--t1)' : 'var(--t2)' }}>{label}</span>
    </Link>
  )
}

function NavItem({
  href, active, icon, done, children,
}: {
  href: string; active: boolean; icon: React.ReactNode; done?: boolean; children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 text-xs font-medium transition-all"
      style={{
        padding: '7px 10px',
        borderRadius: 8,
        background: active ? 'rgba(79,140,255,0.13)' : 'transparent',
        color: active ? 'var(--ac-l)' : 'var(--t1)',
        border: `1px solid ${active ? 'rgba(79,140,255,0.28)' : 'transparent'}`,
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      {children}
      {typeof done === 'boolean' && <span className={`dot ${done ? 'dot-green' : 'dot-muted'}`} style={{ width: 5, height: 5 }} />}
    </Link>
  )
}
