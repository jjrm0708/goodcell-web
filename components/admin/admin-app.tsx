"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { LogOut, ShieldCheck, Store } from "lucide-react";
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
  "h-11 w-full rounded-xl border border-app-subtle bg-app-surface-2 px-3 text-sm text-app-primary transition-all focus:border-app-accent focus:outline-none";

function Pantalla({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-app-primary px-4 py-10">
      {children}
    </div>
  );
}

function InicioSesion() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
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
    <Pantalla>
      <div className="w-full max-w-sm space-y-6 rounded-3xl border border-app-subtle bg-app-surface-1 p-6 shadow-xl sm:p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image
            src="/logo-good-cell-icono.png"
            alt="Good Cell"
            width={96}
            height={96}
            className="h-16 w-auto object-contain"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-app-primary">
              Panel administrativo
            </h1>
            <p className="mt-1 text-xs text-app-secondary">
              Acceso solo para el equipo de Good Cell
            </p>
          </div>
        </div>

        <form onSubmit={entrar} className="space-y-4">
          <div>
            <label
              htmlFor="admin-correo"
              className="mb-1 block text-xs font-medium text-app-secondary"
            >
              Correo
            </label>
            <input
              id="admin-correo"
              type="email"
              autoComplete="username"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className={campo}
            />
          </div>
          <div>
            <label
              htmlFor="admin-clave"
              className="mb-1 block text-xs font-medium text-app-secondary"
            >
              Contraseña
            </label>
            <input
              id="admin-clave"
              type="password"
              autoComplete="current-password"
              required
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className={campo}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-xs font-medium text-red-500"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-app-accent text-sm font-bold text-app-accent-contrast shadow-md transition-all active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          >
            {enviando ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <div className="flex items-center justify-between border-t border-app-subtle pt-4">
          <Link
            href="/"
            className="text-xs font-medium text-app-secondary transition-colors hover:text-app-primary"
          >
            ← Volver a la tienda
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </Pantalla>
  );
}

function PanelBase({ nombre, correo }: { nombre: string | null; correo: string }) {
  return (
    <div className="min-h-dvh bg-app-primary text-app-primary">
      <header className="border-b border-app-subtle bg-app-surface-1">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-good-cell-icono.png"
              alt=""
              width={96}
              height={96}
              className="h-10 w-auto object-contain"
            />
            <div className="leading-tight">
              <div className="text-sm font-bold">Good Cell</div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-app-secondary">
                Admin workspace
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden min-h-11 items-center gap-2 rounded-full border border-app-subtle border-app-hover bg-app-surface-2 px-4 text-xs font-medium text-app-primary sm:inline-flex"
            >
              <Store className="size-4" />
              <span>Ver tienda</span>
            </Link>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-app-subtle border-app-hover bg-app-surface-2 px-4 text-xs font-medium text-app-primary"
            >
              <LogOut className="size-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-app-subtle bg-app-surface-2 px-3 py-1 text-xs font-semibold text-app-accent">
            <ShieldCheck className="size-3.5" />
            <span>Sesión de administrador</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Hola, {nombre ?? "administrador"}
          </h1>
          <p className="text-sm text-app-secondary">
            Sesión iniciada con {correo}. Aquí irán el resumen, los productos,
            las categorías y los pedidos.
          </p>
        </div>
      </main>
    </div>
  );
}

export function AdminApp() {
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
      <Pantalla>
        <p className="text-sm text-app-secondary">Cargando…</p>
      </Pantalla>
    );
  }
  if (estado.fase === "sin-sesion") return <InicioSesion />;
  return <PanelBase nombre={estado.nombre} correo={estado.correo} />;
}