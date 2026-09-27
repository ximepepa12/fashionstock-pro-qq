import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">FASHIONSTOCK</p>
      <h1 className="text-4xl font-semibold tracking-tight">Hola, {session.user.name}</h1>
      <p className="text-muted-foreground">Tu espacio de inventario está listo.</p>
    </main>
  )
}
