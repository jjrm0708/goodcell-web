import type { ItemCarrito } from "@/components/cart-provider";
import { formatCOP } from "@/lib/utils";
import {
  ofertaVigente,
  precioEfectivo,
  textoGarantia,
} from "@/lib/precios";
import { SITE, whatsappUrl } from "@/lib/site";

export const CLAVE_ULTIMO_PEDIDO = "goodcell_ultimo_pedido";

export type MetodoEntrega = "recoger" | "domicilio";

export type DatosPedido = {
  items: ItemCarrito[];
  metodo: MetodoEntrega;
  direccion: string;
  ciudad: string;
  nombre: string;
  telefono: string;
};

export function subtotalCarrito(items: ItemCarrito[]): number {
  return items.reduce(
    (suma, i) => suma + precioEfectivo(i.producto) * i.cantidad,
    0
  );
}

// Código temporal: en la Fase 3 lo reemplaza el número real de la base de datos
function generarCodigoTemporal(): string {
  return `GC-${Date.now().toString(36).slice(-5).toUpperCase()}`;
}

export function construirPedido(datos: DatosPedido): {
  codigo: string;
  url: string;
} {
  const codigo = generarCodigoTemporal();

  const lineas = datos.items
    .map((i) => {
      const etiquetaOferta = ofertaVigente(i.producto)
        ? " (Precio de oferta)"
        : "";
      return `• ${i.cantidad}x ${i.producto.nombre}${etiquetaOferta} - ${formatCOP(
        precioEfectivo(i.producto) * i.cantidad
      )} [Garantía: ${textoGarantia(i.producto.garantia_meses)}]`;
    })
    .join("\n");

  const entrega =
    datos.metodo === "recoger"
      ? `🏢 *Método de entrega:* Recoger en tienda (${SITE.direccion.centroComercial}, ${SITE.direccion.calle}, ${SITE.direccion.ciudad})`
      : `🚚 *Método de entrega:* Enviar a domicilio (Envío gratis)\n📍 *Dirección:* ${
          datos.direccion.trim() || "Por coordinar"
        }\n🏙️ *Ciudad:* ${datos.ciudad.trim() || "Por coordinar"}`;

  const contacto = `👤 *Cliente:* ${datos.nombre.trim() || "Cliente"}\n📱 *Teléfono:* ${
    datos.telefono.trim() || "No especificado"
  }`;

  const mensaje = `Hola Good Cell 👋 Deseo solicitar el siguiente pedido desde su catálogo web:\n\n*Pedido #${codigo}*\n\n${lineas}\n\n*Total a pagar:* ${formatCOP(
    subtotalCarrito(datos.items)
  )}\n\n${entrega}\n\n${contacto}\n\nQuedo atento para confirmar el pago y coordinar la entrega. ¡Muchas gracias!`;

  return { codigo, url: whatsappUrl(mensaje) };
}