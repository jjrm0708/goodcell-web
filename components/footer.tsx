import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/instagram-icon";
import { SITE, whatsappUrl } from "@/lib/site";

const pill =
  "inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border border-app-subtle border-app-hover bg-app-surface-2 px-4 py-2 text-xs font-medium transition-all hover:text-app-primary";

const enlaces = [
  { href: "/sobre-nosotros", texto: "Sobre nosotros" },
  { href: "/contacto", texto: "Contacto" },
  { href: "/terminos-y-condiciones", texto: "Términos y condiciones" },
  { href: "/politica-de-privacidad", texto: "Política de privacidad" },
  { href: "/politica-de-cookies", texto: "Política de cookies" },
  { href: "/garantias", texto: "Garantías" },
];

export function Footer() {
  const { direccion } = SITE;

  return (
    <footer className="border-t border-app-subtle bg-app-surface-1 pb-24 pt-12 text-app-secondary sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 border-b border-app-subtle pb-10 md:flex-row">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:gap-6 sm:text-left">
            <Image
              src="/logo-good-cell-claro.png"
              alt="Good Cell"
              width={500}
              height={580}
              className="h-24 w-auto shrink-0 dark:hidden sm:h-28"
            />
            <Image
              src="/logo-good-cell-oscuro.png"
              alt="Good Cell"
              width={500}
              height={580}
              className="hidden h-24 w-auto shrink-0 dark:block sm:h-28"
            />
            <div>
              <span className="text-base font-bold tracking-tight text-app-primary">
                Good Cell Armenia
              </span>
              <p className="mt-1 text-xs sm:text-sm">
                {direccion.centroComercial} · {direccion.calle} · {direccion.ciudad}
              </p>
              <p className="mt-0.5 text-xs">
                Atención directa por WhatsApp al {SITE.telefonoVisible}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={pill}
            >
              <InstagramIcon className="size-4 shrink-0 text-app-primary" />
              <span>Instagram</span>
            </a>
            <a
              href={whatsappUrl(
                "Hola Good Cell, quisiera recibir asesoría personalizada."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={`${pill} hover:text-[#25d366]`}
            >
              <MessageCircle className="size-4 shrink-0 text-[#25d366]" />
              <span>WhatsApp ({SITE.telefonoVisible})</span>
            </a>
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={pill}
            >
              <MapPin className="size-4 shrink-0 text-app-primary" />
              <span>Google Maps</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-[11px] md:flex-row">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Good Cell. Armenia, Quindío, Colombia.
            Todos los derechos reservados.
          </p>
          <nav
            aria-label="Enlaces del pie de página"
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center"
          >
            {enlaces.map((e, i) => (
              <span key={e.href} className="inline-flex items-center gap-3">
                {i > 0 && <span aria-hidden="true">·</span>}
                <Link
                  href={e.href}
                  className="whitespace-nowrap transition-colors hover:text-app-primary hover:underline"
                >
                  {e.texto}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}