import type { Producto } from "@/lib/types";

type ConOferta = Pick<Producto, "precio" | "precio_oferta" | "oferta_hasta">;

// Fecha de hoy en Colombia (AAAA-MM-DD)
function hoyEnColombia(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
}

// La oferta está vigente si hay precio de oferta y no ha pasado su fecha final
export function ofertaVigente(p: ConOferta): boolean {
  if (p.precio_oferta === null) return false;
  if (!p.oferta_hasta) return true;
  return p.oferta_hasta >= hoyEnColombia();
}

export function precioEfectivo(p: ConOferta): number {
  return ofertaVigente(p) ? (p.precio_oferta as number) : p.precio;
}

export function porcentajeDescuento(p: ConOferta): number {
  if (!ofertaVigente(p)) return 0;
  return Math.round(((p.precio - (p.precio_oferta as number)) / p.precio) * 100);
}

// 12 -> "1 año", 24 -> "2 años", 6 -> "6 meses"
export function textoGarantia(meses: number): string {
  if (meses % 12 === 0) {
    const anios = meses / 12;
    return anios === 1 ? "1 año" : `${anios} años`;
  }
  return `${meses} meses`;
}

// "2026-10-15" -> "15 de octubre"
export function textoFechaOferta(fecha: string): string {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
  });
}