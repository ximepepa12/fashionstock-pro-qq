import Link from 'next/link'
import { ArrowRight, BarChart3, Boxes, ReceiptText, ShieldCheck, ShoppingBag, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Logo } from '@/components/brand/logo'

const caracteristicas = [
  {
    icon: Boxes,
    titulo: 'Inventario en tiempo real',
    descripcion: 'Consulta existencias por categoría, talla y color, con alertas automáticas de bajo stock y agotados.',
  },
  {
    icon: ShoppingBag,
    titulo: 'Ventas y facturación',
    descripcion: 'Registra ventas, descuenta el inventario al instante y genera la factura visual de cada pedido.',
  },
  {
    icon: ReceiptText,
    titulo: 'Entradas y salidas',
    descripcion: 'Controla compras a proveedores, devoluciones y despachos con historial completo de movimientos.',
  },
  {
    icon: Users,
    titulo: 'Clientes y proveedores',
    descripcion: 'Administra tu directorio comercial y consulta el historial de compras de cada cliente.',
  },
  {
    icon: BarChart3,
    titulo: 'Reportes de gestión',
    descripcion: 'Visualiza inventario disponible, prendas más vendidas y ventas por rango de fechas.',
  },
  {
    icon: ShieldCheck,
    titulo: 'Roles y permisos',
    descripcion: 'Administradores y empleados con accesos diferenciados para proteger la información sensible.',
  },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Logo />
          <nav className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-slate-600"
              nativeButton={false}
              render={<Link href="/iniciar-sesion" />}
            >
              Iniciar sesión
            </Button>
            <Button
              className="bg-[#4f46e5] hover:bg-[#4338ca]"
              nativeButton={false}
              render={<Link href="/registro" />}
            >
              Crear cuenta
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#ff6b8b] px-6 py-24 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6">
          <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em]">
            Prototipo visual FashionStock Pro
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Gestiona el inventario de tu tienda de ropa sin perder ni una prenda.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-white/85">
            FashionStock Pro centraliza tus productos, ventas, entradas, salidas, clientes y proveedores en un solo
            lugar, con reportes claros para tomar mejores decisiones cada día.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              size="lg"
              className="bg-white text-[#4f46e5] hover:bg-white/90"
              nativeButton={false}
              render={<Link href="/registro" />}
            >
              Crear cuenta gratis
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              nativeButton={false}
              render={<Link href="/iniciar-sesion" />}
            >
              Ya tengo cuenta
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#4f46e5]">Todo lo que necesitas</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Un sistema completo para tu negocio de moda</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {caracteristicas.map((item) => (
            <Card key={item.titulo} className="border-slate-100 shadow-sm">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="grid size-11 place-items-center rounded-xl bg-[#f3f4ff] text-[#4f46e5]">
                  <item.icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{item.titulo}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">{item.descripcion}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-[#f3f4ff] px-6 py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Empieza a controlar tu inventario hoy mismo
          </h2>
          <p className="max-w-xl text-base leading-7 text-slate-500">
            Ingresa con las credenciales de demostración o crea tu propia cuenta para explorar el prototipo completo.
          </p>
          <Button
            size="lg"
            className="bg-[#4f46e5] hover:bg-[#4338ca]"
            nativeButton={false}
            render={<Link href="/iniciar-sesion" />}
          >
            Ir al inicio de sesión
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </section>

      <footer className="border-t border-slate-100 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-slate-400 sm:flex-row">
          <span>© 2026 FashionStock Pro</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/identidad-visual" className="hover:text-[#4f46e5]">
              Identidad visual
            </Link>
            <Link href="/diagrama" className="hover:text-[#4f46e5]">
              Diagrama de acceso
            </Link>
            <span>Prototipo visual con datos de demostración</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
