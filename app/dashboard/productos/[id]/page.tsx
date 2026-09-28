'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { PackageSearch } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/page-header'
import { StockBadge } from '@/components/dashboard/stock-badge'
import { formatCOP } from '@/lib/format'
import { useMockStore } from '@/lib/mock-store'

export default function ProductoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { session, getProducto, entradas, salidas, proveedores } = useMockStore()
  const producto = getProducto(id)

  if (!session) return null

  if (!producto) {
    return (
      <div>
        <PageHeader title="Prenda no encontrada" />
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageSearch />
            </EmptyMedia>
            <EmptyTitle>Esta prenda ya no existe</EmptyTitle>
            <EmptyDescription>Puede haber sido eliminada del inventario.</EmptyDescription>
          </EmptyHeader>
        </Empty>
        <Button variant="outline" className="mt-4 gap-2" onClick={() => router.push('/dashboard/inventario')}>
          <ArrowLeft className="size-4" />
          Volver al inventario
        </Button>
      </div>
    )
  }

  const movimientosEntrada = entradas.filter((e) => e.productoId === producto.id)
  const movimientosSalida = salidas.filter((s) => s.productoId === producto.id)

  return (
    <div>
      <PageHeader
        title={producto.nombre}
        description={`${producto.categoria} · Talla ${producto.talla} · ${producto.color}`}
        actions={
          session.rol === 'Administrador' && (
            <Button
              className="gap-2 bg-[#4f46e5] hover:bg-[#4338ca]"
              nativeButton={false}
              render={<Link href={`/dashboard/productos/${producto.id}/editar`} />}
            >
              <Pencil className="size-4" />
              Editar prenda
            </Button>
          )
        }
      />

      <Button variant="ghost" size="sm" className="mb-4 gap-2 text-slate-500" onClick={() => router.push('/dashboard/inventario')}>
        <ArrowLeft className="size-4" />
        Volver al inventario
      </Button>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-100 shadow-sm lg:col-span-2">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">{producto.descripcion || 'Sin descripción registrada.'}</p>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Precio</p>
                <p className="mt-1 text-lg font-semibold text-slate-800">{formatCOP(producto.precioVenta)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Stock actual</p>
                <p className="mt-1 text-lg font-semibold text-slate-800">{producto.stock} unidades</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Estado</p>
                <div className="mt-1">
                  <StockBadge stock={producto.stock} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <p className="mb-3 text-sm font-semibold text-slate-700">Movimientos recientes</p>
            <div className="flex flex-col gap-3">
              {movimientosEntrada.slice(0, 3).map((entrada) => (
                <div key={entrada.id} className="rounded-lg border border-slate-100 px-3 py-2 text-sm">
                  <p className="font-medium text-emerald-600">+{entrada.cantidad} unidades</p>
                  <p className="text-xs text-slate-400">
                    {proveedores.find((p) => p.id === entrada.proveedorId)?.nombre ?? 'Proveedor'} · {entrada.fecha}
                  </p>
                </div>
              ))}
              {movimientosSalida.slice(0, 3).map((salida) => (
                <div key={salida.id} className="rounded-lg border border-slate-100 px-3 py-2 text-sm">
                  <p className="font-medium text-[#c9365b]">-{salida.cantidad} unidades</p>
                  <p className="text-xs text-slate-400">
                    {salida.tipo} · {salida.fecha}
                  </p>
                </div>
              ))}
              {movimientosEntrada.length === 0 && movimientosSalida.length === 0 && (
                <p className="text-sm text-slate-400">Sin movimientos registrados para esta prenda.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
