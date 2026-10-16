"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Filter,
  Search,
  Store,
  Truck,
} from "lucide-react";
import { EstadoBadge } from "@/components/admin/estado-badge";
import {
  ESTADOS,
  PedidoDetalleModal,
  type PedidoAdmin,
} from "@/components/admin/pedido-detalle-modal";
import { formatearFechaPedido } from "@/lib/fechas";
import { supabase } from "@/lib/supabase";
import { formatCOP } from "@/lib/utils";

type Fila = Omit<PedidoAdmin, "cantidad_articulos"> & {
  pedido_items: { count: number }[];
};

async function cargar(): Promise<PedidoAdmin[]> {
  const { data, error } = await supabase
    .from("pedidos")
    .select(
      "id, codigo, cliente_nombre, cliente_telefono, metodo_entrega, direccion, ciudad, total, estado, creado_en, pedido_items(count)"
    )
    .order("creado_en", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as Fila[]).map(({ pedido_items, ...resto }) => ({
    ...resto,
    cantidad_articulos: pedido_items?.[0]?.count ?? 0,
  }));
}

export function PedidosAdmin() {
  const [pedidos, setPedidos] = useState<PedidoAdmin[] | null>(null);
  const [fallo, setFallo] = useState(false);
  const [version, setVersion] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [seleccion, setSeleccion] = useState<PedidoAdmin | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    cargar()
      .then((d) => {
        if (activo) {
          setPedidos(d);
          setFallo(false);
        }
      })
      .catch(() => {
        if (activo) setFallo(true);
      });
    return () => {
      activo = false;
    };
  }, [version]);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 3000);
    return () => clearTimeout(t);
  }, [aviso]);

  const visibles = useMemo(() => {
    const q = busqueda.toLowerCase().trim().replace("#", "");
    return (pedidos ?? []).filter((p) => {
      const coincideEstado = filtro === "todos" || p.estado === filtro;
      const coincideTexto =
        q === "" ||
        p.codigo.toLowerCase().includes(q) ||
        p.cliente_nombre.toLowerCase().includes(q) ||
        p.cliente_telefono.includes(q);
      return coincideEstado && coincideTexto;
    });
  }, [pedidos, busqueda, filtro]);

  if (fallo) {
    return (
      <p
        role="alert"
        className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-500"
      >
        No se pudieron cargar los pedidos. Recarga la página e intenta de nuevo.
      </p>
    );
  }
  if (!pedidos) {
    return <p className="text-sm text-app-secondary">Cargando pedidos…</p>;
  }

  const cerrar = () => {
    setSeleccion(null);
    setErrorModal(null);
  };

  const guardarEstado = async (estado: string) => {
    if (!seleccion || guardando) return;
    if (estado === seleccion.estado) {
      cerrar();
      return;
    }
    setGuardando(true);
    setErrorModal(null);
    const { error } = await supabase.rpc("cambiar_estado_pedido", {
      p_pedido_id: seleccion.id,
      p_estado: estado,
    });
    setGuardando(false);
    if (error) {
      setErrorModal(
        error.code === "P0001"
          ? error.message
          : "No se pudo actualizar el estado. Intenta de nuevo."
      );
      return;
    }
    const etiqueta = ESTADOS.find((e) => e.valor === estado)?.etiqueta ?? estado;
    setAviso(`Estado del pedido actualizado a "${etiqueta}"`);
    cerrar();
    setVersion((v) => v + 1);
  };

  const entrega = (p: PedidoAdmin) =>
    p.metodo_entrega === "domicilio" ? (
      <span
        className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400"
        title={`A domicilio: ${p.direccion ?? ""} ${p.ciudad ? `(${p.ciudad})` : ""}`}
      >
        <Truck className="size-3.5" />
        <span>Domicilio</span>
      </span>
    ) : (
      <span
        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
        title="Recoger en tienda: Unicentro Local 252"
      >
        <Store className="size-3.5" />
        <span>Tienda</span>
      </span>
    );

  return (
    <div className="space-y-6">
      {aviso && (
        <div
          role="status"
          className="fixed right-5 top-20 z-50 flex items-center gap-2 rounded-xl border border-[#25d366] bg-app-surface-1 px-4 py-2.5 text-xs font-semibold text-app-primary shadow-xl animate-in fade-in slide-in-from-top-3"
        >
          <CheckCircle2 className="size-4 shrink-0 text-[#25d366]" />
          <span>{aviso}</span>
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-app-primary sm:text-2xl">
            Pedidos
          </h2>
          <p className="mt-0.5 text-xs text-app-secondary">
            Órdenes recibidas por canal web y WhatsApp · Monitoreo y actualización de despacho
          </p>
        </div>
        <div className="text-xs tabular-nums text-app-secondary">
          <span className="font-bold text-app-primary">{pedidos.length}</span>{" "}
          pedidos registrados
        </div>
      </div>

      <div className="flex flex-col items-stretch justify-between gap-3 rounded-2xl border border-app-subtle bg-app-surface-1 p-3.5 shadow-sm sm:flex-row sm:items-center sm:p-4">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-app-secondary" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar pedidos"
            placeholder="Buscar por código (GC-...), cliente o teléfono..."
            className="h-10 w-full rounded-xl border border-app-subtle bg-app-surface-2 pl-9 pr-3.5 text-xs text-app-primary transition-all placeholder:text-app-secondary focus:border-app-accent focus:outline-none sm:text-sm"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="relative flex w-full items-center sm:w-auto">
            <Filter className="pointer-events-none absolute left-3 size-3.5 text-app-secondary" />
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              aria-label="Filtrar por estado del pedido"
              className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-app-subtle bg-app-surface-2 pl-8 pr-8 text-xs font-medium text-app-primary transition-all focus:border-app-accent focus:outline-none sm:w-auto sm:text-sm"
            >
              <option value="todos">Todos los estados</option>
              {ESTADOS.map((e) => (
                <option key={e.valor} value={e.valor}>
                  {e.etiqueta}
                </option>
              ))}
            </select>
          </div>
          <span className="hidden whitespace-nowrap pl-1 text-xs tabular-nums text-app-secondary sm:inline">
            {visibles.length} {visibles.length === 1 ? "pedido" : "pedidos"}
          </span>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-app-subtle bg-app-surface-1 shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-app-subtle bg-app-surface-2 text-[11px] font-bold uppercase tracking-wider text-app-secondary">
                <th className="px-4 py-3.5 lg:px-6">Código</th>
                <th className="px-4 py-3.5 lg:px-6">Cliente</th>
                <th className="px-4 py-3.5 text-center">Entrega</th>
                <th className="px-4 py-3.5 text-right">Total</th>
                <th className="px-4 py-3.5 text-center">Estado</th>
                <th className="px-4 py-3.5 text-right">Fecha</th>
                <th className="w-12 px-4 py-3.5 lg:px-6" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {visibles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-app-secondary">
                    {pedidos.length === 0
                      ? "Aún no hay pedidos registrados."
                      : "No se encontraron pedidos con los criterios de búsqueda."}
                  </td>
                </tr>
              ) : (
                visibles.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSeleccion(p)}
                    className="group cursor-pointer transition-colors hover:bg-app-surface-2/60"
                  >
                    <td className="whitespace-nowrap px-4 py-4 font-bold tracking-tight text-app-primary lg:px-6">
                      <span className="transition-colors group-hover:text-app-accent">
                        #{p.codigo}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-app-primary lg:px-6">
                      <div className="font-semibold">{p.cliente_nombre}</div>
                      <div className="text-[11px] tabular-nums text-app-secondary">
                        {p.cliente_telefono}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-center">
                      {entrega(p)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right font-bold tabular-nums text-app-primary">
                      {formatCOP(Number(p.total))}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-center">
                      <EstadoBadge estado={p.estado} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right text-xs tabular-nums text-app-secondary">
                      {formatearFechaPedido(p.creado_en)}
                    </td>
                    <td className="px-4 py-4 text-center lg:px-6">
                      <ChevronRight className="inline size-4 text-app-secondary opacity-40 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {visibles.length === 0 ? (
          <div className="rounded-2xl border border-app-subtle bg-app-surface-1 p-8 text-center text-xs text-app-secondary">
            {pedidos.length === 0
              ? "Aún no hay pedidos registrados."
              : "No se encontraron pedidos."}
          </div>
        ) : (
          visibles.map((p) => (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => setSeleccion(p)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSeleccion(p);
              }}
              className="cursor-pointer space-y-3 rounded-2xl border border-app-subtle bg-app-surface-1 p-4 shadow-sm transition-transform active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-app-primary">
                    #{p.codigo}
                  </span>
                  <span className="text-[11px] text-app-secondary">
                    · {formatearFechaPedido(p.creado_en)}
                  </span>
                </div>
                <EstadoBadge estado={p.estado} />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-app-primary">
                  <span>{p.cliente_nombre}</span>
                  <span className="text-sm font-bold tabular-nums">
                    {formatCOP(Number(p.total))}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-app-secondary">
                  <span>{p.cliente_telefono}</span>
                  <span className="inline-flex items-center gap-1 font-medium">
                    {p.metodo_entrega === "domicilio" ? (
                      <>
                        <Truck className="size-3.5 text-blue-500" />
                        <span>A domicilio</span>
                      </>
                    ) : (
                      <>
                        <Store className="size-3.5 text-emerald-500" />
                        <span>Recoger en tienda</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-app-subtle pt-2 text-xs font-medium text-app-secondary">
                <span>
                  {p.cantidad_articulos}{" "}
                  {p.cantidad_articulos === 1 ? "artículo" : "artículos"}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-app-accent">
                  <span>Ver detalle</span>
                  <ChevronRight className="size-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {seleccion && (
        <PedidoDetalleModal
          key={seleccion.id}
          pedido={seleccion}
          guardando={guardando}
          error={errorModal}
          onClose={cerrar}
          onGuardar={guardarEstado}
        />
      )}
    </div>
  );
}