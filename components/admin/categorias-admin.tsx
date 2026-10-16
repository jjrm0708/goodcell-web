"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Edit2,
  FolderTree,
  Package,
  Plus,
  ShieldAlert,
} from "lucide-react";
import {
  CategoriaFormModal,
  type CategoriaAdmin,
  type DatosCategoria,
} from "@/components/admin/categoria-form-modal";
import { supabase } from "@/lib/supabase";

function crearSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

type Datos = {
  categorias: CategoriaAdmin[];
  conteo: Record<string, number>;
};

async function cargar(): Promise<Datos> {
  const [cat, prod] = await Promise.all([
    supabase
      .from("categorias")
      .select("id, nombre, slug, descripcion, activo, orden")
      .order("orden", { ascending: true }),
    supabase.from("productos").select("categoria_id"),
  ]);
  if (cat.error) throw new Error(cat.error.message);
  if (prod.error) throw new Error(prod.error.message);

  const conteo: Record<string, number> = {};
  for (const p of prod.data ?? []) {
    if (p.categoria_id) conteo[p.categoria_id] = (conteo[p.categoria_id] ?? 0) + 1;
  }
  return { categorias: (cat.data ?? []) as CategoriaAdmin[], conteo };
}

function EstadoActiva({ activo, corto }: { activo: boolean; corto?: boolean }) {
  return activo ? (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
      <span className="size-1.5 rounded-full bg-emerald-500" />
      Activa
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-500/20 bg-gray-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-gray-500">
      <span className="size-1.5 rounded-full bg-gray-400" />
      {corto ? "Inactiva" : "Inactiva (oculta)"}
    </span>
  );
}

