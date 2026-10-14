import { MessageCircle, ShieldCheck, Truck } from "lucide-react";

const PUNTOS = [
  {
    Icono: Truck,
    titulo: "Envíos a todo Colombia",
    descripcion:
      "Despachos seguros a nivel nacional con cobertura a cualquier destino del país.",
  },
  {
    Icono: MessageCircle,
    titulo: "Atención personalizada por WhatsApp",
    descripcion:
      "Asesoría directa por WhatsApp con nuestros especialistas en Armenia, Quindío.",
  },
  {
    Icono: ShieldCheck,
    titulo: "Garantía indicada en cada producto",
    descripcion:
      "Términos claros y respaldo específico señalado individualmente en cada artículo.",
  },
];

export function TrustStrip() {
  return (
    <section
      aria-label="Puntos de confianza"
      className="border-y border-app-subtle bg-app-surface-1"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          {PUNTOS.map(({ Icono, titulo, descripcion }) => (
            <div
              key={titulo}
              className="flex items-start gap-3.5 rounded-xl border border-app-subtle bg-app-surface-2 p-3.5 sm:p-4"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-app-subtle bg-app-accent-subtle">
                <Icono className="size-5 shrink-0 text-app-accent" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-semibold tracking-tight text-app-primary sm:text-sm">
                  {titulo}
                </h3>
                <p className="mt-0.5 text-[11px] leading-relaxed text-app-secondary sm:text-xs">
                  {descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}