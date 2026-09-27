'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

export function AuthForm({ mode = 'sign-in' }: { mode?: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isSignUp = mode === 'sign-up'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    const result = isSignUp
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password })
    setLoading(false)
    if (result.error) {
      setError('No se pudo completar la operación. Revisa tus datos e inténtalo de nuevo.')
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex flex-col gap-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">FASHIONSTOCK</p>
        <h1 className="text-3xl font-semibold tracking-tight">{isSignUp ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}</h1>
        <p className="text-sm text-muted-foreground">{isSignUp ? 'Empieza a gestionar tu inventario de moda.' : 'Inicia sesión para continuar.'}</p>
      </div>
      <div className="flex flex-col gap-3">
        {isSignUp && <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre" className="h-11 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />}
        <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Correo electrónico" className="h-11 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
        <input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Contraseña" className="h-11 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <button disabled={loading} className="h-11 rounded-md bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? 'Cargando…' : isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        {isSignUp ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'}{' '}
        <Link href={isSignUp ? '/sign-in' : '/sign-up'} className="font-medium text-foreground underline underline-offset-4">{isSignUp ? 'Inicia sesión' : 'Regístrate'}</Link>
      </p>
    </form>
  )
}
