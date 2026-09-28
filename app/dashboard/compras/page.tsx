'use client'

import { useMemo, useState } from 'react'
import { AlertCircle, ClipboardList, Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/dashboard/page-header'
import type { LineaCompra } from '@/lib/mock-data'
import { formatCOP, formatDate } from '@/lib/format'
import { useMockStore } from '@/lib/mock-store'
import { toast } from 'sonner'

export default function ComprasPage() {
  const { productos, proveedores, compras, addCompra, recibirCompra } = useMockStore()
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [proveedorId, setProveedorId] = useState('')
  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [lineas, setLineas] = useState<LineaCompra[]>([])
  const [error, setError] = useState('')

  const total = useMemo(() => lineas.reduce((sum, l) => sum + l.cantidad * l.costoUnitario, 0), [lineas])

  function agregarLinea() {
    setError('')
    const producto = productos.find((p) => p.id === productoSeleccionado)
    if (!producto) {
      setError('Seleccione una prenda para agregar a la compra.')
      return
    }
    if (lineas.some((l) => l.productoId === producto.id)) {
      setError('Esta prenda ya fue agregada a la compra.')
      return
    }
    setLineas((prev) => [...prev, { productoId: producto.id, cantidad: 1, costoUnitario: Math.round(producto.precioVenta * 0.55) }])
    setProductoSeleccionado('')
  }

  function actualizarLinea(productoId: string, field: 'cantidad' | 'costoUnitario', value: number) {
    if (value < 0) return
    setLineas((prev) => prev.map((l) => (l.productoId === productoId ? { ...l, [field]: value } : l)))
  }

  function quitarLinea(productoId: string) {
    setLineas((prev) => prev.filter((l) => l.productoId !== productoId))
  }

  function handleRegistrar() {
    setError('')
    if (!proveedorId) {
      setError('Seleccione un proveedor y agregue al menos una prenda.')
      return
    }
    const resultado = addCompra({ proveedorId, lineas })
    if (!resultado.ok) {
      setError(resultado.error ?? 'No se pudo registrar la compra.')
      return
    }
    toast.success('Orden de compra registrada correctamente.')
    setDialogAbierto(false)
    setProveedorId('')
    setLineas([])
  }

  function handleRecibir(id: string) {
    recibirCompra(id)
    toast.success('Compra marcada como recibida. El stock fue actualizado.')
  }

  return (
    <div>
      <PageHeader
        title="Compras a proveedores"
        description="Registra órdenes de compra y confirma la recepción de mercancía."
        actions={
          <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
            <DialogTrigger render={<Button className="gap-2 bg-[#4f46e5] hover:bg-[#4338ca]" />}>
              <Plus className="size-4" />
              Nueva compra
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Registrar orden de compra</DialogTitle>
              </DialogHeader>
              {error && (
                <div role="alert" className="flex items-start gap-3 rounded-xl border border-[#ff6b8b]/30 bg-[#fff2f5] p-3.5 text-sm text-[#c9365b]">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="grid gap-2">
                <Label>Proveedor</Label>
                <Select value={proveedorId} onValueChange={(value) => setProveedorId(value ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores.map((proveedor) => (
                      <SelectItem key={proveedor.id} value={proveedor.id}>
                        {proveedor.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="grid gap-2">
                  <Label>Prenda</Label>
                  <Select value={productoSeleccionado} onValueChange={(value) => setProductoSeleccionado(value ?? '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una prenda" />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map((producto) => (
                        <SelectItem key={producto.id} value={producto.id}>
                          {producto.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" variant="outline" onClick={agregarLinea}>
                  Agregar
                </Button>
              </div>

              {lineas.length > 0 && (
                <div className="flex flex-col gap-2 rounded-xl border border-slate-100 p-3">
                  {lineas.map((linea) => {
                    const producto = productos.find((p) => p.id === linea.productoId)
                    return (
                      <div key={linea.productoId} className="flex items-center gap-2 text-sm">
                        <span className="flex-1 font-medium text-slate-700">{producto?.nombre}</span>
                        <input
                          type="number"
                          min={1}
                          value={linea.cantidad}
                          onChange={(event) => actualizarLinea(linea.productoId, 'cantidad', Number(event.target.value))}
                          className="w-16 rounded-md border border-slate-200 px-2 py-1 text-right"
                        />
                        <input
                          type="number"
                          min={0}
                          value={linea.costoUnitario}
                          onChange={(event) => actualizarLinea(linea.productoId, 'costoUnitario', Number(event.target.value))}
                          className="w-24 rounded-md border border-slate-200 px-2 py-1 text-right"
                        />
                        <Button variant="ghost" size="icon" onClick={() => quitarLinea(linea.productoId)}>
                          <Trash2 className="size-4 text-[#c9365b]" />
                        </Button>
                      </div>
                    )
                  })}
                  <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-semibold text-slate-800">
                    <span>Total</span>
                    <span>{formatCOP(total)}</span>
                  </div>
                </div>
              )}

              <Button onClick={handleRegistrar} className="mt-2 bg-[#4f46e5] hover:bg-[#4338ca]">
                Registrar orden de compra
              </Button>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="rounded-2xl border border-slate-100 bg-white">
        {compras.length === 0 ? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ClipboardList />
              </EmptyMedia>
              <EmptyTitle>No hay compras registradas</EmptyTitle>
              <EmptyDescription>Registra una orden de compra para reponer tu inventario.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proveedor</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Prendas</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {compras.map((compra) => (
                <TableRow key={compra.id}>
                  <TableCell className="font-medium text-slate-700">
                    {proveedores.find((p) => p.id === compra.proveedorId)?.nombre ?? 'Proveedor'}
                  </TableCell>
                  <TableCell className="text-slate-500">{formatDate(compra.fecha)}</TableCell>
                  <TableCell className="text-right text-slate-500">{compra.lineas.reduce((sum, l) => sum + l.cantidad, 0)}</TableCell>
                  <TableCell className="text-right text-slate-700">{formatCOP(compra.total)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        compra.estado === 'Recibida'
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                      }
                    >
                      {compra.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {compra.estado === 'Registrada' && (
                      <Button size="sm" variant="outline" onClick={() => handleRecibir(compra.id)}>
                        Marcar recibida
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
