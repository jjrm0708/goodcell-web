"use client";

import { useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CategoriaBasica } from "@/lib/catalogo";
import { urlConParametros } from "@/lib/url";

const botonFlecha =
  "hidden size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-app-subtle border-app-hover bg-app-surface-1 text-app-secondary transition-colors hover:text-app-primary md:flex";

export function CategoryBar({ categorias }: { categorias: CategoriaBasica[] }) {
  const searchParams = useSearchParams();
  const actual = searchParams.get("categoria") ?? "";
  const contenedor = useRef<HTMLDivElement>(null);

  const opciones = [{ slug: "", nombre: "Todos" }, ...categorias];

  const desplazar = (direccion: -1 | 1) =>
    contenedor.current?.scrollBy({ left: direccion * 220, behavior: "smooth" });

  const elegir = (slug: string) => {
    window.history.replaceState(
      null,
      "",
      urlConParametros(searchParams, { categoria: slug || null })
    );
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="sticky top-16 z-30 border-b border-app-subtle bg-app-navbar py-2.5 backdrop-blur-xl sm:py-3">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => desplazar(-1)}
          aria-label="Desplazar a la izquierda"
          className={botonFlecha}
        >
          <ChevronLeft className="size-4" />
        </button>

        <div
          ref={contenedor}
          className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto py-1 sm:gap-2.5"
        >
          {opciones.map((c) => {
            const activa = c.slug === actual;
            return (
              <button
                key={c.slug || "todos"}
                type="button"
                onClick={() => elegir(c.slug)}
                className={`flex min-h-11 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 sm:px-5 sm:text-sm ${
                  activa
                    ? "border-app-accent bg-app-surface-2 text-app-accent shadow-[0_0_12px_var(--accent-subtle)]"
                    : "border-app-subtle border-app-hover bg-app-surface-1 text-app-secondary hover:text-app-primary"
                }`}
              >
                {activa && (
                  <span className="mr-2 size-1.5 rounded-full bg-app-accent shadow-[0_0_6px_var(--accent-color)]" />
                )}
                {c.nombre}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => desplazar(1)}
          aria-label="Desplazar a la derecha"
          className={botonFlecha}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}