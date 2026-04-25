import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Marketing Skills — AI Marketing Toolkit',
  description: '37 AI-powered marketing tools for CRO, SEO, copy, growth, and strategy',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col`} style={{ background: 'var(--bg)', color: 'var(--t0)' }}>
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
