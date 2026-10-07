import { supabase } from "@/lib/supabase";
import type { Categoria, Producto } from "@/lib/types";

export type ProductoConCategoria = Producto & {
  categorias: Pick<Categoria, "nombre" | "slug"> | null;
};

export type CategoriaBasica = Pick<Categoria, "id" | "nombre" | "slug">;

export async function obtenerProductos(): Promise<ProductoConCategoria[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*, categorias(nombre, slug)")
    .eq("activo", true)
    .order("destacado", { ascending: false })
    .order("creado_en", { ascending: false });

  if (error) {
    throw new Error(`No se pudieron cargar los productos: ${error.message}`);
  }
  return (data ?? []) as unknown as ProductoConCategoria[];
}

export async function obtenerCategorias(): Promise<CategoriaBasica[]> {
  const { data, error } = await supabase
    .from("categorias")
    .select("id, nombre, slug")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) {
    throw new Error(`No se pudieron cargar las categorías: ${error.message}`);
  }
  return data ?? [];
}