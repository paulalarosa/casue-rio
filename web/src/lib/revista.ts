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

/* 🔴 A comparação é feita em UTC nos DOIS lados, e é por isso que ela está
   certa. O painel grava a data e hora sempre em ISO com `Z`, e este `agora`
   também é ISO com `Z`: dois instantes absolutos, sem fuso no meio. A conta
   de fuso acontece só na hora de mostrar na tela, em `dataPorExtenso`.

   O erro que isso evita é o de guardar "18/09 09:00" sem fuso e o build,
   que roda em servidor americano, ler como 09:00 UTC, que é 6h no Rio. Data
   sem fuso não é data, é um texto que parece uma. */
function agora() {
  return new Date().toISOString();
}

/* 🔴 `data <= $agora` É O AGENDAMENTO, e ele mora aqui e no contador da
   rota, nos dois lugares e em nenhum outro.

   Publicar no painel com uma data à frente deixa o texto pronto e fora do
   ar. Uma tarefa no GitHub confere de quinze em quinze minutos se venceu a
   hora de alguém, e só então remonta o site. A Sanity tem agendamento
   nativo, e ele é do plano Growth, a 15 dólares por pessoa por mês; isto
   faz o mesmo com o que já existe e custa zero.

   O preço é a folga: o GitHub atrasa tarefa agendada quando está cheio, e
   o texto entra por volta da hora marcada, não no minuto. Para uma revista
   de imobiliária isso não é limitação.

   🔴 E `lerArtigo` carrega a MESMA condição. Sem ela, o endereço direto de
   um texto agendado responderia enquanto a lista ainda o esconde, e link
   agendado costuma vazar justamente porque alguém o abriu para conferir. */
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

/* Data por extenso, em português, no fuso do Rio.

   🔴 `timeZone` explícito, e não o do servidor. O valor guardado é um
   instante em UTC, e o build roda em máquina americana: sem esta linha, um
   artigo publicado às 22h de uma terça no Rio sairia datado de quarta.
   É o mesmo erro de antes, que morava num `T12:00:00` de gambiarra; agora
   ele está resolvido onde devia, no fuso.

   A HORA não aparece na tela de propósito. Ela serve para a máquina saber
   quando soltar o texto, não para o leitor: "18 de setembro de 2026" é a
   informação, "às 09:15" é ruído numa revista. */
export function dataPorExtenso(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
