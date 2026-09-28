'use client'

import { useState, type FormEvent } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Rol } from '@/lib/mock-data'
import { useMockStore } from '@/lib/mock-store'
import { toast } from 'sonner'

export function UsuarioForm({ onSaved }: { onSaved?: () => void }) {
  const { addUsuario } = useMockStore()
  const [rol, setRol] = useState<Rol>('Empleado')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)
    const nombres = String(form.get('nombres') ?? '').trim()
    const apellidos = String(form.get('apellidos') ?? '').trim()
    const cedula = String(form.get('cedula') ?? '').trim()
    const fechaNacimiento = String(form.get('fechaNacimiento') ?? '').trim()
    const usuario = String(form.get('usuario') ?? '').trim()
    const password = String(form.get('password') ?? '')

    if (!nombres || !apellidos || !usuario || !password) {
      setError('Por favor complete los campos obligatorios.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    const resultado = addUsuario({ nombres, apellidos, cedula, fechaNacimiento, usuario, password, rol })
    if (!resultado.ok) {
      setError(resultado.error ?? 'No se pudo registrar el usuario.')
      return
    }
    toast.success('Usuario registrado correctamente.')
    event.currentTarget.reset()
    setRol('Empleado')
    onSaved?.()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-[#ff6b8b]/30 bg-[#fff2f5] p-3.5 text-sm text-[#c9365b]">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="nombres">Nombres</Label>
          <Input id="nombres" name="nombres" placeholder="Ej. Laura" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="apellidos">Apellidos</Label>
          <Input id="apellidos" name="apellidos" placeholder="Ej. Soto" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="cedula">Cédula</Label>
          <Input id="cedula" name="cedula" placeholder="Ej. 1102345678" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
          <Input id="fechaNacimiento" name="fechaNacimiento" type="date" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="usuario">Correo o nombre de usuario</Label>
        <Input id="usuario" name="usuario" placeholder="usuario@fashionstock.pro" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="password">Contraseña temporal</Label>
          <Input id="password" name="password" type="password" placeholder="Mínimo 6 caracteres" />
        </div>
        <div className="grid gap-2">
          <Label>Rol</Label>
          <Select value={rol} onValueChange={(value) => setRol(value as Rol)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Empleado">Empleado</SelectItem>
              <SelectItem value="Administrador">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="bg-[#4f46e5] hover:bg-[#4338ca]">
          Registrar usuario
        </Button>
      </div>
    </form>
  )
}
