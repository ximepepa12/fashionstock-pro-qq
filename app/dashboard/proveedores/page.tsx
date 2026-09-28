'use client'

import { useState } from 'react'
import { Pencil, Plus, Truck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/dashboard/page-header'
import { AccessDenied } from '@/components/dashboard/access-denied'
import { ProveedorForm } from '@/components/dashboard/proveedor-form'
import type { Proveedor } from '@/lib/mock-data'
import { useMockStore } from '@/lib/mock-store'
import { toast } from 'sonner'

export default function ProveedoresPage() {
  const { session, proveedores, toggleProveedorActivo } = useMockStore()
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [proveedorEditando, setProveedorEditando] = useState<Proveedor | undefined>(undefined)

  if (!session) return null
  const esAdmin = session.rol === 'Administrador'

  function abrirNuevo() {
    setProveedorEditando(undefined)
    setDialogAbierto(true)
  }

  function abrirEditar(proveedor: Proveedor) {
    setProveedorEditando(proveedor)
    setDialogAbierto(true)
  }

  function handleToggle(proveedor: Proveedor) {
    toggleProveedorActivo(proveedor.id)
    toast.success(proveedor.activo ? `"${proveedor.nombre}" fue desactivado.` : `"${proveedor.nombre}" fue activado.`)
  }

  return (
    <div>
      <PageHeader
        title="Proveedores"
        description="Administra los proveedores registrados para el abastecimiento de inventario."
        actions={
          esAdmin && (
            <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
              <DialogTrigger
                render={<Button className="gap-2 bg-[#4f46e5] hover:bg-[#4338ca]" onClick={abrirNuevo} />}
              >
                <Plus className="size-4" />
                Nuevo proveedor
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{proveedorEditando ? 'Editar proveedor' : 'Registrar proveedor'}</DialogTitle>
                </DialogHeader>
                <ProveedorForm proveedor={proveedorEditando} onSaved={() => setDialogAbierto(false)} />
              </DialogContent>
            </Dialog>
          )
        }
      />

      <div className="rounded-2xl border border-slate-100 bg-white">
        {proveedores.length === 0 ? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Truck />
              </EmptyMedia>
              <EmptyTitle>No hay proveedores registrados</EmptyTitle>
              <EmptyDescription>Registra tu primer proveedor para gestionar tus compras.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proveedor</TableHead>
                <TableHead>NIT</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Estado</TableHead>
                {esAdmin && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {proveedores.map((proveedor) => (
                <TableRow key={proveedor.id}>
                  <TableCell className="font-medium text-slate-800">{proveedor.nombre}</TableCell>
                  <TableCell className="text-slate-500">{proveedor.nit}</TableCell>
                  <TableCell className="text-slate-500">{proveedor.telefono}</TableCell>
                  <TableCell className="text-slate-500">{proveedor.email}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        proveedor.activo ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-100'
                      }
                    >
                      {proveedor.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  {esAdmin && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Switch checked={proveedor.activo} onCheckedChange={() => handleToggle(proveedor)} aria-label="Activar o desactivar proveedor" />
                        <Button variant="ghost" size="icon" onClick={() => abrirEditar(proveedor)} aria-label={`Editar ${proveedor.nombre}`}>
                          <Pencil className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {!esAdmin && (
        <p className="mt-4 text-xs text-slate-400">Solo un administrador puede registrar, editar o desactivar proveedores.</p>
      )}
    </div>
  )
}
