"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Share2,
  Shield,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { useCarrito } from "@/components/cart-provider";
import { ProductCard } from "@/components/product-card";
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
import { SITE, whatsappUrl } from "@/lib/site";

export function ProductDetail({
  producto,
  relacionados,
}: {
  producto: ProductoConCategoria;
  relacionados: ProductoConCategoria[];
}) {
  const { agregar } = useCarrito();
  const [miniatura, setMiniatura] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [copiado, setCopiado] = useState(false);
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    if (!copiado) return;
    const t = setTimeout(() => setCopiado(false), 2200);
    return () => clearTimeout(t);
  }, [copiado]);

  useEffect(() => {
    if (!agregado) return;
    const t = setTimeout(() => setAgregado(false), 1800);
    return () => clearTimeout(t);
  }, [agregado]);

  const enOferta = ofertaVigente(producto);
  const descuento = porcentajeDescuento(producto);
  const precioFinal = precioEfectivo(producto);
  const agotado = producto.stock === 0;
  const garantia = textoGarantia(producto.garantia_meses);
  const categoria = producto.categorias?.nombre ?? null;
  const mismaMarcaQueCategoria =
    producto.marca?.toLowerCase() === categoria?.toLowerCase();

  const compartir = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // si el navegador lo bloquea, igual mostramos el aviso
    }
    setCopiado(true);
  };

  const anadir = () => {
    if (agotado) return;
    agregar(producto, cantidad);
    setAgregado(true);
  };

  const urlConsulta = whatsappUrl(
    `Hola Good Cell 👋 Me interesa consultar sobre: ${producto.nombre} (${formatCOP(
      precioFinal
    )} - Garantía: ${garantia}). ¿Tienen disponibilidad en la tienda de Unicentro Armenia?`
  );

  const textoBoton = agotado
    ? "Producto agotado"
    : agregado
      ? "Agregado al carrito"
      : "Añadir al carrito";

  return (
    <article className="bg-app-primary pb-32 pt-20 text-app-primary md:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between border-b border-app-subtle py-4 sm:mb-10">
          <Link
            href="/"
            className="group inline-flex min-h-11 items-center gap-2 whitespace-nowrap text-xs font-semibold text-app-secondary transition-colors hover:text-app-primary sm:hidden"
          >
            <ArrowLeft className="size-4 shrink-0 transition-transform group-hover:-translate-x-1" />
            <span>Volver al catálogo</span>
          </Link>

          <nav
            aria-label="Ruta de navegación"
            className="hidden items-center gap-2.5 text-xs text-app-secondary sm:flex"
          >
            <Link
              href="/"
              className="font-medium transition-colors hover:text-app-primary"
            >
              Inicio
            </Link>
            <span className="opacity-40">/</span>
            {categoria && (
              <>
                <Link
                  href={`/?categoria=${producto.categorias?.slug}`}
                  className="font-medium transition-colors hover:text-app-primary"
                >
                  {categoria}
                </Link>
                <span className="opacity-40">/</span>
              </>
            )}
            <span className="max-w-[280px] truncate font-semibold text-app-primary">
              {producto.nombre}
            </span>
          </nav>

          <button
            type="button"
            onClick={compartir}
            aria-label="Compartir enlace del producto"
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-app-subtle border-app-hover bg-app-surface-1 px-3.5 py-1.5 text-xs font-medium text-app-secondary transition-all hover:text-app-primary"
          >
            {copiado ? (
              <>
                <Check className="size-3.5 shrink-0 text-app-accent" />
                <span className="font-semibold text-app-accent">
                  ¡Enlace copiado!
                </span>
              </>
            ) : (
              <>
                <Share2 className="size-3.5 shrink-0" />
                <span>Compartir</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-4 lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl shadow-sm">
              <div
                className={`transition-transform duration-300 ${
                  miniatura === 1
                    ? "rotate-2 scale-105"
                    : miniatura === 2
                      ? "-rotate-1 scale-110"
                      : ""
                }`}
              >
                <ProductPlaceholder
                  marca={producto.marca}
                  categoriaSlug={producto.categorias?.slug}
                  className="aspect-square rounded-3xl! sm:aspect-[16/11]"
                />
              </div>
              <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2">
                {enOferta && (
                  <span className="whitespace-nowrap rounded-full border border-app-accent bg-app-surface-1/95 px-3 py-1 text-xs font-bold text-app-accent shadow-sm backdrop-blur-md">
                    -{descuento}% Oferta
                  </span>
                )}
                {producto.nuevo && !enOferta && (
                  <span className="whitespace-nowrap rounded-full border border-app-accent bg-app-surface-1/95 px-3 py-1 text-xs font-semibold text-app-accent shadow-sm backdrop-blur-md">
                    Nuevo
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMiniatura(i)}
                  aria-label={`Vista previa ${i + 1} de ${producto.nombre}`}
                  className={`cursor-pointer overflow-hidden rounded-2xl border transition-all ${
                    miniatura === i
                      ? "scale-[1.02] border-app-accent shadow-md ring-2 ring-app-accent/30"
                      : "border-black/[0.08] opacity-75 hover:opacity-100"
                  }`}
                >
                  <ProductPlaceholder
                    marca={null}
                    categoriaSlug={producto.categorias?.slug}
                    className="aspect-square rounded-none! border-0! sm:aspect-[4/3]"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-app-secondary">
                <span>{producto.marca}</span>
                {categoria && !mismaMarcaQueCategoria && (
                  <>
                    <span className="opacity-40">·</span>
                    <span className="font-normal normal-case">{categoria}</span>
                  </>
                )}
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-app-primary sm:text-3xl lg:text-4xl">
                {producto.nombre}
              </h1>
              {producto.eslogan && (
                <p className="text-sm leading-relaxed text-app-secondary sm:text-base">
                  {producto.eslogan}
                </p>
              )}
            </div>

            <div className="space-y-3 rounded-2xl border border-app-subtle bg-app-surface-1 p-4 sm:p-5">
              {enOferta ? (
                <div className="space-y-1">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-2xl font-extrabold tabular-nums tracking-tight text-app-accent sm:text-3xl">
                      {formatCOP(precioFinal)}
                    </span>
                    <span className="text-sm tabular-nums text-app-secondary line-through sm:text-base">
                      {formatCOP(producto.precio)}
                    </span>
                    <span className="whitespace-nowrap rounded-full bg-app-accent-subtle px-2 py-0.5 text-xs font-bold text-app-accent">
                      Ahorras {formatCOP(producto.precio - precioFinal)}
                    </span>
                  </div>
                  {producto.oferta_hasta && (
                    <div className="flex items-center gap-1.5 pt-1 text-xs font-semibold text-amber-500">
                      <Tag className="size-3.5 shrink-0" />
                      <span>
                        Oferta hasta el {textoFechaOferta(producto.oferta_hasta)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-2xl font-extrabold tabular-nums tracking-tight text-app-primary sm:text-3xl">
                  {formatCOP(precioFinal)}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 border-t border-app-subtle pt-2">
                {agotado ? (
                  <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <span>Agotado para entrega</span>
                  </div>
                ) : producto.stock <= 3 ? (
                  <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-500">
                    <span className="size-2 shrink-0 animate-pulse rounded-full bg-amber-500" />
                    <span>
                      {producto.stock === 1
                        ? "¡Última unidad disponible!"
                        : `¡Últimas ${producto.stock} unidades disponibles!`}
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-app-accent-subtle px-3 py-1 text-xs font-medium text-app-accent">
                    <span className="size-2 shrink-0 rounded-full bg-app-accent" />
                    <span>En stock ({producto.stock} unidades)</span>
                  </div>
                )}

                <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-app-subtle bg-app-surface-2 px-3 py-1 text-xs font-medium text-app-secondary">
                  <Shield className="size-3.5 shrink-0 text-app-accent" />
                  <span>Garantía: {garantia}</span>
                </div>
              </div>
            </div>

            {producto.especificaciones.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-app-secondary">
                  Especificaciones destacadas
                </h2>
                <div className="space-y-1.5">
                  {producto.especificaciones.map((spec) => (
                    <div
                      key={spec}
                      className="flex items-center gap-2.5 rounded-xl border border-app-subtle bg-app-surface-1 p-2.5 text-xs text-app-primary sm:text-sm"
                    >
                      <div className="size-1.5 shrink-0 rounded-full bg-app-accent" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-app-secondary">
                  Cantidad:
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-app-subtle bg-app-surface-1 p-1">
                  <button
                    type="button"
                    disabled={cantidad <= 1}
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    aria-label="Disminuir cantidad"
                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-app-secondary hover:text-app-primary disabled:opacity-30"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold tabular-nums text-app-primary">
                    {cantidad}
                  </span>
                  <button
                    type="button"
                    disabled={agotado || cantidad >= producto.stock}
                    onClick={() => setCantidad((c) => c + 1)}
                    aria-label="Aumentar cantidad"
                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-app-secondary hover:text-app-primary disabled:opacity-30"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                disabled={agotado}
                onClick={anadir}
                className={`flex h-12 min-h-11 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold shadow-md transition-all ${
                  agotado
                    ? "cursor-not-allowed border border-app-subtle bg-app-surface-2 text-app-secondary opacity-50"
                    : "bg-app-accent text-app-accent-contrast hover:opacity-95"
                }`}
              >
                {agregado ? (
                  <Check className="size-4 shrink-0" />
                ) : (
                  !agotado && <ShoppingBag className="size-4 shrink-0" />
                )}
                <span>{textoBoton}</span>
              </button>

              <a
                href={urlConsulta}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 min-h-11 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-app-subtle border-app-hover bg-app-surface-1 px-6 py-3 text-sm font-semibold text-app-primary transition-colors hover:text-[#25d366]"
              >
                <MessageCircle className="size-4 shrink-0 text-[#25d366]" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <section
          aria-label="Visítanos en tienda"
          className="mt-16 rounded-3xl border border-app-subtle bg-app-surface-1 p-6 sm:mt-24 sm:p-8"
        >
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 lg:gap-8">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-app-subtle bg-app-surface-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-app-accent">
                <span className="size-2 shrink-0 rounded-full bg-app-accent" />
                <span>Visítanos en tienda</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-app-primary sm:text-2xl">
                Good Cell en Unicentro Armenia
              </h2>
              <div className="mt-3 flex items-start gap-2.5 text-xs text-app-secondary sm:text-sm">
                <MapPin className="mt-0.5 size-4 shrink-0 text-app-accent" />
                <span>
                  {SITE.direccion.centroComercial} · {SITE.direccion.calle} ·{" "}
                  {SITE.direccion.ciudad}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 border-t border-app-subtle pt-3 text-xs text-app-secondary sm:text-sm">
                <div className="mb-1 flex items-center gap-2 font-medium text-app-primary">
                  <Clock className="size-4 shrink-0 text-app-accent" />
                  <span>Horarios de atención:</span>
                </div>
                {SITE.horarios.map((h) => (
                  <div
                    key={h.dias}
                    className="flex items-center justify-between border-b border-app-subtle py-1 pl-6 last:border-b-0"
                  >
                    <span>{h.dias}:</span>
                    <span className="font-medium tabular-nums text-app-primary">
                      {h.horas}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-app-subtle border-app-hover bg-app-surface-2 px-5 py-2.5 text-xs font-medium text-app-primary transition-all"
              >
                <span>Ver en Google Maps</span>
                <ExternalLink className="size-3.5 shrink-0" />
              </a>
              <a
                href={whatsappUrl(
                  "Hola Good Cell, quisiera asesoría personalizada."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#25d366] px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-[#20ba59]"
              >
                <MessageCircle className="size-4 shrink-0 fill-white stroke-[#25d366]" />
                <span>WhatsApp: {SITE.telefonoVisible}</span>
              </a>
            </div>
          </div>
        </section>

        {relacionados.length > 0 && (
          <section className="mt-14 sm:mt-20">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-app-secondary">
                Sugerencias
              </span>
              <h2 className="text-xl font-bold tracking-tight text-app-primary sm:text-2xl">
                Productos relacionados
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
              {relacionados.map((p, i) => (
                <ProductCard key={p.id} producto={p} indice={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-between gap-3 border-t border-app-subtle bg-app-navbar p-3 backdrop-blur-xl md:hidden">
        <div className="flex flex-col">
          {enOferta && (
            <span className="text-[10px] leading-none tabular-nums text-app-secondary line-through">
              {formatCOP(producto.precio)}
            </span>
          )}
          <span className="text-base font-bold tabular-nums text-app-primary">
            {formatCOP(precioFinal)}
          </span>
        </div>
        <button
          type="button"
          disabled={agotado}
          onClick={anadir}
          className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-semibold shadow-md transition-all ${
            agotado
              ? "cursor-not-allowed border border-app-subtle bg-app-surface-2 text-app-secondary opacity-50"
              : "bg-app-accent text-app-accent-contrast hover:opacity-95"
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
              <ShoppingBag className="size-3.5 shrink-0" />
              <span>Añadir al carrito</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}