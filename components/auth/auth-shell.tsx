import type { ReactNode } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/brand/logo'

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <main className="min-h-screen bg-[#f3f4ff] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(79,70,229,0.15)]">
        <section className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#ff6b8b] p-12 text-white lg:flex">
          <Link href="/" aria-label="Ir a la página de inicio de FashionStock Pro">
            <Logo iconClassName="bg-white/20" textClassName="text-white" />
          </Link>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">{eyebrow}</p>
            <h1 className="max-w-sm text-4xl font-semibold leading-tight tracking-tight">{title}</h1>
            <p className="mt-5 max-w-sm text-base leading-7 text-white/85">{description}</p>
          </div>
          <p className="text-xs text-white/60">FashionStock Pro · Prototipo visual con datos de demostración · 2026</p>
        </section>

        <section className="flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link href="/" aria-label="Ir a la página de inicio de FashionStock Pro">
                <Logo />
              </Link>
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}
