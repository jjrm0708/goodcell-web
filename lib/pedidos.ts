import type { ItemCarrito } from "@/components/cart-provider";
import { supabase } from "@/lib/supabase";
import { formatCOP } from "@/lib/utils";
import { ofertaVigente, precioEfectivo, textoGarantia } from "@/lib/precios";
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

// Guarda el pedido en Supabase. El servidor valida los datos y calcula los precios.
export async function registrarPedido(
  datos: DatosPedido
): Promise<{ codigo: string; total: number }> {
  const { data, error } = await supabase.rpc("crear_pedido", {
    p_nombre: datos.nombre,
    p_telefono: datos.telefono,
    p_metodo: datos.metodo,
    p_direccion: datos.direccion,
    p_ciudad: datos.ciudad,
    p_items: datos.items.map((i) => ({
      producto_id: i.producto.id,
      cantidad: i.cantidad,
    })),
  });

  if (error) {
    // P0001 = mensajes que escribimos nosotros en la función (ya están en español)
    if (error.code === "P0001") throw new Error(error.message);
    throw new Error(
      "No pudimos registrar tu pedido. Intenta de nuevo o escríbenos por WhatsApp."
    );
  }
  return data as { codigo: string; total: number };
}

export function construirMensajeWhatsApp(
  datos: DatosPedido,
  codigo: string,
  totalConfirmado: number
): string {
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
      : `🚚 *Método de entrega:* Enviar a domicilio (Envío gratis)\n📍 *Dirección:* ${datos.direccion.trim()}\n🏙️ *Ciudad:* ${datos.ciudad.trim()}`;

  const contacto = `👤 *Cliente:* ${datos.nombre.trim()}\n📱 *Teléfono:* ${datos.telefono.trim()}`;

  const aviso =
    totalConfirmado !== subtotalCarrito(datos.items)
      ? "\n(El total fue recalculado con los precios actuales del catálogo.)"
      : "";

  const mensaje = `Hola Good Cell 👋 Deseo solicitar el siguiente pedido desde su catálogo web:\n\n*Pedido #${codigo}*\n\n${lineas}\n\n*Total a pagar:* ${formatCOP(
    totalConfirmado
  )}${aviso}\n\n${entrega}\n\n${contacto}\n\nQuedo atento para confirmar el pago y coordinar la entrega. ¡Muchas gracias!`;

  return whatsappUrl(mensaje);
}