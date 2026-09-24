import type { PortableTextBlock } from "@portabletext/react";
import type { Image } from "sanity";
import { consultar } from "@/lib/sanity";

export type Artigo = {
  slug: string;
  titulo: string;
  linha: string;
  data: string;
  capa?: (Image & { alt?: string }) | null;
  corpo?: PortableTextBlock[];
};

const CAMPOS = `
  "slug": slug.current,
  titulo,
  linha,
  data,
  capa
`;

function agora() {
  return new Date().toISOString();
}

export async function listarArtigos(): Promise<Artigo[]> {
  return consultar<Artigo[]>(
    `*[_type == "artigo" && defined(slug.current) && data <= $agora]
     | order(data desc) { ${CAMPOS} }`,
    { agora: agora() },
    [],
  );
}

export async function lerArtigo(slug: string): Promise<Artigo | null> {
  return consultar<Artigo | null>(
    `*[_type == "artigo" && slug.current == $slug && data <= $agora][0]
     { ${CAMPOS}, corpo }`,
    { slug, agora: agora() },
    null,
  );
}

export function dataPorExtenso(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
