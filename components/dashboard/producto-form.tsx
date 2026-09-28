'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CATEGORIAS, TALLAS, type Producto } from '@/lib/mock-data'
import { useMockStore } from '@/lib/mock-store'
import { toast } from 'sonner'

export function ProductoForm({ producto }: { producto?: Producto }) {
  const router = useRouter()
  const { addProducto, updateProducto } = useMockStore()
  const [categoria, setCategoria] = useState(producto?.categoria ?? '')
  const [talla, setTalla] = useState(producto?.talla ?? '')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)
    const nombre = String(form.get('nombre') ?? '').trim()
    const descripcion = String(form.get('descripcion') ?? '').trim()
    const color = String(form.get('color') ?? '').trim()
    const precioVenta = Number(form.get('precioVenta'))
    const stock = Number(form.get('stock'))

    if (!nombre || !categoria || !talla || !color) {
      setError('Por favor complete los campos obligatorios.')
      return
    }
    if (!Number.isFinite(precioVenta) || precioVenta <= 0) {
      setError('Ingrese un precio de venta válido.')
      return
    }
    if (!Number.isFinite(stock) || stock < 0) {
      setError('Ingrese una cantidad de stock válida.')
      return
    }

    const data = { nombre, descripcion, categoria, talla, color, precioVenta, stock }
    const resultado = producto ? updateProducto(producto.id, data) : addProducto(data)
    if (!resultado.ok) {
      setError(resultado.error ?? 'No se pudo guardar el producto.')
      return
    }
    toast.success(producto ? 'Producto actualizado' : 'Producto registrado')
    router.push('/dashboard/inventario')
  }

  return (
    <Card className="max-w-2xl border-slate-100 shadow-sm">
      <CardContent className="p-6">
        <Button variant="ghost" size="sm" className="mb-4 gap-2 text-slate-500" onClick={() => router.push('/dashboard/inventario')}>
          <ArrowLeft className="size-4" />
          Volver al inventario
        </Button>

        {error && (
          <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-[#ff6b8b]/30 bg-[#fff2f5] p-3.5 text-sm text-[#c9365b]">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre de la prenda</Label>
            <Input id="nombre" name="nombre" defaultValue={producto?.nombre} placeholder="Ej. Camiseta oversized blanca" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea id="descripcion" name="descripcion" defaultValue={producto?.descripcion} placeholder="Detalles del material, corte o cuidado." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Categoría</Label>
              <Select value={categoria} onValueChange={(value) => setCategoria(value ?? categoria)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Talla</Label>
              <Select value={talla} onValueChange={(value) => setTalla(value ?? talla)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una talla" />
                </SelectTrigger>
                <SelectContent>
                  {TALLAS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <Input id="color" name="color" defaultValue={producto?.color} placeholder="Ej. Blanco" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="precioVenta">Precio de venta</Label>
              <Input id="precioVenta" name="precioVenta" type="number" min={0} step={100} defaultValue={producto?.precioVenta} placeholder="Ej. 45900" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock inicial</Label>
              <Input id="stock" name="stock" type="number" min={0} defaultValue={producto?.stock ?? 0} placeholder="Ej. 10" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard/inventario')}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#4f46e5] hover:bg-[#4338ca]">
              {producto ? 'Guardar cambios' : 'Registrar prenda'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
