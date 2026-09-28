'use client'

import Link from 'next/link'
import { Plus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/dashboard/page-header'
import { formatCOP, formatDate } from '@/lib/format'
import { useMockStore } from '@/lib/mock-store'

export default function VentasPage() {
  const { ventas, clientes } = useMockStore()

  return (
    <div>
      <PageHeader
        title="Ventas"
        description="Historial de facturas generadas en el punto de venta."
        actions={
          <Button
            className="gap-2 bg-[#4f46e5] hover:bg-[#4338ca]"
            nativeButton={false}
            render={<Link href="/dashboard/ventas/nueva" />}
          >
            <Plus className="size-4" />
            Nueva venta
          </Button>
        }
      />

      <div className="rounded-2xl border border-slate-100 bg-white">
        {ventas.length === 0 ? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShoppingBag />
              </EmptyMedia>
              <EmptyTitle>Aún no hay ventas registradas</EmptyTitle>
              <EmptyDescription>Registra tu primera venta para verla en este historial.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factura</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Prendas</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
                <TableHead className="text-right">IVA</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventas.map((venta) => (
                <TableRow key={venta.id}>
                  <TableCell className="font-medium text-slate-700">{venta.numeroFactura}</TableCell>
                  <TableCell className="text-slate-500">
                    {venta.clienteId ? clientes.find((c) => c.id === venta.clienteId)?.nombre ?? 'Cliente' : 'Venta de mostrador'}
                  </TableCell>
                  <TableCell className="text-slate-500">{formatDate(venta.fecha)}</TableCell>
                  <TableCell className="text-right text-slate-500">{venta.lineas.reduce((sum, l) => sum + l.cantidad, 0)}</TableCell>
                  <TableCell className="text-right text-slate-500">{formatCOP(venta.subtotal)}</TableCell>
                  <TableCell className="text-right text-slate-500">{formatCOP(venta.iva)}</TableCell>
                  <TableCell className="text-right font-semibold text-slate-800">{formatCOP(venta.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
