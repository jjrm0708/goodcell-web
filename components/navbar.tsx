"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, ShoppingBag, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCarrito } from "@/components/cart-provider";

const ENLACES = [
  { href: "/", texto: "Catálogo" },
  { href: "/sobre-nosotros", texto: "Sobre nosotros" },
  { href: "/contacto", texto: "Contacto" },
];

const botonRedondo =
  "flex size-11 min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-app-subtle border-app-hover bg-app-surface-1 text-app-primary transition-all duration-200 active:scale-95";

function CampoBusqueda({
  valor,
  onChange,
  placeholder,
  autoFocus,
  redondeo,
}: {
  valor: string;
  onChange: (valor: string) => void;
  placeholder: string;
  autoFocus?: boolean;
  redondeo: string;
}) {
  return (
    <div className="relative flex w-full items-center">
      <Search className="pointer-events-none absolute left-3.5 size-4 text-app-secondary" />
      <input
        type="text"
        value={valor}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full border border-app-subtle bg-app-surface-1 pl-10 pr-9 text-sm text-app-primary transition-all placeholder:text-app-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${redondeo}`}
      />
      {valor && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 cursor-pointer rounded-full p-1 text-app-secondary hover:text-app-primary"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

function NavbarContenido() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { totalUnidades, abrir } = useCarrito();

  const qUrl = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(qUrl);
  const [busquedaMovil, setBusquedaMovil] = useState(false);

  // Si la URL cambia (por ejemplo "Limpiar filtros"), el campo la sigue
  useEffect(() => {
    setQuery(qUrl);
  }, [qUrl]);

  const buscar = (valor: string) => {
    setQuery(valor);
    const params = new URLSearchParams(searchParams.toString());
    if (valor.trim()) params.set("q", valor);
    else params.delete("q");
    const texto = params.toString();
    const url = texto ? `/?${texto}` : "/";
    if (pathname === "/") window.history.replaceState(null, "", url);
    else router.push(url);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-app-subtle bg-app-navbar backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Good Cell - Inicio"
          className="group flex min-h-12 shrink-0 items-center gap-2.5 py-1"
        >
          <Image
            src="/logo-good-cell-icono.png"
            alt=""
            width={96}
            height={96}
            priority
            className="h-12 w-auto shrink-0 object-contain"
          />
          <span className="text-xl font-bold tracking-tight text-app-primary transition-colors group-hover:text-app-accent sm:text-2xl">
            Good Cell
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-xs font-semibold text-app-secondary lg:flex">
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="transition-colors hover:text-app-primary"
            >
              {e.texto}
            </Link>
          ))}
        </nav>

        <div className="mx-3 hidden max-w-sm flex-1 md:flex lg:mx-6 lg:max-w-md">
          <CampoBusqueda
            valor={query}
            onChange={buscar}
            placeholder="Buscar audífonos, Apple, fotografía..."
            redondeo="rounded-full"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setBusquedaMovil((v) => !v)}
            aria-label={busquedaMovil ? "Cerrar buscador" : "Abrir buscador"}
            className={`${botonRedondo} md:hidden`}
          >
            {busquedaMovil ? <X className="size-4" /> : <Search className="size-4" />}
          </button>

          <ThemeToggle />

          <button
            type="button"
            onClick={abrir}
            aria-label={`Carrito de compras con ${totalUnidades} artículos`}
            className={`${botonRedondo} relative px-3`}
          >
            <ShoppingBag className="size-4" />
            {totalUnidades > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-app-accent px-1.5 text-[11px] font-bold text-app-accent-contrast shadow-md">
                {totalUnidades > 9 ? "9+" : totalUnidades}
              </span>
            )}
          </button>
        </div>
      </div>

      {busquedaMovil && (
        <div className="border-t border-app-subtle bg-app-surface-1 px-4 py-3 animate-in slide-in-from-top-2 duration-200 md:hidden">
          <CampoBusqueda
            valor={query}
            onChange={buscar}
            placeholder="Buscar productos o marcas..."
            autoFocus
            redondeo="rounded-xl"
          />
          <div className="mt-2 flex items-center justify-around border-t border-app-subtle pt-2.5 text-xs font-semibold text-app-secondary">
            {ENLACES.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                onClick={() => setBusquedaMovil(false)}
                className="px-2 py-1 hover:text-app-primary"
              >
                {e.texto}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-app-subtle bg-app-navbar" />
      }
    >
      <NavbarContenido />
    </Suspense>
  );
}