import { obtenerProductos } from "@/lib/catalogo";
import { ProductCard } from "@/components/product-card";

export default async function Home() {
  const productos = await obtenerProductos();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {productos.map((p, i) => (
          <ProductCard key={p.id} producto={p} indice={i} />
        ))}
      </div>
    </div>
  );
}