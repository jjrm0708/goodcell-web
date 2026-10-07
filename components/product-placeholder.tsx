import {
  Cable,
  Camera,
  Gamepad2,
  Headphones,
  House,
  Package,
  Smartphone,
  Speaker,
  type LucideIcon,
} from "lucide-react";

const ICONOS: Record<string, LucideIcon> = {
  parlantes: Speaker,
  audifonos: Headphones,
  apple: Smartphone,
  gaming: Gamepad2,
  fotografia: Camera,
  "hogar-inteligente": House,
  accesorios: Cable,
};

export function ProductPlaceholder({
  marca,
  categoriaSlug,
  className = "",
}: {
  marca: string | null;
  categoriaSlug?: string | null;
  className?: string;
}) {
  const Icono = (categoriaSlug && ICONOS[categoriaSlug]) || Package;

  return (
    <div
      className={`product-media-panel relative flex w-full items-center justify-center overflow-hidden rounded-xl ${className}`}
    >
      <div className="flex flex-col items-center gap-2 text-neutral-500 transition-transform duration-500 ease-out group-hover:scale-105">
        <Icono className="size-12 sm:size-14" strokeWidth={1.25} />
        {marca && (
          <span className="text-[10px] font-semibold uppercase tracking-widest sm:text-xs">
            {marca}
          </span>
        )}
      </div>
    </div>
  );
}