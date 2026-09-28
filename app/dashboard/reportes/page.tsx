'use client'

import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/dashboard/page-header'
import { AccessDenied } from '@/components/dashboard/access-denied'
import { StockBadge } from '@/components/dashboard/stock-badge'
import { formatCOP, formatDate } from '@/lib/format'
import { useMockStore } from '@/lib/mock-store'
import { toast } from 'sonner'

const VISTAS = [
  { id: 'inventario', label: 'Inventario disponible' },
  { id: 'bajo-stock', label: 'Bajo stock' },
  { id: 'mas-vendidos', label: 'Más vendidos' },
  { id: 'ventas', label: 'Ventas por fechas' },
  { id: 'compras', label: 'Compras y entradas' },
] as const

type Vista = (typeof VISTAS)[number]['id']

export default function ReportesPage() {
  const { session, ventas, productos, compras, entradas, proveedores } = useMockStore()
  const [vista, setVista] = useState<Vista>('inventario')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')

  const ventasFiltradas = useMemo(() => {
    return ventas.filter((venta) => {
      if (desde && venta.fecha < desde) return false
      if (hasta && venta.fecha > hasta) return false
      return true
    })
  }, [ventas, desde, hasta])

  const topProductos = useMemo(() => {
    const mapa = new Map<string, number>()
    for (const venta of ventasFiltradas) {
      for (const linea of venta.lineas) {
        mapa.set(linea.productoId, (mapa.get(linea.productoId) ?? 0) + linea.cantidad)
      }
    }
    return Array.from(mapa.entries())
      .map(([productoId, cantidad]) => ({
        producto: productos.find((p) => p.id === productoId),
        cantidad,
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
  }, [ventasFiltradas, productos])

  if (!session) return null

  if (session.rol !== 'Administrador') {
    return (
      <div>
        <PageHeader title="Reportes" />
        <AccessDenied />
      </div>
    )
  }

  function exportar() {
    toast.success('En el prototipo la exportación es visual. El reporte ya está listo para consulta.')
  }

  return (
    <div>
      <PageHeader
        title="Reportes"
        description="Consulta inventario, ventas, compras y entradas de demostración."
        actions={
          <Button variant="outline" className="gap-2" onClick={exportar}>
            <Download className="size-4" />
            Exportar
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {VISTAS.map((item) => (
          <Button
            key={item.id}
            type="button"
            variant={vista === item.id ? 'default' : 'outline'}
            className={vista === item.id ? 'bg-[#4f46e5] hover:bg-[#4338ca]' : ''}
            onClick={() => setVista(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {vista === 'inventario' && (
        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Inventario disponible</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prenda</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Talla</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-medium text-slate-700">{producto.nombre}</TableCell>
                    <TableCell className="text-slate-500">{producto.categoria}</TableCell>
                    <TableCell className="text-slate-500">{producto.talla}</TableCell>
                    <TableCell className="text-right">{producto.stock}</TableCell>
                    <TableCell>
                      <StockBadge stock={producto.stock} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {vista === 'bajo-stock' && (
        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Prendas con bajo stock o agotadas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prenda</TableHead>
                  <TableHead>Talla</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos
                  .filter((p) => p.stock <= 5)
                  .map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell className="font-medium text-slate-700">{producto.nombre}</TableCell>
                      <TableCell className="text-slate-500">{producto.talla}</TableCell>
                      <TableCell className="text-right">{producto.stock}</TableCell>
                      <TableCell>
                        <StockBadge stock={producto.stock} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {vista === 'mas-vendidos' && (
        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Prendas más vendidas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prenda</TableHead>
                  <TableHead className="text-right">Unidades vendidas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProductos.map((item) => (
                  <TableRow key={item.producto?.id ?? item.cantidad}>
                    <TableCell className="font-medium text-slate-700">{item.producto?.nombre ?? 'Prenda eliminada'}</TableCell>
                    <TableCell className="text-right">{item.cantidad}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {vista === 'ventas' && (
        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Ventas por rango de fechas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
              <Input type="date" value={desde} onChange={(event) => setDesde(event.target.value)} aria-label="Fecha desde" />
              <Input type="date" value={hasta} onChange={(event) => setHasta(event.target.value)} aria-label="Fecha hasta" />
            </div>
            <p className="mb-3 text-sm text-slate-500">
              Total del rango: {formatCOP(ventasFiltradas.reduce((sum, v) => sum + v.total, 0))}
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factura</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ventasFiltradas.map((venta) => (
                  <TableRow key={venta.id}>
                    <TableCell className="font-medium text-slate-700">{venta.numeroFactura}</TableCell>
                    <TableCell className="text-slate-500">{formatDate(venta.fecha)}</TableCell>
                    <TableCell className="text-right">{formatCOP(venta.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {vista === 'compras' && (
        <div className="grid gap-4">
          <Card className="border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Compras a proveedores</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compras.map((compra) => (
                    <TableRow key={compra.id}>
                      <TableCell className="font-medium text-slate-700">
                        {proveedores.find((p) => p.id === compra.proveedorId)?.nombre ?? 'Proveedor'}
                      </TableCell>
                      <TableCell className="text-slate-500">{formatDate(compra.fecha)}</TableCell>
                      <TableCell className="text-slate-500">{compra.estado}</TableCell>
                      <TableCell className="text-right">{formatCOP(compra.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Entradas de mercancía</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prenda</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entradas.map((entrada) => (
                    <TableRow key={entrada.id}>
                      <TableCell className="font-medium text-slate-700">
                        {productos.find((p) => p.id === entrada.productoId)?.nombre ?? 'Prenda'}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {proveedores.find((p) => p.id === entrada.proveedorId)?.nombre ?? 'Proveedor'}
                      </TableCell>
                      <TableCell className="text-slate-500">{formatDate(entrada.fecha)}</TableCell>
                      <TableCell className="text-right">+{entrada.cantidad}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
