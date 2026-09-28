'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/dashboard/page-header'
import { ClienteForm } from '@/components/dashboard/cliente-form'
import { useMockStore } from '@/lib/mock-store'

export default function ClientesPage() {
  const { clientes } = useMockStore()
  const [busqueda, setBusqueda] = useState('')
  const [dialogAbierto, setDialogAbierto] = useState(false)

  const filtrados = useMemo(
    () =>
      clientes.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()) ||
          cliente.documento.includes(busqueda.trim()),
      ),
    [clientes, busqueda],
  )

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Consulta y registra la información de tus clientes."
        actions={
          <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
          <DialogTrigger render={<Button className="gap-2 bg-[#4f46e5] hover:bg-[#4338ca]" />}>
              <Plus className="size-4" />
              Nuevo cliente
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar cliente</DialogTitle>
              </DialogHeader>
              <ClienteForm onSaved={() => setDialogAbierto(false)} />
            </DialogContent>
          </Dialog>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input placeholder="Buscar por nombre o documento" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} className="pl-9" />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white">
        {filtrados.length === 0 ? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users />
              </EmptyMedia>
              <EmptyTitle>No se encontraron clientes</EmptyTitle>
              <EmptyDescription>Ajusta la búsqueda o registra un nuevo cliente.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Ciudad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>
                    <Link href={`/dashboard/clientes/${cliente.id}`} className="font-medium text-slate-800 hover:text-[#4f46e5]">
                      {cliente.nombre}
                    </Link>
                  </TableCell>
                  <TableCell className="text-slate-500">{cliente.documento}</TableCell>
                  <TableCell className="text-slate-500">{cliente.telefono}</TableCell>
                  <TableCell className="text-slate-500">{cliente.ciudad}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
