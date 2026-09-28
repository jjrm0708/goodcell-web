import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: productos, error } = await supabase
    .from('productos')
    .select('id, nombre, precio, marca')

  if (error) {
    return <pre className="p-8">Error: {error.message}</pre>
  }

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Prueba de conexión</h1>
      <ul>
        {productos?.map((p) => (
          <li key={p.id}>
            {p.marca} - {p.nombre} - ${p.precio.toLocaleString('es-CO')}
          </li>
        ))}
      </ul>
    </main>
  )
}
