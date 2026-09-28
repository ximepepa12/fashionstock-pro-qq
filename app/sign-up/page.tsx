'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowRight, CalendarDays, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { useMockStore } from '@/lib/mock-store'

const inputClass =
  'h-12 w-full rounded-xl border border-[#e7e8f6] bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10'

function esCorreoValido(valor: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)
}

export default function SignUpPage() {
  const router = useRouter()
  const { session, sessionReady, register } = useMockStore()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (sessionReady && session) router.replace('/dashboard')
  }, [sessionReady, session, router])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const form = new FormData(event.currentTarget)
    const nombres = String(form.get('nombres') ?? '').trim()
    const apellidos = String(form.get('apellidos') ?? '').trim()
    const cedula = String(form.get('cedula') ?? '').trim()
    const fechaNacimiento = String(form.get('fechaNacimiento') ?? '').trim()
    const usuario = String(form.get('usuario') ?? '').trim()
    const password = String(form.get('password') ?? '').trim()

    if (!nombres || !apellidos || !cedula || !fechaNacimiento || !usuario || !password) {
      setError('Por favor complete los campos obligatorios.')
      return
    }
    if (!esCorreoValido(usuario)) {
      setError('Ingrese un correo electrónico válido.')
      return
    }
    if (!/^\d{6,12}$/.test(cedula)) {
      setError('Verifique el número de cédula ingresado.')
      return
    }
    const fecha = new Date(fechaNacimiento)
    if (Number.isNaN(fecha.getTime()) || fecha > new Date()) {
      setError('Ingrese una fecha de nacimiento válida.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)
    const resultado = register({ nombres, apellidos, cedula, fechaNacimiento, usuario, password })
    setLoading(false)
    if (!resultado.ok) {
      setError(resultado.error ?? 'No se pudo completar el registro.')
      return
    }
    router.push('/dashboard')
  }

  return (
    <AuthShell
      eyebrow="Crea tu cuenta"
      title="Empieza a gestionar tu inventario de moda."
      description="Registra tus datos y accede al panel de FashionStock Pro con un rol de empleado listo para operar."
    >
      <div className="mb-8">
        <p className="mb-3 text-sm font-medium text-[#4f46e5]">Únete a FashionStock Pro</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Crea tu cuenta</h2>
        <p className="mt-2 text-sm text-slate-500">Completa tus datos para comenzar.</p>
      </div>

      {error && (
        <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-[#ff6b8b]/30 bg-[#fff2f5] p-3.5 text-sm text-[#c9365b]">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Nombres
            <input name="nombres" className={inputClass} placeholder="Ej. Laura Camila" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Apellidos
            <input name="apellidos" className={inputClass} placeholder="Ej. Torres Ríos" />
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Correo electrónico
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input name="usuario" type="email" className={`${inputClass} pl-11`} placeholder="nombre@fashionstock.pro" />
          </div>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Número de cédula
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input name="cedula" inputMode="numeric" className={`${inputClass} pl-11`} placeholder="Ej. 1053678901" />
            </div>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Fecha de nacimiento
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input name="fechaNacimiento" type="date" className={`${inputClass} pl-11`} />
            </div>
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Contraseña
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              className={`${inputClass} pl-11 pr-12`}
              placeholder="Mínimo 6 caracteres"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4f46e5]"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </label>
        <Button
          type="submit"
          disabled={loading}
          className="mt-2 h-12 rounded-xl bg-[#4f46e5] text-sm font-semibold shadow-lg shadow-indigo-200 hover:bg-[#4338ca]"
        >
          {loading ? 'Creando cuenta…' : 'Registrar usuario'}
          {!loading && <ArrowRight data-icon="inline-end" />}
        </Button>
      </form>
      <p className="mt-7 text-center text-sm text-slate-500">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/sign-in" className="font-semibold text-[#4f46e5] hover:underline">
          Inicia sesión
        </Link>
      </p>
    </AuthShell>
  )
}
