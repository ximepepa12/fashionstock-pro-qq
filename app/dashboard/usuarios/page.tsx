'use client'

import { useState } from 'react'
import { Plus, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/dashboard/page-header'
import { AccessDenied } from '@/components/dashboard/access-denied'
import { UsuarioForm } from '@/components/dashboard/usuario-form'
import { useMockStore } from '@/lib/mock-store'
import { toast } from 'sonner'

export default function UsuariosPage() {
  const { session, usuarios, toggleUsuarioActivo } = useMockStore()
  const [dialogAbierto, setDialogAbierto] = useState(false)

  if (!session) return null

  if (session.rol !== 'Administrador') {
    return (
      <div>
        <PageHeader title="Usuarios" />
        <AccessDenied />
      </div>
    )
  }

  function handleToggle(id: string, nombre: string, activo: boolean) {
    if (id === session?.id) {
      toast.error('No puedes desactivar tu propia cuenta.')
      return
    }
    toggleUsuarioActivo(id)
    toast.success(activo ? `"${nombre}" fue desactivado.` : `"${nombre}" fue activado.`)
  }

  return (
    <div>
      <PageHeader
        title="Usuarios del sistema"
        description="Gestiona el equipo con acceso a FashionStock Pro y sus roles."
        actions={
          <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
            <DialogTrigger render={<Button className="gap-2 bg-[#4f46e5] hover:bg-[#4338ca]" />}>
              <Plus className="size-4" />
              Nuevo usuario
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-[#4f46e5]" />
                  Registrar usuario
                </DialogTitle>
              </DialogHeader>
              <UsuarioForm onSaved={() => setDialogAbierto(false)} />
            </DialogContent>
          </Dialog>
        }
      />

      <div className="rounded-2xl border border-slate-100 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell className="font-medium text-slate-800">
                  {usuario.nombres} {usuario.apellidos}
                </TableCell>
                <TableCell className="text-slate-500">{usuario.usuario}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      usuario.rol === 'Administrador'
                        ? 'bg-[#4f46e5]/10 text-[#4f46e5] hover:bg-[#4f46e5]/10'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-100'
                    }
                  >
                    {usuario.rol}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={usuario.activo ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-100'}
                  >
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Switch
                    checked={usuario.activo}
                    onCheckedChange={() => handleToggle(usuario.id, `${usuario.nombres} ${usuario.apellidos}`, usuario.activo)}
                    aria-label="Activar o desactivar usuario"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
