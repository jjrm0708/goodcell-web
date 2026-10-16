"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Check,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Receipt,
  Store,
  Truck,
  User,
  X,
} from "lucide-react";
import { EstadoBadge } from "@/components/admin/estado-badge";
import { formatearFechaCompleta } from "@/lib/fechas";
import { SITE } from "@/lib/site";
import { supabase } from "@/lib/supabase";
import { formatCOP } from "@/lib/utils";

export type PedidoAdmin = {
  id: string;
  codigo: string;
  cliente_nombre: string;
  cliente_telefono: string;
  metodo_entrega: "recoger" | "domicilio";
  direccion: string | null;
  ciudad: string | null;
  total: number;
  estado: string;
  creado_en: string;
  cantidad_articulos: number;
};

type ItemPedido = {
  id: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
};

export const ESTADOS = [
  { valor: "pendiente", etiqueta: "Pendiente", texto: "Pendiente (En espera de confirmación / pago)" },
  { valor: "en_preparacion", etiqueta: "En preparación", texto: "En preparación (Empacando en Unicentro)" },
  { valor: "completado", etiqueta: "Completado", texto: "Completado (Entregado al cliente / finalizado)" },
  { valor: "cancelado", etiqueta: "Cancelado", texto: "Cancelado (Orden anulada)" },
];

const seccion =
  "space-y-3 rounded-2xl border border-app-subtle bg-app-surface-1 p-4 shadow-sm sm:p-5";
const tituloSeccion = "text-xs font-bold uppercase tracking-wider text-app-secondary";

