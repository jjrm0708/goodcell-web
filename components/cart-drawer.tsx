"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Clock,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
  User,
  X,
} from "lucide-react";
import { useCarrito } from "@/components/cart-provider";
import { ProductPlaceholder } from "@/components/product-placeholder";
import {
  CLAVE_ULTIMO_PEDIDO,
  construirMensajeWhatsApp,
  registrarPedido,
  subtotalCarrito,
  type MetodoEntrega,
} from "@/lib/pedidos";
import {
  ofertaVigente,
  porcentajeDescuento,
  precioEfectivo,
  textoGarantia,
} from "@/lib/precios";
import { SITE } from "@/lib/site";
import { formatCOP } from "@/lib/utils";

const campo =
  "w-full rounded-xl border border-app-subtle bg-app-surface-2 py-2 pr-3 text-xs text-app-primary transition-all focus:border-app-accent focus:outline-none";

export function CartDrawer() {
  const router = useRouter();
  const { items, abierto, cerrar, cambiarCantidad, quitar, vaciar } =
    useCarrito();
  const [metodo, setMetodo] = useState<MetodoEntrega>("recoger");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!abierto) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", alTeclear);
    return () => {
      document.body.style.overflow = previo;
      window.removeEventListener("keydown", alTeclear);
    };
  }, [abierto, cerrar]);

  if (!abierto) return null;

  const totalUnidades = items.reduce((s, i) => s + i.cantidad, 0);
  const subtotal = subtotalCarrito(items);

  const validar = (): string | null => {
    if (nombre.trim().length < 2) return "Escribe tu nombre completo.";
    const telefonoLimpio = telefono.trim();
    if (
      telefonoLimpio.replace(/\D/g, "").length < 7 ||
      telefonoLimpio.length > 20
    ) {
      return "Escribe un teléfono válido.";
    }
    if (metodo === "domicilio" && (!direccion.trim() || !ciudad.trim())) {
      return "Escribe la dirección y la ciudad de entrega.";
    }
    return null;
  };

  const enviarPedido = async () => {
    if (items.length === 0 || enviando) return;
    const problema = validar();
    if (problema) {
      setError(problema);
      return;
    }

    setError(null);
    setEnviando(true);

    try {
      const datos = { items, metodo, direccion, ciudad, nombre, telefono };
      const { codigo, total } = await registrarPedido(datos);
      const url = construirMensajeWhatsApp(datos, codigo, total);

      try {
        sessionStorage.setItem(
          CLAVE_ULTIMO_PEDIDO,
          JSON.stringify({ codigo, url })
        );
      } catch {
        // si el navegador bloquea el almacenamiento, igual seguimos
      }

      // Si el navegador bloquea esta pestaña, la página siguiente tiene el botón
      window.open(url, "_blank");
      vaciar();
      cerrar();
      router.push("/pedido-enviado");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No pudimos registrar tu pedido. Intenta de nuevo."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras"
    >
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm"
        onClick={cerrar}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex w-full sm:max-w-xl">
        <div className="relative flex h-full w-full flex-col overflow-hidden border-app-subtle bg-app-surface-1 shadow-2xl sm:border-l">
          <div className="flex shrink-0 items-center justify-between border-b border-app-subtle px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-app-subtle bg-app-accent-subtle">
                <ShoppingBag className="size-5 text-app-accent" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-app-primary sm:text-xl">
                  Tu carrito
                </h2>
                <p className="text-xs text-app-secondary">
                  {totalUnidades}{" "}
                  {totalUnidades === 1
                    ? "producto seleccionado"
                    : "productos seleccionados"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar carrito"
              className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-app-subtle border-app-hover bg-app-surface-2 text-app-secondary transition-colors hover:text-app-primary"
            >
              <X className="size-5" />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center sm:p-10">
              <div className="mb-5 flex size-20 items-center justify-center rounded-full border border-app-subtle bg-app-surface-2 text-app-secondary shadow-inner">
                <ShoppingBag className="size-10 opacity-60" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-app-primary">
                Tu carrito está vacío
              </h3>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-app-secondary sm:text-sm">
                Descubre lo último en audio premium, ecosistema Apple,
                fotografía y gaming en Good Cell Unicentro Armenia.
              </p>
              <Link
                href="/#catalogo"
                onClick={cerrar}
                className="mt-6 inline-flex min-h-11 cursor-pointer items-center whitespace-nowrap rounded-full bg-app-accent px-7 py-3 text-sm font-semibold text-app-accent-contrast shadow-md transition-all active:scale-95"
              >
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-6 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-app-secondary">
                    <span>Artículos ({totalUnidades})</span>
                    <button
                      type="button"
                      onClick={vaciar}
                      className="cursor-pointer text-[11px] font-normal normal-case text-app-secondary transition-colors hover:text-red-500"
                    >
                      Vaciar todo
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {items.map(({ producto, cantidad }) => {
                      const enOferta = ofertaVigente(producto);
                      return (
                        <div
                          key={producto.id}
                          className="flex items-center gap-3 rounded-2xl border border-app-subtle bg-app-surface-2 p-3 sm:gap-4 sm:p-3.5"
                        >
                          <div className="size-14 shrink-0 overflow-hidden rounded-xl sm:size-16">
                            <ProductPlaceholder
                              marca={null}
                              categoriaSlug={null}
                              className="h-full rounded-xl!"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-app-secondary">
                              <span>{producto.marca}</span>
                              <span className="opacity-40">·</span>
                              <span className="font-medium normal-case">
                                {textoGarantia(producto.garantia_meses)}
                              </span>
                            </div>
                            <h4 className="truncate text-xs font-semibold text-app-primary sm:text-sm">
                              {producto.nombre}
                            </h4>
                            <div className="mt-1 flex items-baseline gap-2">
                              {enOferta ? (
                                <>
                                  <span className="text-xs font-bold tabular-nums text-app-accent sm:text-sm">
                                    {formatCOP(precioEfectivo(producto))}
                                  </span>
                                  <span className="text-[10px] tabular-nums text-app-secondary line-through">
                                    {formatCOP(producto.precio)}
                                  </span>
                                  <span className="rounded bg-app-accent-subtle px-1.5 text-[9px] font-bold text-app-accent">
                                    -{porcentajeDescuento(producto)}%
                                  </span>
                                </>
                              ) : (
                                <span className="text-xs font-bold tabular-nums text-app-primary sm:text-sm">
                                  {formatCOP(precioEfectivo(producto))}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            <div className="flex items-center rounded-xl border border-app-subtle bg-app-surface-1 p-0.5 shadow-sm">
                              <button
                                type="button"
                                onClick={() => cambiarCantidad(producto.id, -1)}
                                aria-label="Disminuir cantidad"
                                className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-app-secondary transition-colors hover:text-app-primary active:scale-95"
                              >
                                <Minus className="size-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold tabular-nums text-app-primary">
                                {cantidad}
                              </span>
                              <button
                                type="button"
                                disabled={cantidad >= producto.stock}
                                onClick={() => cambiarCantidad(producto.id, 1)}
                                aria-label="Aumentar cantidad"
                                className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-app-secondary transition-colors hover:text-app-primary active:scale-95 disabled:opacity-30"
                              >
                                <Plus className="size-3" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => quitar(producto.id)}
                              title="Eliminar producto"
                              aria-label={`Eliminar ${producto.nombre}`}
                              className="flex size-8 cursor-pointer items-center justify-center rounded-xl text-app-secondary transition-colors hover:bg-red-500/10 hover:text-red-500"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3 border-t border-app-subtle pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-app-secondary">
                    Método de entrega
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div
                      className={`rounded-2xl border p-3.5 transition-all ${
                        metodo === "recoger"
                          ? "border-app-accent bg-app-surface-2 shadow-[0_0_14px_var(--accent-subtle)]"
                          : "border-app-subtle border-app-hover bg-app-surface-1"
                      }`}
                    >
                      <button
                        type="button"
                        aria-pressed={metodo === "recoger"}
                        onClick={() => setMetodo("recoger")}
                        className="flex w-full cursor-pointer items-center gap-2.5 text-left"
                      >
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${
                            metodo === "recoger"
                              ? "bg-app-accent text-app-accent-contrast"
                              : "bg-app-surface-2 text-app-secondary"
                          }`}
                        >
                          <Store className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold tracking-tight text-app-primary">
                            Recoger en tienda
                          </div>
                          <div className="text-[11px] font-medium text-app-accent">
                            Sin costo adicional
                          </div>
                        </div>
                      </button>

                      {metodo === "recoger" && (
                        <div className="mt-3 space-y-1.5 border-t border-app-subtle pt-2.5 text-[11px] text-app-secondary">
                          <div className="flex items-start gap-1.5">
                            <MapPin className="mt-0.5 size-3.5 shrink-0 text-app-accent" />
                            <span>
                              {SITE.direccion.centroComercial},{" "}
                              {SITE.direccion.calle}
                            </span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <Clock className="mt-0.5 size-3.5 shrink-0 text-app-accent" />
                            <span>
                              Lun-Jue: 10am-8pm | Vie-Sáb: 10am-9pm | Dom:
                              11am-7pm
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`rounded-2xl border p-3.5 transition-all ${
                        metodo === "domicilio"
                          ? "border-app-accent bg-app-surface-2 shadow-[0_0_14px_var(--accent-subtle)]"
                          : "border-app-subtle border-app-hover bg-app-surface-1"
                      }`}
                    >
                      <button
                        type="button"
                        aria-pressed={metodo === "domicilio"}
                        onClick={() => setMetodo("domicilio")}
                        className="flex w-full cursor-pointer items-center gap-2.5 text-left"
                      >
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${
                            metodo === "domicilio"
                              ? "bg-app-accent text-app-accent-contrast"
                              : "bg-app-surface-2 text-app-secondary"
                          }`}
                        >
                          <Truck className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold tracking-tight text-app-primary">
                            Enviar a domicilio
                          </div>
                          <div className="text-[11px] text-app-secondary">
                            A todo Colombia
                          </div>
                          <div className="text-[11px] font-medium text-app-accent">
                            Envío gratis
                          </div>
                        </div>
                      </button>

                      {metodo === "domicilio" && (
                        <div className="mt-3 space-y-2.5 border-t border-app-subtle pt-2.5 text-[11px]">
                          <div>
                            <label
                              htmlFor="carrito-direccion"
                              className="mb-1 block font-medium text-app-secondary"
                            >
                              Dirección de entrega:
                            </label>
                            <input
                              id="carrito-direccion"
                              type="text"
                              value={direccion}
                              onChange={(e) => setDireccion(e.target.value)}
                              placeholder="Ej. Cra. 19 #12N-45"
                              className={`${campo} pl-3`}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="carrito-ciudad"
                              className="mb-1 block font-medium text-app-secondary"
                            >
                              Ciudad:
                            </label>
                            <input
                              id="carrito-ciudad"
                              type="text"
                              value={ciudad}
                              onChange={(e) => setCiudad(e.target.value)}
                              placeholder="Ej. Armenia"
                              className={`${campo} pl-3`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border-t border-app-subtle pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-app-secondary">
                    Tus datos de contacto
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="carrito-nombre"
                        className="mb-1 block text-[11px] font-medium text-app-secondary"
                      >
                        Nombre completo
                      </label>
                      <div className="relative flex items-center">
                        <User className="pointer-events-none absolute left-3 size-3.5 text-app-secondary" />
                        <input
                          id="carrito-nombre"
                          type="text"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          placeholder="Ej. Juan Pérez"
                          className={`${campo} pl-9`}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="carrito-telefono"
                        className="mb-1 block text-[11px] font-medium text-app-secondary"
                      >
                        Teléfono / WhatsApp
                      </label>
                      <div className="relative flex items-center">
                        <Phone className="pointer-events-none absolute left-3 size-3.5 text-app-secondary" />
                        <input
                          id="carrito-telefono"
                          type="tel"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          placeholder="Ej. 310 500 0000"
                          className={`${campo} pl-9`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="shrink-0 space-y-3 border-t border-app-subtle bg-app-surface-1 p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.12)] sm:p-6 sm:shadow-none">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-app-secondary">
                    <span>Subtotal</span>
                    <span className="font-medium tabular-nums">
                      {formatCOP(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-app-secondary">
                      Total a pagar
                    </span>
                    <span className="text-2xl font-extrabold tabular-nums tracking-tight text-app-primary sm:text-3xl">
                      {formatCOP(subtotal)}
                    </span>
                  </div>
                </div>

                                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-xs font-medium text-red-500"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  disabled={enviando}
                  onClick={enviarPedido}
                  className="flex h-12 min-h-12 w-full cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-[#25d366] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#20ba59] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 sm:text-base"
                >
                  <MessageCircle className="size-5 shrink-0 fill-white stroke-[#25d366]" />
                  <span>
                    {enviando ? "Enviando pedido…" : "Enviar pedido por WhatsApp"}
                  </span>
                  {!enviando && <ArrowRight className="size-4 shrink-0" />}
                </button>

                <p className="px-2 text-center text-[11px] leading-tight text-app-secondary">
                  El pedido se envía por WhatsApp para confirmar el pago y
                  coordinar la entrega.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}