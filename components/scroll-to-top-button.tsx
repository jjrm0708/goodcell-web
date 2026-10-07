"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

export function ScrollToTopButton() {
  const pathname = usePathname();
  const isProductPage =
    pathname.startsWith("/producto/") || pathname.startsWith("/pedido-enviado");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isProductPage || !visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Volver arriba"
      className="fixed bottom-4 left-4 z-40 flex size-11 min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-app-subtle border-app-hover bg-app-surface-2 text-app-secondary shadow-lg backdrop-blur-md transition-all duration-200 hover:text-app-primary active:scale-95"
    >
      <ArrowUp className="size-4" />
    </button>
  );
}