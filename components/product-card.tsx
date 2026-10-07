"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  MessageCircle,
  Plus,
  Shield,
  Tag,
} from "lucide-react";
import { useCarrito } from "@/components/cart-provider";
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
import { whatsappUrl } from "@/lib/site";

export function ProductCard({
  producto,
  indice,
}: {
  producto: ProductoConCategoria;
  indice: number;
}) {
  const { agregar } = useCarrito();
  const [agregado, setAgregado] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const enOferta = ofertaVigente(producto);
  const descuento = porcentajeDescuento(producto);
  const precioFinal = precioEfectivo(producto);
  const agotado = producto.stock === 0;
  const garantia = textoGarantia(producto.garantia_meses);
  const categoria = producto.categorias?.nombre ?? null;
  const mismaMarcaQueCategoria =
    producto.marca?.toLowerCase() === categoria?.toLowerCase();

  const anadir = () => {
    if (agotado) return;
    agregar(producto);
    setAgregado(true);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setAgregado(false), 1800);
  };

  const urlWhatsApp = whatsappUrl(
    `Hola Good Cell 👋 Me interesa consultar disponibilidad sobre: ${producto.nombre} (${formatCOP(
      precioFinal
    )} - Garantía: ${garantia}). ¿Tienen unidades disponibles en Unicentro Armenia?`
  );

  return (
    <article
      style={{ animationDelay: `${indice * 60}ms` }}
      className="product-card reveal-on-scroll group relative flex flex-col justify-between rounded-2xl p-3 sm:p-4.5"
    >
      <div>
        <div className="relative">
          <ProductPlaceholder
            marca={producto.marca}
            categoriaSlug={producto.categorias?.slug}
            className="aspect-square sm:aspect-[4/3]"
          />
          <div className="pointer-events-none absolute right-1.5 top-1.5 z-20 flex flex-wrap justify-end gap-1 sm:right-2.5 sm:top-2.5">
            {enOferta && (
              <span className="whitespace-nowrap rounded-full border border-app-accent bg-app-surface-1/95 px-1.5 py-0.5 text-[9px] font-bold tabular-nums text-app-accent shadow-sm backdrop-blur-md sm:text-[10px]">
                -{descuento}%
              </span>
            )}
            {producto.nuevo && !enOferta && (
              <span className="whitespace-nowrap rounded-full border border-app-accent bg-app-surface-1/95 px-1.5 py-0.5 text-[9px] font-semibold text-app-accent shadow-sm backdrop-blur-md sm:text-[10px]">
                Nuevo
              </span>
            )}
          </div>
        </div>

        <div className="mt-2.5 space-y-1 sm:mt-3 sm:space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-app-secondary sm:text-xs">
            <span>{producto.marca}</span>
            {categoria && !mismaMarcaQueCategoria && (
              <span className="hidden font-normal normal-case opacity-80 sm:inline">
                {categoria}
              </span>
            )}
          </div>

          <h3 className="line-clamp-2 text-xs font-semibold leading-snug tracking-tight text-app-primary transition-colors group-hover:text-app-accent sm:text-base">
            <Link
              href={`/producto/${producto.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {producto.nombre}
            </Link>
          </h3>

          {producto.eslogan && (
            <p className="hidden line-clamp-2 text-xs leading-relaxed text-app-secondary sm:block">
              {producto.eslogan}
            </p>
          )}

          <div className="hidden flex-wrap items-center gap-1.5 pt-1 sm:flex">
            {agotado ? (
              <div className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-500">
                <AlertCircle className="size-3 shrink-0" />
                <span>Agotado</span>
              </div>
            ) : producto.stock <= 3 ? (
              <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-500">
                <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-amber-500" />
                <span>Quedan {producto.stock}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-app-accent-subtle px-2 py-0.5 text-[10px] font-medium text-app-accent">
                <span className="size-1.5 shrink-0 rounded-full bg-app-accent" />
                <span>En stock ({producto.stock})</span>
              </div>
            )}

            <div className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-app-subtle bg-app-surface-2 px-2 py-0.5 text-[10px] font-medium text-app-secondary">
              <Shield className="size-3 shrink-0 text-app-accent" />
              <span>Garantía: {garantia}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2 border-t border-app-subtle pt-2.5 sm:mt-4 sm:pt-3">
        <div>
          {enOferta ? (
            <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
              <span className="text-[10px] tabular-nums text-app-secondary line-through sm:text-xs">
                {formatCOP(producto.precio)}
              </span>
              <span className="text-sm font-bold tabular-nums tracking-tight text-app-accent sm:text-xl">
                {formatCOP(precioFinal)}
              </span>
              <span className="text-[9px] font-bold text-app-accent sm:hidden">
                -{descuento}%
              </span>
            </div>
          ) : (
            <span className="block text-sm font-bold tabular-nums tracking-tight text-app-primary sm:text-xl">
              {formatCOP(precioFinal)}
            </span>
          )}

          <div className="hidden h-5 items-center gap-1 overflow-hidden text-[11px] font-medium text-amber-500 sm:flex">
            {enOferta && producto.oferta_hasta && (
              <>
                <Tag className="size-3 shrink-0" />
                <span>
                  Oferta hasta el {textoFechaOferta(producto.oferta_hasta)}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <button
            type="button"
            disabled={agotado}
            onClick={anadir}
            aria-label={`Añadir ${producto.nombre} al carrito`}
            className={`order-1 flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-2 text-xs font-semibold transition-all duration-200 sm:order-2 ${
              agotado
                ? "cursor-not-allowed border border-app-subtle bg-app-surface-1 text-app-secondary opacity-50"
                : "bg-app-accent text-app-accent-contrast hover:opacity-90"
            }`}
          >
            {agotado ? (
              <span>Agotado</span>
            ) : agregado ? (
              <>
                <Check className="size-3.5 shrink-0" />
                <span>Agregado</span>
              </>
            ) : (
              <>
                <Plus className="size-3.5 shrink-0" />
                <span>Añadir</span>
              </>
            )}
          </button>

          <a
            href={urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Preguntar por WhatsApp sobre ${producto.nombre}`}
            className="order-2 flex size-11 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-app-subtle border-app-hover bg-app-surface-1 text-xs font-medium text-[#25d366] transition-all sm:order-1 sm:size-auto sm:min-h-11 sm:flex-1 sm:whitespace-nowrap sm:text-app-secondary sm:hover:text-[#25d366]"
          >
            <MessageCircle className="size-4 shrink-0 text-[#25d366] sm:size-3.5" />
            <span className="hidden sm:inline">Preguntar</span>
          </a>
        </div>
      </div>
    </article>
  );
}