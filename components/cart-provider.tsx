"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { Producto } from "@/lib/types";

export type ItemCarrito = { producto: Producto; cantidad: number };

type CarritoContexto = {
  items: ItemCarrito[];
  totalUnidades: number;
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
  agregar: (producto: Producto, cantidad?: number) => void;
  cambiarCantidad: (productoId: string, delta: number) => void;
  quitar: (productoId: string) => void;
  vaciar: () => void;
};

const CLAVE = "goodcell_carrito";
const Contexto = createContext<CarritoContexto | null>(null);

// Almacén del carrito: vive en el navegador (localStorage) y avisa a React cuando cambia
const oyentes = new Set<() => void>();
let cache: string | null = null;

function leer(): string {
  if (cache === null) {
    try {
      cache = localStorage.getItem(CLAVE) ?? "[]";
    } catch {
      cache = "[]";
    }
  }
  return cache;
}

function leerItems(): ItemCarrito[] {
  try {
    return JSON.parse(leer()) as ItemCarrito[];
  } catch {
    return [];
  }
}

function escribir(items: ItemCarrito[]) {
  cache = JSON.stringify(items);
  try {
    localStorage.setItem(CLAVE, cache);
  } catch {
    // si el navegador bloquea el almacenamiento, el carrito sigue en memoria
  }
  oyentes.forEach((avisar) => avisar());
}

function suscribir(avisar: () => void) {
  oyentes.add(avisar);
  const alCambiarOtraPestana = () => {
    cache = null;
    avisar();
  };
  window.addEventListener("storage", alCambiarOtraPestana);
  return () => {
    oyentes.delete(avisar);
    window.removeEventListener("storage", alCambiarOtraPestana);
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const crudo = useSyncExternalStore(suscribir, leer, () => "[]");
  const [abierto, setAbierto] = useState(false);

  const items = useMemo<ItemCarrito[]>(() => {
    try {
      return JSON.parse(crudo) as ItemCarrito[];
    } catch {
      return [];
    }
  }, [crudo]);

  const agregar = useCallback((producto: Producto, cantidad = 1) => {
    if (producto.stock <= 0) return;
    const actuales = leerItems();
    const existente = actuales.find((i) => i.producto.id === producto.id);
    if (existente) {
      escribir(
        actuales.map((i) =>
          i.producto.id === producto.id
            ? { ...i, cantidad: Math.min(i.cantidad + cantidad, producto.stock) }
            : i
        )
      );
    } else {
      escribir([
        ...actuales,
        { producto, cantidad: Math.min(cantidad, producto.stock) },
      ]);
    }
  }, []);

  const cambiarCantidad = useCallback((productoId: string, delta: number) => {
    escribir(
      leerItems()
        .map((i) =>
          i.producto.id === productoId
            ? { ...i, cantidad: Math.min(i.cantidad + delta, i.producto.stock) }
            : i
        )
        .filter((i) => i.cantidad > 0)
    );
  }, []);

  const quitar = useCallback((productoId: string) => {
    escribir(leerItems().filter((i) => i.producto.id !== productoId));
  }, []);

  const vaciar = useCallback(() => escribir([]), []);
  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);

  const valor = useMemo(
    () => ({
      items,
      totalUnidades: items.reduce((suma, i) => suma + i.cantidad, 0),
      abierto,
      abrir,
      cerrar,
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
    }),
    [items, abierto, abrir, cerrar, agregar, cambiarCantidad, quitar, vaciar]
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useCarrito(): CarritoContexto {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de <CartProvider>");
  }
  return contexto;
}