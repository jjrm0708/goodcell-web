export type EstadoPedido =
  | "pendiente"
  | "en_preparacion"
  | "completado"
  | "cancelado";

const ESTILOS: Record<
  EstadoPedido,
  { texto: string; caja: string; punto: string }
> = {
  completado: {
    texto: "Completado",
    caja: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    punto: "bg-emerald-500",
  },
  en_preparacion: {
    texto: "En preparación",
    caja: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25",
    punto: "bg-sky-500 animate-pulse",
  },
  pendiente: {
    texto: "Pendiente",
    caja: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
    punto: "bg-amber-500",
  },
  cancelado: {
    texto: "Cancelado",
    caja: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25",
    punto: "bg-red-500",
  },
};

export function EstadoBadge({ estado }: { estado: string }) {
  const e = ESTILOS[estado as EstadoPedido] ?? ESTILOS.pendiente;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-[11px] font-semibold ${e.caja}`}
    >
      <span className={`size-1.5 rounded-full ${e.punto}`} />
      {e.texto}
    </span>
  );
}