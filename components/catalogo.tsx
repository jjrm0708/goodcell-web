"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpDown, RotateCcw, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { CategoriaBasica, ProductoConCategoria } from "@/lib/catalogo";
import { precioEfectivo } from "@/lib/precios";
import { urlConParametros } from "@/lib/url";

type Orden = "destacados" | "precio-asc" | "precio-desc" | "nuevos";
const ORDENES: Orden[] = ["destacados", "precio-asc", "precio-desc", "nuevos"];

export function Catalogo({
  productos,
  categorias,
}: {
  productos: ProductoConCategoria[];
  categorias: CategoriaBasica[];
}) {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();
  const slugCategoria = searchParams.get("categoria") ?? "";
  const ordenParam = searchParams.get("orden");
  const orden: Orden = ORDENES.includes(ordenParam as Orden)
    ? (ordenParam as Orden)
    : "destacados";
  const categoriaActual = categorias.find((c) => c.slug === slugCategoria) ?? null;

  const visibles = useMemo(() => {
    const texto = q.toLowerCase();
    const filtrados = productos.filter((p) => {
      const coincideCategoria =
        !categoriaActual || p.categorias?.slug === categoriaActual.slug;
      const coincideTexto =
        texto === "" ||
        [p.nombre, p.marca, p.categorias?.nombre, p.eslogan].some((campo) =>
          campo?.toLowerCase().includes(texto)
        );
      return coincideCategoria && coincideTexto;
    });

    return [...filtrados].sort((a, b) => {
      if (orden === "precio-asc") return precioEfectivo(a) - precioEfectivo(b);
      if (orden === "precio-desc") return precioEfectivo(b) - precioEfectivo(a);
      if (orden === "nuevos") {
        return new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime();
      }
      return 0; // "destacados" conserva el orden que viene de la base de datos
    });
  }, [productos, categoriaActual, q, orden]);

  const cambiarOrden = (nuevo: Orden) =>
    window.history.replaceState(
      null,
      "",
      urlConParametros(searchParams, {
        orden: nuevo === "destacados" ? null : nuevo,
      })
    );

  const limpiar = () => window.history.replaceState(null, "", "/");
  const hayFiltros = q !== "" || categoriaActual !== null;

  return (
    <section
      id="catalogo"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
        <div>
          <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-app-secondary">
            <Sparkles className="size-3.5 text-app-accent" />
            <span>Colección seleccionada</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-app-primary sm:text-4xl">
            {categoriaActual
              ? `Categoría: ${categoriaActual.nombre}`
              : "Todos los productos"}
          </h2>
          {q && (
            <p className="mt-1 text-xs text-app-secondary sm:text-sm">
              Resultados para &ldquo;
              <span className="font-medium text-app-primary">{q}</span>&rdquo;
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <span className="text-xs tabular-nums text-app-secondary sm:text-sm">
            {visibles.length} {visibles.length === 1 ? "producto" : "productos"}
          </span>

          <div className="relative flex items-center">
            <ArrowUpDown className="pointer-events-none absolute left-3 size-3.5 text-app-secondary" />
            <select
              value={orden}
              onChange={(e) => cambiarOrden(e.target.value as Orden)}
              aria-label="Ordenar productos"
              className="min-h-11 cursor-pointer appearance-none rounded-xl border border-app-subtle border-app-hover bg-app-surface-1 py-2 pl-8 pr-8 text-xs text-app-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
            >
              <option value="destacados">Destacados</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="nuevos">Más nuevos</option>
            </select>
          </div>

          {hayFiltros && (
            <button
              type="button"
              onClick={limpiar}
              className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-app-subtle bg-app-surface-1 px-3 py-2 text-xs text-app-primary transition-colors hover:bg-app-surface-2"
            >
              <RotateCcw className="size-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      </div>

      {visibles.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {visibles.map((p, i) => (
            <ProductCard key={p.id} producto={p} indice={i} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-app-subtle bg-app-surface-1 px-4 py-16 text-center sm:py-20">
          <p className="text-base font-semibold text-app-primary sm:text-lg">
            No se encontraron productos
          </p>
          <p className="mt-1 text-xs text-app-secondary sm:text-sm">
            Intenta con otro término de búsqueda o selecciona otra categoría.
          </p>
          <button
            type="button"
            onClick={limpiar}
            className="mt-5 min-h-11 cursor-pointer rounded-full bg-app-accent px-6 py-2.5 text-xs font-semibold text-app-accent-contrast shadow-md transition-opacity hover:opacity-90 sm:text-sm"
          >
            Restablecer filtros
          </button>
        </div>
      )}
    </section>
  );
}