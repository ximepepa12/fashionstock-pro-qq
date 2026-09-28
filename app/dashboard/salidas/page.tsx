'use client'

import { useState, type FormEvent } from 'react'
import { AlertCircle, ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader } from '@/components/dashboard/page-header'
import { formatDate } from '@/lib/format'
import { useMockStore } from '@/lib/mock-store'
import type { TipoSalida } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function SalidasPage() {
  const { productos, salidas, addSalida } = useMockStore()
  const [productoId, setProductoId] = useState('')
  const [tipo, setTipo] = useState<TipoSalida>('Devolución a proveedor')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)
    const cantidad = Number(form.get('cantidad'))
    const observacion = String(form.get('observacion') ?? '').trim()

    if (!productoId) {
      setError('Por favor complete los campos obligatorios.')
      return
    }
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      setError('Ingrese una cantidad válida.')
      return
    }

    const resultado = addSalida({ productoId, tipo, cantidad, observacion })
    if (!resultado.ok) {
      setError(resultado.error ?? 'No se pudo registrar la salida.')
      return
    }
    const producto = productos.find((p) => p.id === productoId)
    toast.success(`Inventario actualizado. Nueva cantidad: ${(producto?.stock ?? 0) - cantidad} unidades.`)
    event.currentTarget.reset()
    setProductoId('')
  }

  return (
    <div>
      <PageHeader title="Salidas de mercancía" description="Registra devoluciones a proveedor u otras salidas de inventario." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-slate-100 shadow-sm lg:col-span-1">
          <CardContent className="p-6">
            {error && (
              <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-[#ff6b8b]/30 bg-[#fff2f5] p-3.5 text-sm text-[#c9365b]">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label>Tipo de salida</Label>
                <Select value={tipo} onValueChange={(value) => setTipo(value as TipoSalida)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Devolución a proveedor">Devolución a proveedor</SelectItem>
                    <SelectItem value="Venta">Venta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Prenda</Label>
                <Select value={productoId} onValueChange={(value) => setProductoId(value ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una prenda" />
                  </SelectTrigger>
                  <SelectContent>
                    {productos.map((producto) => (
                      <SelectItem key={producto.id} value={producto.id}>
                        {producto.nombre} · {producto.stock} disp.
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input id="cantidad" name="cantidad" type="number" min={1} placeholder="Ej. 2" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="observacion">Observación</Label>
                <Textarea id="observacion" name="observacion" placeholder="Ej. Prenda con defecto de fábrica" />
              </div>
              <Button type="submit" className="mt-1 gap-2 bg-[#4f46e5] hover:bg-[#4338ca]">
                <ArrowLeftRight className="size-4" />
                Registrar salida
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm lg:col-span-2">
          <CardContent className="p-0">
            {salidas.length === 0 ? (
              <Empty className="py-16">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ArrowLeftRight />
                  </EmptyMedia>
                  <EmptyTitle>Sin salidas registradas</EmptyTitle>
                  <EmptyDescription>Registra la primera salida de mercancía usando el formulario.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prenda</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salidas.map((salida) => (
                    <TableRow key={salida.id}>
                      <TableCell className="font-medium text-slate-700">
                        {productos.find((p) => p.id === salida.productoId)?.nombre ?? 'Prenda eliminada'}
                      </TableCell>
                      <TableCell className="text-slate-500">{salida.tipo}</TableCell>
                      <TableCell className="text-right text-[#c9365b]">-{salida.cantidad}</TableCell>
                      <TableCell className="text-slate-500">{formatDate(salida.fecha)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
