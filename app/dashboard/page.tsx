'use client'

import Link from 'next/link'
import { AlertTriangle, ArrowRight, Boxes, ShoppingBag, TrendingUp, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/dashboard/page-header'
import { StockBadge } from '@/components/dashboard/stock-badge'
import { formatCOP, formatDate } from '@/lib/format'
import { useMockStore } from '@/lib/mock-store'

export default function DashboardPage() {
  const { session, productos, ventas, clientes } = useMockStore()
  if (!session) return null

  const totalUnidades = productos.reduce((sum, p) => sum + p.stock, 0)
  const bajoStock = productos.filter((p) => p.stock > 0 && p.stock <= 5)
  const agotados = productos.filter((p) => p.stock === 0)
  const ventasHoy = ventas.filter((v) => v.fecha === new Date().toISOString().slice(0, 10))
  const totalVentasMes = ventas.reduce((sum, v) => sum + v.total, 0)
  const ultimasVentas = ventas.slice(0, 5)

  return (
    <div>
      <PageHeader title={`Hola, ${session.nombreCompleto.split(' ')[0]}`} description="Resumen general de tu inventario y ventas." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-slate-500">Unidades en stock</p>
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
              <p className="text-sm text-slate-500">Ventas de hoy</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{ventasHoy.length}</p>
            </div>
            <div className="grid size-11 place-items-center rounded-xl bg-[#fff2f5] text-[#c9365b]">
              <ShoppingBag className="size-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-slate-500">Ingresos registrados</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{formatCOP(totalVentasMes)}</p>
            </div>
            <div className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="size-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-slate-500">Clientes registrados</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{clientes.length}</p>
            </div>
            <div className="grid size-11 place-items-center rounded-xl bg-violet-50 text-violet-600">
              <Users className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-100 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Últimas ventas</CardTitle>
            <Link href="/dashboard/ventas" className="flex items-center gap-1 text-sm font-medium text-[#4f46e5] hover:underline">
              Ver todas
              <ArrowRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factura</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimasVentas.map((venta) => (
                  <TableRow key={venta.id}>
                    <TableCell className="font-medium text-slate-700">{venta.numeroFactura}</TableCell>
                    <TableCell className="text-slate-500">{formatDate(venta.fecha)}</TableCell>
                    <TableCell className="text-right font-medium text-slate-700">{formatCOP(venta.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-amber-500" />
              Alertas de inventario
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {agotados.length === 0 && bajoStock.length === 0 && (
              <p className="text-sm text-slate-500">No hay alertas de inventario por el momento.</p>
            )}
            {[...agotados, ...bajoStock].slice(0, 6).map((producto) => (
              <div key={producto.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
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
