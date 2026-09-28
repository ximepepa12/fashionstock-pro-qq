'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { useMockStore } from '@/lib/mock-store'

const inputClass =
  'h-12 w-full rounded-xl border border-[#e7e8f6] bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10'

function esCorreoValido(valor: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)
}

export default function SignInPage() {
  const router = useRouter()
  const { session, sessionReady, login } = useMockStore()
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [errorCredenciales, setErrorCredenciales] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (sessionReady && session) router.replace('/dashboard')
  }, [sessionReady, session, router])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setErrorCredenciales(false)

    const usuarioLimpio = usuario.trim()
    if (!usuarioLimpio || !password) {
      setError('Por favor complete los campos obligatorios.')
      return
    }
    if (usuarioLimpio.includes('@') && !esCorreoValido(usuarioLimpio)) {
      setError('Ingrese un correo electrónico válido.')
      return
    }

    setLoading(true)
    const resultado = login(usuarioLimpio, password)
    setLoading(false)
    if (!resultado.ok) {
      setErrorCredenciales(true)
      setError(resultado.error ?? 'El usuario o la contraseña no son correctos.')
      return
    }
    router.push('/dashboard')
  }

  function llenarDemo(usuarioDemo: string) {
    setUsuario(usuarioDemo)
    setPassword('123456')
    setError('')
    setErrorCredenciales(false)
  }

  function verEjemploError() {
    setUsuario('usuario@fashionstock.pro')
    setPassword('clave-incorrecta')
    setErrorCredenciales(true)
    setError('Usuario o contraseña incorrectos. Verifica tus credenciales e intenta de nuevo.')
  }

  return (
    <AuthShell
      eyebrow="Gestión inteligente"
      title="Tu inventario, siempre en movimiento."
      description="Organiza tus productos, controla tu stock y toma mejores decisiones para tu negocio de moda."
    >
      <div className="mb-8">
        <p className="mb-3 text-sm font-medium text-[#4f46e5]">Bienvenido de nuevo</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Inicia sesión</h2>
        <p className="mt-2 text-sm text-slate-500">Ingresa tus datos para continuar.</p>
      </div>

      <div className="mb-6 rounded-xl border border-[#e7e8f6] bg-[#f8f8fd] p-4 text-sm">
        <p className="font-semibold text-slate-700">Credenciales de demostración</p>
        <div className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => llenarDemo('admin')}
            className="flex items-center justify-between rounded-lg border border-[#e7e8f6] bg-white px-3 py-2 text-left transition hover:border-[#4f46e5]"
          >
            <span className="text-slate-600">
              <span className="font-medium text-slate-800">admin</span> / 123456
              <span className="mt-0.5 block text-xs text-slate-400">o admin@fashionstock.pro</span>
            </span>
            <span className="text-xs font-semibold text-[#4f46e5]">Administrador</span>
          </button>
          <button
            type="button"
            onClick={() => llenarDemo('empleado')}
            className="flex items-center justify-between rounded-lg border border-[#e7e8f6] bg-white px-3 py-2 text-left transition hover:border-[#4f46e5]"
          >
            <span className="text-slate-600">
              <span className="font-medium text-slate-800">empleado</span> / 123456
              <span className="mt-0.5 block text-xs text-slate-400">o empleado@fashionstock.pro</span>
            </span>
            <span className="text-xs font-semibold text-[#ff6b8b]">Empleado</span>
          </button>
        </div>
        <button type="button" onClick={verEjemploError} className="mt-3 text-xs font-medium text-[#4f46e5] hover:underline">
          Ver ejemplo de error
        </button>
      </div>

      {error && (
        <div role="alert" className="mb-5 rounded-xl border border-[#ff6b8b]/30 bg-[#fff2f5] p-3.5 text-sm text-[#c9365b]">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <div>
              {errorCredenciales && <p className="font-semibold">No se pudo iniciar sesión</p>}
              <p className={errorCredenciales ? 'mt-0.5' : undefined}>{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Usuario o correo electrónico
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={usuario}
              onChange={(event) => setUsuario(event.target.value)}
              className={`${inputClass} pl-11`}
              placeholder="admin o nombre@fashionstock.pro"
            />
          </div>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Contraseña
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type={showPassword ? 'text' : 'password'}
              className={`${inputClass} pl-11 pr-12`}
              placeholder="Ingresa tu contraseña"
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
        <div className="flex justify-end">
          <Link href="/recuperar-contrasena" className="text-sm font-medium text-[#4f46e5] hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="mt-2 h-12 rounded-xl bg-[#4f46e5] text-sm font-semibold shadow-lg shadow-indigo-200 hover:bg-[#4338ca]"
        >
          {loading ? 'Verificando…' : 'Iniciar sesión'}
          {!loading && <ArrowRight data-icon="inline-end" />}
        </Button>
      </form>
      <p className="mt-7 text-center text-sm text-slate-500">
        ¿No tienes una cuenta?{' '}
        <Link href="/registro" className="font-semibold text-[#4f46e5] hover:underline">
          Crea una aquí
        </Link>
      </p>
    </AuthShell>
  )
}
