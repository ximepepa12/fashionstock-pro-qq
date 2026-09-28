import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Logo } from '@/components/brand/logo'

const pasos = [
  { titulo: 'Registro o inicio de sesión', detalle: 'El usuario ingresa correo/usuario, contraseña y, en registro, cédula y fecha de nacimiento.' },
  { titulo: 'Validación', detalle: 'El prototipo verifica campos vacíos, correo válido, cédula, fecha y longitud de la contraseña.' },
  { titulo: 'Acceso o error', detalle: 'Si los datos son correctos entra al panel. Si fallan, se muestra el recuadro de error en rosa.' },
]

export default function DiagramaPage() {
  return (
    <main className="min-h-screen bg-[#f3f4ff] px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Logo />
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-[#4f46e5]">Evidencia de prototipo</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Diagrama de acceso</h1>
        <p className="mt-3 max-w-2xl text-slate-500">
          Flujo de registro o inicio de sesión: validación, acceso al sistema o mensaje de error.
        </p>

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-stretch">
          {pasos.map((paso, index) => (
            <div key={paso.titulo} className="flex flex-1 items-stretch gap-4">
              <article className="flex-1 rounded-2xl bg-white p-5 shadow-sm">
                <span className="grid size-8 place-items-center rounded-full bg-[#4f46e5] text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <h2 className="mt-4 font-semibold text-slate-800">{paso.titulo}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{paso.detalle}</p>
              </article>
              {index < pasos.length - 1 && (
                <ArrowRight className="hidden size-5 shrink-0 self-center text-[#ff6b8b] lg:block" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#4f46e5]/20 bg-white p-5">
            <p className="text-sm font-semibold text-[#4f46e5]">Acceso</p>
            <p className="mt-2 text-sm text-slate-500">El usuario entra al panel con sidebar, rol y datos de demostración.</p>
          </div>
          <div className="rounded-2xl border border-[#ff6b8b]/30 bg-[#fff2f5] p-5">
            <p className="text-sm font-semibold text-[#c9365b]">Error</p>
            <p className="mt-2 text-sm text-slate-600">No se pudo iniciar sesión. Usuario o contraseña incorrectos. Verifica tus credenciales e intenta de nuevo.</p>
          </div>
        </div>

        <Link href="/" className="mt-10 inline-block text-sm font-medium text-[#4f46e5] hover:underline">
          Volver a la página de inicio
        </Link>
      </div>
    </main>
  )
}
