import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/legal-document";
import { DOCUMENTOS_LEGALES } from "@/lib/legal";

export const dynamicParams = false;

type Props = { params: Promise<{ doc: string }> };

function buscar(slug: string) {
  return Object.values(DOCUMENTOS_LEGALES).find((d) => d.slug === slug);
}

export function generateStaticParams() {
  return Object.values(DOCUMENTOS_LEGALES).map((d) => ({ doc: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { doc } = await params;
  const documento = buscar(doc);
  if (!documento) return {};
  return {
    title: `${documento.tituloCorto} | Good Cell`,
    description: documento.descripcion,
  };
}

export default async function PaginaLegal({ params }: Props) {
  const { doc } = await params;
  const documento = buscar(doc);
  if (!documento) notFound();
  return <LegalDocument documento={documento} />;
}