import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Store,
} from "lucide-react";
import { InstagramIcon } from "@/components/instagram-icon";
import { SITE, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto | Good Cell",
  description:
    "Contáctanos por WhatsApp, Instagram o visítanos en el Centro Comercial Unicentro, Armenia.",
};

export default function ContactoPage() {
  const { direccion, horarios } = SITE;

  return (
    <div className="w-full pb-20 pt-24 sm:pt-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group mb-6 inline-flex items-center gap-2 text-xs font-semibold text-app-secondary transition-colors hover:text-app-primary sm:text-sm"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          <span>Volver al catálogo</span>
        </Link>

        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-app-subtle bg-app-surface-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-app-accent">
            <Sparkles className="size-3.5" />
            <span>Atención directa en Armenia</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-app-primary sm:text-5xl">
            Contacto
          </h1>
          <p className="mt-3 text-base leading-relaxed text-app-secondary sm:text-lg">
            Estamos listos para atenderte de manera personalizada. Elige tu
            canal preferido y conéctate directamente con nuestro equipo.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-4 sm:mb-16 sm:gap-6 md:grid-cols-3">
          <a
            href={whatsappUrl(
              "Hola Good Cell Armenia 👋 Quisiera recibir asesoría personalizada sobre sus productos."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-[180px] cursor-pointer flex-col justify-between rounded-3xl bg-[#25d366] p-6 text-white shadow-xl shadow-[#25d366]/20 transition-all hover:bg-[#20ba59] active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <MessageCircle className="size-6 fill-white stroke-[#25d366]" />
              </div>
              <ExternalLink className="size-5 opacity-80 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <div className="mt-4">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-white/80">
                Canal principal
              </span>
              <h2 className="mt-0.5 text-xl font-bold tracking-tight">
                WhatsApp
              </h2>
              <p className="mt-1 text-xs text-white/90">
                Línea oficial: {SITE.telefonoVisible} · Respuesta inmediata y
                cotizaciones
              </p>
            </div>
          </a>

          <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-[180px] cursor-pointer flex-col justify-between rounded-3xl border border-app-subtle bg-app-surface-1 p-6 shadow-lg transition-all hover:border-pink-500/40 hover:bg-app-surface-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-pink-500/20 bg-pink-500/10">
                <InstagramIcon className="size-6 text-pink-500" />
              </div>
              <ExternalLink className="size-5 text-app-secondary transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pink-500" />
            </div>
            <div className="mt-4">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-app-secondary">
                Comunidad digital
              </span>
              <h2 className="mt-0.5 text-xl font-bold tracking-tight text-app-primary transition-colors group-hover:text-pink-500">
                Instagram
              </h2>
              <p className="mt-1 text-xs text-app-secondary">
                {SITE.instagramUsuario} · Lanzamientos, unboxings y contenido
                audiovisual
              </p>
            </div>
          </a>

          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-[180px] cursor-pointer flex-col justify-between rounded-3xl border border-app-subtle bg-app-surface-1 p-6 shadow-lg transition-all hover:border-red-500/40 hover:bg-app-surface-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                <MapPin className="size-6 text-red-500" />
              </div>
              <ExternalLink className="size-5 text-app-secondary transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-red-500" />
            </div>
            <div className="mt-4">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-app-secondary">
                Ficha oficial
              </span>
              <h2 className="mt-0.5 text-xl font-bold tracking-tight text-app-primary transition-colors group-hover:text-red-500">
                Google Maps
              </h2>
              <p className="mt-1 text-xs text-app-secondary">
                Cómo llegar a nuestro local 252 en Unicentro Armenia
              </p>
            </div>
          </a>
        </div>

        <div className="space-y-6 rounded-3xl border border-app-subtle bg-app-surface-1 p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="border-b border-app-subtle pb-4">
            <h2 className="text-lg font-bold tracking-tight text-app-primary sm:text-xl">
              Punto de atención y horarios
            </h2>
            <p className="mt-0.5 text-xs text-app-secondary sm:text-sm">
              Encuéntranos en el principal centro comercial de la ciudad
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-2xl border border-app-subtle bg-app-surface-2 p-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-app-subtle bg-app-accent-subtle text-app-accent">
                <Store className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-app-primary">
                  Ubicación de la tienda
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-app-secondary sm:text-sm">
                  {direccion.centroComercial}
                  <br />
                  <span className="font-semibold text-app-primary">
                    {direccion.calle}
                  </span>
                  <br />
                  {direccion.ciudad}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-app-subtle bg-app-surface-2 p-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-app-subtle bg-app-accent-subtle text-app-accent">
                <Clock className="size-5" />
              </div>
              <div className="w-full space-y-1.5">
                <h3 className="text-sm font-bold text-app-primary">
                  Horarios de atención
                </h3>
                <div className="space-y-1 text-xs text-app-secondary">
                  {horarios.map((h) => (
                    <div
                      key={h.dias}
                      className="flex items-center justify-between"
                    >
                      <span>{h.dias}:</span>
                      <span className="font-semibold text-app-primary">
                        {h.horas}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#25d366]/20 bg-[#25d366]/10 p-4">
            <Phone className="size-4 shrink-0 text-[#25d366]" />
            <p className="text-xs leading-relaxed text-app-primary">
              <strong>Nota sobre soporte:</strong> Todo el contacto y la
              confirmación de compras se gestiona directamente a través de
              nuestra línea de WhatsApp para brindarte atención inmediata.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}