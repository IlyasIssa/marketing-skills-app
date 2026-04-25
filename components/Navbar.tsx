'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Settings, BookOpen, Zap, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [hasKey, setHasKey] = useState(false)
  const [hasCtx, setHasCtx] = useState(false)

  useEffect(() => {
    try {
      const k = localStorage.getItem('marketing_api_key')
      const c = localStorage.getItem('marketing_product_context')
      setHasKey(Boolean(k && JSON.parse(k)?.trim()))
      setHasCtx(Boolean(c?.trim()))
    } catch {}
  }, [pathname])

  return (
    <nav
      className="glass sticky top-0 z-50 h-14 flex items-center justify-between px-6"
      style={{ borderBottom: '1px solid var(--b0)' }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--ac), #9333ea)',
            boxShadow: '0 0 14px var(--ac-g)',
          }}
        >
          <Zap size={13} fill="white" stroke="white" />
        </div>
        <span className="font-bold text-sm" style={{ color: 'var(--t0)' }}>
          Marketing<span style={{ color: 'var(--ac-l)' }}>Skills</span>
        </span>
      </Link>

      {/* Center — setup CTA if missing key or context */}
      {(!hasKey || !hasCtx) && pathname === '/' && (
        <div className="hidden md:flex items-center gap-1.5 text-xs" style={{ color: 'var(--t2)' }}>
          <SetupStep done={hasKey} label="API key" href="/settings" />
          <ChevronRight size={12} style={{ color: 'var(--t2)' }} />
          <SetupStep done={hasCtx} label="Product context" href="/setup" />
        </div>
      )}

      {/* Right nav */}
      <div className="flex items-center gap-1">
        <NavItem href="/setup" active={pathname === '/setup'} icon={<BookOpen size={13} />} done={hasCtx}>
          Context
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
  href: string; active: boolean; icon: React.ReactNode; done: boolean; children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      style={{
        background: active ? 'rgba(124,58,237,0.12)' : 'transparent',
        color: active ? 'var(--ac-l)' : 'var(--t1)',
        border: `1px solid ${active ? 'rgba(124,58,237,0.25)' : 'transparent'}`,
      }}
    >
      {icon}
      {children}
      <span className={`dot ${done ? 'dot-green' : 'dot-muted'}`} style={{ width: 5, height: 5 }} />
    </Link>
  )
}
