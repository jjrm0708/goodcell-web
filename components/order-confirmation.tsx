"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";
import { CLAVE_ULTIMO_PEDIDO } from "@/lib/pedidos";
import { SITE } from "@/lib/site";

function leerPedido(): string | null {
  try {
    return sessionStorage.getItem(CLAVE_ULTIMO_PEDIDO);
  } catch {
    return null;
  }
}

const sinSuscripcion = () => () => {};

export function OrderConfirmation() {
  const crudo = useSyncExternalStore(sinSuscripcion, leerPedido, () => null);

  const pedido = useMemo(() => {
    if (!crudo) return null;
    try {
      return JSON.parse(crudo) as { codigo: string; url: string };
    } catch {
      return null;
    }
  }, [crudo]);

  if (!pedido) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 pb-16 pt-28">
        <div className="w-full max-w-md space-y-4 rounded-3xl border border-app-subtle bg-app-surface-1 p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold tracking-tight text-app-primary">
            No hay un pedido reciente
          </h1>
          <p className="text-sm text-app-secondary">
            Cuando envíes un pedido desde el carrito, aquí verás su código.
          </p>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-app-accent px-6 py-2.5 text-sm font-semibold text-app-accent-contrast"
          >
            Ir al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center px-4 pb-16 pt-28 sm:px-6 sm:pb-24">
      <div className="relative w-full max-w-lg space-y-6 overflow-hidden rounded-3xl border border-app-subtle bg-app-surface-1 p-6 text-center shadow-2xl sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-[#25d366]/15 blur-3xl"
        />

        <div className="relative mx-auto flex size-20 items-center justify-center rounded-full border-2 border-[#25d366] bg-[#25d366]/15 text-[#25d366] shadow-lg animate-in zoom-in-75 duration-300 sm:size-24">
          <CheckCircle2 className="size-10 stroke-[2.5] sm:size-12" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#25d366]/20 bg-[#25d366]/10 px-3 py-1 text-xs font-bold text-[#25d366]">
            <Sparkles className="size-3.5" />
            <span>Solicitud registrada</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-app-primary sm:text-4xl">
            ¡Pedido enviado!
          </h1>
          <div className="pt-1">
            <span className="block text-xs font-semibold uppercase tracking-wider text-app-secondary">
              Código de referencia:
            </span>
            <span className="font-mono text-xl font-black tracking-tight text-app-primary sm:text-2xl">
              #{pedido.codigo}
            </span>
          </div>
        </div>

        <div className="space-y-2.5 rounded-2xl border border-app-subtle bg-app-surface-2 p-4 text-left sm:p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#25d366]">
            <MessageCircle className="size-4 fill-[#25d366] stroke-white" />
            <span>Paso siguiente en WhatsApp</span>
          </div>
          <p className="text-xs leading-relaxed text-app-secondary sm:text-sm">
            Se ha abierto la conversación con el equipo de Good Cell en
            Armenia. Por ese canal confirmaremos el método de pago que prefieras
            (transferencia, Nequi, Daviplata o contraentrega) y coordinaremos el
            despacho o entrega en nuestra tienda física en Unicentro.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/"
            className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--text-primary)] px-6 py-3 text-sm font-bold text-[var(--bg-primary)] shadow-md transition-all hover:opacity-90 active:scale-[0.98] sm:text-base"
          >
            <ShoppingBag className="size-4" />
            <span>Volver al catálogo</span>
          </Link>

          <a
            href={pedido.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#25d366] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#20ba59] active:scale-[0.98] sm:text-sm"
          >
            <MessageCircle className="size-4 fill-white stroke-[#25d366]" />
            <span>Reabrir conversación de WhatsApp</span>
          </a>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 border-t border-app-subtle pt-2 text-[11px] text-app-secondary sm:flex-row">
          <span className="inline-flex items-center gap-1">
            <Store className="size-3.5 text-app-accent" />
            {SITE.direccion.calle}, Armenia
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            Garantía indicada en cada producto
          </span>
        </div>
      </div>
    </div>
  );
}