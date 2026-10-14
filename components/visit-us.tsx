import { Clock, ExternalLink, MapPin, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/instagram-icon";
import { SITE, whatsappUrl } from "@/lib/site";

const botonCanal =
  "flex min-h-11 items-center justify-between rounded-full border border-app-subtle border-app-hover bg-app-surface-1 px-5 py-3 text-sm font-semibold text-app-primary transition-all";

export function VisitUs() {
  const { direccion, horarios } = SITE;

  return (
    <section
      id="visitanos"
      aria-label="Información de la tienda física y horarios"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-3xl border border-app-subtle bg-app-surface-1 p-6 shadow-lg sm:p-10 lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-app-accent-subtle blur-3xl"
        />

        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-app-subtle bg-app-surface-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-app-accent">
                <span className="size-2 rounded-full bg-app-accent" />
                <span>Tienda física en Armenia</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-app-primary sm:text-4xl">
                Visítanos en Unicentro
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-app-secondary sm:text-base">
                Descubre de cerca los dispositivos de tecnología más avanzados
                con atención directa y personalizada.
              </p>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border border-app-subtle bg-app-surface-2 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-app-subtle bg-app-accent-subtle">
                <MapPin className="size-5 text-app-accent" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-app-primary">
                  Ubicación de la tienda
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-app-secondary sm:text-sm">
                  {direccion.centroComercial}
                  <br />
                  <span className="font-medium text-app-primary">
                    {direccion.calle}
                  </span>
                  <br />
                  {direccion.ciudad}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border border-app-subtle bg-app-surface-2 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-app-subtle bg-app-accent-subtle">
                <Clock className="size-5 text-app-accent" />
              </div>
              <div className="w-full">
                <h3 className="text-sm font-semibold text-app-primary">
                  Horarios de atención
                </h3>
                <div className="mt-2 divide-y divide-[var(--border-subtle)] text-xs text-app-secondary sm:text-sm">
                  {horarios.map((h) => (
                    <div
                      key={h.dias}
                      className="flex items-center justify-between py-1"
                    >
                      <span>{h.dias}:</span>
                      <span className="font-medium text-app-primary">
                        {h.horas}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-app-subtle bg-app-surface-2 p-6 sm:p-8">
            <h3 className="text-lg font-semibold tracking-tight text-app-primary">
              Canales directos de contacto
            </h3>
            <p className="text-xs leading-relaxed text-app-secondary sm:text-sm">
              Comunícate con nuestro equipo en Armenia para consultar
              disponibilidad inmediata, cotizaciones o programar tu visita.
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <a
                href={whatsappUrl(
                  "Hola Good Cell, quisiera consultar sobre un producto en Unicentro Armenia."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center justify-between rounded-full bg-[#25d366] px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#20ba59] active:scale-[0.98]"
              >
                <span className="flex items-center gap-2.5">
                  <MessageCircle className="size-5 fill-white stroke-[#25d366]" />
                  <span>WhatsApp: {SITE.telefonoVisible}</span>
                </span>
                <ExternalLink className="size-4 opacity-80" />
              </a>

              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={botonCanal}
              >
                <span className="flex items-center gap-2.5">
                  <InstagramIcon className="size-5 text-pink-500" />
                  <span>Instagram {SITE.instagramUsuario}</span>
                </span>
                <ExternalLink className="size-4 text-app-secondary" />
              </a>

              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={botonCanal}
              >
                <span className="flex items-center gap-2.5">
                  <MapPin className="size-5 text-red-500" />
                  <span>Cómo llegar en Google Maps</span>
                </span>
                <ExternalLink className="size-4 text-app-secondary" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}