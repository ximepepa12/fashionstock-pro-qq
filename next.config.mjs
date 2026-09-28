/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/iniciar-sesion', destination: '/sign-in', permanent: false },
      { source: '/registro', destination: '/sign-up', permanent: false },
      { source: '/app', destination: '/dashboard', permanent: false },
      { source: '/inventario', destination: '/dashboard/inventario', permanent: false },
      { source: '/productos/nuevo', destination: '/dashboard/productos/nuevo', permanent: false },
      { source: '/productos/:id/editar', destination: '/dashboard/productos/:id/editar', permanent: false },
      { source: '/productos/:id', destination: '/dashboard/productos/:id', permanent: false },
      { source: '/entradas', destination: '/dashboard/entradas', permanent: false },
      { source: '/salidas', destination: '/dashboard/salidas', permanent: false },
      { source: '/ventas', destination: '/dashboard/ventas', permanent: false },
      { source: '/ventas/nueva', destination: '/dashboard/ventas/nueva', permanent: false },
      { source: '/clientes', destination: '/dashboard/clientes', permanent: false },
      { source: '/clientes/:id', destination: '/dashboard/clientes/:id', permanent: false },
      { source: '/proveedores', destination: '/dashboard/proveedores', permanent: false },
      { source: '/compras', destination: '/dashboard/compras', permanent: false },
      { source: '/usuarios', destination: '/dashboard/usuarios', permanent: false },
      { source: '/reportes', destination: '/dashboard/reportes', permanent: false },
    ]
  },
}

export default nextConfig
