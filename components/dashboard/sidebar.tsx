'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowLeftRight,
  BarChart3,
  Boxes,
  ClipboardList,
  Home,
  Lock,
  PackagePlus,
  ShoppingBag,
  Truck,
  UserCog,
  Users,
} from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { Rol } from '@/lib/mock-data'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Panel', icon: Home, roles: ['Administrador', 'Empleado'] as Rol[] },
  { href: '/dashboard/inventario', label: 'Inventario', icon: Boxes, roles: ['Administrador', 'Empleado'] as Rol[] },
  { href: '/dashboard/entradas', label: 'Entradas', icon: PackagePlus, roles: ['Administrador', 'Empleado'] as Rol[] },
  { href: '/dashboard/salidas', label: 'Salidas', icon: ArrowLeftRight, roles: ['Administrador', 'Empleado'] as Rol[] },
  { href: '/dashboard/ventas', label: 'Ventas', icon: ShoppingBag, roles: ['Administrador', 'Empleado'] as Rol[] },
  { href: '/dashboard/clientes', label: 'Clientes', icon: Users, roles: ['Administrador', 'Empleado'] as Rol[] },
  { href: '/dashboard/proveedores', label: 'Proveedores', icon: Truck, roles: ['Administrador', 'Empleado'] as Rol[] },
  { href: '/dashboard/compras', label: 'Compras', icon: ClipboardList, roles: ['Administrador', 'Empleado'] as Rol[] },
  { href: '/dashboard/usuarios', label: 'Usuarios', icon: UserCog, roles: ['Administrador'] as Rol[] },
  { href: '/dashboard/reportes', label: 'Reportes', icon: BarChart3, roles: ['Administrador'] as Rol[] },
]

export function DashboardSidebar({ rol }: { rol: Rol }) {
  const pathname = usePathname()

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-slate-100 bg-[#fbfbfe] lg:flex">
      <div className="px-5 py-6">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV_ITEMS.map((item) => {
          const permitido = item.roles.includes(rol)
          const activo = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const contenido = (
            <span
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                activo && permitido ? 'bg-[#4f46e5] text-white shadow-sm' : 'text-slate-600 hover:bg-[#f3f4ff] hover:text-[#4f46e5]',
                !permitido && 'cursor-not-allowed text-slate-300 hover:bg-transparent hover:text-slate-300',
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
              {!permitido && <Lock className="ml-auto size-3.5" />}
            </span>
          )

          if (!permitido) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger render={<div />}>{contenido}</TooltipTrigger>
                <TooltipContent side="right">Solo administrador</TooltipContent>
              </Tooltip>
            )
          }

          return (
            <Link key={item.href} href={item.href}>
              {contenido}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-slate-100 px-5 py-4">
        <p className="text-xs text-slate-400">Prototipo visual con datos de demostración</p>
      </div>
    </aside>
  )
}

export { NAV_ITEMS }
