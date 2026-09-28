'use client'

import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { PageHeader } from '@/components/dashboard/page-header'
import { AccessDenied } from '@/components/dashboard/access-denied'
import { formatCOP } from '@/lib/format'
import { useMockStore } from '@/lib/mock-store'

const chartConfig: ChartConfig = {
  total: { label: 'Ventas', color: 'var(--chart-1)' },
  cantidad: { label: 'Unidades', color: 'var(--chart-2)' },
}

export default function ReportesPage() {
  const { session, ventas, productos, compras } = useMockStore()

  const ventasPorDia = useMemo(() => {
    const mapa = new Map<string, number>()
    for (const venta of ventas) {
      mapa.set(venta.fecha, (mapa.get(venta.fecha) ?? 0) + venta.total)
    }
    return Array.from(mapa.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([fecha, total]) => ({ fecha: fecha.slice(5), total }))
  }, [ventas])

  const topProductos = useMemo(() => {
    const mapa = new Map<string, number>()
    for (const venta of ventas) {
      for (const linea of venta.lineas) {
        mapa.set(linea.productoId, (mapa.get(linea.productoId) ?? 0) + linea.cantidad)
      }
    }
    return Array.from(mapa.entries())
      .map(([productoId, cantidad]) => ({
        nombre: productos.find((p) => p.id === productoId)?.nombre ?? 'Prenda eliminada',
        cantidad,
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 6)
  }, [ventas, productos])

  const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0)
  const totalCompras = compras.reduce((sum, c) => sum + c.total, 0)
  const ticketPromedio = ventas.length > 0 ? Math.round(totalVentas / ventas.length) : 0

  if (!session) return null

  if (session.rol !== 'Administrador') {
    return (
      <div>
        <PageHeader title="Reportes" />
        <AccessDenied />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Reportes" description="Analiza el desempeño de ventas, compras e inventario." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Ventas totales</p>
            <p className="mt-1 text-2xl font-semibold text-slate-800">{formatCOP(totalVentas)}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Ticket promedio</p>
            <p className="mt-1 text-2xl font-semibold text-slate-800">{formatCOP(ticketPromedio)}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Compras totales</p>
            <p className="mt-1 text-2xl font-semibold text-slate-800">{formatCOP(totalCompras)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-700">Ventas por día</CardTitle>
          </CardHeader>
          <CardContent>
            {ventasPorDia.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-400">Sin datos de ventas para graficar.</p>
            ) : (
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <LineChart data={ventasPorDia} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="fecha" tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line dataKey="total" type="monotone" stroke="var(--color-total)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-700">Prendas más vendidas</CardTitle>
          </CardHeader>
          <CardContent>
            {topProductos.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-400">Sin datos de ventas para graficar.</p>
            ) : (
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <BarChart data={topProductos} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="nombre" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="cantidad" fill="var(--color-cantidad)" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
