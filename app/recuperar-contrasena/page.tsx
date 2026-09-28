'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'

const inputClass =
  'h-12 w-full rounded-xl border border-[#e7e8f6] bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10'

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [enviado, setEnviado] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const correo = email.trim()
    if (!correo) {
      setError('Por favor complete los campos obligatorios.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError('Ingrese un correo electrónico válido.')
      return
    }
    setEnviado(true)
  }

  return (
    <AuthShell
      eyebrow="Recuperación de acceso"
      title="Recupera el acceso a tu cuenta."
      description="Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña."
    >
      <div className="mb-8">
        <Link href="/iniciar-sesion" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#4f46e5]">
          <ArrowLeft className="size-4" />
          Volver a iniciar sesión
        </Link>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">¿Olvidaste tu contraseña?</h2>
        <p className="mt-2 text-sm text-slate-500">Ingresa tu correo y simularemos el envío de instrucciones.</p>
      </div>

      {error && (
        <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-[#ff6b8b]/30 bg-[#fff2f5] p-3.5 text-sm text-[#c9365b]">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {enviado ? (
        <div role="status" className="flex flex-col gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-700">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            <p>Si el correo existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña.</p>
          </div>
          <Button
            variant="outline"
            className="w-fit border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            nativeButton={false}
            render={<Link href="/iniciar-sesion" />}
          >
            Volver a iniciar sesión
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Correo electrónico
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                className={`${inputClass} pl-11`}
                placeholder="nombre@fashionstock.pro"
              />
            </div>
          </label>
          <Button type="submit" className="mt-2 h-12 rounded-xl bg-[#4f46e5] text-sm font-semibold shadow-lg shadow-indigo-200 hover:bg-[#4338ca]">
            Enviar instrucciones
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
