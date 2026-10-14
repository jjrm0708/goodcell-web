import { Suspense } from "react";
import { obtenerCategorias, obtenerProductos } from "@/lib/catalogo";
import { Hero } from "@/components/hero";
import { TrustStrip } from "@/components/trust-strip";
import { CategoryBar } from "@/components/category-bar";
import { Catalogo } from "@/components/catalogo";
import { VisitUs } from "@/components/visit-us";

export const revalidate = 60;

export default async function Home() {
  const [productos, categorias] = await Promise.all([
    obtenerProductos(),
    obtenerCategorias(),
  ]);
  const destacado = productos.find((p) => p.destacado) ?? productos[0] ?? null;

  return (
    <>
      <Hero destacado={destacado} />
      <TrustStrip />
      <Suspense fallback={null}>
        <CategoryBar categorias={categorias} />
        <Catalogo productos={productos} categorias={categorias} />
      </Suspense>
      <VisitUs />
    </>
  );
}