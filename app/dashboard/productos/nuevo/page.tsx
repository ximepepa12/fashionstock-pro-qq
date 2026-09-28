'use client'

import { PageHeader } from '@/components/dashboard/page-header'
import { AccessDenied } from '@/components/dashboard/access-denied'
import { ProductoForm } from '@/components/dashboard/producto-form'
import { useMockStore } from '@/lib/mock-store'

export default function NuevoProductoPage() {
  const { session } = useMockStore()
  if (!session) return null

  if (session.rol !== 'Administrador') {
    return (
      <div>
        <PageHeader title="Registrar prenda" />
        <AccessDenied />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Registrar prenda" description="Agrega una nueva prenda al inventario." />
      <ProductoForm />
    </div>
  )
}
