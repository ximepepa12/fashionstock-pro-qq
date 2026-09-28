'use client'

import { useState, type FormEvent } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Proveedor } from '@/lib/mock-data'
import { useMockStore } from '@/lib/mock-store'
import { toast } from 'sonner'

export function ProveedorForm({ proveedor, onSaved }: { proveedor?: Proveedor; onSaved?: () => void }) {
  const { addProveedor, updateProveedor } = useMockStore()
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)
    const nombre = String(form.get('nombre') ?? '').trim()
    const nit = String(form.get('nit') ?? '').trim()
    const telefono = String(form.get('telefono') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()

    if (!nombre || !nit) {
      setError('Por favor complete los campos obligatorios.')
      return
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingrese un correo electrónico válido.')
      return
    }

    const data = { nombre, nit, telefono, email }
    const resultado = proveedor ? updateProveedor(proveedor.id, data) : addProveedor(data)
    if (!resultado.ok) {
      setError(resultado.error ?? 'No se pudo guardar el proveedor.')
      return
    }
    toast.success(proveedor ? 'Proveedor actualizado correctamente.' : 'Proveedor registrado correctamente.')
    if (!proveedor) event.currentTarget.reset()
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
      <div className="grid gap-2">
        <Label htmlFor="nombre">Nombre o razón social</Label>
        <Input id="nombre" name="nombre" defaultValue={proveedor?.nombre} placeholder="Ej. Textiles Andinos S.A.S." />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="nit">NIT</Label>
          <Input id="nit" name="nit" defaultValue={proveedor?.nit} placeholder="Ej. 900123456-1" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" name="telefono" defaultValue={proveedor?.telefono} placeholder="Ej. 6068801234" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input id="email" name="email" type="email" defaultValue={proveedor?.email} placeholder="ventas@proveedor.com" />
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="bg-[#4f46e5] hover:bg-[#4338ca]">
          {proveedor ? 'Guardar cambios' : 'Registrar proveedor'}
        </Button>
      </div>
    </form>
  )
}
