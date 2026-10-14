import Link from "next/link";
import {
  ArrowLeft,
  Building,
  Calendar,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { DOCUMENTOS_LEGALES, type DocumentoLegal } from "@/lib/legal";
import { SITE, whatsappUrl } from "@/lib/site";

export function LegalDocument({ documento }: { documento: DocumentoLegal }) {
  const Icono = documento.Icono;
  const documentos = Object.values(DOCUMENTOS_LEGALES);

  return (
    <div className="w-full bg-app-primary pt-16 text-app-primary">
      <div className="sticky top-16 z-20 border-b border-app-subtle bg-app-navbar backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 text-xs sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-semibold text-app-secondary transition-colors hover:text-app-primary"
          >
            <ArrowLeft className="size-3.5" />
            <span>Volver a la tienda</span>
          </Link>
          <div className="flex items-center gap-1.5 text-app-secondary">
            <span>Marco legal</span>
            <ChevronRight className="size-3.5 opacity-50" />
            <span className="max-w-[200px] truncate font-semibold text-app-primary sm:max-w-none">
              {documento.tituloCorto}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8">
        <nav
          aria-label="Documentos legales"
          className="no-scrollbar mb-8 flex items-center gap-2.5 overflow-x-auto border-b border-app-subtle px-1 pb-5 pt-3"
        >
          {documentos.map((d) => {
            const Ic = d.Icono;
            const activo = d.tipo === documento.tipo;
            return (
              <Link
                key={d.tipo}
                href={`/${d.slug}`}
                aria-current={activo ? "page" : undefined}
                className={`flex min-h-[42px] shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  activo
                    ? "bg-app-accent text-app-accent-contrast shadow-sm"
                    : "border border-app-subtle border-app-hover bg-app-surface-1 text-app-secondary hover:bg-app-surface-2 hover:text-app-primary"
                }`}
              >
                <Ic className="size-4 shrink-0" />
                <span>{d.tituloCorto}</span>
              </Link>
            );
          })}
        </nav>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <aside className="hidden space-y-6 lg:sticky lg:top-32 lg:col-span-4 lg:block">
            <div className="space-y-5 rounded-3xl border border-app-subtle bg-app-surface-1 p-6 shadow-sm">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-app-secondary">
                  Índice de contenido
                </div>
                <h3 className="mt-1 text-base font-bold text-app-primary">
                  {documento.tituloCorto}
                </h3>
              </div>

              <nav className="space-y-1">
                {documento.secciones.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-app-secondary transition-colors hover:bg-app-surface-2 hover:text-app-primary"
                  >
                    <span className="truncate pr-2">{s.titulo}</span>
                    <ChevronRight className="size-3.5 shrink-0 opacity-40 transition-opacity group-hover:opacity-100" />
                  </a>
                ))}
              </nav>

              <div className="space-y-2 border-t border-app-subtle pt-4 text-xs text-app-secondary">
                <div className="flex items-center gap-2 font-semibold text-app-primary">
                  <Building className="size-4 text-app-accent" />
                  <span>Sede Unicentro Armenia</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {SITE.direccion.calle} · Soporte técnico, devoluciones y
                  garantías presenciales.
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-3xl border border-app-subtle bg-app-surface-1 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-app-primary">
                <MessageCircle className="size-4 text-[#25d366]" />
                <span>¿Dudas sobre esta política?</span>
              </div>
              <p className="text-xs leading-relaxed text-app-secondary">
                Nuestro equipo de atención al cliente está disponible en horario
                de centro comercial para asesorarte:
              </p>
              <a
                href={whatsappUrl(
                  "Hola Good Cell, tengo una consulta sobre sus políticas legales y garantías."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl bg-[#25d366] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#20ba59]"
              >
                <span>Chatear al {SITE.telefonoVisible}</span>
              </a>
            </div>
          </aside>

          <article className="space-y-8 rounded-3xl border border-app-subtle bg-app-surface-1 p-6 shadow-sm sm:p-10 lg:col-span-8">
            <header className="space-y-3 border-b border-app-subtle pb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-app-subtle bg-app-surface-2 px-3 py-1 text-xs font-semibold text-app-primary">
                <Icono className="size-4 text-app-accent" />
                <span>Documento oficial Good Cell</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-app-primary sm:text-3xl lg:text-4xl">
                {documento.titulo}
              </h1>
              <p className="text-sm leading-relaxed text-app-secondary sm:text-base">
                {documento.descripcion}
              </p>
              <div className="flex items-center gap-2 pt-2 text-xs text-app-secondary">
                <Calendar className="size-3.5 text-app-accent" />
                <span>
                  Última actualización: <strong>{documento.actualizado}</strong>
                </span>
              </div>
            </header>

            <div className="space-y-2 rounded-2xl border border-app-subtle bg-app-surface-2 p-4 lg:hidden">
              <div className="text-xs font-bold uppercase tracking-wider text-app-primary">
                Secciones de este documento
              </div>
              <div className="grid grid-cols-1 gap-1.5 pt-1 sm:grid-cols-2">
                {documento.secciones.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="truncate rounded-lg px-2 py-1.5 text-xs font-medium text-app-secondary hover:bg-app-surface-1 hover:text-app-primary"
                  >
                    {s.titulo}
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-10 text-sm leading-relaxed text-app-primary sm:text-base">
              {documento.secciones.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-28 space-y-3 pt-2">
                  <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-app-primary sm:text-xl">
                    <span className="h-5 w-1.5 shrink-0 rounded-full bg-app-accent" />
                    <span>{s.titulo}</span>
                  </h2>
                  <div className="border-l border-app-subtle pl-3.5 text-sm leading-relaxed text-app-secondary">
                    {s.contenido}
                  </div>
                </section>
              ))}
            </div>

            <footer className="flex flex-col items-start justify-between gap-4 border-t border-app-subtle pt-8 text-xs text-app-secondary sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold text-app-primary">
                  Good Cell · Armenia, Quindío
                </p>
                <p>
                  Estatuto del Consumidor (Ley 1480/2011) y Protección de Datos
                  Personales (Ley 1581/2012)
                </p>
              </div>
              <Link
                href="/"
                className="rounded-xl border border-app-subtle border-app-hover bg-app-surface-2 px-4 py-2 font-semibold text-app-primary transition-colors"
              >
                Volver al catálogo
              </Link>
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
}