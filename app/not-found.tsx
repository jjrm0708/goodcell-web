import Link from "next/link";
import { AlertCircle, Home, MessageCircle, ShoppingBag } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { SITE, whatsappUrl } from "@/lib/site";

export default function NotFound() {
  const urlWhatsApp = whatsappUrl(
    "Hola Good Cell, estaba navegando en su tienda y la página que buscaba no aparece. ¿Me pueden ayudar con información o disponibilidad de un producto?"
  );

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8">
      <div className="w-full max-w-xl space-y-8 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="space-y-4 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-app-subtle bg-app-accent-subtle px-3.5 py-1.5 text-xs font-semibold text-app-accent shadow-sm">
            <AlertCircle className="size-3.5" />
            <span>Error 404 · Ruta no encontrada</span>
          </div>

          <h1 className="select-none text-7xl font-black tracking-tight text-app-primary opacity-90 sm:text-8xl lg:text-9xl">
            404
          </h1>

          <h2 className="text-2xl font-bold tracking-tight text-app-primary sm:text-3xl">
            No pudimos encontrar esta página
          </h2>

          <p className="mx-auto max-w-md text-sm leading-relaxed text-app-secondary sm:text-base">
            La dirección a la que intentas ingresar no existe, fue modificada o
            el producto ya no se encuentra en nuestro catálogo activo.
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-app-subtle bg-app-surface-1 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-full bg-app-accent px-6 py-2.5 text-sm font-bold text-app-accent-contrast shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
            >
              <Home className="size-4" />
              <span>Volver al inicio</span>
            </Link>

            <Link
              href="/#catalogo"
              className="inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-full border border-app-subtle border-app-hover bg-app-surface-2 px-6 py-2.5 text-sm font-semibold text-app-primary transition-all active:scale-[0.98]"
            >
              <ShoppingBag className="size-4 text-app-accent" />
              <span>Ver catálogo completo</span>
            </Link>
          </div>

          <div className="border-t border-app-subtle pt-4">
            <p className="mb-3 text-xs text-app-secondary">
              ¿Buscabas un modelo específico de Apple, Bose, JBL, DJI o Shokz?
              Escríbenos directamente:
            </p>
            <a
              href={urlWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[46px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[#25d366] px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#20ba59] active:scale-[0.98]"
            >
              <MessageCircle className="size-4 fill-white" />
              <span>Consultar por WhatsApp ({SITE.telefonoVisible})</span>
            </a>
          </div>
        </div>

        <BackButton />
      </div>
    </div>
  );
}