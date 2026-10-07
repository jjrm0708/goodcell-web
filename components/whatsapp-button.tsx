"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { SITE, whatsappUrl } from "@/lib/site";

export function WhatsAppButton() {
  const pathname = usePathname();
  const isProductPage =
    pathname.startsWith("/producto/") || pathname.startsWith("/pedido-enviado");
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const url = whatsappUrl(
    "Hola Good Cell 👋 Me gustaría recibir asesoría sobre sus productos disponibles en Unicentro Armenia."
  );

  return (
    <aside
      aria-label="Contacto por WhatsApp"
      className={`pointer-events-auto fixed z-40 flex items-center gap-3 transition-all duration-300 ${
        isProductPage
          ? "bottom-20 right-4 md:bottom-4 md:right-4"
          : "bottom-4 right-4"
      }`}
    >
      {!isProductPage && showTooltip && (
        <div className="hidden items-center gap-2 rounded-full border border-app-subtle bg-app-surface-2 px-3 py-1.5 text-xs text-app-primary shadow-xl animate-in fade-in slide-in-from-right-4 duration-300 md:flex">
          <span className="size-2 shrink-0 animate-pulse rounded-full bg-[#25d366]" />
          <span>¿Asesoría inmediata? Escríbenos</span>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="ml-1 flex min-h-5 min-w-5 cursor-pointer items-center justify-center p-0.5 text-app-secondary hover:text-app-primary"
            aria-label="Cerrar mensaje de ayuda"
          >
            <X className="size-3" />
          </button>
        </div>
      )}

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Contactar a Good Cell por WhatsApp (${SITE.telefonoVisible})`}
        className="flex size-12 min-h-12 min-w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.45)] transition-all duration-200 hover:scale-105 hover:shadow-[0_6px_26px_rgba(37,211,102,0.6)] active:scale-95"
      >
        <MessageCircle className="size-6 fill-white stroke-[#25d366]" />
      </a>
    </aside>
  );
}