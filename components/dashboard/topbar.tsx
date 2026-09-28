'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Menu } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { useMockStore, type SessionUsuario } from '@/lib/mock-store'

function iniciales(nombre: string) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('')
}

export function DashboardTopbar({ session }: { session: SessionUsuario }) {
  const router = useRouter()
  const { logout } = useMockStore()

  function handleLogout() {
    logout()
    router.push('/iniciar-sesion')
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger
            render={<Button variant="outline" size="icon" className="lg:hidden" />}
          >
            <Menu className="size-4" />
            <span className="sr-only">Abrir menú</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Menú de navegación</SheetTitle>
            </SheetHeader>
            <DashboardSidebar rol={session.rol} className="flex h-full w-full" />
          </SheetContent>
        </Sheet>
        <p className="hidden text-sm text-slate-400 sm:block">Prototipo visual con datos de demostración</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800">{session.nombreCompleto}</p>
          <Badge variant={session.rol === 'Administrador' ? 'default' : 'secondary'} className="mt-0.5 bg-[#4f46e5] data-[variant=secondary]:bg-[#ff6b8b]/15 data-[variant=secondary]:text-[#c9365b]">
            {session.rol}
          </Badge>
        </div>
        <Avatar>
          <AvatarFallback className="bg-[#4f46e5] text-white">{iniciales(session.nombreCompleto)}</AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </Button>
      </div>
    </header>
  )
}
