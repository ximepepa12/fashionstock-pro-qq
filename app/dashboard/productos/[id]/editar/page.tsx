'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, PackageSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { PageHeader } from '@/components/dashboard/page-header'
import { AccessDenied } from '@/components/dashboard/access-denied'
import { ProductoForm } from '@/components/dashboard/producto-form'
import { useMockStore } from '@/lib/mock-store'

export default function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { session, getProducto } = useMockStore()
  const producto = getProducto(id)

  if (!session) return null

  if (session.rol !== 'Administrador') {
    return (
      <div>
        <PageHeader title="Editar prenda" />
        <AccessDenied />
      </div>
    )
  }

  if (!producto) {
    return (
      <div>
        <PageHeader title="Prenda no encontrada" />
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageSearch />
            </EmptyMedia>
            <EmptyTitle>Esta prenda ya no existe</EmptyTitle>
            <EmptyDescription>Puede haber sido eliminada del inventario.</EmptyDescription>
          </EmptyHeader>
        </Empty>
        <Button variant="outline" className="mt-4 gap-2" onClick={() => router.push('/dashboard/inventario')}>
          <ArrowLeft className="size-4" />
          Volver al inventario
        </Button>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Editar prenda" description={`Actualiza la información de "${producto.nombre}".`} />
      <ProductoForm producto={producto} />
    </div>
  )
}
