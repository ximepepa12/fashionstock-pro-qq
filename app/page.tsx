'use client'

import { useState } from 'react'
import { AlertCircle, ArrowRight, CalendarDays, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'

const inputClass = 'h-12 w-full rounded-xl border border-[#e7e8f6] bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10'

export default function HomePage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitted(false)
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '').trim()

    if (!email || !password) {
      setError('Por favor complete los campos obligatorios.')
      return
    }
    if (!email.includes('@')) {
      setError('Ingrese un correo electrónico válido.')
      return
    }
    if (mode === 'register' && password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-[#f3f4ff] px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(79,70,229,0.12)]">
        <section className="hidden w-[43%] flex-col justify-between bg-[#4f46e5] p-12 text-white lg:flex">
          <div>
            <div className="mb-16 flex items-center gap-3 text-sm font-semibold tracking-wide">
              <div className="grid size-10 place-items-center rounded-xl bg-white/15 text-lg">FS</div>
              FASHIONSTOCK PRO
            </div>
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-indigo-200">Gestión inteligente</p>
            <h1 className="max-w-sm text-5xl font-semibold leading-[1.08] tracking-tight">Tu inventario, siempre en movimiento.</h1>
            <p className="mt-6 max-w-sm text-base leading-7 text-indigo-100">Organiza tus productos, controla tu stock y toma mejores decisiones para tu negocio de moda.</p>
          </div>
          <p className="text-xs text-indigo-200">FashionStock Pro · 2026</p>
        </section>

        <section className="flex w-full items-center justify-center px-6 py-10 sm:px-12 lg:w-[57%] lg:px-20">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <p className="text-sm font-bold tracking-[0.18em] text-[#4f46e5]">FASHIONSTOCK PRO</p>
            </div>
            <div className="mb-8">
              <p className="mb-3 text-sm font-medium text-[#4f46e5]">Bienvenido de nuevo</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}</h2>
              <p className="mt-2 text-sm text-slate-500">{mode === 'login' ? 'Ingresa tus datos para continuar.' : 'Completa tus datos para comenzar.'}</p>
            </div>

            <div className="mb-7 flex rounded-xl bg-[#f3f4ff] p-1 text-sm font-medium">
              <button type="button" onClick={() => { setMode('login'); setError(''); setSubmitted(false) }} className={`flex-1 rounded-lg py-2.5 transition ${mode === 'login' ? 'bg-white text-[#4f46e5] shadow-sm' : 'text-slate-500'}`}>Iniciar sesión</button>
              <button type="button" onClick={() => { setMode('register'); setError(''); setSubmitted(false) }} className={`flex-1 rounded-lg py-2.5 transition ${mode === 'register' ? 'bg-white text-[#4f46e5] shadow-sm' : 'text-slate-500'}`}>Crear cuenta</button>
            </div>

            {error && <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-[#ff6b8b]/30 bg-[#fff2f5] p-3.5 text-sm text-[#c9365b]"><AlertCircle className="mt-0.5 size-4 shrink-0" /> <span>{error}</span></div>}
            {submitted && <div role="status" className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-700"><CheckCircle2 className="mt-0.5 size-4 shrink-0" /> <span>{mode === 'login' ? 'Datos validados correctamente.' : 'Registro validado correctamente.'}</span></div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === 'register' && <div className="grid gap-4 sm:grid-cols-2"><label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Nombres<input name="firstName" className={inputClass} placeholder="Tus nombres" /></label><label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Apellidos<input name="lastName" className={inputClass} placeholder="Tus apellidos" /></label></div>}
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Correo electrónico<div className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input name="email" type="email" className={`${inputClass} pl-11`} placeholder="nombre@empresa.com" /></div></label>
              {mode === 'register' && <><label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Número de cédula<div className="relative"><UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input name="idNumber" inputMode="numeric" className={`${inputClass} pl-11`} placeholder="Número de identificación" /></div></label><label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Fecha de nacimiento<div className="relative"><CalendarDays className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input name="birthDate" type="date" className={`${inputClass} pl-11`} /></div></label></>}
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Contraseña<div className="relative"><LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input name="password" type={showPassword ? 'text' : 'password'} className={`${inputClass} pl-11 pr-12`} placeholder="Mínimo 6 caracteres" /><button type="button" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4f46e5]">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></label>
              {mode === 'login' && <div className="flex justify-end"><button type="button" className="text-sm font-medium text-[#4f46e5] hover:underline">¿Olvidaste tu contraseña?</button></div>}
              <button type="submit" className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#4f46e5] text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-[#4338ca] focus:outline-none focus:ring-4 focus:ring-indigo-200">{mode === 'login' ? 'Iniciar sesión' : 'Registrar usuario'}<ArrowRight className="size-4" /></button>
            </form>
            <p className="mt-7 text-center text-sm text-slate-500">{mode === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'} <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSubmitted(false) }} className="font-semibold text-[#4f46e5] hover:underline">{mode === 'login' ? 'Crea una aquí' : 'Inicia sesión'}</button></p>
          </div>
        </section>
      </div>
    </main>
  )
}
