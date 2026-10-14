import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  HeartHandshake,
  Sparkles,
  Store,
} from "lucide-react";
import { TrustStrip } from "@/components/trust-strip";
import { VisitUs } from "@/components/visit-us";

export const metadata: Metadata = {
  title: "Sobre nosotros | Good Cell",
  description:
    "Conoce Good Cell: tecnología premium, asesoría humana y productos 100% originales en Unicentro, Armenia.",
};

const VALORES = [
  {
    Icono: Store,
    titulo: "Tecnología premium en Armenia",
    texto:
      "Good Cell nació en el corazón del Eje Cafetero como el punto de encuentro definitivo para los apasionados por la innovación. Desde nuestra tienda en el Centro Comercial Unicentro (Local 252), seleccionamos meticulosamente los dispositivos, accesorios y equipos de audio más destacados del mercado global para ponerlos al alcance de la región.",
  },
  {
    Icono: HeartHandshake,
    titulo: "Asesoría humana de principio a fin",
    texto:
      "Entendemos que adquirir tecnología de primer nivel requiere confianza y claridad. Por eso, en Good Cell te brindamos acompañamiento humano de principio a fin: resolvemos inquietudes técnicas, comparamos modelos y te guiamos para elegir la herramienta que verdaderamente potencie tu estilo de vida y productividad.",
  },
  {
    Icono: Award,
    titulo: "Compromiso con productos originales",
    texto:
      "Mantenemos una política inquebrantable de autenticidad: el 100% de nuestros artículos son totalmente nuevos, sellados de fábrica y cuentan con garantía respaldada por marcas de prestigio mundial como Apple, Bose, DJI, JBL, Logitech y Xiaomi. Tu inversión siempre está segura con nosotros.",
  },
];

const ETIQUETAS = [
  "Audífonos Shokz & Bose",
  "Dispositivos Apple",
  "Fotografía DJI",
  "Periféricos Logitech",
];

export default function SobreNosotrosPage() {
  return (
    <div className="w-full pb-16 pt-24 sm:pt-28">
      <div className="mx-auto mb-8 max-w-7xl px-4 sm:mb-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group mb-6 inline-flex items-center gap-2 text-xs font-semibold text-app-secondary transition-colors hover:text-app-primary sm:text-sm"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          <span>Volver al catálogo</span>
        </Link>

        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-app-subtle bg-app-surface-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-app-accent">
            <Sparkles className="size-3.5" />
            <span>Nuestra identidad</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-app-primary sm:text-5xl">
            Sobre Nosotros
          </h1>
          <p className="mt-3 text-base leading-relaxed text-app-secondary sm:text-lg">
            Pasión por la tecnología de vanguardia, honestidad en cada
            recomendación y presencia física en Armenia, Quindío.
          </p>
        </div>
      </div>

      <div className="mx-auto mb-12 max-w-7xl px-4 sm:mb-16 sm:px-6 lg:px-8">
        <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-3xl border border-app-subtle bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-6 shadow-2xl sm:aspect-[21/9] sm:p-12">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(#25d366_1px,transparent_1px)] opacity-20 [background-size:24px_24px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-[#25d366]/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-blue-500/15 blur-3xl"
          />

          <div className="relative z-10 mx-auto max-w-xl space-y-4 text-center">
            <div className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-md sm:size-20">
              <Store className="size-8 text-[#25d366] sm:size-10" />
            </div>

            <div className="space-y-1">
              <span className="block text-[11px] font-bold uppercase tracking-widest text-[#25d366] sm:text-xs">
                Local 252 · Centro Comercial Unicentro Armenia
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-3xl">
                Espacio Good Cell Armenia
              </h2>
              <p className="mx-auto max-w-md text-xs leading-relaxed text-neutral-300 sm:text-sm">
                Audífonos Shokz de vitrina para que pruebes el sonido antes de
                comprar
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10px] font-medium text-neutral-300 sm:text-xs">
              {ETIQUETAS.map((e) => (
                <span
                  key={e}
                  className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 backdrop-blur-sm"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mb-14 max-w-7xl px-4 sm:mb-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {VALORES.map(({ Icono, titulo, texto }) => (
            <div
              key={titulo}
              className="space-y-3 rounded-3xl border border-app-subtle bg-app-surface-1 p-6 shadow-sm sm:p-8"
            >
              <div className="flex size-10 items-center justify-center rounded-xl border border-app-subtle bg-app-accent-subtle text-app-accent">
                <Icono className="size-5" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-app-primary">
                {titulo}
              </h3>
              <p className="text-sm leading-relaxed text-app-secondary">
                {texto}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-14 sm:mb-20">
        <TrustStrip />
      </div>

      <VisitUs />
    </div>
  );
}