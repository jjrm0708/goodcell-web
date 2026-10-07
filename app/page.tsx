import { obtenerCategorias, obtenerProductos } from "@/lib/catalogo";
import { formatCOP } from "@/lib/utils";
import { precioEfectivo, textoGarantia } from "@/lib/precios";

export default async function Home() {
  const [categorias, productos] = await Promise.all([
    obtenerCategorias(),
    obtenerProductos(),
  ]);

  return (
    <div className="p-8 pt-24">
      <h1 className="mb-2 text-2xl font-bold">Prueba de catálogo</h1>
      <p className="mb-4 text-app-secondary">
        Categorías: {categorias.map((c) => c.nombre).join(" · ")}
      </p>
      <ul>
        {productos.map((p) => (
          <li key={p.id}>
            {p.categorias?.nombre} - {p.nombre} - {formatCOP(precioEfectivo(p))}{" "}
            - Garantía: {textoGarantia(p.garantia_meses)}
          </li>
        ))}
      </ul>
    </div>
  );
}