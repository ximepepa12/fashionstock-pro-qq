'use client'

import { useState, type FormEvent } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Cliente } from '@/lib/mock-data'
import { useMockStore } from '@/lib/mock-store'
import { toast } from 'sonner'

export function ClienteForm({ cliente, onSaved }: { cliente?: Cliente; onSaved?: () => void }) {
  const { addCliente, updateCliente } = useMockStore()
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)
    const nombre = String(form.get('nombre') ?? '').trim()
    const documento = String(form.get('documento') ?? '').trim()
    const telefono = String(form.get('telefono') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const direccion = String(form.get('direccion') ?? '').trim()
    const ciudad = String(form.get('ciudad') ?? '').trim()

    if (!nombre || !documento) {
      setError('Por favor complete los campos obligatorios.')
      return
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingrese un correo electrónico válido.')
      return
    }

    const data = { nombre, documento, telefono, email, direccion, ciudad }
    const resultado = cliente ? updateCliente(cliente.id, data) : addCliente(data)
    if (!resultado.ok) {
      setError(resultado.error ?? 'No se pudo guardar el cliente.')
      return
    }
    toast.success(cliente ? 'Cliente actualizado correctamente.' : 'Cliente registrado correctamente.')
    if (!cliente) event.currentTarget.reset()
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
          <Label htmlFor="nombre">Nombre completo</Label>
          <Input id="nombre" name="nombre" defaultValue={cliente?.nombre} placeholder="Ej. Diana Marcela Ríos" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="documento">Documento</Label>
          <Input id="documento" name="documento" defaultValue={cliente?.documento} placeholder="Ej. 1042358901" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" name="telefono" defaultValue={cliente?.telefono} placeholder="Ej. 3104558712" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" name="email" type="email" defaultValue={cliente?.email} placeholder="nombre@correo.com" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input id="direccion" name="direccion" defaultValue={cliente?.direccion} placeholder="Ej. Calle 45 # 12-30" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ciudad">Ciudad</Label>
          <Input id="ciudad" name="ciudad" defaultValue={cliente?.ciudad} placeholder="Ej. Manizales" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="bg-[#4f46e5] hover:bg-[#4338ca]">
          {cliente ? 'Guardar cambios' : 'Registrar cliente'}
        </Button>
      </div>
    </form>
  )
}
