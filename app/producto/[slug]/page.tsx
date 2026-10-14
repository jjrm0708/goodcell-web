import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { obtenerProductoPorSlug, obtenerProductos } from "@/lib/catalogo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const producto = await obtenerProductoPorSlug(slug);
  if (!producto) return {};
  return {
    title: `${producto.nombre} | Good Cell`,
    description:
      producto.eslogan ??
      `${producto.nombre} en Good Cell, Unicentro Armenia. Producto original con garantía.`,
  };
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const producto = await obtenerProductoPorSlug(slug);
  if (!producto) notFound();

  const todos = await obtenerProductos();
  const misma = (p: typeof producto) =>
    Number(p.categorias?.slug === producto.categorias?.slug);
  const relacionados = todos
    .filter((p) => p.id !== producto.id)
    .sort((a, b) => misma(b) - misma(a))
    .slice(0, 4);

  return (
    <ProductDetail
      key={producto.id}
      producto={producto}
      relacionados={relacionados}
    />
  );
}