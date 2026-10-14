import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { ProductPlaceholder } from "@/components/product-placeholder";
import type { ProductoConCategoria } from "@/lib/catalogo";
import { formatCOP } from "@/lib/utils";
import {
  ofertaVigente,
  porcentajeDescuento,
  precioEfectivo,
  textoFechaOferta,
  textoGarantia,
} from "@/lib/precios";

function TarjetaDestacada({ p }: { p: ProductoConCategoria }) {
  const enOferta = ofertaVigente(p);
  const descuento = porcentajeDescuento(p);
  const precio = precioEfectivo(p);

  return (
    <Link
      href={`/producto/${p.slug}`}
      className="group relative mx-auto mt-10 block max-w-4xl overflow-hidden rounded-2xl border border-app-subtle border-app-hover bg-app-surface-1 p-5 text-left transition-all sm:mt-14 sm:p-7"
    >
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
        <div className="space-y-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-app-secondary">
              Lanzamiento destacado
            </span>
            {enOferta && (
              <span className="rounded-full border border-app-accent bg-app-accent-subtle px-2 py-0.5 text-[10px] font-bold text-app-accent">
                Oferta -{descuento}%
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold tracking-tight text-app-primary transition-colors group-hover:text-app-accent sm:text-2xl">
            {p.nombre}
          </h2>

          {p.eslogan && (
            <p className="line-clamp-2 text-xs leading-relaxed text-app-secondary sm:text-sm">
              {p.eslogan}
            </p>
          )}

          <div className="pt-1">
            {enOferta ? (
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs tabular-nums text-app-secondary line-through">
                    {formatCOP(p.precio)}
                  </span>
                  <span className="text-lg font-bold tabular-nums text-app-accent sm:text-xl">
                    {formatCOP(precio)}
                  </span>
                </div>
                {p.oferta_hasta && (
                  <p className="text-[11px] font-medium text-amber-500">
                    Oferta hasta el {textoFechaOferta(p.oferta_hasta)}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-sm font-bold tabular-nums text-app-primary sm:text-base">
                {formatCOP(precio)}
              </div>
            )}
          </div>

          <p className="pt-1 text-xs text-app-secondary">
            Garantía: {textoGarantia(p.garantia_meses)}
          </p>
        </div>

        <div className="md:col-span-2">
          <ProductPlaceholder
            marca={p.marca}
            categoriaSlug={p.categorias?.slug}
            className="h-44 sm:h-52"
          />
        </div>
      </div>
    </Link>
  );
}

export function Hero({
  destacado,
}: {
  destacado: ProductoConCategoria | null;
}) {
  return (
    <section className="relative overflow-hidden bg-app-primary pb-10 pt-24 sm:pb-16 sm:pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 h-[300px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-app-accent-subtle blur-3xl sm:w-[650px]"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-app-subtle bg-app-surface-1 px-3.5 py-1.5 text-xs font-medium text-app-secondary sm:px-4">
          <span className="size-2 shrink-0 rounded-full bg-app-accent shadow-[0_0_8px_var(--accent-color)]" />
          <span className="hidden sm:inline">Tecnología Premium en Colombia</span>
          <span className="hidden opacity-30 sm:inline">/</span>
          <span className="text-app-primary">Unicentro Armenia</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-balance text-3xl font-semibold leading-[1.08] tracking-tight text-app-primary sm:text-5xl lg:text-7xl">
          Tecnología superior. Sin concesiones.
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-balance text-sm leading-relaxed text-app-secondary sm:mt-6 sm:text-lg lg:text-xl">
          Lo último en audio de alta fidelidad, ecosistema Apple, fotografía
          profesional y equipamiento gaming.
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-9 sm:flex-row">
          <a
            href="#catalogo"
            className="inline-flex h-12 min-h-11 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-app-accent px-8 text-sm font-semibold text-app-accent-contrast shadow-lg transition-all duration-200 active:scale-[0.98] sm:w-auto sm:text-base"
          >
            <span>Explorar catálogo</span>
            <ArrowDown className="size-4 animate-bounce" />
          </a>
        </div>

        {destacado && <TarjetaDestacada p={destacado} />}
      </div>
    </section>
  );
}