'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  IVA_PORCENTAJE,
  seedClientes,
  seedCompras,
  seedEntradas,
  seedProductos,
  seedProveedores,
  seedSalidas,
  seedUsuarios,
  seedVentas,
  type Cliente,
  type Compra,
  type EntradaMercancia,
  type LineaCompra,
  type LineaVenta,
  type Producto,
  type Proveedor,
  type Rol,
  type SalidaMercancia,
  type TipoSalida,
  type Usuario,
  type Venta,
} from '@/lib/mock-data'

export interface SessionUsuario {
  id: string
  nombreCompleto: string
  usuario: string
  rol: Rol
}

const SESSION_KEY = 'fsp_session'

interface Resultado {
  ok: boolean
  error?: string
}

interface MockStoreValue {
  session: SessionUsuario | null
  sessionReady: boolean
  login: (usuario: string, password: string) => Resultado
  logout: () => void
  register: (data: { nombres: string; apellidos: string; cedula: string; fechaNacimiento: string; usuario: string; password: string }) => Resultado

  productos: Producto[]
  getProducto: (id: string) => Producto | undefined
  addProducto: (data: Omit<Producto, 'id' | 'activo'>) => Resultado
  updateProducto: (id: string, data: Omit<Producto, 'id' | 'activo'>) => Resultado
  deleteProducto: (id: string) => void

  clientes: Cliente[]
  getCliente: (id: string) => Cliente | undefined
  addCliente: (data: Omit<Cliente, 'id'>) => Resultado
  updateCliente: (id: string, data: Omit<Cliente, 'id'>) => Resultado

  proveedores: Proveedor[]
  getProveedor: (id: string) => Proveedor | undefined
  addProveedor: (data: Omit<Proveedor, 'id' | 'activo'>) => Resultado
  updateProveedor: (id: string, data: Omit<Proveedor, 'id' | 'activo'>) => Resultado
  toggleProveedorActivo: (id: string) => void

  usuarios: Usuario[]
  addUsuario: (data: Omit<Usuario, 'id' | 'activo'>) => Resultado
  toggleUsuarioActivo: (id: string) => void

  entradas: EntradaMercancia[]
  addEntrada: (data: Omit<EntradaMercancia, 'id'>) => Resultado

  salidas: SalidaMercancia[]
  addSalida: (data: { tipo: TipoSalida; productoId: string; cantidad: number; observacion: string }) => Resultado

  ventas: Venta[]
  addVenta: (data: { clienteId: string | null; lineas: LineaVenta[] }) => { ok: boolean; error?: string; venta?: Venta }

  compras: Compra[]
  addCompra: (data: { proveedorId: string; lineas: LineaCompra[] }) => Resultado
  recibirCompra: (id: string) => void
}

const MockStoreContext = createContext<MockStoreValue | null>(null)

function readSession(): SessionUsuario | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as SessionUsuario) : null
  } catch {
    return null
  }
}

function nextId(prefix: string, length: number) {
  return `${prefix}-${Date.now()}-${length}`
}

