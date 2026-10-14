"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push("/");
      }}
      className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-app-secondary transition-colors hover:text-app-primary"
    >
      <ArrowLeft className="size-3.5" />
      <span>Regresar a la página anterior</span>
    </button>
  );
}