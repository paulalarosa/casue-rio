import { createClient } from "next-sanity";
import criarUrl from "@sanity/image-url";
import type { Image } from "sanity";

/* A ligação com o painel.

   🔴 TUDO aqui é opcional, e é o ponto do arquivo. Enquanto o projeto do
   Sanity não existir, `PROJETO` é indefinido, o cliente é `null` e toda
   consulta devolve lista vazia. O site continua compilando, continua
   publicando e a revista continua dizendo que o primeiro texto não saiu.

   Isso importa porque a alternativa é o padrão: um `projectId` inventado
   como reserva. Ele faz o build passar, o site subir, e as consultas
   falharem em produção contra um projeto que não é de ninguém. Vazio falha
   no lugar certo, que é aqui, e falha em silêncio de propósito, porque a
   ausência de artigo já é um estado previsto da página.

   🔴 A chave pública NÃO é segredo. Ela só lê, e só o que estiver publicado.
   Por isso ela pode viver numa variável `NEXT_PUBLIC_`, que vai parar dentro
   do JavaScript que o navegador baixa. O que nunca entra aqui é o token de
   escrita: quem escreve é o painel, e o painel é da Sanity. */
const PROJETO = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const CONJUNTO = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/* Data fixa, e não a de hoje. A API do Sanity tem versões por data: fixar a
   data é o que garante que o site não muda de comportamento sozinho no dia
   em que eles publicarem uma versão nova. */
const VERSAO = "2026-09-01";

export const cliente = PROJETO
  ? createClient({
      projectId: PROJETO,
      dataset: CONJUNTO,
      apiVersion: VERSAO,
      /* 🔴 `useCdn` DESLIGADO, e o comentário que estava aqui defendia o
         contrário. Ele dizia que o cache era "exatamente o que se quer",
         porque publicar dispara a republicação. O raciocínio ignorava que
         as duas coisas correm ao mesmo tempo, e a corrida foi medida, não
         imaginada, no primeiro artigo de teste:

           12:39:29  artigo gravado no painel
           12:39:33  webhook acorda o GitHub
           12:40:11  build começa
           12:40:12  preparar-revista.mjs pergunta a `api.sanity.io`  → 1
           12:40:26  generateStaticParams pergunta a `apicdn.sanity.io` → 0

           Error: Page "/revista/[slug]" returned an empty array from
           "generateStaticParams()". With "output: export", at least one
           route must be generated.

         O contador liga a rota do artigo pela porta sem cache, o site monta
         a rota pela porta com cache, e as duas discordam por alguns
         segundos. A publicação inteira cai, no exato momento em que alguém
         acabou de apertar Publish, que é o pior momento possível: quem
         publicou vê o site igual e não tem como saber por quê.

         O cache existe para aguentar visita, e este site não manda visita
         nenhuma para a Sanity: ele lê meia dúzia de vezes, no build, uma vez
         por publicação. Não há o que economizar aqui, e o que se ganha é a
         garantia de que as duas portas contam a mesma história. */
      useCdn: false,
    })
  : null;

export const temPainel = cliente !== null;

/* Consulta com rede de proteção. Se o projeto não existe, devolve o padrão
   sem tentar a rede; se a rede falhar durante o build, devolve o padrão e
   avisa no registro em vez de derrubar a publicação inteira.

   🔴 Falhar o build por causa de uma consulta é o pior dos mundos num site
   estático: a Sanity fora do ar por cinco minutos deixaria o site sem
   publicar uma correção urgente de preço. */
export async function consultar<T>(
  query: string,
  params: Record<string, unknown> = {},
  padrao: T,
): Promise<T> {
  if (!cliente) return padrao;
  try {
    return (await cliente.fetch<T>(query, params)) ?? padrao;
  } catch (erro) {
    console.warn("[sanity] consulta falhou, seguindo com o padrão:", erro);
    return padrao;
  }
}

/* Endereço de imagem, com corte respeitando o ponto focal que elas marcaram
   no painel. Sem o construtor, a foto sairia no centro geométrico, e o
   centro de uma foto de sala costuma ser o chão. */
const construtor = PROJETO ? criarUrl({ projectId: PROJETO, dataset: CONJUNTO }) : null;

export function imagem(fonte: Image, largura: number, altura?: number) {
  if (!construtor) return null;
  let u = construtor.image(fonte).width(largura).auto("format").fit("crop");
  if (altura) u = u.height(altura);
  return u.url();
}
