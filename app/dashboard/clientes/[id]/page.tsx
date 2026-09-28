'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Pencil, UserRoundX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/dashboard/page-header'
import { ClienteForm } from '@/components/dashboard/cliente-form'
import { formatCOP, formatDate } from '@/lib/format'
import { useMockStore } from '@/lib/mock-store'

export default function ClienteDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { getCliente, ventas } = useMockStore()
  const [editando, setEditando] = useState(false)
  const cliente = getCliente(id)

  if (!cliente) {
    return (
      <div>
        <PageHeader title="Cliente no encontrado" />
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UserRoundX />
            </EmptyMedia>
            <EmptyTitle>Este cliente ya no existe</EmptyTitle>
            <EmptyDescription>Puede haber sido eliminado de la base de clientes.</EmptyDescription>
          </EmptyHeader>
        </Empty>
        <Button variant="outline" className="mt-4 gap-2" onClick={() => router.push('/dashboard/clientes')}>
          <ArrowLeft className="size-4" />
          Volver a clientes
        </Button>
      </div>
    )
  }

  const comprasCliente = ventas.filter((v) => v.clienteId === cliente.id)

  return (
    <div>
      <PageHeader
        title={cliente.nombre}
        description={`Documento ${cliente.documento} · ${cliente.ciudad || 'Sin ciudad registrada'}`}
        actions={
          <Dialog open={editando} onOpenChange={setEditando}>
            <Button className="gap-2 bg-[#4f46e5] hover:bg-[#4338ca]" onClick={() => setEditando(true)}>
              <Pencil className="size-4" />
              Editar cliente
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar cliente</DialogTitle>
              </DialogHeader>
              <ClienteForm cliente={cliente} onSaved={() => setEditando(false)} />
            </DialogContent>
          </Dialog>
        }
      />

      <Button variant="ghost" size="sm" className="mb-4 gap-2 text-slate-500" onClick={() => router.push('/dashboard/clientes')}>
        <ArrowLeft className="size-4" />
        Volver a clientes
      </Button>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <p className="mb-3 text-sm font-semibold text-slate-700">Información de contacto</p>
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-400">Teléfono</dt>
                <dd className="text-slate-700">{cliente.telefono || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Correo</dt>
                <dd className="text-slate-700">{cliente.email || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Dirección</dt>
                <dd className="text-right text-slate-700">{cliente.direccion || '—'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm lg:col-span-2">
          <CardContent className="p-6">
            <p className="mb-3 text-sm font-semibold text-slate-700">Historial de compras</p>
            {comprasCliente.length === 0 ? (
              <p className="text-sm text-slate-400">Este cliente aún no ha realizado compras.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factura</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comprasCliente.map((venta) => (
                    <TableRow key={venta.id}>
                      <TableCell className="font-medium text-slate-700">{venta.numeroFactura}</TableCell>
                      <TableCell className="text-slate-500">{formatDate(venta.fecha)}</TableCell>
                      <TableCell className="text-right text-slate-700">{formatCOP(venta.total)}</TableCell>
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
