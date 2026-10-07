import { supabase } from '@/lib/supabase'
import { formatCOP } from '@/lib/utils'
import type { Producto } from '@/lib/types'
import { ThemeToggle } from '@/components/theme-toggle'
import { Footer } from '@/components/footer' 
import { InstagramIcon } from "@/components/instagram-icon";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { CookieBanner } from "@/components/cookie-banner";
 
export default async function Home() {
  const { data, error } = await supabase
    .from('productos')
    .select('*')

  if (error) {
    return <pre className="p-8">Error: {error.message}</pre>
  }

  const productos = data as Producto[]

  return (
    <main className="p-8">
      <ThemeToggle />
      <h1 className="mb-4 mt-6 text-2xl font-bold">Prueba de conexión</h1>
      <ul>
        {productos?.map((p) => (
          <li key={p.id}>
            {p.marca} - {p.nombre} - {formatCOP(p.precio)}
          </li>
        ))}
      </ul>
      <div className="product-card mt-6 max-w-sm rounded-2xl p-5">
        <p className="text-app-secondary">Tarjeta de prueba</p>
        <button className="bg-app-accent text-app-accent-contrast mt-3 rounded-full px-4 py-2 font-semibold">
          Botón verde
        </button>
      </div>
      <Footer /> <WhatsAppButton /> <CookieBanner />
    </main>
  )
}