import { obtenerProductos } from "@/lib/catalogo";
import { Hero } from "@/components/hero";
import { TrustStrip } from "@/components/trust-strip";
import { ProductCard } from "@/components/product-card";

export default async function Home() {
  const productos = await obtenerProductos();
  const destacado = productos.find((p) => p.destacado) ?? productos[0] ?? null;

  return (
    <>
      <Hero destacado={destacado} />
      <TrustStrip />
      <section
        id="catalogo"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {productos.map((p, i) => (
            <ProductCard key={p.id} producto={p} indice={i} />
          ))}
        </div>
      </section>
    </>
  );
}