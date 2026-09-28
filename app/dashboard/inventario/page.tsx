'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Boxes, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/dashboard/page-header'
import { StockBadge } from '@/components/dashboard/stock-badge'
import { CATEGORIAS } from '@/lib/mock-data'
import { formatCOP } from '@/lib/format'
import { useMockStore } from '@/lib/mock-store'
import { toast } from 'sonner'

export default function InventarioPage() {
  const router = useRouter()
  const { session, productos, deleteProducto } = useMockStore()
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('todas')

  const esAdmin = session?.rol === 'Administrador'

  const filtrados = useMemo(() => {
    return productos.filter((producto) => {
      const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
      const coincideCategoria = categoria === 'todas' || producto.categoria === categoria
      return coincideBusqueda && coincideCategoria
    })
  }, [productos, busqueda, categoria])

  function handleDelete(id: string, nombre: string) {
    deleteProducto(id)
    toast.success(`"${nombre}" fue eliminado del inventario.`)
  }

  return (
    <div>
      <PageHeader
        title="Inventario"
        description="Consulta y administra las prendas disponibles en tu tienda."
        actions={
          esAdmin && (
            <Button className="gap-2 bg-[#4f46e5] hover:bg-[#4338ca]" onClick={() => router.push('/dashboard/productos/nuevo')}>
              <Plus className="size-4" />
              Registrar prenda
            </Button>
          )
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Buscar prenda por nombre" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} className="pl-9" />
        </div>
        <Select value={categoria} onValueChange={(value) => setCategoria(value ?? 'todas')}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las categorías</SelectItem>
            {CATEGORIAS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white">
        {filtrados.length === 0 ? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Boxes />
              </EmptyMedia>
              <EmptyTitle>No se encontraron prendas</EmptyTitle>
              <EmptyDescription>Ajusta la búsqueda o el filtro de categoría para ver otros resultados.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prenda</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Talla</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell>
                    <Link href={`/dashboard/productos/${producto.id}`} className="font-medium text-slate-800 hover:text-[#4f46e5]">
                      {producto.nombre}
                    </Link>
                  </TableCell>
                  <TableCell className="text-slate-500">{producto.categoria}</TableCell>
                  <TableCell className="text-slate-500">{producto.talla}</TableCell>
                  <TableCell className="text-slate-500">{producto.color}</TableCell>
                  <TableCell className="text-right text-slate-700">{formatCOP(producto.precioVenta)}</TableCell>
                  <TableCell className="text-right text-slate-700">{producto.stock}</TableCell>
                  <TableCell>
                    <StockBadge stock={producto.stock} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {esAdmin ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            nativeButton={false}
                            render={<Link href={`/dashboard/productos/${producto.id}/editar`} aria-label={`Editar ${producto.nombre}`} />}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <AlertDialog>
                          <AlertDialogTrigger
                            render={<Button variant="ghost" size="icon" aria-label={`Eliminar ${producto.nombre}`} />}
                          >
                            <Trash2 className="size-4 text-[#c9365b]" />
                          </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar esta prenda?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará &quot;{producto.nombre}&quot; del inventario. No se puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-[#c9365b] hover:bg-[#b12e4f]"
                                  onClick={() => handleDelete(producto.id, producto.nombre)}
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          nativeButton={false}
                          render={<Link href={`/dashboard/productos/${producto.id}`} />}
                        >
                          Ver detalle
                        </Button>
                      )}
                    </div>
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
