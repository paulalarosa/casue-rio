import type { PortableTextBlock } from "@portabletext/react";
import type { Image } from "sanity";
import { consultar } from "@/lib/sanity";

/* A revista, do lado do site.

   🔴 Esta é a ÚNICA porta entre o site e o painel para o conteúdo da
   revista. Nenhuma página escreve consulta própria, e isso é regra: quando a
   fonte mudar, e ela já mudou uma vez neste projeto, muda aqui e nada mais.
   O caminho da marca foi assim, e a página de contato também. */

export type Artigo = {
  slug: string;
  titulo: string;
  linha: string;
  data: string;
  autora: string;
  capa?: (Image & { alt?: string }) | null;
  corpo?: PortableTextBlock[];
};

/* 🔴 `publicado == true` entra na consulta e não no filtro depois, e a
   diferença não é de gosto: o rascunho nem sai do servidor. Filtrar depois
   de receber significa que o texto não terminado viaja pela rede e fica
   dentro do HTML gerado, onde qualquer pessoa lê. Rascunho de imobiliária
   pode ter preço que ainda vai mudar. */
const CAMPOS = `
  "slug": slug.current,
  titulo,
  linha,
  data,
  autora,
  capa
`;

export async function listarArtigos(): Promise<Artigo[]> {
  return consultar<Artigo[]>(
    `*[_type == "artigo" && publicado == true && defined(slug.current)]
     | order(data desc) { ${CAMPOS} }`,
    {},
    [],
  );
}

export async function lerArtigo(slug: string): Promise<Artigo | null> {
  return consultar<Artigo | null>(
    `*[_type == "artigo" && publicado == true && slug.current == $slug][0]
     { ${CAMPOS}, corpo }`,
    { slug },
    null,
  );
}

/* Data por extenso, em português, sem fuso atrapalhando.

   🔴 O `T12:00:00` não é enfeite. A data vem como "2026-09-17", e
   `new Date("2026-09-17")` é lida como meia-noite UTC: no Rio, que está três
   horas atrás, isso vira 21h do dia 16, e o artigo publicado hoje aparece
   com a data de ontem. Meio-dia é a hora que sobrevive a qualquer fuso. */
export function dataPorExtenso(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
