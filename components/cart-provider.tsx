"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [cargado, setCargado] = useState(false);
  const [abierto, setAbierto] = useState(false);

  // Al abrir la página, recupera el carrito guardado en el navegador
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (guardado) setItems(JSON.parse(guardado));
    } catch {
      // si el navegador bloquea el almacenamiento, empieza vacío
    }
    setCargado(true);
  }, []);

  // Cada cambio se guarda (solo después de haber cargado lo anterior)
  useEffect(() => {
    if (!cargado) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(items));
    } catch {
      // se ignora
    }
  }, [items, cargado]);

  const agregar = useCallback((producto: Producto, cantidad = 1) => {
    if (producto.stock <= 0) return;
    setItems((prev) => {
      const existente = prev.find((i) => i.producto.id === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.producto.id === producto.id
            ? {
                ...i,
                cantidad: Math.min(i.cantidad + cantidad, producto.stock),
              }
            : i
        );
      }
      return [
        ...prev,
        { producto, cantidad: Math.min(cantidad, producto.stock) },
      ];
    });
  }, []);

  const cambiarCantidad = useCallback((productoId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.producto.id !== productoId) return i;
          const nueva = Math.min(i.cantidad + delta, i.producto.stock);
          return { ...i, cantidad: nueva };
        })
        .filter((i) => i.cantidad > 0)
    );
  }, []);

  const quitar = useCallback((productoId: string) => {
    setItems((prev) => prev.filter((i) => i.producto.id !== productoId));
  }, []);

  const vaciar = useCallback(() => setItems([]), []);
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