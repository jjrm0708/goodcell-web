const ZONA = "America/Bogota";

function diaColombia(fecha: Date): string {
  return fecha.toLocaleDateString("en-CA", { timeZone: ZONA });
}

// "Hoy, 14:15" · "Ayer, 18:30" · "5 oct, 10:20"
export function formatearFechaPedido(iso: string): string {
  const fecha = new Date(iso);
  const hora = fecha.toLocaleTimeString("es-CO", {
    timeZone: ZONA,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const dia = diaColombia(fecha);
  if (dia === diaColombia(new Date())) return `Hoy, ${hora}`;
  if (dia === diaColombia(new Date(Date.now() - 24 * 60 * 60 * 1000))) {
    return `Ayer, ${hora}`;
  }
  const corta = fecha.toLocaleDateString("es-CO", {
    timeZone: ZONA,
    day: "numeric",
    month: "short",
  });
  return `${corta}, ${hora}`;
}