'use client'

import { Logo } from '@/components/brand/logo'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCOP, formatDate } from '@/lib/format'
import type { Venta } from '@/lib/mock-data'
import { useMockStore } from '@/lib/mock-store'

export function FacturaVisual({ venta }: { venta: Venta }) {
  const { productos, clientes } = useMockStore()
  const cliente = venta.clienteId ? clientes.find((c) => c.id === venta.clienteId) : null

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <Logo />
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f46e5]">Factura de venta</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{venta.numeroFactura}</p>
          <p className="text-sm text-slate-500">{formatDate(venta.fecha)}</p>
        </div>
      </div>

      <Separator className="my-5" />

      <div className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Cliente</p>
          <p className="mt-1 font-medium text-slate-800">{cliente?.nombre ?? 'Consumidor final'}</p>
          {cliente && (
            <p className="text-slate-500">
              {cliente.documento} · {cliente.ciudad}
            </p>
          )}
        </div>
        <div className="sm:text-right">
          <p className="text-xs uppercase tracking-wide text-slate-400">Emitida por</p>
          <p className="mt-1 font-medium text-slate-800">FashionStock Pro</p>
          <p className="text-slate-500">Prototipo visual con datos de demostración</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prenda</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Precio unitario</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {venta.lineas.map((linea) => {
              const producto = productos.find((p) => p.id === linea.productoId)
              return (
                <TableRow key={`${venta.id}-${linea.productoId}`}>
                  <TableCell className="font-medium text-slate-700">{producto?.nombre ?? 'Prenda eliminada'}</TableCell>
                  <TableCell className="text-right text-slate-500">{linea.cantidad}</TableCell>
                  <TableCell className="text-right text-slate-500">{formatCOP(linea.precioUnitario)}</TableCell>
                  <TableCell className="text-right text-slate-700">{formatCOP(linea.cantidad * linea.precioUnitario)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-5 ml-auto flex w-full max-w-xs flex-col gap-2 text-sm">
        <div className="flex justify-between text-slate-500">
          <span>Subtotal</span>
          <span>{formatCOP(venta.subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>IVA (19%)</span>
          <span>{formatCOP(venta.iva)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-semibold text-slate-800">
          <span>Total</span>
          <span>{formatCOP(venta.total)}</span>
        </div>
      </div>
    </div>
  )
}
