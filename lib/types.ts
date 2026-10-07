export type Categoria = {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  imagen: string | null
  activo: boolean
  orden: number
  creado_en: string
}

export type Producto = {
  id: string
  categoria_id: string | null
  nombre: string
  slug: string
  descripcion: string | null
  descripcion_larga: string | null
  precio: number
  precio_anterior: number | null
  precio_oferta: number | null
  oferta_hasta: string | null
  imagen_principal: string | null
  imagenes: string[] | null
  marca: string | null
  modelo: string | null
  stock: number
  garantia_meses: 3 | 6 | 12 | 24
  eslogan: string | null
  especificaciones: string[]
  destacado: boolean
  nuevo: boolean
  activo: boolean
  creado_en: string
}