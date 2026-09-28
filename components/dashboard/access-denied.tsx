import { ShieldAlert } from 'lucide-react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

export function AccessDenied() {
  return (
    <Empty className="rounded-2xl border border-dashed border-slate-200 bg-[#fbfbfe] py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-[#ff6b8b]/15 text-[#c9365b]">
          <ShieldAlert />
        </EmptyMedia>
        <EmptyTitle>No tiene permisos para realizar esta acción</EmptyTitle>
        <EmptyDescription>Contacte al administrador si necesita acceso a esta sección.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
