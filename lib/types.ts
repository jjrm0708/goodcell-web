export type Categoria = {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  imagen: string | null
  activo: boolean
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
  imagen_principal: string | null
  imagenes: string[] | null
  marca: string | null
  modelo: string | null
  stock: number
  destacado: boolean
  nuevo: boolean
  activo: boolean
  creado_en: string
}
