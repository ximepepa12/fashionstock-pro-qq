export type Rol = 'Administrador' | 'Empleado'

export interface Usuario {
  id: string
  nombres: string
  apellidos: string
  cedula: string
  fechaNacimiento: string
  usuario: string
  password: string
  rol: Rol
  activo: boolean
}

export interface Producto {
  id: string
  nombre: string
  descripcion: string
  categoria: string
  talla: string
  color: string
  precioVenta: number
  stock: number
  activo: boolean
}

export interface Cliente {
  id: string
  nombre: string
  documento: string
  telefono: string
  email: string
  direccion: string
  ciudad: string
}

export interface Proveedor {
  id: string
  nombre: string
  nit: string
  telefono: string
  email: string
  activo: boolean
}

export interface EntradaMercancia {
  id: string
  productoId: string
  cantidad: number
  proveedorId: string
  fecha: string
  observacion: string
}

export type TipoSalida = 'Venta' | 'Devolución a proveedor'

export interface SalidaMercancia {
  id: string
  tipo: TipoSalida
  productoId: string
  cantidad: number
  fecha: string
  observacion: string
}

export interface LineaVenta {
  productoId: string
  cantidad: number
  precioUnitario: number
}

export interface Venta {
  id: string
  numeroFactura: string
  clienteId: string | null
  fecha: string
  lineas: LineaVenta[]
  subtotal: number
  iva: number
  total: number
}

export type EstadoCompra = 'Registrada' | 'Recibida'

export interface LineaCompra {
  productoId: string
  cantidad: number
  costoUnitario: number
}

export interface Compra {
  id: string
  proveedorId: string
  fecha: string
  estado: EstadoCompra
  lineas: LineaCompra[]
  total: number
}

export const CATEGORIAS = ['Camisetas', 'Pantalones', 'Vestidos', 'Chaquetas', 'Accesorios', 'Calzado'] as const
export const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'Única', '28', '30', '32', '34', '36', '38', '40'] as const

export const IVA_PORCENTAJE = 0.19

/** Correos equivalentes a las cuentas demo de usuario corto. */
export const LOGIN_ALIASES: Record<string, string> = {
  'admin@fashionstock.pro': 'admin',
  'empleado@fashionstock.pro': 'empleado',
}

export function seedUsuarios(): Usuario[] {
  return [
    { id: 'usr-1', nombres: 'Administrador', apellidos: 'FashionStock', cedula: '10000001', fechaNacimiento: '1990-01-01', usuario: 'admin', password: '123456', rol: 'Administrador', activo: true },
    { id: 'usr-2', nombres: 'Empleado', apellidos: 'Demo', cedula: '10000002', fechaNacimiento: '1995-01-01', usuario: 'empleado', password: '123456', rol: 'Empleado', activo: true },
    { id: 'usr-3', nombres: 'María Fernanda', apellidos: 'Gómez Rojas', cedula: '1053678901', fechaNacimiento: '1988-04-12', usuario: 'maria.gomez@fashionstock.pro', password: '123456', rol: 'Administrador', activo: true },
    { id: 'usr-4', nombres: 'Carlos Andrés', apellidos: 'Pérez', cedula: '1098234567', fechaNacimiento: '1996-09-23', usuario: 'carlos.perez@fashionstock.pro', password: '123456', rol: 'Empleado', activo: true },
    { id: 'usr-5', nombres: 'Laura', apellidos: 'Soto', cedula: '1102345678', fechaNacimiento: '1999-02-05', usuario: 'laura.soto@fashionstock.pro', password: '123456', rol: 'Empleado', activo: true },
  ]
}

