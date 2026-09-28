import Link from 'next/link'
import { Logo } from '@/components/brand/logo'

const colores = [
  { nombre: 'Índigo', hex: '#4F46E5', uso: 'Color primario: botones, enlaces y acentos de marca.' },
  { nombre: 'Lavanda', hex: '#F3F4FF', uso: 'Fondos suaves de autenticación y áreas de contenido.' },
  { nombre: 'Rosa', hex: '#FF6B8B', uso: 'Acento de alertas, errores y estados de bajo stock o agotado.' },
]

export default function IdentidadVisualPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Logo />
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-[#4f46e5]">Evidencia de prototipo</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Identidad visual</h1>
        <p className="mt-3 max-w-2xl text-slate-500">
          Paleta de tres colores de FashionStock Pro, usada de forma consistente en landing, autenticación y el panel.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {colores.map((color) => (
            <article key={color.hex} className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <div className="h-28" style={{ backgroundColor: color.hex }} />
              <div className="p-4">
                <h2 className="font-semibold text-slate-800">{color.nombre}</h2>
                <p className="mt-1 font-mono text-sm text-slate-500">{color.hex}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{color.uso}</p>
              </div>
            </article>
          ))}
        </div>
        <Link href="/" className="mt-10 inline-block text-sm font-medium text-[#4f46e5] hover:underline">
          Volver a la página de inicio
        </Link>
      </div>
    </main>
  )
}
