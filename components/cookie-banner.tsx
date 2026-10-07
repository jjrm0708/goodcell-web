"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const CLAVE = "goodcell_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      if (!localStorage.getItem(CLAVE)) {
        timer = setTimeout(() => setVisible(true), 800);
      }
    } catch {
      // Si el navegador bloquea el almacenamiento, no mostramos el aviso
    }
    return () => clearTimeout(timer);
  }, []);

  const elegir = (valor: "all" | "necessary") => {
    try {
      localStorage.setItem(CLAVE, valor);
    } catch {
      // se ignora
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed bottom-20 left-4 right-4 z-50 rounded-2xl border border-app-subtle bg-app-surface-1 p-3.5 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-[340px] sm:p-4"
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-app-accent-subtle text-app-accent">
          <Cookie className="size-3.5" />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold tracking-tight text-app-primary sm:text-[13px]">
              Preferencia de cookies
            </h4>
            <button
              type="button"
              onClick={() => elegir("necessary")}
              aria-label="Cerrar aviso de cookies"
              className="flex size-6 cursor-pointer items-center justify-center rounded-md text-app-secondary transition-colors hover:bg-app-surface-2 hover:text-app-primary"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <p className="text-[11px] leading-snug text-app-secondary sm:text-xs">
            Usamos cookies para tu carrito, preferencia de tema y navegación.{" "}
            <Link
              href="/politica-de-cookies"
              className="inline-block font-semibold text-app-accent hover:underline"
            >
              Ver política
            </Link>
            .
          </p>

          <div className="flex items-center gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => elegir("all")}
              className="min-h-8 flex-1 cursor-pointer rounded-lg bg-app-accent px-2.5 py-1 text-center text-xs font-bold text-app-accent-contrast shadow-sm transition-all hover:opacity-90 active:scale-[0.98] sm:min-h-[34px]"
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={() => elegir("necessary")}
              className="min-h-8 flex-1 cursor-pointer rounded-lg border border-app-subtle border-app-hover bg-app-surface-2 px-2.5 py-1 text-center text-xs font-semibold text-app-primary transition-all active:scale-[0.98] sm:min-h-[34px]"
            >
              Solo necesarias
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}