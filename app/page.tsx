import { supabase } from '@/lib/supabase'
import { formatCOP } from '@/lib/utils'
import type { Producto } from '@/lib/types'

export default async function Home() {
  const { data, error } = await supabase
    .from('productos')
    .select('*')

  if (error) {
    return <pre className="p-8 pt-24">Error: {error.message}</pre>
  }

  const productos = data as Producto[]

  return (
    <div className="p-8 pt-24">
      <h1 className="mb-4 text-2xl font-bold">Prueba de conexión</h1>
      <ul>
        {productos?.map((p) => (
          <li key={p.id}>
            {p.marca} - {p.nombre} - {formatCOP(p.precio)}
          </li>
        ))}
      </ul>
      <div className="h-[1200px]" />
    </div>
  )
}