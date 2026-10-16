"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Check, FolderTree, X } from "lucide-react";

export type CategoriaAdmin = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  activo: boolean;
  orden: number;
};

export type DatosCategoria = {
  nombre: string;
  descripcion: string;
  activo: boolean;
};

const campo =
  "w-full rounded-xl border border-app-subtle bg-app-surface-2 text-xs text-app-primary transition-all focus:border-app-accent focus:outline-none sm:text-sm";

export function CategoriaFormModal({
  categoria,
  cantidadProductos,
  guardando,
  error,
  onClose,
  onSave,
}: {
  categoria: CategoriaAdmin | null;
  cantidadProductos: number;
  guardando: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (datos: DatosCategoria) => void;
}) {
  const [nombre, setNombre] = useState(categoria?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(categoria?.descripcion ?? "");
  const [activo, setActivo] = useState(categoria?.activo ?? true);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  useEffect(() => {
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", alTeclear);
    return () => {
      document.body.style.overflow = previo;
      window.removeEventListener("keydown", alTeclear);
    };
  }, [onClose]);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorLocal("El nombre de la categoría es obligatorio.");
      return;
    }
    setErrorLocal(null);
    onSave({ nombre: nombre.trim(), descripcion: descripcion.trim(), activo });
  };

  const mensaje = errorLocal ?? error;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={categoria ? "Editar categoría" : "Nueva categoría"}
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative flex min-h-dvh items-center justify-center px-0 py-0 sm:px-4 sm:py-8">
        <div className="relative z-10 flex min-h-dvh w-full flex-col overflow-hidden border-app-subtle bg-app-primary shadow-2xl sm:min-h-0 sm:max-w-xl sm:rounded-3xl sm:border">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-app-subtle bg-app-surface-1 px-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-app-subtle bg-app-accent-subtle text-app-accent">
                <FolderTree className="size-4" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight text-app-primary sm:text-lg">
                  {categoria
                    ? `Editar categoría: ${categoria.nombre}`
                    : "Nueva categoría"}
                </h2>
                <p className="text-[11px] text-app-secondary">
                  Organización del catálogo · Good Cell Unicentro Armenia
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-app-subtle bg-app-surface-2 text-app-secondary transition-colors hover:text-app-primary"
            >
              <X className="size-4" />
            </button>
          </div>

          <form onSubmit={enviar} className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
            {mensaje && (
              <p
                role="alert"
                className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-500"
              >
                <AlertCircle className="size-4 shrink-0" />
                <span>{mensaje}</span>
              </p>
            )}

            <div className="space-y-4 rounded-2xl border border-app-subtle bg-app-surface-1 p-4 shadow-sm sm:p-5">
              <div className="space-y-1">
                <label
                  htmlFor="cat-nombre"
                  className="block text-xs font-semibold text-app-primary"
                >
                  Nombre de la categoría *
                </label>
                <input
                  id="cat-nombre"
                  type="text"
                  value={nombre}
                  maxLength={60}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Parlantes, Audífonos, Apple..."
                  className={`${campo} h-10 px-3`}
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="cat-descripcion"
                  className="block text-xs font-semibold text-app-primary"
                >
                  Descripción corta (opcional)
                </label>
                <textarea
                  id="cat-descripcion"
                  rows={2}
                  value={descripcion}
                  maxLength={200}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Texto descriptivo para destacar la categoría en la tienda..."
                  className={`${campo} resize-none p-3`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-app-subtle bg-app-surface-1 p-4 shadow-sm sm:p-5">
              <div>
                <span className="block text-xs font-bold text-app-primary">
                  Categoría activa
                </span>
                <span className="mt-0.5 block max-w-sm text-[11px] text-app-secondary">
                  Si está apagada, desaparece de la barra de categorías de la
                  tienda
                  {cantidadProductos > 0
                    ? `, aunque sus ${cantidadProductos} ${cantidadProductos === 1 ? "producto siga" : "productos sigan"} existiendo.`
                    : "."}
                </span>
              </div>

              <label className="relative ml-4 inline-flex shrink-0 cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#25d366] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus-visible:ring-2 peer-focus-visible:ring-ring" />
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-app-subtle pt-4">
              <button
                type="button"
                onClick={onClose}
                className="min-h-11 cursor-pointer rounded-xl border border-app-subtle border-app-hover bg-app-surface-1 px-5 py-2 text-xs font-semibold text-app-secondary transition-all hover:text-app-primary sm:text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#25d366] px-6 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[#20ba59] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 sm:text-sm"
              >
                <Check className="size-4 stroke-[2.5]" />
                <span>{guardando ? "Guardando…" : "Guardar cambios"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}