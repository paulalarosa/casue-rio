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

/* 🔴 Não há filtro de "publicado" nestas consultas, e isso está certo: quem
   filtra rascunho é a própria Sanity. Medido em 18/09/2026, criando um
   rascunho e consultando sem token: a API pública devolve lista vazia.
   Rascunho mora sob o prefixo `drafts.` e só sai com chave.

   Eu tinha criado um campo `publicado` aqui, e ele era um segundo
   interruptor por cima do botão de publicar do painel. Saiu: elas clicariam
   em publicar e o texto não apareceria, sem nada na tela dizendo por quê. */
const CAMPOS = `
  "slug": slug.current,
  titulo,
  linha,
  data,
  autora,
  capa
`;

/* Hoje no fuso do Rio, em "AAAA-MM-DD".

   🔴 `toISOString().slice(0, 10)` daria a data em UTC, e o build roda em
   servidor americano com relógio em UTC. Depois das 21h no Rio o UTC já
   virou o dia seguinte: um texto agendado para amanhã entraria no ar três
   horas antes, na véspera. A comparação tem que ser no fuso de quem escreve,
   não no de quem hospeda. `en-CA` é o truque barato para "AAAA-MM-DD". */
function hojeNoRio() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
}

/* 🔴 `data <= $hoje` É O AGENDAMENTO, e ele mora aqui e no contador da
   rota, nos dois lugares e em nenhum outro.

   Publicar no painel com uma data à frente deixa o texto pronto e fora do
   ar. Uma tarefa diária no GitHub remonta o site de manhã, e nesse dia a
   condição passa a valer e o artigo aparece sozinho. A Sanity tem
   agendamento nativo, e ele é do plano Growth, a 15 dólares por pessoa por
   mês; isto faz o mesmo com o que já existe e custa zero.

   O preço é a granularidade: o texto entra na manhã do dia marcado, não às
   14h32. Para uma revista de imobiliária isso não é limitação, é o
   comportamento certo.

   🔴 E `lerArtigo` carrega a MESMA condição. Sem ela, o endereço direto de
   um texto agendado responderia enquanto a lista ainda o esconde, e link
   agendado costuma vazar justamente porque alguém o abriu para conferir. */
export async function listarArtigos(): Promise<Artigo[]> {
  return consultar<Artigo[]>(
    `*[_type == "artigo" && defined(slug.current) && data <= $hoje]
     | order(data desc) { ${CAMPOS} }`,
    { hoje: hojeNoRio() },
    [],
  );
}

export async function lerArtigo(slug: string): Promise<Artigo | null> {
  return consultar<Artigo | null>(
    `*[_type == "artigo" && slug.current == $slug && data <= $hoje][0]
     { ${CAMPOS}, corpo }`,
    { slug, hoje: hojeNoRio() },
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
