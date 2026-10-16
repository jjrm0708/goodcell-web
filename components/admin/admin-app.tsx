"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
  Layers,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/lib/supabase";

type Estado =
  | { fase: "cargando" }
  | { fase: "sin-sesion" }
  | { fase: "admin"; nombre: string | null; correo: string };

// Una sesión solo vale si el usuario está en la tabla de administradores
async function resolverEstado(session: Session | null): Promise<Estado> {
  if (!session) return { fase: "sin-sesion" };
  const { data } = await supabase
    .from("administradores")
    .select("nombre")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (!data) {
    await supabase.auth.signOut();
    return { fase: "sin-sesion" };
  }
  return {
    fase: "admin",
    nombre: data.nombre,
    correo: session.user.email ?? "",
  };
}

const campo =
  "h-11 w-full rounded-xl border border-app-subtle bg-app-surface-2 text-xs text-app-primary transition-all placeholder:text-app-secondary focus:border-app-accent focus:outline-none sm:text-sm";

function InicioSesion() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [avisoOlvido, setAvisoOlvido] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    setError(null);
    setEnviando(true);
    const { error: fallo } = await supabase.auth.signInWithPassword({
      email: correo.trim(),
      password: clave,
    });
    if (fallo) setError("Correo o contraseña incorrectos.");
    setEnviando(false);
  };

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-app-primary px-4 py-8 text-app-primary">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-app-accent-subtle blur-3xl sm:w-96"
      />

      <div className="absolute left-5 top-5 z-20">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-app-subtle border-app-hover bg-app-surface-1 px-3.5 py-1.5 text-xs font-medium text-app-secondary shadow-sm transition-all hover:text-app-primary"
        >
          <ArrowLeft className="size-4 shrink-0" />
          <span>Volver a la tienda</span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        <div className="rounded-3xl border border-app-subtle bg-app-surface-1 p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <Image
              src="/logo-good-cell-claro.png"
              alt="Good Cell"
              width={500}
              height={580}
              priority
              className="mb-3 h-20 w-auto object-contain dark:hidden"
            />
            <Image
              src="/logo-good-cell-oscuro.png"
              alt="Good Cell"
              width={500}
              height={580}
              priority
              className="mb-3 hidden h-20 w-auto object-contain dark:block"
            />
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-app-subtle bg-app-surface-2 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-app-secondary">
              <ShieldCheck className="size-3.5 text-app-accent" />
              <span>Acceso restringido</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-app-primary sm:text-2xl">
              Panel de administración
            </h1>
            <p className="mt-1 text-xs text-app-secondary">
              Gestión operativa, inventario y pedidos de Good Cell
            </p>
          </div>

          <form onSubmit={entrar} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="admin-correo"
                className="block text-xs font-semibold text-app-secondary"
              >
                Correo electrónico
              </label>
              <div className="relative flex items-center">
                <Mail className="pointer-events-none absolute left-3.5 size-4 text-app-secondary" />
                <input
                  id="admin-correo"
                  type="email"
                  autoComplete="username"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className={`${campo} pl-10 pr-3.5`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="admin-clave"
                className="block text-xs font-semibold text-app-secondary"
              >
                Contraseña
              </label>
              <div className="relative flex items-center">
                <Lock className="pointer-events-none absolute left-3.5 size-4 text-app-secondary" />
                <input
                  id="admin-clave"
                  type={verClave ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  className={`${campo} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setVerClave((v) => !v)}
                  aria-label={verClave ? "Ocultar contraseña" : "Ver contraseña"}
                  className="absolute right-3 cursor-pointer p-1 text-app-secondary hover:text-app-primary"
                >
                  {verClave ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-500"
              >
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="mt-2 flex h-11 min-h-11 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-app-accent text-xs font-semibold text-app-accent-contrast shadow-md transition-all active:scale-[0.99] disabled:cursor-wait disabled:opacity-70 sm:text-sm"
            >
              {enviando ? (
                <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <>
                  <span>Iniciar sesión</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setAvisoOlvido((v) => !v)}
              className="cursor-pointer text-xs text-app-secondary underline underline-offset-4 transition-colors hover:text-app-primary"
            >
              ¿Olvidaste tu contraseña?
            </button>
            {avisoOlvido && (
              <div className="mt-3 rounded-xl border border-app-subtle bg-app-surface-2 p-3 text-[11px] leading-relaxed text-app-secondary">
                Las cuentas administrativas son de uso exclusivo del personal de
                Good Cell. Si olvidaste tu clave o necesitas restablecer tu
                acceso, comunícate con la dirección de tienda en Unicentro
                Armenia.
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-app-secondary">
          Good Cell Armenia · Centro Comercial Unicentro Local 252
        </p>
      </div>
    </div>
  );
}

type Conteos = {
  productos: number | null;
  categorias: number | null;
  pedidos: number | null;
};

async function contarTodo(): Promise<Conteos> {
  const contar = async (tabla: string) => {
    const { count } = await supabase
      .from(tabla)
      .select("id", { count: "exact", head: true });
    return count;
  };
  const [productos, categorias, pedidos] = await Promise.all([
    contar("productos"),
    contar("categorias"),
    contar("pedidos"),
  ]);
  return { productos, categorias, pedidos };
}

const NAV = [
  { href: "/admin", etiqueta: "Resumen", Icono: LayoutDashboard, conteo: null },
  { href: "/admin/productos", etiqueta: "Productos", Icono: Package, conteo: "productos" },
  { href: "/admin/categorias", etiqueta: "Categorías", Icono: Layers, conteo: "categorias" },
  { href: "/admin/pedidos", etiqueta: "Pedidos", Icono: ShoppingBag, conteo: "pedidos" },
  { href: "/admin/configuracion", etiqueta: "Configuración", Icono: Settings, conteo: null },
] as const;

function Panel({
  nombre,
  correo,
  children,
}: {
  nombre: string | null;
  correo: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [conteos, setConteos] = useState<Conteos>({
    productos: null,
    categorias: null,
    pedidos: null,
  });

  // Los números del menú se actualizan cada vez que cambias de sección
  useEffect(() => {
    let activo = true;
    contarTodo()
      .then((c) => {
        if (activo) setConteos(c);
      })
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, [pathname]);

  const estaActivo = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  const actual = NAV.find((n) => estaActivo(n.href)) ?? NAV[0];

  return (
    <div className="min-h-dvh bg-app-primary text-app-primary md:flex">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-app-subtle bg-app-surface-1 md:flex lg:w-64">
        <div className="flex h-16 items-center gap-2.5 border-b border-app-subtle px-5">
          <Image
            src="/logo-good-cell-icono.png"
            alt=""
            width={96}
            height={96}
            className="h-8 w-auto shrink-0 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none tracking-tight text-app-primary">
              Good Cell
            </span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-app-secondary">
              Admin Workspace
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-app-secondary">
            Navegación
          </div>
          {NAV.map(({ href, etiqueta, Icono, conteo }) => {
            const activo = estaActivo(href);
            const numero = conteo ? conteos[conteo] : null;
            return (
              <Link
                key={href}
                href={href}
                aria-current={activo ? "page" : undefined}
                className={`flex min-h-10 w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  activo
                    ? "bg-app-accent text-app-accent-contrast shadow-sm"
                    : "text-app-secondary hover:bg-app-surface-2 hover:text-app-primary"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icono className="size-4 shrink-0" />
                  <span>{etiqueta}</span>
                </span>
                {numero !== null && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                      activo
                        ? "bg-black/20 text-white"
                        : "border border-app-subtle bg-app-surface-2 text-app-secondary"
                    }`}
                  >
                    {numero}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-app-subtle p-3">
          <Link
            href="/"
            className="flex min-h-10 w-full items-center justify-between rounded-xl border border-app-subtle px-3 py-2 text-xs font-medium text-app-secondary transition-colors hover:bg-app-surface-2 hover:text-app-primary"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="size-3.5 text-app-accent" />
              <span>Ver tienda pública</span>
            </span>
            <ChevronRight className="size-3.5 opacity-50" />
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-8 md:pl-60 lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-app-subtle bg-app-surface-1/95 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <Image
              src="/logo-good-cell-icono.png"
              alt=""
              width={96}
              height={96}
              className="h-7 w-auto shrink-0 object-contain md:hidden"
            />
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold tracking-tight text-app-primary sm:text-base">
                {actual.etiqueta}
              </h1>
              <p className="truncate text-[10px] text-app-secondary sm:text-xs">
                Panel administrativo · Unicentro Armenia
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <div className="hidden flex-col text-right sm:flex">
              <span className="text-xs font-bold leading-tight text-app-primary">
                {nombre ?? correo}
              </span>
              <span className="text-[10px] font-semibold leading-tight text-app-accent">
                Administrador
              </span>
            </div>
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              title="Cerrar sesión del panel"
              className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-app-subtle bg-app-surface-2 px-3 py-1.5 text-xs font-semibold text-app-secondary transition-colors hover:border-red-500/40 hover:text-red-500"
            >
              <LogOut className="size-3.5 shrink-0" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </header>

        <main className="w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <nav
        aria-label="Navegación del panel"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-app-subtle bg-app-surface-1/95 backdrop-blur-xl md:hidden"
      >
        {NAV.map(({ href, etiqueta, Icono }) => {
          const activo = estaActivo(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={activo ? "page" : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors ${
                activo ? "text-app-accent" : "text-app-secondary"
              }`}
            >
              <Icono className="size-5" />
              <span>{etiqueta}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function AdminApp({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<Estado>({ fase: "cargando" });

  useEffect(() => {
    let activo = true;
    const { data } = supabase.auth.onAuthStateChange((evento, session) => {
      if (evento === "TOKEN_REFRESHED") return;
      // Se difiere para no bloquear al cliente de Supabase dentro de este aviso
      setTimeout(() => {
        resolverEstado(session).then((nuevo) => {
          if (activo) setEstado(nuevo);
        });
      }, 0);
    });
    return () => {
      activo = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (estado.fase === "cargando") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-app-primary">
        <p className="text-sm text-app-secondary">Cargando…</p>
      </div>
    );
  }
  if (estado.fase === "sin-sesion") return <InicioSesion />;
  return (
    <Panel nombre={estado.nombre} correo={estado.correo}>
      {children}
    </Panel>
  );
}