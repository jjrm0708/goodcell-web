"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Box,
  Calendar,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { EstadoBadge } from "@/components/admin/estado-badge";
import { formatearFechaPedido } from "@/lib/fechas";
import { supabase } from "@/lib/supabase";
import { formatCOP } from "@/lib/utils";

type PedidoResumen = {
  id: string;
  codigo: string;
  cliente_nombre: string;
  cliente_telefono: string;
  total: number;
  estado: string;
  creado_en: string;
};

type Resumen = {
  hoy: number;
  ayer: number;
  ventasMes: number;
  productosActivos: number;
  pocoStock: number;
  ultimos: PedidoResumen[];
};

async function cargarResumen(): Promise<Resumen> {
  const hoy = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Bogota",
  });
  const inicioHoy = new Date(`${hoy}T00:00:00-05:00`);
  const inicioAyer = new Date(inicioHoy.getTime() - 24 * 60 * 60 * 1000);
  const inicioMes = new Date(`${hoy.slice(0, 8)}01T00:00:00-05:00`);

  const contarPedidos = (desde: Date, hasta?: Date) => {
    let consulta = supabase
      .from("pedidos")
      .select("id", { count: "exact", head: true })
      .gte("creado_en", desde.toISOString());
    if (hasta) consulta = consulta.lt("creado_en", hasta.toISOString());
    return consulta;
  };

  const [rHoy, rAyer, rVentas, rActivos, rStock, rUltimos] = await Promise.all([
    contarPedidos(inicioHoy),
    contarPedidos(inicioAyer, inicioHoy),
    supabase
      .from("pedidos")
      .select("total")
      .eq("estado", "completado")
      .gte("creado_en", inicioMes.toISOString()),
    supabase
      .from("productos")
      .select("id", { count: "exact", head: true })
      .eq("activo", true),
    supabase
      .from("productos")
      .select("id", { count: "exact", head: true })
      .eq("activo", true)
      .lte("stock", 3),
    supabase
      .from("pedidos")
      .select(
        "id, codigo, cliente_nombre, cliente_telefono, total, estado, creado_en"
      )
      .order("creado_en", { ascending: false })
      .limit(5),
  ]);

  const fallo = [rHoy, rAyer, rVentas, rActivos, rStock, rUltimos].find(
    (r) => r.error
  );
  if (fallo?.error) throw new Error(fallo.error.message);

  return {
    hoy: rHoy.count ?? 0,
    ayer: rAyer.count ?? 0,
    ventasMes: (rVentas.data ?? []).reduce(
      (suma, p) => suma + Number(p.total),
      0
    ),
    productosActivos: rActivos.count ?? 0,
    pocoStock: rStock.count ?? 0,
    ultimos: (rUltimos.data ?? []) as PedidoResumen[],
  };
}

function textoComparacion(hoy: number, ayer: number): string {
  const diferencia = hoy - ayer;
  if (diferencia === 0) return "Igual que ayer";
  const signo = diferencia > 0 ? "+" : "";
  return `${signo}${diferencia} ${Math.abs(diferencia) === 1 ? "pedido" : "pedidos"} vs. ayer`;
}

function etiquetaMes(): string {
  const texto = new Date().toLocaleDateString("es-CO", {
    month: "long",
    year: "numeric",
    timeZone: "America/Bogota",
  });
  return (texto.charAt(0).toUpperCase() + texto.slice(1)).replace(" de ", " ");
}

