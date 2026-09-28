'use client'

import Link from 'next/link'
import { AlertTriangle, ArrowRight, Boxes, ShoppingBag, TrendingDown, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/dashboard/page-header'
import { StockBadge } from '@/components/dashboard/stock-badge'
import { formatCOP, formatDate } from '@/lib/format'
import { useMockStore } from '@/lib/mock-store'

export default function DashboardPage() {
  const { session, productos, ventas, clientes, entradas, salidas } = useMockStore()
  if (!session) return null

  const totalUnidades = productos.reduce((sum, p) => sum + p.stock, 0)
  const bajoStock = productos.filter((p) => p.stock > 0 && p.stock <= 5)
  const agotados = productos.filter((p) => p.stock === 0)
  const inicioMes = new Date()
  inicioMes.setDate(1)
  const inicioIso = inicioMes.toISOString().slice(0, 10)
  const ventasPeriodo = ventas.filter((v) => v.fecha >= inicioIso)
  const totalVentasPeriodo = ventasPeriodo.reduce((sum, v) => sum + v.total, 0)

  const movimientos = [
    ...ventas.map((venta) => ({
      id: venta.id,
      fecha: venta.fecha,
      tipo: 'Venta',
      detalle: venta.numeroFactura,
      cantidad: venta.lineas.reduce((sum, l) => sum + l.cantidad, 0),
    })),
    ...entradas.map((entrada) => ({
      id: entrada.id,
      fecha: entrada.fecha,
      tipo: 'Entrada',
      detalle: productos.find((p) => p.id === entrada.productoId)?.nombre ?? 'Prenda',
      cantidad: entrada.cantidad,
    })),
    ...salidas.map((salida) => ({
      id: salida.id,
      fecha: salida.fecha,
      tipo: salida.tipo,
      detalle: productos.find((p) => p.id === salida.productoId)?.nombre ?? 'Prenda',
      cantidad: salida.cantidad,
    })),
  ]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 8)

  return (
    <div>
      <PageHeader title={`Hola, ${session.nombreCompleto.split(' ')[0]}`} description="Resumen general de tu inventario y ventas." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-slate-500">Prendas en stock</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{totalUnidades}</p>
            </div>
            <div className="grid size-11 place-items-center rounded-xl bg-[#f3f4ff] text-[#4f46e5]">
              <Boxes className="size-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-slate-500">Bajo stock</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{bajoStock.length}</p>
            </div>
            <div className="grid size-11 place-items-center rounded-xl bg-[#fff2f5] text-[#c9365b]">
              <TrendingDown className="size-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-slate-500">Agotados</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{agotados.length}</p>
            </div>
            <div className="grid size-11 place-items-center rounded-xl bg-[#fff2f5] text-[#c9365b]">
              <AlertTriangle className="size-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-slate-500">Ventas del período</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{formatCOP(totalVentasPeriodo)}</p>
            </div>
            <div className="grid size-11 place-items-center rounded-xl bg-[#f3f4ff] text-[#4f46e5]">
              <ShoppingBag className="size-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-slate-500">Clientes</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{clientes.length}</p>
            </div>
            <div className="grid size-11 place-items-center rounded-xl bg-[#f3f4ff] text-[#4f46e5]">
              <Users className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-100 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Últimos movimientos</CardTitle>
            <Link href="/dashboard/inventario" className="flex items-center gap-1 text-sm font-medium text-[#4f46e5] hover:underline">
              Ver inventario
              <ArrowRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Detalle</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movimientos.map((movimiento) => (
                  <TableRow key={movimiento.id}>
                    <TableCell className="text-slate-500">{formatDate(movimiento.fecha)}</TableCell>
                    <TableCell className="font-medium text-slate-700">{movimiento.tipo}</TableCell>
                    <TableCell className="text-slate-500">{movimiento.detalle}</TableCell>
                    <TableCell className="text-right text-slate-700">{movimiento.cantidad}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-[#ff6b8b]/30 bg-[#fff2f5] shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-[#c9365b]">
              <AlertTriangle className="size-4" />
              Alertas de bajo stock
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {agotados.length === 0 && bajoStock.length === 0 && (
              <p className="text-sm text-slate-500">No hay alertas de inventario por el momento.</p>
            )}
            {[...agotados, ...bajoStock].slice(0, 6).map((producto) => (
              <div key={producto.id} className="flex items-center justify-between rounded-lg border border-[#ff6b8b]/20 bg-white px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-slate-700">{producto.nombre}</p>
                  <p className="text-xs text-slate-400">
                    {producto.categoria} · Talla {producto.talla}
                  </p>
                </div>
                <StockBadge stock={producto.stock} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
