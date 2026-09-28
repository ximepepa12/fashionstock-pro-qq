'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowLeft, Plus, Receipt, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/dashboard/page-header'
import { IVA_PORCENTAJE, type LineaVenta } from '@/lib/mock-data'
import { formatCOP } from '@/lib/format'
import { useMockStore } from '@/lib/mock-store'
import { toast } from 'sonner'

export default function NuevaVentaPage() {
  const router = useRouter()
  const { productos, clientes, addVenta } = useMockStore()
  const [clienteId, setClienteId] = useState<string>('mostrador')
  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [lineas, setLineas] = useState<LineaVenta[]>([])
  const [error, setError] = useState('')

  const subtotal = useMemo(() => lineas.reduce((sum, l) => sum + l.cantidad * l.precioUnitario, 0), [lineas])
  const iva = Math.round(subtotal * IVA_PORCENTAJE)
  const total = subtotal + iva

  function agregarLinea() {
    setError('')
    const producto = productos.find((p) => p.id === productoSeleccionado)
    if (!producto) {
      setError('Seleccione una prenda para agregar a la venta.')
      return
    }
    if (producto.stock <= 0) {
      setError('No hay disponibilidad suficiente para completar la salida o la venta.')
      return
    }
    setLineas((prev) => {
      const existente = prev.find((l) => l.productoId === producto.id)
      if (existente) {
        if (existente.cantidad + 1 > producto.stock) {
          setError('No hay disponibilidad suficiente para completar la salida o la venta.')
          return prev
        }
        return prev.map((l) => (l.productoId === producto.id ? { ...l, cantidad: l.cantidad + 1 } : l))
      }
      return [...prev, { productoId: producto.id, cantidad: 1, precioUnitario: producto.precioVenta }]
    })
    setProductoSeleccionado('')
  }

  function actualizarCantidad(productoId: string, cantidad: number) {
    const producto = productos.find((p) => p.id === productoId)
    if (!producto) return
    if (cantidad < 1) return
    if (cantidad > producto.stock) {
      setError('No hay disponibilidad suficiente para completar la salida o la venta.')
      return
    }
    setError('')
    setLineas((prev) => prev.map((l) => (l.productoId === productoId ? { ...l, cantidad } : l)))
  }

  function quitarLinea(productoId: string) {
    setLineas((prev) => prev.filter((l) => l.productoId !== productoId))
  }

  function handleFinalizar() {
    setError('')
    const resultado = addVenta({ clienteId: clienteId === 'mostrador' ? null : clienteId, lineas })
    if (!resultado.ok) {
      setError(resultado.error ?? 'No se pudo registrar la venta.')
      return
    }
    toast.success(`Venta ${resultado.venta?.numeroFactura} registrada correctamente.`)
    router.push('/dashboard/ventas')
  }

  return (
    <div>
      <PageHeader title="Nueva venta" description="Agrega prendas al carrito y genera la factura de venta." />

      <Button variant="ghost" size="sm" className="mb-4 gap-2 text-slate-500" onClick={() => router.push('/dashboard/ventas')}>
        <ArrowLeft className="size-4" />
        Volver a ventas
      </Button>

      {error && (
        <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-[#ff6b8b]/30 bg-[#fff2f5] p-3.5 text-sm text-[#c9365b]">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-slate-100 shadow-sm lg:col-span-2">
          <CardContent className="p-6">
            <div className="mb-5 grid gap-4 sm:grid-cols-[1fr_auto]">
              <div className="grid gap-2">
                <Label>Prenda</Label>
                <Select value={productoSeleccionado} onValueChange={(value) => setProductoSeleccionado(value ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una prenda para agregar" />
                  </SelectTrigger>
                  <SelectContent>
                    {productos.map((producto) => (
                      <SelectItem key={producto.id} value={producto.id} disabled={producto.stock <= 0}>
                        {producto.nombre} · {formatCOP(producto.precioVenta)} · {producto.stock} disp.
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" onClick={agregarLinea} className="self-end gap-2 bg-[#4f46e5] hover:bg-[#4338ca]">
                <Plus className="size-4" />
                Agregar
              </Button>
            </div>

            {lineas.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
                Agrega prendas para armar la venta.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prenda</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineas.map((linea) => {
                    const producto = productos.find((p) => p.id === linea.productoId)
                    return (
                      <TableRow key={linea.productoId}>
                        <TableCell className="font-medium text-slate-700">{producto?.nombre}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="size-7"
                              onClick={() => actualizarCantidad(linea.productoId, linea.cantidad - 1)}
                            >
                              −
                            </Button>
                            <span className="w-6 text-center">{linea.cantidad}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="size-7"
                              onClick={() => actualizarCantidad(linea.productoId, linea.cantidad + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-slate-500">{formatCOP(linea.precioUnitario)}</TableCell>
                        <TableCell className="text-right font-medium text-slate-700">
                          {formatCOP(linea.cantidad * linea.precioUnitario)}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => quitarLinea(linea.productoId)} aria-label="Quitar prenda">
                            <Trash2 className="size-4 text-[#c9365b]" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardContent className="flex flex-col gap-5 p-6">
            <div className="grid gap-2">
              <Label>Cliente</Label>
              <Select value={clienteId} onValueChange={(value) => setClienteId(value ?? '')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mostrador">Venta de mostrador</SelectItem>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{formatCOP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>IVA (19%)</span>
                <span>{formatCOP(iva)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-semibold text-slate-800">
                <span>Total</span>
                <span>{formatCOP(total)}</span>
              </div>
            </div>

            <Button
              type="button"
              disabled={lineas.length === 0}
              onClick={handleFinalizar}
              className="gap-2 bg-[#4f46e5] hover:bg-[#4338ca]"
            >
              <Receipt className="size-4" />
              Finalizar venta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