export function seedProductos(): Producto[] {
  return [
    { id: 'prd-1', nombre: 'Camiseta oversized blanca', descripcion: 'Camiseta oversized 100% algodón, cuello redondo.', categoria: 'Camisetas', talla: 'M', color: 'Blanco', precioVenta: 45900, stock: 24, activo: true },
    { id: 'prd-2', nombre: 'Jean skinny azul', descripcion: 'Jean skinny tiro alto, tela stretch.', categoria: 'Pantalones', talla: '30', color: 'Azul', precioVenta: 89900, stock: 8, activo: true },
    { id: 'prd-3', nombre: 'Vestido midi floreado', descripcion: 'Vestido midi manga corta, estampado floral.', categoria: 'Vestidos', talla: 'S', color: 'Estampado', precioVenta: 129900, stock: 3, activo: true },
    { id: 'prd-4', nombre: 'Chaqueta denim', descripcion: 'Chaqueta denim clásica con botones metálicos.', categoria: 'Chaquetas', talla: 'L', color: 'Azul', precioVenta: 159900, stock: 0, activo: true },
    { id: 'prd-5', nombre: 'Tenis urbanos', descripcion: 'Tenis urbanos suela de goma antideslizante.', categoria: 'Calzado', talla: '38', color: 'Negro', precioVenta: 189900, stock: 15, activo: true },
    { id: 'prd-6', nombre: 'Bolso shopper', descripcion: 'Bolso shopper en cuero sintético.', categoria: 'Accesorios', talla: 'Única', color: 'Café', precioVenta: 79900, stock: 6, activo: true },
    { id: 'prd-7', nombre: 'Camiseta básica negra', descripcion: 'Camiseta básica cuello redondo, algodón peinado.', categoria: 'Camisetas', talla: 'L', color: 'Negro', precioVenta: 39900, stock: 30, activo: true },
    { id: 'prd-8', nombre: 'Pantalón jogger gris', descripcion: 'Jogger deportivo con puños elásticos.', categoria: 'Pantalones', talla: '32', color: 'Gris', precioVenta: 69900, stock: 12, activo: true },
    { id: 'prd-9', nombre: 'Vestido casual negro', descripcion: 'Vestido casual corte recto, ideal para oficina.', categoria: 'Vestidos', talla: 'M', color: 'Negro', precioVenta: 119900, stock: 4, activo: true },
    { id: 'prd-10', nombre: 'Chaqueta impermeable', descripcion: 'Chaqueta rompevientos impermeable con capota.', categoria: 'Chaquetas', talla: 'M', color: 'Verde', precioVenta: 179900, stock: 7, activo: true },
    { id: 'prd-11', nombre: 'Gorra bordada', descripcion: 'Gorra ajustable con bordado frontal.', categoria: 'Accesorios', talla: 'Única', color: 'Beige', precioVenta: 34900, stock: 20, activo: true },
    { id: 'prd-12', nombre: 'Botas cuero café', descripcion: 'Botas de cuero genuino con cordones.', categoria: 'Calzado', talla: '40', color: 'Café', precioVenta: 219900, stock: 5, activo: true },
    { id: 'prd-13', nombre: 'Camiseta polo azul rey', descripcion: 'Polo piqué con cuello y puños ribeteados.', categoria: 'Camisetas', talla: 'M', color: 'Azul rey', precioVenta: 54900, stock: 2, activo: true },
    { id: 'prd-14', nombre: 'Falda plisada', descripcion: 'Falda plisada midi con cintura elástica.', categoria: 'Vestidos', talla: 'S', color: 'Rosa', precioVenta: 99900, stock: 9, activo: true },
  ]
}

export function seedClientes(): Cliente[] {
  return [
    { id: 'cli-1', nombre: 'Diana Marcela Ríos', documento: '1042358901', telefono: '3104558712', email: 'diana.rios@gmail.com', direccion: 'Calle 45 # 12-30', ciudad: 'Manizales' },
    { id: 'cli-2', nombre: 'Julián Esteban Cardona', documento: '1088456712', telefono: '3157789021', email: 'julian.cardona@gmail.com', direccion: 'Av. 30 de Agosto # 8-21', ciudad: 'Manizales' },
    { id: 'cli-3', nombre: 'Natalia Andrea Bermúdez', documento: '1094512378', telefono: '3208871245', email: 'natalia.bermudez@hotmail.com', direccion: 'Carrera 10 # 15-44', ciudad: 'Pereira' },
    { id: 'cli-4', nombre: 'Andrés Felipe Marín', documento: '1076123890', telefono: '3116678902', email: 'andres.marin@gmail.com', direccion: 'Calle 20 # 9-15', ciudad: 'Pereira' },
    { id: 'cli-5', nombre: 'Camila Sofía Restrepo', documento: '1053789456', telefono: '3001125589', email: 'camila.restrepo@outlook.com', direccion: 'Transversal 5 # 33-10', ciudad: 'Bogotá' },
    { id: 'cli-6', nombre: 'Sebastián Ortiz Valencia', documento: '1067345612', telefono: '3134459876', email: 'sebastian.ortiz@gmail.com', direccion: 'Carrera 7 # 45-60', ciudad: 'Bogotá' },
  ]
}

export function seedProveedores(): Proveedor[] {
  return [
    { id: 'prov-1', nombre: 'Textiles Andinos S.A.S.', nit: '900123456-1', telefono: '6068801234', email: 'ventas@textilesandinos.com', activo: true },
    { id: 'prov-2', nombre: 'Moda Pacífico', nit: '900456789-2', telefono: '6023456789', email: 'contacto@modapacifico.com', activo: true },
    { id: 'prov-3', nombre: 'Calzado El Roble', nit: '900789123-3', telefono: '6042345566', email: 'pedidos@calzadoelroble.com', activo: true },
    { id: 'prov-4', nombre: 'Accesorios Luna', nit: '900321654-4', telefono: '6017894455', email: 'info@accesoriosluna.com', activo: true },
  ]
}

