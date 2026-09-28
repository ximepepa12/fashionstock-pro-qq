'use client'

import { useState, type FormEvent } from 'react'
import { AlertCircle, PackagePlus } from 'lucide-react'
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
import { toast } from 'sonner'

export default function EntradasPage() {
  const { productos, proveedores, entradas, addEntrada } = useMockStore()
  const [productoId, setProductoId] = useState('')
  const [proveedorId, setProveedorId] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)
    const cantidad = Number(form.get('cantidad'))
    const observacion = String(form.get('observacion') ?? '').trim()
    const fecha = String(form.get('fecha') ?? '').trim() || new Date().toISOString().slice(0, 10)

    if (!productoId || !proveedorId) {
      setError('Por favor complete los campos obligatorios.')
      return
    }
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      setError('Ingrese una cantidad válida.')
      return
    }

    const resultado = addEntrada({ productoId, proveedorId, cantidad, observacion, fecha })
    if (!resultado.ok) {
      setError(resultado.error ?? 'No se pudo registrar la entrada.')
      return
    }
    const producto = productos.find((p) => p.id === productoId)
    toast.success(`Inventario actualizado. Nuevo stock: ${(producto?.stock ?? 0) + cantidad} unidades.`)
    event.currentTarget.reset()
    setProductoId('')
    setProveedorId('')
  }

  return (
    <div>
      <PageHeader title="Entradas de mercancía" description="Registra el ingreso de prendas al inventario." />

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
                <Label>Prenda</Label>
                <Select value={productoId} onValueChange={(value) => setProductoId(value ?? '')}>
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
              <div className="grid gap-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input id="cantidad" name="cantidad" type="number" min={1} placeholder="Ej. 20" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input id="fecha" name="fecha" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="observacion">Observación</Label>
                <Textarea id="observacion" name="observacion" placeholder="Ej. Reposición de temporada" />
              </div>
              <Button type="submit" className="mt-1 gap-2 bg-[#4f46e5] hover:bg-[#4338ca]">
                <PackagePlus className="size-4" />
                Registrar entrada
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm lg:col-span-2">
          <CardContent className="p-0">
            {entradas.length === 0 ? (
              <Empty className="py-16">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <PackagePlus />
                  </EmptyMedia>
                  <EmptyTitle>Sin entradas registradas</EmptyTitle>
                  <EmptyDescription>Registra la primera entrada de mercancía usando el formulario.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prenda</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entradas.map((entrada) => (
                    <TableRow key={entrada.id}>
                      <TableCell className="font-medium text-slate-700">
                        {productos.find((p) => p.id === entrada.productoId)?.nombre ?? 'Prenda eliminada'}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {proveedores.find((p) => p.id === entrada.proveedorId)?.nombre ?? 'Proveedor'}
                      </TableCell>
                      <TableCell className="text-right text-emerald-600">+{entrada.cantidad}</TableCell>
                      <TableCell className="text-slate-500">{formatDate(entrada.fecha)}</TableCell>
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