function Tarjeta({
  titulo,
  valor,
  detalle,
  Icono,
  borde,
  fondoIcono,
}: {
  titulo: string;
  valor: string;
  detalle: string;
  Icono: React.ElementType;
  borde: string;
  fondoIcono: string;
}) {
  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border border-l-4 border-app-subtle bg-app-surface-1 p-4 shadow-sm ${borde}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-app-secondary">
          {titulo}
        </span>
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${fondoIcono}`}
        >
          <Icono className="size-4" />
        </div>
      </div>
      <div className="mt-3">
        <span className="block text-2xl font-extrabold tabular-nums tracking-tight text-app-primary sm:text-3xl">
          {valor}
        </span>
        <div className="mt-1 text-[11px] text-app-secondary">{detalle}</div>
      </div>
    </div>
  );
}

export function ResumenAdmin() {
  const [datos, setDatos] = useState<Resumen | null>(null);
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    let activo = true;
    cargarResumen()
      .then((r) => {
        if (activo) setDatos(r);
      })
      .catch(() => {
        if (activo) setFallo(true);
      });
    return () => {
      activo = false;
    };
  }, []);

  if (fallo) {
    return (
      <p
        role="alert"
        className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-500"
      >
        No se pudo cargar el resumen. Recarga la página e intenta de nuevo.
      </p>
    );
  }
  if (!datos) {
    return <p className="text-sm text-app-secondary">Cargando resumen…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-app-primary sm:text-2xl">
            Resumen general
          </h2>
          <p className="mt-0.5 text-xs text-app-secondary">
            Actividad de ventas, flujo de pedidos e inventario actual
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-app-subtle bg-app-surface-1 px-3 py-1.5 text-xs text-app-secondary shadow-sm">
          <Calendar className="size-3.5 text-app-accent" />
          <span className="font-semibold text-app-primary">{etiquetaMes()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <Tarjeta
          titulo="Pedidos de hoy"
          valor={String(datos.hoy)}
          detalle={textoComparacion(datos.hoy, datos.ayer)}
          Icono={ShoppingBag}
          borde="border-l-blue-500"
          fondoIcono="border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        <Tarjeta
          titulo="Ventas del mes"
          valor={formatCOP(datos.ventasMes)}
          detalle="Pedidos completados, en pesos colombianos (COP)"
          Icono={TrendingUp}
          borde="border-l-emerald-500"
          fondoIcono="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <Tarjeta
          titulo="Productos activos"
          valor={String(datos.productosActivos)}
          detalle="En catálogo público visible"
          Icono={Box}
          borde="border-l-purple-500"
          fondoIcono="border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400"
        />
        <Tarjeta
          titulo="Poco stock"
          valor={String(datos.pocoStock)}
          detalle="≤ 3 unidades disponibles"
          Icono={AlertTriangle}
          borde="border-l-amber-500"
          fondoIcono="border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-app-subtle bg-app-surface-1 shadow-sm">
        <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
          <div>
            <h3 className="text-base font-bold tracking-tight text-app-primary">
              Últimos 5 pedidos
            </h3>
            <p className="text-xs text-app-secondary">
              Transacciones recibidas por el canal web y WhatsApp
            </p>
          </div>
          <Link
            href="/admin/pedidos"
            className="shrink-0 text-xs font-semibold text-app-accent hover:underline"
          >
            Ver todos los pedidos →
          </Link>
        </div>

        {datos.ultimos.length === 0 ? (
          <p className="border-t border-app-subtle p-8 text-center text-sm text-app-secondary">
            Aún no hay pedidos registrados.
          </p>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-y border-app-subtle bg-app-surface-2 text-[11px] font-bold uppercase tracking-wider text-app-secondary">
                    <th className="px-6 py-3">Código</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-center">Estado</th>
                    <th className="px-6 py-3 text-right">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {datos.ultimos.map((p) => (
                    <tr key={p.id}>
                      <td className="whitespace-nowrap px-6 py-4 font-bold tracking-tight text-app-primary">
                        #{p.codigo}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-app-primary">
                          {p.cliente_nombre}
                        </div>
                        <div className="text-[11px] tabular-nums text-app-secondary">
                          {p.cliente_telefono}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right font-bold tabular-nums text-app-primary">
                        {formatCOP(Number(p.total))}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-center">
                        <EstadoBadge estado={p.estado} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-xs tabular-nums text-app-secondary">
                        {formatearFechaPedido(p.creado_en)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[var(--border-subtle)] border-t border-app-subtle md:hidden">
              {datos.ultimos.map((p) => (
                <div key={p.id} className="space-y-2 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-app-primary">
                      #{p.codigo}
                    </span>
                    <EstadoBadge estado={p.estado} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-app-primary">
                      {p.cliente_nombre}
                    </span>
                    <span className="font-bold tabular-nums text-app-primary">
                      {formatCOP(Number(p.total))}
                    </span>
                  </div>
                  <div className="text-[11px] text-app-secondary">
                    {formatearFechaPedido(p.creado_en)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}