export function MockStoreProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>(() => seedProductos())
  const [clientes, setClientes] = useState<Cliente[]>(() => seedClientes())
  const [proveedores, setProveedores] = useState<Proveedor[]>(() => seedProveedores())
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => seedUsuarios())
  const [entradas, setEntradas] = useState<EntradaMercancia[]>(() => seedEntradas())
  const [salidas, setSalidas] = useState<SalidaMercancia[]>(() => seedSalidas())
  const [ventas, setVentas] = useState<Venta[]>(() => seedVentas())
  const [compras, setCompras] = useState<Compra[]>(() => seedCompras())

  const [session, setSession] = useState<SessionUsuario | null>(null)
  const [sessionReady, setSessionReady] = useState(false)

  useState(() => {
    if (typeof window !== 'undefined') {
      setSession(readSession())
      setSessionReady(true)
    }
    return null
  })

  const persistSession = useCallback((value: SessionUsuario | null) => {
    setSession(value)
    if (typeof window === 'undefined') return
    if (value) window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(value))
    else window.sessionStorage.removeItem(SESSION_KEY)
  }, [])

  const login = useCallback<MockStoreValue['login']>((usuarioInput, password) => {
    const usuarioLower = usuarioInput.trim().toLowerCase()
    const encontrado = usuarios.find((u) => u.usuario.toLowerCase() === usuarioLower)
    if (!encontrado || encontrado.password !== password || !encontrado.activo) {
      return { ok: false, error: 'Usuario o contraseña incorrectos. Verifica tus credenciales e intenta de nuevo.' }
    }
    persistSession({
      id: encontrado.id,
      nombreCompleto: `${encontrado.nombres} ${encontrado.apellidos}`.trim(),
      usuario: encontrado.usuario,
      rol: encontrado.rol,
    })
    return { ok: true }
  }, [usuarios, persistSession])

  const logout = useCallback(() => {
    persistSession(null)
  }, [persistSession])

  const register = useCallback<MockStoreValue['register']>((data) => {
    const usuarioLower = data.usuario.trim().toLowerCase()
    if (usuarios.some((u) => u.usuario.toLowerCase() === usuarioLower)) {
      return { ok: false, error: 'Ya existe una cuenta registrada con ese correo electrónico.' }
    }
    const nuevo: Usuario = {
      id: nextId('usr', usuarios.length),
      nombres: data.nombres,
      apellidos: data.apellidos,
      cedula: data.cedula,
      fechaNacimiento: data.fechaNacimiento,
      usuario: data.usuario,
      password: data.password,
      rol: 'Empleado',
      activo: true,
    }
    setUsuarios((prev) => [...prev, nuevo])
    persistSession({ id: nuevo.id, nombreCompleto: `${nuevo.nombres} ${nuevo.apellidos}`.trim(), usuario: nuevo.usuario, rol: nuevo.rol })
    return { ok: true }
  }, [usuarios, persistSession])

  const getProducto = useCallback((id: string) => productos.find((p) => p.id === id), [productos])
  const getCliente = useCallback((id: string) => clientes.find((c) => c.id === id), [clientes])
  const getProveedor = useCallback((id: string) => proveedores.find((p) => p.id === id), [proveedores])

  const addProducto = useCallback<MockStoreValue['addProducto']>((data) => {
    if (!data.nombre.trim() || !data.categoria || !data.talla || !data.color.trim() || data.precioVenta <= 0) {
      return { ok: false, error: 'Complete todos los campos obligatorios del producto.' }
    }
    setProductos((prev) => [...prev, { ...data, id: nextId('prd', prev.length), activo: true }])
    return { ok: true }
  }, [])

  const updateProducto = useCallback<MockStoreValue['updateProducto']>((id, data) => {
    if (!data.nombre.trim() || !data.categoria || !data.talla || !data.color.trim() || data.precioVenta <= 0) {
      return { ok: false, error: 'Complete todos los campos obligatorios del producto.' }
    }
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
    return { ok: true }
  }, [])

  const deleteProducto = useCallback((id: string) => {
    setProductos((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const addCliente = useCallback<MockStoreValue['addCliente']>((data) => {
    if (!data.nombre.trim() || !data.documento.trim()) {
      return { ok: false, error: 'Complete el nombre y el documento del cliente.' }
    }
    setClientes((prev) => [...prev, { ...data, id: nextId('cli', prev.length) }])
    return { ok: true }
  }, [])

  const updateCliente = useCallback<MockStoreValue['updateCliente']>((id, data) => {
    if (!data.nombre.trim() || !data.documento.trim()) {
      return { ok: false, error: 'Complete el nombre y el documento del cliente.' }
    }
    setClientes((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
    return { ok: true }
  }, [])

  const addProveedor = useCallback<MockStoreValue['addProveedor']>((data) => {
    if (!data.nombre.trim() || !data.nit.trim()) {
      return { ok: false, error: 'Complete el nombre y el NIT del proveedor.' }
    }
    setProveedores((prev) => [...prev, { ...data, id: nextId('prov', prev.length), activo: true }])
    return { ok: true }
  }, [])

  const updateProveedor = useCallback<MockStoreValue['updateProveedor']>((id, data) => {
    if (!data.nombre.trim() || !data.nit.trim()) {
      return { ok: false, error: 'Complete el nombre y el NIT del proveedor.' }
    }
    setProveedores((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
    return { ok: true }
  }, [])

  const toggleProveedorActivo = useCallback((id: string) => {
    setProveedores((prev) => prev.map((p) => (p.id === id ? { ...p, activo: !p.activo } : p)))
  }, [])

  const addUsuario = useCallback<MockStoreValue['addUsuario']>((data) => {
    const usuarioLower = data.usuario.trim().toLowerCase()
    if (!data.nombres.trim() || !data.apellidos.trim() || !data.usuario.trim() || !data.password.trim()) {
      return { ok: false, error: 'Complete todos los campos obligatorios del usuario.' }
    }
    if (usuarios.some((u) => u.usuario.toLowerCase() === usuarioLower)) {
      return { ok: false, error: 'Ya existe un usuario con ese correo o nombre de usuario.' }
    }
    setUsuarios((prev) => [...prev, { ...data, id: nextId('usr', prev.length), activo: true }])
    return { ok: true }
  }, [usuarios])

  const toggleUsuarioActivo = useCallback((id: string) => {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u)))
  }, [])

  const addEntrada = useCallback<MockStoreValue['addEntrada']>((data) => {
    if (!data.productoId || !data.proveedorId || data.cantidad <= 0) {
      return { ok: false, error: 'Seleccione producto, proveedor y una cantidad válida.' }
    }
    setEntradas((prev) => [{ ...data, id: nextId('ent', prev.length) }, ...prev])
    setProductos((prev) => prev.map((p) => (p.id === data.productoId ? { ...p, stock: p.stock + data.cantidad } : p)))
    return { ok: true }
  }, [])

  const addSalida = useCallback<MockStoreValue['addSalida']>((data) => {
    if (!data.productoId || data.cantidad <= 0) {
      return { ok: false, error: 'Seleccione un producto y una cantidad válida.' }
    }
    const producto = productos.find((p) => p.id === data.productoId)
    if (!producto || producto.stock < data.cantidad) {
      return { ok: false, error: 'No hay disponibilidad suficiente para completar la salida o la venta.' }
    }
    setSalidas((prev) => [{ ...data, id: nextId('sal', prev.length), fecha: new Date().toISOString().slice(0, 10) }, ...prev])
    setProductos((prev) => prev.map((p) => (p.id === data.productoId ? { ...p, stock: p.stock - data.cantidad } : p)))
    return { ok: true }
  }, [productos])

  const addVenta = useCallback<MockStoreValue['addVenta']>((data) => {
    if (data.lineas.length === 0) {
      return { ok: false, error: 'Agregue al menos una prenda a la venta.' }
    }
    for (const linea of data.lineas) {
      const producto = productos.find((p) => p.id === linea.productoId)
      if (!producto || producto.stock < linea.cantidad) {
        return { ok: false, error: 'No hay disponibilidad suficiente para completar la salida o la venta.' }
      }
    }
    const subtotal = data.lineas.reduce((sum, l) => sum + l.cantidad * l.precioUnitario, 0)
    const iva = Math.round(subtotal * IVA_PORCENTAJE)
    const venta: Venta = {
      id: nextId('venta', ventas.length),
      numeroFactura: `FSP-2026-${String(ventas.length + 1).padStart(3, '0')}`,
      clienteId: data.clienteId,
      fecha: new Date().toISOString().slice(0, 10),
      lineas: data.lineas,
      subtotal,
      iva,
      total: subtotal + iva,
    }
    setVentas((prev) => [venta, ...prev])
    setProductos((prev) =>
      prev.map((p) => {
        const linea = data.lineas.find((l) => l.productoId === p.id)
        return linea ? { ...p, stock: p.stock - linea.cantidad } : p
      }),
    )
    return { ok: true, venta }
  }, [productos, ventas])

  const addCompra = useCallback<MockStoreValue['addCompra']>((data) => {
    if (!data.proveedorId || data.lineas.length === 0) {
      return { ok: false, error: 'Seleccione un proveedor y agregue al menos una prenda.' }
    }
    const total = data.lineas.reduce((sum, l) => sum + l.cantidad * l.costoUnitario, 0)
    setCompras((prev) => [
      { id: nextId('compra', prev.length), proveedorId: data.proveedorId, fecha: new Date().toISOString().slice(0, 10), estado: 'Registrada', lineas: data.lineas, total },
      ...prev,
    ])
    return { ok: true }
  }, [])

  const recibirCompra = useCallback((id: string) => {
    setCompras((prev) => {
      const compra = prev.find((c) => c.id === id)
      if (!compra || compra.estado === 'Recibida') return prev
      setProductos((prevProductos) =>
        prevProductos.map((p) => {
          const linea = compra.lineas.find((l) => l.productoId === p.id)
          return linea ? { ...p, stock: p.stock + linea.cantidad } : p
        }),
      )
      return prev.map((c) => (c.id === id ? { ...c, estado: 'Recibida' } : c))
    })
  }, [])

  const value = useMemo<MockStoreValue>(
    () => ({
      session,
      sessionReady,
      login,
      logout,
      register,
      productos,
      getProducto,
      addProducto,
      updateProducto,
      deleteProducto,
      clientes,
      getCliente,
      addCliente,
      updateCliente,
      proveedores,
      getProveedor,
      addProveedor,
      updateProveedor,
      toggleProveedorActivo,
      usuarios,
      addUsuario,
      toggleUsuarioActivo,
      entradas,
      addEntrada,
      salidas,
      addSalida,
      ventas,
      addVenta,
      compras,
      addCompra,
      recibirCompra,
    }),
    [
      session,
      sessionReady,
      login,
      logout,
      register,
      productos,
      getProducto,
      addProducto,
      updateProducto,
      deleteProducto,
      clientes,
      getCliente,
      addCliente,
      updateCliente,
      proveedores,
      getProveedor,
      addProveedor,
      updateProveedor,
      toggleProveedorActivo,
      usuarios,
      addUsuario,
      toggleUsuarioActivo,
      entradas,
      addEntrada,
      salidas,
      addSalida,
      ventas,
      addVenta,
      compras,
      addCompra,
      recibirCompra,
    ],
  )

  return <MockStoreContext.Provider value={value}>{children}</MockStoreContext.Provider>
}

export function useMockStore() {
  const ctx = useContext(MockStoreContext)
  if (!ctx) throw new Error('useMockStore debe usarse dentro de MockStoreProvider')
  return ctx
}