export function PedidoDetalleModal({
  pedido,
  guardando,
  error,
  onClose,
  onGuardar,
}: {
  pedido: PedidoAdmin;
  guardando: boolean;
  error: string | null;
  onClose: () => void;
  onGuardar: (estado: string) => void;
}) {
  const [estado, setEstado] = useState(pedido.estado);
  const [items, setItems] = useState<ItemPedido[] | null>(null);
  const [falloItems, setFalloItems] = useState(false);

  useEffect(() => {
    let activo = true;
    supabase
      .from("pedido_items")
      .select("id, nombre, cantidad, precio_unitario")
      .eq("pedido_id", pedido.id)
      .order("nombre")
      .then(({ data, error: fallo }) => {
        if (!activo) return;
        if (fallo) setFalloItems(true);
        else setItems((data ?? []) as ItemPedido[]);
      });
    return () => {
      activo = false;
    };
  }, [pedido.id]);

  useEffect(() => {
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", alTeclear);
    return () => {
      document.body.style.overflow = previo;
      window.removeEventListener("keydown", alTeclear);
    };
  }, [onClose]);

  const limpio = pedido.cliente_telefono.replace(/\D/g, "");
  const telefonoWa = limpio.startsWith("57") ? limpio : `57${limpio}`;
  const urlWa = `https://wa.me/${telefonoWa}?text=${encodeURIComponent(
    `Hola ${pedido.cliente_nombre} 👋 Te escribimos de Good Cell Armenia respecto a tu pedido #${pedido.codigo}.`
  )}`;
  const domicilio = pedido.metodo_entrega === "domicilio";

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`Pedido ${pedido.codigo}`}
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative flex min-h-dvh items-center justify-center px-0 py-0 sm:px-4 sm:py-8">
        <div className="relative z-10 flex min-h-dvh w-full flex-col overflow-hidden border-app-subtle bg-app-primary shadow-2xl sm:min-h-0 sm:max-w-2xl sm:rounded-3xl sm:border">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-app-subtle bg-app-surface-1 px-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-app-subtle bg-app-accent-subtle text-app-accent">
                <Receipt className="size-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold tracking-tight text-app-primary sm:text-lg">
                    Pedido #{pedido.codigo}
                  </h2>
                  <EstadoBadge estado={pedido.estado} />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-app-secondary">
                  <Calendar className="size-3 shrink-0" />
                  <span>Registrado: {formatearFechaCompleta(pedido.creado_en)}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-app-subtle bg-app-surface-2 text-app-secondary transition-colors hover:text-app-primary"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            <section className={seccion}>
              <div className="flex items-center justify-between border-b border-app-subtle pb-2.5">
                <span className={tituloSeccion}>Datos del cliente</span>
                <span className="text-[11px] text-app-secondary">Contacto directo</span>
              </div>
              <div className="flex flex-col justify-between gap-3 pt-1 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="size-4 shrink-0 text-app-accent" />
                    <span className="text-sm font-bold text-app-primary">
                      {pedido.cliente_nombre}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-app-secondary">
                    <Phone className="size-3.5 shrink-0" />
                    <span>{pedido.cliente_telefono}</span>
                  </div>
                </div>
                <a
                  href={urlWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#25d366] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#20ba59] active:scale-[0.98]"
                >
                  <MessageCircle className="size-4 fill-white stroke-[#25d366]" />
                  <span>Abrir chat de WhatsApp</span>
                </a>
              </div>
            </section>

            <section className={seccion}>
              <div className="flex items-center gap-2 border-b border-app-subtle pb-2.5">
                {domicilio ? (
                  <Truck className="size-4 text-blue-500" />
                ) : (
                  <Store className="size-4 text-emerald-500" />
                )}
                <span className={tituloSeccion}>
                  Método de entrega: {domicilio ? "Enviar a domicilio" : "Recoger en tienda"}
                </span>
              </div>
              {domicilio ? (
                <div className="space-y-1.5 rounded-xl border border-app-subtle bg-app-surface-2 p-3">
                  <div className="flex items-start gap-2 text-xs text-app-primary">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-blue-500" />
                    <div>
                      <span className="block font-semibold">Dirección de entrega:</span>
                      <span>{pedido.direccion || "Dirección por coordinar"}</span>
                    </div>
                  </div>
                  {pedido.ciudad && (
                    <div className="pl-6 text-xs text-app-secondary">
                      Ciudad:{" "}
                      <span className="font-medium text-app-primary">{pedido.ciudad}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1 rounded-xl border border-app-subtle bg-app-surface-2 p-3">
                  <div className="flex items-start gap-2 text-xs text-app-primary">
                    <Store className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    <div>
                      <span className="block font-semibold">Punto de retiro físico:</span>
                      <span>
                        {SITE.direccion.centroComercial}, {SITE.direccion.calle},{" "}
                        {SITE.direccion.ciudad}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className={seccion}>
              <div className="flex items-center justify-between border-b border-app-subtle pb-2.5">
                <div className="flex items-center gap-2">
                  <Package className="size-4 text-app-accent" />
                  <span className={tituloSeccion}>Productos del pedido</span>
                </div>
                <span className="text-xs text-app-secondary">
                  {pedido.cantidad_articulos}{" "}
                  {pedido.cantidad_articulos === 1 ? "artículo" : "artículos"}
                </span>
              </div>

              {falloItems ? (
                <p className="py-3 text-xs font-medium text-red-500">
                  No se pudieron cargar los productos. Cierra e intenta de nuevo.
                </p>
              ) : !items ? (
                <p className="py-3 text-xs text-app-secondary">Cargando productos…</p>
              ) : (
                <div className="divide-y divide-[var(--border-subtle)]">
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between gap-3 py-2.5 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-app-primary">
                          {it.nombre}
                        </div>
                        <div className="text-[11px] text-app-secondary">
                          {it.cantidad} {it.cantidad === 1 ? "unidad" : "unidades"} ×{" "}
                          {formatCOP(Number(it.precio_unitario))}
                        </div>
                      </div>
                      <div className="shrink-0 text-right font-bold tabular-nums text-app-primary">
                        {formatCOP(Number(it.precio_unitario) * it.cantidad)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-baseline justify-between border-t border-app-subtle pt-3">
                <span className={tituloSeccion}>Total del pedido</span>
                <span className="text-xl font-extrabold tabular-nums tracking-tight text-app-primary sm:text-2xl">
                  {formatCOP(Number(pedido.total))}
                </span>
              </div>
            </section>

            <section className={seccion}>
              <div className="flex items-center justify-between border-b border-app-subtle pb-2.5">
                <span className={tituloSeccion}>Actualizar estado del pedido</span>
                <span className="text-[11px] text-app-secondary">Control de despacho</span>
              </div>
              <div className="space-y-1.5 pt-1">
                <label
                  htmlFor="pedido-estado"
                  className="block text-xs font-semibold text-app-primary"
                >
                  Estado actual de la orden:
                </label>
                <select
                  id="pedido-estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="h-11 w-full cursor-pointer rounded-xl border border-app-subtle bg-app-surface-2 px-3 text-xs font-medium text-app-primary transition-all focus:border-app-accent focus:outline-none sm:text-sm"
                >
                  {ESTADOS.map((e) => (
                    <option key={e.valor} value={e.valor}>
                      {e.texto}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] leading-relaxed text-app-secondary">
                  Al pasar a «En preparación» o «Completado» se descuenta del
                  inventario. Si vuelves a «Pendiente» o «Cancelado», las
                  unidades regresan al stock.
                </p>
              </div>
            </section>

            {error && (
              <p
                role="alert"
                className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-500"
              >
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-app-subtle bg-app-primary/95 p-4 backdrop-blur-md sm:p-5">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 cursor-pointer rounded-xl border border-app-subtle border-app-hover bg-app-surface-1 px-5 py-2 text-xs font-semibold text-app-secondary transition-all hover:text-app-primary sm:text-sm"
            >
              Cerrar
            </button>
            <button
              type="button"
              disabled={guardando}
              onClick={() => onGuardar(estado)}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#25d366] px-6 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[#20ba59] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 sm:text-sm"
            >
              <Check className="size-4 stroke-[2.5]" />
              <span>{guardando ? "Guardando…" : "Guardar cambios de estado"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}