export function CategoriasAdmin() {
  const [datos, setDatos] = useState<Datos | null>(null);
  const [fallo, setFallo] = useState(false);
  const [version, setVersion] = useState(0);
  const [modal, setModal] = useState<{ categoria: CategoriaAdmin | null } | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    cargar()
      .then((d) => {
        if (activo) {
          setDatos(d);
          setFallo(false);
        }
      })
      .catch(() => {
        if (activo) setFallo(true);
      });
    return () => {
      activo = false;
    };
  }, [version]);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 3000);
    return () => clearTimeout(t);
  }, [aviso]);

  if (fallo) {
    return (
      <p
        role="alert"
        className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-500"
      >
        No se pudieron cargar las categorías. Recarga la página e intenta de nuevo.
      </p>
    );
  }
  if (!datos) {
    return <p className="text-sm text-app-secondary">Cargando categorías…</p>;
  }

  const { categorias, conteo } = datos;
  const cantidad = (id: string) => conteo[id] ?? 0;

  const cerrarModal = () => {
    setModal(null);
    setErrorModal(null);
  };

  const guardar = async (valores: DatosCategoria) => {
    if (!modal || guardando) return;
    setGuardando(true);
    setErrorModal(null);

    const descripcion = valores.descripcion || null;
    let mensajeError: string | null = null;

    if (modal.categoria) {
      const { data, error } = await supabase
        .from("categorias")
        .update({
          nombre: valores.nombre,
          descripcion,
          activo: valores.activo,
        })
        .eq("id", modal.categoria.id)
        .select("id");
      if (error?.code === "23505") {
        mensajeError = "Ya existe una categoría con ese nombre.";
      } else if (error || !data || data.length === 0) {
        mensajeError = "No se pudo guardar. Intenta de nuevo.";
      }
    } else {
      const slug = crearSlug(valores.nombre);
      if (!slug) {
        mensajeError = "El nombre debe incluir letras o números.";
      } else {
        const siguiente = Math.max(0, ...categorias.map((c) => c.orden)) + 1;
        const { error } = await supabase.from("categorias").insert({
          nombre: valores.nombre,
          slug,
          descripcion,
          activo: valores.activo,
          orden: siguiente,
        });
        if (error?.code === "23505") {
          mensajeError = "Ya existe una categoría con ese nombre.";
        } else if (error) {
          mensajeError = "No se pudo guardar. Intenta de nuevo.";
        }
      }
    }

    setGuardando(false);
    if (mensajeError) {
      setErrorModal(mensajeError);
      return;
    }

    setAviso(
      modal.categoria
        ? `Categoría "${valores.nombre}" actualizada correctamente`
        : `Categoría "${valores.nombre}" creada con éxito`
    );
    cerrarModal();
    setVersion((v) => v + 1);
  };

  const mover = async (indice: number, direccion: -1 | 1) => {
    const a = categorias[indice];
    const b = categorias[indice + direccion];
    if (!a || !b) return;
    const [r1, r2] = await Promise.all([
      supabase.from("categorias").update({ orden: b.orden }).eq("id", a.id),
      supabase.from("categorias").update({ orden: a.orden }).eq("id", b.id),
    ]);
    if (r1.error || r2.error) {
      setAviso("No se pudo cambiar el orden. Intenta de nuevo.");
    }
    setVersion((v) => v + 1);
  };

  const flechas = (indice: number) => (
    <div className="flex flex-col">
      <button
        type="button"
        disabled={indice === 0}
        onClick={() => mover(indice, -1)}
        aria-label="Subir categoría"
        className="flex size-6 cursor-pointer items-center justify-center rounded text-app-secondary hover:text-app-primary disabled:opacity-25"
      >
        <ChevronUp className="size-4" />
      </button>
      <button
        type="button"
        disabled={indice === categorias.length - 1}
        onClick={() => mover(indice, 1)}
        aria-label="Bajar categoría"
        className="flex size-6 cursor-pointer items-center justify-center rounded text-app-secondary hover:text-app-primary disabled:opacity-25"
      >
        <ChevronDown className="size-4" />
      </button>
    </div>
  );

  const botonEditar = (c: CategoriaAdmin) => (
    <button
      type="button"
      onClick={() => setModal({ categoria: c })}
      className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-app-subtle bg-app-surface-2 px-3.5 py-1.5 text-xs font-semibold text-app-primary transition-all hover:border-app-accent hover:text-app-accent"
    >
      <Edit2 className="size-3.5" />
      <span>Editar</span>
    </button>
  );

  return (
    <div className="space-y-6">
      {aviso && (
        <div
          role="status"
          className="fixed right-5 top-20 z-50 flex items-center gap-2 rounded-xl border border-[#25d366] bg-app-surface-1 px-4 py-2.5 text-xs font-semibold text-app-primary shadow-xl animate-in fade-in slide-in-from-top-3"
        >
          <CheckCircle2 className="size-4 shrink-0 text-[#25d366]" />
          <span>{aviso}</span>
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-app-primary sm:text-2xl">
            Categorías
          </h2>
          <p className="mt-0.5 text-xs text-app-secondary">
            Estructura de navegación de la tienda y clasificación del catálogo
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ categoria: null })}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 self-start whitespace-nowrap rounded-xl bg-[#25d366] px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#20ba59] active:scale-[0.98] sm:self-auto sm:text-sm"
        >
          <Plus className="size-4 stroke-[3]" />
          <span>Nueva categoría</span>
        </button>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <ShieldAlert className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-bold tracking-tight text-app-primary">
            Aviso de integridad del catálogo
          </h4>
          <p className="mt-0.5 text-xs leading-relaxed text-app-secondary">
            Una categoría <span className="font-semibold text-app-primary">no se puede eliminar</span>{" "}
            mientras tenga productos asignados. Si no quieres mostrarla, apágala
            con el interruptor «Categoría activa». Las flechas cambian el orden
            en que aparece en la tienda.
          </p>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-app-subtle bg-app-surface-1 shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-app-subtle bg-app-surface-2 text-[11px] font-bold uppercase tracking-wider text-app-secondary">
                <th className="w-16 px-4 py-3.5 text-center">Orden</th>
                <th className="px-4 py-3.5">Nombre de categoría</th>
                <th className="px-4 py-3.5 text-center">Productos asignados</th>
                <th className="px-4 py-3.5 text-center">Estado</th>
                <th className="px-4 py-3.5">Integridad</th>
                <th className="w-28 px-6 py-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {categorias.map((c, i) => {
                const n = cantidad(c.id);
                return (
                  <tr key={c.id} className="transition-colors hover:bg-app-surface-2/60">
                    <td className="px-4 py-3">
                      <div className="flex justify-center">{flechas(i)}</div>
                    </td>
                    <td className="min-w-[220px] px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-app-subtle bg-app-accent-subtle text-app-accent">
                          <FolderTree className="size-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-app-primary">
                            {c.nombre}
                          </div>
                          {c.descripcion && (
                            <div className="mt-0.5 line-clamp-1 max-w-sm text-[11px] text-app-secondary">
                              {c.descripcion}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-app-subtle bg-app-surface-2 px-2.5 py-1 text-xs font-bold tabular-nums text-app-primary">
                        <Package className="size-3.5 text-app-secondary" />
                        <span>
                          {n} {n === 1 ? "producto" : "productos"}
                        </span>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-center">
                      <EstadoActiva activo={c.activo} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs">
                      {n > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                          <AlertTriangle className="size-3.5 shrink-0" />
                          <span>
                            No eliminable ({n} {n === 1 ? "vinculado" : "vinculados"})
                          </span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-app-secondary">
                          Sin productos vinculados
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      {botonEditar(c)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {categorias.map((c, i) => {
          const n = cantidad(c.id);
          return (
            <div
              key={c.id}
              className="space-y-3 rounded-2xl border border-app-subtle bg-app-surface-1 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {flechas(i)}
                  <div>
                    <h4 className="text-sm font-bold text-app-primary">{c.nombre}</h4>
                    <span className="text-[11px] tabular-nums text-app-secondary">
                      {n} {n === 1 ? "producto asignado" : "productos asignados"}
                    </span>
                  </div>
                </div>
                <EstadoActiva activo={c.activo} corto />
              </div>

              {c.descripcion && (
                <p className="text-xs leading-relaxed text-app-secondary">
                  {c.descripcion}
                </p>
              )}

              <div className="flex items-center justify-between border-t border-app-subtle pt-2">
                {n > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="size-3 shrink-0" />
                    <span>
                      No eliminable ({n} {n === 1 ? "vinculado" : "vinculados"})
                    </span>
                  </span>
                ) : (
                  <span className="text-[10px] text-app-secondary">
                    Sin productos vinculados
                  </span>
                )}
                {botonEditar(c)}
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <CategoriaFormModal
          key={modal.categoria?.id ?? "nueva"}
          categoria={modal.categoria}
          cantidadProductos={modal.categoria ? cantidad(modal.categoria.id) : 0}
          guardando={guardando}
          error={errorModal}
          onClose={cerrarModal}
          onSave={guardar}
        />
      )}
    </div>
  );
}