function daysAgo(n: number) {
  const date = new Date()
  date.setDate(date.getDate() - n)
  return date.toISOString().slice(0, 10)
}

export function seedVentas(): Venta[] {
  const ventas: Array<{ dias: number; clienteId: string | null; lineas: LineaVenta[] }> = [
    { dias: 1, clienteId: 'cli-1', lineas: [{ productoId: 'prd-1', cantidad: 2, precioUnitario: 45900 }] },
    { dias: 2, clienteId: 'cli-2', lineas: [{ productoId: 'prd-5', cantidad: 1, precioUnitario: 189900 }] },
    { dias: 3, clienteId: 'cli-3', lineas: [{ productoId: 'prd-7', cantidad: 3, precioUnitario: 39900 }] },
    { dias: 4, clienteId: null, lineas: [{ productoId: 'prd-6', cantidad: 1, precioUnitario: 79900 }] },
    { dias: 5, clienteId: 'cli-4', lineas: [{ productoId: 'prd-2', cantidad: 1, precioUnitario: 89900 }] },
    { dias: 35, clienteId: 'cli-5', lineas: [{ productoId: 'prd-8', cantidad: 2, precioUnitario: 69900 }] },
    { dias: 38, clienteId: 'cli-6', lineas: [{ productoId: 'prd-14', cantidad: 1, precioUnitario: 99900 }] },
    { dias: 40, clienteId: 'cli-1', lineas: [{ productoId: 'prd-11', cantidad: 2, precioUnitario: 34900 }] },
  ]
  return ventas.map((venta, index) => {
    const subtotal = venta.lineas.reduce((sum, linea) => sum + linea.cantidad * linea.precioUnitario, 0)
    const iva = Math.round(subtotal * IVA_PORCENTAJE)
    return {
      id: `venta-${index + 1}`,
      numeroFactura: `FSP-2026-${String(index + 1).padStart(3, '0')}`,
      clienteId: venta.clienteId,
      fecha: daysAgo(venta.dias),
      lineas: venta.lineas,
      subtotal,
      iva,
      total: subtotal + iva,
    }
  })
}

export function seedCompras(): Compra[] {
  const compras: Array<{ dias: number; proveedorId: string; estado: EstadoCompra; lineas: LineaCompra[] }> = [
    { dias: 20, proveedorId: 'prov-1', estado: 'Recibida', lineas: [{ productoId: 'prd-1', cantidad: 20, costoUnitario: 25000 }] },
    { dias: 15, proveedorId: 'prov-2', estado: 'Recibida', lineas: [{ productoId: 'prd-3', cantidad: 10, costoUnitario: 70000 }] },
    { dias: 6, proveedorId: 'prov-3', estado: 'Registrada', lineas: [{ productoId: 'prd-12', cantidad: 8, costoUnitario: 130000 }] },
    { dias: 2, proveedorId: 'prov-4', estado: 'Registrada', lineas: [{ productoId: 'prd-6', cantidad: 12, costoUnitario: 42000 }] },
  ]
  return compras.map((compra, index) => ({
    id: `compra-${index + 1}`,
    proveedorId: compra.proveedorId,
    fecha: daysAgo(compra.dias),
    estado: compra.estado,
    lineas: compra.lineas,
    total: compra.lineas.reduce((sum, linea) => sum + linea.cantidad * linea.costoUnitario, 0),
  }))
}

export function seedEntradas(): EntradaMercancia[] {
  return [
    { id: 'ent-1', productoId: 'prd-1', cantidad: 20, proveedorId: 'prov-1', fecha: daysAgo(20), observacion: 'Reposición de temporada.' },
    { id: 'ent-2', productoId: 'prd-3', cantidad: 10, proveedorId: 'prov-2', fecha: daysAgo(15), observacion: 'Nueva colección primavera.' },
    { id: 'ent-3', productoId: 'prd-5', cantidad: 10, proveedorId: 'prov-3', fecha: daysAgo(10), observacion: 'Restock tenis urbanos.' },
    { id: 'ent-4', productoId: 'prd-9', cantidad: 6, proveedorId: 'prov-2', fecha: daysAgo(4), observacion: 'Pedido especial cliente mayorista.' },
  ]
}

export function seedSalidas(): SalidaMercancia[] {
  return [
    { id: 'sal-1', tipo: 'Devolución a proveedor', productoId: 'prd-4', cantidad: 2, fecha: daysAgo(8), observacion: 'Prendas con defecto de fábrica.' },
  ]
}
